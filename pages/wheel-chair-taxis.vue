<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-amber-50 py-12">
      <div class="container-fluid mx-auto px-4 text-center">
        <h1 class="text-3xl font-bold mb-4 font-sora">Wheelchair Accessible Taxis</h1>
        <p class="max-w-3xl mx-auto text-gray-700 mb-8 font-inter">
          Dedicated wheelchair accessible taxi service by City Cars. We provide reliable, comfortable, and safe
          transportation for wheelchair users, ensuring a smooth and dignified journey for all our passengers.
        </p>

        <!-- Booking Form Component -->
        <BookingForm />
      </div>
    </section>

    <!-- Our Accessibility Features -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 font-sora">Our Wheelchair Accessible Features</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <!-- Wheelchair Accessible Vehicles -->
          <div class="bg-gray-50 rounded-lg p-6 shadow-md">
            <div class="flex items-center mb-4">
              <div class="bg-city-gold p-3 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold font-sora">Wheelchair Accessible Vehicles</h3>
            </div>
            <p class="text-gray-600 font-inter">
              Our fleet includes specially modified vehicles with hydraulic lifts or ramps for easy wheelchair access.
              Spacious interiors accommodate standard and larger wheelchairs comfortably.
            </p>
          </div>

          <!-- Trained Drivers -->
          <div class="bg-gray-50 rounded-lg p-6 shadow-md">
            <div class="flex items-center mb-4">
              <div class="bg-city-gold p-3 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold font-sora">Trained Drivers</h3>
            </div>
            <p class="text-gray-600 font-inter">
              All our drivers are specially trained in wheelchair assistance and securing. They understand the unique
              needs
              of wheelchair users and provide respectful, patient, and dignified service.
            </p>
          </div>

          <!-- Safety First -->
          <div class="bg-gray-50 rounded-lg p-6 shadow-md">
            <div class="flex items-center mb-4">
              <div class="bg-city-gold p-3 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold font-sora">Safety First</h3>
            </div>
            <p class="text-gray-600 font-inter">
              Our vehicles are equipped with the latest safety features including secure wheelchair restraint systems,
              ensuring your wheelchair is safely secured throughout the journey.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Services -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 font-sora">Our Wheelchair Taxi Services</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Airport Transfers -->
          <div class="bg-white rounded-lg p-6 shadow-md">
            <h3 class="text-xl font-semibold mb-4 font-sora">Airport Transfers</h3>
            <p class="text-gray-600 mb-4 font-inter">
              Our wheelchair accessible airport taxi service ensures a smooth journey to and from all major UK airports.
              We monitor flight times and provide meet and greet services to assist with luggage and navigation.
            </p>
            <ul class="list-disc pl-5 mb-4 text-gray-600 font-inter">
              <li>All major UK airports covered</li>
              <li>Flight monitoring included</li>
              <li>Door-to-door service</li>
              <li>No extra charge for wheelchairs</li>
            </ul>
          </div>

          <!-- Medical Appointments -->
          <div class="bg-white rounded-lg p-6 shadow-md">
            <h3 class="text-xl font-semibold mb-4 font-sora">Medical Appointments</h3>
            <p class="text-gray-600 mb-4 font-inter">
              Reliable transportation to hospitals, clinics, and medical facilities. Our drivers understand the
              importance
              of punctuality for medical appointments and will ensure you arrive on time.
            </p>
            <ul class="list-disc pl-5 mb-4 text-gray-600 font-inter">
              <li>Punctual service for medical appointments</li>
              <li>Assistance in and out of medical facilities</li>
              <li>Wait and return service available</li>
              <li>Regular booking options for ongoing treatments</li>
            </ul>
          </div>

          <!-- Day Trips & Events -->
          <div class="bg-white rounded-lg p-6 shadow-md">
            <h3 class="text-xl font-semibold mb-4 font-sora">Day Trips & Events</h3>
            <p class="text-gray-600 mb-4 font-inter">
              Enjoy day trips, social events, or family gatherings with our comfortable wheelchair taxi service. We make
              sure you can participate in all activities with ease and dignity.
            </p>
            <ul class="list-disc pl-5 mb-4 text-gray-600 font-inter">
              <li>Special event transportation</li>
              <li>Wedding and celebration services</li>
              <li>Tourism and sightseeing trips</li>
              <li>Multiple pickup options for group travel</li>
            </ul>
          </div>

          <!-- Regular Transportation -->
          <div class="bg-white rounded-lg p-6 shadow-md">
            <h3 class="text-xl font-semibold mb-4 font-sora">Regular Transportation</h3>
            <p class="text-gray-600 mb-4 font-inter">
              Consistent, reliable transportation for regular journeys such as work commutes, school runs, or recurring
              appointments. Set up a schedule that works for you.
            </p>
            <ul class="list-disc pl-5 mb-4 text-gray-600 font-inter">
              <li>Regular scheduled pickups</li>
              <li>Discounted rates for regular bookings</li>
              <li>Same driver where possible for consistency</li>
              <li>Flexible scheduling options</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-12 bg-amber-100">
      <div class="container-fluid mx-auto px-4 text-center">
        <h2 class="text-2xl font-bold mb-6 font-sora">Ready to Book Your Wheelchair Accessible Taxi?</h2>
        <p class="text-gray-700 mb-8 max-w-3xl mx-auto font-inter">
          Contact us today to book your wheelchair accessible taxi or to discuss your specific requirements.
          Our friendly team is ready to help ensure your journey is comfortable, safe, and stress-free.
        </p>
        <div class="flex justify-center space-x-4">
          <button class="bg-amber-400 hover:bg-amber-500 text-white px-6 py-3 rounded-md font-semibold font-sora">
            Book Now
          </button>
          <a href="/contact-us"
            class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-semibold font-sora">
            Contact Us
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useQueryStore } from '~/stores/queryStore'

// SEO Meta Tags
useSEO({
  title: 'Wheelchair Accessible Taxis Gatwick | Disability-Friendly Airport Transfers',
  description: 'Wheelchair accessible taxis and disability-friendly airport transfers in Gatwick. Specially modified vehicles with ramps, lifts, and trained drivers. Book your accessible taxi today.',
  url: '/wheel-chair-taxis'
})
</script>

<style scoped>
.bg-city-gold {
  background-color: #F4BB3A;
}
</style>