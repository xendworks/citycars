import { collections } from '~/server/utils/db';
import { Timestamp } from 'firebase-admin/firestore';

interface CreateUserRequest {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<CreateUserRequest>(event);
    const { email, phone, firstName, lastName, role = 'customer' } = body;

    if (!email || !phone || !firstName || !lastName) {
      throw createError({
        statusCode: 400,
        message: 'Email, phone, first name, and last name are required'
      });
    }

    // Check for duplicate email
    const existingUser = await collections.users()
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingUser.empty) {
      throw createError({
        statusCode: 409,
        message: 'User with this email already exists'
      });
    }

    // Create user document
    const userData = {
      email,
      phone,
      firstName,
      lastName,
      role,
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await collections.users().add(userData);
    const snapshot = await docRef.get();

    return {
      success: true,
      data: {
        id: snapshot.id,
        ...snapshot.data()
      }
    };
  } catch (error: any) {
    console.error('Create user error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create user'
    });
  }
});
