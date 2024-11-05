<<<<<<< HEAD
import type { ComputedRef, MaybeRef } from 'vue'
export type LayoutKey = "default"
declare module "../../node_modules/nuxt/dist/pages/runtime/composables" {
=======
import { ComputedRef, MaybeRef } from 'vue'
export type LayoutKey = "default"
declare module "../../../node_modules/nuxt/dist/pages/runtime/composables" {
>>>>>>> 0bcbd26207b8e512eb211e4c199dc2e160ff7a08
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false>
  }
}