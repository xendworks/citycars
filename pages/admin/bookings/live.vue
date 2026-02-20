<template>
    <div class="h-[calc(100vh-100px)] -m-4 overflow-hidden flex bg-slate-50 font-inter">
        <!-- Left Sidebar: Active Orders -->
        <div class="w-[420px] flex flex-col bg-white border-r border-slate-200 shadow-xl z-20">
            <!-- Search & Title -->
            <div class="p-8 border-b border-slate-100 bg-white sticky top-0">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold text-slate-900 tracking-tight font-sora">Active Bookings</h2>
                    <div
                        class="flex items-center space-x-2 bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-100">
                        <span class="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                        <span class="text-[10px] font-bold text-amber-700 uppercase tracking-widest">{{
                            filteredBookings.length }} LIVE</span>
                    </div>
                </div>

                <div class="relative group">
                    <el-input v-model="searchQuery" placeholder="Search reference, name..."
                        class="premium-dispatch-search">
                        <template #prefix>
                            <el-icon class="text-slate-400 group-hover:text-amber-500 transition-colors">
                                <Search />
                            </el-icon>
                        </template>
                    </el-input>
                    <!-- Quick Filters -->
                    <div class="flex space-x-2 mt-4">
                        <button v-for="filter in ['All', 'In Transit', 'Pending']" :key="filter"
                            class="px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                            :class="activeFilter === filter ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'"
                            @click="activeFilter = filter">
                            {{ filter }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Scrollable List -->
            <div v-if="isLoading" class="flex-1 flex items-center justify-center bg-slate-50/50">
                <div class="flex flex-col items-center">
                    <div class="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin">
                    </div>
                    <p class="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Syncing Neural
                        Data...</p>
                </div>
            </div>

            <div v-else-if="filteredBookings.length === 0"
                class="flex-1 flex items-center justify-center p-12 text-center bg-slate-50/50">
                <div>
                    <div
                        class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-slate-200">
                        <el-icon size="40">
                            <Van />
                        </el-icon>
                    </div>
                    <p class="text-slate-900 font-bold font-sora">No active bookings</p>
                    <p class="text-xs text-slate-500 mt-2 leading-relaxed">No bookings are scheduled for this window or
                        match your
                        search filters.</p>
                </div>
            </div>

            <div v-else class="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/10">
                <div v-for="booking in filteredBookings" :key="booking.id" @click="selectBooking(booking)" :class="[
                    'group p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden bg-white',
                    selectedBooking?.id === booking.id
                        ? 'border-amber-600 shadow-[0_20px_40px_-15px_rgba(79,70,229,0.1)] ring-1 ring-amber-600/10'
                        : 'border-slate-100 hover:border-slate-300 hover:shadow-md'
                ]">
                    <!-- Order ID & Status -->
                    <div class="flex justify-between items-start mb-6">
                        <div class="flex flex-col">
                            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">REFERENCE</p>
                            <h3
                                class="text-lg font-bold text-slate-900 font-sora group-hover:text-amber-600 transition-colors uppercase tracking-tight">
                                #{{ booking.bookingReference }}
                            </h3>
                        </div>
                        <div :class="[
                            'px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center shadow-sm',
                            booking.status === 'in-progress' ? 'bg-amber-600 text-white' :
                                booking.status === 'confirmed' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'
                        ]">
                            {{ booking.status }}
                        </div>
                    </div>

                    <!-- Pickup / Dropoff -->
                    <div class="space-y-4 mb-6">
                        <div class="flex items-center space-x-3 text-slate-700">
                            <div
                                class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center leading-none">
                                <el-icon size="14">
                                    <User />
                                </el-icon>
                            </div>
                            <p class="text-sm font-bold font-sora">{{ booking.userName }}</p>
                        </div>

                        <div class="relative pl-8 space-y-5">
                            <div class="absolute left-[13px] top-6 bottom-6 w-px bg-slate-100"></div>
                            <div class="relative">
                                <div
                                    class="absolute -left-[27px] top-1 w-5 h-5 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center shadow-sm">
                                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                </div>
                                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{{
                                    formatTime(booking.pickupDateTime) }} • PICKUP</p>
                                <p class="text-xs font-semibold text-slate-800 leading-snug">{{ booking.pickupAddress }}
                                </p>
                            </div>
                            <div class="relative">
                                <div
                                    class="absolute -left-[27px] top-1 w-5 h-5 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center">
                                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                </div>
                                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                                    DESTINATION</p>
                                <p class="text-xs font-semibold text-slate-800 leading-snug">{{ booking.dropoffAddress
                                    }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="pt-5 border-t border-slate-50 flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div
                                class="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-white text-sm font-sora shadow-sm">
                                {{ booking.driverName?.[0] || '?' }}
                            </div>
                            <div>
                                <p class="text-[13px] font-bold text-slate-900 leading-tight">
                                    {{ booking.driverName || 'Waiting Assignment' }}
                                </p>
                                <div
                                    class="flex items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                                    {{ booking.vehicleType || 'STANDARD' }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Side: Map Engine -->
        <div class="flex-1 relative flex flex-col overflow-hidden bg-slate-100 shadow-inner">
            <div ref="mapContainer" class="absolute inset-0 z-0"></div>

            <div v-if="!mapInstance"
                class="absolute inset-0 bg-slate-50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] flex items-center justify-center">
                <p class="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">Initializing
                    Neural
                    Map...</p>
            </div>

            <!-- Floating UI -->
            <div
                class="absolute top-8 left-8 right-8 flex justify-between items-start pointer-events-none z-10 font-inter">
                <div
                    class="bg-white/90 backdrop-blur-xl border border-white p-2.5 rounded-2xl shadow-2xl flex items-center pr-6 space-x-6 pointer-events-auto">
                    <div
                        class="px-5 py-2.5 bg-slate-900 rounded-xl text-white font-bold text-[10px] tracking-widest uppercase flex items-center shadow-lg font-sora">
                        <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3 animate-pulse"></span>
                        LIVE DISPATCH
                    </div>
                    <div class="flex flex-col">
                        <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                            System Health
                        </p>
                        <p class="text-[11px] font-bold text-slate-900 leading-none">OPERATIONAL • {{
                            activeBookings.length }}
                            ACTIVE</p>
                    </div>
                </div>

                <div class="flex flex-col space-y-2 pointer-events-auto">
                    <button @click="mapInstance?.setZoom(mapInstance.getZoom() + 1)"
                        class="w-10 h-10 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all"><el-icon
                            size="16">
                            <Plus />
                        </el-icon></button>
                    <button @click="mapInstance?.setZoom(mapInstance.getZoom() - 1)"
                        class="w-10 h-10 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all"><el-icon
                            size="16">
                            <Minus />
                        </el-icon></button>
                </div>
            </div>

            <!-- Selection Card -->
            <transition name="el-zoom-in-bottom">
                <div v-if="selectedBooking"
                    class="absolute bottom-10 left-10 right-10 bg-white shadow-2xl rounded-3xl border border-slate-200 p-8 z-20 overflow-hidden font-inter">
                    <div class="relative flex flex-col xl:flex-row justify-between items-center gap-10">
                        <div class="flex items-center space-x-6">
                            <div class="relative">
                                <div
                                    class="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                                    <div v-if="selectedBooking.driverId"
                                        class="w-full h-full bg-slate-900 flex items-center justify-center text-white text-2xl font-bold font-sora">
                                        {{ selectedBooking.driverName?.[0] }}
                                    </div>
                                    <el-icon v-else size="32" class="text-slate-200">
                                        <UserFilled />
                                    </el-icon>
                                </div>
                                <div v-if="selectedBooking.driverId"
                                    class="absolute -bottom-2 -right-2 px-3 py-1 bg-amber-600 text-white text-[9px] font-bold rounded-lg shadow-lg uppercase font-sora tracking-widest">
                                    VERIFIED</div>
                            </div>
                            <div class="text-left">
                                <p
                                    class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-sora">
                                    Assignee Details</p>
                                <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-4 font-sora">
                                    {{ selectedBooking.driverName || 'Needs Assignment' }}
                                </h2>
                                <div class="flex items-center space-x-3">
                                    <span
                                        class="flex items-center text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 italic">
                                        <el-icon class="mr-1.5 text-amber-500">
                                            <StarFilled />
                                        </el-icon> 4.98
                                    </span>
                                    <span
                                        class="flex items-center text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                        <el-icon class="mr-1.5 text-amber-500">
                                            <Calendar />
                                        </el-icon> {{ selectedBooking.totalTrips || 0 }} TRIPS
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-1 items-center justify-start space-x-12 px-12 border-x border-slate-100">
                            <div class="text-left">
                                <p
                                    class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-sora">
                                    Distance</p>
                                <p class="text-2xl font-bold text-slate-900 font-sora">{{ selectedBooking.distance ||
                                    '4.2' }}
                                    <span class="text-sm font-medium text-slate-400">KM</span>
                                </p>
                            </div>
                            <div class="text-left">
                                <p
                                    class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-sora">
                                    Arrival
                                </p>
                                <p class="text-2xl font-bold text-amber-600 font-sora italic">{{ selectedBooking.eta ||
                                    '14' }}
                                    <span class="text-xs font-semibold text-slate-400">MIN</span>
                                </p>
                            </div>
                            <div class="text-left">
                                <p
                                    class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-sora">
                                    Fare
                                </p>
                                <p class="text-2xl font-bold text-slate-900 font-sora italic">£{{
                                    selectedBooking.totalFare }}
                                </p>
                            </div>
                        </div>

                        <div>
                            <el-button @click="navigateTo(`/admin/bookings/${selectedBooking.id}`)"
                                class="!h-16 !px-10 !rounded-xl !bg-slate-900 !border-none !text-white !font-bold uppercase !tracking-widest hover:!bg-black shadow-lg transition-all font-sora text-xs">Manage
                                Booking</el-button>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
    Search, Van, Phone, User, StarFilled,
    Calendar, Plus, Minus, Promotion,
    UserFilled, ChatDotRound
} from '@element-plus/icons-vue';
import { useAdminFirestore } from '~/composables/useAdminFirestore';

definePageMeta({
    layout: 'admin',
    middleware: 'admin',
    title: 'Live Tracking'
});

const { $googleMaps } = useNuxtApp();
const mapContainer = ref<HTMLElement | null>(null);
const mapInstance = ref<any>(null);

const searchQuery = ref('');
const activeFilter = ref('All');
const isLoading = ref(true);
const activeBookings = ref<any[]>([]);
const selectedBooking = ref<any>(null);
let unsubscribe: any = null;

const filteredBookings = computed(() => {
    let filtered = activeBookings.value;

    if (activeFilter.value !== 'All') {
        const status = activeFilter.value.toLowerCase().replace(' ', '-');
        filtered = filtered.filter(b => b.status === status);
    }

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(b =>
            b.bookingReference?.toLowerCase().includes(query) ||
            b.userName?.toLowerCase().includes(query) ||
            b.pickupAddress?.toLowerCase().includes(query)
        );
    }

    return filtered;
});

const formatTime = (date: any) => {
    if (!date) return '00:00';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const selectBooking = (booking: any) => {
    selectedBooking.value = booking;
};

const initMap = async () => {
    if (!mapContainer.value || !($googleMaps as any)) return;

    try {
        const google = await ($googleMaps as any)();
        mapInstance.value = new google.Map(mapContainer.value, {
            center: { lat: 51.5074, lng: -0.1278 }, // London
            zoom: 12,
            disableDefaultUI: true,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            styles: [
                { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#7c93a3" }, { "lightness": "-10" }] },
                { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }] },
                { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }] },
                { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] },
                { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }] },
                { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] },
                { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }] }
            ]
        });
    } catch (error) {
        console.error('Google Maps failed to load:', error);
    }
};

const loadActiveBookings = async () => {
    isLoading.value = true;
    try {
        const { getAllBookings } = useAdminFirestore();
        const all = await getAllBookings();

        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 3600000);
        const oneHourAgo = new Date(now.getTime() - 3600000);

        activeBookings.value = all.filter((b: any) => {
            const bDate = b.pickupDateTime?.toDate ? b.pickupDateTime.toDate() : new Date(b.pickupDateTime);
            const isThisHour = bDate >= oneHourAgo && bDate <= oneHourLater;
            const isActiveStatus = ['confirmed', 'in-progress', 'pending'].includes(b.status);
            return isThisHour || (isActiveStatus && b.status === 'in-progress');
        });

        if (activeBookings.value.length > 0 && !selectedBooking.value) {
            selectedBooking.value = activeBookings.value[0];
        }
    } catch (error) {
        console.error('Failed to load active bookings:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    initMap();

    // Setup real-time listener
    const { listenToActiveBookings } = useAdminFirestore();
    unsubscribe = listenToActiveBookings((bookings) => {
        isLoading.value = false;

        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 3600000);
        const oneHourAgo = new Date(now.getTime() - 3600000);

        activeBookings.value = bookings.filter((b: any) => {
            const bDate = b.pickupDateTime?.toDate ? b.pickupDateTime.toDate() : new Date(b.pickupDateTime);
            const isThisHour = bDate >= oneHourAgo && bDate <= oneHourLater;
            const isActiveStatus = ['confirmed', 'in-progress', 'pending'].includes(b.status);
            return isThisHour || (isActiveStatus && b.status === 'in-progress');
        });

        if (activeBookings.value.length > 0 && !selectedBooking.value) {
            selectedBooking.value = activeBookings.value[0];
        } else if (selectedBooking.value) {
            // Update selected booking if it changed
            const updated = activeBookings.value.find(b => b.id === selectedBooking.value.id);
            if (updated) selectedBooking.value = updated;
        }
    });

    onUnmounted(() => {
        if (unsubscribe) unsubscribe();
    });
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #f1f1f1;
    border-radius: 10px;
}

.premium-dispatch-search :deep(.el-input__wrapper) {
    border-radius: 20px;
    background-color: #f9fafb;
    box-shadow: none !important;
    border: 1px solid #f1f1f1;
    padding: 12px 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.premium-dispatch-search :deep(.el-input__wrapper.is-focus) {
    background-color: white;
    border-color: #fbbf24;
    box-shadow: 0 10px 30px -10px rgba(245, 158, 11, 0.2) !important;
}

.premium-dispatch-search :deep(.el-input__inner) {
    font-weight: 600;
    color: #111827;
}

.animate-fade-in-up {
    animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
