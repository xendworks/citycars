import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.client) {
    const ElementPlus = await import('element-plus')
    nuxtApp.vueApp.use(ElementPlus.default as any)
  }
}) 