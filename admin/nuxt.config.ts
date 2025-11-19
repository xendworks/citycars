// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  // Development server configuration
  devServer: {
    port: 4000, // Admin runs on port 4000
    host: 'localhost'
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  css: [
    '~/assets/css/global.css'
  ],

  runtimeConfig: {
    // Private keys (server-side only)
    private: {
      firebaseServiceAccount: process.env.FIREBASE_SERVICE_ACCOUNT,
    },
    // Public keys (exposed to client)
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || '/api',
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBuUPDFnKHfH21vaclS5CaK8O7qV41l8X0",
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "city-cars-83256.firebaseapp.com",
      projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || "city-cars-83256",
      storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "city-cars-83256.firebasestorage.app",
      messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "413911303220",
      appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || "1:413911303220:web:e18b7b14c3eba16fcb7661",
      measurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-NPXSZ0VECD"
    }
  },

  typescript: {
    strict: false,
    typeCheck: false
  },

  app: {
    head: {
      title: 'CityCars Admin Portal',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'CityCars Admin Management Portal' }
      ]
    }
  }
})

