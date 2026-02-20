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
                    <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Add New Driver</h1>
                    <p class="text-gray-500 mt-1">Register a new driver and their vehicle to the fleet.</p>
                </div>
                <div class="hidden md:block">
                    <div class="flex items-center space-x-2">
                        <span class="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></span>
                        <span class="text-sm font-medium text-gray-600">Drafting Profile</span>
                    </div>
                </div>
            </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-8">
            <!-- Section: Personal Info -->
            <section
                class="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
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
                </div>
            </section>

            <!-- Section: Vehicle Info -->
            <section
                class="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
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
                class="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
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
                        <div class="space-y-3">
                            <label class="inline-flex items-center text-sm font-bold text-gray-700">
                                Driver's License (Front)
                                <el-tooltip content="Upload a high-quality scan of the front of the driver's license.">
                                    <el-icon class="ml-1.5 text-gray-400 cursor-pointer">
                                        <InfoFilled />
                                    </el-icon>
                                </el-tooltip>
                            </label>
                            <input type="file" ref="licenseInput" class="hidden" accept="image/*,.pdf"
                                @change="handleFileChange($event, 'license')">
                            <div @click="licenseInput?.click()"
                                class="upload-zone group border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center transition-all hover:border-amber-400 hover:bg-amber-50/30 cursor-pointer"
                                :class="{ 'border-amber-400 bg-amber-50/20': files.license }">
                                <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors"
                                    :class="{ 'bg-amber-100 text-amber-600': files.license }">
                                    <el-icon size="24" v-if="!files.license">
                                        <UploadFilled />
                                    </el-icon>
                                    <el-icon size="24" v-else>
                                        <Check />
                                    </el-icon>
                                </div>
                                <p class="text-sm font-medium text-gray-700">
                                    {{ files.license ? files.license.name : 'Click to upload License' }}
                                </p>
                                <p class="text-xs text-gray-400 mt-1" v-if="!files.license">PNG, JPG or PDF (Max 10MB)
                                </p>
                                <p class="text-xs text-amber-600 mt-1 font-bold" v-else>Click to change file</p>
                            </div>
                        </div>

                        <!-- Badge -->
                        <div class="space-y-3">
                            <label class="inline-flex items-center text-sm font-bold text-gray-700">
                                Private Hire Badge
                                <el-tooltip content="Attach the official Private Hire Vehicle (PHV) driver badge.">
                                    <el-icon class="ml-1.5 text-gray-400 cursor-pointer">
                                        <InfoFilled />
                                    </el-icon>
                                </el-tooltip>
                            </label>
                            <input type="file" ref="badgeInput" class="hidden" accept="image/*,.pdf"
                                @change="handleFileChange($event, 'badge')">
                            <div @click="badgeInput?.click()"
                                class="upload-zone group border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center transition-all hover:border-amber-400 hover:bg-amber-50/30 cursor-pointer"
                                :class="{ 'border-amber-400 bg-amber-50/20': files.badge }">
                                <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors"
                                    :class="{ 'bg-amber-100 text-amber-600': files.badge }">
                                    <el-icon size="24" v-if="!files.badge">
                                        <UploadFilled />
                                    </el-icon>
                                    <el-icon size="24" v-else>
                                        <Check />
                                    </el-icon>
                                </div>
                                <p class="text-sm font-medium text-gray-700">
                                    {{ files.badge ? files.badge.name : 'Click to upload Badge' }}
                                </p>
                                <p class="text-xs text-gray-400 mt-1" v-if="!files.badge">PNG, JPG or PDF (Max 10MB)</p>
                                <p class="text-xs text-amber-600 mt-1 font-bold" v-else>Click to change file</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end space-x-4 pt-6 pb-12">
                <NuxtLink to="/admin/drivers"
                    class="px-8 py-3 rounded-2xl text-gray-600 font-bold hover:bg-gray-100 transition-all">
                    Discard
                </NuxtLink>
                <button type="submit" :disabled="isSubmitting"
                    class="px-10 py-3 bg-gray-900 hover:bg-black text-white rounded-lg font-bold shadow-xl shadow-gray-200 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center">
                    <span v-if="isSubmitting">Saving Profile...</span>
                    <span v-else class="flex items-center">
                        Register Driver
                        <el-icon class="ml-2 group-hover:translate-x-1 transition-transform">
                            <Right />
                        </el-icon>
                    </span>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
    ArrowLeft, User, Message, Phone, Van,
    Document, UploadFilled, InfoFilled, Right, Check
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
});

const isSubmitting = ref(false);
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
        ElMessage.success(`${type === 'license' ? 'License' : 'Badge'} file selected: ${target.files[0].name}`);
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

const handleSubmit = async () => {
    // Simple validation
    const requiredFields = ['name', 'email', 'phone', 'vehiclePlate', 'licenseNumber'];
    const missing = requiredFields.filter(f => !form.value[f as keyof typeof form.value]);

    if (missing.length > 0) {
        ElMessage.warning(`Please complete all required fields: ${missing.join(', ')}`);
        return;
    }

    isSubmitting.value = true;
    try {
        const { addDriver } = useAdminFirestore();
        await addDriver(form.value);

        ElMessage({
            message: '✓ Driver successfully registered to the database.',
            type: 'success',
            duration: 3000
        });

        // Smooth redirect
        setTimeout(() => {
            navigateTo('/admin/drivers');
        }, 500);

    } catch (error: any) {
        console.error('[ADD_DRIVER] Error:', error);
        ElMessage.error('Failed to create driver profile: ' + error.message);
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<style scoped>
.form-group :deep(.el-input__wrapper) {
    border-radius: 12px;
    box-shadow: 0 0 0 1px #e5e7eb inset;
    padding: 4px 12px;
}

.form-group :deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px #fbbf24 inset;
}

.form-group :deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px #f59e0b inset, 0 0 0 4px rgba(245, 158, 11, 0.1);
}

.uppercase-input :deep(input) {
    text-transform: uppercase;
}

.upload-zone:hover {
    background-image: radial-gradient(circle at center, rgba(251, 191, 36, 0.05) 0%, transparent 100%);
}
</style>
