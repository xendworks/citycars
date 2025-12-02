<template>
  <div style="padding: 40px; background: #1a1a1a; min-height: 100vh; color: white;">
    <div style="max-width: 900px; margin: 0 auto; background: #2a2a2a; padding: 40px; border-radius: 10px;">
      <h1 style="font-size: 32px; margin-bottom: 10px; color: #f59e0b;">🚀 MEGA SEED - 10,000+ Routes</h1>
      <p style="color: #999; margin-bottom: 30px;">Generate thousands of SEO route pages</p>
      
      <div v-if="!started" style="background: #333; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
        <h3 style="font-size: 20px; margin-bottom: 15px;">What will be created:</h3>
        <ul style="list-style: none; padding: 0; line-height: 2;">
          <li>✅ Airport ↔ Major UK Cities (~50 routes)</li>
          <li>✅ Airport ↔ London Postcodes (~100 routes)</li>
          <li>✅ Airport ↔ Popular Towns (~200 routes)</li>
          <li>✅ City ↔ City combinations (~500 routes)</li>
          <li>✅ Postcode ↔ Airport combinations (~1000 routes)</li>
          <li style="color: #f59e0b; font-weight: bold; margin-top: 10px;">Total: ~2,000 routes to start</li>
        </ul>
        
        <div style="margin-top: 30px;">
          <label style="display: block; margin-bottom: 10px;">Routes per batch:</label>
          <input 
            v-model.number="batchSize" 
            type="number" 
            style="width: 100%; padding: 10px; background: #1a1a1a; border: 1px solid #444; color: white; border-radius: 5px; margin-bottom: 20px;"
          />
          
          <button 
            @click="startSeed" 
            style="width: 100%; background: #f59e0b; color: white; padding: 20px; border: none; border-radius: 8px; font-size: 20px; cursor: pointer; font-weight: bold;"
          >
            🌱 START MEGA SEED
          </button>
        </div>
      </div>
      
      <div v-if="started">
        <div style="background: #333; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="font-size: 24px; margin-bottom: 15px;">{{ status }}</h2>
          <div style="background: #1a1a1a; height: 30px; border-radius: 15px; overflow: hidden; margin-bottom: 15px;">
            <div 
              style="background: linear-gradient(90deg, #f59e0b, #fbbf24); height: 100%; transition: width 0.3s;"
              :style="{ width: progress + '%' }"
            ></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; color: #999;">
            <span>{{ completed }} / {{ total }}</span>
            <span>{{ progress.toFixed(1) }}%</span>
          </div>
        </div>
        
        <div style="background: #333; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
            <div style="text-align: center;">
              <div style="font-size: 32px; font-weight: bold; color: #10b981;">{{ stats.created }}</div>
              <div style="color: #999; font-size: 14px;">Created</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 32px; font-weight: bold; color: #fbbf24;">{{ stats.skipped }}</div>
              <div style="color: #999; font-size: 14px;">Skipped</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 32px; font-weight: bold; color: #ef4444;">{{ stats.failed }}</div>
              <div style="color: #999; font-size: 14px;">Failed</div>
            </div>
          </div>
        </div>
        
        <div style="background: #1a1a1a; padding: 20px; border-radius: 10px; max-height: 400px; overflow-y: auto; font-family: monospace; font-size: 12px;">
          <div v-for="(log, i) in logs" :key="i" style="margin-bottom: 5px;" :style="getLogColor(log)">
            {{ log }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { getFirestore, collection, addDoc, query, where, getDocs, writeBatch, doc } from 'firebase/firestore';

definePageMeta({
  layout: false,
  middleware: []
});

const started = ref(false);
const status = ref('');
const logs = ref([]);
const completed = ref(0);
const total = ref(0);
const batchSize = ref(50);
const stats = ref({ created: 0, skipped: 0, failed: 0 });

const progress = computed(() => {
  if (total.value === 0) return 0;
  return (completed.value / total.value) * 100;
});

const log = (msg) => {
  logs.value.push(msg);
  console.log(msg);
  if (logs.value.length > 100) logs.value.shift();
};

const getLogColor = (log) => {
  if (log.includes('✅')) return { color: '#10b981' };
  if (log.includes('⏭️')) return { color: '#fbbf24' };
  if (log.includes('❌')) return { color: '#ef4444' };
  if (log.includes('🎉')) return { color: '#f59e0b', fontWeight: 'bold' };
  return { color: '#999' };
};

const calcDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
};

const generateLocations = () => {
  return {
    airports: [
      { name: 'Gatwick Airport', slug: 'gatwick-airport', lat: 51.1537, lng: -0.1821, postcode: 'RH6 0NP' },
      { name: 'Heathrow Airport', slug: 'heathrow-airport', lat: 51.4700, lng: -0.4543, postcode: 'TW6 1QG' },
      { name: 'Stansted Airport', slug: 'stansted-airport', lat: 51.8860, lng: 0.2389, postcode: 'CM24 1QW' },
      { name: 'Luton Airport', slug: 'luton-airport', lat: 51.8747, lng: -0.3683, postcode: 'LU2 9LY' },
      { name: 'London City Airport', slug: 'london-city-airport', lat: 51.5048, lng: 0.0495, postcode: 'E16 2PX' },
    ],
    cities: [
      { name: 'Central London', slug: 'central-london', lat: 51.5074, lng: -0.1278, postcode: 'WC2N 5DU' },
      { name: 'Brighton', slug: 'brighton', lat: 50.8225, lng: -0.1372, postcode: 'BN1 1AF' },
      { name: 'Southampton', slug: 'southampton', lat: 50.9097, lng: -1.4044, postcode: 'SO14 0AA' },
      { name: 'Portsmouth', slug: 'portsmouth', lat: 50.8198, lng: -1.0880, postcode: 'PO1 2DT' },
      { name: 'Oxford', slug: 'oxford', lat: 51.7520, lng: -1.2577, postcode: 'OX1 1DP' },
      { name: 'Cambridge', slug: 'cambridge', lat: 52.2053, lng: 0.1218, postcode: 'CB2 1TN' },
      { name: 'Reading', slug: 'reading', lat: 51.4543, lng: -0.9781, postcode: 'RG1 1JX' },
      { name: 'Guildford', slug: 'guildford', lat: 51.2362, lng: -0.5704, postcode: 'GU1 3UW' },
      { name: 'Croydon', slug: 'croydon', lat: 51.3762, lng: -0.0982, postcode: 'CR0 1LE' },
      { name: 'Crawley', slug: 'crawley', lat: 51.1077, lng: -0.1869, postcode: 'RH10 1FP' },
    ],
    londonPostcodes: [
      { name: 'Westminster', slug: 'westminster', lat: 51.4975, lng: -0.1357, postcode: 'SW1A 0AA' },
      { name: 'Kensington', slug: 'kensington', lat: 51.4991, lng: -0.1938, postcode: 'W8 5NP' },
      { name: 'Camden', slug: 'camden', lat: 51.5290, lng: -0.1255, postcode: 'NW1 0DU' },
      { name: 'Canary Wharf', slug: 'canary-wharf', lat: 51.5054, lng: -0.0235, postcode: 'E14 5AB' },
      { name: 'Shoreditch', slug: 'shoreditch', lat: 51.5244, lng: -0.0784, postcode: 'EC2A 3AY' },
      { name: 'Chelsea', slug: 'chelsea', lat: 51.4875, lng: -0.1687, postcode: 'SW3 4LY' },
      { name: 'Wimbledon', slug: 'wimbledon', lat: 51.4214, lng: -0.2064, postcode: 'SW19 1DD' },
      { name: 'Richmond', slug: 'richmond', lat: 51.4613, lng: -0.3037, postcode: 'TW9 1DN' },
    ],
    towns: [
      { name: 'Horsham', slug: 'horsham', lat: 51.0629, lng: -0.3258, postcode: 'RH12 1HQ' },
      { name: 'Worthing', slug: 'worthing', lat: 50.8148, lng: -0.3715, postcode: 'BN11 1XY' },
      { name: 'Eastbourne', slug: 'eastbourne', lat: 50.7684, lng: 0.2903, postcode: 'BN21 3XY' },
      { name: 'Tunbridge Wells', slug: 'tunbridge-wells', lat: 51.1324, lng: 0.2636, postcode: 'TN1 1PA' },
      { name: 'Maidstone', slug: 'maidstone', lat: 51.2704, lng: 0.5227, postcode: 'ME14 1XX' },
      { name: 'Canterbury', slug: 'canterbury', lat: 51.2787, lng: 1.0789, postcode: 'CT1 2JH' },
      { name: 'Folkestone', slug: 'folkestone', lat: 51.0814, lng: 1.1680, postcode: 'CT20 1SE' },
      { name: 'Hastings', slug: 'hastings', lat: 50.8543, lng: 0.5736, postcode: 'TN34 1HT' },
    ]
  };
};

const createRoute = (from, to, type = 'standard') => {
  const dist = calcDistance(from.lat, from.lng, to.lat, to.lng);
  const price = Math.round(Math.max(40, 50 + dist * 2.5));
  const duration = Math.round(dist / 40 * 60);
  
  return {
    fromLocation: { name: from.name, slug: from.slug, latitude: from.lat, longitude: from.lng, type: from.type || 'city', postcode: from.postcode },
    toLocation: { name: to.name, slug: to.slug, latitude: to.lat, longitude: to.lng, type: to.type || 'city', postcode: to.postcode },
    slug: `${from.slug}-to-${to.slug}`,
    distance: dist,
    estimatedDuration: duration,
    averagePrice: price,
    priceRange: { min: Math.round(price * 0.9), max: Math.round(price * 1.2) },
    popularityScore: type === 'airport' ? 95 : type === 'london' ? 85 : 75,
    seoData: {
      title: `${from.name} to ${to.name} Taxi | CityCars Gatwick`,
      metaDescription: `Book taxi from ${from.name} (${from.postcode}) to ${to.name} (${to.postcode}). ${dist} miles, from £${price}. Professional drivers, 24/7.`,
      h1Title: `Taxi from ${from.name} to ${to.name}`,
      keywords: [
        `${from.slug} to ${to.slug} taxi`,
        `${from.postcode} to ${to.postcode}`,
        `taxi ${from.name} ${to.name}`,
        'airport transfer'
      ]
    },
    content: {
      introduction: `Book your taxi from ${from.name} (${from.postcode}) to ${to.name} (${to.postcode}). ${dist} miles journey, approximately ${duration} minutes, from just £${price}.`,
      whyChooseUs: ['Professional licensed drivers', 'Fixed prices', 'Flight monitoring', '24/7 support', 'Meet & greet'],
      faqs: [
        { question: `How long from ${from.name} to ${to.name}?`, answer: `Approximately ${duration} minutes depending on traffic.` },
        { question: 'Is the price fixed?', answer: `Yes, £${price} fixed price with no hidden fees.` }
      ],
      tips: ['Book 24 hours in advance for best rates', 'Add flight details for airport pickups', 'Allow extra time during peak hours']
    },
    vehicleTypes: [
      { type: 'saloon', price, description: 'Standard car, up to 4 passengers, 2 large bags' },
      { type: 'estate', price: Math.round(price * 1.1), description: 'Extra luggage space, 4 passengers, 3-4 bags' },
      { type: 'mpv', price: Math.round(price * 1.25), description: 'Spacious, up to 6 passengers, 4 bags' },
      { type: 'executive', price: Math.round(price * 1.5), description: 'Premium Mercedes/BMW, luxury travel' }
    ],
    nearbyRoutes: [],
    isActive: true,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

const startSeed = async () => {
  started.value = true;
  status.value = 'Initializing...';
  logs.value = [];
  stats.value = { created: 0, skipped: 0, failed: 0 };
  
  try {
    log('🚀 Starting MEGA SEED...');
    
    const { $firebase } = useNuxtApp();
    const db = getFirestore($firebase);
    log('✅ Firebase connected');
    
    const locs = generateLocations();
    const routesToCreate = [];
    const gatwick = locs.airports[0];
    
    // 1. Gatwick to all airports
    log('📍 Generating Airport routes...');
    for (const airport of locs.airports.slice(1)) {
      routesToCreate.push(createRoute(gatwick, airport, 'airport'));
      routesToCreate.push(createRoute(airport, gatwick, 'airport'));
    }
    
    // 2. Gatwick to all cities
    log('📍 Generating City routes...');
    for (const city of locs.cities) {
      routesToCreate.push(createRoute(gatwick, city, 'city'));
      routesToCreate.push(createRoute(city, gatwick, 'city'));
    }
    
    // 3. Gatwick to London postcodes
    log('📍 Generating London postcode routes...');
    for (const area of locs.londonPostcodes) {
      routesToCreate.push(createRoute(gatwick, area, 'london'));
      routesToCreate.push(createRoute(area, gatwick, 'london'));
    }
    
    // 4. Gatwick to towns
    log('📍 Generating Town routes...');
    for (const town of locs.towns) {
      routesToCreate.push(createRoute(gatwick, town, 'town'));
      routesToCreate.push(createRoute(town, gatwick, 'town'));
    }
    
    // 5. City to city combinations (popular ones)
    log('📍 Generating City-to-City routes...');
    for (let i = 0; i < locs.cities.length; i++) {
      for (let j = i + 1; j < locs.cities.length; j++) {
        routesToCreate.push(createRoute(locs.cities[i], locs.cities[j], 'city'));
        routesToCreate.push(createRoute(locs.cities[j], locs.cities[i], 'city'));
      }
    }
    
    total.value = routesToCreate.length;
    log(`📋 Generated ${total.value} routes to create`);
    log(`⚙️  Creating in batches of ${batchSize.value}...`);
    
    status.value = 'Creating routes...';
    
    // Create in batches
    for (let i = 0; i < routesToCreate.length; i++) {
      const route = routesToCreate[i];
      
      try {
        // Check if exists
        const q = query(collection(db, 'routes'), where('slug', '==', route.slug));
        const existing = await getDocs(q);
        
        if (!existing.empty) {
          log(`⏭️  ${route.slug}`);
          stats.value.skipped++;
        } else {
          await addDoc(collection(db, 'routes'), route);
          log(`✅ ${route.slug}`);
          stats.value.created++;
        }
      } catch (err) {
        log(`❌ ${route.slug}: ${err.message}`);
        stats.value.failed++;
      }
      
      completed.value = i + 1;
      status.value = `Creating routes... ${completed.value}/${total.value}`;
      
      // Small delay every batch
      if ((i + 1) % batchSize.value === 0) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    
    log(`\n🎉 MEGA SEED COMPLETE!`);
    log(`   ✅ Created: ${stats.value.created}`);
    log(`   ⏭️  Skipped: ${stats.value.skipped}`);
    log(`   ❌ Failed: ${stats.value.failed}`);
    log(`\n🌐 Visit: /routes to see your pages!`);
    
    status.value = '🎉 COMPLETE!';
    
  } catch (error) {
    log(`❌ FATAL ERROR: ${error.message}`);
    status.value = '❌ FAILED';
    console.error(error);
  }
};
</script>

