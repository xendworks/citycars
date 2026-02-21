<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-10 px-2">
    <div v-if="quote"
      class="bg-white/90 rounded-2xl shadow-2xl p-4 md:p-10 max-w-7xl w-full flex flex-col lg:flex-row gap-8">
      <!-- Left: Booking Form -->
      <div class="flex-1 min-w-0 lg:pr-8">
        <form @submit.prevent="submitBooking" class="space-y-8">
          <!-- Passenger Info -->
          <div class="rounded-xl p-2 space-y-6">
            <h2 class="text-xl font-bold text-gray-900 mb-2">Passenger Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold mb-1 text-gray-700">Name *</label>
                <input v-model="form.name" type="text" required placeholder="Enter your name"
                  class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition placeholder-gray-400" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-1 text-gray-700">Email *</label>
                <input v-model="form.email" type="email" required placeholder="Enter your email"
                  class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition placeholder-gray-400" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-1 text-gray-700">Phone *</label>
                <input v-model="form.phone" type="tel" required placeholder="Enter your phone number"
                  class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition placeholder-gray-400" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-1 text-gray-700">Alternate Number</label>
                <input v-model="form.altPhone" type="tel" placeholder="Optional"
                  class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition placeholder-gray-400" />
              </div>
            </div>
          </div>

          <!-- Journey Details -->
          <div class="rounded-xl p-2 space-y-6">
            <h2 class="text-xl font-bold text-gray-900 mb-2">Journey Details</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold mb-1 text-gray-700">Pickup Full Address *</label>
                <input v-model="form.pickupAddress" type="text" required placeholder="Enter pickup address"
                  class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition placeholder-gray-400" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-1 text-gray-700">Dropoff Full Address *</label>
                <input v-model="form.dropoffAddress" type="text" required placeholder="Enter dropoff address"
                  class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition placeholder-gray-400" />
              </div>
              <div v-if="isAirportPickup">
                <label class="block text-sm font-semibold mb-1 text-gray-700">Flight Details</label>
                <input v-model="form.flightNumber" type="text" placeholder="Eg: B789"
                  class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition placeholder-gray-400" />
              </div>
              <div></div>
            </div>
          </div>

          <!-- Booking Preferences -->
          <div class="rounded-xl p-2 space-y-6">
            <h2 class="text-xl font-bold text-gray-900 mb-2">Booking Preferences</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <CustomSelect v-model="form.paymentMethod" :options="paymentOptions.map(opt => opt.label)"
                  label="Payment Mode *" />
              </div>
              <div>
                <CustomSelect v-model="form.meetAndGreet" :options="['No I don\'t Need', 'Yes I Need Meet & Greet']"
                  label="Meet & Greet (£10.00)" />
              </div>
              <div>
                <CustomSelect v-model="form.childSeat" :options="['No I don\'t Need', 'Yes I Need Child Seat']"
                  label="Child Seat (£5.00 each)" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-1 text-gray-700">Promo Code (Optional)</label>
                <div class="flex gap-2">
                  <input v-model="form.promoCode" type="text" placeholder="Enter code" :disabled="!!appliedPromo"
                    class="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition placeholder-gray-400 uppercase font-mono disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed" />

                  <button v-if="appliedPromo" type="button" @click="clearPromoCode"
                    class="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold uppercase transition hover:bg-red-100 active:scale-95 flex items-center justify-center min-w-[80px]">
                    <el-icon class="mr-1 text-sm">
                      <Close />
                    </el-icon> Clear
                  </button>
                  <button v-else type="button" @click="applyPromoCode"
                    class="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase transition hover:bg-black active:scale-95 min-w-[80px]">
                    Apply
                  </button>
                </div>
                <p v-if="promoMessage"
                  :class="['text-[10px] mt-1 font-bold', promoError ? 'text-red-500' : 'text-green-600']">
                  {{ promoMessage }}
                </p>
                <!-- View Offers Link -->
                <button v-if="activeOffers.length > 0" type="button" @click="showOffersModal = true"
                  class="mt-2 text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline flex items-center transition-colors">
                  <el-icon class="mr-1">
                    <Ticket />
                  </el-icon>
                  View available offers
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1 text-gray-700">Special information to us
                (optional):</label>
              <textarea v-model="form.specialInfo" rows="3" placeholder="Add any special instructions here"
                class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition placeholder-gray-400"></textarea>
            </div>
            <div class="flex items-center mt-2">
              <input type="checkbox" v-model="form.agreeTnC" required class="mr-2 accent-blue-600" />
              <label class="text-sm text-gray-700">I Agree the <a href="/terms" class="text-blue-600 underline">Terms
                  and Conditions</a> Mentioned by your Company</label>
            </div>
          </div>

          <div class="mt-8 text-center">
            <button type="submit" :disabled="isSubmitting"
              class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-10 py-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-200">
              <span v-if="isSubmitting">Submitting Booking...</span>
              <span v-else>Book Now</span>
            </button>
          </div>

          <!-- Success message -->
          <div v-if="confirmation"
            class="mt-8 text-center text-green-600 text-lg font-semibold bg-green-50 p-4 rounded-lg">
            ✅ Booking confirmed! Thank you, {{ form.name }}. We have sent your booking details to {{ form.email }}.
            <br />
            <span class="text-sm">Redirecting to home page...</span>
          </div>

          <!-- Error message -->
          <div v-if="bookingError" class="mt-8 text-center text-red-600 text-lg font-semibold bg-red-50 p-4 rounded-lg">
            ❌ {{ bookingError }}
          </div>
        </form>
      </div>

      <div class="w-full lg:w-[340px] flex-shrink-0 flex flex-col">

        <!-- Trip Summary Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="bg-slate-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <el-icon class="text-blue-500 text-lg">
              <Document />
            </el-icon>
            <h2 class="text-sm font-bold text-slate-800 uppercase tracking-widest m-0">Trip Summary</h2>
          </div>

          <div class="p-6 space-y-5">
            <!-- Locations -->
            <div class="relative pl-6 pb-2 border-b border-gray-100">
              <div class="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gray-200"></div>

              <div class="relative mb-5">
                <div
                  class="absolute -left-[23px] top-1 w-3 h-3 bg-white border-[3px] border-blue-500 rounded-full shadow-sm">
                </div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pick up</p>
                <p class="text-sm font-semibold text-gray-900 leading-snug">{{ quote.from }}</p>
              </div>

              <div class="relative">
                <div
                  class="absolute -left-[23px] top-1 w-3 h-3 bg-white border-[3px] border-amber-500 rounded-full shadow-sm">
                </div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Drop off</p>
                <p class="text-sm font-semibold text-gray-900 leading-snug">{{ quote.to }}</p>
              </div>
            </div>

            <!-- Requirements Grid -->
            <div class="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
              <div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Passengers</p>
                <p class="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <el-icon class="text-gray-400">
                    <User />
                  </el-icon> {{ quote.passengers }}
                </p>
              </div>
              <div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Luggage</p>
                <p class="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <el-icon class="text-gray-400">
                    <Suitcase />
                  </el-icon> {{ quote.luggage }}
                </p>
              </div>
              <div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Vehicle</p>
                <p class="text-sm font-semibold text-gray-900 flex items-center gap-1.5 capitalize">
                  <el-icon class="text-gray-400">
                    <Van />
                  </el-icon> {{ quote.cabType || 'Saloon' }}
                </p>
              </div>
              <div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date & Time</p>
                <p class="text-[13px] font-semibold text-gray-900 flex items-center gap-1.5 -ml-0.5">
                  <el-icon class="text-gray-400">
                    <Calendar />
                  </el-icon>
                  <span class="truncate">{{ new Date(quote.pickupDateTime).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short', hour: '2-digit', minute: '2-digit'
                  }) }}</span>
                </p>
              </div>
            </div>

            <!-- Pricing Details -->
            <div class="space-y-2.5 pt-2">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500 font-medium">Base Fare</span>
                <span class="font-bold text-gray-900">£{{ quote.fare?.toFixed(2) || '0.00' }}</span>
              </div>

              <div v-if="form.meetAndGreet" class="flex justify-between items-center text-sm">
                <span class="text-gray-500 font-medium">Meet & Greet</span>
                <span class="font-bold text-gray-900">£10.00</span>
              </div>

              <div v-if="form.childSeat" class="flex justify-between items-center text-sm">
                <span class="text-gray-500 font-medium">Child Seat</span>
                <span class="font-bold text-gray-900">£5.00</span>
              </div>

              <div v-if="appliedPromo"
                class="flex justify-between items-center text-sm text-green-700 bg-green-50 px-3 py-2 -mx-3 rounded-lg border border-green-100">
                <span class="font-bold flex items-center gap-1.5"><el-icon>
                    <Ticket />
                  </el-icon> {{ appliedPromo.code }} ({{ appliedPromo.discountPercent }}%)</span>
                <span class="font-bold">-£{{ promoDiscountAmount.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <div class="bg-blue-600 px-6 py-5 flex justify-between items-center text-white">
            <span class="text-xs font-bold uppercase tracking-widest text-blue-100">Total Price</span>
            <span class="text-3xl font-black tracking-tight">£{{ totalFare.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Booking Notes -->
        <div class="bg-white rounded-2xl border border-amber-200 overflow-hidden mt-6 shadow-sm">
          <div class="bg-amber-50 px-5 py-4 border-b border-amber-100 flex items-center gap-2">
            <el-icon class="text-amber-500 text-lg">
              <Warning />
            </el-icon>
            <h2 class="text-sm font-bold text-amber-900 uppercase tracking-widest m-0">Important Info</h2>
          </div>
          <div class="p-5">
            <ul class="text-[13px] text-gray-600 space-y-3.5 font-medium leading-relaxed">
              <li class="flex items-start gap-2.5">
                <div class="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></div>
                <p>Bookings need email confirmation. Please click the link in your confirmation email.</p>
              </li>
              <li class="flex items-start gap-2.5">
                <div class="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></div>
                <p>Cash on ride bookings require a <b class="text-gray-900">10% minimum deposit</b> to confirm.</p>
              </li>
              <li class="flex items-start gap-2.5">
                <div class="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></div>
                <p>Cancellations must be made <b class="text-gray-900">at least 24h prior</b> to avoid admin charges.
                </p>
              </li>
            </ul>
          </div>
        </div>

        <!-- Help Support -->
        <div class="bg-slate-900 rounded-2xl text-white p-6 mt-6 relative overflow-hidden group shadow-lg">
          <div
            class="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-colors duration-500">
          </div>
          <h2 class="text-sm font-bold text-white uppercase tracking-widest mb-5 flex items-center gap-2">
            <el-icon class="text-blue-400 text-lg">
              <Service />
            </el-icon> Need Help?
          </h2>
          <div class="space-y-2 relative z-10">
            <a href="tel:+441293222710"
              class="flex items-center gap-4 hover:text-white transition-colors p-3 -mx-3 rounded-xl hover:bg-white/10 group/item">
              <div
                class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-blue-400 shrink-0 group-hover/item:scale-110 transition-transform">
                <el-icon class="text-lg">
                  <Phone />
                </el-icon>
              </div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Call Us 24/7</p>
                <p class="font-bold text-white text-sm tracking-wide">+44 1293 222710</p>
              </div>
            </a>

            <a href="mailto:bookings@citycars.co.uk"
              class="flex items-center gap-4 hover:text-white transition-colors p-3 -mx-3 rounded-xl hover:bg-white/10 group/item">
              <div
                class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-amber-400 shrink-0 group-hover/item:scale-110 transition-transform">
                <el-icon class="text-lg">
                  <Message />
                </el-icon>
              </div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Email Support</p>
                <p class="font-bold text-white text-sm tracking-wide">bookings@citycars.co.uk</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 text-lg">
      No booking found for this quote ID.
    </div>

    <!-- Offers Modal -->
    <div v-if="showOffersModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
        <!-- Header -->
        <div
          class="px-6 py-4 bg-amber-50 border-b border-amber-100 flex items-center justify-between sticky top-0 z-10">
          <div class="flex items-center space-x-2">
            <el-icon class="text-amber-600 text-xl">
              <Ticket />
            </el-icon>
            <h2 class="text-lg font-bold text-amber-900">Available Offers</h2>
          </div>
          <button @click="showOffersModal = false"
            class="text-amber-600 hover:text-amber-800 transition-colors p-1 rounded-full hover:bg-amber-100/50">
            <el-icon class="text-xl">
              <Close />
            </el-icon>
          </button>
        </div>

        <!-- Offers List -->
        <div class="p-6 overflow-y-auto space-y-4 bg-slate-50">
          <div v-for="offer in activeOffers" :key="offer.id"
            class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300 relative overflow-hidden group">

            <div
              class="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50 pointer-events-none">
            </div>

            <div class="p-4 relative z-10">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <h3 class="font-bold text-gray-900 leading-tight mb-1">{{ offer.title }}</h3>
                  <div
                    class="inline-flex px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider rounded">
                    {{ offer.discountPercent }}% OFF
                  </div>
                </div>
              </div>

              <p class="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-2">{{ offer.description }}</p>

              <div class="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                <div
                  class="font-mono text-xs font-bold text-gray-400 select-all border border-dashed border-gray-200 px-2 py-1 rounded bg-gray-50">
                  {{ offer.code }}
                </div>
                <button @click="applyOfferFromModal(offer.code)"
                  class="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer z-20">
                  Apply Offers
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useQuoteStore } from '~/stores/queryStore'
import { computed, ref, watch, watchEffect, onMounted } from 'vue'
import { Ticket, Close, Document, User, Suitcase, Van, Calendar, Warning, Service, Phone, Message } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const quoteStore = useQuoteStore()
const queryStore = useQueryStore()
const { user, userProfile, isAuthenticated } = useAuth()

const showOffersModal = ref(false)

// Get quote ID from URL
const quoteId = route.params.quoteid || route.params.id || route.path.split('/')[1]

// Check authentication on mount
onMounted(() => {

  if (!isAuthenticated.value) {
    // Store the current booking intent
    localStorage.setItem('bookingIntent', JSON.stringify({
      quoteId,
      timestamp: Date.now()
    }));
    // Redirect to login with return URL
    router.push(`/login?redirect=${route.fullPath}`);
    return;
  }

  // Pre-fill form with user data if logged in
  preFillUserData();

  // Pre-fill addresses from quote
  if (quote.value) {
    form.value.pickupAddress = quote.value.from || '';
    form.value.dropoffAddress = quote.value.to || '';
  }
});

// Try to get quote from store, fallback to queryStore data
const quote = computed(() => {

  const storedQuote = quoteStore.getQuote(quoteId)

  if (storedQuote && storedQuote.from && storedQuote.to) {
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
    vehicleType: queryStore.vehicleType || 'saloon',
    fare: 50 // Default fare
  }

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
  promoCode: '',
  specialInfo: '',
  agreeTnC: false,
})

const activeOffers = ref([])
const appliedPromo = ref(null)
const promoMessage = ref('')
const promoError = ref(false)

const promoDiscountAmount = computed(() => {
  if (!appliedPromo.value) return 0
  const baseFare = quote.value?.fare || 0
  return (baseFare * appliedPromo.value.discountPercent) / 100
})

const fetchOffers = async () => {
  try {
    const { getActiveOffers } = useFirestore()
    activeOffers.value = await getActiveOffers()
  } catch (error) {
    console.error('[BOOKING] Error fetching offers:', error)
  }
}

const applyPromoCode = () => {
  if (!form.value.promoCode) {
    promoMessage.value = 'Please enter a code'
    promoError.value = true
    return
  }

  const code = form.value.promoCode.toUpperCase()
  const offer = activeOffers.value.find(o => o.code.toUpperCase() === code)

  if (offer) {
    appliedPromo.value = offer
    promoMessage.value = `Applied: ${offer.discountPercent}% OFF!`
    promoError.value = false
  } else {
    appliedPromo.value = null
    promoMessage.value = 'Invalid or expired promo code'
    promoError.value = true
  }
}

const autoApplyPromo = (code) => {
  form.value.promoCode = code
  applyPromoCode()
}

const clearPromoCode = () => {
  form.value.promoCode = '';
  appliedPromo.value = null;
  promoMessage.value = '';
  promoError.value = false;
};

const applyOfferFromModal = (code) => {
  form.value.promoCode = code;
  showOffersModal.value = false;
  applyPromoCode();
};

onMounted(() => {
  fetchOffers()
})

// Function to pre-fill user data (defined AFTER form)
const preFillUserData = () => {
  if (user.value || userProfile.value) {

    form.value.name = userProfile.value?.displayName || user.value?.displayName || '';
    form.value.email = userProfile.value?.email || user.value?.email || '';
    form.value.phone = userProfile.value?.phoneNumber || user.value?.phoneNumber || '';

  }
};

// Watch userProfile for changes (it loads asynchronously from Firestore)
watch(userProfile, (newProfile) => {
  if (newProfile) {
    preFillUserData();
  }
}, { immediate: false, deep: true });

watchEffect(() => {

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

  // Apply promo discount
  base -= promoDiscountAmount.value

  const option = paymentOptions.find(opt => opt.value === form.value.paymentMethod)
  if (option && option.surcharge) {
    // Surcharge usually applies to the final fare after discount? Or base fare?
    // Let's apply it to the base fare for consistency with previous logic
    base += (quote.value?.fare || 0) * (option.surcharge / 100)
  }
  return base
})

const confirmation = ref(false)
const isSubmitting = ref(false)
const bookingError = ref('')

async function submitBooking() {
  if (!form.value.name || !form.value.email || !form.value.phone || !form.value.pickupAddress || !form.value.dropoffAddress || !form.value.paymentMethod || !form.value.agreeTnC) {
    alert('Please fill all required fields and agree to the terms.');
    return;
  }

  isSubmitting.value = true
  bookingError.value = ''

  try {
    console.log('[BOOKING] Submitting booking to Firestore...');

    // Calculate extras
    const meetAndGreetFee = form.value.meetAndGreet === 'Yes I Need Meet & Greet' ? 10 : 0;
    const childSeatFee = form.value.childSeat === 'Yes I Need Child Seat' ? 5 : 0;

    // Calculate payment surcharge
    const paymentOption = paymentOptions.find(opt => opt.label === form.value.paymentMethod);
    const baseFare = quote.value?.fare || 0;
    const surchargeAmount = paymentOption ? (baseFare * paymentOption.surcharge / 100) : 0;

    const totalAmount = baseFare + meetAndGreetFee + childSeatFee + surchargeAmount;

    // Prepare booking data
    const bookingData = {
      // User info
      userId: user.value?.uid || '',
      userName: form.value.name,
      userEmail: form.value.email,
      userPhone: form.value.phone,
      alternatePhone: form.value.altPhone || null,

      // Journey details
      pickupAddress: form.value.pickupAddress,
      dropoffAddress: form.value.dropoffAddress,
      pickupDateTime: quote.value?.pickupDateTime || '',
      flightNumber: form.value.flightNumber || null,
      totalDistance: quote.value?.distance || null,
      totalDuration: quote.value?.duration || null,

      // Booking details
      cabType: quote.value?.cabType || 'saloon',
      vehicleType: quote.value?.vehicleType || quote.value?.cabType || 'saloon',
      passengers: quote.value?.passengers || 1,
      luggage: quote.value?.luggage || 0,

      // Extras
      meetAndGreet: form.value.meetAndGreet === 'Yes I Need Meet & Greet',
      meetAndGreetFee: meetAndGreetFee,
      childSeat: form.value.childSeat === 'Yes I Need Child Seat',
      childSeatFee: childSeatFee,

      // Payment
      paymentMethod: form.value.paymentMethod,
      baseFare: baseFare,
      promoCode: appliedPromo.value?.code || null,
      promoDiscount: promoDiscountAmount.value,
      surchargeAmount: surchargeAmount,
      totalFare: totalAmount,

      // Additional info
      specialInstructions: form.value.specialInfo || null,

      // Booking metadata
      bookingStatus: 'pending',
      bookingSource: 'web',
      quoteId: quoteId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('[BOOKING] Booking data:', bookingData);

    // Save to Firestore directly (client-side)
    const { createBooking } = useFirestore();
    const response = await createBooking(bookingData);

    console.log('[BOOKING] Response:', response);

    if (response && response.id) {
      confirmation.value = true;
      console.log('[BOOKING] ✅ Booking saved successfully!');
      console.log('[BOOKING] Booking ID:', response.id);
      console.log('[BOOKING] Booking Reference:', response.bookingReference);

      // Save booking details to localStorage as backup
      localStorage.setItem('lastBooking', JSON.stringify(bookingData));

      // Trigger confirmation email silently in background
      try {
        await $fetch('/api/email/booking-confirmation', {
          method: 'POST',
          body: {
            ...bookingData,
            bookingReference: response.bookingReference
          }
        });
      } catch (emailError) {
        console.error('Failed to dispatch confirmation email', emailError);
      }

      // Redirect to success page immediately
      router.push({
        path: '/booking-success',
        query: {
          ref: response.bookingReference,
          data: encodeURIComponent(JSON.stringify(bookingData))
        }
      });
    } else {
      throw new Error('Failed to create booking');
    }

  } catch (error) {
    console.error('[BOOKING] ❌ Error submitting booking:', error);
    bookingError.value = error.message || 'Failed to submit booking. Please try again.';
    alert('Booking failed: ' + bookingError.value);
  } finally {
    isSubmitting.value = false;
  }
}
</script>