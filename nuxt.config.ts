export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  css: ["@/assets/styles/main.scss"],
  plugins: [
    { src: '~/plugins/chat.ts', mode: 'client' },
    { src: '~/plugins/element-plus.ts', mode: 'client' }
  ],
  modules: ["@nuxtjs/i18n", '@pinia/nuxt', '@nuxtjs/tailwindcss'],
  tailwindcss: {
    cssPath: '~/assets/styles/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: true,
  }
})