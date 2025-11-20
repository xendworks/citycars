export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ["@/assets/styles/main.scss"],
  
  // Main app runs on port 3000
  devServer: {
    port: 3000
  },

  // Proxy /admin requests to admin portal on port 4000
  nitro: {
    devProxy: {
      '/admin': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        ws: true
      }
    }
  },
  plugins: [
    { src: '~/plugins/firebase.client.ts', mode: 'client' },
    { src: '~/plugins/auth-init.client.ts', mode: 'client' },
    { src: '~/plugins/chat.client.ts', mode: 'client' },
    { src: '~/plugins/cookie-consent.client.ts', mode: 'client' },
    { src: '~/plugins/google-maps.client.js', mode: 'client' },
  ],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt'
  ],
  piniaPersistedstate: {
    storage: 'localStorage'
  },
  tailwindcss: {
    cssPath: '~/assets/styles/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: true,
  },
  typescript: {
    strict: false,
    typeCheck: false
  },
  build: {
    transpile: ['@googlemaps/js-api-loader']
  },
  runtimeConfig: {
    // Private keys (server-side only) - For Firebase Admin SDK
    firebaseServiceAccount: process.env.FIREBASE_SERVICE_ACCOUNT,
    // Public keys (exposed to client)
    public: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      apiUrl: process.env.NUXT_PUBLIC_API_URL || '/api',
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBuUPDFnKHfH21vaclS5CaK8O7qV41l8X0",
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "city-cars-83256.firebaseapp.com",
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || "city-cars-83256",
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "city-cars-83256.firebasestorage.app",
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "413911303220",
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || "1:413911303220:web:e18b7b14c3eba16fcb7661",
      firebaseMeasurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-NPXSZ0VECD"
    }
  }
});
