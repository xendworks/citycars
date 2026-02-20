<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="py-16 bg-gradient-to-br from-amber-50 to-yellow-100">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-bold text-center mb-6">
          Popular Taxi Routes
        </h1>
        <p class="text-lg text-gray-700 text-center max-w-3xl mx-auto mb-8">
          Explore our most popular taxi routes with competitive pricing and professional service.
          All routes include flight monitoring, meet & greet service, and 24/7 customer support.
        </p>

        <!-- Search Box -->
        <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              v-model="searchFrom"
              type="text"
              placeholder="From (e.g., Gatwick Airport)"
              class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input 
              v-model="searchTo"
              type="text"
              placeholder="To (e.g., Heathrow Airport)"
              class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button 
            @click="searchRoutes"
            class="w-full mt-4 bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
          >
            Search Routes
          </button>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <section class="py-8 bg-white border-b">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap items-center justify-center gap-4">
          <span class="text-gray-600 font-medium">Sort by:</span>
          <button 
            v-for="option in sortOptions" 
            :key="option.value"
            @click="sortBy = option.value"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              sortBy === option.value 
                ? 'bg-amber-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </section>

    <!-- Routes Grid -->
    <section class="py-12">
      <div class="container mx-auto px-4">
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          <p class="mt-4 text-gray-600">Loading routes...</p>
        </div>

        <div v-else-if="filteredRoutes.length === 0" class="text-center py-12">
          <p class="text-gray-600 text-lg">No routes found. Try adjusting your search.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink 
            v-for="route in filteredRoutes" 
            :key="route.id"
            :to="`/routes/${route.slug}`"
            class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
          >
            <!-- Route Header -->
            <div class="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
              <h3 class="text-xl font-bold mb-2">
                {{ route.fromLocation.name }}
              </h3>
              <div class="flex items-center space-x-2 text-amber-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold mt-2">
                {{ route.toLocation.name }}
              </h3>
            </div>

            <!-- Route Details -->
            <div class="p-6">
              <div class="grid grid-cols-3 gap-4 mb-4">
                <div class="text-center">
                  <div class="text-gray-600 text-sm">Distance</div>
                  <div class="text-lg font-bold">{{ route.distance }} mi</div>
                </div>
                <div class="text-center">
                  <div class="text-gray-600 text-sm">Duration</div>
                  <div class="text-lg font-bold">{{ route.estimatedDuration }} min</div>
                </div>
                <div class="text-center">
                  <div class="text-gray-600 text-sm">From</div>
                  <div class="text-lg font-bold text-amber-600">£{{ route.averagePrice }}</div>
                </div>
              </div>

              <!-- View Details Button -->
              <div class="text-center">
                <span class="inline-block text-amber-600 font-semibold group-hover:text-amber-700">
                  View Details →
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Popular Destinations Section -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Popular Destinations from Gatwick</h2>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <NuxtLink 
            v-for="destination in popularDestinations" 
            :key="destination.slug"
            :to="`/routes/${destination.slug}`"
            class="p-4 text-center bg-gray-50 rounded-lg hover:bg-amber-50 hover:text-amber-600 transition-colors"
          >
            <div class="font-semibold">{{ destination.name }}</div>
            <div class="text-sm text-gray-500">{{ destination.distance }}</div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { TaxiRoute } from '~/types/route';

// SEO
useSEO({
  title: 'Popular Taxi Routes | CityCars Gatwick',
  description: 'Browse our most popular taxi routes to and from Gatwick Airport. Competitive prices, professional drivers, and 24/7 availability.',
  url: '/routes',
  type: 'website'
});

const { fetchRoutes } = useRoutes();

// State
const routes = ref<TaxiRoute[]>([]);
const loading = ref(true);
const searchFrom = ref('');
const searchTo = ref('');
const sortBy = ref<'popularity' | 'price' | 'distance'>('popularity');

const sortOptions = [
  { label: 'Most Popular', value: 'popularity' },
  { label: 'Best Price', value: 'price' },
  { label: 'Shortest Distance', value: 'distance' }
];

// Fetch routes on mount
onMounted(async () => {
  await loadRoutes();
});

const loadRoutes = async () => {
  loading.value = true;
  routes.value = await fetchRoutes({ sortBy: sortBy.value, limit: 50 });
  loading.value = false;
};

// Watch for sort changes
watch(sortBy, async () => {
  await loadRoutes();
});

// Filtered routes based on search
const filteredRoutes = computed(() => {
  if (!searchFrom.value && !searchTo.value) {
    return routes.value;
  }

  return routes.value.filter(route => {
    const matchFrom = !searchFrom.value || 
      route.fromLocation.name.toLowerCase().includes(searchFrom.value.toLowerCase());
    const matchTo = !searchTo.value || 
      route.toLocation.name.toLowerCase().includes(searchTo.value.toLowerCase());
    return matchFrom && matchTo;
  });
});

// Search function
const searchRoutes = () => {
  // The computed property will automatically filter
};

// Popular destinations for quick access
const popularDestinations = [
  { name: 'Heathrow Airport', distance: '40 miles', slug: 'gatwick-to-heathrow' },
  { name: 'London', distance: '28 miles', slug: 'gatwick-to-london' },
  { name: 'Brighton', distance: '27 miles', slug: 'gatwick-to-brighton' },
  { name: 'Southampton', distance: '70 miles', slug: 'gatwick-to-southampton' },
  { name: 'Oxford', distance: '62 miles', slug: 'gatwick-to-oxford' },
  { name: 'Portsmouth', distance: '58 miles', slug: 'gatwick-to-portsmouth' },
  { name: 'Guildford', distance: '22 miles', slug: 'gatwick-to-guildford' },
  { name: 'Reading', distance: '42 miles', slug: 'gatwick-to-reading' }
];
</script>

