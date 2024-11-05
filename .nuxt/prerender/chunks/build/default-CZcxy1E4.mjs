import { a as buildAssetsURL } from '../_/renderer.mjs';
import { defineComponent, provide, shallowReactive, h, ref, inject, watch, Suspense, nextTick, Fragment, Transition, useSSRContext, mergeProps } from 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent } from 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/vue/server-renderer/index.mjs';
import { P as PageRouteSymbol, b as useNuxtApp, L as LayoutMetaSymbol, g as generateRouteKey$1, f as appPageTransition, k as appKeepalive, l as _wrapIf, m as wrapInKeepAlive, t as toArray$1, _ as _export_sfc, o as defineStore } from './server.mjs';
import { RouterView } from 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/vue-router/dist/vue-router.node.mjs';
import { defu } from 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/defu/dist/defu.mjs';
import 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/h3/dist/index.mjs';
import 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/devalue/index.js';
import '../_/nitro.mjs';
import 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/destr/dist/index.mjs';
import 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/hookable/dist/index.mjs';
import 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/ofetch/dist/node.mjs';
import 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/unenv/runtime/fetch/index.mjs';
import 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/klona/dist/index.mjs';
import 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/scule/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/pathe/dist/index.mjs';
import 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/ohash/dist/index.mjs';
import 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/unstorage/dist/index.mjs';
import 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/unstorage/drivers/fs.mjs';
import 'file:///C:/Sathish/Source%20Code/citycars-main/node_modules/nuxt/dist/core/runtime/nitro/cache-driver.js';
import 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/radix3/dist/index.mjs';
import 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/@unhead/ssr/dist/index.mjs';
import 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/unhead/dist/index.mjs';
import 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/@unhead/shared/dist/index.mjs';
import 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/unctx/dist/index.mjs';
import 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/vue-devtools-stub/dist/index.mjs';
import 'file://C:/Sathish/Source%20Code/citycars-main/node_modules/cookie-es/dist/index.mjs';

const _imports_0 = "" + buildAssetsURL("logo.CYJ6dZn1.svg");
const _sfc_main$2 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "cc-navbar container-md" }, _attrs))}><div class="navbar-left"><img${ssrRenderAttr("src", _imports_0)} alt="Logo" class="cc-navbar-logo"></div><div class="navbar-right"><button class="chat-btn">Chat with us</button></div></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Navbar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1]]);
const RouteProvider = defineComponent({
  props: {
    vnode: {
      type: Object,
      required: true
    },
    route: {
      type: Object,
      required: true
    },
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const __nuxt_component_1 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    const forkRoute = inject(PageRouteSymbol, null);
    let previousPageKey;
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    let vnode;
    const done = nuxtApp.deferHydration();
    if (props.pageKey) {
      watch(() => props.pageKey, (next, prev) => {
        if (next !== prev) {
          nuxtApp.callHook("page:loading:start");
        }
      });
    }
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          var _a, _b, _c, _d;
          if (!routeProps.Component) {
            done();
            return;
          }
          const key = generateRouteKey$1(routeProps, props.pageKey);
          if (!nuxtApp.isHydrating && !hasChildrenRoutes(forkRoute, routeProps.route, routeProps.Component) && previousPageKey === key) {
            nuxtApp.callHook("page:loading:end");
          }
          previousPageKey = key;
          const hasTransition = !!((_b = (_a = props.transition) != null ? _a : routeProps.route.meta.pageTransition) != null ? _b : appPageTransition);
          const transitionProps = hasTransition && _mergeTransitionProps([
            props.transition,
            routeProps.route.meta.pageTransition,
            appPageTransition,
            { onAfterLeave: () => {
              nuxtApp.callHook("page:transition:finish", routeProps.Component);
            } }
          ].filter(Boolean));
          const keepaliveConfig = (_d = (_c = props.keepalive) != null ? _c : routeProps.route.meta.keepalive) != null ? _d : appKeepalive;
          vnode = _wrapIf(
            Transition,
            hasTransition && transitionProps,
            wrapInKeepAlive(
              keepaliveConfig,
              h(Suspense, {
                suspensible: true,
                onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
                onResolve: () => {
                  nextTick(() => nuxtApp.callHook("page:finish", routeProps.Component).then(() => nuxtApp.callHook("page:loading:end")).finally(done));
                }
              }, {
                default: () => {
                  const providerVNode = h(RouteProvider, {
                    key: key || void 0,
                    vnode: slots.default ? h(Fragment, void 0, slots.default(routeProps)) : routeProps.Component,
                    route: routeProps.route,
                    renderKey: key || void 0,
                    trackRootNodes: hasTransition,
                    vnodeRef: pageRef
                  });
                  return providerVNode;
                }
              })
            )
          ).default();
          return vnode;
        }
      });
    };
  }
});
function _mergeTransitionProps(routeProps) {
  const _props = routeProps.map((prop) => ({
    ...prop,
    onAfterLeave: prop.onAfterLeave ? toArray$1(prop.onAfterLeave) : void 0
  }));
  return defu(..._props);
}
function hasChildrenRoutes(fork, newRoute, Component) {
  if (!fork) {
    return false;
  }
  const index = newRoute.matched.findIndex((m) => {
    var _a;
    return ((_a = m.components) == null ? void 0 : _a.default) === (Component == null ? void 0 : Component.type);
  });
  return index < newRoute.matched.length - 1;
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "footer" }, _attrs))} data-v-dd6dc74c><div class="footer-left" data-v-dd6dc74c><img${ssrRenderAttr("src", _imports_0)} alt="Logo" class="footer-logo" data-v-dd6dc74c></div><div class="footer-right" data-v-dd6dc74c><div class="footer-contact" data-v-dd6dc74c><p data-v-dd6dc74c><a href="mailto:citycarsgatwick@gmail.com" data-v-dd6dc74c>citycarsgatwick@gmail.com</a></p><p data-v-dd6dc74c><a href="tel:+1234567890" data-v-dd6dc74c>+123 456 7890</a></p><p data-v-dd6dc74c>Copyrights 2024. City Cars Gatwick Ltd.</p></div></div></footer>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Footer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-dd6dc74c"]]);
const useThemeStore = defineStore({
  id: "boolean",
  state: () => ({
    isDarkTheme: false,
    primaryBgColor: "#7059DE",
    secondaryBgColor: "#5E45D3",
    currentComponentName: ref("DefaultFooter"),
    canClose: false,
    defaultScreenOne: true,
    defaultScreenTwo: true,
    defaultScreenThree: true,
    defaultScreenFour: true
  }),
  actions: {
    setDarkTheme(value) {
      this.isDarkTheme = value;
    },
    setPrimaryBgColor(color) {
      this.primaryBgColor = color;
    },
    setSecondaryBgColor(color) {
      this.secondaryBgColor = color;
    },
    setCtaBgColor(color) {
      this.ctaBgColor = color;
    },
    updateComponentName(name) {
      this.currentComponentName = name;
    },
    updateScreenStatus(screen) {
      this[screen] = !this[screen];
    }
  }
});
const _sfc_main = {
  components: { Navbar: __nuxt_component_0, Footer: __nuxt_component_2 },
  computed: {
    isDarkTheme() {
      const themeStore = useThemeStore();
      return themeStore.isDarkTheme;
    }
  },
  methods: {
    updateDarkTheme(isDark) {
      const themeStore = useThemeStore();
      themeStore.setIsDarkTheme(isDark);
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Navbar = __nuxt_component_0;
  const _component_NuxtPage = __nuxt_component_1;
  const _component_Footer = __nuxt_component_2;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Navbar, null, null, _parent));
  _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
  _push(ssrRenderComponent(_component_Footer, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _default as default };
//# sourceMappingURL=default-CZcxy1E4.mjs.map
