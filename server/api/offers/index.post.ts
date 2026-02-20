import { collections } from '~/server/utils/db';
import { Timestamp } from 'firebase-admin/firestore';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id, ...offerData } = body;


    const payload: any = {
      title: offerData.title,
      description: offerData.description,
      code: offerData.code?.toUpperCase(),
      discountPercent: Number(offerData.discountPercent),
      isActive: Boolean(offerData.isActive),
      updatedAt: Timestamp.now(),
      updatedBy: offerData.updatedBy || 'system'
    };

    if (offerData.validUntil) {
      const date = new Date(offerData.validUntil);
      if (!isNaN(date.getTime())) {
        payload.validUntil = Timestamp.fromDate(date);
      }
    }

    if (id) {
      // Update existing offer
      await collections.offers().doc(id).update(payload);
      return { success: true, id };
    } else {
      // Create new offer
      payload.createdAt = Timestamp.now();
      payload.createdBy = offerData.createdBy || 'system';
      payload.usedCount = 0;

      // Use promo code as document ID for uniqueness
      const docId = payload.code;
      await collections.offers().doc(docId).set(payload);
      
      return { success: true, id: docId };
    }
  } catch (error: any) {
    console.error('[API] ❌ Error saving offer:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to save offer'
    });
  }
});
