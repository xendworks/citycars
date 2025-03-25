<template>
    <div class="bg-white p-1 rounded-lg max-w-4xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1 font-lexend">Pick-up Location</label>
              <input type="text" placeholder="Eg: Gatwick Airport" class="w-full p-2 border rounded-md text-sm font-inter">
            </div>
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1 font-lexend">Drop-off Location</label>
              <input type="text" placeholder="Eg: SW1 7NL" class="w-full p-2 border rounded-md text-sm font-inter">
            </div>
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1 font-lexend">Pickup Date & Time</label>
              <input type="text" placeholder="13-06-2024 14:30" class="w-full p-2 border rounded-md text-sm font-inter">
            </div>
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1 font-lexend">Passengers</label>
              <select class="w-full p-2 border rounded-md text-sm font-inter">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>
            </div>
            <div class="md:col-span-1 flex flex-col">
              <label class="block text-sm font-medium text-gray-700 mb-1 font-lexend">Luggages</label>
              <div class="flex items-center">
                <select class="w-full p-2 border rounded-md text-sm font-inter">
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                </select>
                <button class="ml-2 bg-amber-400 hover:bg-amber-500 text-white p-2 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
</template>

<script setup>
import { useGoogleMapsPlaces } from '~/composables/useGoogleMapsPlaces'

const { isLoaded, loadGoogleMapsApi, setupPlacesAutocomplete, attachPlaceChangedListener } = useGoogleMapsPlaces()

const pickupInput = ref(null)
const dropoffInput = ref(null)


onMounted(async () => {
    await loadGoogleMapsApi()
    setupPlacesAutocomplete(pickupInput.value)
    setupPlacesAutocomplete(dropoffInput.value)
})

const pickupAutocomplete = ref(null)
const dropoffAutocomplete = ref(null)

const pickupPlaceChanged = (place) => {
    console.log(place)
}

const dropoffPlaceChanged = (place) => {
    console.log(place)
}

watch(pickupAutocomplete, (newVal) => {
    if (newVal) {
        attachPlaceChangedListener(newVal, pickupPlaceChanged)
    }
})


watch(dropoffAutocomplete, (newVal) => {
    if (newVal) {
        attachPlaceChangedListener(newVal, dropoffPlaceChanged)
    }
})
</script>

