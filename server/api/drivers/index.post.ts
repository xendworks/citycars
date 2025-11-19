import { collections } from '~/server/utils/db';
import { Timestamp } from 'firebase-admin/firestore';

interface CreateDriverRequest {
  userId?: string;
  licenseNumber: string;
  licenseExpiry: string;
  vehicleRegistration: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleType: 'saloon' | 'estate' | 'mpv' | 'wheelchair';
  vehicleYear?: number;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<CreateDriverRequest>(event);

    // Validate required fields
    if (!body.licenseNumber || !body.licenseExpiry || !body.vehicleRegistration || !body.vehicleType) {
      throw createError({
        statusCode: 400,
        message: 'License number, expiry, vehicle registration, and type are required'
      });
    }

    // Check for duplicate license number
    const existingDriver = await collections.drivers()
      .where('licenseNumber', '==', body.licenseNumber)
      .limit(1)
      .get();

    if (!existingDriver.empty) {
      throw createError({
        statusCode: 409,
        message: 'Driver with this license number already exists'
      });
    }

    // Create driver document
    const driverData = {
      userId: body.userId || null,
      licenseNumber: body.licenseNumber,
      licenseExpiry: Timestamp.fromDate(new Date(body.licenseExpiry)),
      vehicleRegistration: body.vehicleRegistration,
      vehicleMake: body.vehicleMake || null,
      vehicleModel: body.vehicleModel || null,
      vehicleType: body.vehicleType,
      vehicleYear: body.vehicleYear || null,
      isAvailable: true,
      isActive: true,
      rating: 0,
      totalTrips: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await collections.drivers().add(driverData);
    const snapshot = await docRef.get();

    return {
      success: true,
      data: {
        id: snapshot.id,
        ...snapshot.data()
      }
    };
  } catch (error: any) {
    console.error('Create driver error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create driver'
    });
  }
});
