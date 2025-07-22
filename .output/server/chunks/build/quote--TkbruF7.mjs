import { ref, computed, mergeProps, readonly, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import { u as useNuxtApp } from './server.mjs';
import 'node:http';
import 'node:https';
import 'node:zlib';
import 'node:stream';
import 'node:buffer';
import 'node:util';
import 'node:url';
import 'node:net';
import 'node:fs';
import 'node:path';
import '../nitro/nitro.mjs';
import 'node:events';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

function useGoogleMapsPlaces() {
  const isLoaded = ref(false);
  const { $googleMaps } = useNuxtApp();
  const loadGoogleMapsApi = async () => {
    try {
      if (!$googleMaps) {
        console.error("Google Maps plugin not available");
        return null;
      }
      const maps = await $googleMaps();
      isLoaded.value = true;
      return maps;
    } catch (error) {
      console.error("Failed to load Google Maps API:", error);
      return null;
    }
  };
  const setupPlacesAutocomplete = async (inputElement) => {
    try {
      const maps = await loadGoogleMapsApi();
      if (!maps || !maps.places) {
        console.error("Google Maps Places API not available");
        return null;
      }
      const autocomplete = new maps.places.Autocomplete(inputElement, {
        types: ["establishment", "geocode"],
        componentRestrictions: { country: "gb" },
        // Restrict to UK
        fields: ["place_id", "formatted_address", "name", "geometry"]
      });
      return autocomplete;
    } catch (error) {
      console.error("Failed to setup Places Autocomplete:", error);
      return null;
    }
  };
  const attachPlaceChangedListener = (autocomplete, callback) => {
    if (!autocomplete) return;
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      callback(place);
    });
  };
  return {
    isLoaded: readonly(isLoaded),
    loadGoogleMapsApi,
    setupPlacesAutocomplete,
    attachPlaceChangedListener
  };
}
const _sfc_main = {
  __name: "quote",
  __ssrInlineRender: true,
  setup(__props) {
    const fromLocation = ref("");
    const toLocation = ref("");
    const passengers = ref(2);
    const luggage = ref(1);
    const pickupDateTime = ref((/* @__PURE__ */ new Date()).toISOString().slice(0, 16));
    useGoogleMapsPlaces();
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    const mapLoaded = ref(false);
    const isLoading = ref(false);
    const hasSearched = ref(false);
    const cabResults = ref([]);
    const selectedCab = ref(null);
    const routeDetails = ref(null);
    const formatPickupDate = computed(() => {
      if (!pickupDateTime.value) return "";
      const date = new Date(pickupDateTime.value);
      return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    });
    const formatPickupTime = computed(() => {
      if (!pickupDateTime.value) return "";
      const date = new Date(pickupDateTime.value);
      return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}><section class="py-8 bg-amber-50"><div class="container mx-auto px-4"><h1 class="text-3xl font-bold mb-4 text-center">Find Available Cabs</h1><p class="max-w-3xl mx-auto text-gray-700 mb-8 text-center"> Enter your journey details below to find the best available cabs for your trip. </p><div class="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mb-8"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"><div class="md:col-span-1 lg:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">From Location</label><input type="text"${ssrRenderAttr("value", fromLocation.value)} placeholder="Eg: Gatwick Airport" class="w-full p-2 border rounded-md text-sm"></div><div class="md:col-span-1 lg:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">To Location</label><input type="text"${ssrRenderAttr("value", toLocation.value)} placeholder="Eg: SW1 7NL" class="w-full p-2 border rounded-md text-sm"></div><div class="md:col-span-1 lg:col-span-1"><label class="block text-sm font-medium text-gray-700 mb-1">Passengers</label><select class="w-full p-2 border rounded-md text-sm"><!--[-->`);
      ssrRenderList(9, (n) => {
        _push(`<option${ssrRenderAttr("value", n)}${ssrIncludeBooleanAttr(Array.isArray(passengers.value) ? ssrLooseContain(passengers.value, n) : ssrLooseEqual(passengers.value, n)) ? " selected" : ""}>${ssrInterpolate(n)}</option>`);
      });
      _push(`<!--]--></select></div><div class="md:col-span-1 lg:col-span-1"><label class="block text-sm font-medium text-gray-700 mb-1">Luggage</label><select class="w-full p-2 border rounded-md text-sm"><!--[-->`);
      ssrRenderList(6, (n) => {
        _push(`<option${ssrRenderAttr("value", n)}${ssrIncludeBooleanAttr(Array.isArray(luggage.value) ? ssrLooseContain(luggage.value, n) : ssrLooseEqual(luggage.value, n)) ? " selected" : ""}>${ssrInterpolate(n)}</option>`);
      });
      _push(`<!--]--></select></div><div class="md:col-span-1 lg:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Pickup Date &amp; Time</label><input type="datetime-local"${ssrRenderAttr("value", pickupDateTime.value)} class="w-full p-2 border rounded-md text-sm"></div><div class="md:col-span-2 lg:col-span-2 flex items-end"><button class="w-full bg-amber-400 hover:bg-amber-500 text-white py-2 px-4 rounded-md font-medium transition duration-300"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""}>`);
      if (isLoading.value) {
        _push(`<span><svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Searching... </span>`);
      } else {
        _push(`<span>Search Available Cabs</span>`);
      }
      _push(`</button></div></div></div></div></section>`);
      if (hasSearched.value) {
        _push(`<section class="py-8"><div class="container mx-auto px-4"><div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2"><h2 class="text-2xl font-bold mb-4">Available Cabs</h2>`);
        if (isLoading.value) {
          _push(`<div class="space-y-4"><!--[-->`);
          ssrRenderList(3, (i) => {
            _push(`<div class="bg-white rounded-lg p-4 shadow-md animate-pulse"><div class="flex items-center space-x-4"><div class="h-16 w-24 bg-gray-300 rounded"></div><div class="flex-1"><div class="h-5 bg-gray-300 rounded w-3/4 mb-2"></div><div class="h-4 bg-gray-300 rounded w-1/2 mb-2"></div><div class="h-4 bg-gray-300 rounded w-1/4"></div></div><div class="h-8 bg-gray-300 rounded w-24"></div></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else if (!cabResults.value.length) {
          _push(`<div class="bg-white rounded-lg p-6 shadow-md text-center"><p class="text-lg text-gray-700">No cabs available for your search criteria.</p><p class="text-sm text-gray-500 mt-2">Try adjusting your passenger count, luggage, or locations.</p></div>`);
        } else {
          _push(`<div class="space-y-4"><!--[-->`);
          ssrRenderList(cabResults.value, (cab) => {
            var _a;
            _push(`<div class="${ssrRenderClass([{ "border-2 border-amber-400": ((_a = selectedCab.value) == null ? void 0 : _a.id) === cab.id }, "bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"])}"><div class="flex items-center space-x-4"><div class="flex-shrink-0"><img${ssrRenderAttr("src", cab.imageUrl)}${ssrRenderAttr("alt", cab.name)} class="h-16 w-auto object-contain"></div><div class="flex-1"><h3 class="text-lg font-semibold">${ssrInterpolate(cab.name)}</h3><div class="text-sm text-gray-600 mt-1"><span class="mr-3">${ssrInterpolate(cab.passengerCapacity)} passengers</span><span>${ssrInterpolate(cab.luggageCapacity)} luggage</span></div><div class="text-xs text-gray-500 mt-1">${ssrInterpolate(cab.description)}</div></div><div class="text-right"><div class="text-lg font-bold">\xA3${ssrInterpolate(cab.price.toFixed(2))}</div><button class="mt-2 bg-amber-400 hover:bg-amber-500 text-white py-1 px-3 rounded-md text-sm transition duration-300"> Book Now </button></div></div></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div><div class="lg:col-span-1"><div class="bg-white rounded-lg shadow-md overflow-hidden mb-6"><h3 class="bg-gray-100 py-2 px-4 font-semibold">Journey Map</h3><div class="${ssrRenderClass([{ "bg-gray-200 animate-pulse": isLoading.value && !mapLoaded.value }, "h-64 w-full"])}"></div></div>`);
        if (routeDetails.value) {
          _push(`<div class="bg-white rounded-lg shadow-md overflow-hidden mb-6"><h3 class="bg-gray-100 py-2 px-4 font-semibold">Journey Details</h3><div class="p-4"><div class="flex justify-between py-2 border-b"><span class="text-gray-600">Distance:</span><span class="font-medium">${ssrInterpolate(routeDetails.value.distance)}</span></div><div class="flex justify-between py-2 border-b"><span class="text-gray-600">Duration:</span><span class="font-medium">${ssrInterpolate(routeDetails.value.duration)}</span></div><div class="flex justify-between py-2"><span class="text-gray-600">Estimated Arrival:</span><span class="font-medium">${ssrInterpolate(routeDetails.value.eta)}</span></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (selectedCab.value) {
          _push(`<div class="bg-white rounded-lg shadow-md overflow-hidden"><h3 class="bg-gray-100 py-2 px-4 font-semibold">Trip Summary</h3><div class="p-4"><div class="flex justify-between py-2 border-b"><span class="text-gray-600">Selected Vehicle:</span><span class="font-medium">${ssrInterpolate(selectedCab.value.name)}</span></div><div class="flex justify-between py-2 border-b"><span class="text-gray-600">Pickup Date:</span><span class="font-medium">${ssrInterpolate(formatPickupDate.value)}</span></div><div class="flex justify-between py-2 border-b"><span class="text-gray-600">Pickup Time:</span><span class="font-medium">${ssrInterpolate(formatPickupTime.value)}</span></div><div class="flex justify-between py-2 border-b"><span class="text-gray-600">Passengers:</span><span class="font-medium">${ssrInterpolate(passengers.value)}</span></div><div class="flex justify-between py-2 border-b"><span class="text-gray-600">Luggage:</span><span class="font-medium">${ssrInterpolate(luggage.value)}</span></div><div class="flex justify-between py-2 border-b font-bold"><span class="text-gray-800">Total Price:</span><span>\xA3${ssrInterpolate(selectedCab.value.price.toFixed(2))}</span></div><div class="mt-4"><button class="w-full bg-amber-400 hover:bg-amber-500 text-white py-2 px-4 rounded-md font-medium transition duration-300"> Confirm Booking </button></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/quote.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=quote--TkbruF7.mjs.map
