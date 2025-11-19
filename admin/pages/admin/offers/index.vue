<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Offers & Promotions</h1>
      <button
        @click="showCreateModal = true"
        class="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Create New Offer</span>
      </button>
    </div>

    <!-- Offers Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="col-span-full flex justify-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="offers.length === 0" class="col-span-full text-center py-12">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No offers yet</h3>
        <p class="mt-2 text-sm text-gray-500">Get started by creating your first promotional offer.</p>
      </div>

      <!-- Offers Cards -->
      <div
        v-for="offer in offers"
        :key="offer.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">{{ offer.title }}</h3>
            <span
              :class="[
                'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                offer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              ]"
            >
              {{ offer.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <p class="text-sm text-gray-600 mb-4">{{ offer.description }}</p>

          <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm">
              <span class="font-medium text-gray-700 w-24">Discount:</span>
              <span class="text-gray-900">{{ offer.discountPercent }}% OFF</span>
            </div>
            <div class="flex items-center text-sm">
              <span class="font-medium text-gray-700 w-24">Code:</span>
              <span class="text-amber-600 font-mono font-bold">{{ offer.code }}</span>
            </div>
            <div class="flex items-center text-sm">
              <span class="font-medium text-gray-700 w-24">Valid Until:</span>
              <span class="text-gray-900">{{ formatDate(offer.validUntil) }}</span>
            </div>
            <div class="flex items-center text-sm">
              <span class="font-medium text-gray-700 w-24">Used:</span>
              <span class="text-gray-900">{{ offer.usedCount }} times</span>
            </div>
          </div>

          <div class="flex space-x-2">
            <button
              @click="editOffer(offer)"
              class="flex-1 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-sm font-semibold transition-colors"
            >
              Edit
            </button>
            <button
              @click="toggleOffer(offer)"
              class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
            >
              {{ offer.isActive ? 'Deactivate' : 'Activate' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal (Placeholder) -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Create New Offer</h2>
        
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Offer Title</label>
            <input v-model="newOffer.title" type="text" required placeholder="e.g., Summer Special" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea v-model="newOffer.description" rows="3" required placeholder="Describe your offer..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
              <input v-model="newOffer.code" type="text" required placeholder="SUMMER2024" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Discount %</label>
              <input v-model.number="newOffer.discountPercent" type="number" required placeholder="15" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Valid Until</label>
            <input v-model="newOffer.validUntil" type="date" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
          </div>

          <div>
            <label class="flex items-center">
              <input v-model="newOffer.isActive" type="checkbox" class="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500" />
              <span class="ml-2 text-sm text-gray-700">Activate offer immediately</span>
            </label>
          </div>
        </div>

        <div class="flex space-x-3">
          <button
            @click="createOffer"
            class="flex-1 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors"
          >
            Create Offer
          </button>
          <button
            @click="showCreateModal = false"
            class="flex-1 px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const showCreateModal = ref(false);
const isLoading = ref(true);
const offers = ref<any[]>([]);

const newOffer = ref({
  title: '',
  description: '',
  code: '',
  discountPercent: 0,
  validUntil: '',
  isActive: false
});

const formatDate = (dateString: any) => {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString.toDate();
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

const createOffer = async () => {
  try {
    console.log('[OFFERS] Creating offer...');
    const { createOffer: createOfferInDb } = useAdminFirestore();
    await createOfferInDb(newOffer.value);
    console.log('[OFFERS] ✅ Offer created successfully');
    showCreateModal.value = false;
    
    // Reset form
    newOffer.value = {
      title: '',
      description: '',
      code: '',
      discountPercent: 0,
      validUntil: '',
      isActive: false
    };
    
    // Reload offers
    await loadOffers();
  } catch (error: any) {
    console.error('[OFFERS] ❌ Error creating offer:', error);
    alert('Failed to create offer: ' + error.message);
  }
};

const editOffer = (offer: any) => {
  console.log('[OFFERS] Edit offer:', offer);
  alert(`Offer: ${offer.title}\nCode: ${offer.code}\nDiscount: ${offer.discountPercent}%\n\nFull edit functionality coming soon!`);
};

const toggleOffer = async (offer: any) => {
  try {
    const newStatus = !offer.isActive;
    console.log('[OFFERS] Toggle offer:', offer.id, newStatus);
    
    const { toggleOfferStatus } = useAdminFirestore();
    await toggleOfferStatus(offer.id, newStatus);
    
    // Update local state
    offer.isActive = newStatus;
    
    console.log('[OFFERS] ✅ Offer', newStatus ? 'activated' : 'deactivated');
  } catch (error: any) {
    console.error('[OFFERS] ❌ Error toggling offer:', error);
    alert('Failed to update offer status: ' + error.message);
  }
};

const loadOffers = async () => {
  isLoading.value = true;
  try {
    console.log('[OFFERS] Loading offers from Firestore...');
    const { getAllOffers } = useAdminFirestore();
    offers.value = await getAllOffers();
    console.log('[OFFERS] ✅ Loaded', offers.value.length, 'offers');
    isLoading.value = false;
  } catch (error: any) {
    console.error('[OFFERS] ❌ Error loading offers:', error);
    isLoading.value = false;
  }
};

onMounted(async () => {
  await loadOffers();
});
</script>

