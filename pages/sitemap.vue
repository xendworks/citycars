<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <div class="bg-gradient-to-r from-amber-500 to-amber-600 py-8">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-4xl font-bold text-white mb-2">Sitemap</h1>
            <p class="text-amber-100">Find all our taxi routes and services across the UK</p>
          </div>
          <div class="mt-4 md:mt-0 bg-white bg-opacity-20 rounded-lg px-6 py-4 text-center">
            <div class="text-4xl font-bold text-white">{{ displayedRoutes.length.toLocaleString() }}+</div>
            <div class="text-amber-100 text-sm">Routes Loaded</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="bg-gray-50 py-3 border-b">
      <div class="container mx-auto px-4">
        <nav class="flex text-sm text-gray-600">
          <NuxtLink to="/" class="hover:text-amber-600">Home</NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-gray-900">Sitemap</span>
        </nav>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <!-- Airport Routes -->
        <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center mb-4">
            <div class="bg-amber-100 p-3 rounded-lg mr-3">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900">Airport Transfers</h2>
          </div>
          <ul class="space-y-2">
            <li v-for="airport in airports" :key="airport.slug">
              <NuxtLink :to="`/${airport.slug}`" class="text-gray-700 hover:text-amber-600 hover:underline flex items-center">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
                {{ airport.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Station Routes -->
        <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center mb-4">
            <div class="bg-blue-100 p-3 rounded-lg mr-3">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900">Station Transfers</h2>
          </div>
          <ul class="space-y-2">
            <li v-for="station in stations" :key="station.slug">
              <NuxtLink :to="`/${station.slug}`" class="text-gray-700 hover:text-amber-600 hover:underline flex items-center">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
                {{ station.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- UK Cities -->
        <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center mb-4">
            <div class="bg-green-100 p-3 rounded-lg mr-3">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900">UK Cities</h2>
          </div>
          <ul class="space-y-2">
            <li v-for="city in cities" :key="city.slug">
              <NuxtLink :to="`/${city.slug}`" class="text-gray-700 hover:text-amber-600 hover:underline flex items-center">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
                {{ city.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Services -->
        <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center mb-4">
            <div class="bg-red-100 p-3 rounded-lg mr-3">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900">Our Services</h2>
          </div>
          <ul class="space-y-2">
            <li><NuxtLink to="/airport-taxis" class="text-gray-700 hover:text-amber-600 hover:underline flex items-center">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
              Airport Taxis
            </NuxtLink></li>
            <li><NuxtLink to="/wheel-chair-taxis" class="text-gray-700 hover:text-amber-600 hover:underline flex items-center">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
              Wheelchair Accessible Taxis
            </NuxtLink></li>
            <li><NuxtLink to="/quote" class="text-gray-700 hover:text-amber-600 hover:underline flex items-center">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
              Get a Quote
            </NuxtLink></li>
          </ul>
        </div>

        <!-- Help & Support -->
        <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center mb-4">
            <div class="bg-indigo-100 p-3 rounded-lg mr-3">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900">Help & Support</h2>
          </div>
          <ul class="space-y-2">
            <li><NuxtLink to="/contact-us" class="text-gray-700 hover:text-amber-600 hover:underline flex items-center">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
              Contact Us
            </NuxtLink></li>
            <li><NuxtLink to="/privacy-policy" class="text-gray-700 hover:text-amber-600 hover:underline flex items-center">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
              Privacy Policy
            </NuxtLink></li>
            <li><NuxtLink to="/contractor-agreement" class="text-gray-700 hover:text-amber-600 hover:underline flex items-center">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
              Terms & Conditions
            </NuxtLink></li>
          </ul>
        </div>

      </div>

      <!-- All Routes Section -->
      <div class="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-8">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <div class="bg-amber-100 p-3 rounded-lg mr-3">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">All Available Routes</h2>
              <p class="text-gray-600">
                {{ displayedRoutes.length.toLocaleString() }} routes loaded
                <span v-if="hasMore" class="text-amber-600">(scroll for more)</span>
                <span v-else class="text-green-600">✓ All loaded</span>
              </p>
            </div>
          </div>
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search routes..."
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        
        <!-- Routes Grid -->
        <div v-if="filteredRoutes.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <NuxtLink 
            v-for="route in filteredRoutes" 
            :key="route.id"
            :to="`/${route.slug}`"
            class="p-4 bg-white border border-gray-200 rounded-lg hover:border-amber-500 hover:shadow-md transition-all"
          >
            <div class="flex items-start">
              <svg class="w-5 h-5 mr-2 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
              <div class="min-w-0">
                <div class="font-medium text-gray-900 text-sm">{{ route.fromLocation?.name }}</div>
                <div class="text-xs text-gray-500">to</div>
                <div class="font-medium text-gray-900 text-sm">{{ route.toLocation?.name }}</div>
                <div class="text-xs text-amber-600 mt-1">From £{{ route.averagePrice }}</div>
              </div>
            </div>
          </NuxtLink>
        </div>
        
        <!-- Infinite Scroll Trigger -->
        <div 
          v-if="hasMore && !searchQuery" 
          ref="scrollTrigger"
          class="text-center py-8"
        >
          <div v-if="loading">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            <p class="text-gray-500 mt-2">Loading routes...</p>
          </div>
          <p v-else class="text-gray-400 text-sm">Scroll for more...</p>
        </div>

        <!-- No Results -->
        <div v-if="searchQuery && filteredRoutes.length === 0 && !loading" class="text-center py-8 text-gray-500">
          No routes found matching "{{ searchQuery }}"
        </div>

        <!-- All Loaded -->
        <div v-if="!hasMore && displayedRoutes.length > 0 && !searchQuery" class="text-center py-4 text-green-600 font-medium">
          ✅ All {{ displayedRoutes.length.toLocaleString() }} routes loaded!
        </div>
      </div>

      <!-- SEO Text -->
      <div class="mt-12 prose prose-lg max-w-none">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">About CityCars Gatwick Taxi Services</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          CityCars Gatwick provides reliable taxi and minicab services across the UK. Our comprehensive network covers 
          all major airports, train stations, and cities. Whether you need an airport transfer, station pickup, or 
          city-to-city journey, we've got you covered with professional drivers and competitive fixed prices.
        </p>
        <p class="text-gray-700 leading-relaxed">
          Book your taxi online 24/7, track your driver in real-time, and enjoy a comfortable journey with our 
          modern fleet of vehicles. All prices include taxes, tolls, and waiting time - no hidden fees!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { getFirestore, collection, getDocs, query, where, limit } from 'firebase/firestore';

useSEO({
  title: 'Sitemap - All Taxi Routes | CityCars Gatwick',
  description: 'Browse all available taxi routes across UK airports, stations, and cities. Book your taxi from Gatwick, Heathrow, Stansted, and more.',
  url: '/sitemap'
});

// Static data for quick categories
const airports = [
  { name: 'Heathrow Airport to Gatwick', slug: 'heathrow-airport-to-gatwick-airport' },
  { name: 'Gatwick Airport to Heathrow', slug: 'gatwick-airport-to-heathrow-airport' },
  { name: 'Stansted Airport to Gatwick', slug: 'stansted-airport-to-gatwick-airport' },
  { name: 'Luton Airport to Gatwick', slug: 'luton-airport-to-gatwick-airport' },
  { name: 'London City Airport to Gatwick', slug: 'london-city-airport-to-gatwick-airport' },
];

const stations = [
  { name: 'Victoria Station to Gatwick', slug: 'victoria-station-to-gatwick-airport' },
  { name: 'Paddington Station to Gatwick', slug: 'paddington-station-to-gatwick-airport' },
  { name: 'Kings Cross Station to Gatwick', slug: 'kings-cross-station-to-gatwick-airport' },
  { name: 'Euston Station to Gatwick', slug: 'euston-station-to-gatwick-airport' },
  { name: 'London Bridge to Gatwick', slug: 'london-bridge-station-to-gatwick-airport' },
];

const cities = [
  { name: 'London to Gatwick', slug: 'london-to-gatwick-airport' },
  { name: 'Birmingham to Gatwick', slug: 'birmingham-to-gatwick-airport' },
  { name: 'Manchester to Gatwick', slug: 'manchester-to-gatwick-airport' },
  { name: 'Brighton to Gatwick', slug: 'brighton-to-gatwick-airport' },
  { name: 'Oxford to Gatwick', slug: 'oxford-to-gatwick-airport' },
  { name: 'Cambridge to Gatwick', slug: 'cambridge-to-gatwick-airport' },
];

// State
const BATCH_SIZE = 50;
const allRoutes = ref([]);
const displayedRoutes = ref([]);
const totalRoutes = ref(0);
const searchQuery = ref('');
const loading = ref(false);
const hasMore = ref(true);
const scrollTrigger = ref(null);

let db = null;
let observer = null;

// Filtered routes based on search
const filteredRoutes = computed(() => {
  if (!searchQuery.value.trim()) {
    return displayedRoutes.value;
  }
  const search = searchQuery.value.toLowerCase();
  return allRoutes.value.filter(r =>
    r.slug?.includes(search) ||
    r.fromLocation?.name?.toLowerCase().includes(search) ||
    r.toLocation?.name?.toLowerCase().includes(search)
  );
});

// Load initial routes
const loadInitial = async () => {
  loading.value = true;
  try {
    // Get first batch - NO count query to save quota
    const routesRef = collection(db, 'routes');
    const q = query(routesRef, where('isActive', '==', true), limit(BATCH_SIZE));
    const snapshot = await getDocs(q);
    
    console.log(`📦 First batch: ${snapshot.docs.length} docs`);
    
    const routes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    allRoutes.value = routes;
    displayedRoutes.value = routes;
    totalRoutes.value = routes.length; // Start with what we have
    hasMore.value = routes.length === BATCH_SIZE; // If we got full batch, there's more
    
    
    // Setup observer after data loads
    await nextTick();
    setupObserver();
  } catch (error) {
    console.error('❌ Error loading routes:', error);
  } finally {
    loading.value = false;
  }
};

// Load more routes (called by infinite scroll)
const loadMore = async () => {
  if (loading.value || !hasMore.value) return;
  
  loading.value = true;
  
  try {
    const alreadyLoaded = allRoutes.value.length;
    const routesRef = collection(db, 'routes');
    const q = query(routesRef, where('isActive', '==', true), limit(alreadyLoaded + BATCH_SIZE));
    const snapshot = await getDocs(q);
    
    const routes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    const newRoutes = routes.slice(alreadyLoaded);
    
    allRoutes.value = routes;
    displayedRoutes.value = routes;
    totalRoutes.value = routes.length; // Update count
    
    // If we didn't get a full batch of new routes, we've reached the end
    hasMore.value = newRoutes.length === BATCH_SIZE;
    
  } catch (error) {
    console.error('❌ Error loading more:', error);
  } finally {
    loading.value = false;
  }
};

// Setup Intersection Observer for infinite scroll
const setupObserver = () => {
  if (!scrollTrigger.value) {
    return;
  }
  
  // Disconnect existing observer
  if (observer) {
    observer.disconnect();
  }
  
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMore.value && !loading.value && !searchQuery.value) {
        loadMore();
      }
    },
    {
      root: null,
      rootMargin: '100px', // Start loading 100px before reaching the trigger
      threshold: 0.1
    }
  );
  
  observer.observe(scrollTrigger.value);
};

// Watch for hasMore changes to re-setup observer
watch(hasMore, async (newVal) => {
  if (newVal) {
    await nextTick();
    setupObserver();
  }
});

onMounted(async () => {
  const { $firebase } = useNuxtApp();
  db = getFirestore($firebase);
  await loadInitial();
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>
