import { getFirestore, doc, setDoc, getDoc, collection, addDoc, Timestamp } from 'firebase/firestore';

export const useFirestore = () => {
  // Only run on client side
  if (process.server) {
    throw new Error('useFirestore can only be used on the client side');
  }

  const { $firebase } = useNuxtApp();
  
  if (!$firebase) {
    throw new Error('Firebase not initialized');
  }

  const db = getFirestore($firebase as any);

  // Save user profile to Firestore (client-side)
  const saveUserProfile = async (uid: string, data: {
    email: string;
    displayName?: string | null;
    phoneNumber?: string | null;
    photoURL?: string | null;
    preferredPickupLocations?: string[];
    preferredDropoffLocations?: string[];
  }) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);

      const userData = {
        uid,
        email: data.email,
        displayName: data.displayName || null,
        phoneNumber: data.phoneNumber || null,
        photoURL: data.photoURL || null,
        preferredPickupLocations: data.preferredPickupLocations || [],
        preferredDropoffLocations: data.preferredDropoffLocations || [],
        updatedAt: new Date().toISOString()
      };

      if (!userDoc.exists()) {
        // Create new document
        await setDoc(userRef, {
          ...userData,
          createdAt: new Date().toISOString()
        });
        console.log('✓ User profile created in Firestore');
      } else {
        // Update existing document
        await setDoc(userRef, userData, { merge: true });
        console.log('✓ User profile updated in Firestore');
      }

      return { success: true, user: userData };
    } catch (error: any) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  };

  // Get user profile from Firestore (client-side)
  const getUserProfile = async (uid: string) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return null;
      }

      return userDoc.data();
    } catch (error: any) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  };

  // Create booking in Firestore (client-side)
  const createBooking = async (bookingData: any) => {
    try {
      console.log('[FIRESTORE] Creating booking:', bookingData);
      
      // Generate booking reference with format CTY{8 digit random number}
      const randomNumber = Math.floor(10000000 + Math.random() * 90000000); // 8 digit number
      const bookingReference = `CTY${randomNumber}`;
      
      const bookingDoc = {
        ...bookingData,
        bookingReference,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: bookingData.bookingStatus || 'pending',
        paymentStatus: 'pending',
        driverId: null,
        completedAt: null
      };
      
      const bookingsRef = collection(db, 'bookings');
      const docRef = await addDoc(bookingsRef, bookingDoc);
      
      console.log('[FIRESTORE] ✅ Booking created with ID:', docRef.id);
      
      return {
        success: true,
        id: docRef.id,
        bookingReference,
        data: bookingDoc
      };
    } catch (error: any) {
      console.error('[FIRESTORE] ❌ Error creating booking:', error);
      throw error;
    }
  };
  
  // Get user bookings from Firestore (client-side)
  const getUserBookings = async (userId: string) => {
    try {
      console.log('[FIRESTORE] Fetching bookings for user:', userId);
      const { getDocs, query, where, orderBy, limit: firestoreLimit } = await import('firebase/firestore');
      
      const bookingsRef = collection(db, 'bookings');
      
      // Try querying with where + orderBy (requires Firestore index)
      try {
        const q = query(
          bookingsRef,
          where('userId', '==', userId),
          orderBy('createdAt', 'desc'),
          firestoreLimit(50)
        );
        
        const querySnapshot = await getDocs(q);
        const bookings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log('[FIRESTORE] ✅ Found', bookings.length, 'bookings');
        return bookings;
      } catch (indexError: any) {
        // If index error, try simple query without orderBy
        console.warn('[FIRESTORE] ⚠️  Index not found, using simple query:', indexError.message);
        
        const simpleQuery = query(
          bookingsRef,
          where('userId', '==', userId),
          firestoreLimit(50)
        );
        
        const querySnapshot = await getDocs(simpleQuery);
        const bookings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort in memory
        bookings.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
        
        console.log('[FIRESTORE] ✅ Found', bookings.length, 'bookings (sorted in memory)');
        return bookings;
      }
    } catch (error: any) {
      console.error('[FIRESTORE] ❌ Error fetching bookings:', error);
      console.error('[FIRESTORE] ❌ Error code:', error.code);
      console.error('[FIRESTORE] ❌ Error details:', error);
      throw error;
    }
  };

  return {
    saveUserProfile,
    getUserProfile,
    createBooking,
    getUserBookings,
    db
  };
};

