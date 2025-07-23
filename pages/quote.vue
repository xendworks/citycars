<template>
  <div class="min-h-screen bg-gray-50">
    <section class="py-8 bg-amber-50">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold mb-4 text-center">Find Available Cabs</h1>
        <p class="max-w-3xl mx-auto text-gray-700 mb-8 text-center">
          Enter your journey details below to find the best available cabs for your trip.
        </p>

 <BookingForm
  :key="fromLocation + toLocation + pickupDateTime + passengers + luggage"
  :initialPickup="fromLocation"
  :initialDropoff="toLocation"
  :initialDateTime="pickupDateTime"
  :initialPassengers="passengers"
  :initialLuggage="luggage"
/>
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
            
            <!-- Initial State -->
            <div v-else-if="!hasSearched" class="bg-white rounded-lg p-6 shadow-md text-center">
              <p class="text-lg text-gray-700">Enter your journey details above to see available cabs.</p>
              <p class="text-sm text-gray-500 mt-2">We'll show you the best options for your trip.</p>
            </div>
            
            <!-- Results List -->
            <div v-else class="space-y-4">
              <div 
                v-for="cab in cabResults" 
                :key="cab.id"
                class="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                :class="{'border-2 border-amber-400': selectedCab?.id === cab.id}"
                @click="selectCab(cab)"
              >
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <div class="h-16 w-24 bg-amber-100 rounded-lg flex items-center justify-center">
                      <img
                        :src="cab.imageUrl"
                        alt="Cab"
                        class="h-16 w-auto object-contain"
                      />
                    </div>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold flex items-center">
                      {{ cab.name }}
                      <span v-if="cab.suggested" class="ml-2 px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold">
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
                      @click.stop="bookCab(cab)"
                    >
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
  
              <div 
                ref="realMapContainer" 
                id="realMap" 
                class="h-96 w-full relative"
                :class="{'bg-gray-200 animate-pulse': isLoading && !mapLoaded}"
              ></div>
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
                  <button 
                    @click="bookCab(selectedCab)" 
                    class="w-full bg-amber-400 hover:bg-amber-500 text-white py-2 px-4 rounded-md font-medium transition duration-300"
                  >
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

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useGoogleMapsPlaces } from '~/composables/useGoogleMapsPlaces'
import { useFareCalculator } from '~/composables/useFareCalculator'
import { useGeocode } from '~/composables/useGeocode'
import BookingForm from '~/components/BookingForm.vue'
import { useQueryStore } from '~/stores/queryStore'
import { useQuoteStore } from '~/stores/queryStore'

// Get fare calculator
const { calculateFare, formatFare, getVehicleDisplayName, getPeakHourDisplayName, isLoading: fareLoading, error } = useFareCalculator()

// Form state
const fromLocation = ref('')
const toLocation = ref('')
const passengers = ref(2)
const luggage = ref(1)
const pickupDateTime = ref(new Date().toISOString().slice(0, 16))
const vehicleType = ref('saloon')

// Google Maps Places
const { isLoaded, loadGoogleMapsApi, setupPlacesAutocomplete, attachPlaceChangedListener } = useGoogleMapsPlaces()
const pickupInput = ref(null)
const dropoffInput = ref(null)
const pickupAutocomplete = ref(null)
const dropoffAutocomplete = ref(null)
const pickupPlace = ref(null)
const dropoffPlace = ref(null)

// Map state
const mapContainer = ref(null)
const map = ref(null)
const directionsService = ref(null)
const directionsRenderer = ref(null)
const mapLoaded = ref(false)

// Add after mapContainer ref
const realMapContainer = ref(null)

// Results state
const isLoading = ref(false)
const hasSearched = ref(false)
const cabResults = ref([])
const selectedCab = ref(null)
const routeDetails = ref(null)

// Fare calculation results
const fareResult = ref(null)
const showBreakdown = ref(false)

// Route query parameters
const route = useRoute()

// Geocoding state
const fromCoords = ref(null)
const toCoords = ref(null)
const geocodeLoading = ref(false)
const geocodeError = ref(null)

const { geocodeAddress } = useGeocode()

const queryStore = useQueryStore();
const quoteStore = useQuoteStore();

// Update form values from route query if available
onMounted(async () => {
  // Prefer Pinia store if available
  if (queryStore.from) fromLocation.value = queryStore.from
  if (queryStore.to) toLocation.value = queryStore.to
  if (queryStore.vehicleType) vehicleType.value = queryStore.vehicleType
  if (queryStore.passengers) passengers.value = queryStore.passengers
  if (queryStore.luggage) luggage.value = queryStore.luggage
  if (queryStore.pickupDateTime) pickupDateTime.value = queryStore.pickupDateTime

  // Fallback to query params if Pinia store is empty
  if (route.query.from) fromLocation.value = route.query.from
  if (route.query.to) toLocation.value = route.query.to
  if (route.query.vehicleType) vehicleType.value = route.query.vehicleType
  if (route.query.passengers) passengers.value = parseInt(route.query.passengers) || 1
  if (route.query.luggage) luggage.value = parseInt(route.query.luggage) || 0
  if (route.query.pickupDateTime) pickupDateTime.value = route.query.pickupDateTime

  // Geocode both addresses
  geocodeLoading.value = true
  try {
    const [fromResult, toResult] = await Promise.all([
      geocodeAddress(fromLocation.value),
      geocodeAddress(toLocation.value)
    ])
    fromCoords.value = fromResult
    toCoords.value = toResult
  } catch (e) {
    geocodeError.value = e.message || 'Failed to geocode addresses.'
  } finally {
    geocodeLoading.value = false
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

    const request = {
      from: mockFromLocation,
      to: mockToLocation,
      vehicleType: vehicleType.value,
      passengers: passengers.value,
      luggage: luggage.value,
      pickupDateTime: pickupDateTime.value
    }

    const result = await calculateFare(request)
    fareResult.value = result
  } catch (err) {
    console.error('Failed to calculate fare:', err)
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

// Mock function to simulate route calculation
const calculateAndDisplayRoute = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
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
  
  // Update map with mock route display
  if (mapContainer.value) {
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
    mapContainer.value.innerHTML = mockMapContent;
  }
  
  return true;
}

// Mock cab searching functionality
const searchCabs = async () => {
  if (!fromLocation.value || !toLocation.value) {
    alert('Please enter both pickup and drop-off locations')
    return
  }
  
  isLoading.value = true
  hasSearched.value = true
  selectedCab.value = null
  
  try {
    // Simulate API loading delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate mock route details
    await calculateAndDisplayRoute()
    
    // Generate mock cab results
    generateMockCabResults()
  } catch (error) {
    console.error('Error in mock search:', error)
  } finally {
    isLoading.value = false
  }
}

// Initialize with default search on page load
onMounted(async () => {
  try {
    // Create a mock map element to simulate map loading
    setTimeout(() => {
      mapLoaded.value = true
      // Create a placeholder for the map area
      if (mapContainer.value) {
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
            <p class="text-gray-500 text-sm">Real map will appear here after searching</p>
          </div>
        `;
        mapContainer.value.innerHTML = '';
        mapContainer.value.appendChild(mockMap);
      }
    }, 500);
    
    // Perform initial search after a short delay
    setTimeout(() => {
      searchCabs()
    }, 1000)
    
  } catch (error) {
    console.error('Failed to initialize mock map:', error)
  }
})

// Mock cab data generation
const generateMockCabResults = () => {
  // Images for cab types - using the same images as in index.vue
  const cabImages = {
    'Saloon': '/images/2.png',
    'Estate': '/images/3.png',
    'MPV': '/images/4.png',
    '7 Seater': '/images/6.png',
    '9 Seater': '/images/7.png',
    'Wheelchair': '/images/8.png',
  }

  const baseCabs = [
    {
      id: 1,
      name: 'Saloon',
      passengerCapacity: 4,
      luggageCapacity: 2,
      basePrice: 25,
      pricePerMile: 2.5,
      description: 'Comfortable sedan ideal for up to 4 passengers with moderate luggage.',
      imageUrl: cabImages['Saloon']
    },
    {
      id: 2,
      name: 'Estate',
      passengerCapacity: 4,
      luggageCapacity: 4,
      basePrice: 30,
      pricePerMile: 2.8,
      description: 'Spacious estate with extra luggage space, perfect for airport transfers.',
      imageUrl: cabImages['Estate']
    },
    {
      id: 3,
      name: 'MPV',
      passengerCapacity: 6,
      luggageCapacity: 4,
      basePrice: 40,
      pricePerMile: 3.2,
      description: 'Multi-purpose vehicle ideal for families or small groups with luggage.',
      imageUrl: cabImages['MPV']
    },
    {
      id: 4,
      name: '7 Seater',
      passengerCapacity: 7,
      luggageCapacity: 5,
      basePrice: 50,
      pricePerMile: 3.5,
      description: 'Spacious van with seating for up to 7 passengers plus luggage.',
      imageUrl: cabImages['7 Seater']
    },
    {
      id: 5,
      name: '9 Seater',
      passengerCapacity: 9,
      luggageCapacity: 6,
      basePrice: 70,
      pricePerMile: 4.0,
      description: 'Large minibus perfect for bigger groups and tours.',
      imageUrl: cabImages['9 Seater']
    }
  ]

  // Estimate distance from route (or use mock value if no route yet)
  let distanceInMiles = 10
  if (routeDetails.value?.distance) {
    const distanceStr = routeDetails.value.distance
    const distanceValue = parseFloat(distanceStr.replace(/[^0-9.]/g, ''))
    distanceInMiles = distanceStr.includes('km') ? distanceValue * 0.621371 : distanceValue
  }

  // Show all cabs that can accommodate the request
  const availableCabs = baseCabs
    .filter(cab => cab.passengerCapacity >= passengers.value && cab.luggageCapacity >= luggage.value)
    .map(cab => ({
      ...cab,
      price: cab.basePrice + (cab.pricePerMile * distanceInMiles)
    }))
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
const selectCab = (cab) => {
  selectedCab.value = cab
}

// Book the selected cab
const bookCab = (cab) => {
  // Generate a unique quoteId (timestamp + random)
  const quoteId = `q${Date.now()}${Math.floor(Math.random()*10000)}`;
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
  quoteStore.saveQuote(quoteId, details);
  // Redirect to /{quoteId}/book
  window.location.href = `/${quoteId}/book`;
}

// Uber-style map theme JSON
const uberMapStyle = [
  {"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#7c93a3"},{"lightness":"-10"}]},
  {"featureType":"administrative.country","elementType":"geometry","stylers":[{"visibility":"on"}]},
  {"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"color":"#a0a4a5"}]},
  {"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"color":"#62838e"}]},
  {"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#dde3e3"}]},
  {"featureType":"landscape.man_made","elementType":"geometry.stroke","stylers":[{"color":"#3f4a51"},{"weight":"0.30"}]},
  {"featureType":"poi","elementType":"all","stylers":[{"visibility":"simplified"}]},
  {"featureType":"poi.attraction","elementType":"all","stylers":[{"visibility":"on"}]},
  {"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"on"}]},
  {"featureType":"poi.government","elementType":"all","stylers":[{"visibility":"on"}]},
  {"featureType":"poi.medical","elementType":"all","stylers":[{"visibility":"on"}]},
  {"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#a8dba8"}]},
  {"featureType":"poi.place_of_worship","elementType":"all","stylers":[{"visibility":"on"}]},
  {"featureType":"poi.school","elementType":"all","stylers":[{"visibility":"on"}]},
  {"featureType":"poi.sports_complex","elementType":"all","stylers":[{"visibility":"on"}]},
  {"featureType":"road","elementType":"all","stylers":[{"saturation":"-100"},{"lightness":"45"}]},
  {"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#bbcacf"}]},
  {"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#bbcacf"}]},
  {"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#bbcacf"}]},
  {"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#bbcacf"}]},
  {"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#bbcacf"}]},
  {"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#bbcacf"}]},
  {"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#bbcacf"}]},
  {"featureType":"transit","elementType":"all","stylers":[{"visibility":"on"}]},
  {"featureType":"transit.line","elementType":"geometry.fill","stylers":[{"color":"#b4cbd4"}]},
  {"featureType":"transit.station","elementType":"all","stylers":[{"visibility":"on"}]},
  {"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#a6cbe3"}]}
];

// Render real Google Map with route and custom markers/labels
async function renderRealMap() {
  if (!window.google || !fromCoords.value || !toCoords.value) return;
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
  const directionsService = new window.google.maps.DirectionsService();
  const directionsRenderer = new window.google.maps.DirectionsRenderer({ map, suppressMarkers: true });
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
  }, (result, status) => {
    if (status === 'OK') {
      directionsRenderer.setDirections(result);
      // Custom markers for from/to
      const leg = result.routes[0].legs[0];
      // From marker (A)
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
      // To marker (B)
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
      function addCustomPopover(map, position, text) {
        const overlay = new window.google.maps.OverlayView();
        overlay.onAdd = function() {
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
        overlay.draw = function() {
          const projection = this.getProjection();
          const pos = projection.fromLatLngToDivPixel(position);
          if (pos && this.div) {
            this.div.style.left = pos.x + 12 + 'px'; // offset to the right of marker
            this.div.style.top = pos.y - 18 + 'px'; // offset above marker
          }
        };
        overlay.onRemove = function() {
          if (this.div) this.div.parentNode.removeChild(this.div);
          this.div = null;
        };
        overlay.setMap(map);
      }
      // Show only the first part of the address (place name)
      addCustomPopover(map, leg.start_location, leg.start_address.split(',')[0]);
      addCustomPopover(map, leg.end_location, leg.end_address.split(',')[0]);
    }
  });
  // Add traffic layer
  const trafficLayer = new window.google.maps.TrafficLayer();
  trafficLayer.setMap(map);
}

// Watch for coords and render map
watch([fromCoords, toCoords], () => {
  if (fromCoords.value && toCoords.value && realMapContainer.value) {
    renderRealMap();
  }
});
</script> 