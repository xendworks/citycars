<template>
  <div class="p-4 bg-slate-50 dark:bg-slate-950 min-h-screen font-inter transition-colors duration-300">
    <div class="flex items-center justify-between mb-10">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-sora transition-colors">
          Executive Overview</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">Real-time analytics and dispatch
          performance dashboard.</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div v-for="card in statsConfig" :key="card.title"
        class="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-white/5 p-6 shadow-sm hover:shadow-md transition-all group">
        <el-skeleton :loading="isLoading" animated>
          <template #template>
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <el-skeleton-item variant="text" class="w-16 h-2 mb-2" />
                <el-skeleton-item variant="text" class="w-24 h-8 mb-3" />
                <el-skeleton-item variant="text" class="w-20 h-4" />
              </div>
              <el-skeleton-item variant="rect" class="w-14 h-14 rounded-2xl" />
            </div>
          </template>
          <template #default>
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p
                  class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] mb-1.5 transition-colors">
                  {{ card.title }}</p>
                <p class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-sora transition-colors">
                  {{ card.prefix }}{{ stats[card.key] }}{{ card.suffix }}
                </p>
                <div class="flex items-center mt-3">
                  <span
                    :class="[card.trendUp ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-400 dark:text-slate-500', 'text-xs font-bold flex items-center bg-slate-50 dark:bg-white/5 px-2 py-0.5 rounded-lg transition-colors']">
                    <el-icon v-if="card.trendUp" class="mr-1">
                      <Top />
                    </el-icon>
                    {{ card.trend }}
                  </span>
                </div>
              </div>
              <div
                :class="[card.iconBg, 'dark:bg-white/5 w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform']">
                <el-icon size="24" :class="card.iconColor">
                  <component :is="card.icon" />
                </el-icon>
              </div>
            </div>
          </template>
        </el-skeleton>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
      <!-- Bookings Trend -->
      <div
        class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-white/5 p-8 shadow-sm transition-colors">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white font-sora transition-colors">Bookings Velocity
            </h2>
            <p
              class="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-widest mt-1 transition-colors">
              Growth over time</p>
          </div>
        </div>
        <div class="h-[350px] w-full">
          <el-skeleton :loading="isLoading" animated>
            <template #template>
              <el-skeleton-item variant="rect" class="w-full h-[350px] rounded-2xl" />
            </template>
            <template #default>
              <client-only>
                <v-chart class="chart" :option="lineChartOption" autoresize />
              </client-only>
            </template>
          </el-skeleton>
        </div>
      </div>

      <!-- Breakdown Pie -->
      <div
        class="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-white/5 p-8 shadow-sm transition-colors">
        <div class="mb-8">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white font-sora transition-colors">Status Mix</h2>
          <p
            class="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-widest mt-1 transition-colors">
            Outcome Distribution</p>
        </div>
        <div class="h-[350px] w-full">
          <el-skeleton :loading="isLoading" animated>
            <template #template>
              <el-skeleton-item variant="rect" class="w-full h-[350px] rounded-2xl" />
            </template>
            <template #default>
              <client-only>
                <v-chart class="chart" :option="pieChartOption" autoresize />
              </client-only>
            </template>
          </el-skeleton>
        </div>
      </div>

      <!-- Traffic Bar -->
      <div
        class="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-white/5 p-8 shadow-sm transition-colors">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white font-sora transition-colors">Peak-Time Analysis
            </h2>
            <p
              class="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-widest mt-1 transition-colors">
              Hourly request volume</p>
          </div>
        </div>
      </div>
      <div class="h-[300px] w-full">
        <el-skeleton :loading="isLoading" animated>
          <template #template>
            <el-skeleton-item variant="rect" class="w-full h-[300px] rounded-2xl" />
          </template>
          <template #default>
            <client-only>
              <v-chart class="chart" :option="barChartOption" autoresize />
            </client-only>
          </template>
        </el-skeleton>
      </div>
    </div>


    <!-- Recent Bookings Table -->
    <div
      class="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden min-h-[500px] flex flex-col transition-colors">
      <div
        class="p-8 border-b border-slate-50 dark:border-white/5 flex items-center justify-between flex-shrink-0 transition-colors">
        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white font-sora transition-colors">Recent Transactions
          </h2>
          <p
            class="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-widest mt-1 transition-colors">
            Latest system activity</p>
        </div>
        <NuxtLink to="/admin/bookings"
          class="px-5 py-2.5 bg-slate-50 dark:bg-white/5 text-amber-600 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all border border-slate-100 dark:border-white/5">
          View All Active
        </NuxtLink>
      </div>

      <AdminBookingTable :data="recentBookings" :loading="isLoading" :height="500" @action="handleAction"
        @copy="copyToClipboard" class="flex-1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, PieChart, BarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';
import {
  Ticket, UserFilled, Money, User,
  Top, Bottom, Search, Calendar
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// Initialize ECharts
use([
  CanvasRenderer,
  LineChart,
  PieChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
]);

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
});

import { useRouter } from 'vue-router';
const router = useRouter();

const stats = ref<any>({
  totalBookings: 0,
  activeDrivers: 0,
  onlineDrivers: 0,
  todayRevenue: 0,
  activeUsers: 0
});

const statsConfig = [
  { title: 'Gross Volume', key: 'totalBookings', icon: Ticket, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', trend: '+12% MoM', trendUp: true, prefix: '', suffix: '' },
  { title: 'Network Fleet', key: 'activeDrivers', icon: UserFilled, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', trend: '85% Utilization', trendUp: true, prefix: '', suffix: '' },
  { title: 'Daily Yield', key: 'todayRevenue', icon: Money, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', trend: '+8% vs Prev', trendUp: true, prefix: '£', suffix: '' },
  { title: 'User Base', key: 'activeUsers', icon: User, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', trend: '+24 This Week', trendUp: true, prefix: '', suffix: '' }
];

const rawAllBookings = ref<any[]>([]);
const recentBookings = ref<any[]>([]);
const isLoading = ref(true);

// Chart Options Computation
const lineChartOption = computed(() => {
  const dates: Record<string, number> = {};
  const sorted = [...rawAllBookings.value].sort((a, b) => {
    const da = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
    const db = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
    return da.getTime() - db.getTime();
  });

  sorted.forEach(b => {
    const d = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
    const label = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    dates[label] = (dates[label] || 0) + 1;
  });

  return {
    tooltip: { trigger: 'axis', backgroundColor: '#0f172a', textStyle: { color: '#fff' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: Object.keys(dates), axisLine: { lineStyle: { color: '#e2e8f0' } } },
    yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } } },
    series: [{
      data: Object.values(dates),
      type: 'line',
      smooth: true,
      color: '#f59e0b',
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: 'rgba(245, 158, 11, 0.2)' }, { offset: 1, color: 'rgba(245, 158, 11, 0)' }]
        }
      },
      lineStyle: { width: 4 }
    }]
  };
});

const pieChartOption = computed(() => {
  const counts: Record<string, number> = {};
  rawAllBookings.value.forEach(b => {
    counts[b.status] = (counts[b.status] || 0) + 1;
  });

  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: '5%', left: 'center', itemWidth: 10, itemHeight: 10, textStyle: { color: '#64748b', fontWeight: 'bold' } },
    series: [{
      name: 'Status',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
      data: [
        { value: counts['completed'] || 0, name: 'Completed', itemStyle: { color: '#10b981' } },
        { value: counts['in-progress'] || 0, name: 'In Transit', itemStyle: { color: '#f59e0b' } },
        { value: counts['cancelled'] || 0, name: 'Cancelled', itemStyle: { color: '#f43f5e' } },
        { value: counts['pending'] || 0, name: 'Pending', itemStyle: { color: '#0f172a' } }
      ]
    }]
  };
});

const barChartOption = computed(() => {
  const hours = Array(24).fill(0);
  rawAllBookings.value.forEach(b => {
    const d = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
    hours[d.getHours()]++;
  });

  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: hours.map((_, i) => `${i}h`), axisLine: { show: false } },
    yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } } },
    series: [{
      name: 'Requests',
      type: 'bar',
      data: hours,
      itemStyle: { color: '#f59e0b', borderRadius: [4, 4, 0, 0] },
      barWidth: '60%'
    }]
  };
});

const formatDate = (dateString: any) => {
  if (!dateString) return 'N/A';
  const date = dateString.toDate ? dateString.toDate() : new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  ElMessage.success('Copied to clipboard!');
};

const handleAction = (command: string, row: any) => {
  switch (command) {
    case 'view':
      router.push(`/admin/bookings/${row.id}`);
      break;
    case 'status':
    case 'assign':
      // From dashboard, we just redirect to the main bookings page 
      // where full management controls are available
      router.push('/admin/bookings');
      break;
    case 'print':
      ElMessage.info('Print feature coming soon!');
      break;
  }
};

onMounted(async () => {
  try {
    const { getDashboardStats, getAllBookings } = useAdminFirestore();

    // Load components in parallel
    const [statsRes, bookingsRes] = await Promise.all([
      getDashboardStats(),
      getAllBookings()
    ]);

    stats.value = statsRes;
    rawAllBookings.value = bookingsRes;
    recentBookings.value = bookingsRes.slice(0, 10);

    isLoading.value = false;
  } catch (error) {
    console.error('[DASHBOARD] ❌ Error loading dashboard data:', error);
    isLoading.value = false;
  }
});
</script>

<style scoped>
.chart {
  height: 100%;
}
</style>
