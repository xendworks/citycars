import { initializeApp, cert, getApps, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;
let db: Firestore | null = null;

/**
 * Initialize Firebase Admin SDK for server-side use
 */
export function initializeFirebaseAdmin(): Firestore {
  if (db) {
    return db;
  }

  // Check if already initialized
  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0];
    db = getFirestore(adminApp);
    return db;
  }

  try {
    // For development: use project ID directly (no authentication needed for local Firestore emulator)
    // For production: use service account
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : null;

    if (serviceAccount) {
      // Production: Use service account
      adminApp = initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      // Development: Initialize with project ID only
      // This works without authentication in development mode
      const projectId = process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || 'city-cars-83256';
      
      adminApp = initializeApp({
        projectId: projectId,
        // In development, Firestore will use Application Default Credentials
        // or work without auth if using emulator
      });
      
    }

    db = getFirestore(adminApp);
    return db;
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    throw error;
  }
}

/**
 * Get Firestore database instance
 */
export function getDb(): Firestore {
  if (!db) {
    return initializeFirebaseAdmin();
  }
  return db;
}

/**
 * Collections helper
 */
export const collections = {
  users: () => getDb().collection('users'),
  drivers: () => getDb().collection('drivers'),
  bookings: () => getDb().collection('bookings'),
  pricingRules: () => getDb().collection('pricingRules'),
  walletData: () => getDb().collection('walletData'),
  walletTransactions: () => getDb().collection('walletTransactions'),
  routes: () => getDb().collection('routes'),
  offers: () => getDb().collection('offers'),
};

/**
 * Generate a unique booking reference
 */
export function generateBookingReference(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CC${year}${month}${day}${random}`;
}

/**
 * Transaction helper
 */
export async function runTransaction<T>(
  callback: (transaction: FirebaseFirestore.Transaction) => Promise<T>
): Promise<T> {
  const db = getDb();
  return db.runTransaction(callback);
}
