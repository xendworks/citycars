<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
      <div v-if="!isComplete">
        <div class="text-center mb-8">
          <div class="inline-block bg-amber-100 rounded-full p-4 mb-4">
            <svg class="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Setup Admin Account</h1>
          <p class="text-gray-600">Create your first admin user</p>
        </div>

        <form @submit.prevent="createAdmin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="xendworks@gmail.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              v-model="password"
              type="password"
              required
              minlength="8"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter a strong password"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
            <input 
              v-model="displayName"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Your Name"
            />
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-800 text-sm">{{ error }}</p>
          </div>

          <button 
            type="submit"
            :disabled="isLoading"
            class="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">Create Admin Account</span>
            <span v-else>Creating...</span>
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          ⚠️ This page should be disabled after first use
        </p>
      </div>

      <!-- Success State -->
      <div v-else class="text-center">
        <div class="inline-block bg-green-100 rounded-full p-4 mb-4">
          <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Admin Account Created! 🎉</h2>
        <div class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <p class="text-sm text-gray-600 mb-2">Email:</p>
          <p class="font-mono font-bold text-gray-900">{{ email }}</p>
        </div>
        <NuxtLink 
          to="/admin/login"
          class="inline-block bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
        >
          Go to Admin Login →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

definePageMeta({
  layout: false // No layout for setup page
});

const email = ref('xendworks@gmail.com');
const password = ref('Minicabee@123');
const displayName = ref('Main Admin');
const isLoading = ref(false);
const isComplete = ref(false);
const error = ref('');

const createAdmin = async () => {
  isLoading.value = true;
  error.value = '';

  try {
    const { $firebase } = useNuxtApp();
    const auth = getAuth($firebase as any);
    const db = getFirestore($firebase as any);

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    const user = userCredential.user;

    // Update display name
    await updateProfile(user, {
      displayName: displayName.value
    });

    // Create admin profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email.value,
      displayName: displayName.value,
      role: 'admin', // 👈 This makes them admin!
      phoneNumber: null,
      photoURL: null,
      preferredPickupLocations: [],
      preferredDropoffLocations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    console.log('✅ Admin user created:', user.uid);
    isComplete.value = true;
  } catch (err: any) {
    console.error('❌ Error creating admin:', err);
    
    if (err.code === 'auth/email-already-in-use') {
      error.value = 'This email is already registered. Try logging in or use a different email.';
    } else if (err.code === 'auth/weak-password') {
      error.value = 'Password is too weak. Use at least 8 characters.';
    } else if (err.code === 'auth/invalid-email') {
      error.value = 'Invalid email address.';
    } else {
      error.value = err.message || 'Failed to create admin account';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

