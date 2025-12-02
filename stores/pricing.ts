import { defineStore } from 'pinia';
import { useApiStore } from './api';

interface PricingRequest {
  distanceMiles: number;
  vehicleType?: 'saloon' | 'estate' | 'mpv' | 'wheelchair';
  pickupDateTime?: string;
}

interface PricingResponse {
  success: boolean;
  data: {
    distanceMiles: number;
    baseFare: number;
    peakHourSurcharge: number;
    trafficSurcharge: number;
    vehicleSurcharge: number;
    totalFare: number;
    pricingRule: {
      minMiles: number;
      maxMiles: number | null;
      pricePerMile: number;
      minimumFare: number | null;
    };
    breakdown: {
      distanceCost: number;
      peakHourCost: number;
      trafficCost: number;
      vehicleTypeCost: number;
    };
  };
}

export const usePricingStore = defineStore('pricing', {
  state: () => ({
    isLoading: false,
    error: null as string | null,
    lastCalculation: null as PricingResponse['data'] | null
  }),

  actions: {
    async calculatePricing(request: PricingRequest): Promise<PricingResponse['data']> {
      this.isLoading = true;
      this.error = null;

      try {
        const apiStore = useApiStore();
        const response = await apiStore.post<PricingResponse>('/pricing/calculate', request);
        
        if (response.success) {
          this.lastCalculation = response.data;
          return response.data;
        } else {
          throw new Error('Failed to calculate pricing');
        }
      } catch (error: any) {
        this.error = error.message || 'Failed to calculate pricing';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    formatPrice(amount: number): string {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP'
      }).format(amount);
    }
  }
});



