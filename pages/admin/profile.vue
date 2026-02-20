<template>
    <div class="profile-wrapper min-h-screen bg-slate-50/50 -m-2">
        <!-- Breadcrumb Header -->
        <div class="bg-white border-b border-slate-200 px-8 py-4">
            <div class="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                <NuxtLink to="/admin" class="hover:text-amber-600 transition-colors">Home</NuxtLink>
                <span>/</span>
                <span class="text-slate-900">Account</span>
                <span>/</span>
                <span class="text-amber-600">Your Profile</span>
            </div>
        </div>

        <div class="p-8 max-w-5xl mx-auto space-y-8">
            <!-- Profile Hero Card -->
            <div class="bg-white rounded-xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                <!-- Abstract Background Element -->
                <div class="absolute -top-24 -right-24 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-50"></div>
                <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

                <div
                    class="relative flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                    <!-- Avatar Section -->
                    <div class="relative group">
                        <div
                            class="w-32 h-32 rounded-3xl bg-slate-900 flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-slate-900/20 transform group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                            <img v-if="adminUser?.photoURL" :src="adminUser.photoURL"
                                class="w-full h-full object-cover" />
                            <span v-else>{{ adminUser?.name?.slice(0, 2).toUpperCase() || 'AD' }}</span>
                        </div>
                        <div
                            class="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-500 rounded-xl border-4 border-white flex items-center justify-center text-white shadow-lg">
                            <el-icon size="16">
                                <CameraFilled />
                            </el-icon>
                        </div>
                    </div>

                    <!-- User Info -->
                    <div class="flex-1 text-center md:text-left space-y-1">
                        <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
                            <h1 class="text-2xl font-black text-slate-900 font-sora tracking-tight">{{ adminUser?.name
                            }}</h1>
                            <span
                                class="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-amber-100 mt-2 md:mt-0 w-fit mx-auto md:mx-0">
                                {{ adminUser?.role?.replace('_', ' ') }}
                            </span>
                        </div>
                        <p class="text-slate-500 font-medium">{{ adminUser?.email }}</p>
                        <div class="flex items-center justify-center md:justify-start space-x-4 mt-6">
                            <div class="text-center md:text-left">
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee ID
                                </p>
                                <p class="text-sm font-bold text-slate-900">#{{ adminUser?.id?.slice(-8).toUpperCase()
                                }}</p>
                            </div>
                            <div class="w-px h-8 bg-slate-100"></div>
                            <div class="text-center md:text-left">
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Status
                                </p>
                                <div class="flex items-center space-x-1.5 mt-0.5">
                                    <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                    <span
                                        class="text-xs font-bold text-emerald-600 uppercase tracking-tight">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="flex flex-col space-y-2">
                        <button @click="isEditing = true"
                            class="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-900/10 active:scale-95">
                            Edit Profile
                        </button>
                        <button @click="handleLogout"
                            class="px-6 py-3 bg-white text-slate-500 border border-slate-200 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Main Form Column -->
                <div class="lg:col-span-2 space-y-8">
                    <div class="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm space-y-8">
                        <h2 class="text-lg font-bold text-slate-900 font-sora tracking-tight flex items-center">
                            <el-icon class="mr-3 text-amber-500">
                                <User />
                            </el-icon>
                            Personal Details
                        </h2>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label
                                    class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Display
                                    Name</label>
                                <el-input v-model="editForm.displayName" :disabled="!isEditing" placeholder="Name"
                                    class="custom-input" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email
                                    Address</label>
                                <el-input v-model="editForm.email" disabled placeholder="Email" class="custom-input" />
                            </div>
                            <div class="space-y-2 md:col-span-2">
                                <label
                                    class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Designation
                                    Role</label>
                                <el-input :model-value="adminUser?.role?.toUpperCase()" disabled class="custom-input" />
                            </div>
                        </div>

                        <div v-if="isEditing" class="flex items-center space-x-4 pt-4">
                            <button @click="saveProfile" :disabled="isSaving"
                                class="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-amber-500/20 hover:bg-amber-600 transition-all active:scale-95 disabled:opacity-50">
                                {{ isSaving ? 'Syncing...' : 'Sync Profile' }}
                            </button>
                            <button @click="isEditing = false"
                                class="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-200 transition-all">
                                Cancel
                            </button>
                        </div>
                    </div>

                    <!-- Security Section -->
                    <div class="bg-white rounded-xl p-8 border border-slate-200 shadow-sm space-y-8">
                        <h2 class="text-lg font-bold text-slate-900 font-sora tracking-tight flex items-center">
                            <el-icon class="mr-3 text-amber-500">
                                <Lock />
                            </el-icon>
                            Security & Authentication
                        </h2>

                        <div class="space-y-4">
                            <div
                                class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                                <div class="flex items-center space-x-4">
                                    <div
                                        class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                                        <el-icon size="20">
                                            <Key />
                                        </el-icon>
                                    </div>
                                    <div>
                                        <p class="text-sm font-bold text-slate-900">Password</p>
                                        <p class="text-[11px] text-slate-500">Last changed 4 months ago</p>
                                    </div>
                                </div>
                                <button
                                    class="px-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
                                    Change
                                </button>
                            </div>

                            <div
                                class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                                <div class="flex items-center space-x-4">
                                    <div
                                        class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
                                        <el-icon size="20">
                                            <Checked />
                                        </el-icon>
                                    </div>
                                    <div>
                                        <p class="text-sm font-bold text-slate-900">Two-Factor Auth</p>
                                        <p class="text-[11px] text-slate-500">Secured via Authenticator App</p>
                                    </div>
                                </div>
                                <el-switch :model-value="true" active-color="#f59e0b" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar Stats Column -->
                <div class="space-y-8">
                    <div class="bg-slate-900 rounded-xl p-8 text-white relative overflow-hidden shadow-sm">
                        <div class="absolute top-0 right-0 p-4 opacity-10">
                            <el-icon size="80">
                                <TrendCharts />
                            </el-icon>
                        </div>
                        <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Activity Snapshot
                        </h3>

                        <div class="space-y-6">
                            <div class="space-y-2">
                                <div
                                    class="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-500">
                                    <span>Shift Efficiency</span>
                                    <span class="text-amber-400">94%</span>
                                </div>
                                <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div class="h-full bg-amber-500 w-[94%]" />
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div class="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                                    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bookings
                                    </p>
                                    <p class="text-xl font-black mt-1">1,204</p>
                                </div>
                                <div class="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                                    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dispatch
                                    </p>
                                    <p class="text-xl font-black mt-1">458</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
                        <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Recent Sessions
                        </h3>
                        <div class="space-y-4">
                            <div v-for="i in 3" :key="i" class="flex items-start space-x-3">
                                <div class="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                                <div>
                                    <p class="text-xs font-bold text-slate-900">London, GB (Chrome / MacOS)</p>
                                    <p class="text-[10px] text-slate-400 font-medium">Synced 2 hours ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
    CameraFilled, User, Lock, Key, Checked,
    TrendCharts, ArrowLeft
} from '@element-plus/icons-vue';
import { useAdminAuth } from '~/composables/useAdminAuth';
import { useFirestore } from '~/composables/useFirestore';
import { ElMessage } from 'element-plus';

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
});

const { adminUser, logoutAdmin } = useAdminAuth();
const { saveUserProfile } = useFirestore();
const router = useRouter();

const isEditing = ref(false);
const isSaving = ref(false);

const editForm = ref({
    displayName: '',
    email: ''
});

onMounted(() => {
    if (adminUser.value) {
        editForm.value.displayName = adminUser.value.name;
        editForm.value.email = adminUser.value.email;
    }
});

const saveProfile = async () => {
    if (!adminUser.value) return;

    isSaving.value = true;
    try {
        await saveUserProfile(adminUser.value.id, {
            email: editForm.value.email,
            displayName: editForm.value.displayName
        });

        ElMessage({
            message: '✓ Profile synchronization complete',
            type: 'success',
            plain: true,
            customClass: 'custom-message'
        });

        isEditing.value = false;
        // Reload page to refresh context
        window.location.reload();
    } catch (error) {
        ElMessage.error('Synchronization failed');
    } finally {
        isSaving.value = false;
    }
};

const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin/login');
};
</script>

<style scoped>
.custom-input :deep(.el-input__wrapper) {
    background-color: #f8fafc !important;
    box-shadow: none !important;
    border: 1px solid #f1f5f9 !important;
    border-radius: 12px !important;
    padding: 8px 16px !important;
    transition: all 0.3s ease;
}

.custom-input :deep(.el-input__wrapper.is-focus) {
    background-color: white !important;
    border-color: #f59e0b !important;
    box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1) !important;
}

:deep(.custom-message) {
    border-radius: 12px;
    background-color: #0f172a !important;
    border: none !important;
}

:deep(.custom-message .el-message__content) {
    color: white !important;
    font-weight: 700;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    letter-spacing: -0.01em;
}
</style>
