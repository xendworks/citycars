import { defineStore } from 'pinia'

interface QueryState {
  from: string;
  to: string;
  passengers: number;
  luggage: number;
  pickupDateTime: string;
  vehicleType: string;
}

export const useQueryStore = defineStore('queryStore', {
  state: (): QueryState => ({
    from: '',
    to: '',
    passengers: 1,
    luggage: 0,
    pickupDateTime: '',
    vehicleType: 'saloon',
  }),
  actions: {
    setQueryData(data: Partial<QueryState>) {
      Object.assign(this, data);
    },
    resetQueryData() {
      this.from = '';
      this.to = '';
      this.passengers = 1;
      this.luggage = 0;
      this.pickupDateTime = '';
      this.vehicleType = 'saloon';
    },
  }
});

// New store for quote details by quoteId
export const useQuoteStore = defineStore('quoteStore', {
  state: () => ({
    quotes: {} as Record<string, any>
  }),
  actions: {
    saveQuote(quoteId: string, details: any) {
      this.quotes[quoteId] = details;
    },
    getQuote(quoteId: string) {
      return this.quotes[quoteId] || null;
    }
  }
}); 