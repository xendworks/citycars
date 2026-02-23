<script setup lang="ts">
definePageMeta({
  layout: false
});
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { useBookingStore } from '~/stores/booking';
import { useAuthStore } from '~/stores/auth';
import CustomSelect from '~/components/CustomSelect.vue'
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
const isAiChatExpanded = ref(false);
const aiSessionId = ref(`session_${Date.now()}`);

// Removed unused local useState for aiHistory and bookingMode

// Pre-load voices to avoid initial robotic voice on Chrome
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => { };
}

let activeUtterance: SpeechSynthesisUtterance | null = null; // Prevent GC bug in Chromium browsers

const speakText = (text: string, onEndCallback?: () => void) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const synth = window.speechSynthesis;
  // Cancel any ongoing speech so it feels more responsive
  synth.cancel();

  // Strip markdown characters so the TTS engine doesn't read out "asterisk" or "hash"
  const cleanText = text.replace(/[*_#`~>]/g, '');

  activeUtterance = new SpeechSynthesisUtterance(cleanText);
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
    activeUtterance.voice = bestVoice;
    console.log('🗣️ Using AI Voice:', bestVoice.name);
  }
  activeUtterance.pitch = 1.0;
  activeUtterance.rate = 1.0;

  if (onEndCallback) {
    activeUtterance.onend = () => {
      // Add a slight delay before triggering the microphone again to prevent hardware collision
      setTimeout(() => {
        onEndCallback();
      }, 500);
    };
  }

  synth.speak(activeUtterance);
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
        sessionId: aiSessionId.value,
        message: userText,
        history: queryStore.aiHistory.slice(0, -1) // send context
      }
    });

    // Speak the reply only if voice input was used
    if (useVoice) {
      speakText(data.reply, () => {
        // Automatically start listening again after AI finishes speaking its response
        if (queryStore.bookingMode === 'ai' && !isListening.value) {
          toggleVoiceInput();
        }
      });
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

const resetAiChat = () => {
  // Clear the frontend history to its default first message
  queryStore.aiHistory = [
    { role: 'assistant', content: "Hi! I'm your AI booking assistant. Where would you like to be picked up from?" }
  ];
  // Re-sync name personalization on reset
  if (userProfile.value?.displayName) {
    const firstName = userProfile.value.displayName.split(' ')[0];
    queryStore.aiHistory[0].content = `Hi ${firstName}! I'm your AI booking assistant. Where would you like to be picked up from?`;
  }
  // Generate a new tracking session id
  aiSessionId.value = `session_${Date.now()}`;
};
</script>

<template>
  <div class="flex flex-col w-full h-screen overflow-y-auto bg-[#FEFBE1] overflow-hidden font-inter">
    <!-- Minimal Header -->
    <div class="flex items-center justify-between sticky top-0 p-4 md:p-6 shrink-0 relative z-10">
      <NuxtLink to="/"
        class="flex items-center justify-center p-2 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer rounded-lg hover:bg-gray-100/50 group">
        <svg fill="none" stroke="currentColor" stroke-width="2"
          class="w-5 h-5 group-hover:-translate-x-1 transition-transform" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>

      <button @click="resetAiChat"
        class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors rounded-full border border-gray-200 hover:bg-gray-50/80 bg-white shadow-sm"
        title="Reset Chat">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        New Chat
      </button>
    </div>

    <div class="flex flex-col flex-1 relative h-full w-full">

      <!-- AI BOOKING MODE -->
      <div class="flex flex-col flex-1 h-full relative">

        <!-- AI Conversation History -->
        <div class="flex-1 overflow-y-auto h-[calc(100vh-100px)] w-full px-4 md:px-8 custom-scrollbar relative">
          <!-- Chat messages centered container -->
          <div class="max-w-3xl mx-auto w-full flex flex-col pt-8 pb-[200px] gap-8 md:gap-10">

            <template v-for="(msg, idx) in queryStore.aiHistory" :key="idx">

              <!-- Empty State Landing -->
              <div v-if="idx === 0 && queryStore.aiHistory.length === 1"
                class="flex flex-col items-center justify-center w-full mt-[10vh] md:mt-[15vh]">
                <!-- Icon & Title -->
                <div class="flex items-center gap-3 mb-4 md:mb-6">
                  <span class="text-[#D87D4A] text-[32px] md:text-[40px] animate-pulse">✻</span>
                  <h1
                    class="text-[32px] md:text-[40px] font-sora font-medium text-[#2d2a26] tracking-tight text-center leading-tight">
                    Book a ride, {{ userProfile?.displayName?.split(' ')[0] || 'friend' }}</h1>
                </div>
                <p class="text-[#7d7a76] font-inter text-md md:text-lg text-center max-w-md">I'm your AI booking
                  assistant. Where would you like to be picked up from?</p>
              </div>

              <!-- Chat Message Format -->
              <div v-if="!(idx === 0)" class="flex w-full gap-4 md:gap-5 group"
                :class="msg.role === 'user' ? 'justify-end' : 'flex-row'">

                <!-- Avatar (AI Only) -->
                <div v-if="msg.role !== 'user'"
                  class="w-8 h-8 md:w-9 md:h-9 shrink-0 rounded-lg flex items-center justify-center mt-0.5 md:mt-1 border bg-[#E39F75] border-[#D87D4A] text-white shadow-sm">
                  <div class="text-2xl font-serif tracking-tighter shrink-0 leading-[0] pb-1 mt-0.5">✻</div>
                </div>

                <!-- Chat Content -->
                <div :class="[
                  'text-[15.5px] md:text-[16px] leading-[1.7] font-inter font-normal min-w-0 max-w-[85%] md:max-w-[75%]',
                  msg.role === 'user' ? 'bg-[#EAE7D9] text-[#1a1a1a] px-5 py-3.5 rounded-3xl rounded-tr-md shadow-sm border border-[#E0DBC7]' : 'flex-1 text-[#1a1a1a] py-1'
                ]">
                  <div v-html="formatMessage(msg.content)"
                    class="prose prose-sm md:prose-base max-w-none break-words text-[#1a1a1a]"></div>

                  <!-- Adaptive Quotes Card -->
                  <div v-if="(msg as any).isShowQuotes"
                    class="mt-5 flex flex-wrap gap-2 pt-4 border-t border-gray-200/60">
                    <p class="w-full font-semibold text-xs text-gray-500 mb-1 uppercase tracking-wider">Available
                      Options</p>
                    <button v-for="cab in Object.values(CAB_TYPES)" :key="cab.id" @click="selectAICab(cab.name)"
                      class="px-4 py-2.5 bg-white hover:bg-[#F9F8F6] border border-gray-200 hover:border-gray-300 rounded-xl text-sm transition-colors flex flex-col items-center gap-2 min-w-[100px] shadow-sm"
                      :class="(msg as any).suggestedVehicleType?.toLowerCase() === cab.name.toLowerCase() ? 'ring-2 ring-[#D87D4A] border-transparent' : ''">
                      <img :src="cab.imageUrl" :alt="cab.name"
                        class="h-8 object-contain drop-shadow-sm transition-transform hover:scale-105" />
                      <span class="font-medium text-gray-800">{{ cab.name }}</span>
                      <span v-if="(msg as any).cabPrices && (msg as any).cabPrices[cab.name]"
                        class="text-xs font-semibold text-gray-600">£{{ (msg as any).cabPrices[cab.name].toFixed(2)
                        }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </template>

            <!-- Typing Indicator -->
            <div v-if="isParsingAI" class="flex w-full gap-4 md:gap-5 flex-row animate-fade-in-down">
              <div
                class="w-8 h-8 md:w-9 md:h-9 shrink-0 rounded-lg flex items-center justify-center mt-0.5 md:mt-1 border bg-[#E39F75] border-[#D87D4A] text-white shadow-sm">
                <div class="text-2xl font-serif tracking-tighter shrink-0 leading-[0] pb-1 mt-0.5">✻</div>
              </div>
              <div class="flex flex-1 items-center gap-1.5 h-10">
                <div class="w-1.5 h-1.5 bg-[#D87D4A] opacity-60 rounded-full animate-bounce"></div>
                <div class="w-1.5 h-1.5 bg-[#D87D4A] opacity-60 rounded-full animate-bounce"
                  style="animation-delay: 0.2s"></div>
                <div class="w-1.5 h-1.5 bg-[#D87D4A] opacity-60 rounded-full animate-bounce"
                  style="animation-delay: 0.4s"></div>
              </div>
            </div>

          </div> <!-- End centered container -->
        </div>

        <!-- Pinned Input Area -->
        <div
          class="fixed bottom-0 w-full left-0 bg-gradient-to-t from-[#FEFBE1] via-[#FEFBE1]/90 to-transparent pb-6 md:pb-10 pt-16 z-20 pointer-events-none">
          <div class="max-w-3xl mx-auto  px-4 md:px-8 w-full pointer-events-auto">

            <div
              class="relative flex items-end gap-2 bg-white rounded-[24px] border border-[#e5e5e5] shadow-[0_2px_12px_rgba(0,0,0,0.06)] focus-within:shadow-[0_4px_20px_rgba(0,0,0,0.08)] focus-within:border-gray-300 transition-all">
              <div class="relative flex-1 flex flex-col justify-end min-h-[60px] md:min-h-[64px]">
                <textarea v-model="aiPrompt" @keydown.enter.prevent="handleConversationalBooking(false)"
                  placeholder="Ask CityCars anything..." rows="1"
                  class="w-full py-[18px] md:py-[20px] pl-[20px] md:pl-[24px] pr-[90px] bg-transparent text-[15.5px] md:text-[16px] text-[#1a1a1a] focus:outline-none placeholder-gray-400 font-inter resize-none h-full"
                  :disabled="isParsingAI || isListening"></textarea>

                <div class="absolute right-3 bottom-2.5 md:bottom-3 flex items-center gap-1">
                  <!-- Inline Voice Button -->
                  <button @click="toggleVoiceInput" :title="isListening ? 'Listening...' : 'Use Voice Input'"
                    :class="['p-1.5 md:p-2 rounded-xl transition-all shrink-0',
                      isListening ? 'text-red-500 bg-red-50 animate-pulse' : 'text-[#b0b0b0] bg-transparent hover:text-gray-700 hover:bg-gray-100/50']">
                    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>

                  <!-- Send Button -->
                  <button @click="handleConversationalBooking(false)"
                    :disabled="isParsingAI || (isListening) || (!aiPrompt.trim())"
                    class="p-1.5 md:p-2 text-[#b0b0b0] bg-transparent hover:text-white hover:bg-[#D87D4A] rounded-xl transition-all disabled:opacity-30 disabled:hover:text-[#b0b0b0] disabled:hover:bg-transparent shrink-0">
                    <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a.993.993 0 00-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.06-.87.49-.87.99l.01 4.61c0 .71.73 1.2 1.39.92z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
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
