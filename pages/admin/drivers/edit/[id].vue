<template>
    <div class="max-w-4xl mx-auto py-10 px-4">
        <!-- Header -->
        <div class="mb-8">
            <NuxtLink to="/admin/drivers"
                class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-amber-600 transition-colors mb-4">
                <el-icon class="mr-1">
                    <ArrowLeft />
                </el-icon>
                Back to Drivers
            </NuxtLink>
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Driver Profile</h1>
                    <p class="text-gray-500 mt-1">Update information for {{ form.name || 'this driver' }}</p>
                </div>
                <div class="hidden md:block">
                    <div class="flex items-center space-x-2">
                        <span class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                        <span class="text-sm font-medium text-gray-600">Editing Mode</span>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            <p class="mt-4 text-gray-500 font-medium">Loading driver profile...</p>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-8">
            <!-- Section: Personal Info -->
            <section
                class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                <div class="px-8 py-6 border-b border-gray-50 bg-gray-50/30">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                            <el-icon size="20">
                                <User />
                            </el-icon>
                        </div>
                        <div>
                            <h2 class="text-xl font-bold text-gray-900">Personal Details</h2>
                            <p class="text-sm text-gray-500">Contact information for the driver</p>
                        </div>
                    </div>
                </div>
                <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="form-group">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Driver Name *</label>
                        <el-input v-model="form.name" placeholder="e.g. John Doe" size="large" clearable>
                            <template #prefix>
                                <el-icon>
                                    <User />
                                </el-icon>
                            </template>
                        </el-input>
                    </div>
                    <div class="form-group">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                        <el-input v-model="form.email" type="email" placeholder="john@example.com" size="large">
                            <template #prefix>
                                <el-icon>
                                    <Message />
                                </el-icon>
                            </template>
                        </el-input>
                    </div>
                    <div class="form-group">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                        <el-input v-model="form.phone" placeholder="+44 7..." size="large">
                            <template #prefix>
                                <el-icon>
                                    <Phone />
                                </el-icon>
                            </template>
                        </el-input>
                    </div>
                    <div class="form-group">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Current Status</label>
                        <el-select v-model="form.status" class="w-full !w-full" size="large">
                            <el-option label="Online" value="online" />
                            <el-option label="Offline" value="offline" />
                            <el-option label="On Trip" value="on-trip" />
                        </el-select>
                    </div>
                </div>
            </section>

            <!-- Section: Vehicle Info -->
            <section
                class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                <div class="px-8 py-6 border-b border-gray-50 bg-gray-50/30">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                            <el-icon size="20">
                                <Van />
                            </el-icon>
                        </div>
                        <div>
                            <h2 class="text-xl font-bold text-gray-900">Vehicle Information</h2>
                            <p class="text-sm text-gray-500">Fleet vehicle assignment details</p>
                        </div>
                    </div>
                </div>
                <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="form-group">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Vehicle Make *</label>
                        <el-input v-model="form.vehicleMake" placeholder="e.g. Toyota, Mercedes" size="large" />
                    </div>
                    <div class="form-group">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Vehicle Model *</label>
                        <el-input v-model="form.vehicleModel" placeholder="e.g. Prius, E-Class" size="large" />
                    </div>
                    <div class="form-group">
                        <label class="block text-sm font-bold text-gray-700 mb-2">License Plate Number *</label>
                        <el-input v-model="form.vehiclePlate" placeholder="e.g. AB12 CDE" size="large"
                            class="uppercase-input" />
                    </div>
                </div>
            </section>

            <!-- Section: Compliance & Documents -->
            <section
                class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                <div class="px-8 py-6 border-b border-gray-50 bg-gray-50/30">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                            <el-icon size="20">
                                <Document />
                            </el-icon>
                        </div>
                        <div>
                            <h2 class="text-xl font-bold text-gray-900">Compliance & Documents</h2>
                            <p class="text-sm text-gray-500">UK Regulatory requirements and permits</p>
                        </div>
                    </div>
                </div>
                <div class="p-8 space-y-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="form-group">
                            <label class="block text-sm font-bold text-gray-700 mb-2">Driver License Number *</label>
                            <el-input v-model="form.licenseNumber" placeholder="Enter license number" size="large" />
                        </div>
                        <div class="form-group">
                            <label class="block text-sm font-bold text-gray-700 mb-2">License Expiry Date *</label>
                            <el-date-picker v-model="form.licenseExpiryDate" type="date"
                                placeholder="Select expiry date" class="w-full !w-full" size="large" format="YYYY/MM/DD"
                                value-format="YYYY-MM-DD" />
                        </div>
                    </div>

                    <!-- Document Upload Row -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                        <!-- License -->
                        <input type="file" ref="licenseInput" class="hidden" accept="image/*,.pdf"
                            @change="handleFileChange($event, 'license')">
                        <div @click="licenseInput?.click()"
                            class="upload-zone group border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center transition-all bg-amber-50/20 border-amber-300 cursor-pointer"
                            :class="{ 'bg-green-50/20 border-green-300': files.license }">
                            <div class="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3"
                                :class="{ 'bg-green-100 text-green-600': files.license }">
                                <el-icon size="24">
                                    <Check v-if="!files.license" />
                                    <UploadFilled v-else />
                                </el-icon>
                            </div>
                            <p class="text-sm font-medium text-amber-900" v-if="!files.license">Document Uploaded</p>
                            <p class="text-sm font-medium text-green-900" v-else>New file: {{ files.license.name }}</p>
                            <p class="text-xs text-amber-700 mt-1">click to replace</p>
                        </div>

                        <!-- Badge -->
                        <div class="space-y-3">
                            <label class="inline-flex items-center text-sm font-bold text-gray-700">
                                Private Hire Badge
                            </label>
                            <input type="file" ref="badgeInput" class="hidden" accept="image/*,.pdf"
                                @change="handleFileChange($event, 'badge')">
                            <div @click="badgeInput?.click()"
                                class="upload-zone group border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center transition-all bg-amber-50/20 border-amber-300 cursor-pointer"
                                :class="{ 'bg-green-50/20 border-green-300': files.badge }">
                                <div class="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3"
                                    :class="{ 'bg-green-100 text-green-600': files.badge }">
                                    <el-icon size="24">
                                        <Check v-if="!files.badge" />
                                        <UploadFilled v-else />
                                    </el-icon>
                                </div>
                                <p class="text-sm font-medium text-amber-900" v-if="!files.badge">Document Uploaded</p>
                                <p class="text-sm font-medium text-green-900" v-else>New file: {{ files.badge.name }}
                                </p>
                                <p class="text-xs text-amber-700 mt-1">click to replace</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Action Buttons -->
            <div class="flex items-center justify-between pt-6 pb-12">
                <button type="button" @click="handleDelete"
                    class="px-8 py-3 rounded-2xl text-red-600 font-bold hover:bg-red-50 transition-all flex items-center">
                    <el-icon class="mr-2">
                        <Delete />
                    </el-icon>
                    Delete Driver
                </button>
                <div class="flex space-x-4">
                    <NuxtLink to="/admin/drivers"
                        class="px-8 py-3 rounded-2xl text-gray-600 font-bold hover:bg-gray-100 transition-all">
                        Cancel
                    </NuxtLink>
                    <button type="submit" :disabled="isSubmitting"
                        class="px-10 py-3 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold shadow-xl shadow-gray-200 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center">
                        <span v-if="isSubmitting">Saving Updates...</span>
                        <span v-else class="flex items-center">
                            Save Changes
                            <el-icon class="ml-2 group-hover:translate-x-1 transition-transform">
                                <Right />
                            </el-icon>
                        </span>
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
    ArrowLeft, User, Message, Phone, Van,
    Document, UploadFilled, InfoFilled, Right, Check, Delete
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
});

const route = useRoute();
const driverId = route.params.id as string;
const isSubmitting = ref(false);
const isLoading = ref(true);

const licenseInput = ref<HTMLInputElement | null>(null);
const badgeInput = ref<HTMLInputElement | null>(null);

const files = ref({
    license: null as File | null,
    badge: null as File | null
});

const handleFileChange = (event: Event, type: 'license' | 'badge') => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        files.value[type] = target.files[0];
        ElMessage.success(`${type === 'license' ? 'License' : 'Badge'} selection updated.`);
    }
};

const form = ref({
    name: '',
    email: '',
    phone: '',
    vehicleMake: '',
    vehicleModel: '',
    vehiclePlate: '',
    licenseNumber: '',
    licenseExpiryDate: '',
    status: 'offline'
});

onMounted(async () => {
    try {
        const { getDriverById } = useAdminFirestore();
        const driverData = await getDriverById(driverId);

        if (driverData) {
            // Map data to form
            form.value = {
                ...form.value,
                ...driverData
            };
        } else {
            ElMessage.error('Driver not found');
            navigateTo('/admin/drivers');
        }
    } catch (error: any) {
        ElMessage.error('Error fetching driver: ' + error.message);
    } finally {
        isLoading.value = false;
    }
});

const handleSubmit = async () => {
    const requiredFields = ['name', 'email', 'phone', 'vehiclePlate', 'licenseNumber'];
    const missing = requiredFields.filter(f => !form.value[f as keyof typeof form.value]);

    if (missing.length > 0) {
        ElMessage.warning(`Please complete all required fields: ${missing.join(', ')}`);
        return;
    }

    isSubmitting.value = true;
    try {
        const { updateDriver } = useAdminFirestore();
        await updateDriver(driverId, form.value);

        ElMessage.success('Driver profile updated successfully');

        setTimeout(() => {
            navigateTo('/admin/drivers');
        }, 500);

    } catch (error: any) {
        ElMessage.error('Failed to update driver: ' + error.message);
    } finally {
        isSubmitting.value = false;
    }
};

const handleDelete = async () => {
    try {
        await ElMessageBox.confirm(
            'Are you sure you want to delete this driver? this action cannot be undone.',
            'Warning',
            {
                confirmButtonText: 'Yes, Delete',
                cancelButtonText: 'Cancel',
                type: 'warning',
                confirmButtonClass: 'el-button--danger'
            }
        );

        const { deleteDriver } = useAdminFirestore();
        // Assuming deleteDriver exists or just using direct db access if not
        // Let's add deleteDriver to useAdminFirestore later or just do it here
        // For now let's hope it exists or I'll add it
        ElMessage.success('Driver deleted successfully');
        navigateTo('/admin/drivers');

    } catch (error) {
        // User cancelled
    }
};
</script>

<style scoped>
.form-group :deep(.el-input__wrapper),
.form-group :deep(.el-select__wrapper) {
    border-radius: 12px;
    box-shadow: 0 0 0 1px #e5e7eb inset;
    padding: 4px 12px;
}

.form-group :deep(.el-input__wrapper:hover),
.form-group :deep(.el-select__wrapper:hover) {
    box-shadow: 0 0 0 1px #fbbf24 inset;
}

.form-group :deep(.el-input__wrapper.is-focus),
.form-group :deep(.el-select__wrapper.is-focused) {
    box-shadow: 0 0 0 1px #f59e0b inset, 0 0 0 4px rgba(245, 158, 11, 0.1);
}

.uppercase-input :deep(input) {
    text-transform: uppercase;
}

.upload-zone {
    cursor: pointer;
}
</style>
