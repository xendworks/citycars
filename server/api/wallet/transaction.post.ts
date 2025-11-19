import { collections, runTransaction } from '~/server/utils/db';

/**
 * Create a wallet transaction
 * POST /api/wallet/transaction
 * Body: { uid, amount, type: 'credit' | 'debit', description, metadata }
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { uid, amount, type, description, metadata } = body;

    if (!uid || !amount || !type) {
      throw createError({
        statusCode: 400,
        statusMessage: 'UID, amount, and type are required'
      });
    }

    if (type !== 'credit' && type !== 'debit') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Type must be either "credit" or "debit"'
      });
    }

    // Use Firestore transaction to ensure consistency
    const result = await runTransaction(async (transaction) => {
      const walletRef = collections.walletData().doc(uid);
      const walletDoc = await transaction.get(walletRef);

      let currentBalance = 0;
      if (walletDoc.exists) {
        currentBalance = walletDoc.data()?.balance || 0;
      }

      // Calculate new balance
      const amountValue = parseFloat(amount);
      const newBalance = type === 'credit' 
        ? currentBalance + amountValue 
        : currentBalance - amountValue;

      if (newBalance < 0) {
        throw new Error('Insufficient wallet balance');
      }

      // Update or create wallet
      const walletData = {
        uid,
        balance: newBalance,
        currency: 'GBP',
        updatedAt: new Date().toISOString()
      };

      if (walletDoc.exists) {
        transaction.update(walletRef, walletData);
      } else {
        transaction.set(walletRef, {
          ...walletData,
          createdAt: new Date().toISOString()
        });
      }

      // Create transaction record
      const transactionData = {
        uid,
        amount: amountValue,
        type,
        description: description || '',
        metadata: metadata || {},
        balanceBefore: currentBalance,
        balanceAfter: newBalance,
        createdAt: new Date().toISOString()
      };

      const transactionRef = collections.walletTransactions().doc();
      transaction.set(transactionRef, transactionData);

      return {
        transaction: { id: transactionRef.id, ...transactionData },
        newBalance
      };
    });

    return {
      success: true,
      ...result
    };
  } catch (error: any) {
    console.error('Error creating wallet transaction:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create transaction'
    });
  }
});

