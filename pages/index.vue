<template>
  <div class="min-h-screen bg-gray-50 relative">
    <!-- CSS Background Pattern - This will definitely show up -->
    <div class="absolute inset-0" style="background-image: radial-gradient(circle, #F59E0B 1px, transparent 1px); background-size: 25px 25px; opacity: 0.3;"></div>
    
    <!-- Content -->
    <div class="relative z-10">
      <!-- Hero Section -->
      <section class="relative py-8 md:py-16 bg-gradient-to-br from-amber-50 to-yellow-100">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-20">
          <div class="absolute inset-0" style="background-image: radial-gradient(circle at 25% 25%, #f59e0b 2px, transparent 2px), radial-gradient(circle at 75% 75%, #f59e0b 2px, transparent 2px); background-size: 50px 50px;"></div>
        </div>
        
        <!-- Animated Background Circles -->
        <div class="absolute top-10 left-10 w-20 h-20 bg-amber-200 rounded-full opacity-30 animate-pulse"></div>
        <div class="absolute bottom-10 right-10 w-32 h-32 bg-amber-300 rounded-full opacity-20 animate-ping"></div>
        <div class="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-200 rounded-full opacity-40 animate-bounce"></div>
        
        <div class="container mx-auto px-4 text-center relative z-10">
          <!-- Animated Heading -->
          <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-gray-900 animate-fade-in-up">
            Book Wheel Chair Taxis from and to Gatwick
          </h1>
          
          <!-- Subtitle -->
          <p class="text-base md:text-lg text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto animate-fade-in-up">
            Reliable, comfortable, and accessible taxi services. Book your journey with confidence and enjoy a stress-free travel experience.
          </p>
          
          <!-- Booking Form -->
          <div class="mx-auto animate-fade-in-up">
            <BookingForm />
          </div>
        </div>
      </section>

      <!-- Why Choose Us Section -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-16">Why ride with City Cars?</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <!-- Cheaper Prices -->
            <div class="text-center">
              <div class="flex justify-center mb-6">
                <div class="rounded-full bg-amber-200 p-6 inline-block">
                  <span class="text-amber-500 text-5xl font-bold">£</span>
                </div>
              </div>
              <h3 class="text-2xl font-bold mb-4">Cheaper Prices</h3>
              <p class="text-gray-700">
                Our taxi services offer competitive pricing, ensuring great value for your money. Enjoy a
                comfortable ride at affordable rates, perfect for both short trips and long journeys.
              </p>
            </div>
            
            <!-- Easy Online Booking -->
            <div class="text-center">
              <div class="flex justify-center mb-6">
                <div class="rounded-full bg-amber-200 p-6 inline-block">
                  <span class="text-amber-500 text-2xl font-bold">BOOK</span>
                </div>
              </div>
              <h3 class="text-2xl font-bold mb-4">Easy Online Booking</h3>
              <p class="text-gray-700">
                Booking your taxi with us is simple and convenient. With our user-friendly online platform, you can schedule your
                ride in just a few clicks. Plus, you'll receive instant confirmation and can easily track your driver's arrival.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Taxi Types Section -->
      <section class="py-8 md:py-16 bg-white">
        <div class="container mx-auto px-4">
          <div class="text-center mb-8 md:mb-12">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Choose Your Perfect Ride</h2>
            <p class="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">Select from our range of accessible vehicles designed for your comfort and convenience</p>
          </div>

          <!-- Modern Tab Design -->
          <div class="mx-auto">
            <!-- Tab Navigation -->
            <div class="flex flex-wrap justify-center mb-6 md:mb-8 bg-gray-100 rounded-xl p-1 md:p-2">
              <button 
                v-for="(tab, index) in taxiTypes" 
                :key="tab.id"
                @click="activeTaxiTab = tab.id"
                :class="[
                  'px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-medium transition-all duration-300 flex items-center space-x-1 md:space-x-2 text-sm md:text-base',
                  activeTaxiTab === tab.id 
                    ? 'bg-white text-amber-600 shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-amber-600 hover:bg-white/50'
                ]"
              >
                <svg class="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span class="hidden sm:inline">{{ tab.name }}</span>
                <span class="sm:hidden">{{ tab.name.split(' ')[0] }}</span>
              </button>
            </div>

            <!-- Tab Content -->
            <div class="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl overflow-hidden">
              <div v-for="tab in taxiTypes" :key="tab.id" v-show="activeTaxiTab === tab.id" class="p-4 md:p-8">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
                  <!-- Vehicle Image & Details -->
                  <div class="space-y-4 md:space-y-6">
                    <div class="relative">
                      <div class="w-full h-48 md:h-64 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg md:rounded-xl flex items-center justify-center overflow-hidden">
                        <img :src="tab.image" :alt="tab.name" class="w-full h-full object-cover" />
                      </div>
                    </div>
                    
                    <!-- Specs Grid -->
                    <div class="grid grid-cols-2 gap-3 md:gap-4">
                      <div class="bg-gray-50 p-3 md:p-4 rounded-lg">
                        <div class="flex items-center space-x-2 mb-2">
                          <svg class="w-4 h-4 md:w-5 md:h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span class="font-medium text-gray-900 text-sm md:text-base">Passengers</span>
                        </div>
                        <p class="text-xl md:text-2xl font-bold text-amber-600">{{ tab.passengers }}</p>
                      </div>
                      
                      <div class="bg-gray-50 p-3 md:p-4 rounded-lg">
                        <div class="flex items-center space-x-2 mb-2">
                          <svg class="w-4 h-4 md:w-5 md:h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span class="font-medium text-gray-900 text-sm md:text-base">Luggage</span>
                        </div>
                        <p class="text-lg md:text-2xl font-bold text-amber-600">{{ tab.luggage }}</p>
                      </div>
                      
                      <div class="bg-gray-50 p-3 md:p-4 rounded-lg">
                        <div class="flex items-center space-x-2 mb-2">
                          <svg class="w-4 h-4 md:w-5 md:h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span class="font-medium text-gray-900 text-sm md:text-base">Speed</span>
                        </div>
                        <p class="text-lg md:text-2xl font-bold text-amber-600">{{ tab.speed }}</p>
                      </div>
                      
                      <div class="bg-gray-50 p-3 md:p-4 rounded-lg">
                        <div class="flex items-center space-x-2 mb-2">
                          <svg class="w-4 h-4 md:w-5 md:h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span class="font-medium text-gray-900 text-sm md:text-base">Features</span>
                        </div>
                        <p class="text-xs md:text-sm text-gray-600">{{ tab.features }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Description & CTA -->
                  <div class="space-y-4 md:space-y-6">
                    <div>
                      <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">{{ tab.name }}</h3>
                      <p class="text-gray-600 leading-relaxed text-sm md:text-base">{{ tab.description }}</p>
                    </div>
                    
                    <!-- Features List -->
                    <div class="space-y-2 md:space-y-3">
                      <h4 class="font-semibold text-gray-900 text-sm md:text-base">What's Included:</h4>
                      <ul class="space-y-1 md:space-y-2">
                        <li v-for="feature in tab.included" :key="feature" class="flex items-center space-x-2 md:space-x-3">
                          <svg class="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span class="text-gray-700 text-sm md:text-base">{{ feature }}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <!-- CTA Button -->
                    <button class="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 md:py-4 px-4 md:px-6 rounded-lg md:rounded-xl font-semibold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                      Book {{ tab.name }} Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Cities We Cover Section -->
      <section class="py-8 md:py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 font-lexend">Cities & Towns We Cover from Gatwick</h2>
          <p class="text-base md:text-lg text-gray-600 text-center max-w-3xl mx-auto mb-8 md:mb-12 font-inter">
            City Cars provides reliable taxi services to and from all major cities and towns within 100 miles of Gatwick Airport. 
            Our drivers know the best routes to get you to your destination quickly and safely.
          </p>
          
          <!-- Interactive Map and Destinations -->
          <div class="grid grid-cols-1 lg:grid-cols-10 gap-6 md:gap-8 max-w-6xl mx-auto">
            <!-- Map (Left Side on Desktop) - 30% width -->
            <div class="lg:col-span-3 bg-white rounded-lg shadow-md p-3 md:p-4 h-full flex items-center justify-center">
              <div class="relative w-full h-64 md:h-80 lg:h-96 bg-blue-50 rounded-lg overflow-hidden">
                <!-- Map Image with Pin for Gatwick -->
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d79890.36844211896!2d-0.2233267442627485!3d51.15273903123274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4875efde7d1f391b%3A0x59dda4c5c3c7b4ee!2sGatwick%20Airport!5e0!3m2!1sen!2suk!4v1652345678901!5m2!1sen!2suk" 
                  width="100%" 
                  height="100%" 
                  style="border:0;" 
                  allowfullscreen="" 
                  loading="lazy" 
                  referrerpolicy="no-referrer-when-downgrade"
                  class="w-full h-full object-cover"
                  title="Map showing Gatwick Airport location">
                </iframe>
              </div>
            </div>
            
            <!-- Destinations (Right Side on Desktop) - 70% width -->
            <div class="lg:col-span-7 bg-white rounded-lg shadow-md p-4 md:p-6">
              <!-- Region Tabs -->
              <div class="flex flex-wrap space-x-1 mb-4 md:mb-6 bg-gray-100 rounded-lg p-1">
                <button 
                  v-for="tab in ['popular', 'london', 'coast', 'all']" 
                  :key="tab"
                  @click="activeTab = tab"
                  :class="[
                    'px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors',
                    activeTab === tab 
                      ? 'bg-white text-amber-600 shadow-sm' 
                      : 'text-gray-600 hover:text-amber-600'
                  ]"
                >
                  {{ tab === 'popular' ? 'Popular' : 
                     tab === 'london' ? 'London' : 
                     tab === 'coast' ? 'Coast' : 'All' }}
                </button>
              </div>
              
              <!-- Destinations Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                <!-- Display cities based on active tab -->
                <div 
                  v-for="city in cityDestinations[activeTab]" 
                  :key="city.name"
                  class="p-2 md:p-3 flex items-center space-x-2 hover:bg-amber-50 rounded-md transition-colors group"
                >
                  <div class="w-6 h-6 md:w-8 md:h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 group-hover:bg-amber-200 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 md:h-4 md:w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <span class="font-inter text-gray-700 group-hover:text-amber-700 text-sm md:text-base">{{ city.name }}</span>
                  <span class="text-xs text-gray-400 ml-auto font-inter">{{ city.distance }}</span>
                </div>
              </div>
              
              <!-- See More Button -->
              <div class="mt-4 md:mt-6 text-center">
                <button class="inline-flex items-center font-medium text-amber-500 hover:text-amber-600 font-inter text-sm md:text-base">
                  See all destinations
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Call to Action -->
          <div class="mt-8 md:mt-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow-lg p-6 md:p-8 max-w-5xl mx-auto">
            <div class="flex flex-col md:flex-row items-center justify-between">
              <div class="mb-4 md:mb-0 md:mr-6">
                <h3 class="text-white text-xl md:text-2xl font-bold mb-2 font-lexend">Need a custom destination?</h3>
                <p class="text-amber-100 font-inter text-sm md:text-base">
                  If you don't see your destination listed, don't worry! We cover many more locations.
                  Contact us for a custom quote to any destination within 100 miles of Gatwick Airport.
                </p>
              </div>
              <div class="flex-shrink-0">
                <a href="/contact-us" class="inline-block bg-white text-amber-600 hover:bg-amber-50 px-4 md:px-6 py-2 md:py-3 rounded-md font-semibold font-lexend transition-colors shadow-md text-sm md:text-base">
                  Get Your Quote
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Price Guide Section -->
      <section class="py-16 bg-blue-50">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-8 font-lexend text-blue-900">Price Guide for Gatwick Airport</h2>
          <p class="text-gray-600 text-center max-w-3xl mx-auto mb-10 font-inter">
            Check our competitive pricing for popular destinations to and from Gatwick Airport. 
            All prices shown are starting prices for a standard saloon car with up to 4 passengers.
          </p>
          
          <!-- Price Table -->
          <div class="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
            <!-- Table Header -->
            <div class="grid grid-cols-3 bg-blue-100 p-4 font-semibold text-blue-900 font-lexend">
              <div class="col-span-1 px-4">From</div>
              <div class="col-span-1 px-4">To</div>
              <div class="col-span-1 px-4 text-right">Prices from</div>
            </div>
            
            <!-- Table Rows -->
            <div class="divide-y divide-gray-200">
              <!-- Row 1 -->
              <div class="grid grid-cols-3 p-4 hover:bg-gray-50">
                <div class="col-span-1 px-4 font-inter">Gatwick Airport</div>
                <div class="col-span-1 px-4 font-inter">Piccadilly Circus</div>
                <div class="col-span-1 px-4 text-right font-semibold font-lexend text-blue-900">£89</div>
              </div>
              
              <!-- Row 2 -->
              <div class="grid grid-cols-3 p-4 hover:bg-gray-50">
                <div class="col-span-1 px-4 font-inter">Gatwick Airport</div>
                <div class="col-span-1 px-4 font-inter">
                  <span class="text-blue-600 font-medium">Liverpool</span> Street rail station
                </div>
                <div class="col-span-1 px-4 text-right font-semibold font-lexend text-blue-900">£84</div>
              </div>
              
              <!-- Row 3 -->
              <div class="grid grid-cols-3 p-4 hover:bg-gray-50">
                <div class="col-span-1 px-4 font-inter">Gatwick Airport</div>
                <div class="col-span-1 px-4 font-inter">Brighton</div>
                <div class="col-span-1 px-4 text-right font-semibold font-lexend text-blue-900">£74</div>
              </div>
              
              <!-- Row 4 -->
              <div class="grid grid-cols-3 p-4 hover:bg-gray-50">
                <div class="col-span-1 px-4 font-inter">Heathrow Airport</div>
                <div class="col-span-1 px-4 font-inter">Gatwick Airport</div>
                <div class="col-span-1 px-4 text-right font-semibold font-lexend text-blue-900">£89</div>
              </div>
              
              <!-- Row 5 -->
              <div class="grid grid-cols-3 p-4 hover:bg-gray-50">
                <div class="col-span-1 px-4 font-inter">Notting Hill</div>
                <div class="col-span-1 px-4 font-inter">Gatwick Airport</div>
                <div class="col-span-1 px-4 text-right font-semibold font-lexend text-blue-900">£86</div>
              </div>
              
              <!-- Row 6 -->
              <div class="grid grid-cols-3 p-4 hover:bg-gray-50">
                <div class="col-span-1 px-4 font-inter">Sevenoaks</div>
                <div class="col-span-1 px-4 font-inter">Gatwick Airport</div>
                <div class="col-span-1 px-4 text-right font-semibold font-lexend text-blue-900">£80</div>
              </div>
            </div>
            
            <!-- Table Footer -->
            <div class="bg-gray-50 p-4 text-center text-sm text-gray-500 font-inter italic">
              Price last updated on 1st March 2025, average taken between January 2025 and February 2025
            </div>
          </div>
          
          <!-- Price Information -->
          <div class="max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Card 1 -->
            <div class="bg-white rounded-lg p-6 shadow-md">
              <div class="text-center mb-4">
                <div class="inline-block bg-blue-100 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold mt-3 font-lexend">No Hidden Fees</h3>
              </div>
              <p class="text-gray-600 text-center font-inter">
                Our prices include all taxes, waiting time at airports, and flight monitoring. No surprises when you reach your destination.
              </p>
            </div>
            
            <!-- Card 2 -->
            <div class="bg-white rounded-lg p-6 shadow-md">
              <div class="text-center mb-4">
                <div class="inline-block bg-blue-100 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold mt-3 font-lexend">Fixed Pricing</h3>
              </div>
              <p class="text-gray-600 text-center font-inter">
                All our journeys come with fixed prices, regardless of traffic conditions or time of day. The price you see is the price you pay.
              </p>
            </div>
            
            <!-- Card 3 -->
            <div class="bg-white rounded-lg p-6 shadow-md">
              <div class="text-center mb-4">
                <div class="inline-block bg-blue-100 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold mt-3 font-lexend">Instant Quote</h3>
              </div>
              <p class="text-gray-600 text-center font-inter">
                Get an instant price quote for your specific journey using our online booking form at the top of this page. No commitment required.
              </p>
            </div>
          </div>
          
          <!-- CTA Button -->
          <div class="text-center mt-10">
            <button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold font-lexend transition-colors">
              Get Your Custom Quote Now
            </button>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12 font-lexend">Frequently Asked Questions</h2>
          
          <div class="max-w-4xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- FAQ Column 1 -->
              <div class="space-y-6">
                <!-- FAQ Item 1 -->
                <div class="bg-gray-50 rounded-lg p-6 shadow-sm">
                  <h3 class="text-lg font-semibold mb-3 font-lexend">How do I book a taxi from Gatwick?</h3>
                  <p class="text-gray-600 font-inter">
                    You can book a taxi through our website, mobile app, or by calling our 24/7 booking line. 
                    We recommend booking in advance to ensure availability, especially during peak travel times.
                  </p>
                </div>
                
                <!-- FAQ Item 2 -->
                <div class="bg-gray-50 rounded-lg p-6 shadow-sm">
                  <h3 class="text-lg font-semibold mb-3 font-lexend">What happens if my flight is delayed?</h3>
                  <p class="text-gray-600 font-inter">
                    Don't worry! We monitor all flight arrivals in real-time. Your driver will adjust their schedule
                    based on your actual arrival time, and there's no extra charge for flight delays.
                  </p>
                </div>
                
                <!-- FAQ Item 3 -->
                <div class="bg-gray-50 rounded-lg p-6 shadow-sm">
                  <h3 class="text-lg font-semibold mb-3 font-lexend">Do I need to pay in advance?</h3>
                  <p class="text-gray-600 font-inter">
                    For most bookings, you can pay the driver directly at the end of your journey using cash or card. 
                    However, advance payment is required for certain long-distance journeys or special vehicle types.
                  </p>
                </div>
              </div>
              
              <!-- FAQ Column 2 -->
              <div class="space-y-6">
                <!-- FAQ Item 4 -->
                <div class="bg-gray-50 rounded-lg p-6 shadow-sm">
                  <h3 class="text-lg font-semibold mb-3 font-lexend">How do I know which type of taxi I need?</h3>
                  <p class="text-gray-600 font-inter">
                    Choose based on your group size and luggage requirements. For help deciding, you can contact our customer service team who will recommend the best vehicle type for your specific needs.
                  </p>
                </div>
                
                <!-- FAQ Item 5 -->
                <div class="bg-gray-50 rounded-lg p-6 shadow-sm">
                  <h3 class="text-lg font-semibold mb-3 font-lexend">Are your vehicles wheelchair accessible?</h3>
                  <p class="text-gray-600 font-inter">
                    Yes, we have specially modified vehicles for wheelchair users. Please specify your requirements when booking, and check our <a href="/wheel-chair-taxis" class="text-amber-500 hover:underline">Wheelchair Taxis</a> page for more information.
                  </p>
                </div>
                
                <!-- FAQ Item 6 -->
                <div class="bg-gray-50 rounded-lg p-6 shadow-sm">
                  <h3 class="text-lg font-semibold mb-3 font-lexend">Do you provide child seats?</h3>
                  <p class="text-gray-600 font-inter">
                    Yes, we can provide child seats upon request. Please let us know the ages of children traveling when making your booking so we can arrange appropriate seating.
                  </p>
                </div>
              </div>
            </div>
            
            <!-- More FAQs Button -->
            <div class="text-center mt-10">
              <a href="/contact-us#faq" class="inline-block text-amber-500 font-medium hover:underline font-inter">
                View more frequently asked questions →
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Call to Action Section -->
      <section class="py-12 bg-amber-100">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-2xl font-bold mb-6 font-lexend">Ready to Book Your Taxi?</h2>
          <p class="text-gray-700 mb-8 max-w-3xl mx-auto font-inter">
            Book your taxi now for reliable, comfortable, and affordable transportation from Gatwick Airport.
            Our professional drivers and well-maintained vehicles ensure a pleasant journey every time.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <button class="bg-amber-400 hover:bg-amber-500 text-white px-6 py-3 rounded-md font-semibold font-lexend">
              Book Now
            </button>
            <a href="/contact-us" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-semibold font-lexend">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BookingForm from '../components/BookingForm.vue';

// For tab functionality in Cities section
const activeTab = ref('popular')

// City data organized by category
const cityDestinations = ref({
  popular: [
    { name: 'London', distance: '25 miles' },
    { name: 'Brighton', distance: '28 miles' },
    { name: 'Southampton', distance: '70 miles' },
    { name: 'Oxford', distance: '62 miles' },
    { name: 'Heathrow', distance: '40 miles' },
    { name: 'Portsmouth', distance: '58 miles' },
    { name: 'Crawley', distance: '3 miles' },
    { name: 'Horsham', distance: '15 miles' },
    { name: 'Guildford', distance: '22 miles' }
  ],
  london: [
    { name: 'Central London', distance: '30 miles' },
    { name: 'Westminster', distance: '31 miles' },
    { name: 'Kensington', distance: '32 miles' },
    { name: 'Camden', distance: '33 miles' },
    { name: 'Greenwich', distance: '35 miles' },
    { name: 'Canary Wharf', distance: '37 miles' },
    { name: 'Croydon', distance: '15 miles' },
    { name: 'Richmond', distance: '28 miles' },
    { name: 'Bromley', distance: '20 miles' }
  ],
  coast: [
    { name: 'Brighton', distance: '28 miles' },
    { name: 'Eastbourne', distance: '42 miles' },
    { name: 'Worthing', distance: '35 miles' },
    { name: 'Bognor Regis', distance: '39 miles' },
    { name: 'Hastings', distance: '50 miles' },
    { name: 'Portsmouth', distance: '58 miles' },
    { name: 'Southampton', distance: '70 miles' },
    { name: 'Bournemouth', distance: '85 miles' },
    { name: 'Chichester', distance: '40 miles' }
  ],
  all: [
    { name: 'London', distance: '25 miles' },
    { name: 'Brighton', distance: '28 miles' },
    { name: 'Crawley', distance: '3 miles' },
    { name: 'Horsham', distance: '15 miles' },
    { name: 'Guildford', distance: '22 miles' },
    { name: 'Worthing', distance: '35 miles' },
    { name: 'Tunbridge Wells', distance: '24 miles' },
    { name: 'Eastbourne', distance: '42 miles' },
    { name: 'Reading', distance: '42 miles' },
    { name: 'Oxford', distance: '62 miles' },
    { name: 'Southampton', distance: '70 miles' },
    { name: 'Portsmouth', distance: '58 miles' },
    { name: 'Chichester', distance: '40 miles' },
    { name: 'Winchester', distance: '54 miles' }
  ]
})

// New data for Taxi Types section
const taxiTypes = ref([
  {
    id: 'saloon',
    name: 'Saloon',
    passengers: '4',
    luggage: '2 medium suitcases',
    speed: 'Fast',
    features: 'Standard saloon car with comfortable seating for up to 4 passengers.',
    included: ['Comfortable seating', 'Up to 4 passengers', '2 medium suitcases'],
    description: 'Our standard saloon cars comfortably seat up to 4 passengers with 2 medium suitcases. Perfect for individuals, couples, or small groups traveling with moderate luggage.',
    image: '/images/2.png'
  },
  {
    id: 'estate',
    name: 'Estate',
    passengers: '4',
    luggage: '3-4 large suitcases',
    speed: 'Moderate',
    features: 'Estate cars offer extra luggage space while still seating up to 4 passengers comfortably.',
    included: ['Extra luggage space', 'Up to 4 passengers', '3-4 large suitcases'],
    description: 'Our estate cars offer extra luggage space while still seating up to 4 passengers comfortably. Ideal for airport transfers with additional luggage requirements.',
    image: '/images/3.png'
  },
  {
    id: 'mpv',
    name: 'MPV',
    passengers: '6',
    luggage: '4 large suitcases',
    speed: 'Fast',
    features: 'Multi-Purpose Vehicles offer more space for both passengers and luggage, seating up to 6 people.',
    included: ['More space', 'Up to 6 passengers', '4 large suitcases'],
    description: 'Multi-Purpose Vehicles offer more space for both passengers and luggage, seating up to 6 people. Ideal for families or small groups traveling together.',
    image: '/images/4.png'
  },
  {
    id: 'wheelchair',
    name: 'Wheelchair Accessible',
    passengers: '4',
    luggage: '2 medium suitcases',
    speed: 'Moderate',
    features: 'Specially modified vehicles equipped with ramps or lifts for wheelchair access.',
    included: ['Wheelchair accessibility', 'Up to 4 passengers', '2 medium suitcases'],
    description: 'Specially modified vehicles equipped with ramps or lifts for wheelchair access. Our drivers are trained to provide assistance for comfortable and dignified travel.',
    image: '/images/8.png'
  }
])

const activeTaxiTab = ref('saloon')

definePageMeta({
  title: 'CityCars - Book Wheelchair Taxis at Gatwick Airport'
})
</script>

<style scoped>
/* Custom styles for El Tabs if needed */
:deep(.el-tabs__nav-wrap) {
  padding-bottom: 0;
}

:deep(.el-tabs__item) {
  font-family: 'Lexend', sans-serif;
  font-weight: 500;
}

:deep(.el-tabs__item.is-active) {
  color: #d97706; /* amber-600 */
}

:deep(.el-tabs__active-bar) {
  background-color: #d97706; /* amber-600 */
}
</style>