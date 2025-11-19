import { collections } from '~/server/utils/db';

/**
 * Get wallet data for a user
 * GET /api/wallet/:uid
 */
export default defineEventHandler(async (event) => {
  try {
    const uid = getRouterParam(event, 'uid');

    if (!uid) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      });
    }

    // Get wallet document
    const walletDoc = await collections.walletData().doc(uid).get();

    if (!walletDoc.exists) {
      // Return default wallet if doesn't exist
      return {
        success: true,
        wallet: {
          uid,
          balance: 0,
          currency: 'GBP',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    }

    return {
      success: true,
      wallet: walletDoc.data()
    };
  } catch (error: any) {
    console.error('Error fetching wallet:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch wallet'
    });
  }
});

