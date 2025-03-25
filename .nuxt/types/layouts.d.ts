import type { ComputedRef, MaybeRef } from 'vue'
export type LayoutKey = "default"
declare module "../../node_modules/.pnpm/nuxt@3.16.1_@parcel+watcher@2.5.1_@types+node@22.13.11_db0@0.3.1_ioredis@5.6.0_magicast@0.3.5_5cx2njwgs7khn4vs3pcyfelhvm/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false>
  }
}