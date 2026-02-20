<template>
    <div class="h-[calc(100vh-89px)] -m-2 bg-white flex flex-col overflow-hidden">
        <!-- Booking Summary Panel -->
        <div class="bg-white px-2 py-3 border-b border-gray-100 relative z-10 shadow-sm">
            <div v-if="isLoading" class="flex justify-center py-4">
                <div class="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div v-else-if="booking" class="flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
                <button @click="navigateTo('/admin/bookings')"
                    class="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-all shrink-0">
                    <el-icon size="20">
                        <Close />
                    </el-icon>
                </button>

                <!-- 1. Identity -->
                <div class="shrink-0 border-r border-gray-100 pr-6">
                    <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">#TripID</p>
                    <div class="flex items-center space-x-2">
                        <span class="text-sm font-bold text-gray-900">{{ booking.bookingReference }}</span>
                        <span
                            class="px-1.5 py-0.5 bg-amber-50 text-amber-600 text-[8px] font-black uppercase rounded border border-amber-100">{{
                                booking.status || `Pending` }}</span>
                    </div>
                </div>

                <!-- 2. Commercials -->
                <div class="shrink-0 border-r border-gray-100 pr-6">
                    <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Fare</p>
                    <div class="flex items-center space-x-3">
                        <span class="text-base font-black text-gray-900">£{{ booking.totalFare }}</span>
                    </div>
                </div>

                <!-- 3. Stats -->
                <div class="shrink-0 border-r border-gray-100 pr-6">
                    <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Journey Statistics</p>
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center space-x-2">
                            <span class="text-sm font-bold text-gray-900">{{ booking.displayMiles ||
                                booking.totalDistance || `---` }}</span>
                            <span class="text-[9px] font-bold text-gray-400 uppercase">Miles</span>
                        </div>
                        <div class="w-1 h-1 bg-gray-200 rounded-full"></div>
                        <div class="flex items-center space-x-2">
                            <span class="text-sm font-bold text-gray-900">{{ booking.displayTime ||
                                booking.totalDuration || `---` }}</span>
                            <span class="text-[9px] font-bold text-gray-400 uppercase">Est</span>
                        </div>
                    </div>
                </div>

                <!-- 4. Client -->
                <div class="shrink-0 border-r border-gray-100 pr-6">
                    <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Passenger</p>
                    <p class="text-sm font-bold text-gray-900 leading-tight">{{ booking.userName }}</p>
                    <div class="flex items-center space-x-1 text-gray-400 mt-0.5">
                        <el-icon size="10">
                            <Phone />
                        </el-icon>
                        <span class="text-[10px] font-bold">{{ booking.userPhone }}</span>
                    </div>
                </div>

                <!-- 5. Driver -->
                <div class="shrink-0 border-r border-gray-100 pr-6">
                    <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Assigned Driver</p>
                    <p class="text-sm font-bold text-gray-900 leading-tight uppercase">{{ booking.driverName || `Not
                        Assigned` }}</p>
                    <div class="flex items-center space-x-1 text-gray-400 mt-0.5" v-if="booking.driverPhone">
                        <el-icon size="10">
                            <Phone />
                        </el-icon>
                        <span class="text-[10px] font-bold">{{ booking.driverPhone || `N/A`
                        }}</span>
                    </div>
                </div>

                <!-- 6. Vehicle -->
                <div class="shrink-0 border-r border-gray-100 pr-6 text-center">
                    <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Vehicle Type</p>
                    <div class="flex items-center justify-center space-x-2">
                        <img :src="vImage" class="h-6 w-auto object-contain" :alt="booking.cabType" />
                        <span class="text-sm font-bold text-gray-900 uppercase">{{ booking.cabType || `Saloon` }}</span>
                    </div>
                </div>

                <!-- Actions Logic -->
            </div>
        </div>
        <!-- Main Map/Visual Area -->
        <div class="flex-1 relative bg-gray-50 overflow-hidden">
            <!-- Google Map Container -->
            <div ref="mapContainer" class="absolute inset-0 z-0"></div>

            <!-- Fallback Grid Overlay -->
            <div v-if="!mapInstance"
                class="absolute inset-0 bg-[#f4f7f6] bg-[radial-gradient(#d1d5db_0.75px,transparent_0.75px)] [background-size:24px_24px] pointer-events-none opacity-40">
            </div>

            <!-- High-Density Information Overlay -->
            <div v-if="booking" class="absolute top-6 left-6 z-10">
                <div
                    class="bg-white/95 backdrop-blur-md rounded-[32px] shadow-2xl border border-white/50 w-72 p-6 animate-fade-in-up">
                    <!-- Schedule Intelligence -->
                    <div class="mb-6 flex items-center justify-between border-b border-gray-50 pb-5">
                        <div class="space-y-0.5">
                            <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Pick-up At</p>
                            <div class="flex items-baseline space-x-2">
                                <span class="text-base font-black text-gray-900">{{ pickupTime }}</span>
                                <span class="text-[10px] font-bold text-gray-400">{{ pickupDate }}</span>
                            </div>
                        </div>
                        <span v-if="timeUntil"
                            class="text-[9px] font-black text-blue-600 uppercase bg-blue-50/50 px-2.5 py-1 rounded-xl border border-blue-100/50">
                            {{ timeUntil }}
                        </span>
                    </div>

                    <!-- Core Route Intelligence -->
                    <div class="space-y-6 relative">
                        <div
                            class="absolute left-[5px] top-[14px] bottom-[10px] w-px border-l border-dashed border-gray-200">
                        </div>

                        <div class="flex items-start space-x-4">
                            <div class="w-3 h-3 rounded-full bg-blue-500 mt-1 ring-4 ring-blue-50 shrink-0"></div>
                            <div>
                                <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Pickup
                                    Point
                                </p>
                                <p class="text-[11px] font-bold text-gray-800 leading-relaxed">{{ booking.pickupAddress
                                    }}</p>
                            </div>
                        </div>

                        <div class="flex items-start space-x-4">
                            <div class="w-3 h-3 rounded-full bg-red-500 mt-1 ring-4 ring-red-50 shrink-0"></div>
                            <div>
                                <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Dropoff
                                    Point</p>
                                <p class="text-[11px] font-bold text-gray-800 leading-relaxed">{{ booking.dropoffAddress
                                    }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Supplemental Info Tags -->
                    <div v-if="booking.flightNumber || booking.specialInstructions"
                        class="mt-6 pt-6 border-t border-gray-50 space-y-4">
                        <div v-if="booking.flightNumber" class="flex items-center justify-between">
                            <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Flight
                                Reference</span>
                            <span
                                class="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black rounded uppercase border border-blue-100">{{
                                    booking.flightNumber }}</span>
                        </div>
                        <div v-if="booking.specialInstructions"
                            class="bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                            <p class="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1.5">Driver
                                Notes
                            </p>
                            <p class="text-[10px] font-bold text-amber-900 leading-relaxed italic line-clamp-3">"{{
                                booking.specialInstructions }}"</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Floating Navigation Snackbar -->
            <div v-if="booking" class="absolute bottom-1 left-1 -translate-x-1/2 z-20 animate-fade-in-up">
                <div
                    class="bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-100 p-2 flex items-center gap-3">
                    <span class="isolate inline-flex rounded-lg shadow-sm bg-gray-100 border border-gray-100">
                        <button @click="navToPrev" type="button" :disabled="!prevBookingId"
                            :class="[!prevBookingId ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50 hover:text-gray-900 active:scale-95']"
                            class="relative inline-flex items-center rounded-l-xl bg-white px-3 py-2.5 text-gray-400 border-r border-gray-50 transition-all">
                            <span class="sr-only">Previous</span>
                            <ChevronLeftIcon class="w-5 h-5" aria-hidden="true" />
                        </button>
                        <button @click="navToNext" type="button" :disabled="!nextBookingId"
                            :class="[!nextBookingId ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50 hover:text-gray-900 active:scale-95']"
                            class="relative -ml-px inline-flex items-center rounded-r-xl bg-white px-3 py-2.5 text-gray-400 transition-all">
                            <span class="sr-only">Next</span>
                            <ChevronRightIcon class="w-5 h-5" aria-hidden="true" />
                        </button>
                    </span>

                    <div class="h-8 w-px bg-gray-100 mx-1"></div>

                    <button @click="navigateTo(`/admin/bookings/edit/${bookingId}`)"
                        class="bg-gray-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-black transition-all active:scale-95">
                        Edit Job
                    </button>
                </div>
            </div>

            <!-- Interactive Control Overlay -->
            <div class="absolute bottom-10 right-10 flex flex-col space-y-4 pointer-events-auto">
                <button @click="mapInstance?.setZoom(mapInstance.getZoom() + 1)"
                    class="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-gray-800 hover:bg-red-600 hover:text-white transition-all border border-gray-100"><el-icon
                        size="20">
                        <Plus />
                    </el-icon></button>
                <button @click="mapInstance?.setZoom(mapInstance.getZoom() - 1)"
                    class="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-gray-800 hover:bg-red-600 hover:text-white transition-all border border-gray-100"><el-icon
                        size="20">
                        <Minus />
                    </el-icon></button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getVehicleImage } from '~/utils/vehicles';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
    WarningFilled, Close, Phone, Search,
    Plus, Minus, LocationFilled, Van, Calendar, Clock
} from '@element-plus/icons-vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid';

dayjs.extend(relativeTime);

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
});

const { $googleMaps } = useNuxtApp();
const route = useRoute();
const bookingId = computed(() => route.params.id as string);
const isLoading = ref(true);
const booking = ref<any>(null);
const mapContainer = ref<HTMLElement | null>(null);
const mapInstance = ref<any>(null);
const directionsService = ref<any>(null);
const directionsRenderer = ref<any>(null);
const nextBookingId = ref<string | null>(null);
const prevBookingId = ref<string | null>(null);

// Scheduling Computeds
const pickupDate = computed(() => {
    if (!booking.value?.pickupDateTime) return '---';
    return dayjs(booking.value.pickupDateTime).format('DD MMM YYYY');
});

const pickupTime = computed(() => {
    if (!booking.value?.pickupDateTime) return '---';
    return dayjs(booking.value.pickupDateTime).format('HH:mm');
});

const timeUntil = computed(() => {
    if (!booking.value?.pickupDateTime) return '';
    const diff = dayjs(booking.value.pickupDateTime).diff(dayjs(), 'hour');
    if (diff < 0) return 'Already started';
    if (diff < 1) return 'Starting soon';
    return `In ${diff} hours`;
});

const vImage = computed(() => getVehicleImage(booking.value?.cabType));

const initMap = async () => {
    if (!mapContainer.value || !($googleMaps as any)) return;

    try {
        const maps = await ($googleMaps as any)();

        // Initialize Services
        directionsService.value = new maps.DirectionsService();
        directionsRenderer.value = new maps.DirectionsRenderer({
            suppressMarkers: false,
            polylineOptions: {
                strokeColor: '#f59e0b',
                strokeWeight: 5,
                strokeOpacity: 0.8
            },
            markerOptions: {
                animation: maps.Animation.DROP
            }
        });

        mapInstance.value = new maps.Map(mapContainer.value, {
            center: { lat: 51.5074, lng: -0.1278 }, // London
            zoom: 13,
            disableDefaultUI: true,
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

        directionsRenderer.value.setMap(mapInstance.value);

        // If booking already loaded, render route immediately
        if (booking.value) {
            calculateAndDisplayRoute();
        }
    } catch (error) {
        console.error('Map init failed:', error);
    }
};

const calculateAndDisplayRoute = async () => {
    if (!directionsService.value || !booking.value) return;

    const maps = await ($googleMaps as any)();
    const origin = booking.value.pickupAddress;
    const destination = booking.value.dropoffAddress;

    if (!origin || !destination) return;

    directionsService.value.route(
        {
            origin: origin,
            destination: destination,
            travelMode: maps.TravelMode.DRIVING,
        },
        (response: any, status: string) => {
            if (status === 'OK') {
                directionsRenderer.value.setDirections(response);

                // If miles/time not in DB, we can extract from response
                if (!booking.value.totalDistance && response.routes[0].legs[0].distance) {
                    booking.value.displayMiles = response.routes[0].legs[0].distance.text;
                }
                if (!booking.value.totalDuration && response.routes[0].legs[0].duration) {
                    booking.value.displayTime = response.routes[0].legs[0].duration.text;
                }
            } else {
                console.error('Directions request failed due to ' + status);
            }
        }
    );
};

const loadBookingDetails = async () => {
    isLoading.value = true;
    try {
        const { $firebase } = useNuxtApp();
        const { getFirestore, doc, getDoc, query, collection, orderBy, startAfter, endBefore, limit, getDocs, limitToLast } = await import('firebase/firestore');
        const db = getFirestore($firebase as any);
        const docRef = doc(db, 'bookings', bookingId.value);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            booking.value = { id: docSnap.id, ...docSnap.data() };

            // Find neighbors for navigation (Ordered by creation date descending)
            const qNext = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), startAfter(docSnap), limit(1));
            const qPrev = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), endBefore(docSnap), limitToLast(1));

            const [nextSnap, prevSnap] = await Promise.all([getDocs(qNext), getDocs(qPrev)]);
            nextBookingId.value = nextSnap.docs[0]?.id || null;
            prevBookingId.value = prevSnap.docs[0]?.id || null;

            // Trigger route calculation after data is loaded
            if (directionsService.value) {
                calculateAndDisplayRoute();
            }
        }
    } catch (error) {
        console.error('Error loading booking details:', error);
    } finally {
        isLoading.value = false;
    }
};

const navToNext = async () => {
    if (nextBookingId.value) {
        navigateTo(`/admin/bookings/${nextBookingId.value}`);
    }
};

const navToPrev = async () => {
    if (prevBookingId.value) {
        navigateTo(`/admin/bookings/${prevBookingId.value}`);
    }
};

onMounted(() => {
    initMap();
});

watch(bookingId, () => {
    loadBookingDetails();
}, { immediate: true });
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.animate-fade-in-up {
    animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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

.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
