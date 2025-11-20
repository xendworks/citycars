<template>
  <div class="min-h-screen bg-gray-100 overflow-x-hidden">
    <!-- Top Navigation Bar -->
    <nav class="bg-gray-900 text-white shadow-lg fixed top-0 left-0 right-0 z-10">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-bold">
              <span class="text-white">CITY</span><span class="text-amber-400">CARS</span>
              <span class="ml-3 text-sm font-normal text-gray-400">Admin Portal</span>
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="handleLogout"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="flex overflow-x-hidden">
      <!-- Sidebar -->
      <aside class="w-64 bg-white min-h-screen shadow-lg flex-shrink-0">
        <nav class="p-4 mt-16 fixed space-y-2">
          <NuxtLink
            to="/"
            :class="[
              'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
              $route.path === '/' || $route.path === ''
                ? 'bg-amber-50 text-amber-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Dashboard</span>
          </NuxtLink>

          <NuxtLink
            to="/bookings"
            :class="[
              'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
              $route.path.startsWith('/bookings')
                ? 'bg-amber-50 text-amber-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Bookings</span>
          </NuxtLink>

          <NuxtLink
            to="/drivers"
            :class="[
              'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
              $route.path.startsWith('/drivers')
                ? 'bg-amber-50 text-amber-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Drivers</span>
          </NuxtLink>

          <NuxtLink
            to="/offers"
            :class="[
              'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
              $route.path.startsWith('/offers')
                ? 'bg-amber-50 text-amber-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>Offers & Promotions</span>
          </NuxtLink>

          <NuxtLink
            to="/pricing"
            :class="[
              'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
              $route.path.startsWith('/pricing')
                ? 'bg-amber-50 text-amber-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Pricing Rules</span>
          </NuxtLink>

          <NuxtLink
            to="/users"
            :class="[
              'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
              $route.path.startsWith('/users')
                ? 'bg-amber-50 text-amber-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Users</span>
          </NuxtLink>

          <NuxtLink
            to="/settings"
            :class="[
              'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
              $route.path.startsWith('/settings')
                ? 'bg-amber-50 text-amber-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </NuxtLink>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-4 mt-20 overflow-x-hidden max-w-full">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const handleLogout = () => {
  // TODO: Implement logout logic
  console.log('Logging out...');
  router.push('/admin/login');
};
</script>

