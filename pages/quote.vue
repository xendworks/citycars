<template>
  <div class="min-h-screen bg-gray-50">
    <section class="py-8 bg-amber-50">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold mb-4 text-center">Find Available Cabs</h1>
        <p class="max-w-3xl mx-auto text-gray-700 mb-8 text-center">
          Enter your journey details below to find the best available cabs for your trip.
        </p>

        <!-- Search Form -->
        <div class="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mb-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <!-- From Location -->
            <div class="md:col-span-1 lg:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">From Location</label>
              <input 
                ref="pickupInput"
                type="text" 
                v-model="fromLocation" 
                placeholder="Eg: Gatwick Airport" 
                class="w-full p-2 border rounded-md text-sm"
              >
            </div>
            
            <!-- To Location -->
            <div class="md:col-span-1 lg:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">To Location</label>
              <input 
                ref="dropoffInput"
                type="text" 
                v-model="toLocation" 
                placeholder="Eg: SW1 7NL" 
                class="w-full p-2 border rounded-md text-sm"
              >
            </div>
            
            <!-- Passengers -->
            <div class="md:col-span-1 lg:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
              <select v-model="passengers" class="w-full p-2 border rounded-md text-sm">
                <option v-for="n in 9" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
            
            <!-- Luggage -->
            <div class="md:col-span-1 lg:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Luggage</label>
              <select v-model="luggage" class="w-full p-2 border rounded-md text-sm">
                <option v-for="n in 6" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
            
            <!-- Date & Time -->
            <div class="md:col-span-1 lg:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Pickup Date & Time</label>
              <input 
                type="datetime-local" 
                v-model="pickupDateTime" 
                class="w-full p-2 border rounded-md text-sm"
              >
            </div>
            
            <!-- Search Button -->
            <div class="md:col-span-2 lg:col-span-2 flex items-end">
              <button 
                @click="searchCabs" 
                class="w-full bg-amber-400 hover:bg-amber-500 text-white py-2 px-4 rounded-md font-medium transition duration-300"
                :disabled="isLoading"
              >
                <span v-if="isLoading">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </span>
                <span v-else>Search Available Cabs</span>
              </button>
            </div>
          </div>
        </div>
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
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold">{{ cab.name }}</h3>
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
              <h3 class="bg-gray-100 py-2 px-4 font-semibold">Journey Map</h3>
              <div 
                ref="mapContainer" 
                class="h-64 w-full"
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

// Form state
const fromLocation = ref('')
const toLocation = ref('')
const passengers = ref(2)
const luggage = ref(1)
const pickupDateTime = ref(new Date().toISOString().slice(0, 16))

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

// Results state
const isLoading = ref(false)
const hasSearched = ref(false)
const cabResults = ref([])
const selectedCab = ref(null)
const routeDetails = ref(null)

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
    // Set default locations
    fromLocation.value = 'Gatwick Airport'
    toLocation.value = 'London City'
    
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
  // Images for cab types - using relative paths to assets
  const cabImages = {
    'Saloon': '/assets/images/saloon.png',
    'Estate': '/assets/images/saloon.png', // Reusing saloon image as placeholders
    'MPV': '/assets/images/saloon.png',
    '7 Seater': '/assets/images/saloon.png',
    '9 Seater': '/assets/images/saloon.png',
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
  
  // Filter cabs based on passenger and luggage requirements
  const availableCabs = baseCabs
    .filter(cab => cab.passengerCapacity >= passengers.value && cab.luggageCapacity >= luggage.value)
    .map(cab => ({
      ...cab,
      // Calculate price based on distance and base price
      price: cab.basePrice + (cab.pricePerMile * distanceInMiles)
    }))
    .sort((a, b) => a.price - b.price)
  
  cabResults.value = availableCabs
}

// Select a cab
const selectCab = (cab) => {
  selectedCab.value = cab
}

// Book the selected cab
const bookCab = (cab) => {
  alert(`Booking ${cab.name} for your journey from ${fromLocation.value} to ${toLocation.value}.`)
  // In a real app, this would navigate to a checkout page or submit the booking
}
</script> 