import type { Auth } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';
import type { Analytics } from 'firebase/analytics';

declare module '#app' {
  interface NuxtApp {
    $firebase: FirebaseApp;
    $firebaseAuth: Auth;
    $firebaseAnalytics: Analytics | null;
  }
}

export {};

