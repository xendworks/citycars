<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <header class="bg-amber-500 text-white py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold text-center">Sample Booking Page</h1>
        <p class="text-center mt-2">This is a sample page demonstrating the booking form</p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <!-- Booking Form Section -->
        <section class="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 class="text-2xl font-semibold mb-6 text-gray-800">Book Your Ride</h2>
          <BookingForm />
        </section>

        <!-- Additional Information Section -->
        <section class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-semibold mb-4 text-gray-800">About Our Service</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-amber-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">24/7 Service</h3>
              <p class="text-gray-600">We're available round the clock to serve you</p>
            </div>
            <div class="bg-amber-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">Professional Drivers</h3>
              <p class="text-gray-600">Experienced and courteous drivers for your comfort</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import BookingForm from '~/components/BookingForm.vue';
import { useQueryStore } from '~/stores/queryStore'
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style> 