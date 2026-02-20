<template>
  <div class="pricing-page">
    <div class="page-header">
      <h1 class="text-3xl font-bold text-gray-900">Pricing Rules</h1>
      <Button variant="primary" size="lg" @click="handleCreateRule">
        <el-icon class="mr-1">
          <Plus />
        </el-icon>
        Create New Rule
      </Button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <!-- Base Pricing Config -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 class="text-xl font-bold mb-4">Base Fare Settings</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Minimum Fare (£)</label>
              <el-input-number v-model="baseConfig.minFare" :precision="2" :step="0.5" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Price per Mile (£)</label>
              <el-input-number v-model="baseConfig.perMile" :precision="2" :step="0.1" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Waiting Charge (£/min)</label>
              <el-input-number v-model="baseConfig.waitingCharge" :precision="2" :step="0.1" class="w-full" />
            </div>
            <Button variant="primary" size="md" class="w-full mt-4" @click="saveBaseConfig">Save Base Settings</Button>
          </div>
        </div>
      </div>

      <!-- Overrides & Rules -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-6 border-bottom border-gray-200 flex justify-between items-center">
            <h2 class="text-xl font-bold">Dynamic Pricing & Overrides</h2>
            <div class="flex gap-2">
              <el-tag type="success">3 Active Rules</el-tag>
            </div>
          </div>

          <el-table :data="rules" stripe style="width: 100%">
            <el-table-column label="RULE NAME" min-width="200">
              <template #default="scope">
                <div v-if="scope?.row">
                  <div class="font-semibold text-gray-900">{{ scope.row.name }}</div>
                  <div class="text-xs text-gray-500">{{ scope.row.description }}</div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="MULTIPLIER" width="120" align="center">
              <template #default="scope">
                <el-tag v-if="scope?.row" type="warning" effect="dark">x{{ scope.row.multiplier }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column label="SCHEDULE" width="200">
              <template #default="scope">
                <div v-if="scope?.row" class="text-xs">
                  <div class="flex items-center gap-1">
                    <el-icon>
                      <Calendar />
                    </el-icon>
                    {{ scope.row.schedule }}
                  </div>
                  <div class="flex items-center gap-1 mt-1 font-medium text-amber-600">
                    <el-icon>
                      <Timer />
                    </el-icon>
                    {{ scope.row.timeRange }}
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="ACTIONS" width="120" align="center">
              <template #default="scope">
                <div v-if="scope?.row" class="flex justify-center gap-2">
                  <el-button size="small" circle icon="Edit" />
                  <el-button size="small" type="danger" circle icon="Delete" />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Calendar, Timer, Edit, Delete } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
});

const baseConfig = ref({
  minFare: 5.00,
  perMile: 1.80,
  waitingCharge: 0.20
});

const rules = ref([
  {
    name: 'Late Night Surge',
    description: 'Applied to all bookings between 11 PM and 5 AM',
    multiplier: 1.5,
    schedule: 'Every day',
    timeRange: '23:00 - 05:00'
  },
  {
    name: 'Airport Flat Rate',
    description: 'Special multiplier for LHR/LGW routes',
    multiplier: 1.2,
    schedule: 'Always',
    timeRange: '24/7'
  },
  {
    name: 'Weekend Peak',
    description: 'Saturday and Sunday daytime rush',
    multiplier: 1.3,
    schedule: 'Sat, Sun',
    timeRange: '08:00 - 20:00'
  }
]);

const handleCreateRule = () => {
  ElMessage.info('Create rule feature coming soon!');
};

const saveBaseConfig = () => {
  ElMessage.success('Base configuration updated successfully!');
};
</script>

<style scoped>
.pricing-page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-table) {
  --el-table-header-bg-color: #f9fafb;
}

:deep(.el-input-number.w-full) {
  width: 100%;
}
</style>
