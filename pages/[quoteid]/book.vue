<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-10 px-2">
    <div v-if="quote" class="bg-white/90 rounded-2xl shadow-2xl p-4 md:p-10 max-w-7xl w-full flex flex-col lg:flex-row gap-8">
      <!-- Left: Booking Form -->
      <div class="flex-1 min-w-0 lg:pr-8">
        <form @submit.prevent="submitBooking" class="space-y-8">
          <!-- Passenger Info -->
          <div class="rounded-xl p-2 space-y-6">
            <h2 class="text-xl font-bold text-gray-900 mb-2">Passenger Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold mb-1 text-gray-700">Name *</label>
                <input v-model="form.name" type="text" required placeholder="Enter your name" class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition placeholder-gray-400" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-1 text-gray-700">Email *</label>
                <input v-model="form.email" type="email" required placeholder="Enter your email" class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition placeholder-gray-400" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-1 text-gray-700">Phone *</label>
                <input v-model="form.phone" type="tel" required placeholder="Enter your phone number" class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition placeholder-gray-400" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-1 text-gray-700">Alternate Number</label>
                <input v-model="form.altPhone" type="tel" placeholder="Optional" class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition placeholder-gray-400" />
              </div>
            </div>
          </div>

          <!-- Journey Details -->
          <div class="rounded-xl p-2 space-y-6">
            <h2 class="text-xl font-bold text-gray-900 mb-2">Journey Details</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold mb-1 text-gray-700">Pickup Full Address *</label>
                <input v-model="form.pickupAddress" type="text" required placeholder="Enter pickup address" class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition placeholder-gray-400" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-1 text-gray-700">Dropoff Full Address *</label>
                <input v-model="form.dropoffAddress" type="text" required placeholder="Enter dropoff address" class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition placeholder-gray-400" />
              </div>
              <div v-if="isAirportPickup">
                <label class="block text-sm font-semibold mb-1 text-gray-700">Flight Details</label>
                <input v-model="form.flightNumber" type="text" placeholder="Eg: B789" class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition placeholder-gray-400" />
              </div>
              <div></div>
            </div>
          </div>

          <!-- Booking Preferences -->
          <div class="rounded-xl p-2 space-y-6">
            <h2 class="text-xl font-bold text-gray-900 mb-2">Booking Preferences</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <CustomSelect
                  v-model="form.paymentMethod"
                  :options="paymentOptions.map(opt => opt.label)"
                  label="Payment Mode *"
                />
              </div>
              <div>
                <CustomSelect
                  v-model="form.meetAndGreet"
                  :options="['No I don\'t Need', 'Yes I Need Meet & Greet']"
                  label="Meet & Greet (£10.00)"
                />
              </div>
              <div>
                <CustomSelect
                  v-model="form.childSeat"
                  :options="['No I don\'t Need', 'Yes I Need Child Seat']"
                  label="Child Seat (£5.00 each)"
                />
              </div>
              <div></div>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1 text-gray-700">Special information to us (optional):</label>
              <textarea v-model="form.specialInfo" rows="3" placeholder="Add any special instructions here" class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition placeholder-gray-400"></textarea>
            </div>
            <div class="flex items-center mt-2">
              <input type="checkbox" v-model="form.agreeTnC" required class="mr-2 accent-blue-600" />
              <label class="text-sm text-gray-700">I Agree the <a href="/terms" class="text-blue-600 underline">Terms and Conditions</a> Mentioned by your Company</label>
            </div>
          </div>

          <div class="mt-8 text-center">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-200">
              Book Now
            </button>
          </div>
          <div v-if="confirmation" class="mt-8 text-center text-green-600 text-lg font-semibold">
            Booking confirmed! Thank you, {{ form.name }}. We have sent your booking details to {{ form.email }}.
          </div>
        </form>
      </div>

      <!-- Right: Summary & Info -->
      <div class="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
        <div class="bg-gray-50 rounded-xl shadow-md p-6">
          <h2 class="text-lg font-bold text-blue-600 mb-2">Details Provided</h2>
          <table class="w-full text-sm">
            <tbody>
              <tr><td class="font-semibold pr-2">Pickup From:</td><td>{{ quote.from }}</td></tr>
              <tr><td class="font-semibold pr-2">Dropoff To:</td><td>{{ quote.to }}</td></tr>
              <tr><td class="font-semibold pr-2">Passengers:</td><td>{{ quote.passengers }}</td></tr>
              <tr><td class="font-semibold pr-2">Luggages:</td><td>{{ quote.luggage }}</td></tr>
              <tr><td class="font-semibold pr-2">Cab Type:</td><td>{{ quote.cabType }}</td></tr>
              <tr><td class="font-semibold pr-2">Date & Time:</td><td>{{ quote.pickupDateTime }}</td></tr>
              <tr><td class="font-semibold pr-2">Total Fare:</td><td class="text-blue-600 font-bold">£{{ totalFare.toFixed(2) }}</td></tr>
            </tbody>
          </table>
        </div>
        <div class="bg-gray-50 rounded-xl shadow-md p-6">
          <h2 class="text-lg font-bold text-blue-600 mb-2">Booking Note</h2>
          <ul class="list-disc pl-5 text-xs text-gray-700 space-y-1">
            <li>All Bookings made in the website need further confirmation through email by <b>tapping the button</b> on your booking information Email, which will be automatically sent when you booked a Cab.</li>
            <li>Bookings made with Cash on Ride require <b>minimum 10% Deposit</b> as the booking confirmation. Failing to pay deposit leads to cancellation of booking.</li>
            <li>Any cancellation of the booking should be made <b>before 24 hours of the journey</b>. Failing to do so leads to Admin charges and refund of the Balance (applicable for paid Bookings).</li>
          </ul>
        </div>
        <div class="bg-gray-50 rounded-xl shadow-md p-6">
          <h2 class="text-lg font-bold text-blue-600 mb-2">Need any help?</h2>
          <ul class="text-xs text-gray-700 space-y-1">
            <li><b>For Bookings:</b> <a href="tel:+441293222710" class="text-blue-600 hover:underline">+44 1293 222710</a></li>
            <li><b>Email:</b> <a href="mailto:bookings@citycars.co.uk" class="text-blue-600 hover:underline">bookings@citycars.co.uk</a></li>
            <li><b>For instant Reply:</b> Initiate Live Chat</li>
            <li><b>For Complaints:</b> complaints@gatwick-airporttaxis.com</li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 text-lg">
      No booking found for this quote ID.
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useQuoteStore } from '~/stores/queryStore'
import { computed, ref, watchEffect, onMounted } from 'vue'

const route = useRoute()
const quoteStore = useQuoteStore()
const queryStore = useQueryStore()

// Get quote ID from URL
const quoteId = route.params.quoteid || route.params.id || route.path.split('/')[1]

// Try to get quote from store, fallback to queryStore data
const quote = computed(() => {
  console.log('Looking for quote ID:', quoteId)
  console.log('All quotes in store:', quoteStore.quotes)
  
  const storedQuote = quoteStore.getQuote(quoteId)
  console.log('Stored quote found:', storedQuote)
  
  if (storedQuote && storedQuote.from && storedQuote.to) {
    console.log('Using stored quote:', storedQuote)
    return storedQuote
  }
  
  // Fallback to queryStore data
  const fallbackQuote = {
    from: queryStore.from || '',
    to: queryStore.to || '',
    passengers: queryStore.passengers || 1,
    luggage: queryStore.luggage || 0,
    pickupDateTime: queryStore.pickupDateTime || '',
    cabType: queryStore.vehicleType || 'saloon',
    fare: 50 // Default fare
  }
  
  console.log('Using fallback quote:', fallbackQuote)
  return fallbackQuote
})

const form = ref({
  name: '',
  email: '',
  phone: '',
  altPhone: '',
  pickupAddress: '',
  dropoffAddress: '',
  flightNumber: '',
  meetAndGreet: false,
  childSeat: false,
  paymentMethod: '',
  specialInfo: '',
  agreeTnC: false,
})

watchEffect(() => {
  console.log('Quote ID:', quoteId)
  console.log('Stored Quote:', quoteStore.getQuote(quoteId))
  console.log('Query Store Data:', {
    from: queryStore.from,
    to: queryStore.to,
    passengers: queryStore.passengers,
    luggage: queryStore.luggage,
    pickupDateTime: queryStore.pickupDateTime,
    vehicleType: queryStore.vehicleType
  })
  console.log('Computed Quote:', quote.value)
  
  if (quote.value) {
    form.value.pickupAddress = quote.value.from || ''
    form.value.dropoffAddress = quote.value.to || ''
  }
})

// Also populate form on mount
onMounted(() => {
  if (quote.value) {
    form.value.pickupAddress = quote.value.from || ''
    form.value.dropoffAddress = quote.value.to || ''
  }
})

const paymentOptions = [
  { value: 'cash', label: 'Cash (0% Admin Charges)', surcharge: 0 },
  { value: 'card', label: 'Debit / Credit Card (3% Admin Charges)', surcharge: 3 },
  { value: 'paypal', label: 'Paypal Transaction (5% Charges)', surcharge: 5 },
]

const isAirportPickup = computed(() => {
  return (
    (quote.value?.from && quote.value.from.toLowerCase().includes('airport')) ||
    (quote.value?.to && quote.value.to.toLowerCase().includes('airport'))
  )
})

const totalFare = computed(() => {
  let base = quote.value?.fare || 0
  if (form.value.meetAndGreet) base += 10
  if (form.value.childSeat) base += 5
  const option = paymentOptions.find(opt => opt.value === form.value.paymentMethod)
  if (option && option.surcharge) base += (quote.value?.fare || 0) * (option.surcharge / 100)
  return base
})

const confirmation = ref(false)

function submitBooking() {
  if (!form.value.name || !form.value.email || !form.value.phone || !form.value.pickupAddress || !form.value.dropoffAddress || !form.value.paymentMethod || !form.value.agreeTnC) {
    alert('Please fill all required fields and agree to the terms.');
    return;
  }
  confirmation.value = true
  // Here you could send the booking to a backend or store in Pinia
}
</script> 