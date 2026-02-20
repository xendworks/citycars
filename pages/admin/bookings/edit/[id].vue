<template>
    <div class="edit-booking-wrapper min-h-screen bg-slate-50/50 -m-2">
        <!-- Breadcrumb Header -->
        <div
            class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 px-8 py-4 sticky top-0 z-20 transition-colors">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    <NuxtLink to="/admin" class="hover:text-amber-600 transition-colors">Home</NuxtLink>
                    <span>/</span>
                    <NuxtLink to="/admin/bookings" class="hover:text-amber-600 transition-colors">Bookings</NuxtLink>
                    <span>/</span>
                    <span class="text-slate-900 dark:text-white transition-colors">Edit #{{ booking?.bookingReference
                        }}</span>
                </div>

                <div class="flex items-center space-x-3">
                    <button @click="router.back()"
                        class="px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                        Cancel
                    </button>
                    <button @click="handleUpdate" :disabled="isSaving"
                        class="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-900/10 disabled:opacity-50 flex items-center space-x-2">
                        <el-icon v-if="isSaving" class="animate-spin">
                            <Loading />
                        </el-icon>
                        <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="p-8 max-w-6xl mx-auto space-y-8 pb-20">
            <AdminLoader v-if="isLoading" full-screen text="Refining Job Data..." />

            <div v-if="booking" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Main Form Column -->
                <div class="lg:col-span-2 space-y-8">
                    <!-- Route Details Section -->
                    <div
                        class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/5 shadow-sm space-y-8 relative overflow-hidden transition-colors">
                        <div
                            class="absolute -top-12 -right-12 w-32 h-32 bg-amber-50 dark:bg-amber-500/5 rounded-full blur-3xl opacity-50">
                        </div>

                        <h2
                            class="text-sm font-black text-slate-900 dark:text-white font-sora uppercase tracking-[0.2em] flex items-center transition-colors">
                            <span
                                class="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center mr-3 shadow-lg shadow-amber-500/20">
                                <el-icon>
                                    <Location />
                                </el-icon>
                            </span>
                            Route Intelligence
                        </h2>

                        <div class="space-y-6">
                            <div class="space-y-2">
                                <label
                                    class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Pickup
                                    Address</label>
                                <el-input v-model="form.pickupAddress" placeholder="Enter pickup location"
                                    class="custom-input" size="large">
                                    <template #prefix><el-icon class="text-blue-500">
                                            <LocationFilled />
                                        </el-icon></template>
                                </el-input>
                            </div>

                            <div class="space-y-2">
                                <label
                                    class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Dropoff
                                    Address</label>
                                <el-input v-model="form.dropoffAddress" placeholder="Enter dropoff location"
                                    class="custom-input" size="large">
                                    <template #prefix><el-icon class="text-red-500">
                                            <LocationFilled />
                                        </el-icon></template>
                                </el-input>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-2">
                                    <label
                                        class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Booking
                                        Date & Time</label>
                                    <el-date-picker v-model="form.pickupDateTime" type="datetime"
                                        placeholder="Select date and time" format="DD/MM/YYYY HH:mm"
                                        value-format="YYYY-MM-DDTHH:mm:ss" class="!w-full custom-date-picker"
                                        size="large" />
                                </div>
                                <div class="space-y-2">
                                    <label
                                        class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cab
                                        Category</label>
                                    <el-select v-model="form.cabType" class="!w-full custom-select" size="large">
                                        <el-option label="Saloon" value="Saloon" />
                                        <el-option label="Estate" value="Estate" />
                                        <el-option label="MPV" value="MPV" />
                                        <el-option label="MPV Plus" value="MPV Plus" />
                                        <el-option label="Executive" value="Executive" />
                                    </el-select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Passenger Details Section -->
                    <div class="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm space-y-8">
                        <h2
                            class="text-sm font-black text-slate-900 font-sora uppercase tracking-[0.2em] flex items-center">
                            <span
                                class="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center mr-3 shadow-lg shadow-slate-900/20">
                                <el-icon>
                                    <User />
                                </el-icon>
                            </span>
                            Passenger Manifest
                        </h2>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label
                                    class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Display
                                    Name</label>
                                <el-input v-model="form.userName" placeholder="Full name" class="custom-input"
                                    size="large" />
                            </div>
                            <div class="space-y-2">
                                <label
                                    class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contact
                                    Phone</label>
                                <el-input v-model="form.userPhone" placeholder="Mobile number" class="custom-input"
                                    size="large">
                                    <template #prefix><el-icon>
                                            <Phone />
                                        </el-icon></template>
                                </el-input>
                            </div>
                            <div class="space-y-2 md:col-span-2">
                                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email
                                    Address</label>
                                <el-input v-model="form.userEmail" placeholder="Email (Read-only)" disabled
                                    class="custom-input" size="large" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar Actions/Stats Column -->
                <div class="space-y-8">
                    <!-- Commercials Card -->
                    <div class="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                        <div class="absolute top-0 right-0 p-4 opacity-10">
                            <el-icon size="80">
                                <TrendCharts />
                            </el-icon>
                        </div>
                        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Financial Hub
                        </h3>

                        <div class="space-y-6">
                            <div class="space-y-2">
                                <label
                                    class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Adjusted
                                    Fare
                                    (£)</label>
                                <div class="relative">
                                    <span
                                        class="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 font-black">£</span>
                                    <el-input-number v-model="form.totalFare" :precision="2" :step="1" :min="0"
                                        class="!w-full fare-input" controls-position="right" />
                                </div>
                            </div>

                            <div class="pt-4 border-t border-white/5">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Base
                                        Rate</span>
                                    <span class="text-xs font-bold">£{{ (form.totalFare * 0.8).toFixed(2) }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span
                                        class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Platform
                                        (20%)</span>
                                    <span class="text-xs font-bold text-amber-500">£{{ (form.totalFare * 0.2).toFixed(2)
                                    }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Status Control Card -->
                    <div class="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm space-y-6">
                        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">System Status
                        </h3>

                        <el-select v-model="form.status" class="!w-full status-select" size="large">
                            <el-option label="Pending" value="pending" />
                            <el-option label="Confirmed" value="confirmed" />
                            <el-option label="In Progress" value="in-progress" />
                            <el-option label="Completed" value="completed" />
                            <el-option label="Cancelled" value="cancelled" />
                        </el-select>

                        <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Last Update
                            </p>
                            <p class="text-[11px] font-bold text-slate-700">{{ booking?.updatedAt ? new
                                Date(booking.updatedAt).toLocaleString() : 'Just now' }}</p>
                        </div>
                    </div>

                    <!-- Danger Zone -->
                    <div class="bg-red-50 rounded-[2.5rem] p-8 border border-red-100 space-y-4">
                        <h3 class="text-[10px] font-black text-red-600/60 uppercase tracking-[0.2em]">Danger Zone</h3>
                        <button @click="handleDelete"
                            class="w-full py-4 bg-white text-red-600 border border-red-200 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95">
                            Permanent Purge
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
    Location, LocationFilled, User, Phone,
    TrendCharts, Loading, Calendar, Money
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
});

const route = useRoute();
const router = useRouter();
const bookingId = route.params.id as string;

const isLoading = ref(true);
const isSaving = ref(false);
const booking = ref<any>(null);

const form = ref({
    pickupAddress: '',
    dropoffAddress: '',
    pickupDateTime: '',
    cabType: '',
    userName: '',
    userPhone: '',
    userEmail: '',
    totalFare: 0,
    status: 'pending'
});

onMounted(async () => {
    await loadBooking();
});

const loadBooking = async () => {
    isLoading.value = true;
    try {
        const { $firebase } = useNuxtApp();
        const { getFirestore, doc, getDoc } = await import('firebase/firestore');
        const db = getFirestore($firebase as any);
        const docRef = doc(db, 'bookings', bookingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            booking.value = { id: docSnap.id, ...docSnap.data() };
            // Populate form
            form.value = {
                pickupAddress: booking.value.pickupAddress || '',
                dropoffAddress: booking.value.dropoffAddress || '',
                pickupDateTime: booking.value.pickupDateTime || '',
                cabType: booking.value.cabType || 'Saloon',
                userName: booking.value.userName || '',
                userPhone: booking.value.userPhone || '',
                userEmail: booking.value.userEmail || '',
                totalFare: booking.value.totalFare || 0,
                status: booking.value.status || 'pending'
            };
        } else {
            ElMessage.error('Job index not found in Ledger');
            router.push('/admin/bookings');
        }
    } catch (err) {
        console.error('Error loading booking:', err);
        ElMessage.error('Critical sync failure');
    } finally {
        isLoading.value = false;
    }
};

const handleUpdate = async () => {
    isSaving.value = true;
    try {
        const { $firebase } = useNuxtApp();
        const { getFirestore, doc, updateDoc, Timestamp } = await import('firebase/firestore');
        const db = getFirestore($firebase as any);
        const docRef = doc(db, 'bookings', bookingId);

        await updateDoc(docRef, {
            ...form.value,
            updatedAt: new Date().toISOString()
        });

        ElMessage.success('Job parameters updated successfully');
        router.push(`/admin/bookings/${bookingId}`);
    } catch (err) {
        console.error('Update failed:', err);
        ElMessage.error('Failed to sync changes to ledger');
    } finally {
        isSaving.value = false;
    }
};

const handleDelete = () => {
    ElMessageBox.confirm(
        'This action is irreversible and will purge this booking from the fleet records. Are you sure?',
        'DANGER: PERMANENT PURGE',
        {
            confirmButtonText: 'PURGE RECORD',
            cancelButtonText: 'ABORT',
            type: 'error',
            confirmButtonClass: 'el-button--danger'
        }
    ).then(async () => {
        try {
            const { $firebase } = useNuxtApp();
            const { getFirestore, doc, deleteDoc } = await import('firebase/firestore');
            const db = getFirestore($firebase as any);
            await deleteDoc(doc(db, 'bookings', bookingId));
            ElMessage.warning('Booking purged from system');
            router.push('/admin/bookings');
        } catch (err) {
            ElMessage.error('Purge failure');
        }
    });
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.custom-input :deep(.el-input__wrapper),
.custom-select :deep(.el-input__wrapper),
.custom-date-picker :deep(.el-input__wrapper) {
    background-color: #f8fafc !important;
    box-shadow: none !important;
    border: 1px solid #f1f5f9 !important;
    border-radius: 12px !important;
    padding: 8px 16px !important;
    transition: all 0.3s ease;
}

.custom-input :deep(.el-input__wrapper.is-focus),
.custom-select :deep(.el-input__wrapper.is-focus),
.custom-date-picker :deep(.el-input__wrapper.is-focus) {
    background-color: white !important;
    border-color: #f59e0b !important;
    box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1) !important;
}

.status-select :deep(.el-input__wrapper) {
    background-color: #f8fafc !important;
    border-radius: 16px !important;
    padding: 12px 20px !important;
    border: 2px solid #f1f5f9 !important;
}

.fare-input :deep(.el-input__wrapper) {
    background-color: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 16px !important;
    padding-left: 32px !important;
}

.fare-input :deep(.el-input__inner) {
    color: white !important;
    font-weight: 800 !important;
    font-size: 1.25rem !important;
}

.fare-input :deep(.el-input-number__increase),
.fare-input :deep(.el-input-number__decrease) {
    background: rgba(255, 255, 255, 0.1) !important;
    border-left: 1px solid rgba(255, 255, 255, 0.1) !important;
    color: white !important;
}

.dark .custom-input :deep(.el-input__wrapper),
.dark .custom-select :deep(.el-input__wrapper),
.dark .custom-date-picker :deep(.el-input__wrapper),
.dark .status-select :deep(.el-input__wrapper) {
    background-color: #0f172a !important;
    border-color: rgba(255, 255, 255, 0.1) !important;
}

.dark .custom-input :deep(.el-input__inner),
.dark .custom-select :deep(.el-input__inner),
.dark .custom-date-picker :deep(.el-input__inner),
.dark .status-select :deep(.el-input__inner) {
    color: #f1f5f9 !important;
}

.dark .custom-input :deep(.el-input__wrapper.is-focus),
.dark .custom-select :deep(.el-input__wrapper.is-focus),
.dark .custom-date-picker :deep(.el-input__wrapper.is-focus) {
    background-color: #1e293b !important;
    border-color: #f59e0b !important;
}
</style>
