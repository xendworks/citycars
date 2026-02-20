import { collections } from '~/server/utils/db';
import { Timestamp } from 'firebase-admin/firestore';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id, isActive } = body;

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Offer ID is required'
      });
    }

    await collections.offers().doc(id).update({
      isActive: Boolean(isActive),
      updatedAt: Timestamp.now()
    });

    return { success: true };
  } catch (error: any) {
    console.error('[API] ❌ Error toggling offer status:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to toggle offer status'
    });
  }
});
