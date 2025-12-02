<template>
  <div class="p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Seed Routes</h1>
        <p class="text-gray-600">Create popular taxi routes automatically</p>
      </div>

      <!-- Status Card -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <!-- Initial State -->
        <div v-if="status === 'idle'" class="text-center">
          <div class="mb-6">
            <svg class="w-20 h-20 mx-auto text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold mb-4">Ready to Seed Routes</h2>
          <p class="text-gray-600 mb-6">
            This will create approximately 27 popular routes
          </p>
          <button 
            @click="startSeeding"
            class="bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors text-lg"
          >
            🌱 Start Seeding
          </button>
        </div>

        <!-- Loading State -->
        <div v-else-if="status === 'seeding'" class="text-center">
          <div class="mb-6">
            <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500"></div>
          </div>
          <h2 class="text-2xl font-bold mb-4">Seeding in Progress...</h2>
          <p class="text-gray-600 mb-6">{{ currentMessage }}</p>
          
          <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              class="bg-amber-500 h-4 rounded-full transition-all"
              :style="{ width: progressPercent + '%' }"
            ></div>
          </div>
          <p class="text-sm text-gray-500">{{ completed }} of {{ total }} routes processed</p>
        </div>

        <!-- Complete State -->
        <div v-else-if="status === 'complete'" class="text-center">
          <div class="mb-6">
            <svg class="w-20 h-20 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold mb-4 text-green-600">✨ Seeding Complete!</h2>
          <div class="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <p class="text-gray-700 mb-2">✅ Created: <strong>{{ stats.success }}</strong> routes</p>
            <p class="text-gray-700 mb-2">⏭️ Skipped: <strong>{{ stats.skipped }}</strong> routes</p>
            <p class="text-gray-700">❌ Failed: <strong>{{ stats.failed }}</strong> routes</p>
          </div>
          
          <div class="flex gap-4 justify-center">
            <NuxtLink 
              to="/admin/routes"
              class="bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-600"
            >
              View All Routes
            </NuxtLink>
            <NuxtLink 
              to="/routes"
              target="_blank"
              class="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
            >
              View Public Page
            </NuxtLink>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="status === 'error'" class="text-center">
          <div class="mb-6">
            <svg class="w-20 h-20 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold mb-4 text-red-600">Error!</h2>
          <p class="text-gray-700 mb-6">{{ errorMessage }}</p>
          <button 
            @click="reset"
            class="bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-600"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- Simple Log -->
      <div v-if="logs.length > 0" class="mt-6 bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-xs max-h-96 overflow-y-auto">
        <div v-for="(log, index) in logs" :key="index" class="mb-1">{{ log }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
});

const status = ref<'idle' | 'seeding' | 'complete' | 'error'>('idle');
const currentMessage = ref('');
const logs = ref<string[]>([]);
const completed = ref(0);
const total = ref(0);
const stats = ref({ success: 0, skipped: 0, failed: 0 });
const errorMessage = ref('');

const progressPercent = computed(() => {
  if (total.value === 0) return 0;
  return Math.round((completed.value / total.value) * 100);
});

const addLog = (msg: string) => {
  logs.value.push(msg);
  console.log(msg);
};

const reset = () => {
  status.value = 'idle';
  logs.value = [];
  completed.value = 0;
  total.value = 0;
  stats.value = { success: 0, skipped: 0, failed: 0 };
  errorMessage.value = '';
};

// Route generation
const generateRoutes = () => {
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
  ];

  const routes = [];
  const gatwick = locations[0];

  const calcDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  for (let i = 1; i < locations.length; i++) {
    const dest = locations[i];
    const distance = calcDistance(gatwick.lat, gatwick.lng, dest.lat, dest.lng);
    const price = Math.round(50 + distance * 2.5);

    routes.push({
      fromLocation: { 
        name: gatwick.name, 
        slug: gatwick.slug, 
        latitude: gatwick.lat, 
        longitude: gatwick.lng, 
        type: gatwick.type 
      },
      toLocation: { 
        name: dest.name, 
        slug: dest.slug, 
        latitude: dest.lat, 
        longitude: dest.lng, 
        type: dest.type 
      },
      slug: `${gatwick.slug}-to-${dest.slug}`,
      distance,
      estimatedDuration: Math.round(distance / 40 * 60),
      averagePrice: price,
      priceRange: { min: Math.round(price * 0.9), max: Math.round(price * 1.2) },
      popularityScore: 95 - (i * 5),
      seoData: {
        title: `${gatwick.name} to ${dest.name} Taxi | CityCars Gatwick`,
        metaDescription: `Book reliable taxi from ${gatwick.name} to ${dest.name}. ${distance} miles, from £${price}. Professional drivers, 24/7 availability.`,
        h1Title: `${gatwick.name} to ${dest.name} Taxi Service`,
        keywords: [`${gatwick.slug} to ${dest.slug}`, 'taxi', 'airport transfer']
      },
      content: {
        introduction: `Book your reliable taxi from ${gatwick.name} to ${dest.name} with CityCars Gatwick. ${distance} miles journey starting from £${price}.`,
        whyChooseUs: ['Professional drivers', 'Fixed prices', 'Flight monitoring', '24/7 support'],
        faqs: [
          { question: `How long does it take from ${gatwick.name} to ${dest.name}?`, answer: `About ${Math.round(distance / 40 * 60)} minutes depending on traffic.` }
        ],
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

  return routes;
};

const startSeeding = async () => {
  try {
    status.value = 'seeding';
    logs.value = [];
    stats.value = { success: 0, skipped: 0, failed: 0 };
    
    addLog('🌱 Starting seed...');
    
    const { $firebase } = useNuxtApp();
    const db = getFirestore($firebase as any);
    const routesCollection = collection(db, 'routes');
    
    const routes = generateRoutes();
    total.value = routes.length;
    addLog(`📋 Generated ${routes.length} routes`);

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      currentMessage.value = `Creating ${route.fromLocation.name} → ${route.toLocation.name}...`;
      
      try {
        // Check if route already exists
        const q = query(routesCollection, where('slug', '==', route.slug));
        const existingDocs = await getDocs(q);
        
        if (!existingDocs.empty) {
          addLog(`⏭️ Skipped: ${route.slug} (already exists)`);
          stats.value.skipped++;
        } else {
          // Add route directly to Firestore with user's auth
          await addDoc(routesCollection, route);
          addLog(`✅ Created: ${route.slug}`);
          stats.value.success++;
        }
      } catch (error: any) {
        addLog(`❌ Failed: ${route.slug} - ${error.message}`);
        stats.value.failed++;
        console.error('Route creation error:', error);
      }
      
      completed.value = i + 1;
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    addLog('✨ Seeding complete!');
    status.value = 'complete';
  } catch (error: any) {
    console.error('Seed error:', error);
    errorMessage.value = error.message || 'Seeding failed';
    addLog(`❌ ERROR: ${errorMessage.value}`);
    status.value = 'error';
  }
};
</script>
