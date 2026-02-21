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
    companyName?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    specialRequirements?: string | null;
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
        companyName: data.companyName || null,
        emergencyContactName: data.emergencyContactName || null,
        emergencyContactPhone: data.emergencyContactPhone || null,
        specialRequirements: data.specialRequirements || null,
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
      } else {
        // Update existing document
        await setDoc(userRef, userData, { merge: true });
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
        
        return bookings;
      }
    } catch (error: any) {
      console.error('[FIRESTORE] ❌ Error fetching bookings:', error);
      console.error('[FIRESTORE] ❌ Error code:', error.code);
      console.error('[FIRESTORE] ❌ Error details:', error);
      throw error;
    }
  };

  // Delete user account and all associated data (client-side)
  const deleteUserAccount = async (userId: string) => {
    try {
      const { getDocs, query, where, deleteDoc, writeBatch } = await import('firebase/firestore');
      
      const batch = writeBatch(db);
      let deletionCount = 0;
      
      // 1. Delete user profile
      const userRef = doc(db, 'users', userId);
      batch.delete(userRef);
      deletionCount++;
      
      // 2. Delete all user bookings
      const bookingsRef = collection(db, 'bookings');
      const bookingsQuery = query(bookingsRef, where('userId', '==', userId));
      const bookingsSnapshot = await getDocs(bookingsQuery);
      
      bookingsSnapshot.docs.forEach((bookingDoc) => {
        batch.delete(bookingDoc.ref);
        deletionCount++;
      });
      
      // 3. Delete wallet data
      const walletRef = doc(db, 'walletData', userId);
      batch.delete(walletRef);
      deletionCount++;
      
      // 4. Delete wallet transactions
      const transactionsRef = collection(db, 'walletTransactions');
      const transactionsQuery = query(transactionsRef, where('uid', '==', userId));
      const transactionsSnapshot = await getDocs(transactionsQuery);
      
      transactionsSnapshot.docs.forEach((transactionDoc) => {
        batch.delete(transactionDoc.ref);
        deletionCount++;
      });
      
      // Commit the batch
      await batch.commit();
      
      return { success: true, deletedCount: deletionCount };
    } catch (error: any) {
      console.error('[FIRESTORE] ❌ Error deleting user account:', error);
      throw error;
    }
  };

  // Get active offers from Firestore
  const getActiveOffers = async () => {
    try {
      const { getDocs, query, where, collection } = await import('firebase/firestore');
      
      const q = query(
        collection(db, 'offers'),
        where('isActive', '==', true)
      );
      
      const snap = await getDocs(q);
      const now = new Date();
      
      const activeOffers = snap.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter((offer: any) => {
          if (!offer.validUntil) return true;
          const expiry = offer.validUntil?.toDate ? offer.validUntil.toDate() : new Date(offer.validUntil);
          return expiry > now;
        });
        
      return activeOffers;
    } catch (error: any) {
      console.error('[FIRESTORE] ❌ Error fetching active offers:', error);
      return [];
    }
  };

  // Update booking status
  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { updateDoc } = await import('firebase/firestore');
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error: any) {
      console.error('[FIRESTORE] ❌ Error updating booking status:', error);
      throw error;
    }
  };

  return {
    saveUserProfile,
    getUserProfile,
    createBooking,
    getUserBookings,
    deleteUserAccount,
    getActiveOffers,
    updateBookingStatus,
    db
  };
};

