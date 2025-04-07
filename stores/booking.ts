import { defineStore } from 'pinia';

interface BookingData {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  passengersCount: number;
  luggageCount: number;
}

export const useBookingStore = defineStore('booking', {
  state: () => ({
    bookingData: null as BookingData | null,
  }),
  
  actions: {
    setBookingData(data: BookingData) {
      this.bookingData = data;
    },
  },
}); 