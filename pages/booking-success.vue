<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
    <div class="max-w-2xl w-full">
      <!-- Success Animation Card -->
      <div class="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
        <!-- Animated Success Icon -->
        <div class="mb-8 flex justify-center">
          <div class="success-checkmark">
            <div class="check-icon">
              <span class="icon-line line-tip"></span>
              <span class="icon-line line-long"></span>
              <div class="icon-circle"></div>
              <div class="icon-fix"></div>
            </div>
          </div>
        </div>

        <!-- Success Message -->
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
          🎉 Booking Confirmed!
        </h1>
        
        <p class="text-xl text-gray-600 mb-8 animate-fade-in-delay-1">
          Your ride has been successfully booked
        </p>

        <!-- Booking ID Display -->
        <div class="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-6 mb-8 animate-fade-in-delay-2">
          <p class="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
            Booking Reference
          </p>
          <div class="flex items-center justify-center space-x-2">
            <p class="text-4xl md:text-5xl font-bold text-orange-600 tracking-wider font-mono">
              {{ bookingReference }}
            </p>
            <button 
              @click="copyToClipboard"
              class="p-2 hover:bg-orange-100 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              <svg v-if="!copied" class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <svg v-else class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
          <p v-if="copied" class="text-sm text-green-600 mt-2 font-medium">
            ✓ Copied to clipboard!
          </p>
        </div>

        <!-- Booking Details -->
        <div v-if="bookingDetails" class="bg-gray-50 rounded-2xl p-6 mb-8 text-left animate-fade-in-delay-3">
          <h3 class="text-lg font-bold text-gray-900 mb-4 text-center">Booking Summary</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center border-b border-gray-200 pb-2">
              <span class="text-gray-600">From:</span>
              <span class="font-semibold text-gray-900 text-right">{{ bookingDetails.pickupAddress }}</span>
            </div>
            <div class="flex justify-between items-center border-b border-gray-200 pb-2">
              <span class="text-gray-600">To:</span>
              <span class="font-semibold text-gray-900 text-right">{{ bookingDetails.dropoffAddress }}</span>
            </div>
            <div class="flex justify-between items-center border-b border-gray-200 pb-2">
              <span class="text-gray-600">Date & Time:</span>
              <span class="font-semibold text-gray-900">{{ formatDateTime(bookingDetails.pickupDateTime) }}</span>
            </div>
            <div class="flex justify-between items-center border-b border-gray-200 pb-2">
              <span class="text-gray-600">Vehicle Type:</span>
              <span class="font-semibold text-gray-900 capitalize">{{ bookingDetails.cabType }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 text-lg">Total Fare:</span>
              <span class="font-bold text-orange-600 text-2xl">£{{ bookingDetails.totalFare?.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Info Message -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 animate-fade-in-delay-4">
          <p class="text-sm text-blue-800">
            <strong>📧 Confirmation email sent!</strong><br />
            Please check your inbox at <span class="font-semibold">{{ bookingDetails?.userEmail }}</span>
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-5">
          <NuxtLink
            to="/profile"
            class="flex-1 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            View My Bookings
          </NuxtLink>
          <NuxtLink
            to="/"
            class="flex-1 px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Book Another Ride
          </NuxtLink>
        </div>
      </div>

      <!-- Floating Confetti Animation -->
      <div class="confetti-container">
        <div v-for="i in 50" :key="i" class="confetti" :style="getConfettiStyle(i)"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

definePageMeta({
  title: 'Booking Confirmed - City Cars'
});

const route = useRoute();
const bookingReference = ref(route.query.ref as string || 'CTY00000000');
const bookingDetails = ref<any>(null);
const copied = ref(false);

onMounted(() => {
  // Get booking details from query params or localStorage
  const bookingData = route.query.data ? JSON.parse(decodeURIComponent(route.query.data as string)) : null;
  if (bookingData) {
    bookingDetails.value = bookingData;
  } else {
    // Try to get from localStorage (fallback)
    const savedBooking = localStorage.getItem('lastBooking');
    if (savedBooking) {
      bookingDetails.value = JSON.parse(savedBooking);
      localStorage.removeItem('lastBooking');
    }
  }
});

const formatDateTime = (dateString: string) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(bookingReference.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

const getConfettiStyle = (index: number) => {
  const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomLeft = Math.random() * 100;
  const randomDelay = Math.random() * 3;
  const randomDuration = 3 + Math.random() * 4;
  
  return {
    left: `${randomLeft}%`,
    backgroundColor: randomColor,
    animationDelay: `${randomDelay}s`,
    animationDuration: `${randomDuration}s`
  };
};
</script>

<style scoped>
/* Success Checkmark Animation */
.success-checkmark {
  width: 120px;
  height: 120px;
  margin: 0 auto;
}

.check-icon {
  width: 120px;
  height: 120px;
  position: relative;
  border-radius: 50%;
  box-sizing: content-box;
  border: 4px solid #10b981;
  animation: scale-up 0.5s ease-in-out;
}

.check-icon::before {
  top: 3px;
  left: -2px;
  width: 30px;
  transform-origin: 100% 50%;
  border-radius: 100px 0 0 100px;
}

.check-icon::after {
  top: 0;
  left: 30px;
  width: 60px;
  transform-origin: 0 50%;
  border-radius: 0 100px 100px 0;
  animation: rotate-circle 4.25s ease-in;
}

.icon-line {
  height: 5px;
  background-color: #10b981;
  display: block;
  border-radius: 2px;
  position: absolute;
  z-index: 10;
}

.icon-line.line-tip {
  top: 56px;
  left: 25px;
  width: 25px;
  transform: rotate(45deg);
  animation: icon-line-tip 0.75s;
}

.icon-line.line-long {
  top: 50px;
  right: 13px;
  width: 47px;
  transform: rotate(-45deg);
  animation: icon-line-long 0.75s;
}

.icon-circle {
  top: -4px;
  left: -4px;
  z-index: 10;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: absolute;
  box-sizing: content-box;
  border: 4px solid rgba(16, 185, 129, 0.5);
}

.icon-fix {
  top: 12px;
  width: 7px;
  left: 34px;
  z-index: 1;
  height: 85px;
  position: absolute;
  transform: rotate(-45deg);
  background-color: #fff;
}

@keyframes scale-up {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes icon-line-tip {
  0% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  54% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  70% {
    width: 50px;
    left: -8px;
    top: 37px;
  }
  84% {
    width: 17px;
    left: 21px;
    top: 48px;
  }
  100% {
    width: 25px;
    left: 25px;
    top: 56px;
  }
}

@keyframes icon-line-long {
  0% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  65% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  84% {
    width: 55px;
    right: 0px;
    top: 35px;
  }
  100% {
    width: 47px;
    right: 13px;
    top: 50px;
  }
}

/* Fade-in animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-fade-in-delay-1 {
  animation: fade-in 0.6s ease-out 0.2s both;
}

.animate-fade-in-delay-2 {
  animation: fade-in 0.6s ease-out 0.4s both;
}

.animate-fade-in-delay-3 {
  animation: fade-in 0.6s ease-out 0.6s both;
}

.animate-fade-in-delay-4 {
  animation: fade-in 0.6s ease-out 0.8s both;
}

.animate-fade-in-delay-5 {
  animation: fade-in 0.6s ease-out 1s both;
}

/* Confetti Animation */
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 9999;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  opacity: 0;
  animation: confetti-fall linear infinite;
}

@keyframes confetti-fall {
  0% {
    top: -10px;
    opacity: 1;
    transform: translateX(0) rotateZ(0deg);
  }
  100% {
    top: 100vh;
    opacity: 0;
    transform: translateX(25px) rotateZ(360deg);
  }
}
</style>

