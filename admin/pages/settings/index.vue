<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900">Settings</h1>
    </div>

    <!-- Current User Info -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Current User</h2>
      <div class="space-y-3">
        <div>
          <span class="text-sm font-medium text-gray-500">Name:</span>
          <p class="text-base text-gray-900">{{ adminUser?.name }}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-500">Email:</span>
          <p class="text-base text-gray-900">{{ adminUser?.email }}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-500">Role:</span>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold"
            :class="{
              'bg-purple-100 text-purple-800': adminUser?.role === 'super_admin',
              'bg-blue-100 text-blue-800': adminUser?.role === 'manager',
              'bg-green-100 text-green-800': adminUser?.role === 'operator'
            }"
          >
            {{ adminUser?.role.replace('_', ' ').toUpperCase() }}
          </span>
        </div>
      </div>
    </div>

    <!-- Permissions -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Your Permissions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(value, key) in adminUser?.permissions" :key="key" class="flex items-center space-x-3">
          <svg v-if="value" class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <span class="text-sm" :class="value ? 'text-gray-700' : 'text-gray-400'">
            {{ formatPermission(key) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Application Settings (Only for Super Admin) -->
    <div v-if="isSuperAdmin" class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Application Settings</h2>
      
      <div class="space-y-6">
        <!-- Business Hours -->
        <div>
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Business Hours</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Opening Time</label>
              <input
                type="time"
                v-model="settings.openingTime"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Closing Time</label>
              <input
                type="time"
                v-model="settings.closingTime"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        <!-- Service Fees -->
        <div>
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Service Fees</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Booking Fee (%)</label>
              <input
                type="number"
                v-model.number="settings.bookingFeePercentage"
                min="0"
                max="100"
                step="0.1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Cancellation Fee (£)</label>
              <input
                type="number"
                v-model.number="settings.cancellationFee"
                min="0"
                step="0.5"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        <!-- Email Notifications -->
        <div>
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Email Notifications</h3>
          <div class="space-y-2">
            <label class="flex items-center space-x-3">
              <input
                type="checkbox"
                v-model="settings.emailNotifications.newBooking"
                class="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <span class="text-sm text-gray-700">New Booking Notifications</span>
            </label>
            <label class="flex items-center space-x-3">
              <input
                type="checkbox"
                v-model="settings.emailNotifications.bookingCancelled"
                class="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <span class="text-sm text-gray-700">Booking Cancelled Notifications</span>
            </label>
            <label class="flex items-center space-x-3">
              <input
                type="checkbox"
                v-model="settings.emailNotifications.paymentReceived"
                class="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <span class="text-sm text-gray-700">Payment Received Notifications</span>
            </label>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end">
          <button
            @click="saveSettings"
            :disabled="isSaving"
            class="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {{ isSaving ? 'Saving...' : 'Save Settings' }}
          </button>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-green-600">{{ successMessage }}</p>
        </div>
      </div>
    </div>

    <!-- Session Management -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Session</h2>
      <button
        @click="handleLogout"
        class="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
      >
        Sign Out
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  middleware: ['admin-auth']
});

const router = useRouter();
const { adminUser, logoutAdmin, isSuperAdmin } = useAdminAuth();

const settings = ref({
  openingTime: '06:00',
  closingTime: '23:00',
  bookingFeePercentage: 5,
  cancellationFee: 10,
  emailNotifications: {
    newBooking: true,
    bookingCancelled: true,
    paymentReceived: true
  }
});

const isSaving = ref(false);
const successMessage = ref('');

const formatPermission = (key: string) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^can /, '')
    .replace(/^./, (str) => str.toUpperCase());
};

const saveSettings = async () => {
  isSaving.value = true;
  successMessage.value = '';

  try {
    // TODO: Save to backend/Firestore
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    successMessage.value = 'Settings saved successfully!';
    
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (error) {
    console.error('Failed to save settings:', error);
  } finally {
    isSaving.value = false;
  }
};

const handleLogout = () => {
  logoutAdmin();
  router.push('/login');
};
</script>

