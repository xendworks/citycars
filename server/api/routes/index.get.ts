import { collections } from '~/server/utils/db';
import type { TaxiRoute } from '~/types/route';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const limit = parseInt(query.limit as string) || 50;
    const sortBy = (query.sortBy as string) || 'popularity';
    const from = query.from as string;
    const to = query.to as string;

    let routesQuery = collections.routes().where('isActive', '==', true);

    // Filter by location if provided
    if (from) {
      routesQuery = routesQuery.where('fromLocation.slug', '==', from);
    }
    if (to) {
      routesQuery = routesQuery.where('toLocation.slug', '==', to);
    }

    // Sort based on criteria
    switch (sortBy) {
      case 'popularity':
        routesQuery = routesQuery.orderBy('popularityScore', 'desc');
        break;
      case 'price':
        routesQuery = routesQuery.orderBy('averagePrice', 'asc');
        break;
      case 'distance':
        routesQuery = routesQuery.orderBy('distance', 'asc');
        break;
    }

    routesQuery = routesQuery.limit(limit);

    const snapshot = await routesQuery.get();
    const routes: TaxiRoute[] = [];

    snapshot.forEach((doc) => {
      routes.push({
        id: doc.id,
        ...doc.data()
      } as TaxiRoute);
    });

    return {
      success: true,
      count: routes.length,
      routes
    };
  } catch (error: any) {
    console.error('[API] Error fetching routes:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch routes'
    });
  }
});

