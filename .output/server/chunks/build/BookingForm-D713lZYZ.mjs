import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { d as defineStore } from './server.mjs';

const useBookingStore = defineStore("booking", {
  state: () => ({
    bookingData: null
  }),
  actions: {
    setBookingData(data) {
      this.bookingData = data;
    }
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BookingForm",
  __ssrInlineRender: true,
  emits: ["search"],
  setup(__props, { emit: __emit }) {
    useBookingStore();
    const pickupLocation = ref("");
    const dropoffLocation = ref("");
    ref(null);
    ref(null);
    const selectedDate = ref("");
    const selectedTime = ref("");
    const passengersCount = ref(1);
    const luggageCount = ref(0);
    ref("default");
    const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
      const hour = Math.floor(i / 4);
      const minute = i % 4 * 15;
      return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-lg mx-auto p-6" }, _attrs))}><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="relative"><label class="block text-sm font-medium text-gray-700">Pick-up Location</label><input${ssrRenderAttr("value", pickupLocation.value)} type="text" placeholder="Start typing a location..." class="w-full p-2 border rounded-md text-sm"></div><div class="relative"><label class="block text-sm font-medium text-gray-700">Drop-off Location</label><input${ssrRenderAttr("value", dropoffLocation.value)} type="text" placeholder="Enter drop-off location..." class="w-full p-2 border rounded-md text-sm"></div><div class="md:col-span-1"><label class="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label><input type="date"${ssrRenderAttr("value", selectedDate.value)} class="w-full p-2 border rounded-md text-sm"${ssrRenderAttr("min", (/* @__PURE__ */ new Date()).toISOString().split("T")[0])}></div><div class="md:col-span-1"><label class="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label><select class="w-full p-2 border rounded-md text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(selectedTime.value) ? ssrLooseContain(selectedTime.value, "") : ssrLooseEqual(selectedTime.value, "")) ? " selected" : ""}>Select time</option><!--[-->`);
      ssrRenderList(unref(timeSlots), (time) => {
        _push(`<option${ssrRenderAttr("value", time)}${ssrIncludeBooleanAttr(Array.isArray(selectedTime.value) ? ssrLooseContain(selectedTime.value, time) : ssrLooseEqual(selectedTime.value, time)) ? " selected" : ""}>${ssrInterpolate(time)}</option>`);
      });
      _push(`<!--]--></select></div><div class="md:col-span-1"><label class="block text-sm font-medium text-gray-700 mb-1 font-lexend">Passengers</label><select class="w-full p-2 border rounded-md text-sm font-inter"><option${ssrIncludeBooleanAttr(Array.isArray(passengersCount.value) ? ssrLooseContain(passengersCount.value, null) : ssrLooseEqual(passengersCount.value, null)) ? " selected" : ""}>1</option><option${ssrIncludeBooleanAttr(Array.isArray(passengersCount.value) ? ssrLooseContain(passengersCount.value, null) : ssrLooseEqual(passengersCount.value, null)) ? " selected" : ""}>2</option><option${ssrIncludeBooleanAttr(Array.isArray(passengersCount.value) ? ssrLooseContain(passengersCount.value, null) : ssrLooseEqual(passengersCount.value, null)) ? " selected" : ""}>3</option><option${ssrIncludeBooleanAttr(Array.isArray(passengersCount.value) ? ssrLooseContain(passengersCount.value, null) : ssrLooseEqual(passengersCount.value, null)) ? " selected" : ""}>4</option></select></div><div class="md:col-span-1 flex flex-col"><label class="block text-sm font-medium text-gray-700 mb-1 font-lexend">Luggages</label><div class="flex items-center"><select class="w-full p-2 border rounded-md text-sm font-inter"><option${ssrIncludeBooleanAttr(Array.isArray(luggageCount.value) ? ssrLooseContain(luggageCount.value, null) : ssrLooseEqual(luggageCount.value, null)) ? " selected" : ""}>0</option><option${ssrIncludeBooleanAttr(Array.isArray(luggageCount.value) ? ssrLooseContain(luggageCount.value, null) : ssrLooseEqual(luggageCount.value, null)) ? " selected" : ""}>1</option><option${ssrIncludeBooleanAttr(Array.isArray(luggageCount.value) ? ssrLooseContain(luggageCount.value, null) : ssrLooseEqual(luggageCount.value, null)) ? " selected" : ""}>2</option><option${ssrIncludeBooleanAttr(Array.isArray(luggageCount.value) ? ssrLooseContain(luggageCount.value, null) : ssrLooseEqual(luggageCount.value, null)) ? " selected" : ""}>3</option></select><button class="ml-2 bg-amber-400 hover:bg-amber-500 text-white p-2 rounded-md transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg></button></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BookingForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=BookingForm-D713lZYZ.mjs.map
