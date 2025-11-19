import { collections } from '~/server/utils/db';
import type { Query } from 'firebase-admin/firestore';

export default defineEventHandler(async (event) => {
  try {
    // TODO: Add authentication/authorization check for admin
    const queryParams = getQuery(event);
    const page = parseInt(queryParams.page as string) || 1;
    const limit = parseInt(queryParams.limit as string) || 20;
    const status = queryParams.status as string;
    const userId = queryParams.userId as string;
    const driverId = queryParams.driverId as string;

    let query: Query = collections.bookings();

    // Apply filters
    if (status) {
      query = query.where('status', '==', status);
    }
    if (userId) {
      query = query.where('userId', '==', userId);
    }
    if (driverId) {
      query = query.where('driverId', '==', driverId);
    }

    // Order by creation date
    query = query.orderBy('createdAt', 'desc');

    // Get total count (before pagination)
    const countSnapshot = await query.count().get();
    const total = countSnapshot.data().count;

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.limit(limit).offset(offset);

    const snapshot = await query.get();
    const bookings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error: any) {
    console.error('Get bookings error:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch bookings'
    });
  }
});
