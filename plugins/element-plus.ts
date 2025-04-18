// @ts-ignore
import { defineNuxtPlugin } from 'nuxt/app'
import ElementPlus from 'element-plus'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ElementPlus)
}) 