<template>
  <div>
    <div class="flex items-center justify-between px-4 pt-4 mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Drivers Management</h1>
      <NuxtLink to="/admin/drivers/add"
        class="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors inline-flex items-center space-x-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Add New Driver</span>
      </NuxtLink>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div
        class="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-white/5 p-6 shadow-sm hover:shadow-md transition-all group">
        <p class="text-sm font-medium text-gray-600 dark:text-slate-400">Total Drivers</p>
        <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ stats.total }}</p>
      </div>
      <div
        class="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-white/5 p-6 shadow-sm hover:shadow-md transition-all group">
        <p class="text-sm font-medium text-gray-600 dark:text-slate-400">Online Now</p>
        <p class="text-3xl font-bold text-green-600 mt-2">{{ stats.online }}</p>
      </div>
      <div
        class="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-white/5 p-6 shadow-sm hover:shadow-md transition-all group">
        <p class="text-sm font-medium text-gray-600 dark:text-slate-400">On Trip</p>
        <p class="text-3xl font-bold text-blue-600 mt-2">{{ stats.onTrip }}</p>
      </div>
      <div
        class="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-white/5 p-6 shadow-sm hover:shadow-md transition-all group">
        <p class="text-sm font-medium text-gray-600 dark:text-slate-400">Offline</p>
        <p class="text-3xl font-bold text-gray-600 dark:text-slate-500 mt-2">{{ stats.offline }}</p>
      </div>
    </div>

    <!-- Drivers Table -->
    <div
      class="bg-white dark:bg-slate-900 rounded-lg border border-gray-100 dark:border-white/5 overflow-hidden transition-colors">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-white/5">
          <thead class="bg-gray-50 dark:bg-slate-800/50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Driver</th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Phone</th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Vehicle</th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                License</th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Status</th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Rating</th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Trips</th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-white/5">
            <tr v-if="isLoading">
              <td colspan="8" class="px-6 py-8">
                <AdminLoader size="sm" text="Syncing Driver Pool..." />
              </td>
            </tr>
            <tr v-else-if="drivers.length === 0">
              <td colspan="8" class="px-6 py-20 text-center">
                <div class="max-w-md mx-auto space-y-6">
                  <div
                    class="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-slate-300 dark:text-slate-600 mx-auto border border-slate-100/50 dark:border-white/5">
                    <el-icon size="32">
                      <Van />
                    </el-icon>
                  </div>
                  <div class="space-y-2">
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white font-sora transition-colors">No Drivers
                      Registered</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">Your fleet is
                      currently dormant.
                      Add your first driver to begin orchestrating operations across the network.</p>
                  </div>
                  <NuxtLink to="/admin/drivers/add"
                    class="inline-block px-10 py-4 bg-slate-900 dark:bg-amber-500 text-white rounded-lg font-bold text-[10px] uppercase shadow-sm hover:bg-black dark:hover:bg-amber-600 transition-all active:scale-95">
                    Onboard New Driver
                  </NuxtLink>
                </div>
              </td>
            </tr>
            <tr v-else v-for="driver in drivers" :key="driver.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 font-bold">
                    {{ driver.name.charAt(0) }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white transition-colors">{{ driver.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-slate-400 transition-colors">{{ driver.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-slate-400 transition-colors">
                {{ driver.phone }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white transition-colors">{{ driver.vehicleModel }}</div>
                <div class="text-sm text-gray-500 dark:text-slate-400 transition-colors">{{ driver.vehiclePlate }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-slate-400 transition-colors">
                {{ driver.licenseNumber }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  driver.status === 'online' ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400' :
                    driver.status === 'on-trip' ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400' :
                      'bg-gray-100 text-gray-800 dark:bg-white/5 dark:text-slate-400'
                ]">
                  {{ driver.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span class="ml-1 text-sm font-medium text-gray-900 dark:text-white transition-colors">{{
                    driver.rating }}</span>
                  <span class="ml-1 text-sm text-gray-500 dark:text-slate-400">({{ driver.totalTrips }})</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ driver.totalTrips }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <el-dropdown trigger="click" @command="(cmd: string) => handleAction(cmd, driver)">
                  <button
                    class="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
                    :disabled="isWorking[driver.id]">
                    <el-icon v-if="isWorking[driver.id]" class="animate-spin text-amber-500">
                      <Loading />
                    </el-icon>
                    <el-icon v-else class="text-gray-500 dark:text-slate-400">
                      <MoreFilled />
                    </el-icon>
                  </button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="view">
                        <el-icon>
                          <View />
                        </el-icon>
                        <span>View Profile</span>
                      </el-dropdown-item>
                      <el-dropdown-item command="edit">
                        <el-icon>
                          <Edit />
                        </el-icon>
                        <span>Edit Details</span>
                      </el-dropdown-item>
                      <el-dropdown-item command="message" divided>
                        <el-icon>
                          <ChatLineRound />
                        </el-icon>
                        <span>Message Driver</span>
                      </el-dropdown-item>
                      <el-dropdown-item :command="driver.status === 'inactive' ? 'activate' : 'inactivate'">
                        <el-icon>
                          <component :is="driver.status === 'inactive' ? 'CircleCheck' : 'CircleClose'" />
                        </el-icon>
                        <span>{{ driver.status === 'inactive' ? 'Make Active' : 'Make Inactive' }}</span>
                      </el-dropdown-item>
                      <el-dropdown-item command="delete" class="!text-red-500">
                        <el-icon>
                          <Delete />
                        </el-icon>
                        <span>Delete Driver</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>


  </div>

  <!-- Driver View Drawer (Premium Redesign) -->
  <el-drawer v-model="showViewDrawer" size="650px" direction="rtl" :with-header="false" class="premium-drawer">
    <div v-if="selectedDriver" class="h-full flex flex-col bg-gray-50/30">
      <!-- Custom Header with Close and Edit -->
      <div class="p-8 pb-4 flex items-center justify-between">
        <button @click="showViewDrawer = false"
          class="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all shadow-sm">
          <el-icon size="18">
            <Close />
          </el-icon>
        </button>
        <div class="flex space-x-3">
          <el-button
            class="!rounded-xl !bg-white !border-gray-100 !text-gray-700 font-bold hover:!border-amber-500 hover:!text-amber-600 transition-all shadow-sm"
            @click="navigateTo(`/admin/drivers/edit/${selectedDriver.id}`)">
            <el-icon class="mr-1.5">
              <Edit />
            </el-icon> Edit Profile
          </el-button>
        </div>
      </div>

      <!-- Sticky Header Context -->
      <div class="px-8 pb-8 pt-2">
        <div class="flex items-end space-x-6">
          <div class="relative">
            <div
              class="w-24 h-24 rounded-3xl bg-amber-500 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-amber-200 ring-8 ring-white">
              {{ selectedDriver.name?.charAt(0) }}
            </div>
            <div
              class="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white p-1.5 shadow-lg border border-gray-50">
              <div :class="[
                'w-full h-full rounded-xl',
                selectedDriver.status === 'online' ? 'bg-green-500 animate-pulse' :
                  selectedDriver.status === 'on-trip' ? 'bg-blue-500' : 'bg-gray-300'
              ]"></div>
            </div>
          </div>
          <div class="flex-1 pb-1">
            <h2 class="text-3xl font-black text-gray-900 tracking-tight leading-tight">{{ selectedDriver.name }}</h2>
            <div class="flex items-center space-x-4 mt-2">
              <div class="flex items-center text-sm font-bold text-gray-500">
                <span class="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
                ID: {{ selectedDriver.id?.slice(-6).toUpperCase() }}
              </div>
              <div class="flex items-center text-sm font-bold bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                <el-icon class="mr-1">
                  <StarFilled />
                </el-icon>
                {{ selectedDriver.rating || '5.0' }} Rating
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="px-8">
        <el-tabs v-model="activeTab" class="premium-tabs">
          <el-tab-pane label="Overview" name="info">
            <div class="py-8 space-y-10 animate-fade-in-up">

              <!-- Info Grid -->
              <div class="grid grid-cols-2 gap-6">
                <!-- Email Card -->
                <div
                  class="group bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                  <div
                    class="w-10 h-10 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mb-4 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                    <el-icon size="20">
                      <Message />
                    </el-icon>
                  </div>
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                  <p class="text-gray-900 font-bold break-all leading-tight">{{ selectedDriver.email }}</p>
                </div>

                <!-- Phone Card -->
                <div
                  class="group bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                  <div
                    class="w-10 h-10 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mb-4 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                    <el-icon size="20">
                      <Phone />
                    </el-icon>
                  </div>
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
                  <p class="text-gray-900 font-bold leading-tight">{{ selectedDriver.phone }}</p>
                </div>
              </div>

              <!-- Vehicle Pass Section -->
              <div class="bg-gray-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                <div
                  class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all">
                </div>

                <div class="flex justify-between items-start mb-10">
                  <div>
                    <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Primary Vehicle</h3>
                    <p class="text-2xl font-black">{{ selectedDriver.vehicleMake }} {{ selectedDriver.vehicleModel }}
                    </p>
                  </div>
                  <div class="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <el-icon size="24">
                      <Van />
                    </el-icon>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-white/5 border border-white/10 p-4 rounded-3xl">
                    <p class="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Plate Number</p>
                    <p class="text-xl font-mono font-black italic">{{ selectedDriver.vehiclePlate?.toUpperCase() }}</p>
                  </div>
                  <div class="bg-white/5 border border-white/10 p-4 rounded-3xl">
                    <p class="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Status</p>
                    <p class="text-xl font-black capitalize">{{ selectedDriver.status }}</p>
                  </div>
                </div>
              </div>

              <!-- Performance Grid -->
              <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center">
                  <span class="w-8 h-1 bg-amber-500 rounded-full mr-3"></span>
                  Fleet Performance
                </h3>
                <div class="grid grid-cols-2 gap-8">
                  <div class="relative">
                    <p class="text-4xl font-black text-gray-900 leading-none mb-1">{{ selectedDriver.totalTrips || '0'
                      }}
                    </p>
                    <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Completed Jobs</p>
                  </div>
                  <div class="relative">
                    <p class="text-4xl font-black text-gray-900 leading-none mb-1">{{ selectedDriver.rating || '5.0' }}
                    </p>
                    <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Driver Rating</p>
                  </div>
                </div>
              </div>

            </div>
          </el-tab-pane>

          <el-tab-pane label="Documentation" name="docs">
            <div class="py-8 space-y-8 animate-fade-in-up">

              <!-- Warning Header -->
              <div class="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-center space-x-4">
                <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
                  <el-icon size="24">
                    <WarningFilled />
                  </el-icon>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-amber-900">License Verification</h4>
                  <p class="text-xs text-amber-700 mt-0.5">Expires: <span class="font-black underline">{{
                    selectedDriver.licenseExpiryDate || 'Pending' }}</span></p>
                </div>
              </div>

              <!-- Document Stack -->
              <div class="space-y-4">
                <!-- Document Item -->
                <div
                  class="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-amber-200 transition-all">
                  <div class="flex items-center space-x-4">
                    <div
                      class="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-amber-100 group-hover:text-amber-600">
                      <el-icon size="20">
                        <Picture />
                      </el-icon>
                    </div>
                    <div>
                      <p class="text-sm font-black text-gray-900 italic">Driver_License_Front.png</p>
                      <p class="text-xs text-gray-400 font-bold mt-0.5">Validated on: 12 Jan 2026</p>
                    </div>
                  </div>
                  <el-button link type="primary" class="!font-black italic">PREVIEW</el-button>
                </div>

                <!-- Document Item -->
                <div
                  class="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-amber-200 transition-all">
                  <div class="flex items-center space-x-4">
                    <div
                      class="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-amber-100 group-hover:text-amber-600">
                      <el-icon size="20">
                        <Picture />
                      </el-icon>
                    </div>
                    <div>
                      <p class="text-sm font-black text-gray-900 italic">PHV_Badge_Digital.pdf</p>
                      <p class="text-xs text-gray-400 font-bold mt-0.5">Validated on: 10 Jan 2026</p>
                    </div>
                  </div>
                  <el-button link type="primary" class="!font-black italic">PREVIEW</el-button>
                </div>
              </div>

              <!-- Compliance Check -->
              <div class="p-10 bg-green-900 rounded-[40px] text-white text-center shadow-2xl">
                <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <el-icon size="32">
                    <CircleCheckFilled />
                  </el-icon>
                </div>
                <h3 class="text-xl font-black mb-1 italic">VETTED & APPROVED</h3>
                <p class="text-green-300/80 text-sm font-bold tracking-widest uppercase">Verified by CityCars Admin</p>
              </div>

            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  MoreFilled, View, Edit, ChatLineRound,
  CircleClose, CircleCheck, Delete, ArrowRight, Van, Document, Picture,
  Close, Message, Phone, StarFilled, WarningFilled, CircleCheckFilled, Loading
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
  ssr: false
});

const isLoading = ref(true);
const showViewDrawer = ref(false);
const activeTab = ref('info');
const selectedDriver = ref<any>(null);

const stats = ref({
  total: 0,
  online: 0,
  onTrip: 0,
  offline: 0
});

const drivers = ref<any[]>([]);
const isWorking = ref<Record<string, boolean>>({});

const handleAction = async (command: string, driver: any) => {
  if (isWorking.value[driver.id]) return;

  switch (command) {
    case 'view':
      selectedDriver.value = driver;
      showViewDrawer.value = true;
      activeTab.value = 'info';
      break;
    case 'edit':
      navigateTo(`/admin/drivers/edit/${driver.id}`);
      break;
    case 'message':
      ElMessage.info(`Messaging feature for ${driver.name} is coming soon!`);
      break;
    case 'inactivate':
    case 'activate':
      await toggleStatus(driver);
      break;
    case 'delete':
      await handleDelete(driver);
      break;
  }
};

const toggleStatus = async (driver: any) => {
  const newStatus = driver.status === 'inactive' ? 'offline' : 'inactive';
  isWorking.value[driver.id] = true;
  try {
    const { updateDriver } = useAdminFirestore();
    await updateDriver(driver.id, { status: newStatus });
    driver.status = newStatus;
    ElMessage.success(`Driver status updated to ${newStatus}`);
    await loadDrivers(); // Refresh to update stats
  } catch (error: any) {
    ElMessage.error('Failed to update status: ' + error.message);
  } finally {
    isWorking.value[driver.id] = false;
  }
};

const handleDelete = async (driver: any) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete ${driver.name}? This action is permanent.`,
      'Confirm Deletion',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    );

    const { deleteDriver } = useAdminFirestore();
    await deleteDriver(driver.id);
    ElMessage.success('Driver deleted successfully');
    await loadDrivers();
  } catch (error) {
    // User cancelled
  }
};

const loadDrivers = async () => {
  isLoading.value = true;
  try {
    const { getAllDrivers } = useAdminFirestore();
    drivers.value = await getAllDrivers();

    // Calculate stats
    stats.value = {
      total: drivers.value.length,
      online: drivers.value.filter((d: any) => d.status === 'online').length,
      onTrip: drivers.value.filter((d: any) => d.status === 'on-trip').length,
      offline: drivers.value.filter((d: any) => d.status === 'offline').length
    };

    isLoading.value = false;
  } catch (error: any) {
    console.error('[DRIVERS] ❌ Error loading drivers:', error);
    alert('Failed to load drivers: ' + error.message);
    isLoading.value = false;
  }
};

onMounted(async () => {
  await loadDrivers();
});
</script>

<style scoped>
.premium-drawer :deep(.el-drawer__body) {
  padding: 0;
}

.premium-tabs :deep(.el-tabs__header) {
  margin: 0;
}

.premium-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: #f3f4f6;
}

.premium-tabs :deep(.el-tabs__active-bar) {
  background-color: #f59e0b;
  height: 3px;
  border-radius: 3px;
}

.premium-tabs :deep(.el-tabs__item) {
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 12px;
  color: #9ca3af;
  padding: 20px 0;
  margin-right: 32px;
}

.premium-tabs :deep(.el-tabs__item.is-active) {
  color: #111827;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
