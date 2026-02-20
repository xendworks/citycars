<template>
  <ClientOnly>
    <!-- 404 Not Found Page -->
    <div v-if="notFound" class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="text-center max-w-2xl mx-auto px-4">
        <h1 class="text-6xl font-bold text-amber-500 mb-4">404</h1>
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Route Not Found</h2>
        <p class="text-lg text-gray-600 mb-8">
          Sorry, we couldn't find the taxi route you're looking for. 
          Please check the URL or use our booking form to get a custom quote.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink 
            to="/" 
            class="inline-flex items-center justify-center px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </NuxtLink>
          <NuxtLink 
            to="/quote" 
            class="inline-flex items-center justify-center px-6 py-3 border-2 border-amber-500 text-amber-600 font-semibold rounded-lg hover:bg-amber-50 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Get a Quote
          </NuxtLink>
        </div>
        <div class="mt-12">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Popular Routes</h3>
          <div class="flex flex-wrap gap-2 justify-center">
            <NuxtLink 
              v-for="route in ['gatwick-airport-to-london', 'heathrow-airport-to-gatwick-airport', 'gatwick-airport-to-brighton', 'gatwick-airport-to-central-london']" 
              :key="route"
              :to="`/${route}`"
              class="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-amber-100 hover:text-amber-700 transition-colors"
            >
              {{ route.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace(' To ', ' → ') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Route Page -->
    <div v-else class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
    <section class="relative py-12 md:py-20 bg-gradient-to-br from-amber-50 to-yellow-100">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle, #f59e0b 2px, transparent 2px); background-size: 40px 40px;"></div>
      </div>
      
        <div class="container-fluid mx-auto px-4 relative z-10">
        <!-- Main Heading -->
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 text-center">
            <span v-if="taxiRoute">{{ taxiRoute.seoData.h1Title }}</span>
            <span v-else>{{ displayTitle }}</span>
        </h1>

          <p class="text-lg md:text-xl text-gray-700 text-center max-w-5xl mx-auto mb-4">
            Professional taxi service from 
            <template v-if="taxiRoute">
              <strong>{{ taxiRoute.fromLocation.name }}</strong> to <strong>{{ taxiRoute.toLocation.name }}</strong>
            </template>
            <template v-else>
              <span class="inline-block h-6 w-32 bg-gray-300 animate-pulse rounded align-middle"></span> to 
              <span class="inline-block h-6 w-32 bg-gray-300 animate-pulse rounded align-middle"></span>
            </template>. 
            Fixed price from 
            <strong v-if="taxiRoute" class="text-amber-600">£{{ taxiRoute.averagePrice }}</strong>
            <span v-else class="inline-block h-6 w-16 bg-gray-300 animate-pulse rounded align-middle"></span>
            with no hidden fees.
          </p>


        <!-- Booking Form -->
          <div class="container mx-auto px-4 p-6 md:p-8">
          <BookingForm 
              v-if="taxiRoute?.fromLocation && taxiRoute?.toLocation"
            :prefillPickup="taxiRoute.fromLocation.name"
            :prefillDropoff="taxiRoute.toLocation.name"
          />
            <div v-else class="space-y-4">
              <div class="h-12 bg-gray-300 animate-pulse rounded-lg"></div>
            </div>
        </div>
      </div>
    </section>

      <!-- Introduction & Route Details -->
      <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto prose prose-lg">
            <h2 class="text-3xl font-bold mb-6">About This Journey</h2>
            
          <p class="text-lg text-gray-700 leading-relaxed mb-6">
              <span v-if="taxiRoute">{{ taxiRoute.content.introduction }}</span>
              <span v-else class="inline-block h-6 w-full bg-gray-300 animate-pulse rounded"></span>
            </p>

            <p class="text-gray-700 leading-relaxed mb-4">
              Planning a journey from 
              <strong v-if="taxiRoute">{{ taxiRoute.fromLocation.name }}</strong>
              <span v-else class="inline-block h-5 w-32 bg-gray-300 animate-pulse rounded align-middle"></span>
              to 
              <strong v-if="taxiRoute">{{ taxiRoute.toLocation.name }}</strong>
              <span v-else class="inline-block h-5 w-32 bg-gray-300 animate-pulse rounded align-middle"></span>? 
              CityCars Gatwick provides reliable, comfortable, and professional taxi services 24 hours a day, 7 days a week. 
              Our experienced drivers know the best routes to ensure you arrive at your destination safely and on time.
            </p>

            <p class="text-gray-700 leading-relaxed mb-4">
              The journey covers approximately 
              <strong v-if="taxiRoute">{{ taxiRoute.distance }} miles</strong>
              <span v-else class="inline-block h-5 w-16 bg-gray-300 animate-pulse rounded align-middle"></span>
              and typically takes around 
              <strong v-if="taxiRoute">{{ taxiRoute.estimatedDuration }} minutes</strong>
              <span v-else class="inline-block h-5 w-16 bg-gray-300 animate-pulse rounded align-middle"></span>
              depending on traffic conditions. We monitor traffic in real-time 
              and adjust routes accordingly to avoid delays.
            </p>

            <p class="text-gray-700 leading-relaxed">
              Our competitive fixed pricing starts from just 
              <strong v-if="taxiRoute" class="text-amber-600">£{{ taxiRoute.averagePrice }}</strong>
              <span v-else class="inline-block h-5 w-16 bg-gray-300 animate-pulse rounded align-middle"></span>, 
              with no surge pricing during peak hours. All prices are confirmed upfront, so you know exactly what you'll pay 
              before you book. The fare includes all taxes, tolls, and waiting time.
          </p>
        </div>
      </div>
    </section>

      <!-- Vehicle Options -->
      <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">Choose Your Vehicle</h2>
            <p class="text-lg text-gray-600 max-w-3xl mx-auto">
              We offer a range of vehicle options to suit your needs and budget. All vehicles are regularly maintained, 
              fully insured, and driven by professional licensed drivers.
            </p>
          </div>
          
          <div v-if="taxiRoute?.vehicleTypes && taxiRoute.vehicleTypes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div v-for="vehicle in taxiRoute.vehicleTypes" :key="vehicle.type" class="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
              <div class="text-center mb-4">
                <div class="inline-block bg-amber-100 rounded-full p-4 mb-3">
                  <svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-bold capitalize">{{ vehicle.type }}</h3>
              </div>
              <div class="text-4xl font-bold text-amber-600 text-center mb-4">£{{ vehicle.price }}</div>
              <p class="text-gray-600 text-sm text-center">{{ vehicle.description }}</p>
              <div class="mt-4 pt-4 border-t border-gray-200">
                <button class="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition-colors font-semibold">
                  Book {{ vehicle.type }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- Skeleton Loader for Vehicles -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div v-for="i in 4" :key="i" class="bg-white rounded-lg p-6 shadow-md">
              <div class="text-center mb-4">
                <div class="inline-block bg-gray-300 animate-pulse rounded-full w-16 h-16 mb-3"></div>
                <div class="h-6 bg-gray-300 animate-pulse rounded mx-auto w-24 mb-2"></div>
              </div>
              <div class="h-10 bg-gray-300 animate-pulse rounded mb-4"></div>
              <div class="h-4 bg-gray-300 animate-pulse rounded mb-2"></div>
              <div class="h-4 bg-gray-300 animate-pulse rounded w-3/4 mx-auto"></div>
              <div class="mt-4 pt-4 border-t border-gray-200">
                <div class="h-10 bg-gray-300 animate-pulse rounded"></div>
              </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
      <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
          <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose CityCars Gatwick?</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div class="text-center p-6">
              <div class="inline-block bg-green-100 rounded-full p-4 mb-4">
                <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-3">Licensed & Insured</h3>
              <p class="text-gray-600">All our drivers are fully licensed, DBS checked, and our vehicles are comprehensively insured for your safety and peace of mind.</p>
            </div>

            <div class="text-center p-6">
              <div class="inline-block bg-blue-100 rounded-full p-4 mb-4">
                <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-3">Fixed Pricing</h3>
              <p class="text-gray-600">No surge pricing, no hidden fees. The price you see is the price you pay - guaranteed. Book with confidence knowing the exact cost.</p>
            </div>

            <div class="text-center p-6">
              <div class="inline-block bg-purple-100 rounded-full p-4 mb-4">
                <svg class="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-3">Always On Time</h3>
              <p class="text-gray-600">We track traffic conditions in real-time and monitor flight arrivals. Your driver will be there when you need them, guaranteed.</p>
            </div>

            <div class="text-center p-6">
            <div class="inline-block bg-amber-100 rounded-full p-4 mb-4">
                <svg class="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-3">24/7 Support</h3>
              <p class="text-gray-600">Our customer service team is available round the clock to assist with bookings, changes, or any queries you may have.</p>
            </div>

            <div class="text-center p-6">
              <div class="inline-block bg-red-100 rounded-full p-4 mb-4">
                <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-3">Meet & Greet</h3>
              <p class="text-gray-600">For airport pickups, our drivers wait inside the terminal with a name board. Up to 45 minutes free waiting time included.</p>
            </div>

            <div class="text-center p-6">
              <div class="inline-block bg-indigo-100 rounded-full p-4 mb-4">
                <svg class="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-3">Multiple Payment Options</h3>
              <p class="text-gray-600">Pay by cash, card, or via our secure online payment system. We accept all major credit and debit cards.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Route Information Section -->
      <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <h2 class="text-3xl font-bold mb-8">
              <template v-if="taxiRoute">
                {{ taxiRoute.fromLocation.name }} to {{ taxiRoute.toLocation.name }} - Route Information
              </template>
              <template v-else>
                <span class="inline-block h-10 w-96 max-w-full bg-gray-300 animate-pulse rounded"></span>
              </template>
            </h2>
            
            <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div class="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 class="text-xl font-bold mb-4 flex items-center">
                    <svg class="w-6 h-6 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Pickup Location
                  </h3>
                  <p class="text-lg font-semibold text-gray-900 mb-2">
                    <span v-if="taxiRoute">{{ taxiRoute.fromLocation.name }}</span>
                    <span v-else class="inline-block h-6 w-48 bg-gray-300 animate-pulse rounded"></span>
                  </p>
                  <p v-if="taxiRoute?.fromLocation?.postcode" class="text-gray-600 mb-2">
                    Postcode: {{ taxiRoute.fromLocation.postcode }}
                  </p>
                  <p class="text-gray-600">
                    Type: 
                    <span v-if="taxiRoute">
                      {{ taxiRoute.fromLocation.type === 'airport' ? 'Airport' : taxiRoute.fromLocation.type === 'station' ? 'Train Station' : 'City/Town' }}
                    </span>
                    <span v-else class="inline-block h-5 w-24 bg-gray-300 animate-pulse rounded align-middle"></span>
                  </p>
                </div>
                
                <div>
                  <h3 class="text-xl font-bold mb-4 flex items-center">
                    <svg class="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
                    Drop-off Location
                  </h3>
                  <p class="text-lg font-semibold text-gray-900 mb-2">
                    <span v-if="taxiRoute">{{ taxiRoute.toLocation.name }}</span>
                    <span v-else class="inline-block h-6 w-48 bg-gray-300 animate-pulse rounded"></span>
                  </p>
                  <p v-if="taxiRoute?.toLocation?.postcode" class="text-gray-600 mb-2">
                    Postcode: {{ taxiRoute.toLocation.postcode }}
                  </p>
                  <p class="text-gray-600">
                    Type: 
                    <span v-if="taxiRoute">
                      {{ taxiRoute.toLocation.type === 'airport' ? 'Airport' : taxiRoute.toLocation.type === 'station' ? 'Train Station' : 'City/Town' }}
                    </span>
                    <span v-else class="inline-block h-5 w-24 bg-gray-300 animate-pulse rounded align-middle"></span>
                  </p>
                </div>
              </div>

              <div class="mt-8 pt-8 border-t border-gray-200">
                <h3 class="text-xl font-bold mb-4">Journey Details</h3>
                <div class="grid md:grid-cols-3 gap-6">
                  <div class="flex items-start">
                    <svg class="w-6 h-6 text-amber-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                    </svg>
                    <div>
                      <div class="font-semibold">Distance</div>
                      <div class="text-gray-600">
                        <span v-if="taxiRoute">{{ taxiRoute.distance }} miles via fastest route</span>
                        <span v-else class="inline-block h-5 w-32 bg-gray-300 animate-pulse rounded"></span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <svg class="w-6 h-6 text-amber-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                      <div class="font-semibold">Estimated Time</div>
                      <div class="text-gray-600">
                        Approximately 
                        <span v-if="taxiRoute">{{ taxiRoute.estimatedDuration }} minutes</span>
                        <span v-else class="inline-block h-5 w-16 bg-gray-300 animate-pulse rounded align-middle"></span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <svg class="w-6 h-6 text-amber-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                      <div class="font-semibold">Price Range</div>
                      <div class="text-gray-600">
                        <span v-if="taxiRoute">£{{ taxiRoute.priceRange.min }} - £{{ taxiRoute.priceRange.max }}</span>
                        <span v-else class="inline-block h-5 w-24 bg-gray-300 animate-pulse rounded"></span>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      <!-- What's Included -->
      <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <h2 class="text-3xl font-bold mb-8 text-center">What's Included in Your Fare</h2>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div class="flex items-start bg-gray-50 p-6 rounded-lg">
                <svg class="w-6 h-6 text-green-500 mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <div>
                  <h4 class="font-bold mb-2">All Taxes & Tolls</h4>
                  <p class="text-gray-600">No surprises - all road tolls, congestion charges, and taxes are included in the quoted price.</p>
                </div>
              </div>

              <div class="flex items-start bg-gray-50 p-6 rounded-lg">
                <svg class="w-6 h-6 text-green-500 mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <div>
                  <h4 class="font-bold mb-2">Flight Monitoring</h4>
                  <p class="text-gray-600">For airport journeys, we track your flight in real-time and adjust pickup times for delays or early arrivals.</p>
                </div>
              </div>

              <div class="flex items-start bg-gray-50 p-6 rounded-lg">
                <svg class="w-6 h-6 text-green-500 mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <div>
                  <h4 class="font-bold mb-2">Free Waiting Time</h4>
                  <p class="text-gray-600">Up to 45 minutes free waiting time at airports, 15 minutes at other locations. No extra charges for flight delays.</p>
                </div>
              </div>

              <div class="flex items-start bg-gray-50 p-6 rounded-lg">
                <svg class="w-6 h-6 text-green-500 mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <div>
                  <h4 class="font-bold mb-2">Professional Drivers</h4>
                  <p class="text-gray-600">Experienced, courteous drivers with excellent local knowledge. Clean, comfortable vehicles maintained to the highest standards.</p>
                </div>
              </div>

              <div class="flex items-start bg-gray-50 p-6 rounded-lg">
                <svg class="w-6 h-6 text-green-500 mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <div>
                  <h4 class="font-bold mb-2">Door-to-Door Service</h4>
                  <p class="text-gray-600">We pick you up from your exact address and drop you at your destination. No walking to pickup points.</p>
                </div>
              </div>

              <div class="flex items-start bg-gray-50 p-6 rounded-lg">
                <svg class="w-6 h-6 text-green-500 mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <div>
                  <h4 class="font-bold mb-2">Child Seats Available</h4>
                  <p class="text-gray-600">Free child seats and booster seats available on request. Just let us know the age of your children when booking.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Comprehensive FAQs -->
      <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-4">Frequently Asked Questions</h2>
            <p class="text-center text-gray-600 mb-12">
              Everything you need to know about your journey from 
              <span v-if="taxiRoute">{{ taxiRoute.fromLocation.name }} to {{ taxiRoute.toLocation.name }}</span>
              <span v-else>
                <span class="inline-block h-5 w-24 bg-gray-300 animate-pulse rounded align-middle"></span> to 
                <span class="inline-block h-5 w-24 bg-gray-300 animate-pulse rounded align-middle"></span>
              </span>
            </p>
            
            <div class="space-y-4">
              <!-- Dynamic FAQs from route data -->
              <div v-if="taxiRoute?.content?.faqs" v-for="(faq, i) in taxiRoute.content.faqs" :key="'dynamic-' + i" class="bg-white rounded-lg p-6 shadow-sm">
                <h3 class="text-lg font-bold mb-3 flex items-start">
                  <svg class="w-6 h-6 text-amber-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ faq.question }}
                </h3>
                <p class="text-gray-700 ml-8">{{ faq.answer }}</p>
              </div>

              <!-- Static FAQs - Universal for all routes -->
              <div class="bg-white rounded-lg p-6 shadow-sm">
                <h3 class="text-lg font-bold mb-3 flex items-start">
                  <svg class="w-6 h-6 text-amber-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  How do I book a taxi from 
                  <span v-if="taxiRoute">{{ taxiRoute.fromLocation.name }} to {{ taxiRoute.toLocation.name }}</span>
                  <span v-else>
                    <span class="inline-block h-4 w-20 bg-gray-300 animate-pulse rounded align-middle"></span> to 
                    <span class="inline-block h-4 w-20 bg-gray-300 animate-pulse rounded align-middle"></span>
                  </span>?
                </h3>
                <p class="text-gray-700 ml-8">
                  Booking is simple! Use our online booking form above, call our 24/7 hotline, or book through our mobile app. 
                  You'll receive instant confirmation with your driver's details and journey information.
                </p>
              </div>

              <div class="bg-white rounded-lg p-6 shadow-sm">
                <h3 class="text-lg font-bold mb-3 flex items-start">
                  <svg class="w-6 h-6 text-amber-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  What payment methods do you accept?
                </h3>
                <p class="text-gray-700 ml-8">
                  We accept all major credit and debit cards (Visa, Mastercard, Amex), cash, and bank transfers. 
                  You can pay in advance online or pay the driver at the end of your journey. All payments are secure and protected.
                </p>
              </div>

              <div class="bg-white rounded-lg p-6 shadow-sm">
                <h3 class="text-lg font-bold mb-3 flex items-start">
                  <svg class="w-6 h-6 text-amber-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Can I cancel or modify my booking?
                </h3>
                <p class="text-gray-700 ml-8">
                  Yes! You can cancel or modify your booking free of charge up to 24 hours before your scheduled pickup time. 
                  For cancellations within 24 hours, a small cancellation fee may apply. Contact our support team to make changes.
                </p>
              </div>

              <div class="bg-white rounded-lg p-6 shadow-sm">
                <h3 class="text-lg font-bold mb-3 flex items-start">
                  <svg class="w-6 h-6 text-amber-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Do you provide wheelchair accessible vehicles?
                </h3>
                <p class="text-gray-700 ml-8">
                  Yes, we have specially adapted wheelchair accessible vehicles with ramps and secure wheelchair restraints. 
                  Our drivers are trained to provide assistance. Please request this when booking to ensure availability.
                </p>
              </div>

              <div class="bg-white rounded-lg p-6 shadow-sm">
                <h3 class="text-lg font-bold mb-3 flex items-start">
                  <svg class="w-6 h-6 text-amber-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  How much luggage can I bring?
                </h3>
                <p class="text-gray-700 ml-8">
                  Standard saloon cars accommodate 2 large suitcases plus hand luggage. Estate cars fit 3-4 large cases, 
                  and MPVs can handle up to 6 large cases. If you have extra luggage, let us know and we'll arrange a suitable vehicle.
                </p>
              </div>

              <div class="bg-white rounded-lg p-6 shadow-sm">
                <h3 class="text-lg font-bold mb-3 flex items-start">
                  <svg class="w-6 h-6 text-amber-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Are your drivers vetted and licensed?
                </h3>
                <p class="text-gray-700 ml-8">
                  Absolutely. All our drivers undergo thorough background checks including DBS (Disclosure and Barring Service) clearance, 
                  hold valid private hire licenses, and have a minimum of 3 years driving experience.
                </p>
              </div>

              <div class="bg-white rounded-lg p-6 shadow-sm">
                <h3 class="text-lg font-bold mb-3 flex items-start">
                  <svg class="w-6 h-6 text-amber-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Can I add multiple stops to my journey?
                </h3>
                <p class="text-gray-700 ml-8">
                  Yes! You can add multiple pickup or drop-off points. Just mention this when booking and we'll provide an updated quote. 
                  Additional stops may incur a small extra charge depending on the route.
                </p>
              </div>

              <div class="bg-white rounded-lg p-6 shadow-sm">
                <h3 class="text-lg font-bold mb-3 flex items-start">
                  <svg class="w-6 h-6 text-amber-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  What happens if there's heavy traffic?
                </h3>
                <p class="text-gray-700 ml-8">
                  Our prices are fixed regardless of traffic conditions. If there's congestion, your driver will take alternative routes. 
                  We recommend allowing extra time during rush hours (7-9am, 5-7pm weekdays).
                </p>
            </div>
          </div>
        </div>
      </div>
    </section>

      <!-- Booking Process -->
      <section class="py-16 bg-gradient-to-b from-white to-gray-50">
      <div class="container mx-auto px-4">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-12">
              <h2 class="text-3xl md:text-4xl font-bold mb-4">How to Book Your Taxi</h2>
              <p class="text-gray-600 text-lg">Simple, fast, and secure booking in just 4 easy steps</p>
            </div>
            
            <div class="grid md:grid-cols-4 gap-8 relative">
              <!-- Connecting line (hidden on mobile) -->
              <div class="hidden md:block absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 -z-10" style="width: 75%; margin-left: 12.5%;"></div>
              
              <!-- Step 1 -->
              <div class="relative">
                <div class="flex flex-col items-center text-center">
                  <div class="relative mb-4">
                    <div class="inline-block bg-gradient-to-br from-amber-400 to-amber-500 rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold text-white shadow-lg transform hover:scale-110 transition-transform duration-300">
                      1
                    </div>
                  </div>
                  <h3 class="font-bold text-lg mb-3 text-gray-900">Enter Details</h3>
                  <p class="text-gray-600">Fill in pickup location, destination, date, and time in the booking form above.</p>
                </div>
              </div>
              
              <!-- Step 2 -->
              <div class="relative">
                <div class="flex flex-col items-center text-center">
                  <div class="relative mb-4">
                    <div class="inline-block bg-gradient-to-br from-amber-400 to-amber-500 rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold text-white shadow-lg transform hover:scale-110 transition-transform duration-300">
                      2
                    </div>
                  </div>
                  <h3 class="font-bold text-lg mb-3 text-gray-900">Get Instant Quote</h3>
                  <p class="text-gray-600">See your fixed price instantly. Choose from multiple vehicle options to suit your needs.</p>
                </div>
              </div>
              
              <!-- Step 3 -->
              <div class="relative">
                <div class="flex flex-col items-center text-center">
                  <div class="relative mb-4">
                    <div class="inline-block bg-gradient-to-br from-amber-400 to-amber-500 rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold text-white shadow-lg transform hover:scale-110 transition-transform duration-300">
                      3
                    </div>
                  </div>
                  <h3 class="font-bold text-lg mb-3 text-gray-900">Confirm Booking</h3>
                  <p class="text-gray-600">Review details, add any special requirements, and confirm your booking securely online.</p>
                </div>
              </div>
              
              <!-- Step 4 -->
              <div class="relative">
                <div class="flex flex-col items-center text-center">
                  <div class="relative mb-4">
                    <div class="inline-block bg-gradient-to-br from-amber-400 to-amber-500 rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold text-white shadow-lg transform hover:scale-110 transition-transform duration-300">
                      4
                    </div>
                  </div>
                  <h3 class="font-bold text-lg mb-3 text-gray-900">Enjoy Your Ride</h3>
                  <p class="text-gray-600">Receive confirmation with driver details. Track your driver and enjoy a comfortable journey.</p>
                </div>
              </div>
            </div>

            <!-- Additional CTA -->
            <div class="text-center mt-12">
              <button 
                @click="scrollToTop" 
                class="bg-amber-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-amber-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Your Booking Now →
              </button>
              <p class="text-gray-500 text-sm mt-4">No registration required • Fixed prices • Available 24/7</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Additional Info -->
      <section class="py-16 bg-blue-50">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <h2 class="text-3xl font-bold mb-8">
              Travel Tips for 
              <span v-if="taxiRoute">{{ taxiRoute.fromLocation.name }} to {{ taxiRoute.toLocation.name }}</span>
              <span v-else>
                <span class="inline-block h-8 w-32 bg-gray-300 animate-pulse rounded align-middle"></span> to 
                <span class="inline-block h-8 w-32 bg-gray-300 animate-pulse rounded align-middle"></span>
              </span>
            </h2>
            
            <div class="bg-white rounded-xl shadow-lg p-8">
              <div class="grid md:grid-cols-2 gap-6">
                <div v-for="(tip, i) in allTips" :key="i" class="flex items-start">
                  <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span class="text-blue-600 font-bold text-sm">{{ i + 1 }}</span>
                  </div>
                  <p class="text-gray-700">{{ tip }}</p>
                </div>
              </div>
          </div>
        </div>
      </div>
    </section>

      <!-- Service Features -->
      <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <h2 class="text-3xl font-bold mb-8 text-center">Our Service Standards</h2>
            
            <div class="prose prose-lg max-w-none">
              <p class="text-gray-700 mb-6">
                At CityCars Gatwick, we pride ourselves on providing the highest quality taxi service for journeys between 
                <span v-if="taxiRoute">{{ taxiRoute.fromLocation.name }} and {{ taxiRoute.toLocation.name }}</span>
                <span v-else>
                  <span class="inline-block h-5 w-24 bg-gray-300 animate-pulse rounded align-middle"></span> and 
                  <span class="inline-block h-5 w-24 bg-gray-300 animate-pulse rounded align-middle"></span>
                </span>. 
                Our commitment to excellence means you can expect punctuality, professionalism, and comfort every time you travel with us.
              </p>

              <h3 class="text-2xl font-bold mb-4">Professional Service</h3>
              <p class="text-gray-700 mb-6">
                Every member of our team is dedicated to making your journey as smooth and pleasant as possible. From the moment 
                you book until you arrive at your destination, we ensure everything runs perfectly. Our drivers are smartly dressed, 
                courteous, and happy to assist with luggage or any special requirements you may have.
              </p>

              <h3 class="text-2xl font-bold mb-4">Safety First</h3>
              <p class="text-gray-700 mb-6">
                Your safety is our top priority. All our vehicles undergo regular maintenance checks and safety inspections. 
                We carry full insurance coverage, and our drivers are trained in defensive driving techniques. Every vehicle is 
                equipped with GPS tracking for added security and peace of mind.
              </p>

              <h3 class="text-2xl font-bold mb-4">Comfort & Cleanliness</h3>
              <p class="text-gray-700 mb-6">
                Our fleet consists of modern, well-maintained vehicles that are cleaned and sanitized after every journey. 
                Enjoy comfortable seating, climate control, and a smooth ride. We provide bottled water and phone chargers on request.
              </p>
            </div>
          </div>
      </div>
    </section>

    <!-- CTA Section -->
      <section class="py-16 bg-gradient-to-r from-amber-500 to-amber-600">
      <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Book Your Taxi from 
            <span v-if="taxiRoute">{{ taxiRoute.fromLocation.name }} to {{ taxiRoute.toLocation.name }}</span>
            <span v-else>
              <span class="inline-block h-10 w-32 bg-amber-400 animate-pulse rounded align-middle"></span> to 
              <span class="inline-block h-10 w-32 bg-amber-400 animate-pulse rounded align-middle"></span>
            </span>?
          </h2>
          
          <p class="text-amber-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust CityCars Gatwick for their taxi needs. 
            Book now and experience the difference.
        </p>
        <button 
            @click="scrollToTop"
            class="bg-white text-amber-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
        >
            Book Your Taxi Now
        </button>
      </div>
    </section>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const route = useRoute();
const slug = ref(route.params.slug);
const taxiRoute = ref(null);
const loading = ref(true);
const isRoute = ref(true); // Assume it's a route page initially
const notFound = ref(false); // Track if route not found

// Format slug for display (e.g., "gatwick-airport-to-london" -> "Gatwick Airport to London")
const formatSlugForDisplay = (slugStr) => {
  if (!slugStr) return '';
  return slugStr
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(' To ', ' to ');
};

const displayTitle = computed(() => {
  if (taxiRoute.value?.seoData?.h1Title) return taxiRoute.value.seoData.h1Title;
  return `Taxi ${formatSlugForDisplay(slug.value)}`;
});

// Combine dynamic tips with static tips
const allTips = computed(() => {
  const dynamicTips = taxiRoute.value?.content?.tips || [];
  const staticTips = [
    'Book at least 24 hours in advance for guaranteed availability and best prices',
    'Add your flight number for airport pickups so we can monitor delays',
    'Allow extra time during peak hours (7-9am, 5-7pm on weekdays)',
    'Request a receipt at the end of your journey for expense claims',
    'Save your favorite addresses in your account for faster future bookings',
    'Consider booking a return journey at the same time for a discounted rate'
  ];
  
  return [...dynamicTips, ...staticTips];
});

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Set default SEO immediately (before data loads)
const canonicalUrl = `https://citycarsgatwick.co.uk/${slug.value}`;
const defaultTitle = `Taxi ${formatSlugForDisplay(slug.value)} | CityCars Gatwick`;
const defaultDescription = `Book a reliable taxi for ${formatSlugForDisplay(slug.value)}. Professional drivers, fixed prices, 24/7 service. No hidden fees. Book online now!`;

useHead({
  title: defaultTitle,
  link: [
    { rel: 'canonical', href: canonicalUrl }
  ],
  meta: [
    { name: 'description', content: defaultDescription },
    { property: 'og:title', content: defaultTitle },
    { property: 'og:description', content: defaultDescription },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: defaultTitle },
    { name: 'twitter:description', content: defaultDescription }
  ]
});

onMounted(async () => {
  try {
    
    const { $firebase } = useNuxtApp();
    const db = getFirestore($firebase);
    
    const q = query(
      collection(db, 'routes'),
      where('slug', '==', slug.value),
      where('isActive', '==', true)
    );
    
    const snapshot = await getDocs(q);
    
    
    if (!snapshot.empty) {
      // Route found!
      const doc = snapshot.docs[0];
      taxiRoute.value = { id: doc.id, ...doc.data() };
    } else {
      // Route not found - show 404 content instead of redirecting
      notFound.value = true;
      isRoute.value = false;
    }
  } catch (error) {
    console.error('Error loading route:', error);
    notFound.value = true;
  } finally {
    loading.value = false;
  }
});

// Update SEO when route data loads
watch(taxiRoute, (newRoute) => {
  if (newRoute) {
    const title = newRoute.seoData?.title || `Taxi from ${newRoute.fromLocation.name} to ${newRoute.toLocation.name} | CityCars Gatwick`;
    const description = newRoute.seoData?.metaDescription || `Book a taxi from ${newRoute.fromLocation.name} to ${newRoute.toLocation.name}. Fixed price from £${newRoute.averagePrice}. Professional drivers, 24/7 service.`;
    
    useHead({
      title: title,
      link: [
        { rel: 'canonical', href: canonicalUrl }
      ],
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TaxiService',
            'name': `CityCars Gatwick - ${newRoute.fromLocation.name} to ${newRoute.toLocation.name}`,
            'description': description,
            'url': canonicalUrl,
            'provider': {
              '@type': 'LocalBusiness',
              'name': 'CityCars Gatwick',
              'url': 'https://citycarsgatwick.co.uk',
              'telephone': '+44 1234 567890',
              'address': {
                '@type': 'PostalAddress',
                'addressLocality': 'Gatwick',
                'addressCountry': 'UK'
              }
            },
            'areaServed': [
              { '@type': 'Place', 'name': newRoute.fromLocation.name },
              { '@type': 'Place', 'name': newRoute.toLocation.name }
            ],
            'offers': {
              '@type': 'Offer',
              'price': newRoute.averagePrice,
              'priceCurrency': 'GBP',
              'availability': 'https://schema.org/InStock'
            }
          })
        }
      ]
    });
  }
}, { immediate: true });
</script>
