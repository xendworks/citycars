export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  // Trigger update
  devtools: { enabled: true },
  app: {
    head: {
      script: [
        {
          innerHTML: `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "vjoxcl3fge");`,
          type: 'text/javascript'
        }
      ]
    }
  },
  css: [
    "element-plus/dist/index.css",
    "@/assets/styles/main.scss"
  ],
  
  // Serve static files like sitemap.xml directly (bypass [slug].vue catch-all)
  nitro: {
    publicAssets: [
      {
        baseURL: '/',
        dir: 'public',
        maxAge: 60 * 60 * 24 // 24 hours cache
      }
    ]
  },
  
  // Route rules to ensure sitemap.xml is served as static file
  routeRules: {
    '/**': {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
        'Cross-Origin-Embedder-Policy': 'unsafe-none'
      }
    },
    '/sitemap.xml': { prerender: true },
    '/robots.txt': { prerender: true }
  },
  
  // Main app with integrated admin portal
  devServer: {
    port: 3000
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt'
  ],
  piniaPluginPersistedstate: {
    storage: 'localStorage'
  },
  tailwindcss: {
    cssPath: '~/assets/styles/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: true
  },
  
  // Fix CSS flash (FOUC) on page navigation - inline critical CSS
  features: {
    inlineStyles: true
  },
  typescript: {
    strict: false,
    typeCheck: false
  },
  
  // Fix FOUC (Flash of Unstyled Content) during navigation
  experimental: {},
  
  build: {
    transpile: ['@googlemaps/js-api-loader', '@popperjs/core']
  },
  vite: {
    optimizeDeps: {
      include: ['@popperjs/core']
    }
  },
  runtimeConfig: {
    // Private keys (server-side only) - For Firebase Admin SDK
    firebaseServiceAccount: process.env.FIREBASE_SERVICE_ACCOUNT,
    // Public keys (exposed to client)
    public: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      apiUrl: process.env.NUXT_PUBLIC_API_URL,
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    }
  }
});
