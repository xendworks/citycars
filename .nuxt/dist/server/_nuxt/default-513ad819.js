import { mergeProps, useSSRContext, defineComponent, provide, shallowReactive, h, ref, inject, Suspense, nextTick, Transition } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc, P as PageRouteSymbol, L as LayoutMetaSymbol, d as appPageTransition, e as _wrapIf, f as appKeepalive, g as useNuxtApp, i as defineStore } from "../server.mjs";
import { RouterView } from "vue-router";
import { defu } from "defu";
import "ofetch";
import "#internal/nitro";
import "hookable";
import "unctx";
import "h3";
import "@vue/devtools-api";
import "destr";
import "devalue";
import "klona";
import "cookie-es";
import "ohash";
const _imports_0 = "" + __buildAssetsURL("logo.115045ff.svg");
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
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
};
const generateRouteKey = (routeProps, override) => {
  const matchedRoute = routeProps.route.matched.find((m) => {
    var _a;
    return ((_a = m.components) == null ? void 0 : _a.default) === routeProps.Component.type;
  });
  const source = override ?? (matchedRoute == null ? void 0 : matchedRoute.meta.key) ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
const RouteProvider = /* @__PURE__ */ defineComponent({
  name: "RouteProvider",
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
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key]
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const __nuxt_component_1 = /* @__PURE__ */ defineComponent({
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
  setup(props, { attrs, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    let vnode;
    const done = nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          if (!routeProps.Component) {
            return;
          }
          const key = generateRouteKey(routeProps, props.pageKey);
          const hasTransition = !!(props.transition ?? routeProps.route.meta.pageTransition ?? appPageTransition);
          const transitionProps = hasTransition && _mergeTransitionProps([
            props.transition,
            routeProps.route.meta.pageTransition,
            appPageTransition,
            { onAfterLeave: () => {
              nuxtApp.callHook("page:transition:finish", routeProps.Component);
            } }
          ].filter(Boolean));
          vnode = _wrapIf(
            Transition,
            hasTransition && transitionProps,
            wrapInKeepAlive(
              props.keepalive ?? routeProps.route.meta.keepalive ?? appKeepalive,
              h(Suspense, {
                suspensible: true,
                onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
                onResolve: () => {
                  nextTick(() => nuxtApp.callHook("page:finish", routeProps.Component).finally(done));
                }
              }, {
                // @ts-expect-error seems to be an issue in vue types
                default: () => h(RouteProvider, {
                  key,
                  vnode: routeProps.Component,
                  route: routeProps.route,
                  renderKey: key,
                  trackRootNodes: hasTransition,
                  vnodeRef: pageRef
                })
              })
            )
          ).default();
          return vnode;
        }
      });
    };
  }
});
function _toArray(val) {
  return Array.isArray(val) ? val : val ? [val] : [];
}
function _mergeTransitionProps(routeProps) {
  const _props = routeProps.map((prop) => ({
    ...prop,
    onAfterLeave: _toArray(prop.onAfterLeave)
  }));
  return defu(..._props);
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
const Footer_vue_vue_type_style_index_0_scoped_dd6dc74c_lang = "";
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
export {
  _default as default
};
//# sourceMappingURL=default-513ad819.js.map
