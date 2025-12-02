import { collections } from '~/server/utils/db';
import type { TaxiRoute } from '~/types/route';

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug');
    const body = await readBody<Partial<TaxiRoute>>(event);

    if (!slug) {
      throw createError({
        statusCode: 400,
        message: 'Route slug is required'
      });
    }

    // Find route by slug
    const snapshot = await collections.routes()
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (snapshot.empty) {
      throw createError({
        statusCode: 404,
        message: 'Route not found'
      });
    }

    const doc = snapshot.docs[0];
    const updateData: any = {
      ...body,
      updatedAt: new Date().toISOString()
    };

    // Remove id if present
    delete updateData.id;

    await collections.routes().doc(doc.id).update(updateData);

    const updatedDoc = await collections.routes().doc(doc.id).get();

    console.log('[API] ✅ Route updated successfully:', slug);

    return {
      success: true,
      route: {
        id: updatedDoc.id,
        ...updatedDoc.data()
      }
    };
  } catch (error: any) {
    console.error('[API] ❌ Update route error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update route'
    });
  }
});

