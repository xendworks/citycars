<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-amber-50 py-12">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-3xl font-bold mb-4 font-sora">Airport Taxi Services</h1>
        <p class="max-w-3xl mx-auto text-gray-700 mb-8 font-inter">
          Reliable and comfortable airport taxi service by City Cars. We provide punctual transportation to and from all
          major UK airports,
          ensuring you never miss your flight or wait around after landing.
        </p>

        <!-- Booking Form Component -->
        <BookingForm />
      </div>
    </section>

    <!-- Airport Services Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 font-sora">Our Airport Taxi Services</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <!-- Meet & Greet -->
          <div class="bg-gray-50 rounded-lg p-6 shadow-md">
            <div class="flex items-center mb-4">
              <div class="bg-city-gold p-3 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold font-sora">Meet & Greet Service</h3>
            </div>
            <p class="text-gray-600 font-inter">
              Our professional drivers will meet you at the airport arrivals with a name board.
              We'll help with your luggage and escort you to your waiting vehicle.
            </p>
          </div>

          <!-- Flight Monitoring -->
          <div class="bg-gray-50 rounded-lg p-6 shadow-md">
            <div class="flex items-center mb-4">
              <div class="bg-city-gold p-3 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold font-sora">Flight Monitoring</h3>
            </div>
            <p class="text-gray-600 font-inter">
              We track your flight in real-time to adjust for any delays or early arrivals,
              ensuring your driver is there when you land, not before or after.
            </p>
          </div>

          <!-- Fixed Pricing -->
          <div class="bg-gray-50 rounded-lg p-6 shadow-md">
            <div class="flex items-center mb-4">
              <div class="bg-city-gold p-3 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold font-sora">Fixed Pricing</h3>
            </div>
            <p class="text-gray-600 font-inter">
              No surprises with our airport taxi service. We offer fixed, competitive rates
              regardless of traffic conditions or time of day.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Airports We Serve -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 font-sora">Airports We Serve</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Gatwick Airport -->
          <div class="text-center p-6">
            <h3 class="text-xl font-semibold mb-3 font-sora">Gatwick Airport</h3>
            <p class="text-gray-600 mb-4 font-inter">
              Reliable taxi service to and from London Gatwick Airport (LGW), serving both North and South terminals.
            </p>
            <a href="#" class="text-city-gold hover:underline font-inter">Book Gatwick taxi →</a>
          </div>

          <!-- Heathrow Airport -->
          <div class="text-center p-6">
            <h3 class="text-xl font-semibold mb-3 font-sora">Heathrow Airport</h3>
            <p class="text-gray-600 mb-4 font-inter">
              Professional taxi service covering all Heathrow terminals (T2, T3, T4, T5) with meet and greet options.
            </p>
            <a href="#" class="text-city-gold hover:underline font-inter">Book Heathrow taxi →</a>
          </div>

          <!-- Stansted Airport -->
          <div class="text-center p-6">
            <h3 class="text-xl font-semibold mb-3 font-sora">Stansted Airport</h3>
            <p class="text-gray-600 mb-4 font-inter">
              Comfortable taxi service to and from London Stansted Airport (STN) with flight tracking included.
            </p>
            <a href="#" class="text-city-gold hover:underline font-inter">Book Stansted taxi →</a>
          </div>

          <!-- Luton Airport -->
          <div class="text-center p-6">
            <h3 class="text-xl font-semibold mb-3 font-sora">Luton Airport</h3>
            <p class="text-gray-600 mb-4 font-inter">
              Reliable taxi transfers to and from London Luton Airport (LTN) at competitive fixed rates.
            </p>
            <a href="#" class="text-city-gold hover:underline font-inter">Book Luton taxi →</a>
          </div>

          <!-- London City Airport -->
          <div class="text-center p-6">
            <h3 class="text-xl font-semibold mb-3 font-sora">London City Airport</h3>
            <p class="text-gray-600 mb-4 font-inter">
              Efficient taxi service to and from London City Airport (LCY) for business and leisure travelers.
            </p>
            <a href="#" class="text-city-gold hover:underline font-inter">Book London City taxi →</a>
          </div>

          <!-- Other UK Airports -->
          <div class="text-center p-6">
            <h3 class="text-xl font-semibold mb-3 font-sora">Other UK Airports</h3>
            <p class="text-gray-600 mb-4 font-inter">
              We also serve Birmingham, Manchester, Edinburgh, Glasgow, Bristol, and other UK airports.
            </p>
            <a href="#" class="text-city-gold hover:underline font-inter">Inquire about other airports →</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useQueryStore } from '~/stores/queryStore'

// SEO Meta Tags
useSEO({
  title: 'Airport Taxi Services - Gatwick, Heathrow & More | CityCars',
  description: 'Reliable airport taxi services to all major UK airports. Professional drivers, competitive prices, and 24/7 availability. Book your airport transfer with CityCars today.',
  url: '/airport-taxis'
})
</script>

<style scoped></style>