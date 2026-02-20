<template>
  <div class="bookings-page">
    <!-- Header with Title and Actions -->
    <div class="page-header">
      <h1 class="page-title">Bookings Management</h1>
      <div class="header-actions flex items-center">
        <!-- Segmented Tabs -->
        <span class="isolate inline-flex rounded-md shadow-sm mr-4 overflow-hidden border border-slate-200">
          <button @click="timeFilter = ''" type="button"
            :class="[timeFilter === '' ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50', 'relative inline-flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all focus:z-10']">
            All
          </button>
          <button @click="timeFilter = 'past'" type="button"
            :class="[timeFilter === 'past' ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50', 'relative -ml-px inline-flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all border-l border-slate-200 focus:z-10']">
            Past
          </button>
          <button @click="timeFilter = 'today'" type="button"
            :class="[timeFilter === 'today' ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50', 'relative -ml-px inline-flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all border-l border-slate-200 focus:z-10']">
            Today
          </button>
          <button @click="timeFilter = 'future'" type="button"
            :class="[timeFilter === 'future' ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50', 'relative -ml-px inline-flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all border-l border-slate-200 focus:z-10']">
            Future
          </button>
        </span>

        <Button variant="primary" size="lg" @click="exportData">
          <el-icon class="mr-1">
            <Download />
          </el-icon>
          Export
        </Button>
      </div>
    </div>

    <!-- Toolbar - Everything in Single Line -->
    <div class="toolbar">
      <!-- Search with Filter -->
      <SearchInput v-model="searchQuery" v-model:filter-value="searchFilter" :filter-options="searchFilterOptions"
        filter-label="Search by" placeholder="Search by Booking ID, Customer, Phone..." @search="handleSearch"
        @filter-change="handleSearchFilterChange" class="search-component" />

      <!-- Sort Dropdown -->
      <Dropdown class="ml-auto" v-model="currentSort" button-text="Sort" :items="sortOptions"
        @select="handleSortSelect">
        <template #button>
          <el-icon class="mr-1">
            <Sort />
          </el-icon>
          Sort
        </template>
      </Dropdown>

      <!-- Column Reorder -->
      <Button size="md" :rounded="false" @click="showColumnSettings = true">
        <el-icon>
          <Setting />
        </el-icon>
        <span class="ml-1">Reorder</span>
      </Button>

      <!-- Status Filter Dropdown -->
      <Dropdown v-model="statusFilter" :button-text="getStatusLabel(statusFilter)" :items="statusOptions"
        @select="filterByStatus" />

      <!-- Advanced Filter Dropdown -->
      <Dropdown button-text="Filter" :items="advancedFilterOptions" @select="handleAdvancedFilter">
        <template #button>
          <el-icon class="mr-1">
            <Filter />
          </el-icon>
          Filter
        </template>
      </Dropdown>
    </div>

    <!-- Data Table -->
    <AdminBookingTable :data="bookings" :loading="isLoading" :height="'100%'" @sort-change="handleSortChange"
      @copy="copyToClipboard" @action="handleAction" class="flex-1 min-height-0" />

    <!-- Footer with Pagination -->
    <div class="table-footer">
      <div class="footer-left">
        <span class="total-count">Total {{ totalBookings }}</span>
      </div>
      <div class="footer-center">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 30, 50, 100]"
          :total="totalBookings" layout="prev, pager, next" background @size-change="handleSizeChange"
          @current-change="handlePageChange" />
      </div>
      <div class="footer-right">
        <el-select v-model="pageSize" size="large" @change="handleSizeChange">
          <el-option :value="10" label="10/page" />
          <el-option :value="30" label="30/page" />
          <el-option :value="50" label="50/page" />
          <el-option :value="100" label="100/page" />
        </el-select>
      </div>
    </div>

    <!-- Column Settings Modal -->
    <Modal v-model="showColumnSettings" title="Reorder Columns" size="md">
      <div class="column-settings">
        <p class="text-sm text-gray-600 mb-4">Select which columns to display and drag to reorder them.</p>
        <div class="space-y-2">
          <div v-for="(column, index) in availableColumns" :key="column.key" class="column-item">
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <el-icon class="drag-handle cursor-move text-gray-400">
                <DCaret />
              </el-icon>
              <input type="checkbox" :id="`col-${column.key}`" :checked="column.visible"
                @change="toggleColumn(column.key)"
                class="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500" />
              <label :for="`col-${column.key}`" class="flex-1 text-sm font-medium text-gray-900 cursor-pointer">
                {{ column.label }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="modal-footer">
          <Button size="lg" :rounded="false" @click="showColumnSettings = false">Cancel</Button>
          <Button variant="primary" size="lg" :rounded="false" @click="applyColumnSettings">Apply</Button>
        </div>
      </template>
    </Modal>

    <!-- Status Change Modal -->
    <Modal v-model="showStatusDialog" title="Change Booking Status" size="lg">
      <div v-if="selectedBooking">
        <p class="dialog-subtitle">
          Update status for booking <strong>{{ selectedBooking.bookingReference }}</strong>
        </p>
        <div class="status-options">
          <div v-for="status in availableStatuses" :key="status.value" @click="changeStatus(status.value)"
            class="status-option" :class="{ active: selectedBooking.status === status.value }">
            <span>{{ status.label }}</span>
            <StatusBadge :status="status.value" />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="modal-footer">
          <Button size="lg" @click="showStatusDialog = false">Cancel</Button>
        </div>
      </template>
    </Modal>

    <!-- Booking Details Modal -->
    <Modal v-model="showDetailsDialog" title="Booking Details" size="xl">
      <div v-if="selectedBooking">
        <el-descriptions :column="2" border size="large">
          <el-descriptions-item label="Booking ID">
            <span class="booking-id">{{ selectedBooking.bookingReference }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="Status">
            <StatusBadge :status="selectedBooking.status" />
          </el-descriptions-item>
          <el-descriptions-item label="Customer" :span="2">
            {{ selectedBooking.userName || 'N/A' }}
          </el-descriptions-item>
          <el-descriptions-item label="Email" :span="2">
            {{ selectedBooking.userEmail || 'N/A' }}
          </el-descriptions-item>
          <el-descriptions-item label="Phone" :span="2">
            {{ selectedBooking.userPhone || 'N/A' }}
          </el-descriptions-item>
          <el-descriptions-item label="Pickup Address" :span="2">
            {{ selectedBooking.pickupAddress }}
          </el-descriptions-item>
          <el-descriptions-item label="Dropoff Address" :span="2">
            {{ selectedBooking.dropoffAddress }}
          </el-descriptions-item>
          <el-descriptions-item label="Date & Time" :span="2">
            {{ formatDateTime(selectedBooking.pickupDateTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="Vehicle Type">
            <el-tag>{{ selectedBooking.vehicleType }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Passengers">
            {{ selectedBooking.passengers || 'N/A' }}
          </el-descriptions-item>
          <el-descriptions-item label="Luggage">
            {{ selectedBooking.luggage || 'N/A' }}
          </el-descriptions-item>
          <el-descriptions-item label="Total Fare" :span="2">
            <span class="fare-large">£{{ selectedBooking.totalFare?.toFixed(2) || '0.00' }}</span>
          </el-descriptions-item>

          <el-descriptions-item label="Driver Info" v-if="selectedBooking.driverId" :span="2">
            <div class="flex items-center gap-2">
              <el-avatar :size="24" class="bg-amber-100 text-amber-700 font-bold">{{ selectedBooking.driverName?.[0]
                }}</el-avatar>
              <span>{{ selectedBooking.driverName }} ({{ selectedBooking.driverPhone }})</span>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="Driver Info" v-else :span="2">
            <span class="text-gray-400 italic font-medium">No driver assigned</span>
            <Button size="sm" class="ml-4" @click="handleAction('assign', selectedBooking)">Assign Now</Button>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="modal-footer">
          <Button variant="primary" size="lg" @click="showDetailsDialog = false">Close</Button>
        </div>
      </template>
    </Modal>

    <!-- Assign Driver Modal -->
    <Modal v-model="showAssignDriverDialog" title="Assign Driver" size="lg">
      <div v-if="selectedBooking" class="space-y-6">
        <div class="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
          <div class="flex items-start gap-3">
            <el-icon class="text-blue-600 mt-1">
              <InfoFilled />
            </el-icon>
            <div>
              <p class="text-sm font-medium text-blue-900">Assigning driver to booking #{{
                selectedBooking.bookingReference
                }}</p>
              <p class="text-xs text-blue-700 mt-1">
                Pickup: {{ selectedBooking.pickupAddress }}<br>
                Date: {{ formatDateTime(selectedBooking.pickupDateTime) }}
              </p>
            </div>
          </div>
        </div>

        <div class="driver-selection py-2">
          <label class="block text-sm font-bold text-gray-700 mb-2">Select Available Driver</label>
          <el-select v-model="selectedDriverId" placeholder="Search driver by name or phone" filterable remote
            :loading="isDriversLoading" class="w-full h-12" size="large">
            <el-option v-for="driver in drivers" :key="driver.id"
              :label="`${driver.name || driver.displayName} (${driver.phone || driver.phoneNumber || 'No phone'})`"
              :value="driver.id">
              <div class="flex items-center justify-between">
                <span>{{ driver.name || driver.displayName }}</span>
                <el-tag size="small" :type="driver.status === 'online' ? 'success' : 'info'">
                  {{ driver.status?.toUpperCase() || 'OFFLINE' }}
                </el-tag>
              </div>
            </el-option>
          </el-select>
        </div>

        <div v-if="selectedDriverId"
          class="selected-driver-preview bg-gray-50 p-4 rounded-xl border border-gray-200 mt-4 transition-all">
          <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Driver Preview</h4>
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold text-xl uppercase">
              {{drivers.find(d => d.id === selectedDriverId)?.name?.[0] || 'D'}}
            </div>
            <div>
              <p class="font-bold text-gray-900">{{drivers.find(d => d.id === selectedDriverId)?.name}}</p>
              <p class="text-sm text-gray-600">{{drivers.find(d => d.id === selectedDriverId)?.phone}}</p>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="modal-footer">
          <Button size="lg" @click="showAssignDriverDialog = false">Cancel</Button>
          <Button variant="primary" size="lg" @click="handleAssignDriver" :loading="isLoading">Confirm
            Assignment</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
});

import {
  Download, Search, Sort, Setting, Menu, Grid, Filter,
  DocumentCopy, Phone, LocationFilled, Location, Calendar,
  MoreFilled, View, Edit, User, Printer, DCaret, InfoFilled, MagicStick
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// State
const isLoading = ref(true);
const isSeeding = ref(false);
const bookings = ref<any[]>([]);
const searchQuery = ref('');
const searchFilter = ref('all');
const statusFilter = ref('');
const timeFilter = ref('today');
const vehicleFilter = ref('');
const dateRange = ref<[Date, Date] | null>(null);
const viewMode = ref('table');
const currentPage = ref(1);
const pageSize = ref(15);
const sortProp = ref('createdAt');
const sortOrder = ref('descending');
const currentSort = ref('date-desc');
const totalBookings = ref(0);

// Search filter options
const searchFilterOptions = [
  { label: 'All Fields', value: 'all' },
  { label: 'Booking ID', value: 'id' },
  { label: 'Customer', value: 'customer' },
  { label: 'Phone', value: 'phone' },
  { label: 'Email', value: 'email' }
];

// Status filter options
const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' }
];

// Sort options
const sortOptions = [
  { label: 'Newest First', value: 'date-desc' },
  { label: 'Oldest First', value: 'date-asc' },
  { label: 'Highest Fare', value: 'fare-desc' },
  { label: 'Lowest Fare', value: 'fare-asc' },
  { label: 'Customer Name (A-Z)', value: 'customer-asc' },
  { label: 'Customer Name (Z-A)', value: 'customer-desc' }
];

// Advanced filter options
const advancedFilterOptions = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Custom Range...', value: 'custom' }
];

// Dialogs
const showColumnSettings = ref(false);
const showStatusDialog = ref(false);
const showDetailsDialog = ref(false);
const showAssignDriverDialog = ref(false);
const selectedBooking = ref<any>(null);

const drivers = ref<any[]>([]);
const isDriversLoading = ref(false);
const selectedDriverId = ref('');

const availableStatuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

// Column settings
const availableColumns = ref([
  { key: 'id', label: 'Booking ID', visible: true },
  { key: 'customer', label: 'Customer', visible: true },
  { key: 'phone', label: 'Phone', visible: true },
  { key: 'pickup', label: 'Pickup', visible: true },
  { key: 'dropoff', label: 'Dropoff', visible: true },
  { key: 'datetime', label: 'Date & Time', visible: true },
  { key: 'vehicle', label: 'Vehicle', visible: true },
  { key: 'fare', label: 'Fare', visible: true },
  { key: 'status', label: 'Status', visible: true }
]);

// Methods
const loadBookings = async () => {
  isLoading.value = true;
  try {
    const { getBookingsPage } = useAdminFirestore();

    const response = await getBookingsPage(currentPage.value, pageSize.value, {
      status: statusFilter.value,
      time: timeFilter.value,
      searchQuery: searchQuery.value,
      searchFilter: searchFilter.value
    });

    bookings.value = response.items;
    totalBookings.value = response.total;

  } catch (error: any) {
    console.error('[ADMIN] Failed to load bookings:', error);
    ElMessage.error('Failed to load bookings: ' + error.message);
  } finally {
    isLoading.value = false;
  }
};

// Methods
const formatDateTime = (dateString: any) => {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString.toDate();
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

const handleSearch = () => {
  currentPage.value = 1;
};

const handleSearchFilterChange = () => {
  // Trigger search when filter changes
  currentPage.value = 1;
};

const handleSortSelect = (sortValue: string) => {
  currentSort.value = sortValue as string;
  const [prop, order] = (sortValue as string).split('-');
  sortProp.value = prop;
  sortOrder.value = order === 'asc' ? 'ascending' : 'descending';
  // Apply sorting to the bookings
};

const handleSortChange = ({ prop, order }: any) => {
  sortProp.value = prop;
  sortOrder.value = order;
};

const filterByStatus = (status: string | number) => {
  statusFilter.value = status as string;
  currentPage.value = 1;
};

const getStatusLabel = (status: string) => {
  const option = statusOptions.find(opt => opt.value === status);
  return option ? option.label : 'All Statuses';
};

const handleAdvancedFilter = (filterValue: string | number) => {
  const value = filterValue as string;
  const now = new Date();

  switch (value) {
    case 'today':
      dateRange.value = [now, now];
      break;
    case 'week':
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      dateRange.value = [weekStart, now];
      break;
    case 'month':
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      dateRange.value = [monthStart, now];
      break;
    case 'custom':
      // TODO: Open custom date range modal
      ElMessage.info('Custom date range coming soon!');
      break;
  }

  if (value !== 'custom') {
    applyFilters();
  }
};

const applyFilters = () => {
  currentPage.value = 1;
};

const resetFilters = () => {
  searchQuery.value = '';
  statusFilter.value = '';
  vehicleFilter.value = '';
  dateRange.value = null;
  currentPage.value = 1;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  ElMessage.success('Copied to clipboard!');
};

const handleAction = (command: string, row: any) => {
  selectedBooking.value = row;
  switch (command) {
    case 'view':
      navigateTo(`/admin/bookings/${row.id}`);
      break;
    case 'status':
      showStatusDialog.value = true;
      break;
    case 'assign':
      openAssignDriverDialog();
      break;
    case 'edit':
      navigateTo(`/admin/bookings/edit/${row.id}`);
      break;
    case 'print':
      ElMessage.info('Print feature coming soon!');
      break;
  }
};

const openAssignDriverDialog = async () => {
  showAssignDriverDialog.value = true;
  selectedDriverId.value = selectedBooking.value?.driverId || '';

  if (drivers.value.length === 0) {
    await loadDrivers();
  }
};

const loadDrivers = async () => {
  isDriversLoading.value = true;
  try {
    const { getAllDrivers } = useAdminFirestore();
    drivers.value = await getAllDrivers();
  } catch (error: any) {
    ElMessage.error('Failed to load drivers: ' + error.message);
  } finally {
    isDriversLoading.value = false;
  }
};

const handleAssignDriver = async () => {
  if (!selectedBooking.value || !selectedDriverId.value) {
    ElMessage.warning('Please select a driver');
    return;
  }

  try {
    const { assignDriverToBooking } = useAdminFirestore();
    await assignDriverToBooking(selectedBooking.value.id, selectedDriverId.value);

    // Update local state
    const driver = drivers.value.find(d => d.id === selectedDriverId.value);
    selectedBooking.value.driverId = selectedDriverId.value;
    selectedBooking.value.driverName = driver?.name || driver?.displayName || 'Unknown';
    selectedBooking.value.status = 'confirmed';

    showAssignDriverDialog.value = false;
    ElMessage.success('Driver assigned successfully!');

    // Refresh bookings to show updated info
    loadBookings();
  } catch (error: any) {
    ElMessage.error('Failed to assign driver: ' + error.message);
  }
};

const changeStatus = async (newStatus: string) => {
  if (!selectedBooking.value) return;

  try {
    const { updateBookingStatus } = useAdminFirestore();
    await updateBookingStatus(selectedBooking.value.id, newStatus);
    selectedBooking.value.status = newStatus;
    showStatusDialog.value = false;
    ElMessage.success('Status updated successfully!');
  } catch (error: any) {
    ElMessage.error('Failed to update status: ' + error.message);
  }
};

const exportData = () => {
  ElMessage.info('Export feature coming soon!');
};

const toggleColumn = (columnKey: string) => {
  const column = availableColumns.value.find(col => col.key === columnKey);
  if (column) {
    column.visible = !column.visible;
  }
};

const applyColumnSettings = () => {
  showColumnSettings.value = false;
  ElMessage.success('Column settings applied!');
};

const handleSeedBookings = async () => {
  try {
    await ElMessageBox.confirm(
      'This will seed 50 random bookings into the database. Are you sure?',
      'Seed Test Data',
      {
        confirmButtonText: 'Seed 50 Bookings',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    );

    isSeeding.value = true;
    const { getAllUsers, getAllDrivers, db } = useAdminFirestore();

    const [users, allDrivers] = await Promise.all([
      getAllUsers(),
      getAllDrivers()
    ]);

    if (users.length === 0) {
      ElMessage.warning('No users found in system to assign bookings to.');
      isSeeding.value = false;
      return;
    }

    const pickupLocations = [
      "Heathrow Airport Terminal 5", "Gatwick Airport North", "Paddington Station",
      "Kings Cross St Pancras", "Oxford Street", "Canary Wharf",
      "Wembley Stadium", "The O2 Arena", "Chelsea", "Mayfair",
      "Kensington High St", "Westminster Abbey", "London Bridge"
    ];

    const dropoffLocations = [
      "Victoria Station", "Manchester Piccadilly", "Birmingham New St",
      "Luton Airport", "Stansted Airport", "Camden Town",
      "Notting Hill Gate", "Greenwich Park", "Richmond Park",
      "Shoreditch High St", "Liverpool Street", "Waterloo Station"
    ];

    const vehicleTypes = ['Standard', 'Executive', 'MPV', 'Estate', 'Minibuses'];
    const statuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];

    const bookingsCollection = collection(db, 'bookings');
    let seededCount = 0;

    for (let i = 0; i < 50; i++) {
      const user = users[Math.floor(Math.random() * users.length)] as any;
      const driver = allDrivers.length > 0 ? allDrivers[Math.floor(Math.random() * allDrivers.length)] as any : null;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const pickup = pickupLocations[Math.floor(Math.random() * pickupLocations.length)];
      const dropoff = dropoffLocations[Math.floor(Math.random() * dropoffLocations.length)];
      const vehicle = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
      const fare = Math.floor(Math.random() * 150) + 20;

      // Random date within last 30 days
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

      const bookingRef = `CTY${Math.floor(10000000 + Math.random() * 90000000)}`;

      const bookingData = {
        bookingReference: bookingRef,
        userId: user.id || user.uid,
        userName: user.displayName || user.name || 'Anonymous User',
        userEmail: user.email || 'N/A',
        userPhone: user.phoneNumber || user.phone || 'N/A',
        pickupAddress: pickup,
        dropoffAddress: dropoff,
        pickupDateTime: date.toISOString(),
        vehicleType: vehicle,
        totalFare: fare,
        status: status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        driverId: status !== 'pending' && status !== 'cancelled' ? (driver?.id || null) : null,
        driverName: status !== 'pending' && status !== 'cancelled' ? (driver?.name || driver?.displayName || null) : null,
        driverPhone: status !== 'pending' && status !== 'cancelled' ? (driver?.phone || driver?.phoneNumber || null) : null,
        paymentStatus: status === 'completed' ? 'paid' : 'pending',
        passengers: Math.floor(Math.random() * 4) + 1,
        luggage: Math.floor(Math.random() * 3) + 1
      };

      await addDoc(bookingsCollection, bookingData);
      seededCount++;
    }

    ElMessage.success(`Successfully seeded ${seededCount} bookings!`);
    loadBookings();
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('[SEED] ❌ Error seeding bookings:', error);
      ElMessage.error('Failed to seed bookings: ' + error.message);
    }
  } finally {
    isSeeding.value = false;
  }
};

// Add watchers to trigger re-fetch on pagination/filter changes
watch([currentPage, pageSize, statusFilter, timeFilter, searchQuery, searchFilter], () => {
  loadBookings();
});

onMounted(() => {
  loadBookings();
});
</script>

<style scoped lang="scss">
.bookings-page {
  padding: 16px 10px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-header {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .page-title {
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
    letter-spacing: -0.02em;
  }
}

.toolbar {
  flex-shrink: 0;
  display: flex;
  position: sticky;
  top: 50px;
  z-index: 50;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
  flex-wrap: nowrap;
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  .search-component {
    width: 420px;
  }
}

.table-container {
  flex: 1;
  min-height: 0;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-footer {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 12px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .total-count {
    font-size: 14px;
    color: #64748b;
    font-weight: 600;
  }
}

/* Cell Styles */
.id-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  .copy-icon {
    cursor: pointer;
    color: #9ca3af;

    &:hover {
      color: #6b7280;
    }
  }

  .booking-id {
    font-family: 'Monaco', 'Courier New', monospace;
    font-weight: 600;
    color: #1f2937;
    font-size: 13px;
  }
}

.customer-cell {
  display: flex;
  align-items: center;
  gap: 12px;

  .customer-info {
    flex: 1;
    min-width: 0;

    .customer-name {
      font-weight: 500;
      color: #1f2937;
      margin-bottom: 2px;
    }

    .customer-email {
      font-size: 12px;
      color: #6b7280;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.phone-cell,
.datetime-cell,
.address-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4b5563;

  .location-icon {
    color: #f59e0b;
  }
}

.fare-cell {
  font-weight: 600;
  font-size: 15px;
  color: #059669;
}

.vehicle-tag {
  font-weight: 600;
  font-size: 11px;
}

/* Modal Styles */
.dialog-subtitle {
  color: #6b7280;
  margin-bottom: 24px;
  font-size: 14px;
}

.status-options {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .status-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: #fbbf24;
      background: #fffbeb;
    }

    &.active {
      border-color: #f59e0b;
      background: #fef3c7;
    }

    span {
      font-weight: 500;
      color: #1f2937;
    }
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.column-settings {
  .column-item {
    .drag-handle {
      font-size: 16px;
    }
  }
}

.filter-dropdown-content {
  padding: 16px;
  width: 300px;

  .filter-section {
    margin-bottom: 16px;

    label {
      display: block;
      margin-bottom: 8px;
      font-size: 13px;
      font-weight: 500;
      color: #374151;
    }
  }

  .filter-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
  }
}

.fare-large {
  font-size: 18px;
  font-weight: 600;
  color: #059669;
}

/* Element Plus Overrides */
:deep(.el-table) {
  font-size: 14px;

  th {
    background: #f9fafb !important;
    color: #6b7280;
    font-weight: 600;
    font-size: 11px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .el-table__cell {
    padding: 14px 12px;
  }

  .even-row {
    background: #ffffff;
  }

  .odd-row {
    background: #f9fafb;
  }
}

:deep(.el-pagination) {
  .el-pager li {
    font-weight: 500;
    border-radius: 8px;
    margin: 0 2px;

    &.is-active {
      background-color: #dc2626;
      color: white;
    }

    &:hover:not(.is-active) {
      color: #f59e0b;
    }
  }

  .btn-prev,
  .btn-next {
    border-radius: 8px;
  }
}
</style>
