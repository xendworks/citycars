<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo & Title -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-2">
          <span class="text-gray-900">CITY</span><span class="text-amber-500">CARS</span>
        </h1>
        <p class="text-gray-600 text-lg font-semibold">Admin Portal</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin">
          <div class="space-y-5">
            <!-- Username/Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email or Username
              </label>
              <input id="email" v-model="form.email" type="text" required autocomplete="username"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="admin@citycars.com" />
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div class="relative">
                <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" required
                  autocomplete="current-password"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  placeholder="••••••••" />
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Remember Me -->
            <div class="flex items-center justify-between">
              <label class="flex items-center">
                <input v-model="form.remember" type="checkbox"
                  class="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500" />
                <span class="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
            </div>

            <!-- Submit Button -->
            <button type="submit" :disabled="isLoading"
              class="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="isLoading">Signing in...</span>
              <span v-else>Sign In</span>
            </button>
          </div>
        </form>

        <!-- Or Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <!-- Google Sign-In Button (Temporary until Email/Password is enabled) -->
        <button @click="handleGoogleSignIn" type="button" :disabled="isLoading"
          class="w-full flex items-center justify-center space-x-3 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span class="text-gray-700 font-medium">Sign in with Google</span>
        </button>
      </div>

      <!-- Footer -->
      <p class="text-center text-sm text-gray-500 mt-6">
        &copy; 2025 CityCars. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  layout: false
});

import { useRouter } from 'vue-router';
const router = useRouter();
const { loginAdmin } = useAdminAuth();

const form = ref({
  email: '',
  password: '',
  remember: false
});

const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    await loginAdmin(form.value.email, form.value.password, form.value.remember);

    // Redirect to dashboard
    router.push('/admin');
  } catch (error: any) {
    errorMessage.value = error.message || 'Invalid email or password';
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleSignIn = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const { signInWithGoogle } = useAuth();
    const result = await signInWithGoogle();


    // Check if user has admin role
    const { getUserProfile } = useFirestore();
    const profile = await getUserProfile(result.user.uid);

    const userRole = profile?.role?.trim().toLowerCase();

    if (!userRole || !['admin', 'super_admin', 'manager', 'operator'].includes(userRole)) {
      throw new Error(`You do not have admin access (Role: ${userRole || 'none'}). Please contact an administrator.`);
    }

    // Redirect to dashboard
    router.push('/admin');
  } catch (error: any) {
    console.error('[ADMIN LOGIN] Google sign-in error:', error);
    errorMessage.value = error.message || 'Google sign-in failed';
  } finally {
    isLoading.value = false;
  }
};
</script>
