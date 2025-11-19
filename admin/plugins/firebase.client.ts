import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: String(config.public.firebaseApiKey),
    authDomain: String(config.public.firebaseAuthDomain),
    projectId: String(config.public.projectId),
    storageBucket: String(config.public.storageBucket),
    messagingSenderId: String(config.public.messagingSenderId),
    appId: String(config.public.appId),
    measurementId: String(config.public.measurementId)
  };

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

