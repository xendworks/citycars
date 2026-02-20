import { collections } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Offer ID is required'
      });
    }

    await collections.offers().doc(id).delete();

    return { success: true };
  } catch (error: any) {
    console.error('[API] ❌ Error deleting offer:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to delete offer'
    });
  }
});
