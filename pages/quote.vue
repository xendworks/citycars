<template>
  <div class="min-h-screen bg-gray-50">
    <section class="py-8 bg-amber-50">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold mb-4 text-center">Find Available Cabs</h1>
        <p class="max-w-3xl mx-auto text-gray-700 mb-8 text-center">
          Enter your journey details below to find the best available cabs for your trip.
        </p>

        <BookingForm :key="fromLocation + toLocation + pickupDateTime + passengers + luggage"
          :initialPickup="fromLocation" :initialDropoff="toLocation" :initialDateTime="pickupDateTime"
          :initialPassengers="passengers" :initialLuggage="luggage" @search="handleSearchFromForm" />
      </div>
    </section>

    <!-- Results Section -->
    <section class="py-8">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Cab Results -->
          <div class="lg:col-span-2">
            <h2 class="text-2xl font-bold mb-4">Available Cabs</h2>

            <!-- Loading Placeholders -->
            <div v-if="isLoading" class="space-y-4">
              <div v-for="i in 3" :key="i" class="bg-white rounded-lg p-4 shadow-md animate-pulse">
                <div class="flex items-center space-x-4">
                  <div class="h-16 w-24 bg-gray-300 rounded"></div>
                  <div class="flex-1">
                    <div class="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div class="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div class="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                  <div class="h-8 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            </div>

            <!-- No Results -->
            <div v-else-if="!cabResults.length && hasSearched" class="bg-white rounded-lg p-6 shadow-md text-center">
              <p class="text-lg text-gray-700">No cabs available for your search criteria.</p>
              <p class="text-sm text-gray-500 mt-2">Try adjusting your passenger count, luggage, or locations.</p>
            </div>

            <!-- Initial State with Loader -->
            <div v-else-if="!hasSearched" class="bg-white rounded-lg p-8 shadow-md text-center">
              <div class="flex flex-col items-center space-y-6">
                <!-- Animated Logo -->
                <div class="relative">
                  <div
                    class="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                    <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                </div>

                <!-- Loading Text -->
                <div class="space-y-2">
                  <h3 class="text-xl font-semibold text-gray-800">Welcome to City Cars</h3>
                  <p class="text-gray-600">Ready to find your perfect ride?</p>
                </div>

                <!-- Animated Dots -->
                <div class="flex space-x-2">
                  <div class="w-3 h-3 bg-amber-400 rounded-full animate-bounce"></div>
                  <div class="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>

                <!-- Features -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm">
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span class="text-gray-600">Instant Quotes</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span class="text-gray-600">Best Prices</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span class="text-gray-600">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Results List -->
            <div v-else class="space-y-4">
              <div v-for="cab in cabResults" :key="cab.id"
                class="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                :class="{ 'border-2 border-amber-400': selectedCab?.id === cab.id }" @click="selectCab(cab)">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <div class="h-16 w-24 bg-amber-100 rounded-lg flex items-center justify-center">
                      <img :src="cab.imageUrl" alt="Cab" class="h-16 w-auto object-contain" />
                    </div>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold flex items-center">
                      {{ cab.name }}
                      <span v-if="cab.suggested"
                        class="ml-2 px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold">
                        Suggested
                      </span>
                    </h3>
                    <div class="text-sm text-gray-600 mt-1">
                      <span class="mr-3">{{ cab.passengerCapacity }} passengers</span>
                      <span>{{ cab.luggageCapacity }} luggage</span>
                    </div>
                    <div class="text-xs text-gray-500 mt-1">{{ cab.description }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-bold">£{{ cab.price.toFixed(2) }}</div>
                    <button
                      class="mt-2 bg-amber-400 hover:bg-amber-500 text-white py-1 px-3 rounded-md text-sm transition duration-300"
                      @click.stop="bookCab(cab)">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Map and Trip Summary -->
          <div class="lg:col-span-1">
            <!-- Map Container -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">

              <div ref="realMapContainer" id="realMap" class="h-96 w-full relative"
                :class="{ 'bg-gray-200 animate-pulse': isLoading && !mapLoaded }"></div>
            </div>

            <!-- Journey Details -->
            <div v-if="routeDetails" class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <h3 class="bg-gray-100 py-2 px-4 font-semibold">Journey Details</h3>
              <div class="p-4">
                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">Distance:</span>
                  <span class="font-medium">{{ routeDetails.distance }}</span>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">Duration:</span>
                  <span class="font-medium">{{ routeDetails.duration }}</span>
                </div>
                <div class="flex justify-between py-2">
                  <span class="text-gray-600">Estimated Arrival:</span>
                  <span class="font-medium">{{ routeDetails.eta }}</span>
                </div>
              </div>
            </div>

            <!-- Selected Cab Summary -->
            <div v-if="selectedCab" class="bg-white rounded-lg shadow-md overflow-hidden">
              <h3 class="bg-gray-100 py-2 px-4 font-semibold">Trip Summary</h3>
              <div class="p-4">
                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">Selected Vehicle:</span>
                  <span class="font-medium">{{ selectedCab.name }}</span>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">Pickup Date:</span>
                  <span class="font-medium">{{ formatPickupDate }}</span>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">Pickup Time:</span>
                  <span class="font-medium">{{ formatPickupTime }}</span>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">Passengers:</span>
                  <span class="font-medium">{{ passengers }}</span>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">Luggage:</span>
                  <span class="font-medium">{{ luggage }}</span>
                </div>
                <div class="flex justify-between py-2 border-b font-bold">
                  <span class="text-gray-800">Total Price:</span>
                  <span>£{{ selectedCab.price.toFixed(2) }}</span>
                </div>
                <div class="mt-4">
                  <button @click="bookCab(selectedCab)"
                    class="w-full bg-amber-400 hover:bg-amber-500 text-white py-2 px-4 rounded-md font-medium transition duration-300">
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGoogleMapsPlaces } from '~/composables/useGoogleMapsPlaces'
import { useFareCalculator } from '~/composables/useFareCalculator'
import { useGeocode } from '~/composables/useGeocode'
import BookingForm from '~/components/BookingForm.vue'
import { useQueryStore } from '~/stores/queryStore'
import { useQuoteStore } from '~/stores/queryStore'
import { calculateFare } from '~/utils/pricing'
import { CAB_TYPES } from '~/constants/cabs'

// TypeScript interfaces

interface Cab {
  id: number
  name: string
  passengerCapacity: number
  luggageCapacity: number
  basePrice: number
  pricePerMile: number
  description: string
  imageUrl: string
  price: number
  suggested?: boolean
}

interface RouteDetails {
  distance: string
  duration: string
  eta: string
}

interface Coordinates {
  lat: number
  lng: number
  formatted_address?: string
}

// Get fare calculator
const { formatFare, getVehicleDisplayName, getPeakHourDisplayName, isLoading: fareLoading, error } = useFareCalculator()

// Form state
const fromLocation = ref('')
const toLocation = ref('')
const passengers = ref(2)
const luggage = ref(1)
const pickupDateTime = ref(new Date().toISOString().slice(0, 16))
const vehicleType = ref<'saloon' | 'estate' | 'mpv' | 'wheelchair'>('saloon')

// Google Maps Places
const { isLoaded, loadGoogleMapsApi, setupPlacesAutocomplete, attachPlaceChangedListener } = useGoogleMapsPlaces()
const pickupInput = ref(null)
const dropoffInput = ref(null)
const pickupAutocomplete = ref(null)
const dropoffAutocomplete = ref(null)
const pickupPlace = ref(null)
const dropoffPlace = ref(null)

// Map state
const map = ref<any>(null)
const directionsService = ref<any>(null)
const directionsRenderer = ref<any>(null)
const mapLoaded = ref(false)
const realMapContainer = ref<HTMLElement | null>(null)

// Results state
const isLoading = ref(false)
const hasSearched = ref(false)
const cabResults = ref<Cab[]>([])
const selectedCab = ref<Cab | null>(null)
const routeDetails = ref<RouteDetails | null>(null)

// Fare calculation results
const fareResult = ref<any>(null)
const showBreakdown = ref(false)

// Route query parameters
const route = useRoute()

// Geocoding state
const fromCoords = ref<Coordinates | null>(null)
const toCoords = ref<Coordinates | null>(null)
const geocodeLoading = ref(false)
const geocodeError = ref<string | null>(null)

const { geocodeAddress } = useGeocode()

const queryStore = useQueryStore();
const quoteStore = useQuoteStore();
const router = useRouter();

// Get booking ID from URL
const bookingId = computed(() => {
  const id = route.query.bookingId
  return Array.isArray(id) ? id[0] || '' : id || ''
})

// Update form values from route query if available
onMounted(async () => {
  // Load Google Maps API first
  await loadGoogleMapsApi()

  // Prefer Pinia store if available
  if (queryStore.from) fromLocation.value = queryStore.from
  if (queryStore.to) toLocation.value = queryStore.to
  if (queryStore.vehicleType) {
    const type = queryStore.vehicleType
    if (type === 'saloon' || type === 'estate' || type === 'mpv' || type === 'wheelchair') {
      vehicleType.value = type
    }
  }
  if (queryStore.passengers) passengers.value = queryStore.passengers
  if (queryStore.luggage) luggage.value = queryStore.luggage
  if (queryStore.pickupDateTime) pickupDateTime.value = queryStore.pickupDateTime

  // Fallback to query params if Pinia store is empty
  if (!fromLocation.value && route.query.from) fromLocation.value = String(route.query.from)
  if (!toLocation.value && route.query.to) toLocation.value = String(route.query.to)
  if (route.query.vehicleType) {
    const type = String(route.query.vehicleType)
    if (type === 'saloon' || type === 'estate' || type === 'mpv' || type === 'wheelchair') {
      vehicleType.value = type
    }
  }
  if (route.query.passengers) passengers.value = parseInt(String(route.query.passengers)) || 1
  if (route.query.luggage) luggage.value = parseInt(String(route.query.luggage)) || 0
  if (route.query.pickupDateTime) pickupDateTime.value = String(route.query.pickupDateTime)

  // Also check quote store if bookingId is present
  if (bookingId.value) {
    const quoteData = quoteStore.getQuote(bookingId.value)
    if (quoteData) {
      if (quoteData.from) fromLocation.value = quoteData.from
      if (quoteData.to) toLocation.value = quoteData.to
      if (quoteData.passengers) passengers.value = quoteData.passengers
      if (quoteData.luggage) luggage.value = quoteData.luggage
      if (quoteData.pickupDateTime) pickupDateTime.value = quoteData.pickupDateTime
    }
  }

  // Set default pickup date/time if not set
  if (!pickupDateTime.value) {
    const now = new Date()
    now.setHours(now.getHours() + 1) // Default to 1 hour from now
    pickupDateTime.value = now.toISOString().slice(0, 16)
  }

  // Set default passengers/luggage if not set
  if (!passengers.value) passengers.value = 1
  if (luggage.value === undefined || luggage.value === null) luggage.value = 0

  // Create a loading map placeholder initially
  setTimeout(() => {
    mapLoaded.value = true
    if (realMapContainer.value && !fromCoords.value && !toCoords.value) {
      const mockMap = document.createElement('div');
      mockMap.className = 'bg-gray-200 w-full h-full flex items-center justify-center';
      mockMap.innerHTML = `
        <div class="text-center p-4">
          <div class="text-amber-500 text-5xl mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-12 h-12 mx-auto">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <p class="text-gray-600">Journey Map View</p>
          <p class="text-gray-500 text-sm">Enter locations to see route</p>
        </div>
      `;
      realMapContainer.value.innerHTML = '';
      realMapContainer.value.appendChild(mockMap);
    }
  }, 500);

  // Perform initial search immediately if we have locations
  if (fromLocation.value && toLocation.value) {
    // Don't wait - search immediately
    searchCabs()
  } else {
    // If no locations, show the welcome screen (hasSearched stays false)
    console.log('No locations found, showing welcome screen')
  }
})

// Calculate fare when component mounts or parameters change
const calculateFareForRoute = async () => {
  if (!fromLocation.value || !toLocation.value || !pickupDateTime.value) {
    return
  }

  try {
    // For now, we'll use mock location data
    // In a real implementation, you'd get coordinates from Google Places API
    const mockFromLocation = {
      name: fromLocation.value,
      lat: 51.1537, // Gatwick Airport coordinates
      lng: -0.1821
    }

    const mockToLocation = {
      name: toLocation.value,
      lat: 51.5074, // London coordinates
      lng: -0.1278
    }

    const mockDistance = 10;
    const result = calculateFare(mockDistance, vehicleType.value);
    fareResult.value = result;
  } catch (err) {
    console.error('Failed to calculate fare:', err);
  }
}

// Watch for changes in form values
watch([fromLocation, toLocation, vehicleType, passengers, luggage, pickupDateTime], () => {
  calculateFareForRoute()
}, { deep: true })

definePageMeta({
  title: 'Get Quote - City Cars'
})

// Computed properties
const formatPickupDate = computed(() => {
  if (!pickupDateTime.value) return ''
  const date = new Date(pickupDateTime.value)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
})

const formatPickupTime = computed(() => {
  if (!pickupDateTime.value) return ''
  const date = new Date(pickupDateTime.value)
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
})

// Mock function to simulate route calculation (only used as fallback)
const calculateAndDisplayRoute = async () => {
  // Only use mock if we don't have real coordinates
  if (fromCoords.value && toCoords.value) {
    return true;
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock route details calculation
  const randomDistance = Math.floor(5 + Math.random() * 20);
  const randomDuration = Math.floor(15 + Math.random() * 45);

  // Calculate mock eta
  const pickupTime = new Date(pickupDateTime.value);
  const arrivalTime = new Date(pickupTime.getTime() + (randomDuration * 60 * 1000));

  routeDetails.value = {
    distance: `${randomDistance} miles`,
    duration: `${randomDuration} mins`,
    eta: arrivalTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  };

  // Update map with mock route display ONLY if no real coords
  if (realMapContainer.value && !fromCoords.value && !toCoords.value) {
    const mockMapContent = `
      <div class="bg-gray-100 w-full h-full p-2">
        <div class="bg-white w-full h-full rounded shadow-inner p-3 flex flex-col justify-between">
          <div class="text-xs text-gray-500 mb-2">From: ${fromLocation.value}</div>
          <div class="flex-1 relative">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-3/4 h-1 bg-amber-400 relative">
                <div class="absolute -top-2 -left-2 w-4 h-4 bg-amber-500 rounded-full"></div>
                <div class="absolute -top-2 -right-2 w-4 h-4 bg-amber-500 rounded-full"></div>
              </div>
            </div>
          </div>
          <div class="text-xs text-gray-500 mt-2">To: ${toLocation.value}</div>
          <div class="text-center text-sm font-medium mt-3 text-amber-600">
            ${randomDistance} miles (${randomDuration} mins)
          </div>
        </div>
      </div>
    `;
    realMapContainer.value.innerHTML = mockMapContent;
  }

  return true;
}

// Handle search event from BookingForm component
const handleSearchFromForm = (searchData: any) => {

  // Update form values with search data
  fromLocation.value = searchData.from;
  toLocation.value = searchData.to;
  passengers.value = searchData.passengers;
  luggage.value = searchData.luggage;
  pickupDateTime.value = searchData.pickupDateTime;
  vehicleType.value = searchData.vehicleType;

  // Trigger the search
  searchCabs();
};

// Mock cab searching functionality
const searchCabs = async () => {
  if (!fromLocation.value || !toLocation.value) {
    console.warn('Missing locations:', { from: fromLocation.value, to: toLocation.value })
    // Don't show alert, just return - the welcome screen will show
    return
  }

  isLoading.value = true
  hasSearched.value = true
  selectedCab.value = null

  try {
    // Try to geocode addresses in background (non-blocking)
    if (fromLocation.value && toLocation.value) {
      geocodeLoading.value = true
      Promise.all([
        geocodeAddress(fromLocation.value).catch(() => null),
        geocodeAddress(toLocation.value).catch(() => null)
      ]).then(([fromResult, toResult]) => {
        if (fromResult) fromCoords.value = fromResult
        if (toResult) toCoords.value = toResult
        geocodeLoading.value = false
      }).catch((e) => {
        console.warn('Geocoding failed, continuing without coordinates:', e)
        geocodeError.value = e?.message || 'Failed to geocode addresses.'
        geocodeLoading.value = false
      })
    }

    // Simulate API loading delay (reduced for better UX)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Generate mock route details
    await calculateAndDisplayRoute()

    // Generate mock cab results
    generateMockCabResults()
  } catch (error) {
    console.error('Error in mock search:', error)
    // Don't block the UI on error
  } finally {
    isLoading.value = false
  }
}

// Removed duplicate onMounted - merged into the one above

// Mock cab data generation
const generateMockCabResults = () => {
  const baseCabs = Object.values(CAB_TYPES).map((cab, index) => ({
    id: index + 1,
    name: cab.name,
    passengerCapacity: cab.passengerCapacity,
    luggageCapacity: cab.luggageCapacity,
    description: cab.description,
    imageUrl: cab.imageUrl,
    // Provide some default dummy base prices in case calculateFare overrides
    basePrice: 25,
    pricePerMile: 2.5
  }))
  // Estimate distance from route (or use mock value if no route yet)
  let distanceInMiles = 10
  if (routeDetails.value?.distance) {
    // Remove commas from strings like "1,798 mi" so we don't accidentally treat it like 1798 miles!
    const distanceStr = routeDetails.value.distance.replace(/,/g, '')
    const distanceValue = parseFloat(distanceStr.replace(/[^0-9.]/g, ''))
    distanceInMiles = distanceStr.includes('km') ? distanceValue * 0.621371 : distanceValue
  }

  // Map cab names to vehicle types for pricing calculation
  // INCREMENTAL PRICING: Each level +15% more than previous
  const vehicleTypeMap: Record<string, 'saloon' | 'estate' | 'mpv' | '7seater' | '9seater' | 'wheelchair'> = {
    'Saloon': 'saloon',      // Base (0%)
    'Estate': 'estate',      // +15%
    'MPV': 'mpv',            // +30%
    '7 Seater': '7seater',   // +45%
    '9 Seater': '9seater',   // +60%
    'Wheelchair': 'wheelchair'
  }


  const availableCabs = baseCabs
    .filter(cab => cab.passengerCapacity >= passengers.value && cab.luggageCapacity >= luggage.value)
    .map(cab => {
      // Calculate fare using new pricing utility
      const vehicleType = vehicleTypeMap[cab.name] || 'saloon'
      const fareForVehicle = calculateFare(distanceInMiles, vehicleType)


      return {
        ...cab,
        price: fareForVehicle
      }
    })
    .sort((a, b) => a.passengerCapacity - b.passengerCapacity || a.luggageCapacity - b.luggageCapacity)

  // Find the best fit (smallest cab that fits)
  let suggestedId = null
  for (const cab of availableCabs) {
    if (cab.passengerCapacity >= passengers.value && cab.luggageCapacity >= luggage.value) {
      suggestedId = cab.id
      break
    }
  }

  // Attach suggested flag
  cabResults.value = availableCabs.map(cab => ({
    ...cab,
    suggested: cab.id === suggestedId
  }))
}

// Select a cab
const selectCab = (cab: Cab) => {
  selectedCab.value = cab
}

// Book the selected cab
const bookCab = (cab: Cab) => {
  // Use existing booking ID if available, otherwise generate new one
  const quoteId = bookingId.value || `q${Date.now()}${Math.floor(Math.random() * 10000)}`;

  // Prepare quote details
  const details = {
    from: fromLocation.value,
    to: toLocation.value,
    passengers: passengers.value,
    luggage: luggage.value,
    distance: routeDetails.value?.distance || '',
    duration: routeDetails.value?.duration || '',
    bookingSource: 'online',
    arrivalTime: routeDetails.value?.eta || '',
    cabType: cab.name,
    fare: cab.price,
    vehicleType: cab.name,
    pickupDateTime: pickupDateTime.value,
    quoteId,
  };

  // Save quote details
  quoteStore.saveQuote(quoteId, details);

  // Log what we're saving
  console.log('Saving quote with ID:', quoteId)
  console.log('Quote details:', details)

  // Redirect to booking page using router
  router.push(`/${quoteId}/book`);
}

// Uber-style map theme JSON
const uberMapStyle = [
  { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#7c93a3" }, { "lightness": "-10" }] },
  { "featureType": "administrative.country", "elementType": "geometry", "stylers": [{ "visibility": "on" }] },
  { "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [{ "color": "#a0a4a5" }] },
  { "featureType": "administrative.province", "elementType": "geometry.stroke", "stylers": [{ "color": "#62838e" }] },
  { "featureType": "landscape", "elementType": "geometry.fill", "stylers": [{ "color": "#dde3e3" }] },
  { "featureType": "landscape.man_made", "elementType": "geometry.stroke", "stylers": [{ "color": "#3f4a51" }, { "weight": "0.30" }] },
  { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "simplified" }] },
  { "featureType": "poi.attraction", "elementType": "all", "stylers": [{ "visibility": "on" }] },
  { "featureType": "poi.business", "elementType": "all", "stylers": [{ "visibility": "on" }] },
  { "featureType": "poi.government", "elementType": "all", "stylers": [{ "visibility": "on" }] },
  { "featureType": "poi.medical", "elementType": "all", "stylers": [{ "visibility": "on" }] },
  { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#a8dba8" }] },
  { "featureType": "poi.place_of_worship", "elementType": "all", "stylers": [{ "visibility": "on" }] },
  { "featureType": "poi.school", "elementType": "all", "stylers": [{ "visibility": "on" }] },
  { "featureType": "poi.sports_complex", "elementType": "all", "stylers": [{ "visibility": "on" }] },
  { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": "-100" }, { "lightness": "45" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#bbcacf" }] },
  { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#bbcacf" }] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#bbcacf" }] },
  { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "color": "#bbcacf" }] },
  { "featureType": "road.arterial", "elementType": "geometry.stroke", "stylers": [{ "color": "#bbcacf" }] },
  { "featureType": "road.local", "elementType": "geometry.fill", "stylers": [{ "color": "#bbcacf" }] },
  { "featureType": "road.local", "elementType": "geometry.stroke", "stylers": [{ "color": "#bbcacf" }] },
  { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "on" }] },
  { "featureType": "transit.line", "elementType": "geometry.fill", "stylers": [{ "color": "#b4cbd4" }] },
  { "featureType": "transit.station", "elementType": "all", "stylers": [{ "visibility": "on" }] },
  { "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "color": "#a6cbe3" }] }
];

// Render real Google Map with route and custom markers/labels
async function renderRealMap() {
  console.log('renderRealMap called', {
    hasGoogle: !!window.google,
    hasFromCoords: !!fromCoords.value,
    hasToCoords: !!toCoords.value,
    hasContainer: !!realMapContainer.value
  });

  if (!window.google || !window.google.maps) {
    console.warn('Google Maps not loaded yet');
    return;
  }

  if (!fromCoords.value || !toCoords.value) {
    console.warn('Missing coordinates');
    return;
  }

  if (!realMapContainer.value) {
    console.warn('Map container not ready');
    return;
  }

  try {
    console.log('Creating Google Map...');
    const map = new window.google.maps.Map(realMapContainer.value, {
      center: { lat: fromCoords.value.lat, lng: fromCoords.value.lng },
      zoom: 10,
      mapTypeId: 'roadmap',
      styles: uberMapStyle,
      disableDefaultUI: true,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      clickableIcons: false,
    });

    console.log('Map created, setting up directions...');
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#FFC107',
        strokeWeight: 5,
        strokeOpacity: 0.8
      }
    });

    directionsService.route({
      origin: { lat: fromCoords.value.lat, lng: fromCoords.value.lng },
      destination: { lat: toCoords.value.lat, lng: toCoords.value.lng },
      travelMode: 'DRIVING',
      drivingOptions: {
        departureTime: new Date(pickupDateTime.value || Date.now()),
        trafficModel: 'bestguess',
      },
      region: 'uk',
      provideRouteAlternatives: false,
    }, (result: any, status: any) => {
      console.log('Directions result:', status);
      if (status === 'OK') {
        directionsRenderer.setDirections(result);

        // Update route details with real data
        const leg = result.routes[0].legs[0];

        // Convert distance to miles if in KM
        let distanceText = leg.distance.text;
        if (distanceText.toLowerCase().includes('km')) {
          const kmValue = parseFloat(distanceText.replace(/[^0-9.]/g, ''));
          const milesValue = (kmValue * 0.621371).toFixed(1);
          distanceText = `${milesValue} miles`;
        }

        routeDetails.value = {
          distance: distanceText,
          duration: leg.duration.text,
          eta: new Date(Date.now() + leg.duration.value * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        };

        // Custom markers for from/to
        const fromMarker = new window.google.maps.Marker({
          position: leg.start_location,
          map,
          label: {
            text: "A",
            color: "white",
            fontWeight: "bold",
            fontSize: "14px"
          },
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#1976D2",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#fff"
          }
        });

        const toMarker = new window.google.maps.Marker({
          position: leg.end_location,
          map,
          label: {
            text: "B",
            color: "white",
            fontWeight: "bold",
            fontSize: "14px"
          },
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#D32F2F",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#fff"
          }
        });

        // Add tiny custom popovers for A and B
        function addCustomPopover(map: any, position: any, text: string) {
          const overlay = new window.google.maps.OverlayView();
          overlay.onAdd = function () {
            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.background = 'rgba(255,255,255,0.95)';
            div.style.borderRadius = '4px';
            div.style.padding = '2px 6px';
            div.style.fontSize = '10px';
            div.style.fontWeight = '500';
            div.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)';
            div.style.pointerEvents = 'none';
            div.innerText = text;
            this.div = div;
            const panes = this.getPanes();
            panes.overlayMouseTarget.appendChild(div);
          };
          overlay.draw = function () {
            const projection = this.getProjection();
            const pos = projection.fromLatLngToDivPixel(position);
            if (pos && this.div) {
              this.div.style.left = pos.x + 12 + 'px';
              this.div.style.top = pos.y - 18 + 'px';
            }
          };
          overlay.onRemove = function () {
            if (this.div) this.div.parentNode.removeChild(this.div);
            this.div = null;
          };
          overlay.setMap(map);
        }

        // Use the place names entered by user instead of street addresses to avoid "Unnamed Road"
        addCustomPopover(map, leg.start_location, fromLocation.value || leg.start_address.split(',')[0]);
        addCustomPopover(map, leg.end_location, toLocation.value || leg.end_address.split(',')[0]);

        // Add animated car marker with smoother animation
        const carIcon = {
          path: 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805',
          fillColor: '#FFC107',
          fillOpacity: 1,
          strokeColor: '#FF6F00',
          strokeWeight: 1,
          scale: 0.6,
          // @ts-ignore
          anchor: new window.google.maps.Point(23.5, 23.5),
          rotation: 0
        };

        const carMarker = new window.google.maps.Marker({
          position: leg.start_location,
          map,
          icon: carIcon,
          zIndex: 1000
        });

        // Smooth animation along the route with interpolation
        const path = result.routes[0].overview_path;
        const totalSteps = 200; // Number of interpolation steps
        let step = 0;
        const animationDuration = 8000; // 8 seconds for full route
        const delayBetweenSteps = animationDuration / totalSteps;

        // Create interpolated path for smoother animation
        const smoothPath: any[] = [];
        for (let i = 0; i < path.length - 1; i++) {
          const start = path[i];
          const end = path[i + 1];
          const stepsForSegment = Math.ceil(totalSteps / (path.length - 1));

          for (let j = 0; j < stepsForSegment; j++) {
            const fraction = j / stepsForSegment;
            smoothPath.push({
              lat: start.lat() + (end.lat() - start.lat()) * fraction,
              lng: start.lng() + (end.lng() - start.lng()) * fraction
            });
          }
        }
        smoothPath.push({
          lat: path[path.length - 1].lat(),
          lng: path[path.length - 1].lng()
        });

        let lastAngle = 0;

        function animateCar() {
          if (step >= smoothPath.length) {
            // Restart animation from beginning
            step = 0;
            setTimeout(animateCar, 1000);
            return;
          }

          // Update marker position
          carMarker.setPosition(smoothPath[step]);

          // Calculate and update rotation every 10 steps for smooth rotation
          if (step % 10 === 0 && step < smoothPath.length - 10) {
            const current = smoothPath[step];
            const next = smoothPath[Math.min(step + 10, smoothPath.length - 1)];
            // @ts-ignore
            const currentLatLng = new window.google.maps.LatLng(current.lat, current.lng);
            // @ts-ignore
            const nextLatLng = new window.google.maps.LatLng(next.lat, next.lng);
            // @ts-ignore
            const angle = window.google.maps.geometry.spherical.computeHeading(currentLatLng, nextLatLng);

            // Smooth angle transition
            lastAngle = angle;
            const icon = carMarker.getIcon() as any;
            icon.rotation = angle;
            carMarker.setIcon(icon);
          }

          step++;
          setTimeout(animateCar, delayBetweenSteps);
        }

        // Start animation after a short delay
        setTimeout(animateCar, 500);
      } else {
        console.error('Directions request failed:', status);
      }
    });

    // Add traffic layer
    const trafficLayer = new window.google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    console.log('Map rendering complete');
  } catch (error) {
    console.error('Error rendering map:', error);
  }
}

// Watch for coords and render map
watch([fromCoords, toCoords], () => {
  console.log('Coordinates changed', {
    from: fromCoords.value,
    to: toCoords.value
  });

  if (fromCoords.value && toCoords.value && realMapContainer.value) {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      renderRealMap();
    }, 100);
  }
});
</script>