<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">SEO Routes Management</h1>
          <p class="text-gray-600 mt-2">Manage taxi routes for SEO optimization</p>
        </div>
        <button 
          @click="showCreateModal = true"
          class="bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>Add New Route</span>
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-gray-600 text-sm">Total Routes</div>
          <div class="text-3xl font-bold text-gray-900">{{ routes.length }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-gray-600 text-sm">Active Routes</div>
          <div class="text-3xl font-bold text-green-600">{{ activeRoutes }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-gray-600 text-sm">Total Views</div>
          <div class="text-3xl font-bold text-blue-600">{{ totalViews }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-gray-600 text-sm">Avg. Price</div>
          <div class="text-3xl font-bold text-amber-600">£{{ averagePrice }}</div>
        </div>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white rounded-lg shadow mb-6 p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Search routes..."
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <select 
          v-model="filterStatus"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select 
          v-model="sortBy"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="popularity">Most Popular</option>
          <option value="views">Most Viewed</option>
          <option value="price">Price (Low to High)</option>
          <option value="recent">Recently Added</option>
        </select>
      </div>
    </div>

    <!-- Routes Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="route in filteredRoutes" :key="route.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">
                {{ route.fromLocation.name }} → {{ route.toLocation.name }}
              </div>
              <div class="text-sm text-gray-500">{{ route.slug }}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ route.distance }} mi</td>
            <td class="px-6 py-4 text-sm font-semibold text-amber-600">£{{ route.averagePrice }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ route.views || 0 }}</td>
            <td class="px-6 py-4">
              <span 
                :class="[
                  'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                  route.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                ]"
              >
                {{ route.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm font-medium space-x-2">
              <NuxtLink 
                :to="`/routes/${route.slug}`" 
                target="_blank"
                class="text-blue-600 hover:text-blue-900"
              >
                View
              </NuxtLink>
              <button 
                @click="editRoute(route)"
                class="text-amber-600 hover:text-amber-900"
              >
                Edit
              </button>
              <button 
                @click="toggleRouteStatus(route)"
                class="text-gray-600 hover:text-gray-900"
              >
                {{ route.isActive ? 'Disable' : 'Enable' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredRoutes.length === 0" class="text-center py-12 text-gray-500">
        No routes found
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div 
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">{{ showEditModal ? 'Edit Route' : 'Create New Route' }}</h2>
            <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveRoute" class="space-y-6">
            <!-- From Location -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">From Location</label>
              <input 
                v-model="routeForm.fromLocation.name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g., Gatwick Airport"
              />
            </div>

            <!-- To Location -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">To Location</label>
              <input 
                v-model="routeForm.toLocation.name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g., Heathrow Airport"
              />
            </div>

            <!-- Distance & Duration -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Distance (miles)</label>
                <input 
                  v-model.number="routeForm.distance"
                  type="number"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <input 
                  v-model.number="routeForm.estimatedDuration"
                  type="number"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <!-- Pricing -->
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Average Price (£)</label>
                <input 
                  v-model.number="routeForm.averagePrice"
                  type="number"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Min Price (£)</label>
                <input 
                  v-model.number="routeForm.priceRange.min"
                  type="number"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Max Price (£)</label>
                <input 
                  v-model.number="routeForm.priceRange.max"
                  type="number"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <!-- Introduction -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Introduction</label>
              <textarea 
                v-model="routeForm.content.introduction"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Brief introduction about this route..."
              ></textarea>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4">
              <button 
                type="button"
                @click="closeModal"
                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
              >
                {{ showEditModal ? 'Update Route' : 'Create Route' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { TaxiRoute, RouteLocation } from '~/types/route';

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
});

const { fetchRoutes, createRoute, updateRoute, generateSlug } = useRoutes();

// State
const routes = ref<TaxiRoute[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const filterStatus = ref('all');
const sortBy = ref('popularity');
const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingRoute = ref<TaxiRoute | null>(null);

// Form state
const routeForm = ref({
  fromLocation: { name: '', slug: '', latitude: 0, longitude: 0, type: 'airport' as const },
  toLocation: { name: '', slug: '', latitude: 0, longitude: 0, type: 'airport' as const },
  distance: 0,
  estimatedDuration: 0,
  averagePrice: 0,
  priceRange: { min: 0, max: 0 },
  popularityScore: 50,
  content: {
    introduction: '',
    whyChooseUs: [],
    faqs: [],
    tips: []
  },
  vehicleTypes: [],
  nearbyRoutes: [],
  isActive: true
});

// Computed
const activeRoutes = computed(() => routes.value.filter(r => r.isActive).length);
const totalViews = computed(() => routes.value.reduce((sum, r) => sum + (r.views || 0), 0));
const averagePrice = computed(() => {
  if (routes.value.length === 0) return 0;
  return Math.round(routes.value.reduce((sum, r) => sum + r.averagePrice, 0) / routes.value.length);
});

const filteredRoutes = computed(() => {
  let filtered = routes.value;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(r => 
      r.fromLocation.name.toLowerCase().includes(query) ||
      r.toLocation.name.toLowerCase().includes(query) ||
      r.slug.toLowerCase().includes(query)
    );
  }

  // Filter by status
  if (filterStatus.value !== 'all') {
    const isActive = filterStatus.value === 'active';
    filtered = filtered.filter(r => r.isActive === isActive);
  }

  // Sort
  switch (sortBy.value) {
    case 'popularity':
      filtered.sort((a, b) => b.popularityScore - a.popularityScore);
      break;
    case 'views':
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
      break;
    case 'price':
      filtered.sort((a, b) => a.averagePrice - b.averagePrice);
      break;
    case 'recent':
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  return filtered;
});

// Methods
const loadRoutes = async () => {
  loading.value = true;
  routes.value = await fetchRoutes({ limit: 100 });
  loading.value = false;
};

const editRoute = (route: TaxiRoute) => {
  editingRoute.value = route;
  routeForm.value = { ...route };
  showEditModal.value = true;
};

const toggleRouteStatus = async (route: TaxiRoute) => {
  const result = await updateRoute(route.slug, { isActive: !route.isActive });
  if (result.success) {
    await loadRoutes();
  }
};

const saveRoute = async () => {
  // Generate slugs
  routeForm.value.fromLocation.slug = generateSlug(routeForm.value.fromLocation.name, '');
  routeForm.value.toLocation.slug = generateSlug(routeForm.value.toLocation.name, '');

  if (showEditModal.value && editingRoute.value) {
    // Update existing route
    const result = await updateRoute(editingRoute.value.slug, routeForm.value);
    if (result.success) {
      closeModal();
      await loadRoutes();
    }
  } else {
    // Create new route
    const result = await createRoute(routeForm.value);
    if (result.success) {
      closeModal();
      await loadRoutes();
    }
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  editingRoute.value = null;
  // Reset form
  routeForm.value = {
    fromLocation: { name: '', slug: '', latitude: 0, longitude: 0, type: 'airport' },
    toLocation: { name: '', slug: '', latitude: 0, longitude: 0, type: 'airport' },
    distance: 0,
    estimatedDuration: 0,
    averagePrice: 0,
    priceRange: { min: 0, max: 0 },
    popularityScore: 50,
    content: {
      introduction: '',
      whyChooseUs: [],
      faqs: [],
      tips: []
    },
    vehicleTypes: [],
    nearbyRoutes: [],
    isActive: true
  };
};

// Load routes on mount
onMounted(async () => {
  await loadRoutes();
});
</script>

