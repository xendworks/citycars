import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(async (nuxtApp) => {
  const ElementPlus = await import('element-plus')
  nuxtApp.vueApp.use(ElementPlus.default as any)
})