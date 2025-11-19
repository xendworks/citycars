import { collections } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { uid } = query;

    if (!uid) {
      throw createError({
        statusCode: 400,
        statusMessage: 'UID is required'
      });
    }

    // Get user document
    const userDoc = await collections.users().doc(uid as string).get();

    if (!userDoc.exists) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      });
    }

    return {
      success: true,
      user: userDoc.data()
    };
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch user profile'
    });
  }
});

