<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Drivers Management</h1>
      <button
        @click="showAddDriverModal = true"
        class="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Add New Driver</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-sm font-medium text-gray-600">Total Drivers</p>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.total }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-sm font-medium text-gray-600">Online Now</p>
        <p class="text-3xl font-bold text-green-600 mt-2">{{ stats.online }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-sm font-medium text-gray-600">On Trip</p>
        <p class="text-3xl font-bold text-blue-600 mt-2">{{ stats.onTrip }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-sm font-medium text-gray-600">Offline</p>
        <p class="text-3xl font-bold text-gray-600 mt-2">{{ stats.offline }}</p>
      </div>
    </div>

    <!-- Drivers Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trips</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="isLoading">
              <td colspan="8" class="px-6 py-8 text-center">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                <p class="mt-2 text-gray-500">Loading drivers...</p>
              </td>
            </tr>
            <tr v-else-if="drivers.length === 0">
              <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                No drivers found. Click "Add New Driver" to get started.
              </td>
            </tr>
            <tr v-else v-for="driver in drivers" :key="driver.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
                    {{ driver.name.charAt(0) }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ driver.name }}</div>
                    <div class="text-sm text-gray-500">{{ driver.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ driver.phone }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ driver.vehicleModel }}</div>
                <div class="text-sm text-gray-500">{{ driver.vehiclePlate }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ driver.licenseNumber }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    driver.status === 'online' ? 'bg-green-100 text-green-800' :
                    driver.status === 'on-trip' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ driver.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span class="ml-1 text-sm font-medium text-gray-900">{{ driver.rating }}</span>
                  <span class="ml-1 text-sm text-gray-500">({{ driver.totalTrips }})</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ driver.totalTrips }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="editDriver(driver)"
                  class="text-amber-600 hover:text-amber-900 font-medium mr-4"
                >
                  Edit
                </button>
                <button
                  @click="viewDriver(driver)"
                  class="text-blue-600 hover:text-blue-900 font-medium"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Driver Modal (Placeholder) -->
    <div v-if="showAddDriverModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Add New Driver</h2>
        
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input v-model="newDriver.name" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input v-model="newDriver.email" type="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input v-model="newDriver.phone" type="tel" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">License Number</label>
            <input v-model="newDriver.licenseNumber" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Vehicle Model</label>
              <input v-model="newDriver.vehicleModel" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Vehicle Plate</label>
              <input v-model="newDriver.vehiclePlate" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
            </div>
          </div>
        </div>

        <div class="flex space-x-3">
          <button
            @click="addDriver"
            class="flex-1 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors"
          >
            Add Driver
          </button>
          <button
            @click="showAddDriverModal = false"
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

const showAddDriverModal = ref(false);
const isLoading = ref(true);

const stats = ref({
  total: 0,
  online: 0,
  onTrip: 0,
  offline: 0
});

const drivers = ref<any[]>([]);

const newDriver = ref({
  name: '',
  email: '',
  phone: '',
  licenseNumber: '',
  vehicleModel: '',
  vehiclePlate: ''
});

const addDriver = async () => {
  try {
    console.log('[DRIVERS] Adding driver...');
    const { addDriver: addDriverToDb } = useAdminFirestore();
    await addDriverToDb(newDriver.value);
    console.log('[DRIVERS] ✅ Driver added successfully');
    showAddDriverModal.value = false;
    
    // Reset form
    newDriver.value = {
      name: '',
      email: '',
      phone: '',
      licenseNumber: '',
      vehicleModel: '',
      vehiclePlate: ''
    };
    
    // Reload drivers
    await loadDrivers();
  } catch (error: any) {
    console.error('[DRIVERS] ❌ Error adding driver:', error);
    alert('Failed to add driver: ' + error.message);
  }
};

const editDriver = (driver: any) => {
  console.log('[DRIVERS] Edit driver:', driver);
  alert(`Driver: ${driver.name}\nEmail: ${driver.email}\nPhone: ${driver.phone}\nVehicle: ${driver.vehicleModel}\n\nFull edit functionality coming soon!`);
};

const viewDriver = (driver: any) => {
  console.log('[DRIVERS] View driver:', driver);
  alert(`Driver Details:\n\nName: ${driver.name}\nEmail: ${driver.email}\nPhone: ${driver.phone}\nLicense: ${driver.licenseNumber}\nVehicle: ${driver.vehicleModel} (${driver.vehiclePlate})\nStatus: ${driver.status}\nRating: ${driver.rating}\nTotal Trips: ${driver.totalTrips}`);
};

const loadDrivers = async () => {
  isLoading.value = true;
  try {
    console.log('[DRIVERS] Loading drivers from Firestore...');
    const { getAllDrivers } = useAdminFirestore();
    drivers.value = await getAllDrivers();
    
    // Calculate stats
    stats.value = {
      total: drivers.value.length,
      online: drivers.value.filter((d: any) => d.status === 'online').length,
      onTrip: drivers.value.filter((d: any) => d.status === 'on-trip').length,
      offline: drivers.value.filter((d: any) => d.status === 'offline').length
    };
    
    console.log('[DRIVERS] ✅ Loaded', drivers.value.length, 'drivers');
    isLoading.value = false;
  } catch (error: any) {
    console.error('[DRIVERS] ❌ Error loading drivers:', error);
    alert('Failed to load drivers: ' + error.message);
    isLoading.value = false;
  }
};

onMounted(async () => {
  await loadDrivers();
});
</script>

