<template>
  <div class="px-8 py-6 space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight font-sora">Executive Authority</h1>
        <p class="text-slate-500 text-sm mt-1">Manage administrative access and system privileges.</p>
      </div>
      <button @click="prepareNewUser"
        class="px-6 py-3 bg-slate-950 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center space-x-2">
        <el-icon>
          <Plus />
        </el-icon>
        <span>Onboard Admin</span>
      </button>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
      <AdminLoader v-if="isLoading" size="sm" text="Syncing Authority Ledger..."
        class="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm" />

      <el-table :data="users" stripe style="width: 100%" class="admin-table">
        <el-table-column label="ADMINISTRATOR" min-width="300">
          <template #default="scope">
            <div class="flex items-center space-x-4 py-2" v-if="scope?.row">
              <div
                class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold overflow-hidden shadow-inner uppercase">
                <img v-if="scope.row.photoURL" :src="scope.row.photoURL" class="w-full h-full object-cover" />
                <span v-else>{{ getInitials(scope.row.displayName) }}</span>
              </div>
              <div>
                <div class="font-bold text-slate-900 font-sora">{{ scope.row.displayName || 'Guest Administrator' }}
                </div>
                <div class="text-[11px] text-slate-400 font-medium">{{ scope.row.email }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="role" label="DESIGNATION" width="200">
          <template #default="scope">
            <div class="flex items-center" v-if="scope?.row">
              <span :class="[
                'px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border',
                getRoleClass(scope.row.role)
              ]">
                {{ scope.row.role?.replace('_', ' ') || 'No Role' }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="JOINED" width="200">
          <template #default="scope">
            <div class="text-xs font-bold text-slate-500 font-sora" v-if="scope?.row">
              {{ formatDate(scope.row.createdAt) }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="ACTIONS" width="150" align="right">
          <template #default="scope">
            <div class="flex justify-end space-x-2" v-if="scope?.row">
              <el-button @click="handleEdit(scope.row)" circle size="small" class="!bg-slate-50 !border-slate-100">
                <el-icon>
                  <Edit />
                </el-icon>
              </el-button>
              <el-button @click="handleDelete(scope.row)" circle size="small" type="danger" plain>
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>

        <template #empty>
          <div class="py-20 text-center">
            <el-empty description="No administrative staff found." />
          </div>
        </template>
      </el-table>
    </div>

    <!-- Onboarding Modal -->
    <Modal v-model="showAddModal" :title="isEditing ? 'Revise Authority' : 'Onboard New Administrator'" size="md">
      <div class="space-y-6 py-4">
        <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Display Name</label>
          <el-input v-model="form.displayName" placeholder="e.g. John Doe" class="custom-input" />
        </div>
        <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Login Email</label>
          <el-input v-model="form.email" placeholder="john@citycars.com" :disabled="isEditing" class="custom-input" />
        </div>
        <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Assign Role</label>
          <el-select v-model="form.role" class="w-full custom-select" placeholder="Select Role">
            <el-option v-for="role in rolesMaster" :key="role.id" :label="role.id.toUpperCase().replace('_', ' ')"
              :value="role.id" />
          </el-select>
          <p class="text-[10px] text-slate-400 mt-2 italic">* User will gain access permissions defined in Settings >
            Authority.</p>
        </div>
      </div>
      <template #footer>
        <div class="flex space-x-3 w-full">
          <Button variant="white" @click="showAddModal = false" class="flex-1">Cancel</Button>
          <Button variant="primary" @click="submitForm" :loading="isSubmitting"
            class="flex-1 !bg-slate-950 !border-slate-950">
            {{ isEditing ? 'Update Credentials' : 'Commit Onboarding' }}
          </Button>
        </div>
      </template>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal v-model="showDeleteModal" title="Critical Action"
      :message="`Revoke all privileges for ${userToDelete?.displayName}?`" confirmText="Revoke Access"
      :loading="isDeleting" @confirm="confirmDelete" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Plus, Edit, Delete } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
});

const { getAllUsers, upsertAdminUser, getAllRoles } = useAdminFirestore();

const users = ref<any[]>([]);
const rolesMaster = ref<any[]>([]);
const isLoading = ref(true);
const isSubmitting = ref(false);
const showAddModal = ref(false);
const isEditing = ref(false);

const showDeleteModal = ref(false);
const userToDelete = ref<any>(null);
const isDeleting = ref(false);

const form = ref({
  id: '',
  displayName: '',
  email: '',
  role: ''
});

const getInitials = (name: string) => {
  if (!name) return 'AD';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const getRoleClass = (role: string) => {
  switch (role) {
    case 'super_admin': return 'bg-red-50 text-red-600 border-red-100';
    case 'admin': return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'manager': return 'bg-blue-50 text-blue-600 border-blue-100';
    default: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  }
};

const formatDate = (date: any) => {
  if (!date) return 'N/A';
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const loadData = async () => {
  isLoading.value = true;
  try {
    const [allUsers, allRoles] = await Promise.all([
      getAllUsers(),
      getAllRoles()
    ]);

    // Default roles if Firestore empty
    rolesMaster.value = allRoles.length > 0 ? allRoles : [
      { id: 'admin' }, { id: 'manager' }, { id: 'operator' }
    ];

    users.value = allUsers.filter((u: any) => u.role);
  } catch (err) {
    ElMessage.error('Failed to sync management pool.');
  } finally {
    isLoading.value = false;
  }
};

const prepareNewUser = () => {
  isEditing.value = false;
  form.value = { id: '', displayName: '', email: '', role: '' };
  showAddModal.value = true;
};

const handleEdit = (user: any) => {
  isEditing.value = true;
  form.value = {
    id: user.id,
    displayName: user.displayName || '',
    email: user.email || '',
    role: user.role || ''
  };
  showAddModal.value = true;
};

const submitForm = async () => {
  if (!form.value.email || !form.value.role) {
    ElMessage.warning('Email and Designation are mandatory.');
    return;
  }

  isSubmitting.value = true;
  try {
    await upsertAdminUser(form.value.id || null, {
      displayName: form.value.displayName,
      email: form.value.email,
      role: form.value.role
    });

    ElMessage.success(isEditing.value ? 'Authority revised successfully.' : 'New administrator onboarded.');
    showAddModal.value = false;
    await loadData();
  } catch (err) {
    ElMessage.error('Failed to commit changes.');
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = (user: any) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!userToDelete.value) return;
  isDeleting.value = true;
  try {
    await upsertAdminUser(userToDelete.value.id, { role: null });
    ElMessage.success('Privileges revoked.');
    showDeleteModal.value = false;
    await loadData();
  } catch (err) {
    ElMessage.error('Failed to revoke privileges.');
  } finally {
    isDeleting.value = false;
  }
};

onMounted(loadData);
</script>