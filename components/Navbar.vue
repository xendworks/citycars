<template>
     <!-- Top Bar -->
     <div class="bg-gray-800 font-lexend text-white py-1 px-4 text-right">
      <div class="container mx-auto">
        <span class="mr-4 font-inter">+44 1293 222710</span>
        <span class="font-inter">|</span>
        <span class="ml-4 font-inter">bookings@citycars.co.uk</span>
      </div>
    </div>

    <!-- Navigation -->
    <header class="bg-white shadow sticky top-0 w-full z-20 font-lexend">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center">
          <NuxtLink to="/">
          <div class="text-3xl font-bold font-lexend">
            <span class="text-black">CITY</span>
            <span class="text-amber-400">CARS</span>
          </div>
         </NuxtLink>
        </div>
        <nav class="hidden md:flex space-x-8 font-lexend">
          <a href="/airport-taxis" class="text-gray-700 hover:text-amber-500">Airport Taxis</a>
          <a href="/wheel-chair-taxis" class="text-gray-700 hover:text-amber-500">Wheel Chair Taxis</a>
          <a href="#" class="text-gray-700 hover:text-amber-500">Areas we cover</a>
          <a href="/contact-us" class="text-gray-700 hover:text-amber-500">Contact us</a>
        </nav>
        <div class="flex items-center space-x-4">
          <template v-if="isAuthenticated">
            <div class="flex items-center space-x-3">
              <NuxtLink 
                to="/profile"
                class="flex items-center space-x-2 text-gray-700 hover:text-amber-500 font-inter text-sm transition-colors"
              >
                <img
                  v-if="user?.photoURL"
                  :src="user.photoURL"
                  alt="Profile"
                  class="w-8 h-8 rounded-full object-cover border-2 border-amber-400"
                  @error="(e: Event) => (e.target as HTMLImageElement).style.display = 'none'"
                />
                <div
                  v-else
                  class="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-white text-xs font-bold"
                >
                  {{ initials }}
                </div>
                <span class="hidden md:inline">{{ userProfile?.displayName || 'Profile' }}</span>
              </NuxtLink>
              <button 
                @click="handleLogout"
                class="text-gray-700 hover:text-amber-500 font-inter text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </template>
          <template v-else>
            <NuxtLink 
              to="/login" 
              class="text-gray-700 hover:text-amber-500 font-inter text-sm"
            >
              Login
            </NuxtLink>
            <NuxtLink 
              to="/signup" 
              class="bg-amber-400 hover:bg-amber-500 text-white py-2 px-6 rounded-md font-semibold font-lexend transition-colors"
            >
              SIGNUP NOW
            </NuxtLink>
          </template>
        </div>
      </div>
    </header>
</template>

<script lang="ts" setup>
import { computed, watch, ref } from 'vue';

// Safe auth initialization for SSR
const auth = process.client ? useAuth() : null;
const isAuthenticated = auth?.isAuthenticated || ref(false);
const user = auth?.user || ref(null);
const userProfile = auth?.userProfile || ref(null);
const logout = auth?.logout || (() => Promise.resolve());

// Debug: Watch for user changes (only on client)
if (process.client) {
  watch([user, userProfile], ([newUser, newProfile]) => {
    console.log('[NAVBAR] Auth updated:', {
      userPhotoURL: newUser?.photoURL,
      profilePhotoURL: newProfile?.photoURL,
      displayName: newProfile?.displayName,
      email: newProfile?.email
    });
  }, { immediate: true });
}

const initials = computed(() => {
  const name = userProfile.value?.displayName || 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
});

const handleLogout = async () => {
  try {
    await logout();
    navigateTo('/');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
</script>

<style scoped lang="scss">
nav {
  a {
    @apply hover:text-amber-500 font-lexend transition-colors;
  }

}


.font-lexend {
  font-family: "Lexend", sans-serif !important;
}

.font-inter {
  font-family: "Inter", sans-serif !important;
}
</style>
