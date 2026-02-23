<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { useBookingStore } from '~/stores/booking';
import { useAuthStore } from '~/stores/auth';
import CustomSelect from './CustomSelect.vue'
import { useRouter, useRoute } from 'vue-router'
import { useQueryStore, useQuoteStore } from '~/stores/queryStore'
import { suggestVehicleType, CAB_TYPES } from '~/constants/cabs'
import { PRICING_CONFIG, calculateSaloonFare } from '~/utils/pricing'

// Add type declarations for NEW PlaceAutocompleteElement API
declare global {
  interface Window {
    google: {
      maps: {
        Map: any
        DirectionsService: any
        DirectionsRenderer: any
        Marker: any
        SymbolPath: any
        OverlayView: any
        TrafficLayer: any
        importLibrary: (library: string) => Promise<any>
        places: {
          Autocomplete: any
          PlaceAutocompleteElement: any
        }
      }
    }
  }
}

const emit = defineEmits(['search']);
const bookingStore = useBookingStore();
const { $googleMaps, $googleMapsLoading, $googleMapsLoaded } = useNuxtApp()

// Add loading state
const isGoogleMapsLoading = ref(false)

const API_KEY = 'AIzaSyACZ4JkEhZZAhafla2ePLtmNL7ktaxV8KM'; // Replace with your actual API key

const queryStore = useQueryStore();
const quoteStore = useQuoteStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const userProfile = computed(() => authStore.userProfile);

const pickupLocation = ref(queryStore.from);
const dropoffLocation = ref(queryStore.to);
const selectedDateTime = ref(queryStore.pickupDateTime);
const passengersCount = ref(queryStore.passengers);
const luggageCount = ref(queryStore.luggage);

const pickupInput = ref(null);
const dropoffInput = ref(null);
const pickupAutocomplete = ref<any>(null);
const dropoffAutocomplete = ref<any>(null);
const pickupContainer = ref<HTMLElement | null>(null);
const dropoffContainer = ref<HTMLElement | null>(null);
const size = ref('default');
const isPickupFocused = ref(false);
const isDropoffFocused = ref(false);

const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7;
};

// Generate time slots
const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

const predictedDestinationMessage = ref('');
const showPrediction = ref(false);

const applyPrediction = () => {
  const currentHour = new Date().getHours();
  if (currentHour >= 6 && currentHour <= 11) {
    dropoffLocation.value = userProfile.value!.preferredDropoffLocations![0];
  } else {
    dropoffLocation.value = userProfile.value!.preferredPickupLocations![0];
  }
  showPrediction.value = false;
};

onMounted(async () => {
  pickupLocation.value = queryStore.from;
  dropoffLocation.value = queryStore.to;
  selectedDateTime.value = queryStore.pickupDateTime;
  passengersCount.value = queryStore.passengers;
  luggageCount.value = queryStore.luggage;

  // Wait for next tick to ensure DOM is ready
  await nextTick();

  // Predictive Destination Logic
  setTimeout(() => {
    if (userProfile.value && !dropoffLocation.value && !pickupLocation.value) {
      const currentHour = new Date().getHours();
      const hasPickups = userProfile.value.preferredPickupLocations?.length > 0;
      const hasDropoffs = userProfile.value.preferredDropoffLocations?.length > 0;

      if (currentHour >= 6 && currentHour <= 11 && hasDropoffs) {
        // Morning: maybe heading to the first saved dropoff (like Office)
        predictedDestinationMessage.value = `Morning! Heading to ${userProfile.value.preferredDropoffLocations[0]}?`;
        showPrediction.value = true;
      } else if (currentHour >= 15 && currentHour <= 20 && hasPickups) {
        // Evening: maybe heading back to first saved pickup (like Home)
        predictedDestinationMessage.value = `Good evening! Heading back to ${userProfile.value.preferredPickupLocations[0]}?`;
        showPrediction.value = true;
      }
    }
  }, 1000);

  // Load Google Maps first, then initialize autocomplete
  try {
    await loadGoogleMaps();

    // Wait a bit more to ensure the API is fully ready
    setTimeout(async () => {
      await initAutocomplete(pickupInput, pickupLocation, true);
      await initAutocomplete(dropoffInput, dropoffLocation, false);
    }, 500);
  } catch (error) {
    console.error('Failed to load Google Maps:', error);
  }
});

watch([pickupLocation, dropoffLocation, selectedDateTime, passengersCount, luggageCount], () => {
  queryStore.setQueryData({
    from: pickupLocation.value,
    to: dropoffLocation.value,
    passengers: Number(passengersCount.value),
    luggage: Number(luggageCount.value),
    pickupDateTime: selectedDateTime.value
  });
});

const loadGoogleMaps = () => {
  if (process.server) return Promise.resolve();
  isGoogleMapsLoading.value = true;
  return ($googleMaps as () => Promise<any>)().finally(() => {
    isGoogleMapsLoading.value = false;
  });
};

// Removed onPickupInput and onDropoffInput - using v-model instead

const initAutocomplete = async (inputRef: any, locationRef: any, isPickup: boolean) => {
  if (process.server) return;

  try {

    // Don't re-initialize if already exists
    if (isPickup && pickupAutocomplete.value) {
      console.log('Pickup autocomplete already initialized');
      return;
    }
    if (!isPickup && dropoffAutocomplete.value) {
      console.log('Dropoff autocomplete already initialized');
      return;
    }

    // Wait for input element to be available
    if (!inputRef.value) {
      console.warn(`Input ref not available for ${isPickup ? 'pickup' : 'dropoff'}`);
      setTimeout(() => {
        if (inputRef.value) {
          initAutocomplete(inputRef, locationRef, isPickup);
        }
      }, 300);
      return;
    }

    // Create the CLASSIC Autocomplete (yes it's "deprecated" but it WORKS!)
    //@ts-ignore
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.value, {
      componentRestrictions: { country: 'gb' },
      fields: ['formatted_address', 'geometry', 'name', 'address_components']
    });

    // Store the autocomplete instance
    if (isPickup) {
      pickupAutocomplete.value = autocomplete;
    } else {
      dropoffAutocomplete.value = autocomplete;
    }

    // Listen for place selection
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        console.warn('No geometry found for place');
        return;
      }

      // Google automatically fills the input with the place name
      // We just need to sync it with our v-model by reading the input value
      // This ensures the input shows EXACTLY what the user clicked in the dropdown
      locationRef.value = inputRef.value.value;

    });


  } catch (error) {
    console.error(`❌ Error initializing Autocomplete for ${isPickup ? 'pickup' : 'dropoff'}:`, error);
  }
};

const handlePickupChange = async () => {
  // Re-initialize if autocomplete doesn't exist or if input is empty
  if (!pickupAutocomplete.value && pickupInput.value) {
    await nextTick();
    await initAutocomplete(pickupInput, pickupLocation, true);
  }
};

const handleDropoffChange = async () => {
  // Re-initialize if autocomplete doesn't exist or if input is empty
  if (!dropoffAutocomplete.value && dropoffInput.value) {
    await nextTick();
    await initAutocomplete(dropoffInput, dropoffLocation, false);
  }
};

const handlePickupFocus = async () => {
  isPickupFocused.value = true;
  await handlePickupChange();
};

const handleDropoffFocus = async () => {
  isDropoffFocused.value = true;
  await handleDropoffChange();
};

const handlePickupBlur = () => {
  setTimeout(() => isPickupFocused.value = false, 200);
};

const handleDropoffBlur = () => {
  setTimeout(() => isDropoffFocused.value = false, 200);
};

const handleSearch = (aiSuggestedVehicleType?: string | Event) => {
  const isDirectString = typeof aiSuggestedVehicleType === 'string';
  const vehicleType = isDirectString ? aiSuggestedVehicleType : suggestVehicleType(Number(passengersCount.value), Number(luggageCount.value));

  // Create a unique booking ID
  const bookingId = Date.now().toString();

  // Store in Pinia with booking ID
  queryStore.setQueryData({
    from: pickupLocation.value,
    to: dropoffLocation.value,
    passengers: Number(passengersCount.value),
    luggage: Number(luggageCount.value),
    pickupDateTime: selectedDateTime.value,
    vehicleType
  });

  // Save quote details with booking ID
  quoteStore.saveQuote(bookingId, {
    from: pickupLocation.value,
    to: dropoffLocation.value,
    passengers: Number(passengersCount.value),
    luggage: Number(luggageCount.value),
    pickupDateTime: selectedDateTime.value,
    cabType: vehicleType, // Changed from vehicleType to cabType to match booking page
    fare: 50 // Default fare, you can calculate this based on distance
  });

  // Check if we're already on the quote page
  if (route.path === '/quote') {
    console.log('🔍 Already on quote page, emitting search event');
    // Emit event to parent to trigger search
    emit('search', {
      from: pickupLocation.value,
      to: dropoffLocation.value,
      passengers: Number(passengersCount.value),
      luggage: Number(luggageCount.value),
      pickupDateTime: selectedDateTime.value,
      vehicleType,
      bookingId
    });
  } else {
    console.log('🚀 Navigating to quote page');
    // Navigate to quote page with booking ID
    router.push(`/quote?bookingId=${bookingId}`);
  }
};
</script>

<template>
  <div class=" mx-auto bg-white rounded-xl shadow-lg border border-gray-100 relative overflow-hidden">
    <!-- Container Padding -->
    <div class="p-4 md:p-6">

      <!-- Predictive Prediction Toast -->
      <div v-if="showPrediction"
        class="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between shadow-sm animate-fade-in-down">
        <div class="flex items-center gap-3">
          <span class="text-2xl">🔮</span>
          <p class="text-sm font-medium text-blue-900">{{ predictedDestinationMessage }}</p>
        </div>
        <div class="flex items-center gap-2">
          <button @click="applyPrediction"
            class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors">Yes,
            book it</button>
          <button @click="showPrediction = false" class="px-3 py-1.5 text-gray-400 hover:text-gray-600"><svg
              class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg></button>
        </div>
      </div>

      <!-- Mobile Layout (Vertical) -->
      <div class="block md:hidden space-y-4">
        <!-- Pickup Location - Full Width -->
        <div class="w-full">
          <label class="block text-left text-sm font-medium text-gray-700 mb-2 font-inter">Pick-up Location</label>
          <div class="relative">
            <input ref="pickupInput" v-model="pickupLocation" @focus="handlePickupFocus" @blur="handlePickupBlur"
              @change="handlePickupChange" autocomplete="off" name="pickup-autocomplete" type="text"
              placeholder="Eg: Gatwick Airport"
              class="w-full p-3  border border-gray-200 rounded-lg text-base shadow-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 hover:border-gray-300"
              :disabled="isGoogleMapsLoading" />
          </div>
          <!-- Saved Pickup Addresses -->
          <div v-if="userProfile?.preferredPickupLocations?.length && !pickupLocation && isPickupFocused"
            class="mt-2 flex flex-wrap gap-2 transition-all">
            <button v-for="(loc, idx) in userProfile.preferredPickupLocations" :key="idx" @click="pickupLocation = loc"
              class="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200 hover:bg-green-100 transition-colors truncate max-w-[200px]"
              title="Use saved address">
              ★ {{ loc }}
            </button>
          </div>
        </div>

        <!-- Drop-off Location - Full Width -->
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700 mb-2">Drop-off Location</label>
          <div class="relative">
            <input ref="dropoffInput" v-model="dropoffLocation" @focus="handleDropoffFocus" @blur="handleDropoffBlur"
              @change="handleDropoffChange" autocomplete="off" name="dropoff-autocomplete" type="text"
              placeholder="Eg: SW1 7NL"
              class="w-full p-3 border border-gray-200 rounded-lg text-base shadow-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 hover:border-gray-300"
              :disabled="isGoogleMapsLoading" />
          </div>
          <!-- Saved Dropoff Addresses -->
          <div v-if="userProfile?.preferredDropoffLocations?.length && !dropoffLocation && isDropoffFocused"
            class="mt-2 flex flex-wrap gap-2 transition-all">
            <button v-for="(loc, idx) in userProfile.preferredDropoffLocations" :key="idx"
              @click="dropoffLocation = loc"
              class="text-[10px] bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200 hover:bg-red-100 transition-colors truncate max-w-[200px]"
              title="Use saved address">
              ★ {{ loc }}
            </button>
          </div>
        </div>

        <!-- Date & Time - Full Width -->
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700 mb-2">Pickup Date & Time</label>
          <input type="datetime-local" v-model="selectedDateTime"
            class="w-full p-3 border border-gray-200 rounded-lg text-sm shadow-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 hover:border-gray-300"
            :min="new Date().toISOString().slice(0, 16)" />
        </div>

        <!-- Passengers & Luggage - 50/50 on Mobile -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <CustomSelect v-model="passengersCount" :options="['1', '2', '3', '4', '5', '6', '7', '8']"
              label="Passengers" />
          </div>
          <div>
            <CustomSelect v-model="luggageCount" :options="['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']"
              label="Luggages" />
          </div>
        </div>

        <!-- Search Button - Full Width -->
        <div class="w-full">
          <button @click="handleSearch"
            class="w-full bg-amber-400 hover:bg-amber-500 text-gray-800 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 font-medium">
            <div class="flex items-center justify-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd" />
              </svg>
              <span>Search & Book</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Desktop Layout (Horizontal) -->
      <div class="hidden md:flex flex-col lg:flex-row items-end gap-4">
        <!-- Pickup Location -->
        <div class="flex-1 min-w-0">
          <label class="block text-left text-sm font-medium text-gray-700 mb-2 font-inter">Pick-up Location</label>
          <div class="relative">
            <input ref="pickupInput" v-model="pickupLocation" @focus="handlePickupFocus" @blur="handlePickupBlur"
              @change="handlePickupChange" autocomplete="off" name="pickup-autocomplete" type="text"
              placeholder="Eg: Gatwick Airport"
              class="w-full p-3  border border-gray-300 rounded-lg text-sm shadow-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 hover:border-gray-300"
              :disabled="isGoogleMapsLoading" />
            <div v-if="isGoogleMapsLoading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-400"></div>
            </div>
          </div>
          <!-- Saved Pickup Addresses -->
          <div v-if="userProfile?.preferredPickupLocations?.length && !pickupLocation && isPickupFocused"
            class="mt-2 absolute flex flex-wrap gap-2 z-10 bg-white p-2 rounded-lg shadow-lg border border-gray-100 w-[max-content] max-w-xs transition-opacity duration-200">
            <p class="w-full text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Saved Pickups</p>
            <button v-for="(loc, idx) in userProfile.preferredPickupLocations" :key="idx" @click="pickupLocation = loc"
              class="w-full text-left text-xs bg-green-50 text-green-700 px-3 py-2 rounded-md border border-green-100 hover:bg-green-100 transition-colors truncate"
              title="Use saved pickup">
              <span class="mr-1">⭐</span> {{ loc }}
            </button>
          </div>
        </div>

        <!-- Drop-off Location -->
        <div class="flex-1 min-w-0">
          <label class="block text-left text-sm font-medium text-gray-700 mb-2">Drop-off Location</label>
          <div class="relative">
            <input ref="dropoffInput" v-model="dropoffLocation" @focus="handleDropoffFocus" @blur="handleDropoffBlur"
              @change="handleDropoffChange" autocomplete="off" name="dropoff-autocomplete" type="text"
              placeholder="Eg: SW1 7NL"
              class="w-full p-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 hover:border-gray-300"
              :disabled="isGoogleMapsLoading" />
            <div v-if="isGoogleMapsLoading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-400"></div>
            </div>
          </div>
          <!-- Saved Dropoff Addresses -->
          <div v-if="userProfile?.preferredDropoffLocations?.length && !dropoffLocation && isDropoffFocused"
            class="mt-2 absolute flex flex-wrap gap-2 z-10 bg-white p-2 rounded-lg shadow-lg border border-gray-100 w-[max-content] max-w-xs transition-opacity duration-200">
            <p class="w-full text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Saved Dropoffs</p>
            <button v-for="(loc, idx) in userProfile.preferredDropoffLocations" :key="idx"
              @click="dropoffLocation = loc"
              class="w-full text-left text-xs bg-red-50 text-red-700 px-3 py-2 rounded-md border border-red-100 hover:bg-red-100 transition-colors truncate"
              title="Use saved dropoff">
              <span class="mr-1">⭐</span> {{ loc }}
            </button>
          </div>
        </div>

        <!-- Date Picker -->
        <div class="flex-1 min-w-0">
          <label class="block text-left text-sm font-medium text-gray-700 mb-2">Pickup Date & Time</label>
          <input type="datetime-local" v-model="selectedDateTime"
            class="w-full p-3  border border-gray-300 rounded-lg text-sm shadow-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 hover:border-gray-300"
            :min="new Date().toISOString().slice(0, 16)" />
        </div>

        <!-- Passengers -->
        <div class="flex-1 min-w-0">
          <CustomSelect v-model="passengersCount" :options="['1', '2', '3', '4', '5', '6', '7', '8']"
            label="Passengers" />
        </div>

        <!-- Luggage -->
        <div class="flex-1 min-w-0">
          <CustomSelect v-model="luggageCount" :options="['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']"
            label="Luggages" />
        </div>

        <!-- Search Button -->
        <div class="flex-shrink-0">
          <button @click="handleSearch"
            class="bg-amber-400 hover:bg-amber-500 text-gray-800 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div> <!-- end container block -->
  </div> <!-- end main component wrapper -->
</template>

<style scoped>
/* Allow dropdowns to extend beyond container */
.relative {
  overflow: visible !important;
}

/* Ensure dropdowns can extend beyond container */
:deep([role="listbox"]) {
  overflow: visible !important;
}

/* Override any overflow hidden on the main container */
:deep(.bg-white) {
  overflow: visible !important;
}
</style>

<style>
/* Custom styling for Google Places Autocomplete dropdown */
/* (Google renders these outside the component, so we can style them normally) */
.pac-container {
  border-radius: 0.5rem !important;
  border: 1px solid #d1d5db !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
  margin-top: 8px !important;
  padding: 4px 0 !important;
  background: #ffffff !important;
  overflow: hidden !important;
  z-index: 9999 !important;
}

.pac-item {
  padding: 6px 10px !important;
  font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
  font-size: 12px !important;
  color: #111827 !important;
  border: none !important;
  border-top: 1px solid #f3f4f6 !important;
  cursor: pointer !important;
  transition: background-color 0.15s ease !important;
  line-height: 1.5 !important;
}

.pac-item:first-child {
  border-top: none !important;
}

.pac-item:hover,
.pac-item-selected {
  background-color: #fef3c7 !important;
}

.pac-item-query {
  font-size: 12px !important;
  color: #111827 !important;
  font-weight: 500 !important;
}

.pac-matched {
  font-weight: 600 !important;
  color: #f59e0b !important;
}
</style>
