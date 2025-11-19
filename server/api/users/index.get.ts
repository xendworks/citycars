import { collections } from '~/server/utils/db';
import type { Query } from 'firebase-admin/firestore';

export default defineEventHandler(async (event) => {
  try {
    // TODO: Add authentication/authorization check for admin
    const queryParams = getQuery(event);
    const page = parseInt(queryParams.page as string) || 1;
    const limit = parseInt(queryParams.limit as string) || 20;
    const role = queryParams.role as string;
    const isActive = queryParams.isActive as string;

    let query: Query = collections.users();

    // Apply filters
    if (role) {
      query = query.where('role', '==', role);
    }
    if (isActive !== undefined) {
      query = query.where('isActive', '==', isActive === 'true');
    }

    // Order by creation date
    query = query.orderBy('createdAt', 'desc');

    // Get total count
    const countSnapshot = await query.count().get();
    const total = countSnapshot.data().count;

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.limit(limit).offset(offset);

    const snapshot = await query.get();
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error: any) {
    console.error('Get users error:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch users'
    });
  }
});
