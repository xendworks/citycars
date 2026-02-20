<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="text-4xl font-bold font-sora mb-2">
          <span class="text-black">CITY</span>
          <span class="text-amber-400">CARS</span>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 font-sora">Verify Your Phone</h2>
        <p class="mt-2 text-sm text-gray-600 font-inter">
          Enter your phone number to receive a verification code
        </p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm font-inter">
        {{ error }}
      </div>

      <!-- Success Message -->
      <div v-if="successMessage"
        class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm font-inter">
        {{ successMessage }}
      </div>

      <!-- Step 1: Enter Phone Number -->
      <div v-if="step === 1"
        class="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all group">
        <form @submit.prevent="sendCode" class="space-y-6">
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1 font-sora">
              Phone Number
            </label>
            <input id="phone" v-model="phoneNumber" type="tel" required placeholder="+44 1234 567890"
              class="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-amber-500 focus:border-amber-500 font-inter" />
            <p class="mt-1 text-xs text-gray-500 font-inter">
              Include country code (e.g., +44 for UK)
            </p>
          </div>

          <button type="submit" :disabled="isLoading || !phoneNumber"
            class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed font-sora transition-colors">
            <span v-if="!isLoading">Send Verification Code</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Sending...
            </span>
          </button>
        </form>
      </div>

      <!-- Step 2: Enter Verification Code -->
      <div v-if="step === 2"
        class="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all group">
        <div class="text-center mb-6">
          <p class="text-sm text-gray-600 font-inter">
            We sent a verification code to
          </p>
          <p class="text-lg font-semibold text-gray-900 font-sora">
            {{ phoneNumber }}
          </p>
          <button @click="changeNumber" class="mt-2 text-sm text-amber-600 hover:text-amber-700 font-inter">
            Change number
          </button>
        </div>

        <form @submit.prevent="verifyCode" class="space-y-6">
          <div>
            <label for="code" class="block text-sm font-medium text-gray-700 mb-1 font-sora">
              Verification Code
            </label>
            <input id="code" v-model="verificationCode" type="text" required maxlength="6" placeholder="123456"
              class="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-center text-2xl font-mono tracking-widest font-inter" />
            <p class="mt-1 text-xs text-gray-500 font-inter text-center">
              Enter the 6-digit code
            </p>
          </div>

          <button type="submit" :disabled="isLoading || verificationCode.length !== 6"
            class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed font-sora transition-colors">
            <span v-if="!isLoading">Verify</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Verifying...
            </span>
          </button>

          <button type="button" @click="resendCode" :disabled="isLoading || resendTimer > 0"
            class="w-full py-2 text-sm text-gray-600 hover:text-gray-900 font-inter disabled:opacity-50">
            {{ resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code' }}
          </button>
        </form>
      </div>

      <!-- reCAPTCHA container (invisible) -->
      <div id="recaptcha-container"></div>

      <!-- Back to home -->
      <div class="text-center">
        <NuxtLink to="/" class="text-sm text-gray-600 hover:text-gray-900 font-inter">
          Back to home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  layout: false,
  title: 'Verify Phone - City Cars'
});

const router = useRouter();
const route = useRoute();
const { setupRecaptcha, sendSMSVerification, verifySMSCode, isLoading, error } = useAuth();

const step = ref(1); // 1 = enter phone, 2 = enter code
const phoneNumber = ref('');
const verificationCode = ref('');
const successMessage = ref('');
const resendTimer = ref(0);
let resendInterval: NodeJS.Timeout | null = null;

onMounted(async () => {
  // Pre-fill phone number from query if available
  if (route.query.phone) {
    phoneNumber.value = String(route.query.phone);
  }

  // Setup reCAPTCHA on mount
  try {
    await setupRecaptcha('recaptcha-container');
  } catch (err) {
    console.error('[VERIFY-PHONE] reCAPTCHA setup failed:', err);
  }
});

onUnmounted(() => {
  if (resendInterval) {
    clearInterval(resendInterval);
  }
});

const sendCode = async () => {
  successMessage.value = '';

  try {
    await sendSMSVerification(phoneNumber.value);
    successMessage.value = 'Verification code sent!';
    step.value = 2;
    startResendTimer();
  } catch (err: any) {
    console.error('[VERIFY-PHONE] Send code error:', err);
  }
};

const verifyCode = async () => {
  successMessage.value = '';

  try {
    await verifySMSCode(verificationCode.value);
    successMessage.value = 'Phone verified successfully!';

    // Redirect after short delay
    setTimeout(() => {
      router.push('/profile');
    }, 1500);
  } catch (err: any) {
    console.error('[VERIFY-PHONE] Verify code error:', err);
  }
};

const changeNumber = () => {
  step.value = 1;
  verificationCode.value = '';
  successMessage.value = '';
};

const resendCode = async () => {
  if (resendTimer.value > 0) return;

  try {
    await sendSMSVerification(phoneNumber.value);
    successMessage.value = 'Code resent!';
    startResendTimer();
  } catch (err) {
    console.error('[VERIFY-PHONE] Resend error:', err);
  }
};

const startResendTimer = () => {
  resendTimer.value = 60;

  if (resendInterval) {
    clearInterval(resendInterval);
  }

  resendInterval = setInterval(() => {
    resendTimer.value--;
    if (resendTimer.value <= 0 && resendInterval) {
      clearInterval(resendInterval);
    }
  }, 1000);
};
</script>
