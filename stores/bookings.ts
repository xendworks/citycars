import { defineStore } from 'pinia';
import { useApiStore } from './api';

interface Booking {
  id: string;
  booking_reference: string;
  user_id?: string;
  driver_id?: string;
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  pickup_datetime: string;
  dropoff_address: string;
  dropoff_latitude: number;
  dropoff_longitude: number;
  distance_miles: number;
  estimated_duration_minutes: number;
  vehicle_type: string;
  passengers: number;
  luggage: number;
  base_fare: number;
  distance_cost: number;
  peak_hour_surcharge: number;
  traffic_surcharge: number;
  vehicle_surcharge: number;
  total_fare: number;
  status: string;
  payment_status: string;
  payment_method?: string;
  special_instructions?: string;
  flight_number?: string;
  created_at: string;
  updated_at: string;
}

interface CreateBookingRequest {
  userId?: string;
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  pickupDateTime: string;
  dropoffAddress: string;
  dropoffLatitude: number;
  dropoffLongitude: number;
  distanceMiles: number;
  estimatedDurationMinutes: number;
  vehicleType: 'saloon' | 'estate' | 'mpv' | 'wheelchair';
  passengers?: number;
  luggage?: number;
  totalFare: number;
  baseFare: number;
  distanceCost: number;
  peakHourSurcharge?: number;
  trafficSurcharge?: number;
  vehicleSurcharge?: number;
  specialInstructions?: string;
  flightNumber?: string;
  paymentMethod?: 'cash' | 'card' | 'account';
}

interface BookingsResponse {
  success: boolean;
  data: Booking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const useBookingsStore = defineStore('bookings', {
  state: () => ({
    bookings: [] as Booking[],
    currentBooking: null as Booking | null,
    isLoading: false,
    error: null as string | null,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0
    }
  }),

  actions: {
    async fetchBookings(params?: {
      page?: number;
      limit?: number;
      status?: string;
      userId?: string;
      driverId?: string;
    }) {
      this.isLoading = true;
      this.error = null;

      try {
        const apiStore = useApiStore();
        const queryParams = new URLSearchParams();
        
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.status) queryParams.append('status', params.status);
        if (params?.userId) queryParams.append('userId', params.userId);
        if (params?.driverId) queryParams.append('driverId', params.driverId);

        const endpoint = `/bookings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiStore.get<BookingsResponse>(endpoint);

        if (response.success) {
          this.bookings = response.data;
          this.pagination = response.pagination;
          return response.data;
        } else {
          throw new Error('Failed to fetch bookings');
        }
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch bookings';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
      this.isLoading = true;
      this.error = null;

      try {
        const apiStore = useApiStore();
        const response = await apiStore.post<{ success: boolean; data: Booking }>('/bookings', bookingData);

        if (response.success) {
          this.currentBooking = response.data;
          this.bookings.unshift(response.data);
          return response.data;
        } else {
          throw new Error('Failed to create booking');
        }
      } catch (error: any) {
        this.error = error.message || 'Failed to create booking';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async getBookingById(id: string): Promise<Booking | null> {
      // For now, search in local bookings. Can add dedicated endpoint later
      return this.bookings.find(b => b.id === id) || null;
    }
  }
});


