import { collections } from '~/server/utils/db';
import { Timestamp } from 'firebase-admin/firestore';
import type { TaxiRoute } from '~/types/route';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<Partial<TaxiRoute>>(event);

    // Validate required fields
    if (!body.fromLocation || !body.toLocation) {
      throw createError({
        statusCode: 400,
        message: 'From and to locations are required'
      });
    }

    // Generate slug if not provided
    const slug = body.slug || `${body.fromLocation.slug}-to-${body.toLocation.slug}`;

    // Check if route already exists
    const existingRoute = await collections.routes()
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (!existingRoute.empty) {
      throw createError({
        statusCode: 409,
        message: 'Route with this slug already exists'
      });
    }

    // Generate default SEO data if not provided
    const seoData = body.seoData || {
      title: `${body.fromLocation.name} to ${body.toLocation.name} Taxi | CityCars Gatwick`,
      metaDescription: `Book a reliable taxi from ${body.fromLocation.name} to ${body.toLocation.name}. Professional drivers, competitive prices, 24/7 availability. Instant booking!`,
      h1Title: `${body.fromLocation.name} to ${body.toLocation.name} Taxi Service`,
      keywords: [
        `${body.fromLocation.name} to ${body.toLocation.name} taxi`,
        `${body.fromLocation.slug} ${body.toLocation.slug} transfer`,
        'airport taxi',
        'private hire'
      ]
    };

    // Create route document
    const routeData: Omit<TaxiRoute, 'id'> = {
      fromLocation: body.fromLocation,
      toLocation: body.toLocation,
      slug,
      distance: body.distance || 0,
      estimatedDuration: body.estimatedDuration || 0,
      averagePrice: body.averagePrice || 0,
      priceRange: body.priceRange || { min: 0, max: 0 },
      popularityScore: body.popularityScore || 50,
      seoData,
      content: body.content || {
        introduction: `Book your taxi from ${body.fromLocation.name} to ${body.toLocation.name} with CityCars Gatwick.`,
        whyChooseUs: [
          'Professional licensed drivers',
          'Fixed prices, no hidden fees',
          'Flight monitoring included',
          '24/7 customer support'
        ],
        faqs: [],
        tips: []
      },
      vehicleTypes: body.vehicleTypes || [],
      nearbyRoutes: body.nearbyRoutes || [],
      isActive: body.isActive !== undefined ? body.isActive : true,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await collections.routes().add(routeData);
    const snapshot = await docRef.get();


    return {
      success: true,
      id: snapshot.id,
      route: {
        id: snapshot.id,
        ...snapshot.data()
      }
    };
  } catch (error: any) {
    console.error('[API] ❌ Create route error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create route'
    });
  }
});

