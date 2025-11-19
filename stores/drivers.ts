import { defineStore } from 'pinia';
import { useApiStore } from './api';

interface Driver {
  id: string;
  user_id?: string;
  license_number: string;
  license_expiry: string;
  vehicle_registration: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_type: string;
  vehicle_year?: number;
  is_available: boolean;
  is_active: boolean;
  rating: number;
  total_trips: number;
  created_at: string;
  updated_at: string;
  user_email?: string;
  user_phone?: string;
  driver_name?: string;
}

interface CreateDriverRequest {
  userId?: string;
  licenseNumber: string;
  licenseExpiry: string;
  vehicleRegistration: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleType: 'saloon' | 'estate' | 'mpv' | 'wheelchair';
  vehicleYear?: number;
}

interface DriversResponse {
  success: boolean;
  data: Driver[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const useDriversStore = defineStore('drivers', {
  state: () => ({
    drivers: [] as Driver[],
    currentDriver: null as Driver | null,
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
    async fetchDrivers(params?: {
      page?: number;
      limit?: number;
      isAvailable?: boolean;
      isActive?: boolean;
    }) {
      this.isLoading = true;
      this.error = null;

      try {
        const apiStore = useApiStore();
        const queryParams = new URLSearchParams();
        
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.isAvailable !== undefined) queryParams.append('isAvailable', params.isAvailable.toString());
        if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

        const endpoint = `/drivers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiStore.get<DriversResponse>(endpoint);

        if (response.success) {
          this.drivers = response.data;
          this.pagination = response.pagination;
          return response.data;
        } else {
          throw new Error('Failed to fetch drivers');
        }
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch drivers';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async createDriver(driverData: CreateDriverRequest): Promise<Driver> {
      this.isLoading = true;
      this.error = null;

      try {
        const apiStore = useApiStore();
        const response = await apiStore.post<{ success: boolean; data: Driver }>('/drivers', driverData);

        if (response.success) {
          this.currentDriver = response.data;
          this.drivers.unshift(response.data);
          return response.data;
        } else {
          throw new Error('Failed to create driver');
        }
      } catch (error: any) {
        this.error = error.message || 'Failed to create driver';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async getAvailableDrivers(): Promise<Driver[]> {
      return this.drivers.filter(d => d.is_available && d.is_active);
    }
  }
});


