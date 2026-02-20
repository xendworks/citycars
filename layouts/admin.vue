<template>
  <div
    :class="['admin-layout-wrapper min-h-screen font-sora transition-colors duration-300', isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50']">
    <!-- Authenticated View -->
    <div v-if="isAuthenticated && !isLoading" class="min-h-screen">
      <!-- Top Navigation Bar -->
      <nav class="bg-slate-950 border-b border-white/5 fixed top-0 left-0 right-0 z-[100] shadow backdrop-blur-md">
        <div class="px-8 py-4 flex items-center justify-between w-full">
          <div class="flex items-center space-x-6 flex-1">
            <h1 class="text-xl font-bold font-sora tracking-tight shrink-0">
              <span class="text-white">CITY</span><span class="text-amber-400">CARS</span>
              <span
                class="ml-3 px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-md border border-slate-700">Admin</span>
            </h1>

            <!-- Global Search -->
            <AdminGlobalSearch />
          </div>

          <div class="flex items-center space-x-5">
            <!-- Dark Mode Toggle -->
            <button type="button" @click="toggleDarkMode"
              class="p-2 text-slate-400 hover:text-white transition-all hover:bg-white/5 rounded-xl group"
              title="Toggle Dark Mode">
              <SunIcon v-if="isDarkMode" class="size-5" />
              <MoonIcon v-else class="size-5" />
            </button>

            <!-- Notifications -->
            <button type="button" @click="notifStore.isDrawerOpen = true"
              class="relative p-2 text-slate-400 hover:text-white transition-colors group">
              <BellIcon class="size-5" />
              <span v-if="notifStore.unreadCount > 0"
                class="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-slate-950 px-1 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                {{ notifStore.unreadCount > 9 ? '9+' : notifStore.unreadCount }}
              </span>
            </button>

            <!-- Profile dropdown -->
            <Menu as="div" class="relative">
              <MenuButton class="flex items-center space-x-3 p-1 rounded-xl hover:bg-white/5 transition-all group">
                <div
                  class="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                  {{ adminUser?.name?.slice(0, 2).toUpperCase() || 'AD' }}
                </div>
                <div class="hidden md:block text-left">
                  <p class="text-xs font-bold text-white leading-none">{{ adminUser?.name }}</p>
                  <p class="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">{{ adminUser?.role }}
                  </p>
                </div>
                <ChevronDownIcon class="size-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
              </MenuButton>

              <transition enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform scale-100"
                leave-active-class="transition ease-in duration-75" leave-from-class="transform scale-100"
                leave-to-class="transform opacity-0 scale-95">
                <MenuItems
                  class="absolute right-0 z-50 mt-3 w-56 origin-top-right rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none">
                  <div class="px-3 py-3 border-b border-slate-50 dark:border-white/5 mb-1">
                    <p class="text-xs font-bold text-slate-900 dark:text-white leading-none">{{ adminUser?.name }}</p>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 truncate">{{ adminUser?.email }}</p>
                  </div>

                  <MenuItem v-slot="{ active }">
                  <NuxtLink to="/admin/profile"
                    :class="[active ? 'bg-slate-50 dark:bg-white/5 text-amber-600' : 'text-slate-700 dark:text-slate-300', 'flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-colors']">
                    <el-icon>
                      <User />
                    </el-icon>
                    <span>Your Profile</span>
                  </NuxtLink>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                  <NuxtLink to="/admin/settings"
                    :class="[active ? 'bg-slate-50 dark:bg-white/5 text-amber-600' : 'text-slate-700 dark:text-slate-300', 'flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-colors']">
                    <el-icon>
                      <Setting />
                    </el-icon>
                    <span>Settings</span>
                  </NuxtLink>
                  </MenuItem>

                  <div class="h-px bg-slate-50 dark:bg-white/5 my-1"></div>

                  <MenuItem v-slot="{ active }">
                  <button @click="handleLogout"
                    :class="[active ? 'bg-red-50 dark:bg-red-500/10 text-red-600' : 'text-slate-700 dark:text-slate-300', 'w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-colors']">
                    <el-icon>
                      <SwitchButton />
                    </el-icon>
                    <span>Sign out</span>
                  </button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </nav>

      <div class="flex pt-[73px]">
        <aside
          class="w-56 bg-white dark:bg-slate-900 fixed min-h-[calc(100vh-60px)] flex-shrink-0 border-r border-slate-200/60 dark:border-white/5 sticky top-[73px] transition-colors duration-300">
          <AdminSidebarNav />
        </aside>

        <!-- Main Content -->
        <main class="flex-1 p-4 overflow-x-hidden min-h-[calc(100vh-73px)]">
          <slot />
        </main>
      </div>
    </div>

    <!-- Loading State -->
    <AdminLoader v-if="isLoading" full-screen text="Initializing Dashboard..." />

    <!-- Auth Fallback Overlay -->
    <div v-if="!isLoading && !isAuthenticated" class="min-h-screen bg-slate-900 fixed inset-0 z-[100]"></div>

    <!-- Realtime Notifications Slideout -->
    <AdminNotificationDrawer />
  </div>
</template>

<script setup lang="ts">
import { useAdminAuth } from '~/composables/useAdminAuth';
import { useAdminDarkMode } from '~/composables/useAdminDarkMode';
import { useAdminNotificationsStore } from '~/stores/adminNotifications';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { BellIcon, ChevronDownIcon, SunIcon, MoonIcon } from '@heroicons/vue/20/solid';
import { User, Setting, SwitchButton } from '@element-plus/icons-vue';
import { onMounted, onUnmounted } from 'vue';

const { adminUser, isAuthenticated, isLoading, logoutAdmin } = useAdminAuth();
const { isDarkMode, toggleDarkMode } = useAdminDarkMode();
const notifStore = useAdminNotificationsStore();
const router = useRouter();

const handleLogout = async () => {
  try {
    await logoutAdmin();
    router.push('/admin/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Lifecycle for Realtime Notifications
onMounted(() => {
  if (process.client) {
    notifStore.initListener();
  }
});

onUnmounted(() => {
  notifStore.stopListener();
  if (process.client) {
    document.documentElement.classList.remove('dark');
  }
});
</script>

<style scoped>
/* Ensure fixed sidebar works with wide screens */
aside nav {
  max-width: 16rem;
}

/* Dark Mode Global Overrides */
.dark {
  --el-bg-color: #0f172a;
  --el-bg-color-overlay: #1e293b;
  --el-text-color-primary: #f1f5f9;
  --el-text-color-regular: #cbd5e1;
  --el-border-color-light: rgba(255, 255, 255, 0.1);
  --el-fill-color-blank: transparent;
}

.dark :deep(.el-card) {
  background-color: #1e293b;
  border-color: rgba(255, 255, 255, 0.05);
}

.dark :deep(.el-button:not(.el-button--primary):not(.el-button--danger)) {
  background-color: #1e293b;
  border-color: rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
}

.dark :deep(.el-table) {
  --el-table-border-color: rgba(255, 255, 255, 0.05);
  --el-table-header-bg-color: #1e293b;
}

.dark :deep(.el-input__wrapper) {
  background-color: #0f172a !important;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1) inset !important;
}

.dark :deep(.el-input__inner) {
  color: #f1f5f9 !important;
}
</style>
