import { collections, generateBookingReference } from '~/server/utils/db';
import { Timestamp } from 'firebase-admin/firestore';

interface CreateBookingRequest {
  // User info
  userId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  alternatePhone?: string;
  
  // Journey details
  pickupAddress: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  pickupDateTime: string;
  dropoffAddress: string;
  dropoffLatitude?: number;
  dropoffLongitude?: number;
  flightNumber?: string;
  
  // Booking details
  cabType?: string;
  vehicleType?: 'saloon' | 'estate' | 'mpv' | 'wheelchair';
  passengers?: number;
  luggage?: number;
  
  // Distance/duration (optional)
  distanceMiles?: number;
  estimatedDurationMinutes?: number;
  
  // Extras
  meetAndGreet?: boolean;
  meetAndGreetFee?: number;
  childSeat?: boolean;
  childSeatFee?: number;
  
  // Payment
  paymentMethod?: string;
  baseFare: number;
  surchargeAmount?: number;
  distanceCost?: number;
  peakHourSurcharge?: number;
  trafficSurcharge?: number;
  vehicleSurcharge?: number;
  totalFare: number;
  
  // Additional
  specialInstructions?: string;
  bookingStatus?: string;
  bookingSource?: string;
  quoteId?: string;
  createdAt?: any;
  updatedAt?: any;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<CreateBookingRequest>(event);

    console.log('[API] Received booking request:', body);

    // Validate required fields
    if (!body.pickupAddress || !body.dropoffAddress || !body.pickupDateTime) {
      throw createError({
        statusCode: 400,
        message: 'Pickup address, dropoff address, and pickup datetime are required'
      });
    }

    // Generate booking reference
    const bookingReference = generateBookingReference();

    // Create booking document with ALL fields from the form
    const bookingData = {
      // Booking reference
      bookingReference,
      
      // User info
      userId: body.userId || null,
      userName: body.userName || null,
      userEmail: body.userEmail || null,
      userPhone: body.userPhone || null,
      alternatePhone: body.alternatePhone || null,
      
      // Journey details
      pickupAddress: body.pickupAddress,
      pickupLatitude: body.pickupLatitude || null,
      pickupLongitude: body.pickupLongitude || null,
      pickupDateTime: Timestamp.fromDate(new Date(body.pickupDateTime)),
      dropoffAddress: body.dropoffAddress,
      dropoffLatitude: body.dropoffLatitude || null,
      dropoffLongitude: body.dropoffLongitude || null,
      flightNumber: body.flightNumber || null,
      
      // Booking details
      vehicleType: body.cabType || body.vehicleType || 'saloon',
      passengers: body.passengers || 1,
      luggage: body.luggage || 0,
      
      // Distance/duration
      distanceMiles: body.distanceMiles || null,
      estimatedDurationMinutes: body.estimatedDurationMinutes || null,
      
      // Extras
      meetAndGreet: body.meetAndGreet || false,
      meetAndGreetFee: body.meetAndGreetFee || 0,
      childSeat: body.childSeat || false,
      childSeatFee: body.childSeatFee || 0,
      
      // Payment
      paymentMethod: body.paymentMethod || 'card',
      baseFare: body.baseFare || 0,
      surchargeAmount: body.surchargeAmount || 0,
      distanceCost: body.distanceCost || 0,
      peakHourSurcharge: body.peakHourSurcharge || 0,
      trafficSurcharge: body.trafficSurcharge || 0,
      vehicleSurcharge: body.vehicleSurcharge || 0,
      totalFare: body.totalFare || body.baseFare || 0,
      
      // Additional
      specialInstructions: body.specialInstructions || null,
      
      // Status
      status: body.bookingStatus || 'pending',
      paymentStatus: 'pending',
      bookingSource: body.bookingSource || 'web',
      quoteId: body.quoteId || null,
      
      // Driver assignment
      driverId: null,
      
      // Timestamps
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      completedAt: null
    };

    console.log('[API] Saving booking to Firestore:', bookingData);

    const docRef = await collections.bookings().add(bookingData);
    const snapshot = await docRef.get();

    console.log('[API] ✅ Booking saved successfully with ID:', snapshot.id);

    return {
      success: true,
      id: snapshot.id,
      bookingReference,
      data: {
        id: snapshot.id,
        ...snapshot.data()
      }
    };
  } catch (error: any) {
    console.error('[API] ❌ Create booking error:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to create booking'
    });
  }
});
