import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
import "ofetch";
import "#internal/nitro";
import "hookable";
import "unctx";
import "vue-router";
import "h3";
import "@vue/devtools-api";
import "destr";
import "devalue";
import "klona";
import "cookie-es";
import "ohash";
const _imports_0 = "" + __buildAssetsURL("coming-soon.28791228.svg");
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "cc-coming-soon container" }, _attrs))}><div class="center-aligned-section cc-banner-section"><h1 class="poppins-bold">Coming Soon</h1><h3><span class="base-highlighter">Book affordable </span>and reliable taxis and minicabs from Gatwick Airport. </h3><p>Enjoy a smooth and hassle-free journey with professional drivers and convenient service options tailored to your needs.</p><img class="m-w-1000"${ssrRenderAttr("src", _imports_0)}></div></section>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  index as default
};
//# sourceMappingURL=index-7376c7c5.js.map
