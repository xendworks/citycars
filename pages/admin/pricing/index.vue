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
            <Button variant="primary" size="md" class="w-full mt-4" :disabled="savingBase" @click="saveBaseConfig">
              {{ savingBase ? 'Saving...' : 'Save Base Settings' }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Overrides & Rules -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-6 border-bottom border-gray-200 flex justify-between items-center">
            <h2 class="text-xl font-bold">Dynamic Pricing & Overrides</h2>
            <div class="flex gap-2">
              <el-tag type="success">{{ rules.length }} Active Rules</el-tag>
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
                  <el-button size="small" circle icon="Edit" @click="handleEditRule(scope.row)" />
                  <el-button size="small" type="danger" circle icon="Delete" @click="handleDeleteRule(scope.row)" />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- Rule Modal -->
    <Modal v-model="showRuleModal" :title="editingRule ? 'Edit Pricing Rule' : 'Create Pricing Rule'" size="md">
      <div v-if="ruleForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
          <el-input v-model="ruleForm.name" placeholder="e.g. Late Night Surge" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <el-input v-model="ruleForm.description" type="textarea" :rows="2"
            placeholder="Brief explanation of this rule" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Multiplier</label>
          <el-input-number v-model="ruleForm.multiplier" :precision="2" :step="0.1" :min="1" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Schedule (Days)</label>
          <el-select v-model="ruleForm.scheduleType" class="w-full">
            <el-option label="Every day" value="Every day" />
            <el-option label="Weekdays (Mon-Fri)" value="Weekdays" />
            <el-option label="Weekends (Sat-Sun)" value="Weekends" />
            <el-option label="Custom days" value="Custom" />
          </el-select>
        </div>
        <div v-if="ruleForm.scheduleType === 'Custom'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Select Days</label>
          <el-select v-model="ruleForm.customDays" multiple class="w-full" placeholder="Select specific days">
            <el-option label="Monday" value="Mon" />
            <el-option label="Tuesday" value="Tue" />
            <el-option label="Wednesday" value="Wed" />
            <el-option label="Thursday" value="Thu" />
            <el-option label="Friday" value="Fri" />
            <el-option label="Saturday" value="Sat" />
            <el-option label="Sunday" value="Sun" />
          </el-select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
          <el-input v-model="ruleForm.timeRange" placeholder="e.g. 23:00 - 05:00 or 24/7" />
        </div>
      </div>
      <template #footer>
        <div class="flex items-center gap-3 w-full justify-end">
          <Button variant="white" @click="showRuleModal = false">Cancel</Button>
          <Button variant="primary" :loading="savingRule" @click="saveRule">
            {{ editingRule ? 'Update Rule' : 'Create Rule' }}
          </Button>
        </div>
      </template>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal v-model="showDeleteModal" title="Delete Pricing Rule"
      :message="`Are you sure you want to delete the rule '${ruleToDelete?.name}'? This action cannot be undone.`"
      confirmText="Delete Rule" :loading="isDeleting" @confirm="confirmDeleteRule" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Plus, Calendar, Timer, Edit, Delete } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
});

const { getBasePricingConfig, saveBasePricingConfig, getPricingRules, addPricingRule, updatePricingRule, deletePricingRule } = useAdminFirestore();

const loading = ref(true);
const savingBase = ref(false);

const showRuleModal = ref(false);
const savingRule = ref(false);
const editingRule = ref<any>(null);

const showDeleteModal = ref(false);
const ruleToDelete = ref<any>(null);
const isDeleting = ref(false);

const ruleForm = ref({
  name: '',
  description: '',
  multiplier: 1.0,
  scheduleType: 'Every day',
  customDays: [] as string[],
  timeRange: '24/7'
});

const baseConfig = ref({
  minFare: 5.00,
  perMile: 1.80,
  waitingCharge: 0.20
});

const rules = ref<any[]>([]);

const loadData = async () => {
  loading.value = true;
  try {
    const config = await getBasePricingConfig();
    if (config) {
      baseConfig.value = {
        minFare: Number(config.minFare) || 5.00,
        perMile: Number(config.perMile) || 1.80,
        waitingCharge: Number(config.waitingCharge) || 0.20
      };
    }

    // Load rules
    const fetchedRules = await getPricingRules();
    rules.value = fetchedRules.map((r: any) => ({
      ...r,
      // Default mappings if missing
      schedule: r.schedule || 'Every day',
      timeRange: r.timeRange || '24/7'
    }));
  } catch (error) {
    console.error('Error loading pricing data:', error);
    ElMessage.error('Failed to load pricing configuration');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});

const saveBaseConfig = async () => {
  if (savingBase.value) return;
  savingBase.value = true;

  try {
    await saveBasePricingConfig({
      minFare: Number(baseConfig.value.minFare),
      perMile: Number(baseConfig.value.perMile),
      waitingCharge: Number(baseConfig.value.waitingCharge)
    });
    ElMessage.success('Base configuration updated successfully!');
  } catch (error) {
    console.error('Error saving base config:', error);
    ElMessage.error('Failed to save base configuration');
  } finally {
    savingBase.value = false;
  }
};

const handleCreateRule = () => {
  editingRule.value = null;
  ruleForm.value = {
    name: '',
    description: '',
    multiplier: 1.0,
    scheduleType: 'Every day',
    customDays: [],
    timeRange: '24/7'
  };
  showRuleModal.value = true;
};

const handleEditRule = (row: any) => {
  editingRule.value = row;
  ruleForm.value = {
    name: row.name || '',
    description: row.description || '',
    multiplier: Number(row.multiplier) || 1.0,
    scheduleType: row.scheduleType || 'Every day',
    customDays: row.customDays || [],
    timeRange: row.timeRange || '24/7'
  };
  showRuleModal.value = true;
};

const saveRule = async () => {
  if (savingRule.value) return;
  if (!ruleForm.value.name.trim()) {
    ElMessage.warning('Rule Name is required');
    return;
  }

  savingRule.value = true;
  try {
    const finalSchedule = ruleForm.value.scheduleType === 'Custom'
      ? ruleForm.value.customDays.join(', ')
      : ruleForm.value.scheduleType === 'Weekdays' ? 'Mon - Fri'
        : ruleForm.value.scheduleType === 'Weekends' ? 'Sat - Sun'
          : 'Every day';

    const pushData = {
      ...ruleForm.value,
      schedule: finalSchedule,
      scheduleType: ruleForm.value.scheduleType,
      customDays: ruleForm.value.customDays,
      multiplier: Number(ruleForm.value.multiplier)
    };

    if (editingRule.value) {
      await updatePricingRule(editingRule.value.id, pushData);
      ElMessage.success('Rule updated successfully');
    } else {
      await addPricingRule(pushData);
      ElMessage.success('Rule created successfully');
    }

    showRuleModal.value = false;
    // Refresh rules
    const fetchedRules = await getPricingRules();
    rules.value = fetchedRules.map((r: any) => ({
      ...r,
      schedule: r.schedule || 'Every day',
      timeRange: r.timeRange || '24/7'
    }));
  } catch (error) {
    console.error('Error saving rule:', error);
    ElMessage.error('Failed to save rule');
  } finally {
    savingRule.value = false;
  }
};

const handleDeleteRule = (row: any) => {
  ruleToDelete.value = row;
  showDeleteModal.value = true;
};

const confirmDeleteRule = async () => {
  if (!ruleToDelete.value) return;
  isDeleting.value = true;
  try {
    await deletePricingRule(ruleToDelete.value.id);
    ElMessage.success('Rule deleted successfully');
    showDeleteModal.value = false;

    // Refresh rules
    const fetchedRules = await getPricingRules();
    rules.value = fetchedRules.map((r: any) => ({
      ...r,
      schedule: r.schedule || 'Every day',
      timeRange: r.timeRange || '24/7'
    }));
  } catch (error: any) {
    console.error('Error deleting rule:', error);
    ElMessage.error('Failed to delete rule');
  } finally {
    isDeleting.value = false;
  }
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
