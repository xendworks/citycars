import { getFirestore, collection, getDocs, getDoc, doc, updateDoc, setDoc, addDoc, deleteDoc, query, where, orderBy, limit, Timestamp, getCountFromServer, startAfter, onSnapshot, serverTimestamp } from 'firebase/firestore';

export const useAdminFirestore = () => {
  if (process.server) {
    throw new Error('useAdminFirestore can only be used on the client side');
  }

  const { $firebase } = useNuxtApp();
  
  if (!$firebase) {
    throw new Error('Firebase not initialized');
  }
  
  const db = getFirestore($firebase as any);

  // =====================================
  // BOOKINGS
  // =====================================
  
  const getCollectionCount = async (collectionName: string, filters?: any) => {
    try {
      let q = query(collection(db, collectionName));
      
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }
      
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count;
    } catch (error) {
      console.error(`[ADMIN] Error counting ${collectionName}:`, error);
      return 0;
    }
  };

  const getBookingsPage = async (page: number, pageSize: number, filters?: any) => {
    try {
      
      let baseQuery = query(collection(db, 'bookings'));
      let sortField = filters?.searchQuery ? '' : (filters?.time ? 'pickupDateTime' : 'createdAt');
      
      // Handle Search (Server-side prefix search)
      if (filters?.searchQuery) {
        const queryTerm = filters.searchQuery.trim();
        let searchField = 'bookingReference'; // Default
        
        if (filters.searchFilter === 'customer') searchField = 'userName';
        else if (filters.searchFilter === 'phone') searchField = 'userPhone';
        else if (filters.searchFilter === 'email') searchField = 'userEmail';
        
        // When searching, we must sort by the searched field first
        baseQuery = query(
          baseQuery, 
          where(searchField, '>=', queryTerm), 
          where(searchField, '<=', queryTerm + '\uf8ff'),
          orderBy(searchField, 'asc')
        );
      } else {
        // Handle Time Filtering - Only if NOT searching (to avoid complex index requirements)
        if (filters?.time) {
          const now = new Date();
          const startOfToday = new Date(now.setHours(0, 0, 0, 0)).toISOString();
          const endOfToday = new Date(now.setHours(23, 59, 59, 999)).toISOString();

          if (filters.time === 'today') {
            baseQuery = query(baseQuery, where('pickupDateTime', '>=', startOfToday), where('pickupDateTime', '<=', endOfToday));
          } else if (filters.time === 'past') {
            baseQuery = query(baseQuery, where('pickupDateTime', '<', startOfToday));
          } else if (filters.time === 'future') {
            baseQuery = query(baseQuery, where('pickupDateTime', '>', endOfToday));
          }
        }
        
        // Add default ordering
        baseQuery = query(baseQuery, orderBy(sortField, filters?.time === 'future' ? 'asc' : 'desc'));
      }

      if (filters?.status) {
        baseQuery = query(baseQuery, where('status', '==', filters.status));
      }

      // Fetch total count for these filters
      const countSnapshot = await getCountFromServer(baseQuery);
      const totalCount = countSnapshot.data().count;

      // Fetch data for the current view
      const totalToFetch = page * pageSize;
      const limitedQuery = query(baseQuery, limit(totalToFetch));
      const snapshot = await getDocs(limitedQuery);
      
      const allDocs = snapshot.docs;
      const startIdx = (page - 1) * pageSize;
      const pageDocs = allDocs.slice(startIdx, startIdx + pageSize);
      
      const items = pageDocs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return {
        items,
        total: totalCount
      };
    } catch (error: any) {
      if (error.message?.includes('requires an index')) {
        console.error('[ADMIN] 🛠️ Index required for this search/filter combination! Click the link in the error log.');
      }
      console.error('[ADMIN] ❌ Error loading bookings page:', error);
      throw error;
    }
  };

  const getAllBookings = async (filters?: any) => {
    try {
      
      let q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(100));
      
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }
      
      const snapshot = await getDocs(q);
      const bookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return bookings;
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error loading bookings:', error);
      throw error;
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status,
        updatedAt: Timestamp.now()
      });
      return { success: true };
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error updating booking:', error);
      throw error;
    }
  };

  const assignDriverToBooking = async (bookingId: string, driverId: string) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      const driverRef = doc(db, 'drivers', driverId);
      const driverSnap = await getDoc(driverRef);
      
      if (!driverSnap.exists()) {
        throw new Error('Driver not found');
      }
      
      const driverData = driverSnap.data();
      
      await updateDoc(bookingRef, {
        driverId: driverId,
        driverName: driverData.name || driverData.displayName || 'Unnamed Driver',
        driverPhone: driverData.phone || driverData.phoneNumber || 'N/A',
        status: 'confirmed', // Automatically confirm when driver is assigned
        updatedAt: Timestamp.now()
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error assigning driver:', error);
      throw error;
    }
  };

  const listenToActiveBookings = (callback: (bookings: any[]) => void) => {
    try {
      const q = query(
        collection(db, 'bookings'), 
        orderBy('updatedAt', 'desc'), 
        limit(100)
      );
      return onSnapshot(q, (snapshot) => {
        const bookings = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(bookings);
      }, (error) => {
        console.error('[ADMIN] ❌ Error in bookings listener:', error);
      });
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error setting up listener:', error);
      throw error;
    }
  };

  // =====================================
  // DRIVERS
  // =====================================
  
  const getAllDrivers = async () => {
    try {
      const q = query(collection(db, 'drivers'), limit(100));
      const snapshot = await getDocs(q);
      const drivers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return drivers;
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error loading drivers:', error);
      throw error;
    }
  };

  const getDriverById = async (driverId: string) => {
    try {
      const driverRef = doc(db, 'drivers', driverId);
      const snap = await getDoc(driverRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() };
      }
      return null;
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error fetching driver by ID:', error);
      throw error;
    }
  };

  const addDriver = async (driverData: any) => {
    try {
      const driversRef = collection(db, 'drivers');
      const docRef = await addDoc(driversRef, {
        ...driverData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: 'offline',
        rating: 5.0,
        totalTrips: 0
      });
      
      return { success: true, id: docRef.id };
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error adding driver:', error);
      throw error;
    }
  };

  const updateDriver = async (driverId: string, driverData: any) => {
    try {
      const driverRef = doc(db, 'drivers', driverId);
      await updateDoc(driverRef, {
        ...driverData,
        updatedAt: Timestamp.now()
      });
      return { success: true };
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error updating driver:', error);
      throw error;
    }
  };

  const deleteDriver = async (driverId: string) => {
    try {
      const driverRef = doc(db, 'drivers', driverId);
      await deleteDoc(driverRef);
      return { success: true };
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error deleting driver:', error);
      throw error;
    }
  };

  // =====================================
  // USERS
  // =====================================
  
  const getAllUsers = async () => {
    try {
      const q = query(collection(db, 'users'), limit(100));
      const snapshot = await getDocs(q);
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return users;
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error loading users:', error);
      throw error;
    }
  };

  // =====================================
  // OFFERS
  // =====================================
  
  const getAllOffers = async () => {
    try {
      const q = query(collection(db, 'offers'), limit(50));
      const snapshot = await getDocs(q);
      const offersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return offersList;
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error loading offers:', error);
      throw error;
    }
  };

  const createOffer = async (offerData: any) => {
    const { adminUser } = useAdminAuth();
    try {
      
      const payload: any = {
        title: offerData.title,
        description: offerData.description,
        code: offerData.code?.toUpperCase(),
        discountPercent: Number(offerData.discountPercent),
        isActive: Boolean(offerData.isActive),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: adminUser.value?.id || 'system',
        usedCount: 0
      };

      if (offerData.validUntil) {
        const date = new Date(offerData.validUntil);
        if (!isNaN(date.getTime())) {
          payload.validUntil = Timestamp.fromDate(date);
        }
      }

      const offerDocRef = doc(db, 'offers', payload.code);
      await setDoc(offerDocRef, payload);
      
      return { success: true, id: payload.code };
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error creating offer:', error);
      throw error;
    }
  };

  const updateOffer = async (offerId: string, offerData: any) => {
    const { adminUser } = useAdminAuth();
    try {
      
      const payload: any = {
        title: offerData.title,
        description: offerData.description,
        code: offerId,
        discountPercent: Number(offerData.discountPercent),
        isActive: Boolean(offerData.isActive),
        updatedAt: serverTimestamp(),
        updatedBy: adminUser.value?.id || 'system'
      };

      if (offerData.validUntil) {
        const date = new Date(offerData.validUntil);
        if (!isNaN(date.getTime())) {
          payload.validUntil = Timestamp.fromDate(date);
        }
      }

      const offerRef = doc(db, 'offers', offerId);
      await updateDoc(offerRef, payload);
      return { success: true };
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error updating offer:', error);
      throw error;
    }
  };

  const toggleOfferStatus = async (offerId: string, isActive: boolean) => {
    try {
      const offerRef = doc(db, 'offers', offerId);
      await updateDoc(offerRef, {
        isActive,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error toggling offer:', error);
      throw error;
    }
  };

  const deleteOffer = async (offerId: string) => {
    try {
      const offerRef = doc(db, 'offers', offerId);
      await deleteDoc(offerRef);
      return { success: true };
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error deleting offer:', error);
      throw error;
    }
  };

  // =====================================
  // DASHBOARD STATS
  // =====================================
  
  const getDashboardStats = async () => {
    try {
      
      // Get all bookings
      const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
      const bookings = bookingsSnapshot.docs.map(doc => doc.data());
      
      // Get all drivers
      const driversSnapshot = await getDocs(collection(db, 'drivers'));
      const drivers = driversSnapshot.docs.map(doc => doc.data());
      
      // Get all users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.size;
      
      // Calculate stats
      const totalBookings = bookings.length;
      const activeDrivers = drivers.length;
      const onlineDrivers = drivers.filter((d: any) => d.status === 'online').length;
      
      // Calculate today's revenue
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayBookings = bookings.filter((b: any) => {
        if (!b.createdAt) return false;
        const bookingDate = b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return bookingDate >= today;
      });
      const todayRevenue = todayBookings.reduce((sum: number, b: any) => sum + (b.totalFare || 0), 0);
      
      const stats = {
        totalBookings,
        activeDrivers,
        onlineDrivers,
        todayRevenue: todayRevenue.toFixed(2),
        activeUsers: users
      };
      
      console.log('[ADMIN] ✅ Dashboard stats:', stats);
      return stats;
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error loading dashboard stats:', error);
      // Return default stats if error
      return {
        totalBookings: 0,
        activeDrivers: 0,
        onlineDrivers: 0,
        todayRevenue: '0.00',
        activeUsers: 0
      };
    }
  };

  const globalSearch = async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const results: any[] = [];
    const term = searchTerm.trim();
    
    try {
      // 1. Search Bookings (by Reference - usually starts with CTY)
      // We try both uppercase and original term
      const bookingRef = term.toUpperCase().startsWith('CTY') ? term.toUpperCase() : `CTY${term.toUpperCase()}`;
      const bookingsQ = query(
        collection(db, 'bookings'),
        where('bookingReference', '>=', term.toUpperCase()),
        where('bookingReference', '<=', term.toUpperCase() + '\uf8ff'),
        limit(5)
      );

      // 2. Search Drivers (by Name)
      const driversQ = query(
        collection(db, 'drivers'),
        where('name', '>=', term),
        where('name', '<=', term + '\uf8ff'),
        limit(5)
      );

      // 3. Search Users (by Name)
      const usersQ = query(
        collection(db, 'users'),
        where('displayName', '>=', term),
        where('displayName', '<=', term + '\uf8ff'),
        limit(5)
      );

      const [bookingsSnap, driversSnap, usersSnap] = await Promise.all([
        getDocs(bookingsQ),
        getDocs(driversQ),
        getDocs(usersQ)
      ]);

      bookingsSnap.forEach(doc => results.push({ 
        type: 'booking', 
        id: doc.id, 
        label: doc.data().bookingReference,
        sublabel: doc.data().userName,
        ...doc.data() 
      }));
      
      driversSnap.forEach(doc => results.push({ 
        type: 'driver', 
        id: doc.id, 
        label: doc.data().name || doc.data().displayName,
        sublabel: 'Driver',
        ...doc.data() 
      }));
      
      usersSnap.forEach(doc => results.push({ 
        type: 'user', 
        id: doc.id, 
        label: doc.data().displayName || doc.data().name,
        sublabel: 'Customer',
        ...doc.data() 
      }));

      return results;
    } catch (error) {
      console.error('[SEARCH] ❌ Error in global search:', error);
      return [];
    }
  };

  return {
    // Bookings
    getAllBookings,
    getBookingsPage,
    getCollectionCount,
    updateBookingStatus,
    assignDriverToBooking,
    listenToActiveBookings,
    
    // Drivers
    getAllDrivers,
    getDriverById,
    addDriver,
    updateDriver,
    deleteDriver,
    
    // Users
    getAllUsers,
    
    // Global Search
    globalSearch,
    
    // Offers
    getAllOffers,
    createOffer,
    updateOffer,
    toggleOfferStatus,
    deleteOffer,
    
    // Dashboard
    getDashboardStats,
    
    // System Settings
    getSystemSettings: async () => {
      try {
        const docRef = doc(db, 'config', 'system');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          return snap.data();
        }
        return null;
      } catch (error) {
        console.error('[ADMIN] Error fetching system settings:', error);
        return null;
      }
    },
    updateSystemSettings: async (settings: any) => {
      try {
        const docRef = doc(db, 'config', 'system');
        await setDoc(docRef, {
          ...settings,
          updatedAt: Timestamp.now()
        }, { merge: true });
        return { success: true };
      } catch (error) {
        console.error('[ADMIN] Error updating system settings:', error);
        throw error;
      }
    },
    
    // Roles & Permissions Master
    getAllRoles: async () => {
      try {
        const snap = await getDocs(collection(db, 'roles'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (error) {
        console.error('[ADMIN] Error fetching roles:', error);
        return [];
      }
    },
    upsertRole: async (roleId: string, permissions: any) => {
      try {
        const roleRef = doc(db, 'roles', roleId);
        await setDoc(roleRef, {
          ...permissions,
          updatedAt: Timestamp.now()
        }, { merge: true });
        return { success: true };
      } catch (error) {
        console.error('[ADMIN] Error saving role:', error);
        throw error;
      }
    },
    deleteRole: async (roleId: string) => {
      try {
        await deleteDoc(doc(db, 'roles', roleId));
        return { success: true };
      } catch (error) {
        console.error('[ADMIN] Error deleting role:', error);
        throw error;
      }
    },

    // Emergency Cleanup
    cleanupDatabase: async (keepRef: string) => {
      try {
        console.log('[ADMIN] 🧹 Starting Emergency Database Cleanup...');
        
        const collectionsToClear = ['bookings', 'drivers', 'offers', 'quotes'];
        const results = { deleted: 0, skipped: 0 };
        
        for (const colName of collectionsToClear) {
          const snap = await getDocs(collection(db, colName));
          console.log(`[ADMIN] Cleaning collection: ${colName} (${snap.size} docs)`);
          
          for (const docSnap of snap.docs) {
            const data = docSnap.data();
            if (colName === 'bookings' && data.bookingReference === keepRef) {
              console.log(`[ADMIN] ℹ️ Keeping booking: ${keepRef}`);
              results.skipped++;
              continue;
            }
            await deleteDoc(doc(db, colName, docSnap.id));
            results.deleted++;
          }
        }
        
        console.log('[ADMIN] ✅ Cleanup complete:', results);
        return { success: true, ...results };
      } catch (error: any) {
        console.error('[ADMIN] ❌ Cleanup failed:', error);
        throw error;
      }
    },
    
    // Admin User Hub
    upsertAdminUser: async (uid: string | null, userData: any) => {
      try {
        if (!uid) {
          // If no UID (creating new from scratch via email lookup or invite)
          // We usually use addDoc for profile if UID isn't known yet, 
          // but for auth purposes, UID is required.
          // For now, we'll assume uid is provided or we generate a placeholder
          const userRef = collection(db, 'users');
          const docRef = await addDoc(userRef, {
            ...userData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          });
          return { success: true, id: docRef.id };
        } else {
          const userRef = doc(db, 'users', uid);
          await setDoc(userRef, {
            ...userData,
            updatedAt: Timestamp.now()
          }, { merge: true });
          return { success: true };
        }
      } catch (error) {
        console.error('[ADMIN] Error upserting user:', error);
        throw error;
      }
    },
    
    // Direct DB access
    db,

    // =====================================
    // PRICING RULES
    // =====================================
    
    getBasePricingConfig: async () => {
      try {
        const docRef = doc(db, 'pricingRules', 'baseConfig');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          return snap.data();
        }
        return null;
      } catch (error) {
        console.error('[ADMIN] Error fetching base pricing config:', error);
        return null;
      }
    },
    
    saveBasePricingConfig: async (configData: any) => {
      try {
        const docRef = doc(db, 'pricingRules', 'baseConfig');
        await setDoc(docRef, {
          ...configData,
          updatedAt: serverTimestamp()
        }, { merge: true });
        return { success: true };
      } catch (error) {
        console.error('[ADMIN] Error saving base pricing config:', error);
        throw error;
      }
    },
    
    getPricingRules: async () => {
      try {
        const q = query(
          collection(db, 'pricingRules'), 
          where('type', '==', 'dynamic')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('[ADMIN] Error fetching pricing rules:', error);
        return [];
      }
    },
    
    addPricingRule: async (ruleData: any) => {
      try {
        const rulesRef = collection(db, 'pricingRules');
        const docRef = await addDoc(rulesRef, {
          ...ruleData,
          type: 'dynamic',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        return { success: true, id: docRef.id };
      } catch (error) {
        console.error('[ADMIN] Error adding pricing rule:', error);
        throw error;
      }
    },
    
    updatePricingRule: async (ruleId: string, ruleData: any) => {
      try {
        const ruleRef = doc(db, 'pricingRules', ruleId);
        await updateDoc(ruleRef, {
          ...ruleData,
          updatedAt: serverTimestamp()
        });
        return { success: true };
      } catch (error) {
        console.error('[ADMIN] Error updating pricing rule:', error);
        throw error;
      }
    },
    
    deletePricingRule: async (ruleId: string) => {
      try {
        const ruleRef = doc(db, 'pricingRules', ruleId);
        await deleteDoc(ruleRef);
        return { success: true };
      } catch (error) {
        console.error('[ADMIN] Error deleting pricing rule:', error);
        throw error;
      }
    }
  };
};

