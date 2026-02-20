import { collections } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const snapshot = await collections.offers().get();
    const offers = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        validUntil: data.validUntil?.toDate?.() || data.validUntil
      };
    });
    
    // Sort in memory if needed, or use orderBy in query if index exists
    return offers.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  } catch (error: any) {
    console.error('[API] Error fetching offers:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch offers'
    });
  }
});
