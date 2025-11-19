import { collections } from '~/server/utils/db';

/**
 * Get wallet transaction history for a user
 * GET /api/wallet/transactions?uid=xxx&limit=10&offset=0
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { uid, limit = '10', offset = '0' } = query;

    if (!uid) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      });
    }

    const limitNum = parseInt(limit as string) || 10;
    const offsetNum = parseInt(offset as string) || 0;

    // Get transactions for this user
    const snapshot = await collections.walletTransactions()
      .where('uid', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(limitNum)
      .offset(offsetNum)
      .get();

    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      transactions,
      total: snapshot.size
    };
  } catch (error: any) {
    console.error('Error fetching wallet transactions:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch transactions'
    });
  }
});

