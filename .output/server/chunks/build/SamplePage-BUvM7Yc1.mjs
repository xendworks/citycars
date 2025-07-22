import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _sfc_main$1 } from './BookingForm-D713lZYZ.mjs';
import { _ as _export_sfc } from './server.mjs';
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

const _sfc_main = {
  __name: "SamplePage",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))} data-v-ac8dec3b><header class="bg-amber-500 text-white py-8" data-v-ac8dec3b><div class="container mx-auto px-4" data-v-ac8dec3b><h1 class="text-3xl font-bold text-center" data-v-ac8dec3b>Sample Booking Page</h1><p class="text-center mt-2" data-v-ac8dec3b>This is a sample page demonstrating the booking form</p></div></header><main class="container mx-auto px-4 py-12" data-v-ac8dec3b><div class="max-w-4xl mx-auto" data-v-ac8dec3b><section class="bg-white rounded-lg shadow-lg p-6 mb-8" data-v-ac8dec3b><h2 class="text-2xl font-semibold mb-6 text-gray-800" data-v-ac8dec3b>Book Your Ride</h2>`);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`</section><section class="bg-white rounded-lg shadow-lg p-6" data-v-ac8dec3b><h2 class="text-2xl font-semibold mb-4 text-gray-800" data-v-ac8dec3b>About Our Service</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-v-ac8dec3b><div class="bg-amber-50 p-4 rounded-lg" data-v-ac8dec3b><h3 class="font-semibold mb-2" data-v-ac8dec3b>24/7 Service</h3><p class="text-gray-600" data-v-ac8dec3b>We&#39;re available round the clock to serve you</p></div><div class="bg-amber-50 p-4 rounded-lg" data-v-ac8dec3b><h3 class="font-semibold mb-2" data-v-ac8dec3b>Professional Drivers</h3><p class="text-gray-600" data-v-ac8dec3b>Experienced and courteous drivers for your comfort</p></div></div></section></div></main></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/SamplePage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SamplePage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ac8dec3b"]]);

export { SamplePage as default };
//# sourceMappingURL=SamplePage-BUvM7Yc1.mjs.map
