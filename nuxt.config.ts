export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ["@/assets/styles/main.scss"],
  plugins: [
    { src: '~/plugins/chat.ts', mode: 'client' },
    { src: '~/plugins/element-plus.ts', mode: 'client' },
    // { src: '~/plugins/google-maps.client.js', mode: 'client' },
  ],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  tailwindcss: {
    cssPath: '~/assets/styles/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: true,
  },
  typescript: {
    strict: true,
    typeCheck: true
  },
  build: {
    transpile: ['@googlemaps/js-api-loader']
  },
  runtimeConfig: {
    public: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
    }
  }
});
