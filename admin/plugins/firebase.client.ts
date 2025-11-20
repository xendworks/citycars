import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: String(config.public.firebaseApiKey || 'AIzaSyBuUPDFnKHfH21vaclS5CaK8O7qV41l8X0'),
    authDomain: String(config.public.firebaseAuthDomain || 'city-cars-83256.firebaseapp.com'),
    projectId: String(config.public.projectId || 'city-cars-83256'),
    storageBucket: String(config.public.storageBucket || 'city-cars-83256.firebasestorage.app'),
    messagingSenderId: String(config.public.messagingSenderId || '413911303220'),
    appId: String(config.public.appId || '1:413911303220:web:e18b7b14c3eba16fcb7661'),
    measurementId: String(config.public.measurementId || 'G-NPXSZ0VECD')
  };
  
  console.log('[ADMIN FIREBASE] Initializing with config:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain
  });

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  return {
    provide: {
      firebase: app,
      firestore: db,
      firebaseAuth: auth
    }
  };
});

