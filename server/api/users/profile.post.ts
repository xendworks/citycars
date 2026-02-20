import { collections } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    const { uid, email, displayName, phoneNumber, photoURL, preferredPickupLocations, preferredDropoffLocations } = body;

    if (!uid || !email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'UID and email are required'
      });
    }

    // Get user reference
    const userRef = collections.users().doc(uid);
    const userDoc = await userRef.get();

    const userData = {
      uid,
      email,
      displayName: displayName || null,
      phoneNumber: phoneNumber || null,
      photoURL: photoURL || null,
      preferredPickupLocations: preferredPickupLocations || [],
      preferredDropoffLocations: preferredDropoffLocations || [],
      updatedAt: new Date().toISOString()
    };

    if (!userDoc.exists) {
      // Create new user document
      await userRef.set({
        ...userData,
        createdAt: new Date().toISOString()
      });
    } else {
      // Update existing user document
      await userRef.update(userData);
    }

    return {
      success: true,
      user: userData
    };
  } catch (error: any) {
    console.error('Error creating/updating user profile:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create/update user profile'
    });
  }
});

