// Generated by @nuxtjs/i18n
import type { ExportedGlobalComposer, Composer } from 'vue-i18n'
<<<<<<< HEAD
import type { NuxtI18nRoutingCustomProperties, ComposerCustomProperties } from '../../node_modules/@nuxtjs/i18n/dist/runtime/types.ts'
import type { Strategies, Directions, LocaleObject } from '../../node_modules/@nuxtjs/i18n/dist/types.d.ts'
=======
import type { NuxtI18nRoutingCustomProperties, ComposerCustomProperties } from '/Users/saicharan/Documents/GitHub/node_modules/@nuxtjs/i18n/dist/runtime/types.ts'
import type { Strategies, Directions, LocaleObject } from '/Users/saicharan/Documents/GitHub/node_modules/@nuxtjs/i18n/dist/types.d.ts'
>>>>>>> 0bcbd26207b8e512eb211e4c199dc2e160ff7a08

declare module 'vue-i18n' {
  interface ComposerCustom extends ComposerCustomProperties<LocaleObject[]> {}
  interface ExportedGlobalComposer extends NuxtI18nRoutingCustomProperties<LocaleObject[]> {}
  interface VueI18n extends NuxtI18nRoutingCustomProperties<LocaleObject[]> {}
}

declare module '#app' {
  interface NuxtApp {
    $i18n: ExportedGlobalComposer & Composer & NuxtI18nRoutingCustomProperties<LocaleObject[]>
  }
}

<<<<<<< HEAD


=======
>>>>>>> 0bcbd26207b8e512eb211e4c199dc2e160ff7a08
export {}