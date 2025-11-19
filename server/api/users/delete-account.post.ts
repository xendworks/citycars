import { defineEventHandler, readBody, createError } from 'h3';
import { getAuth } from 'firebase-admin/auth';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { uid } = body;

    if (!uid) {
      throw createError({
        statusCode: 400,
        message: 'User ID is required'
      });
    }

    console.log('[API] Deleting Firebase Auth user:', uid);

    // Delete the user from Firebase Authentication
    const auth = getAuth();
    await auth.deleteUser(uid);

    console.log('[API] ✅ Successfully deleted Firebase Auth user:', uid);

    return {
      success: true,
      message: 'User account deleted successfully'
    };
  } catch (error: any) {
    console.error('[API] ❌ Error deleting user account:', error);
    
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete user account'
    });
  }
});

