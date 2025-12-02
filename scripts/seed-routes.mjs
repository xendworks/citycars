import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
let db;

try {
  // Check if already initialized
  if (getApps().length > 0) {
    db = getFirestore();
  } else {
    // Try service account from environment
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : null;

    if (serviceAccount) {
      initializeApp({
        credential: cert(serviceAccount),
      });
      console.log('✓ Using service account credentials');
    } else {
      // For local development - use project ID with default credentials
      const projectId = process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || 'city-cars-83256';
      
      console.log('⚠️  No service account found. Attempting to use Application Default Credentials...');
      console.log('⚠️  If this fails, you have two options:');
      console.log('   1. Run: gcloud auth application-default login');
      console.log('   2. Or set FIREBASE_SERVICE_ACCOUNT environment variable');
      console.log('   3. Or use the web-based seed method (see below)\n');
      
      initializeApp({
        projectId: projectId,
      });
    }
    
    db = getFirestore();
  }
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  console.log('\n📝 ALTERNATIVE: Use the web-based seeder instead:');
  console.log('   1. Start your dev server: pnpm run dev');
  console.log('   2. Visit: http://localhost:3000/admin/routes');
  console.log('   3. Use the "Bulk Import" button (we need to add this)\n');
  console.log('   OR authenticate with: gcloud auth application-default login\n');
  process.exit(1);
}

// Helper to generate slug
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Popular UK locations for taxi routes
const locations = [
  { name: 'Gatwick Airport', slug: 'gatwick-airport', lat: 51.1537, lng: -0.1821, type: 'airport' },
  { name: 'Heathrow Airport', slug: 'heathrow-airport', lat: 51.4700, lng: -0.4543, type: 'airport' },
  { name: 'London City Airport', slug: 'london-city-airport', lat: 51.5048, lng: 0.0495, type: 'airport' },
  { name: 'Stansted Airport', slug: 'stansted-airport', lat: 51.8860, lng: 0.2389, type: 'airport' },
  { name: 'Luton Airport', slug: 'luton-airport', lat: 51.8747, lng: -0.3683, type: 'airport' },
  { name: 'Central London', slug: 'central-london', lat: 51.5074, lng: -0.1278, type: 'city' },
  { name: 'Brighton', slug: 'brighton', lat: 50.8225, lng: -0.1372, type: 'city' },
  { name: 'Southampton', slug: 'southampton', lat: 50.9097, lng: -1.4044, type: 'city' },
  { name: 'Portsmouth', slug: 'portsmouth', lat: 50.8198, lng: -1.0880, type: 'city' },
  { name: 'Oxford', slug: 'oxford', lat: 51.7520, lng: -1.2577, type: 'city' },
  { name: 'Reading', slug: 'reading', lat: 51.4543, lng: -0.9781, type: 'city' },
  { name: 'Guildford', slug: 'guildford', lat: 51.2362, lng: -0.5704, type: 'city' },
  { name: 'Crawley', slug: 'crawley', lat: 51.1077, lng: -0.1869, type: 'city' },
  { name: 'Horsham', slug: 'horsham', lat: 51.0629, lng: -0.3258, type: 'city' },
  { name: 'Worthing', slug: 'worthing', lat: 50.8148, lng: -0.3715, type: 'city' },
  { name: 'Victoria Station', slug: 'victoria-station', lat: 51.4952, lng: -0.1441, type: 'station' },
  { name: 'Kings Cross Station', slug: 'kings-cross-station', lat: 51.5309, lng: -0.1238, type: 'station' },
  { name: 'Waterloo Station', slug: 'waterloo-station', lat: 51.5031, lng: -0.1132, type: 'station' },
];

// Calculate approximate distance between two points (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

// Calculate estimated duration (assuming 40 mph average)
const calculateDuration = (distance) => {
  return Math.round((distance / 40) * 60);
};

// Calculate price based on distance
const calculatePrice = (distance) => {
  const basePrice = 50;
  const pricePerMile = 2.5;
  return Math.round(basePrice + (distance * pricePerMile));
};

// Generate popular routes
const generateRoutes = () => {
  const routes = [];
  const gatwick = locations.find(l => l.slug === 'gatwick-airport');

  // Priority routes from Gatwick
  const priorityDestinations = [
    'heathrow-airport',
    'central-london',
    'brighton',
    'southampton',
    'portsmouth',
    'oxford',
    'reading',
    'guildford',
    'stansted-airport',
    'luton-airport',
    'london-city-airport',
    'victoria-station',
    'kings-cross-station',
    'waterloo-station',
    'crawley',
    'horsham',
    'worthing'
  ];

  // Create routes from Gatwick to other locations
  priorityDestinations.forEach((destSlug, index) => {
    const destination = locations.find(l => l.slug === destSlug);
    if (!destination) return;

    const distance = calculateDistance(gatwick.lat, gatwick.lng, destination.lat, destination.lng);
    const duration = calculateDuration(distance);
    const averagePrice = calculatePrice(distance);
    const slug = `${gatwick.slug}-to-${destination.slug}`;

    // Calculate popularity score (higher for closer destinations and airports)
    const popularityScore = 100 - (index * 3) - Math.min(distance, 50);

    const route = {
      fromLocation: {
        name: gatwick.name,
        slug: gatwick.slug,
        latitude: gatwick.lat,
        longitude: gatwick.lng,
        type: gatwick.type
      },
      toLocation: {
        name: destination.name,
        slug: destination.slug,
        latitude: destination.lat,
        longitude: destination.lng,
        type: destination.type
      },
      slug,
      distance,
      estimatedDuration: duration,
      averagePrice,
      priceRange: {
        min: Math.round(averagePrice * 0.9),
        max: Math.round(averagePrice * 1.2)
      },
      popularityScore,
      seoData: {
        title: `${gatwick.name} to ${destination.name} Taxi | CityCars Gatwick`,
        metaDescription: `Book a reliable taxi from ${gatwick.name} to ${destination.name}. ${distance} miles, from £${averagePrice}. Professional drivers, 24/7 availability, instant booking.`,
        h1Title: `${gatwick.name} to ${destination.name} Taxi Service`,
        keywords: [
          `${gatwick.slug} to ${destination.slug}`,
          `${destination.name} taxi`,
          'airport transfer',
          'private hire',
          'gatwick taxi'
        ]
      },
      content: {
        introduction: `Book your reliable taxi from ${gatwick.name} to ${destination.name} with CityCars Gatwick. Our professional service covers the ${distance}-mile journey with comfortable vehicles and experienced drivers. Starting from just £${averagePrice}, we offer competitive fixed prices with no hidden fees.`,
        whyChooseUs: [
          'Professional licensed drivers',
          'Fixed prices, no surge charges',
          'Flight monitoring included',
          '24/7 customer support',
          'Meet & greet service',
          'Free cancellation up to 24 hours'
        ],
        faqs: [
          {
            question: `How long does it take from ${gatwick.name} to ${destination.name}?`,
            answer: `The journey typically takes around ${duration} minutes, depending on traffic conditions. Our drivers use the most efficient routes to ensure you arrive on time.`
          },
          {
            question: 'What is included in the price?',
            answer: 'The price includes all taxes, tolls, waiting time at the airport (up to 45 minutes), and flight monitoring. There are no hidden fees.'
          },
          {
            question: 'Can I book in advance?',
            answer: 'Yes, you can book up to 12 months in advance. We recommend booking early, especially during peak travel seasons.'
          },
          {
            question: 'What if my flight is delayed?',
            answer: 'We monitor all flight arrivals in real-time and adjust pickup times automatically. There is no extra charge for flight delays.'
          }
        ],
        tips: [
          'Book in advance for the best prices',
          'Add flight details so we can monitor delays',
          'Request meet & greet service for convenience',
          'Check luggage capacity when choosing vehicle type'
        ]
      },
      vehicleTypes: [
        {
          type: 'saloon',
          price: averagePrice,
          description: 'Standard comfortable car for up to 4 passengers with 2 large suitcases'
        },
        {
          type: 'estate',
          price: Math.round(averagePrice * 1.1),
          description: 'Extra luggage space for up to 4 passengers with 3-4 large suitcases'
        },
        {
          type: 'mpv',
          price: Math.round(averagePrice * 1.25),
          description: 'Spacious vehicle for up to 6 passengers with 4 large suitcases'
        },
        {
          type: 'executive',
          price: Math.round(averagePrice * 1.5),
          description: 'Premium luxury vehicle for up to 4 passengers with style and comfort'
        }
      ],
      nearbyRoutes: [],
      isActive: true,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    routes.push(route);
  });

  // Also create reverse routes (to Gatwick)
  priorityDestinations.slice(0, 10).forEach((sourceSlug, index) => {
    const source = locations.find(l => l.slug === sourceSlug);
    if (!source) return;

    const distance = calculateDistance(source.lat, source.lng, gatwick.lat, gatwick.lng);
    const duration = calculateDuration(distance);
    const averagePrice = calculatePrice(distance);
    const slug = `${source.slug}-to-${gatwick.slug}`;

    const route = {
      fromLocation: {
        name: source.name,
        slug: source.slug,
        latitude: source.lat,
        longitude: source.lng,
        type: source.type
      },
      toLocation: {
        name: gatwick.name,
        slug: gatwick.slug,
        latitude: gatwick.lat,
        longitude: gatwick.lng,
        type: gatwick.type
      },
      slug,
      distance,
      estimatedDuration: duration,
      averagePrice,
      priceRange: {
        min: Math.round(averagePrice * 0.9),
        max: Math.round(averagePrice * 1.2)
      },
      popularityScore: 90 - (index * 4),
      seoData: {
        title: `${source.name} to ${gatwick.name} Taxi | CityCars Gatwick`,
        metaDescription: `Book a reliable taxi from ${source.name} to ${gatwick.name}. ${distance} miles, from £${averagePrice}. Professional drivers, 24/7 availability, instant booking.`,
        h1Title: `${source.name} to ${gatwick.name} Taxi Service`,
        keywords: [
          `${source.slug} to ${gatwick.slug}`,
          `${source.name} airport transfer`,
          'gatwick taxi',
          'airport pickup'
        ]
      },
      content: {
        introduction: `Book your reliable taxi from ${source.name} to ${gatwick.name} with CityCars Gatwick. Perfect for airport transfers, our professional service ensures you arrive on time for your flight. Starting from just £${averagePrice} for the ${distance}-mile journey.`,
        whyChooseUs: [
          'Professional licensed drivers',
          'Fixed prices, no surge charges',
          'Flight monitoring included',
          '24/7 customer support',
          'Meet & greet service',
          'Free cancellation up to 24 hours'
        ],
        faqs: [
          {
            question: `How early should I book for ${gatwick.name}?`,
            answer: 'We recommend booking at least 24 hours in advance, though we can accommodate same-day bookings subject to availability.'
          },
          {
            question: 'Will the driver wait if I\'m running late?',
            answer: 'Yes, we include waiting time in our service. Please contact us if you expect to be significantly delayed.'
          }
        ],
        tips: [
          'Book early for peak travel times',
          'Allow extra time for security and check-in',
          'Add your flight details for better coordination',
          'Consider traffic when planning departure time'
        ]
      },
      vehicleTypes: [
        {
          type: 'saloon',
          price: averagePrice,
          description: 'Standard comfortable car for up to 4 passengers with 2 large suitcases'
        },
        {
          type: 'mpv',
          price: Math.round(averagePrice * 1.25),
          description: 'Spacious vehicle for up to 6 passengers with 4 large suitcases'
        }
      ],
      nearbyRoutes: [],
      isActive: true,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    routes.push(route);
  });

  return routes;
};

// Seed routes to Firestore
const seedRoutes = async () => {
  try {
    console.log('🌱 Starting route seeding...\n');

    const routes = generateRoutes();
    console.log(`📋 Generated ${routes.length} routes\n`);

    const routesCollection = db.collection('routes');
    let successCount = 0;
    let skipCount = 0;

    for (const route of routes) {
      try {
        // Check if route already exists
        const existing = await routesCollection.where('slug', '==', route.slug).limit(1).get();
        
        if (!existing.empty) {
          console.log(`⏭️  Skipping ${route.slug} (already exists)`);
          skipCount++;
          continue;
        }

        // Add route
        await routesCollection.add(route);
        console.log(`✅ Created: ${route.fromLocation.name} → ${route.toLocation.name} (${route.slug})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to create ${route.slug}:`, error.message);
      }
    }

    console.log(`\n✨ Seeding complete!`);
    console.log(`   Created: ${successCount} routes`);
    console.log(`   Skipped: ${skipCount} routes`);
    console.log(`   Total: ${routes.length} routes\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run the seeding
seedRoutes();

