<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { useBookingStore } from '~/stores/booking';
import { useAuthStore } from '~/stores/auth';
import CustomSelect from './CustomSelect.vue'
import { useRouter, useRoute } from 'vue-router'
import { useQueryStore, useQuoteStore } from '~/stores/queryStore'
import { suggestVehicleType, CAB_TYPES } from '~/constants/cabs'
import { PRICING_CONFIG, calculateSaloonFare } from '~/utils/pricing'

// Add type declarations for NEW PlaceAutocompleteElement API
declare global {
  interface Window {
    google: {
      maps: {
        Map: any
        DirectionsService: any
        DirectionsRenderer: any
        Marker: any
        SymbolPath: any
        OverlayView: any
        TrafficLayer: any
        importLibrary: (library: string) => Promise<any>
        places: {
          Autocomplete: any
          PlaceAutocompleteElement: any
        }
      }
    }
  }
}

const emit = defineEmits(['search']);
const bookingStore = useBookingStore();
const { $googleMaps, $googleMapsLoading, $googleMapsLoaded } = useNuxtApp()

// Add loading state
const isGoogleMapsLoading = ref(false)

const API_KEY = 'AIzaSyACZ4JkEhZZAhafla2ePLtmNL7ktaxV8KM'; // Replace with your actual API key

const queryStore = useQueryStore();
const quoteStore = useQuoteStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const userProfile = computed(() => authStore.userProfile);

const pickupLocation = ref(queryStore.from);
const dropoffLocation = ref(queryStore.to);
const selectedDateTime = ref(queryStore.pickupDateTime);
const passengersCount = ref(queryStore.passengers);
const luggageCount = ref(queryStore.luggage);

const pickupInput = ref(null);
const dropoffInput = ref(null);
const pickupAutocomplete = ref<any>(null);
const dropoffAutocomplete = ref<any>(null);
const pickupContainer = ref<HTMLElement | null>(null);
const dropoffContainer = ref<HTMLElement | null>(null);
const size = ref('default');
const isPickupFocused = ref(false);
const isDropoffFocused = ref(false);

const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7;
};

// Generate time slots
const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

const aiPrompt = ref('');
const isParsingAI = ref(false);
const isListening = ref(false);
const predictedDestinationMessage = ref('');
const showPrediction = ref(false);

// Removed unused local useState for aiHistory and bookingMode

// Pre-load voices to avoid initial robotic voice on Chrome
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => { };
}

const speakText = (text: string) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const synth = window.speechSynthesis;
  // Cancel any ongoing speech so it feels more responsive
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = synth.getVoices();
  // Find a premium/natural British Female voice if possible
  const bestVoice =
    voices.find(v => v.name.includes('Google UK English Female')) ||
    voices.find(v => v.name.includes('Fiona')) ||
    voices.find(v => v.name.includes('Serena')) ||
    voices.find(v => v.name.includes('Moira')) ||
    voices.find(v => v.name.includes('Victoria')) ||
    voices.find(v => v.name.includes('Martha')) ||
    voices.find(v => v.name.includes('Microsoft Hazel')) || // Windows
    voices.find(v => v.lang === 'en-GB' && v.name.includes('Female')) ||
    voices.find(v => v.lang === 'en-GB') ||
    voices.find(v => v.name.includes('Samantha')) ||        // Fallback natural US
    voices.filter(v => v.lang.includes('en-'))[0];          // Any English as last resort

  if (bestVoice) {
    utterance.voice = bestVoice;
    console.log('🗣️ Using AI Voice:', bestVoice.name);
  }
  utterance.pitch = 1.0;
  utterance.rate = 1.0;
  synth.speak(utterance);
};

const scrollToBottom = async () => {
  await nextTick();
  const container = document.querySelector('.custom-scrollbar');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
};

watch(() => userProfile.value?.displayName, (newName) => {
  if (newName && queryStore.aiHistory.length === 1 && queryStore.aiHistory[0].content === "Hi! I'm your AI booking assistant. Where would you like to be picked up from?") {
    const firstName = newName.split(' ')[0];
    queryStore.aiHistory[0].content = `Hi ${firstName}! I'm your AI booking assistant. Where would you like to be picked up from?`;
  }
}, { immediate: true });

onMounted(async () => {
  pickupLocation.value = queryStore.from;
  dropoffLocation.value = queryStore.to;
  selectedDateTime.value = queryStore.pickupDateTime;
  passengersCount.value = queryStore.passengers;
  luggageCount.value = queryStore.luggage;

  // Wait for next tick to ensure DOM is ready
  await nextTick();

  // Predictive Destination Logic
  setTimeout(() => {
    if (userProfile.value && !dropoffLocation.value && !pickupLocation.value) {
      const currentHour = new Date().getHours();
      const hasPickups = userProfile.value.preferredPickupLocations?.length > 0;
      const hasDropoffs = userProfile.value.preferredDropoffLocations?.length > 0;

      if (currentHour >= 6 && currentHour <= 11 && hasDropoffs) {
        // Morning: maybe heading to the first saved dropoff (like Office)
        predictedDestinationMessage.value = `Morning! Heading to ${userProfile.value.preferredDropoffLocations[0]}?`;
        showPrediction.value = true;
      } else if (currentHour >= 15 && currentHour <= 20 && hasPickups) {
        // Evening: maybe heading back to first saved pickup (like Home)
        predictedDestinationMessage.value = `Good evening! Heading back to ${userProfile.value.preferredPickupLocations[0]}?`;
        showPrediction.value = true;
      }
    }

    // Scroll to bottom of chat if returning to page
    if (queryStore.bookingMode === 'ai') {
      scrollToBottom();
    }
  }, 1000);

  // Load Google Maps first, then initialize autocomplete
  try {
    await loadGoogleMaps();

    // Wait a bit more to ensure the API is fully ready
    setTimeout(async () => {
      await initAutocomplete(pickupInput, pickupLocation, true);
      await initAutocomplete(dropoffInput, dropoffLocation, false);
    }, 500);
  } catch (error) {
    console.error('Failed to load Google Maps:', error);
  }
});

watch([pickupLocation, dropoffLocation, selectedDateTime, passengersCount, luggageCount], () => {
  queryStore.setQueryData({
    from: pickupLocation.value,
    to: dropoffLocation.value,
    passengers: Number(passengersCount.value),
    luggage: Number(luggageCount.value),
    pickupDateTime: selectedDateTime.value
  });
});

const loadGoogleMaps = () => {
  if (process.server) return Promise.resolve();
  isGoogleMapsLoading.value = true;
  return ($googleMaps as () => Promise<any>)().finally(() => {
    isGoogleMapsLoading.value = false;
  });
};

// Removed onPickupInput and onDropoffInput - using v-model instead

const initAutocomplete = async (inputRef: any, locationRef: any, isPickup: boolean) => {
  if (process.server) return;

  try {

    // Don't re-initialize if already exists
    if (isPickup && pickupAutocomplete.value) {
      console.log('Pickup autocomplete already initialized');
      return;
    }
    if (!isPickup && dropoffAutocomplete.value) {
      console.log('Dropoff autocomplete already initialized');
      return;
    }

    // Wait for input element to be available
    if (!inputRef.value) {
      console.warn(`Input ref not available for ${isPickup ? 'pickup' : 'dropoff'}`);
      setTimeout(() => {
        if (inputRef.value) {
          initAutocomplete(inputRef, locationRef, isPickup);
        }
      }, 300);
      return;
    }

    // Create the CLASSIC Autocomplete (yes it's "deprecated" but it WORKS!)
    //@ts-ignore
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.value, {
      componentRestrictions: { country: 'gb' },
      fields: ['formatted_address', 'geometry', 'name', 'address_components']
    });

    // Store the autocomplete instance
    if (isPickup) {
      pickupAutocomplete.value = autocomplete;
    } else {
      dropoffAutocomplete.value = autocomplete;
    }

    // Listen for place selection
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        console.warn('No geometry found for place');
        return;
      }

      // Google automatically fills the input with the place name
      // We just need to sync it with our v-model by reading the input value
      // This ensures the input shows EXACTLY what the user clicked in the dropdown
      locationRef.value = inputRef.value.value;

    });


  } catch (error) {
    console.error(`❌ Error initializing Autocomplete for ${isPickup ? 'pickup' : 'dropoff'}:`, error);
  }
};

const handlePickupChange = async () => {
  // Re-initialize if autocomplete doesn't exist or if input is empty
  if (!pickupAutocomplete.value && pickupInput.value) {
    await nextTick();
    await initAutocomplete(pickupInput, pickupLocation, true);
  }
};

const handleDropoffChange = async () => {
  // Re-initialize if autocomplete doesn't exist or if input is empty
  if (!dropoffAutocomplete.value && dropoffInput.value) {
    await nextTick();
    await initAutocomplete(dropoffInput, dropoffLocation, false);
  }
};

const handlePickupFocus = async () => {
  isPickupFocused.value = true;
  await handlePickupChange();
};

const handleDropoffFocus = async () => {
  isDropoffFocused.value = true;
  await handleDropoffChange();
};

const handlePickupBlur = () => {
  setTimeout(() => isPickupFocused.value = false, 200);
};

const handleDropoffBlur = () => {
  setTimeout(() => isDropoffFocused.value = false, 200);
};

const handleSearch = (aiSuggestedVehicleType?: string | Event) => {
  const isDirectString = typeof aiSuggestedVehicleType === 'string';
  const vehicleType = isDirectString ? aiSuggestedVehicleType : suggestVehicleType(Number(passengersCount.value), Number(luggageCount.value));

  // Create a unique booking ID
  const bookingId = Date.now().toString();

  // Store in Pinia with booking ID
  queryStore.setQueryData({
    from: pickupLocation.value,
    to: dropoffLocation.value,
    passengers: Number(passengersCount.value),
    luggage: Number(luggageCount.value),
    pickupDateTime: selectedDateTime.value,
    vehicleType
  });

  // Save quote details with booking ID
  quoteStore.saveQuote(bookingId, {
    from: pickupLocation.value,
    to: dropoffLocation.value,
    passengers: Number(passengersCount.value),
    luggage: Number(luggageCount.value),
    pickupDateTime: selectedDateTime.value,
    cabType: vehicleType, // Changed from vehicleType to cabType to match booking page
    fare: 50 // Default fare, you can calculate this based on distance
  });

  // Check if we're already on the quote page
  if (route.path === '/quote') {
    console.log('🔍 Already on quote page, emitting search event');
    // Emit event to parent to trigger search
    emit('search', {
      from: pickupLocation.value,
      to: dropoffLocation.value,
      passengers: Number(passengersCount.value),
      luggage: Number(luggageCount.value),
      pickupDateTime: selectedDateTime.value,
      vehicleType,
      bookingId
    });
  } else {
    console.log('🚀 Navigating to quote page');
    // Navigate to quote page with booking ID
    router.push(`/quote?bookingId=${bookingId}`);
  }
};

const aiCabPrices = ref<Record<string, number>>({});
const aiTotalBaseFare = ref<number>(75);

const calculateAIPrices = async (origin: string, dest: string) => {
  if (!window.google?.maps?.DirectionsService) return;
  try {
    const directionsService = new window.google.maps.DirectionsService();
    const request = {
      origin: origin,
      destination: dest,
      travelMode: (window as any).google.maps.TravelMode.DRIVING
    };
    const response: any = await new Promise((resolve, reject) => {
      directionsService.route(request, (res: any, status: string) => {
        if (status === 'OK') resolve(res);
        else reject(status);
      });
    });
    const distanceText = response.routes[0].legs[0].distance.text;
    const miles = parseFloat(distanceText.replace(/,/g, ''));
    const baseSaloon = calculateSaloonFare(miles);

    aiTotalBaseFare.value = baseSaloon;

    Object.values(CAB_TYPES).forEach(cab => {
      const multiplier = PRICING_CONFIG.vehicleMultipliers[cab.id as keyof typeof PRICING_CONFIG.vehicleMultipliers] || 0;
      aiCabPrices.value[cab.name] = baseSaloon * (1 + (multiplier / 100));
    });
  } catch (e) {
    console.error("AI Price fetch failed", e);
  }
};

const formatMessage = (text: string) => {
  if (!text) return '';
  // Convert markdown bold to html
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Convert newlines to html breaks
  html = html.replace(/\n/g, '<br>');
  // Add another replacing layer for single new line
  return html.split('\n').join('<br/>');
};

const handleConversationalBooking = async (opt?: boolean | Event) => {
  if (!aiPrompt.value.trim()) return;

  const useVoice = typeof opt === 'boolean' ? opt : false;
  const userText = aiPrompt.value;
  aiPrompt.value = ''; // clear input immediately to feel fast
  queryStore.aiHistory.push({ role: 'user', content: userText });
  isParsingAI.value = true;
  await scrollToBottom();


  try {
    const data: any = await $fetch('/api/ai/conversational-booking', {
      method: 'POST',
      body: {
        message: userText,
        history: queryStore.aiHistory.slice(0, -1) // send context
      }
    });

    // Speak the reply only if voice input was used
    if (useVoice) {
      speakText(data.reply);
    }

    queryStore.aiHistory.push({ role: 'assistant', content: data.reply });
    await scrollToBottom();

    // Phase 1: AI Determined journey details are satisfied and ready for Quotes!
    if (data.isShowQuotes || (data.isComplete && !data.isConfirmBooking)) {
      if (data.bookingData) {
        if (data.bookingData.from) pickupLocation.value = data.bookingData.from;
        if (data.bookingData.to) dropoffLocation.value = data.bookingData.to;
        if (data.bookingData.passengers) passengersCount.value = data.bookingData.passengers;
        if (data.bookingData.luggage) luggageCount.value = data.bookingData.luggage;
        if (data.bookingData.pickupDateTime) selectedDateTime.value = data.bookingData.pickupDateTime;

        if (data.bookingData.from) await handlePickupChange();
        if (data.bookingData.to) await handleDropoffChange();

        if (data.bookingData.from && data.bookingData.to) {
          await calculateAIPrices(data.bookingData.from, data.bookingData.to);
        }
      }

      // Instead of forcing a redirect to the /quote page, let's mark the specific history item to show UI cards!
      const lastMsg: any = queryStore.aiHistory[queryStore.aiHistory.length - 1];
      if (lastMsg.role === 'assistant') {
        lastMsg['isShowQuotes'] = true;
        lastMsg['suggestedVehicleType'] = data.bookingData.suggestedVehicleType;
        lastMsg['cabPrices'] = { ...aiCabPrices.value };
      }
    }
    // Phase 2: AI Determined vehicle type & preferences are satisfied and booking is confirmed!
    else if (data.isConfirmBooking && data.bookingData) {
      setTimeout(async () => {
        const cabType = data.bookingData.vehicleType || 'saloon';
        const newBookingId = `ai${Date.now()}`;

        // Finalize Extras
        const paymentType = data.bookingData.paymentMethod?.toLowerCase() || 'cash';
        const paymentMethod = paymentType === 'card' ? 'Debit / Credit Card (3% Admin Charges)'
          : (paymentType === 'paypal' ? 'Paypal Transaction (5% Charges)'
            : 'Cash (0% Admin Charges)');
        const meetAndGreet = !!data.bookingData.meetAndGreet;
        const childSeat = !!data.bookingData.childSeat;
        const promoCode = data.bookingData.promoCode || null;
        const flightNumber = data.bookingData.flightNumber || null;

        // Finalize Math
        const baseFare = data.bookingData.baseFare || aiTotalBaseFare.value || 75; // Use the properly quoted price or fallback
        const meetAndGreetFee = meetAndGreet ? PRICING_CONFIG.extras.meetAndGreet : 0;
        const childSeatFee = childSeat ? PRICING_CONFIG.extras.childSeat : 0;
        const surchargeAmount = paymentMethod.includes('Card') ? (baseFare * PRICING_CONFIG.paymentSurcharges.card / 100) : (paymentMethod.includes('Paypal') ? (baseFare * PRICING_CONFIG.paymentSurcharges.paypal / 100) : 0);
        const promoDiscount = promoCode ? (baseFare * 10 / 100) : 0; // AI applies a flat 10% discount for validated codes

        const totalAmount = baseFare + meetAndGreetFee + childSeatFee + surchargeAmount - promoDiscount;

        const generatedData = {
          userId: userProfile.value?.uid || null,
          userName: userProfile.value?.displayName || userProfile.value?.email?.split('@')[0] || 'AI Guest User',
          userEmail: userProfile.value?.email || 'guest@example.com',
          userPhone: userProfile.value?.phoneNumber || '+44 0000 000000',
          pickupAddress: pickupLocation.value || data.bookingData.from || 'Unknown Pickup',
          dropoffAddress: dropoffLocation.value || data.bookingData.to || 'Unknown Dropoff',
          pickupDateTime: selectedDateTime.value || data.bookingData.pickupDateTime,
          flightNumber: flightNumber,
          cabType: cabType,
          vehicleType: cabType,
          passengers: Number(passengersCount.value),
          luggage: Number(luggageCount.value),
          meetAndGreet: meetAndGreet,
          meetAndGreetFee: meetAndGreetFee,
          childSeat: childSeat,
          childSeatFee: childSeatFee,
          paymentMethod: paymentMethod,
          baseFare: baseFare,
          promoCode: promoCode,
          promoDiscount: promoDiscount,
          surchargeAmount: surchargeAmount,
          totalFare: totalAmount,
          bookingStatus: 'pending',
          bookingSource: 'ai-voice',
          quoteId: newBookingId,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        try {
          // Direct background booking creation
          const { createBooking } = useFirestore();
          const response = await createBooking(generatedData);

          if (response && response.id) {
            try {
              await $fetch('/api/email/booking-confirmation', {
                method: 'POST',
                body: {
                  ...generatedData,
                  bookingReference: response.bookingReference
                }
              });
            } catch (err) {
              console.error('Email failed to send for AI booking', err);
            }

            router.push({
              path: '/booking-success',
              query: {
                ref: response.bookingReference,
                data: encodeURIComponent(JSON.stringify({ ...generatedData, createdAt: undefined, updatedAt: undefined }))
              }
            });
          }
        } catch (e) {
          console.error(e);
          queryStore.aiHistory.push({ role: 'assistant', content: 'Ah, I ran into a snag saving your completed booking. Please check your connection or contact support!' });
          await scrollToBottom();
        }
      }, 3500);
    }

  } catch (err: any) {
    console.error(err);
    queryStore.aiHistory.push({ role: 'assistant', content: 'Connection error, please try again.' });
    await scrollToBottom();
  } finally {
    isParsingAI.value = false;
  }
};

const toggleVoiceInput = () => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('Voice input is not supported in your browser.');
    return;
  }

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    isListening.value = true;
  };

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    aiPrompt.value = transcript;
    handleConversationalBooking(true);
  };

  recognition.onerror = (event: any) => {
    console.error('Speech recognition error', event.error);
    isListening.value = false;
  };

  recognition.onend = () => {
    isListening.value = false;
  };

  recognition.start();
};

const applyPrediction = () => {
  const currentHour = new Date().getHours();
  if (currentHour >= 6 && currentHour <= 11) {
    dropoffLocation.value = userProfile.value!.preferredDropoffLocations![0];
  } else {
    dropoffLocation.value = userProfile.value!.preferredPickupLocations![0];
  }
  showPrediction.value = false;
};
const selectAICab = async (cabName: string) => {
  const priceEstimate = aiCabPrices.value[cabName] || 75;
  aiTotalBaseFare.value = priceEstimate; // Lock in the user's selected choice price for final checkout
  aiPrompt.value = `I will take the ${cabName} vehicle for £${priceEstimate.toFixed(2)}.`;
  await handleConversationalBooking(false);
};
</script>

<template>
  <div class=" mx-auto bg-white m-h-[600px] rounded-xl shadow-lg border border-gray-100 relative overflow-hidden">
    <!-- Tab Controls -->
    <div class="flex border-b border-gray-100 shadow-sm relative z-10 w-full">
      <button @click="queryStore.bookingMode = 'ai'" :class="[
        'flex-1 py-4 px-6 font-semibold flex items-center justify-center gap-2 transition-all',
        queryStore.bookingMode === 'ai' ? 'text-amber-600 bg-amber-50/50 border-b-2 border-amber-500' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 border-b-2 border-transparent'
      ]">
        <span class="text-xl">✨</span> Book with AI
      </button>
      <button @click="queryStore.bookingMode = 'normal'" :class="[
        'flex-1 py-4 px-6 font-semibold transition-all',
        queryStore.bookingMode === 'normal' ? 'text-gray-900 bg-white border-b-2 border-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 border-b-2 border-transparent'
      ]">
        Normal Booking
      </button>
    </div>

    <!-- Container Padding -->
    <div class="p-4 md:p-6">

      <!-- AI BOOKING MODE -->
      <div v-show="queryStore.bookingMode === 'ai'">
        <div
          class="mb-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl pt-6 pb-4 border border-amber-100 flex flex-col min-h-[160px]">

          <!-- AI Conversation History -->
          <div class="flex-1 overflow-y-auto max-h-[450px] mb-4 space-y-3 px-6 custom-scrollbar">
            <div v-for="(msg, idx) in queryStore.aiHistory" :key="idx" class="flex flex-col"
              :class="msg.role === 'user' ? 'items-end' : 'items-start'">
              <div :class="[
                'p-3 max-w-[85%] rounded-2xl text-sm leading-relaxed shadow-sm border border-transparent text-left',
                msg.role === 'user' ? 'bg-amber-500 text-white rounded-tr-sm' : 'bg-white text-gray-800 border-amber-200/50 rounded-tl-sm'
              ]">
                <div v-html="formatMessage(msg.content)"></div>

                <!-- Adaptive Quotes Card -->
                <div v-if="(msg as any).isShowQuotes" class="mt-4 flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                  <p class="w-full font-bold text-xs text-amber-600 mb-1 uppercase tracking-wider">Tap to Select Cab</p>
                  <button v-for="cab in Object.values(CAB_TYPES)" :key="cab.id" @click="selectAICab(cab.name)"
                    class="px-4 py-2 bg-gray-50 hover:bg-amber-100 border border-gray-200 hover:border-amber-400 rounded-lg text-sm font-semibold transition-colors flex flex-col items-center gap-1"
                    :class="(msg as any).suggestedVehicleType?.toLowerCase() === cab.name.toLowerCase() ? 'ring-2 ring-amber-500 bg-amber-50' : ''">
                    <img :src="cab.imageUrl" :alt="cab.name"
                      class="h-8 object-contain drop-shadow transition-transform hover:scale-110" />
                    <span>{{ cab.name }}</span>
                    <span v-if="(msg as any).cabPrices && (msg as any).cabPrices[cab.name]"
                      class="text-xs font-bold text-gray-700">£{{ (msg as any).cabPrices[cab.name].toFixed(2) }}</span>
                  </button>
                </div>
              </div>
            </div>
            <!-- Typing Indicator Indicator -->
            <div v-if="isParsingAI" class="self-start items-start flex">
              <div class="bg-white border text-gray-800 rounded-2xl rounded-tl-sm shadow-sm p-4 flex gap-1">
                <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
              </div>
            </div>
          </div>

          <!-- Input Area -->
          <div class="relative flex items-center gap-2 p-3 mt-auto">
            <div class="relative flex-1">
              <input v-model="aiPrompt" @keydown.enter="handleConversationalBooking(false)" type="text"
                placeholder="Talk to me! e.g., 'From Heathrow to Gatwick tomorrow'"
                class="w-full p-4 pr-16 bg-white border-2 border-amber-200 rounded-xl text-sm md:text-base shadow-sm focus:border-amber-400 focus:ring-0 transition-all font-medium placeholder-amber-900/40"
                :disabled="isParsingAI || isListening" />
              <button @click="handleConversationalBooking(false)" :disabled="isParsingAI || isListening"
                class="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50">
                <svg class="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <button @click="toggleVoiceInput" :title="isListening ? 'Listening...' : 'Use Voice Input'"
              :class="['flex items-center justify-center p-4 rounded-xl text-white shadow-sm transition-all flex-shrink-0', isListening ? 'bg-red-500 animate-pulse scale-105' : 'bg-gray-900 hover:bg-gray-800 hover:-translate-y-0.5']">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- NORMAL BOOKING MODE -->
      <div v-show="queryStore.bookingMode === 'normal'">

        <!-- Predictive Prediction Toast -->
        <div v-if="showPrediction"
          class="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between shadow-sm animate-fade-in-down">
          <div class="flex items-center gap-3">
            <span class="text-2xl">🔮</span>
            <p class="text-sm font-medium text-blue-900">{{ predictedDestinationMessage }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="applyPrediction"
              class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors">Yes,
              book it</button>
            <button @click="showPrediction = false" class="px-3 py-1.5 text-gray-400 hover:text-gray-600"><svg
                class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg></button>
          </div>
        </div>

        <!-- Mobile Layout (Vertical) -->
        <div class="block md:hidden space-y-4">
          <!-- Pickup Location - Full Width -->
          <div class="w-full">
            <label class="block text-left text-sm font-medium text-gray-700 mb-2 font-inter">Pick-up Location</label>
            <div class="relative">
              <input ref="pickupInput" v-model="pickupLocation" @focus="handlePickupFocus" @blur="handlePickupBlur"
                @change="handlePickupChange" autocomplete="off" name="pickup-autocomplete" type="text"
                placeholder="Eg: Gatwick Airport"
                class="w-full p-3  border border-gray-200 rounded-lg text-base shadow-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 hover:border-gray-300"
                :disabled="isGoogleMapsLoading" />
            </div>
            <!-- Saved Pickup Addresses -->
            <div v-if="userProfile?.preferredPickupLocations?.length && !pickupLocation && isPickupFocused"
              class="mt-2 flex flex-wrap gap-2 transition-all">
              <button v-for="(loc, idx) in userProfile.preferredPickupLocations" :key="idx"
                @click="pickupLocation = loc"
                class="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200 hover:bg-green-100 transition-colors truncate max-w-[200px]"
                title="Use saved address">
                ★ {{ loc }}
              </button>
            </div>
          </div>

          <!-- Drop-off Location - Full Width -->
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-2">Drop-off Location</label>
            <div class="relative">
              <input ref="dropoffInput" v-model="dropoffLocation" @focus="handleDropoffFocus" @blur="handleDropoffBlur"
                @change="handleDropoffChange" autocomplete="off" name="dropoff-autocomplete" type="text"
                placeholder="Eg: SW1 7NL"
                class="w-full p-3 border border-gray-200 rounded-lg text-base shadow-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 hover:border-gray-300"
                :disabled="isGoogleMapsLoading" />
            </div>
            <!-- Saved Dropoff Addresses -->
            <div v-if="userProfile?.preferredDropoffLocations?.length && !dropoffLocation && isDropoffFocused"
              class="mt-2 flex flex-wrap gap-2 transition-all">
              <button v-for="(loc, idx) in userProfile.preferredDropoffLocations" :key="idx"
                @click="dropoffLocation = loc"
                class="text-[10px] bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200 hover:bg-red-100 transition-colors truncate max-w-[200px]"
                title="Use saved address">
                ★ {{ loc }}
              </button>
            </div>
          </div>

          <!-- Date & Time - Full Width -->
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-2">Pickup Date & Time</label>
            <input type="datetime-local" v-model="selectedDateTime"
              class="w-full p-3 border border-gray-200 rounded-lg text-sm shadow-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 hover:border-gray-300"
              :min="new Date().toISOString().slice(0, 16)" />
          </div>

          <!-- Passengers & Luggage - 50/50 on Mobile -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <CustomSelect v-model="passengersCount" :options="['1', '2', '3', '4', '5', '6', '7', '8']"
                label="Passengers" />
            </div>
            <div>
              <CustomSelect v-model="luggageCount" :options="['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']"
                label="Luggages" />
            </div>
          </div>

          <!-- Search Button - Full Width -->
          <div class="w-full">
            <button @click="handleSearch"
              class="w-full bg-amber-400 hover:bg-amber-500 text-gray-800 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 font-medium">
              <div class="flex items-center justify-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd" />
                </svg>
                <span>Search & Book</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Desktop Layout (Horizontal) -->
        <div class="hidden md:flex flex-col lg:flex-row items-end gap-4">
          <!-- Pickup Location -->
          <div class="flex-1 min-w-0">
            <label class="block text-left text-sm font-medium text-gray-700 mb-2 font-inter">Pick-up Location</label>
            <div class="relative">
              <input ref="pickupInput" v-model="pickupLocation" @focus="handlePickupFocus" @blur="handlePickupBlur"
                @change="handlePickupChange" autocomplete="off" name="pickup-autocomplete" type="text"
                placeholder="Eg: Gatwick Airport"
                class="w-full p-3  border border-gray-300 rounded-lg text-sm shadow-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 hover:border-gray-300"
                :disabled="isGoogleMapsLoading" />
              <div v-if="isGoogleMapsLoading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-400"></div>
              </div>
            </div>
            <!-- Saved Pickup Addresses -->
            <div v-if="userProfile?.preferredPickupLocations?.length && !pickupLocation && isPickupFocused"
              class="mt-2 absolute flex flex-wrap gap-2 z-10 bg-white p-2 rounded-lg shadow-lg border border-gray-100 w-[max-content] max-w-xs transition-opacity duration-200">
              <p class="w-full text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Saved Pickups</p>
              <button v-for="(loc, idx) in userProfile.preferredPickupLocations" :key="idx"
                @click="pickupLocation = loc"
                class="w-full text-left text-xs bg-green-50 text-green-700 px-3 py-2 rounded-md border border-green-100 hover:bg-green-100 transition-colors truncate"
                title="Use saved pickup">
                <span class="mr-1">⭐</span> {{ loc }}
              </button>
            </div>
          </div>

          <!-- Drop-off Location -->
          <div class="flex-1 min-w-0">
            <label class="block text-left text-sm font-medium text-gray-700 mb-2">Drop-off Location</label>
            <div class="relative">
              <input ref="dropoffInput" v-model="dropoffLocation" @focus="handleDropoffFocus" @blur="handleDropoffBlur"
                @change="handleDropoffChange" autocomplete="off" name="dropoff-autocomplete" type="text"
                placeholder="Eg: SW1 7NL"
                class="w-full p-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 hover:border-gray-300"
                :disabled="isGoogleMapsLoading" />
              <div v-if="isGoogleMapsLoading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-400"></div>
              </div>
            </div>
            <!-- Saved Dropoff Addresses -->
            <div v-if="userProfile?.preferredDropoffLocations?.length && !dropoffLocation && isDropoffFocused"
              class="mt-2 absolute flex flex-wrap gap-2 z-10 bg-white p-2 rounded-lg shadow-lg border border-gray-100 w-[max-content] max-w-xs transition-opacity duration-200">
              <p class="w-full text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Saved Dropoffs</p>
              <button v-for="(loc, idx) in userProfile.preferredDropoffLocations" :key="idx"
                @click="dropoffLocation = loc"
                class="w-full text-left text-xs bg-red-50 text-red-700 px-3 py-2 rounded-md border border-red-100 hover:bg-red-100 transition-colors truncate"
                title="Use saved dropoff">
                <span class="mr-1">⭐</span> {{ loc }}
              </button>
            </div>
          </div>

          <!-- Date Picker -->
          <div class="flex-1 min-w-0">
            <label class="block text-left text-sm font-medium text-gray-700 mb-2">Pickup Date & Time</label>
            <input type="datetime-local" v-model="selectedDateTime"
              class="w-full p-3  border border-gray-300 rounded-lg text-sm shadow-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 hover:border-gray-300"
              :min="new Date().toISOString().slice(0, 16)" />
          </div>

          <!-- Passengers -->
          <div class="flex-1 min-w-0">
            <CustomSelect v-model="passengersCount" :options="['1', '2', '3', '4', '5', '6', '7', '8']"
              label="Passengers" />
          </div>

          <!-- Luggage -->
          <div class="flex-1 min-w-0">
            <CustomSelect v-model="luggageCount" :options="['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']"
              label="Luggages" />
          </div>

          <!-- Search Button -->
          <div class="flex-shrink-0">
            <button @click="handleSearch"
              class="bg-amber-400 hover:bg-amber-500 text-gray-800 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div> <!-- end container block -->
  </div> <!-- end main component wrapper -->
</template>

<style scoped>
/* Allow dropdowns to extend beyond container */
.relative {
  overflow: visible !important;
}

/* Ensure dropdowns can extend beyond container */
:deep([role="listbox"]) {
  overflow: visible !important;
}

/* Override any overflow hidden on the main container */
:deep(.bg-white) {
  overflow: visible !important;
}
</style>

<style>
/* Custom styling for Google Places Autocomplete dropdown */
/* (Google renders these outside the component, so we can style them normally) */
.pac-container {
  border-radius: 0.5rem !important;
  border: 1px solid #d1d5db !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
  margin-top: 8px !important;
  padding: 4px 0 !important;
  background: #ffffff !important;
  overflow: hidden !important;
  z-index: 9999 !important;
}

.pac-item {
  padding: 6px 10px !important;
  font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
  font-size: 12px !important;
  color: #111827 !important;
  border: none !important;
  border-top: 1px solid #f3f4f6 !important;
  cursor: pointer !important;
  transition: background-color 0.15s ease !important;
  line-height: 1.5 !important;
}

.pac-item:first-child {
  border-top: none !important;
}

.pac-item:hover,
.pac-item-selected {
  background-color: #fef3c7 !important;
}

.pac-item-query {
  font-size: 12px !important;
  color: #111827 !important;
  font-weight: 500 !important;
}

.pac-matched {
  font-weight: 600 !important;
  color: #f59e0b !important;
}
</style>
