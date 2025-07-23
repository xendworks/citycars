<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useBookingStore } from '~/stores/booking';
import CustomSelect from './CustomSelect.vue'
import { useRouter } from 'vue-router'
import { useQueryStore, useQuoteStore } from '~/stores/queryStore'

// Add type declarations
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: any;
        };
      };
    };
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
const router = useRouter();

const pickupLocation = ref(queryStore.from);
const dropoffLocation = ref(queryStore.to);
const selectedDateTime = ref(queryStore.pickupDateTime);
const passengersCount = ref(queryStore.passengers);
const luggageCount = ref(queryStore.luggage);

const pickupInput = ref(null);
const dropoffInput = ref(null);
const size = ref('default');
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7;
};

// Generate time slots
const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

onMounted(() => {
  pickupLocation.value = queryStore.from;
  dropoffLocation.value = queryStore.to;
  selectedDateTime.value = queryStore.pickupDateTime;
  passengersCount.value = queryStore.passengers;
  luggageCount.value = queryStore.luggage;
  initAutocomplete(pickupInput, pickupLocation);
  initAutocomplete(dropoffInput, dropoffLocation);
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

const onPickupInput = (e: Event) => {
  pickupLocation.value = (e.target as HTMLInputElement).value;
};

const onDropoffInput = (e: Event) => {
  dropoffLocation.value = (e.target as HTMLInputElement).value;
};

const initAutocomplete = async (inputRef: any, locationRef: any) => {
  if (process.server) return;
  await loadGoogleMaps();
  if (inputRef.value) {
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.value, {
      types: ['establishment', 'geocode'],
      componentRestrictions: { country: 'uk' }
    });
    
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        locationRef.value = place.formatted_address;
        // Set the input value directly to match the selected place
        if (inputRef.value) inputRef.value.value = place.formatted_address;
      }
    });
  }
};

const handlePickupChange = async () => {
  await initAutocomplete(pickupInput, pickupLocation);
};

const handleDropoffChange = async () => {
  await initAutocomplete(dropoffInput, dropoffLocation);
};

function suggestVehicleType(passengers: number, luggages: number): string {
  if (passengers <= 4 && luggages <= 2) return 'saloon';
  if (passengers <= 4 && luggages >= 3 && luggages <= 4) return 'estate';
  if (passengers >= 5 && passengers <= 6 && luggages <= 4) return 'mpv';
  // Optionally, add a checkbox for wheelchair accessible, for now use this logic:
  if (passengers <= 4 && luggages <= 2) return 'wheelchair'; // Only if specifically requested
  return 'saloon'; // fallback
}

const handleSearch = () => {
  const vehicleType = suggestVehicleType(Number(passengersCount.value), Number(luggageCount.value));
  
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
  
  // Navigate directly to booking page with booking ID
  router.push(`/${bookingId}/book`);
};
</script>

<template>
  <div class=" mx-auto p-4 md:p-6 bg-white rounded-xl shadow-lg border border-gray-100 relative">
    <!-- Mobile Layout (Vertical) -->
    <div class="block md:hidden space-y-4">
      <!-- Pickup Location - Full Width -->
      <div class="w-full">
        <label class="block text-sm font-medium text-gray-700 mb-2 font-inter">Pick-up Location</label>
        <div class="relative">
          <input
            ref="pickupInput"
            :value="pickupLocation"
            @input="onPickupInput"
            @change="handlePickupChange"
            autocomplete="off"
            name="pickup-autocomplete"
            type="text"
            placeholder="Eg: Gatwick Airport"
            class="w-full p-3 border-2 border-gray-200 rounded-lg text-sm shadow-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 hover:border-gray-300"
            :disabled="isGoogleMapsLoading"
          />
          <div v-if="isGoogleMapsLoading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-400"></div>
          </div>
        </div>
      </div>

      <!-- Drop-off Location - Full Width -->
      <div class="w-full">
        <label class="block text-sm font-medium text-gray-700 mb-2">Drop-off Location</label>
        <div class="relative">
          <input
            ref="dropoffInput"
            :value="dropoffLocation"
            @input="onDropoffInput"
            @change="handleDropoffChange"
            autocomplete="off"
            name="dropoff-autocomplete"
            type="text"
            placeholder="Eg: SW1 7NL"
            class="w-full p-3 border-2 border-gray-200 rounded-lg text-sm shadow-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 hover:border-gray-300"
            :disabled="isGoogleMapsLoading"
          />
          <div v-if="isGoogleMapsLoading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-400"></div>
          </div>
        </div>
      </div>

      <!-- Date & Time - Full Width -->
      <div class="w-full">
        <label class="block text-sm font-medium text-gray-700 mb-2">Pickup Date & Time</label>
        <input 
          type="datetime-local" 
          v-model="selectedDateTime"
          class="w-full p-3 border-2 border-gray-200 rounded-lg text-sm shadow-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 hover:border-gray-300"
          :min="new Date().toISOString().slice(0, 16)"
        />
      </div>

      <!-- Passengers & Luggage - 50/50 on Mobile -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <CustomSelect
            v-model="passengersCount"
            :options="['1', '2', '3', '4', '5', '6', '7', '8']"
            label="Passengers"
          />
        </div>
        <div>
          <CustomSelect
            v-model="luggageCount"
            :options="['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']"
            label="Luggages"
          />
        </div>
      </div>

      <!-- Search Button - Full Width -->
      <div class="w-full">
        <button 
          @click="handleSearch"
          class="w-full bg-amber-400 hover:bg-amber-500 text-gray-800 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 font-medium"
        >
          <div class="flex items-center justify-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
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
        <label class="block text-sm font-medium text-gray-700 mb-2 font-inter">Pick-up Location</label>
        <div class="relative">
          <input
            ref="pickupInput"
            :value="pickupLocation"
            @input="onPickupInput"
            @change="handlePickupChange"
            autocomplete="off"
            name="pickup-autocomplete"
            type="text"
            placeholder="Eg: Gatwick Airport"
            class="w-full p-3 border-2 border-gray-200 rounded-lg text-sm shadow-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 hover:border-gray-300"
            :disabled="isGoogleMapsLoading"
          />
          <div v-if="isGoogleMapsLoading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-400"></div>
          </div>
        </div>
      </div>

      <!-- Drop-off Location -->
      <div class="flex-1 min-w-0">
        <label class="block text-sm font-medium text-gray-700 mb-2">Drop-off Location</label>
        <div class="relative">
          <input
            ref="dropoffInput"
            :value="dropoffLocation"
            @input="onDropoffInput"
            @change="handleDropoffChange"
            autocomplete="off"
            name="dropoff-autocomplete"
            type="text"
            placeholder="Eg: SW1 7NL"
            class="w-full p-3 border-2 border-gray-200 rounded-lg text-sm shadow-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 hover:border-gray-300"
            :disabled="isGoogleMapsLoading"
          />
          <div v-if="isGoogleMapsLoading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-400"></div>
          </div>
        </div>
      </div>

      <!-- Date Picker -->
      <div class="flex-1 min-w-0">
        <label class="block text-sm font-medium text-gray-700 mb-2">Pickup Date & Time</label>
        <input 
          type="datetime-local" 
          v-model="selectedDateTime"
          class="w-full p-3 border-2 border-gray-200 rounded-lg text-sm shadow-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 hover:border-gray-300"
          :min="new Date().toISOString().slice(0, 16)"
        />
      </div>

      <!-- Passengers -->
      <div class="flex-1 min-w-0">
        <CustomSelect
          v-model="passengersCount"
          :options="['1', '2', '3', '4', '5', '6', '7', '8']"
          label="Passengers"
        />
      </div>

      <!-- Luggage -->
      <div class="flex-1 min-w-0">
        <CustomSelect
          v-model="luggageCount"
          :options="['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']"
          label="Luggages"
        />
      </div>

      <!-- Search Button -->
      <div class="flex-shrink-0">
        <button 
          @click="handleSearch"
          class="bg-amber-400 hover:bg-amber-500 text-gray-800 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
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
