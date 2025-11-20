<template>
  <div class="bookings-page">
    <!-- Header with Title and Actions -->
    <div class="page-header">
      <h1 class="page-title">Bookings Management</h1>
      <div class="header-actions">
        <Button variant="primary" size="lg" @click="exportData">
          <el-icon class="mr-1"><Download /></el-icon>
          Export
        </Button>
      </div>
    </div>

    <!-- Toolbar - Everything in Single Line -->
    <div class="toolbar">
      <!-- Search with Filter -->
      <SearchInput
        v-model="searchQuery"
        v-model:filter-value="searchFilter"
        :filter-options="searchFilterOptions"
        filter-label="Search by"
        placeholder="Search by Booking ID, Customer, Phone..."
        @search="handleSearch"
        @filter-change="handleSearchFilterChange"
        class="search-component"
      />

      <!-- Sort Dropdown -->
      <Dropdown
        v-model="currentSort"
        button-text="Sort"
        :items="sortOptions"
        @select="handleSortSelect"
      >
        <template #button>
          <el-icon class="mr-1"><Sort /></el-icon>
          Sort
        </template>
      </Dropdown>

      <!-- Column Reorder -->
      <Button size="md" :rounded="false" @click="showColumnSettings = true">
        <el-icon><Setting /></el-icon>
        <span class="ml-1">Reorder</span>
      </Button>

      <!-- Status Filter Dropdown -->
      <Dropdown
        v-model="statusFilter"
        :button-text="getStatusLabel(statusFilter)"
        :items="statusOptions"
        @select="filterByStatus"
      />

      <!-- View Toggle -->
      <Button
        :variant="viewMode === 'table' ? 'primary' : 'white'"
        size="md"
        :rounded="false"
        @click="viewMode = 'table'"
      >
        <el-icon><Menu /></el-icon>
      </Button>
      <Button
        :variant="viewMode === 'grid' ? 'primary' : 'white'"
        size="md"
        :rounded="false"
        @click="viewMode = 'grid'"
      >
        <el-icon><Grid /></el-icon>
      </Button>

      <!-- Advanced Filter Dropdown -->
      <Dropdown
        button-text="Filter"
        :items="advancedFilterOptions"
        @select="handleAdvancedFilter"
      >
        <template #button>
          <el-icon class="mr-1"><Filter /></el-icon>
          Filter
        </template>
      </Dropdown>
    </div>

    <!-- Data Table -->
    <div class="table-container">
      <el-table
        ref="tableRef"
        :data="paginatedBookings"
        v-loading="isLoading"
        stripe
        :default-sort="{ prop: 'createdAt', order: 'descending' }"
        @sort-change="handleSortChange"
        style="width: 100%"
        :row-class-name="getRowClassName"
      >
        <!-- ID Column -->
        <el-table-column
          prop="bookingReference"
          label="ID"
          width="160"
          sortable="custom"
          fixed
          :resizable="true"
        >
          <template #default="{ row }">
            <div class="id-cell">
              <el-icon class="copy-icon" @click="copyToClipboard(row.bookingReference)">
                <DocumentCopy />
              </el-icon>
              <span class="booking-id">{{ row.bookingReference }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- Customer Column -->
        <el-table-column
          label="CUSTOMER"
          width="280"
          sortable="custom"
          prop="userName"
          :resizable="true"
        >
          <template #default="{ row }">
            <div class="customer-cell">
              <el-avatar :size="40" :src="row.photoURL">
                {{ getInitials(row.userName) }}
              </el-avatar>
              <div class="customer-info">
                <div class="customer-name">{{ row.userName || 'N/A' }}</div>
                <div class="customer-email">{{ row.userEmail }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- Phone Column -->
        <el-table-column
          prop="userPhone"
          label="PHONE"
          width="200"
          :resizable="true"
        >
          <template #default="{ row }">
            <div class="phone-cell">
              <el-icon><Phone /></el-icon>
              <span>{{ row.userPhone }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- Pickup Column -->
        <el-table-column
          label="PICKUP"
          width="250"
          show-overflow-tooltip
          :resizable="true"
        >
          <template #default="{ row }">
            <div class="address-cell">
              <el-icon class="location-icon"><LocationFilled /></el-icon>
              <span>{{ row.pickupAddress }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- Dropoff Column -->
        <el-table-column
          label="DROPOFF"
          width="250"
          show-overflow-tooltip
          :resizable="true"
        >
          <template #default="{ row }">
            <div class="address-cell">
              <el-icon class="location-icon"><Location /></el-icon>
              <span>{{ row.dropoffAddress }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- Date & Time Column -->
        <el-table-column
          label="DATE & TIME"
          width="280"
          sortable="custom"
          prop="pickupDateTime"
          :resizable="true"
        >
          <template #default="{ row }">
            <div class="datetime-cell">
              <el-icon><Calendar /></el-icon>
              <span>{{ formatDateTime(row.pickupDateTime) }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- Vehicle Column -->
        <el-table-column
          prop="vehicleType"
          label="VEHICLE"
          width="130"
          :resizable="true"
        >
          <template #default="{ row }">
            <el-tag size="small" class="vehicle-tag">{{ row.vehicleType?.toUpperCase() }}</el-tag>
          </template>
        </el-table-column>

        <!-- Fare Column -->
        <el-table-column
          label="FARE"
          width="120"
          sortable="custom"
          prop="totalFare"
          align="right"
          :resizable="true"
        >
          <template #default="{ row }">
            <div class="fare-cell">£{{ row.totalFare?.toFixed(2) || '0.00' }}</div>
          </template>
        </el-table-column>

        <!-- Status Column -->
        <el-table-column
          label="STATUS"
          width="140"
          :resizable="true"
        >
          <template #default="{ row }">
            <StatusBadge :status="row.status" />
          </template>
        </el-table-column>

        <!-- Actions Column -->
        <el-table-column
          label="ACTIONS"
          width="140"
          fixed="right"
          align="center"
        >
          <template #default="{ row }">
            <el-dropdown trigger="click" @command="(cmd) => handleAction(cmd, row)">
              <Button size="sm">
                <el-icon><MoreFilled /></el-icon>
              </Button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="view">
                    <el-icon><View /></el-icon>
                    <span>View Details</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="status">
                    <el-icon><Edit /></el-icon>
                    <span>Change Status</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="assign">
                    <el-icon><User /></el-icon>
                    <span>Assign Driver</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="print" divided>
                    <el-icon><Printer /></el-icon>
                    <span>Print</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty description="No bookings found" />
        </template>
      </el-table>
    </div>

    <!-- Footer with Pagination -->
    <div class="table-footer">
      <div class="footer-left">
        <span class="total-count">Total {{ totalBookings }}</span>
      </div>
      <div class="footer-center">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 30, 50, 100]"
          :total="totalBookings"
          layout="prev, pager, next"
          background
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
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
    <Modal
      v-model="showColumnSettings"
      title="Reorder Columns"
      size="md"
    >
      <div class="column-settings">
        <p class="text-sm text-gray-600 mb-4">Select which columns to display and drag to reorder them.</p>
        <div class="space-y-2">
          <div v-for="(column, index) in availableColumns" :key="column.key" class="column-item">
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <el-icon class="drag-handle cursor-move text-gray-400"><DCaret /></el-icon>
              <input
                type="checkbox"
                :id="`col-${column.key}`"
                :checked="column.visible"
                @change="toggleColumn(column.key)"
                class="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
              />
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
    <Modal
      v-model="showStatusDialog"
      title="Change Booking Status"
      size="lg"
    >
      <div v-if="selectedBooking">
        <p class="dialog-subtitle">
          Update status for booking <strong>{{ selectedBooking.bookingReference }}</strong>
        </p>
        <div class="status-options">
          <div
            v-for="status in availableStatuses"
            :key="status.value"
            @click="changeStatus(status.value)"
            class="status-option"
            :class="{ active: selectedBooking.status === status.value }"
          >
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
    <Modal
      v-model="showDetailsDialog"
      title="Booking Details"
      size="xl"
    >
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
          <el-descriptions-item label="Total Fare">
            <span class="fare-large">£{{ selectedBooking.totalFare?.toFixed(2) || '0.00' }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="modal-footer">
          <Button variant="primary" size="lg" @click="showDetailsDialog = false">Close</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
  ssr: false
});

import { 
  Download, Search, Sort, Setting, Menu, Grid, Filter, 
  DocumentCopy, Phone, LocationFilled, Location, Calendar, 
  MoreFilled, View, Edit, User, Printer, DCaret 
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// State
const isLoading = ref(true);
const bookings = ref<any[]>([]);
const searchQuery = ref('');
const searchFilter = ref('all');
const statusFilter = ref('');
const vehicleFilter = ref('');
const dateRange = ref<[Date, Date] | null>(null);
const viewMode = ref('table');
const currentPage = ref(1);
const pageSize = ref(30);
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
const selectedBooking = ref<any>(null);

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

// Computed
const filteredBookings = computed(() => {
  let filtered = [...bookings.value];

  // Search filter with specific field filtering
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    
    filtered = filtered.filter(b => {
      switch (searchFilter.value) {
        case 'id':
          return b.bookingReference?.toLowerCase().includes(query);
        case 'customer':
          return b.userName?.toLowerCase().includes(query);
        case 'phone':
          return b.userPhone?.includes(query);
        case 'email':
          return b.userEmail?.toLowerCase().includes(query);
        case 'all':
        default:
          return (
            b.bookingReference?.toLowerCase().includes(query) ||
            b.userName?.toLowerCase().includes(query) ||
            b.userEmail?.toLowerCase().includes(query) ||
            b.userPhone?.includes(query)
          );
      }
    });
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(b => b.status === statusFilter.value);
  }

  // Vehicle filter
  if (vehicleFilter.value) {
    filtered = filtered.filter(b => b.vehicleType === vehicleFilter.value);
  }

  // Date range filter
  if (dateRange.value && dateRange.value.length === 2) {
    const [start, end] = dateRange.value;
    filtered = filtered.filter(b => {
      const bookingDate = new Date(b.pickupDateTime);
      return bookingDate >= start && bookingDate <= end;
    });
  }

  totalBookings.value = filtered.length;
  return filtered;
});

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredBookings.value.slice(start, end);
});

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

const getInitials = (name: string) => {
  if (!name) return 'NA';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const getRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  return rowIndex % 2 === 0 ? 'even-row' : 'odd-row';
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
      showDetailsDialog.value = true;
      break;
    case 'status':
      showStatusDialog.value = true;
      break;
    case 'assign':
      ElMessage.info('Assign driver feature coming soon!');
      break;
    case 'print':
      ElMessage.info('Print feature coming soon!');
      break;
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

const loadBookings = async () => {
  isLoading.value = true;
  try {
    const { getAllBookings } = useAdminFirestore();
    bookings.value = await getAllBookings({});
    totalBookings.value = bookings.value.length;
  } catch (error: any) {
    ElMessage.error('Failed to load bookings: ' + error.message);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadBookings();
});
</script>

<style scoped lang="scss">
.bookings-page {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }
}

.toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 8px;
  flex-wrap: wrap;
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .search-component {
    width: 420px;
    max-width: 100%;
  }
}

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 16px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .total-count {
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
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
