import { initializeApp, getApps } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import type { Analytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';

let app: FirebaseApp;
let analytics: Analytics | null = null;
let auth: Auth;

export default defineNuxtPlugin(() => {
  if (process.client) {
    const config = useRuntimeConfig();

    // Firebase configuration
    const firebaseConfig = {
      apiKey: String(config.public.firebaseApiKey || "AIzaSyBuUPDFnKHfH21vaclS5CaK8O7qV41l8X0"),
      authDomain: String(config.public.firebaseAuthDomain || "city-cars-83256.firebaseapp.com"),
      projectId: String(config.public.firebaseProjectId || "city-cars-83256"),
      storageBucket: String(config.public.firebaseStorageBucket || "city-cars-83256.firebasestorage.app"),
      messagingSenderId: String(config.public.firebaseMessagingSenderId || "413911303220"),
      appId: String(config.public.firebaseAppId || "1:413911303220:web:e18b7b14c3eba16fcb7661"),
      measurementId: String(config.public.firebaseMeasurementId || "G-NPXSZ0VECD")
    };

    // Initialize Firebase only if not already initialized
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    // Initialize Analytics (only in browser, not SSR)
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app);
    }

    // Initialize Auth
    auth = getAuth(app);

    return {
      provide: {
        firebase: app,
        firebaseAuth: auth,
        firebaseAnalytics: analytics
      }
    };
  }
});

