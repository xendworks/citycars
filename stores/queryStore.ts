import { defineStore } from 'pinia'

interface QueryState {
  from: string;
  to: string;
  passengers: number;
  luggage: number;
  pickupDateTime: string;
  vehicleType: string;
  bookingMode: 'normal' | 'ai';
  aiHistory: { role: string; content: string }[];
}

export const useQueryStore = defineStore('queryStore', {
  state: (): QueryState => ({
    from: '',
    to: '',
    passengers: 1,
    luggage: 0,
    pickupDateTime: '',
    vehicleType: 'saloon',
    bookingMode: 'ai',
    aiHistory: [{
      role: 'assistant',
      content: "Hi! I'm your AI booking assistant. Where would you like to be picked up from?"
    }],
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
      this.bookingMode = 'ai';
      this.aiHistory = [{
        role: 'assistant',
        content: "Hi! I'm your AI booking assistant. Where would you like to be picked up from?"
      }];
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