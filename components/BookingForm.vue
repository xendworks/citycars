<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBookingStore } from '~/stores/booking';

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

const API_KEY = 'AIzaSyACZ4JkEhZZAhafla2ePLtmNL7ktaxV8KM'; // Replace with your actual API key

const pickupLocation = ref('');
const dropoffLocation = ref('');
const pickupInput = ref(null);
const dropoffInput = ref(null);
const selectedDate = ref('');
const selectedTime = ref('');
const passengersCount = ref(1);
const luggageCount = ref(0);
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

const loadGoogleMaps = () => {
  if (process.server) return Promise.resolve();
  if (window.google && window.google.maps) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const initAutocomplete = async (inputRef: any, locationRef: any) => {
  if (process.server) return;
  await loadGoogleMaps();
  if (inputRef.value) {
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.value, {
      types: ['geocode'],
      componentRestrictions: { country: 'gb' },
      fields: ['formatted_address', 'geometry', 'name'],
    });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      locationRef.value = place.formatted_address || place.name;
    });
  }
};

onMounted(() => {
  initAutocomplete(pickupInput, pickupLocation);
  initAutocomplete(dropoffInput, dropoffLocation);
});

const handlePickupChange = async () => {
  await initAutocomplete(pickupInput, pickupLocation);
};

const handleDropoffChange = async () => {
  await initAutocomplete(dropoffInput, dropoffLocation);
};

const handleSearch = () => {
  const bookingData = {
    pickupLocation: pickupLocation.value,
    dropoffLocation: dropoffLocation.value,
    pickupDate: selectedDate.value,
    pickupTime: selectedTime.value,
    passengersCount: passengersCount.value,
    luggageCount: luggageCount.value,
  };

  // Store in Pinia
  bookingStore.setBookingData(bookingData);
  
  // Emit to parent
  emit('search', bookingData);
};
</script>

<template>
  <div class="max-w-lg mx-auto p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Pickup Location -->
      <div class="relative">
        <label class="block text-sm font-medium text-gray-700">Pick-up Location</label>
        <input
          ref="pickupInput"
          v-model="pickupLocation"
          type="text"
          placeholder="Start typing a location..."
          class="w-full p-2 border rounded-md text-sm"
          @change="handlePickupChange"
        />
      </div>

      <!-- Drop-off Location -->
      <div class="relative">
        <label class="block text-sm font-medium text-gray-700">Drop-off Location</label>
        <input
          ref="dropoffInput"
          v-model="dropoffLocation"
          type="text"
          placeholder="Enter drop-off location..."
          class="w-full p-2 border rounded-md text-sm"
          @change="handleDropoffChange"
        />
      </div>

      <!-- Date Picker -->
      <div class="md:col-span-1">
        <label class="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
        <input 
          type="date" 
          v-model="selectedDate"
          class="w-full p-2 border rounded-md text-sm"
          :min="new Date().toISOString().split('T')[0]"
        />
      </div>

      <!-- Time Picker -->
      <div class="md:col-span-1">
        <label class="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
        <select 
          v-model="selectedTime"
          class="w-full p-2 border rounded-md text-sm"
        >
          <option value="">Select time</option>
          <option v-for="time in timeSlots" :key="time" :value="time">
            {{ time }}
          </option>
        </select>
      </div>

      <!-- Passengers -->
      <div class="md:col-span-1">
        <label class="block text-sm font-medium text-gray-700 mb-1 font-lexend">Passengers</label>
        <select v-model="passengersCount" class="w-full p-2 border rounded-md text-sm font-inter">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
        </select>
      </div>

      <!-- Luggage -->
      <div class="md:col-span-1 flex flex-col">
        <label class="block text-sm font-medium text-gray-700 mb-1 font-lexend">Luggages</label>
        <div class="flex items-center">
          <select v-model="luggageCount" class="w-full p-2 border rounded-md text-sm font-inter">
            <option>0</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
          </select>
          <button 
            @click="handleSearch"
            class="ml-2 bg-amber-400 hover:bg-amber-500 text-white p-2 rounded-md transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  font-family: Arial, sans-serif;
}
</style>
