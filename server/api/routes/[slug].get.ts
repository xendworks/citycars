import { collections } from '~/server/utils/db';
import type { TaxiRoute } from '~/types/route';

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug');

    if (!slug) {
      throw createError({
        statusCode: 400,
        message: 'Route slug is required'
      });
    }

    // Query by slug
    const snapshot = await collections.routes()
      .where('slug', '==', slug)
      .where('isActive', '==', true)
      .limit(1)
      .get();

    if (snapshot.empty) {
      throw createError({
        statusCode: 404,
        message: 'Route not found'
      });
    }

    const doc = snapshot.docs[0];
    const route: TaxiRoute = {
      id: doc.id,
      ...doc.data()
    } as TaxiRoute;

    // Increment view count
    await collections.routes().doc(doc.id).update({
      views: (route.views || 0) + 1,
      updatedAt: new Date().toISOString()
    });

    // Fetch nearby routes if available
    let nearbyRoutes: TaxiRoute[] = [];
    if (route.nearbyRoutes && route.nearbyRoutes.length > 0) {
      const nearbySnapshot = await collections.routes()
        .where('slug', 'in', route.nearbyRoutes.slice(0, 10))
        .where('isActive', '==', true)
        .get();
      
      nearbySnapshot.forEach((nearbyDoc) => {
        nearbyRoutes.push({
          id: nearbyDoc.id,
          ...nearbyDoc.data()
        } as TaxiRoute);
      });
    }

    return {
      success: true,
      route,
      nearbyRoutes
    };
  } catch (error: any) {
    console.error('[API] Error fetching route:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch route'
    });
  }
});

