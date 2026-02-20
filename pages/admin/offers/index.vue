<template>
  <div class="p-4 transition-colors">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Offers & Promotions</h1>
      <Button variant="primary" size="lg" @click="showCreateModal = true">
        <el-icon class="mr-1">
          <Plus />
        </el-icon>
        <span>Create New Offer</span>
      </Button>
    </div>

    <!-- Offers Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="col-span-full">
        <AdminLoader text="Synchronizing Promotions..." />
      </div>

      <!-- Empty State -->
      <div v-else-if="offers.length === 0" class="col-span-full py-20 text-center">
        <div class="max-w-md mx-auto space-y-6">
          <div
            class="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-slate-300 dark:text-slate-600 mx-auto border border-slate-100/50 dark:border-white/5 transition-colors">
            <el-icon size="32">
              <MagicStick />
            </el-icon>
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-bold text-slate-900 dark:text-white font-sora transition-colors">No Active Campaigns
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed transition-colors">
              Incentivize your passengers with
              exclusive promotions and discount tiers to drive higher engagement.</p>
          </div>
          <Button variant="primary" size="xl" @click="showCreateModal = true" class="uppercase tracking-widest">
            Initialize Promotion
          </Button>
        </div>
      </div>

      <!-- Offers Cards -->
      <div v-for="offer in offers" :key="offer.id"
        class="bg-white dark:bg-slate-900 h-[360px] rounded-xl shadow-md overflow-hidden hover:shadow-lg border border-gray-200 dark:border-white/5 transition-all duration-300 flex flex-col">
        <div class="p-6 flex flex-col flex-1">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white transition-colors">{{ offer.title }}</h3>
            <span :class="[
              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
              offer.isActive ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-slate-400'
            ]">
              {{ offer.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <div class="mb-4">
            <p
              class="text-sm text-gray-600 dark:text-slate-400 transition-colors leading-relaxed tracking-tight font-medium line-clamp-2">
              {{ offer.description }}
            </p>
            <button v-if="offer.description?.length > 80" @click="openDescription(offer)"
              class="text-xs text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 font-semibold mt-1 transition-colors">
              Read More
            </button>
          </div>

          <div class="space-y-3 mb-6 transition-colors">
            <div class="flex items-center text-sm">
              <span class="font-medium text-gray-700 dark:text-slate-500 w-24">Discount:</span>
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

          <div class="flex space-x-2 mt-auto">
            <Button variant="white" size="sm" @click="editOffer(offer)" class="flex-1">
              Edit
            </Button>
            <Button variant="white" size="sm" @click="toggleOffer(offer)" :loading="loadingItems[offer.id]"
              class="flex-1">
              {{ offer.isActive ? 'Deactivate' : 'Activate' }}
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          {{ isEditMode ? 'Edit Offer' : 'Create New Offer' }}
        </h2>

        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Offer Title</label>
            <input v-model="newOffer.title" type="text" required placeholder="e.g., Summer Special"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea v-model="newOffer.description" rows="3" required placeholder="Describe your offer..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
              <input v-model="newOffer.code" type="text" required placeholder="SUMMER2024"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Discount %</label>
              <input v-model.number="newOffer.discountPercent" type="number" required placeholder="15"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Valid Until</label>
            <input v-model="newOffer.validUntil" type="date" required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
          </div>

          <div>
            <label class="flex items-center">
              <input v-model="newOffer.isActive" type="checkbox"
                class="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500" />
              <span class="ml-2 text-sm text-gray-700">Activate offer immediately</span>
            </label>
          </div>
        </div>

        <div class="flex space-x-3">
          <Button variant="primary" size="lg" @click="isEditMode ? saveEdit() : createOffer()" :loading="isSubmitting"
            class="flex-1">
            {{ isEditMode ? 'Save Changes' : 'Create Offer' }}
          </Button>
          <Button variant="white" size="lg" @click="closeModal" :disabled="isSubmitting" class="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>

    <!-- Description Read More Modal -->
    <div v-if="showDescriptionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        class="bg-white dark:bg-slate-900 rounded-lg p-8 max-w-lg w-full mx-4 border border-transparent dark:border-white/10">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {{ selectedDescriptionOffer?.title }}
        </h2>
        <div class="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <p class="text-sm text-gray-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
            {{ selectedDescriptionOffer?.description }}
          </p>
        </div>
        <div class="mt-6 flex justify-end">
          <Button variant="white" @click="showDescriptionModal = false">
            Close
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { MagicStick, Plus } from '@element-plus/icons-vue';

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
  ssr: false
});

const showCreateModal = ref(false);
const showDescriptionModal = ref(false);
const selectedDescriptionOffer = ref<any>(null);
const isLoading = ref(true);
const isSubmitting = ref(false);
const loadingItems = ref<Record<string, boolean>>({});
const offers = ref<any[]>([]);
const isEditMode = ref(false);
const editingOfferId = ref('');

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

const openDescription = (offer: any) => {
  selectedDescriptionOffer.value = offer;
  showDescriptionModal.value = true;
};

const createOffer = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const { createOffer: createOfferInDb } = useAdminFirestore();
    await createOfferInDb(newOffer.value);
    closeModal();

    // Reload offers
    await loadOffers();
  } catch (error: any) {
    const { adminUser } = useAdminAuth();
    console.error('[OFFERS] ❌ Error creating offer:', {
      error,
      user: adminUser.value?.email,
      role: adminUser.value?.role
    });
    alert(`Failed to create offer. \n\nRole: ${adminUser.value?.role || 'None'} \nError: ${error.message}`);
  } finally {
    isSubmitting.value = false;
  }
};

const editOffer = (offer: any) => {

  // Set edit mode and store offer ID
  isEditMode.value = true;
  editingOfferId.value = offer.id;

  // Pre-fill form with offer data
  newOffer.value = {
    title: offer.title || '',
    description: offer.description || '',
    code: offer.code || '',
    discountPercent: offer.discountPercent || 0,
    validUntil: formatDateForInput(offer.validUntil),
    isActive: offer.isActive || false
  };

  // Show modal
  showCreateModal.value = true;
};

const saveEdit = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const { updateOffer } = useAdminFirestore();
    await updateOffer(editingOfferId.value, newOffer.value);
    closeModal();

    // Reload offers to show updated data
    await loadOffers();
  } catch (error: any) {
    console.error('[OFFERS] ❌ Error updating offer:', error);
    alert('Failed to update offer: ' + error.message);
  } finally {
    isSubmitting.value = false;
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  isEditMode.value = false;
  editingOfferId.value = '';

  // Reset form
  newOffer.value = {
    title: '',
    description: '',
    code: '',
    discountPercent: 0,
    validUntil: '',
    isActive: false
  };
};

const formatDateForInput = (dateValue: any) => {
  if (!dateValue) return '';
  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue.toDate();
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format for input[type="date"]
  } catch (e) {
    return '';
  }
};

const toggleOffer = async (offer: any) => {
  if (loadingItems.value[offer.id]) return;
  loadingItems.value[offer.id] = true;
  try {
    const newStatus = !offer.isActive;

    const { toggleOfferStatus } = useAdminFirestore();
    await toggleOfferStatus(offer.id, newStatus);

    // Update local state
    offer.isActive = newStatus;

  } catch (error: any) {
    console.error('[OFFERS] ❌ Error toggling offer:', error);
    alert('Failed to update offer status: ' + error.message);
  } finally {
    loadingItems.value[offer.id] = false;
  }
};

const loadOffers = async () => {
  isLoading.value = true;
  try {
    const { getAllOffers } = useAdminFirestore();
    offers.value = await getAllOffers();
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
