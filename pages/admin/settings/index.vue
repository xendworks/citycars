<template>
  <div class="settings-wrapper min-h-screen bg-slate-50/50 -m-2">
    <!-- Breadcrumb Header -->
    <div class="bg-white border-b border-slate-200 px-8 py-4">
      <div class="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
        <NuxtLink to="/admin" class="hover:text-amber-600 transition-colors">Home</NuxtLink>
        <span>/</span>
        <span class="text-slate-900">Settings</span>
        <span>/</span>
        <span class="text-amber-600">{{ activeModule.name }}</span>
        <span v-if="activeTabId">/</span>
        <span v-if="activeTabId" class="text-slate-900">{{ currentTabName }}</span>
      </div>
    </div>

    <div class="flex h-[calc(100vh-130px)]">
      <!-- Tier 1: Module Sidebar -->
      <aside class="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col">
        <div class="p-6">
          <h2 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Modules</h2>
          <nav class="space-y-1.5">
            <button v-for="mod in modules" :key="mod.id" @click="selectModule(mod)" :class="[
              'w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all border font-sora text-left',
              activeModule.id === mod.id
                ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10'
                : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            ]">
              <el-icon size="20">
                <component :is="mod.icon" />
              </el-icon>
              <span class="text-sm font-bold tracking-tight">{{ mod.name }}</span>
            </button>
          </nav>
        </div>

        <div class="mt-auto p-6 border-t border-slate-50">
          <div class="bg-slate-50 rounded-2xl p-4">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">System Health</p>
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span class="text-[11px] font-bold text-slate-700">All Nodes Online</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 flex flex-col overflow-hidden">
        <!-- Tier 2: Feature Tabs -->
        <div class="bg-white border-b border-slate-200 px-8 flex-shrink-0 flex items-center justify-between">
          <nav class="flex space-x-8 overflow-x-auto no-scrollbar">
            <button v-for="tab in activeModule.tabs" :key="tab.id" @click="activeTabId = tab.id" :class="[
              'py-5 text-sm font-bold font-sora whitespace-nowrap border-b-2 transition-all',
              activeTabId === tab.id
                ? 'border-amber-500 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            ]">
              {{ tab.name }}
            </button>
          </nav>

          <!-- Module Save Action -->
          <div v-if="activeModule.id !== 'personnel' && activeTabId !== 'users'"
            class="flex items-center space-x-3 py-3">
            <button @click="saveSettings" :disabled="isSaving"
              class="flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow active:scale-95 disabled:opacity-50">
              <el-icon v-if="!isSaving" class="text-amber-500">
                <CircleCheck />
              </el-icon>
              <el-icon v-else class="animate-spin text-amber-500">
                <Loading />
              </el-icon>
              <span>{{ isSaving ? 'Syncing...' : 'Sync Changes' }}</span>
            </button>
          </div>
        </div>

        <!-- Scrollable Content Container -->
        <div class="flex-1 overflow-y-auto p-8 space-y-8 pb-12 relative">

          <AdminLoader v-if="isLoadingSettings" size="sm" text="Syncing Module Data..."
            class="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm" />

          <!-- Operations Module Content -->
          <div v-if="activeModule.id === 'operations'" class="max-w-4xl space-y-8">
            <!-- Dispatch Engine Tab -->
            <div v-if="activeTabId === 'engine'" class="space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <h3 class="text-sm font-bold text-slate-900 font-sora uppercase tracking-widest">Radius & Search</h3>
                  <div class="space-y-4">
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auto-Assignment
                      Radius (KM)</label>
                    <el-input-number v-model="settings.dispatch.searchRadius" :min="1" :max="50" class="!w-full" />
                  </div>
                </div>

                <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <h3 class="text-sm font-bold text-slate-900 font-sora uppercase tracking-widest">Timing & TTL</h3>
                  <div class="space-y-4">
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Driver Timeout
                      (Sec)</label>
                    <el-input-number v-model="settings.dispatch.timeoutSeconds" :min="10" :max="300" class="!w-full" />
                  </div>
                </div>
              </div>

              <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-bold text-slate-900 font-sora uppercase tracking-widest">Intelligent
                      Auto-Dispatch</h3>
                    <p class="text-xs text-slate-500 mt-1">Allow system to match drivers without operator manual
                      oversight.</p>
                  </div>
                  <el-switch v-model="settings.dispatch.autoDispatch" active-color="#f59e0b" />
                </div>
              </div>
            </div>

            <!-- Booking Rules Tab -->
            <div v-if="activeTabId === 'rules'" class="space-y-8">
              <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
                <h3
                  class="text-sm font-bold text-slate-900 font-sora uppercase tracking-widest border-b border-slate-50 pb-4">
                  Timeline Buffers</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-4">
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Min. Lead Time
                      (ASAP)</label>
                    <div class="flex items-center space-x-3">
                      <el-input-number v-model="settings.booking.minLeadTime" :min="5" :max="120" class="flex-1" />
                      <span class="text-[10px] font-bold text-slate-400 w-10">MIN</span>
                    </div>
                  </div>
                  <div class="space-y-4">
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pre-booking
                      Window</label>
                    <div class="flex items-center space-x-3">
                      <el-input-number v-model="settings.booking.bufferTime" :min="15" :max="1440" class="flex-1" />
                      <span class="text-[10px] font-bold text-slate-400 w-10">MIN</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Personnel Module Content -->
          <div v-if="activeModule.id === 'personnel'" class="space-y-8">
            <!-- Authority Matrix Tab -->
            <div v-if="activeTabId === 'roles'" class="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div class="lg:col-span-1 space-y-2">
                <button v-for="role in roles" :key="role.id" @click="selectRole(role)" :class="[
                  'w-full p-4 rounded-2xl text-left transition-all border font-sora',
                  selectedRole?.id === role.id ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 hover:border-slate-300 text-slate-600'
                ]">
                  <p class="text-sm font-bold capitalize">{{ role.id.replace('_', ' ') }}</p>
                  <p class="text-[10px] opacity-60 mt-1 uppercase tracking-tighter">{{Object.values(role.permissions ||
                    {}).filter(v => v).length}} Permissions Active</p>
                </button>
                <button @click="prepareNewRole"
                  class="w-full p-4 rounded-2xl border border-dashed border-slate-300 text-slate-400 hover:text-amber-600 hover:border-amber-300 transition-all font-bold text-xs uppercase tracking-widest">
                  + Add Role Node
                </button>
              </div>

              <div class="lg:col-span-3 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div v-if="selectedRole" class="space-y-8">
                  <div class="flex items-center justify-between border-b border-slate-50 pb-6">
                    <div>
                      <h3 class="text-lg font-bold text-slate-900 font-sora capitalize">{{ selectedRole.id.replace('_',
                        ' ') }} Permission Set</h3>
                      <p class="text-xs text-slate-500 mt-0.5 capitalize">Managing system-wide authority for {{
                        selectedRole.id }} designation.</p>
                    </div>
                    <el-button type="danger" link @click="handleDeleteRole(selectedRole.id)">Decommission
                      Role</el-button>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="(val, key) in selectedRole.permissions" :key="key"
                      class="group flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100/50 rounded-2xl transition-colors">
                      <span class="text-xs font-bold text-slate-700 capitalize tracking-tight">{{
                        String(key).replace(/([A-Z])/g, ' $1').replace('can ', '') }}</span>
                      <el-switch v-model="selectedRole.permissions[key]" active-color="#f59e0b" size="small" />
                    </div>
                  </div>

                  <div class="pt-6">
                    <el-button @click="saveRolePermissions" :loading="isSavingRole" type="primary"
                      class="!w-full !py-6 !rounded-2xl !bg-slate-900 !border-slate-900 !font-bold !uppercase !tracking-[0.1em]">
                      Sync Authority Matrix
                    </el-button>
                  </div>
                </div>
                <div v-else
                  class="h-full flex flex-col items-center justify-center py-20 bg-slate-50/30 rounded-3xl border border-dashed border-slate-100">
                  <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <el-icon size="24" class="text-slate-300">
                      <Key />
                    </el-icon>
                  </div>
                  <p class="font-bold text-sm text-slate-400 tracking-widest uppercase">Select Designation Matrix</p>
                </div>
              </div>
            </div>

            <!-- User Link Tab -->
            <div v-if="activeTabId === 'users'"
              class="h-full flex flex-col items-center justify-center py-20 text-center">
              <div
                class="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-6 border border-amber-100">
                <el-icon size="32">
                  <UserFilled />
                </el-icon>
              </div>
              <h3 class="text-xl font-bold text-slate-900 font-sora">Executive Staff Ledger</h3>
              <p class="max-w-xs text-slate-500 text-sm mt-2 mx-auto">Manage administrative access, onboard new staff,
                and monitor session activity.</p>
              <NuxtLink to="/admin/users"
                class="mt-8 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all inline-block">
                Open Staff Console
              </NuxtLink>
            </div>
          </div>

          <!-- Comms Module Content -->
          <div v-if="activeModule.id === 'comms'" class="max-w-2xl space-y-4">
            <div v-for="(val, key) in settings.notifications" :key="key"
              class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-amber-200 transition-all">
              <div class="flex items-center space-x-4">
                <div
                  class="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-500 transition-colors">
                  <el-icon>
                    <Bell />
                  </el-icon>
                </div>
                <div>
                  <p class="text font-bold text-slate-900 font-sora capitalize">{{ key.replace(/([A-Z])/g, ' $1') }}
                  </p>
                  <p class="text-[12px] text-slate-400 font-medium">Automatic dispatch notifications and SMS triggers.
                  </p>
                </div>
              </div>
              <el-switch v-model="settings.notifications[key]" active-color="#f59e0b" />
            </div>
          </div>

          <!-- Account Module Content -->
          <div v-if="activeModule.id === 'account'" class="max-w-2xl space-y-8">
            <div class="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm text-center space-y-6">
              <div
                class="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-600 mx-auto border border-amber-100">
                <el-icon size="32">
                  <UserFilled />
                </el-icon>
              </div>
              <div class="space-y-2">
                <h3 class="text-xl font-bold text-slate-900 font-sora">Manage Your Profile</h3>
                <p class="text-xs text-slate-500 max-w-xs mx-auto">Update your personal information, security settings,
                  and account preferences.</p>
              </div>
              <NuxtLink to="/admin/profile"
                class="inline-block px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95">
                Go to Profile Ledger
              </NuxtLink>
            </div>
          </div>

          <!-- Maintenance Tab -->
          <div v-if="activeTabId === 'maintenance'" class="space-y-8 max-w-2xl">
            <div class="bg-red-50 p-8 rounded-3xl border border-red-100 space-y-6">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
                  <el-icon size="24">
                    <Lock />
                  </el-icon>
                </div>
                <div>
                  <h3 class="text-sm font-black text-red-900 font-sora uppercase tracking-widest">Master Maintenance
                    Override</h3>
                  <p class="text-xs text-red-700/80 font-medium mt-1">Locks all passenger applications and driver nodes
                    immediately.</p>
                </div>
              </div>
              <div class="flex items-center justify-between bg-white/50 p-6 rounded-2xl border border-red-200">
                <span class="text-xs font-bold text-red-900 uppercase tracking-widest">Maintenance Mode Status</span>
                <el-switch v-model="settings.maintenanceMode" active-color="#ef4444" />
              </div>
            </div>

            <!-- Database Cleanup -->
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                  <el-icon size="24">
                    <Delete />
                  </el-icon>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-slate-900 font-sora uppercase tracking-widest">Database Purge</h3>
                  <p class="text-xs text-slate-500 font-medium mt-1">Permanently remove all bookings, drivers, and
                    offers.</p>
                </div>
              </div>

              <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Preserve Record</p>
                    <p class="text-xs font-bold text-slate-900">CTY55370159 will be skipped.</p>
                  </div>
                  <button @click="confirmClean" :disabled="isCleaning"
                    class="px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95 disabled:opacity-50 flex items-center space-x-2">
                    <el-icon v-if="isCleaning" class="animate-spin text-white">
                      <Loading />
                    </el-icon>
                    <el-icon v-else>
                      <Warning />
                    </el-icon>
                    <span>{{ isCleaning ? 'Purging...' : 'Execute Purge' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>


      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  Timer, List, Message, Lock, Key,
  CircleCheck, Loading, Bell, Van, Money, Tools, UserFilled,
  Delete, Warning
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
  ssr: false
});

const { getSystemSettings, updateSystemSettings, getAllRoles, upsertRole, deleteRole } = useAdminFirestore();
const { logoutAdmin } = useAdminAuth();
const router = useRouter();

// Dual-Tier Navigation Structure
const modules = [
  {
    id: 'operations', name: 'Operations', icon: Timer, tabs: [
      { id: 'engine', name: 'Dispatch Engine' },
      { id: 'rules', name: 'Booking Rules' }
    ]
  },
  {
    id: 'personnel', name: 'Management', icon: Key, tabs: [
      { id: 'roles', name: 'Authority Matrix' },
      { id: 'users', name: 'Admin Ledger' }
    ]
  },
  {
    id: 'comms', name: 'Communications', icon: Message, tabs: [
      { id: 'alerts', name: 'System Alerts' }
    ]
  },
  {
    id: 'system', name: 'System Core', icon: Tools, tabs: [
      { id: 'maintenance', name: 'Maintenance' }
    ]
  },
  {
    id: 'fleet', name: 'Fleet Control', icon: Van, tabs: [
      { id: 'vehicles', name: 'Vehicle Classes' }
    ]
  },
  {
    id: 'account', name: 'Account Settings', icon: UserFilled, tabs: [
      { id: 'profile', name: 'My Profile' }
    ]
  },
  {
    id: 'finance', name: 'Financial Hub', icon: Money, tabs: [
      { id: 'payouts', name: 'Payout Cycles' }
    ]
  }
];

const activeModule = ref(modules[0]);
const activeTabId = ref(modules[0].tabs[0].id);
const isLoadingSettings = ref(false);

const currentTabName = computed(() => {
  return activeModule.value.tabs.find(t => t.id === activeTabId.value)?.name || '';
});

const selectModule = (mod: any) => {
  activeModule.value = mod;
  activeTabId.value = mod.tabs[0].id;
};

// Global State
const isSaving = ref(false);
const settings = ref({
  dispatch: { searchRadius: 15, timeoutSeconds: 45, autoDispatch: true, minAcceptanceRate: 70, mode: 'radius' },
  booking: { minLeadTime: 15, bufferTime: 30, allowShared: false, allowCash: true },
  notifications: { newBooking: true, bookingCancelled: true, paymentReceived: true, driverOffline: false, systemUpdate: true },
  maintenanceMode: false
});

// Authority State
const roles = ref<any[]>([]);
const selectedRole = ref<any>(null);
const isSavingRole = ref(false);
const isCleaning = ref(false);

const confirmClean = () => {
  ElMessageBox.confirm(
    'This will irreversibly delete all bookings, drivers, offers and quotes from the database. CTY55370159 will be preserved. Proceed with extreme caution.',
    'DANGER: DATABASE PURGE',
    {
      confirmButtonText: 'PURGE DATA',
      cancelButtonText: 'ABORT',
      type: 'error',
      confirmButtonClass: 'el-button--danger'
    }
  ).then(() => {
    handleCleanup();
  });
};

const handleCleanup = async () => {
  isCleaning.value = true;
  try {
    const { cleanupDatabase } = useAdminFirestore();
    const result = await cleanupDatabase('CTY55370159');
    ElMessage.success(`🎉 Purge complete! Deleted ${result.deleted} records.`);
    // Refresh stats
    const existing = await getSystemSettings();
    if (existing) Object.assign(settings.value, existing);
  } catch (err) {
    ElMessage.error('Purge failed. Check console for details.');
  } finally {
    isCleaning.value = false;
  }
};

const loadRoles = async () => {
  const allRoles = await getAllRoles();
  if (allRoles.length === 0) {
    const defaults = ['admin', 'manager', 'operator'];
    const defaultPermissions = { canViewBookings: true, canEditBookings: false, canViewDrivers: true, canViewUsers: false, canEditSettings: false };
    roles.value = defaults.map(d => ({ id: d, permissions: { ...defaultPermissions, canEditBookings: d === 'admin' } }));
  } else {
    roles.value = allRoles;
  }
};

const selectRole = (role: any) => {
  // Clone to protect against unsaved reactivity
  selectedRole.value = JSON.parse(JSON.stringify(role));
};

const prepareNewRole = () => {
  ElMessageBox.prompt('Enter unique role identifier', 'Authority Node Setup', {
    inputPattern: /^[a-z_]+$/,
    confirmButtonText: 'Initialize'
  }).then(({ value }) => {
    const newRole = { id: value, permissions: { canViewBookings: true, canEditBookings: false, canViewDrivers: true, canViewUsers: false, canEditSettings: false } };
    roles.value.push(newRole);
    selectRole(newRole);
  });
};

const saveRolePermissions = async () => {
  if (!selectedRole.value) return;
  isSavingRole.value = true;
  try {
    await upsertRole(selectedRole.value.id, { permissions: selectedRole.value.permissions });
    ElMessage.success(`Matrix for ${selectedRole.value.id} updated!`);
    await loadRoles();
  } catch (err) {
    ElMessage.error('Matrix sync failed.');
  } finally { isSavingRole.value = false; }
};

const handleDeleteRole = (id: string) => {
  ElMessageBox.confirm(`Decommission authority for ${id}?`, 'Confirm Deletion', { type: 'warning' }).then(async () => {
    await deleteRole(id);
    ElMessage.success('Role purged.');
    selectedRole.value = null;
    await loadRoles();
  });
};

const saveSettings = async () => {
  isSaving.value = true;
  try {
    await updateSystemSettings(settings.value);
    ElMessage.success('Core configuration synchronized.');
  } catch (err) {
    ElMessage.error('System sync failed.');
  } finally { isSaving.value = false; }
};

onMounted(async () => {
  isLoadingSettings.value = true;
  try {
    await loadRoles();
    const existing = await getSystemSettings();
    if (existing) Object.assign(settings.value, existing);
  } finally {
    isLoadingSettings.value = false;
  }
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

:deep(.el-input-number.is-controls-right .el-input-number__increase) {
  border-radius: 0 12px 0 0;
}

:deep(.el-input-number.is-controls-right .el-input-number__decrease) {
  border-radius: 0 0 12px 0;
}

:deep(.el-input__wrapper) {
  border-radius: 12px;
}
</style>
