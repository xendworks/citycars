<template>
  <!-- Top Bar -->
  <div class="bg-gray-800 font-sora text-white py-1 px-4 text-right">
    <div class="container mx-auto">
      <span class="mr-4 font-inter">+44 1293 222710</span>
      <span class="font-inter">|</span>
      <span class="ml-4 font-inter">bookings@citycars.co.uk</span>
    </div>
  </div>

  <!-- Navigation -->
  <header class="bg-white shadow sticky top-0 w-full z-20 font-sora">
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <div class="flex items-center">
        <NuxtLink to="/">
          <div class="text-3xl font-bold font-sora">
            <span class="text-black">CITY</span>
            <span class="text-amber-400">CARS</span>
          </div>
        </NuxtLink>
      </div>
      <nav class="hidden md:flex space-x-8 font-sora">
        <a href="/airport-taxis" class="text-gray-700 hover:text-amber-500">Airport Taxis</a>
        <a href="/wheel-chair-taxis" class="text-gray-700 hover:text-amber-500">Wheel Chair Taxis</a>
        <NuxtLink to="/areas-we-cover" class="text-gray-700 hover:text-amber-500">Areas we cover</NuxtLink>
        <NuxtLink to="/contact-us" class="text-gray-700 hover:text-amber-500">Contact us</NuxtLink>
      </nav>
      <div class="flex items-center space-x-4">
        <NuxtLink to="/ai-booking"
          class="flex items-center gap-1.5 px-3 py-1.5 lg:px-4 lg:py-2 bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 text-amber-900 rounded-full font-bold text-xs lg:text-sm font-sora shadow-sm transition-all transform hover:scale-105 border border-amber-200">
          <span class="animate-pulse">✨</span>
          <span class="hidden sm:inline">Book with AI</span>
          <span class="sm:hidden">AI</span>
        </NuxtLink>
        <template v-if="isAuthenticated">
          <NuxtLink to="/profile"
            class="flex items-center space-x-2 text-gray-700 hover:text-amber-500 font-inter text-sm transition-colors">
            <img v-if="user?.photoURL" :src="user.photoURL" alt="Profile"
              class="w-8 h-8 rounded-full object-cover border-2 border-amber-400"
              @error="(e: Event) => (e.target as HTMLImageElement).style.display = 'none'" />
            <div v-else
              class="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-white text-xs font-bold">
              {{ initials }}
            </div>
            <span class="hidden md:inline">{{ userProfile?.displayName || 'Profile' }}</span>
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="text-gray-700 hover:text-amber-500 font-inter text-sm">
            Login
          </NuxtLink>
          <NuxtLink to="/signup"
            class="bg-amber-400 hover:bg-amber-500 text-white py-2 px-6 rounded-md font-semibold font-sora transition-colors">
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

// Debug: Watch for user changes (only on client)
if (process.client) {
  watch([user, userProfile], ([newUser, newProfile]) => {
  }, { immediate: true });
}

const initials = computed(() => {
  const name = userProfile.value?.displayName || 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
});
</script>

<style scoped lang="scss">
nav {
  a {
    @apply hover:text-amber-500 font-sora transition-colors;
  }

}


.font-sora {
  font-family: "Sora", sans-serif !important;
}

.font-inter {
  font-family: "Inter", sans-serif !important;
}
</style>
