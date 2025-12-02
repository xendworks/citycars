<template>
  <div style="padding: 40px; background: #f5f5f5; min-height: 100vh;">
    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px;">
      <h1 style="font-size: 28px; margin-bottom: 20px;">Simple Seed Test</h1>
      
      <button 
        v-if="!started"
        @click="seed" 
        style="background: #f59e0b; color: white; padding: 15px 30px; border: none; border-radius: 8px; font-size: 18px; cursor: pointer; font-weight: bold;"
      >
        SEED ROUTES
      </button>
      
      <div v-if="started" style="margin-top: 20px;">
        <h2 style="font-size: 20px; margin-bottom: 15px;">{{ status }}</h2>
        <div style="font-family: monospace; font-size: 12px; background: #1a1a1a; color: #00ff00; padding: 15px; border-radius: 5px; max-height: 400px; overflow-y: auto;">
          <div v-for="(log, i) in logs" :key="i" style="margin-bottom: 5px;">{{ log }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

// NO LAYOUT, NO MIDDLEWARE
definePageMeta({
  layout: false,
  middleware: []
});

const started = ref(false);
const status = ref('');
const logs = ref([]);

const log = (msg) => {
  logs.value.push(msg);
  console.log(msg);
};

const seed = async () => {
  started.value = true;
  status.value = 'Starting...';
  logs.value = [];
  
  try {
    log('🌱 Initializing...');
    
    const { $firebase } = useNuxtApp();
    if (!$firebase) {
      log('❌ Firebase not available');
      status.value = 'FAILED';
      return;
    }
    
    log('✅ Firebase ready');
    const db = getFirestore($firebase);
    log('✅ Firestore connected');
    
    // Generate routes
    const locations = [
      { name: 'Gatwick Airport', slug: 'gatwick-airport', lat: 51.1537, lng: -0.1821, type: 'airport' },
      { name: 'Heathrow Airport', slug: 'heathrow-airport', lat: 51.4700, lng: -0.4543, type: 'airport' },
      { name: 'Stansted Airport', slug: 'stansted-airport', lat: 51.8860, lng: 0.2389, type: 'airport' },
      { name: 'Luton Airport', slug: 'luton-airport', lat: 51.8747, lng: -0.3683, type: 'airport' },
      { name: 'London City Airport', slug: 'london-city-airport', lat: 51.5048, lng: 0.0495, type: 'airport' },
      { name: 'Central London', slug: 'central-london', lat: 51.5074, lng: -0.1278, type: 'city' },
      { name: 'Brighton', slug: 'brighton', lat: 50.8225, lng: -0.1372, type: 'city' },
      { name: 'Southampton', slug: 'southampton', lat: 50.9097, lng: -1.4044, type: 'city' },
      { name: 'Portsmouth', slug: 'portsmouth', lat: 50.8198, lng: -1.0880, type: 'city' },
      { name: 'Oxford', slug: 'oxford', lat: 51.7520, lng: -1.2577, type: 'city' },
      { name: 'Reading', slug: 'reading', lat: 51.4543, lng: -0.9781, type: 'city' },
      { name: 'Guildford', slug: 'guildford', lat: 51.2362, lng: -0.5704, type: 'city' },
    ];
    
    const gatwick = locations[0];
    const routesToCreate = [];
    
    // Calculate distance
    const calcDist = (lat1, lon1, lat2, lon2) => {
      const R = 3959;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
    };
    
    // Create routes from Gatwick
    for (let i = 1; i < locations.length; i++) {
      const dest = locations[i];
      const dist = calcDist(gatwick.lat, gatwick.lng, dest.lat, dest.lng);
      const price = Math.round(50 + dist * 2.5);
      
      routesToCreate.push({
        fromLocation: { name: gatwick.name, slug: gatwick.slug, latitude: gatwick.lat, longitude: gatwick.lng, type: gatwick.type },
        toLocation: { name: dest.name, slug: dest.slug, latitude: dest.lat, longitude: dest.lng, type: dest.type },
        slug: `${gatwick.slug}-to-${dest.slug}`,
        distance: dist,
        estimatedDuration: Math.round(dist / 40 * 60),
        averagePrice: price,
        priceRange: { min: Math.round(price * 0.9), max: Math.round(price * 1.2) },
        popularityScore: 95 - (i * 5),
        seoData: {
          title: `${gatwick.name} to ${dest.name} Taxi | CityCars Gatwick`,
          metaDescription: `Book reliable taxi from ${gatwick.name} to ${dest.name}. ${dist} miles, from £${price}. Professional drivers, 24/7 availability.`,
          h1Title: `${gatwick.name} to ${dest.name} Taxi Service`,
          keywords: [`${gatwick.slug} to ${dest.slug}`, 'taxi', 'airport transfer']
        },
        content: {
          introduction: `Book your reliable taxi from ${gatwick.name} to ${dest.name} with CityCars Gatwick. ${dist} miles journey from £${price}.`,
          whyChooseUs: ['Professional drivers', 'Fixed prices', 'Flight monitoring', '24/7 support'],
          faqs: [{ question: `How long from ${gatwick.name} to ${dest.name}?`, answer: `About ${Math.round(dist/40*60)} minutes.` }],
          tips: ['Book in advance', 'Add flight details']
        },
        vehicleTypes: [
          { type: 'saloon', price, description: 'Standard car for up to 4 passengers' },
          { type: 'mpv', price: Math.round(price * 1.25), description: 'Spacious vehicle for up to 6 passengers' }
        ],
        nearbyRoutes: [],
        isActive: true,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    log(`📋 Generated ${routesToCreate.length} routes to create`);
    
    let created = 0;
    let skipped = 0;
    
    for (const route of routesToCreate) {
      try {
        // Check if exists
        const q = query(collection(db, 'routes'), where('slug', '==', route.slug));
        const existing = await getDocs(q);
        
        if (!existing.empty) {
          log(`⏭️  Skip: ${route.slug} (exists)`);
          skipped++;
        } else {
          await addDoc(collection(db, 'routes'), route);
          log(`✅ Created: ${route.slug}`);
          created++;
        }
        
        await new Promise(r => setTimeout(r, 200));
      } catch (err) {
        log(`❌ Failed: ${route.slug} - ${err.message}`);
      }
    }
    
    log(`\n🎉 COMPLETE!`);
    log(`   Created: ${created} routes`);
    log(`   Skipped: ${skipped} routes`);
    
    status.value = `✅ DONE! Created ${created} routes`;
    
  } catch (error) {
    log(`❌ ERROR: ${error.message}`);
    console.error('Full error:', error);
    status.value = '❌ FAILED';
  }
};
</script>

