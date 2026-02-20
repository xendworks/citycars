import { collections } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const snapshot = await collections.offers()
      .where('isActive', '==', true)
      .get();
      
    const now = new Date();
    
    return snapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
          validUntil: data.validUntil?.toDate?.() || data.validUntil
        };
      })
      .filter((offer: any) => {
        if (!offer.validUntil) return true;
        const expiry = new Date(offer.validUntil);
        return expiry > now;
      });
  } catch (error: any) {
    console.error('[API] Error fetching active offers:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch active offers'
    });
  }
});
