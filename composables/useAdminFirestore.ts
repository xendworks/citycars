import { getFirestore, collection, getDocs, doc, updateDoc, addDoc, deleteDoc, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';

export const useAdminFirestore = () => {
  if (process.server) {
    throw new Error('useAdminFirestore can only be used on the client side');
  }

  const { $firestore } = useNuxtApp();
  const db = $firestore as any;

  // =====================================
  // BOOKINGS
  // =====================================
  
  const getAllBookings = async (filters?: any) => {
    try {
      console.log('[ADMIN] Fetching bookings with filters:', filters);
      
      let q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(100));
      
      // Apply status filter
      if (filters?.status) {
        q = query(collection(db, 'bookings'), where('status', '==', filters.status), orderBy('createdAt', 'desc'), limit(100));
      }
      
      const snapshot = await getDocs(q);
      const bookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('[ADMIN] ✅ Loaded', bookings.length, 'bookings');
      return bookings;
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error loading bookings:', error);
      throw error;
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      console.log('[ADMIN] Updating booking status:', bookingId, status);
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status,
        updatedAt: Timestamp.now()
      });
      console.log('[ADMIN] ✅ Booking status updated');
      return { success: true };
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error updating booking:', error);
      throw error;
    }
  };

  // =====================================
  // DRIVERS
  // =====================================
  
  const getAllDrivers = async () => {
    try {
      console.log('[ADMIN] Fetching drivers...');
      const q = query(collection(db, 'drivers'), limit(100));
      const snapshot = await getDocs(q);
      const drivers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('[ADMIN] ✅ Loaded', drivers.length, 'drivers');
      return drivers;
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error loading drivers:', error);
      throw error;
    }
  };

  const addDriver = async (driverData: any) => {
    try {
      console.log('[ADMIN] Adding driver:', driverData);
      const driversRef = collection(db, 'drivers');
      const docRef = await addDoc(driversRef, {
        ...driverData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: 'offline',
        rating: 5.0,
        totalTrips: 0
      });
      
      console.log('[ADMIN] ✅ Driver added with ID:', docRef.id);
      return { success: true, id: docRef.id };
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error adding driver:', error);
      throw error;
    }
  };

  const updateDriver = async (driverId: string, driverData: any) => {
    try {
      console.log('[ADMIN] Updating driver:', driverId, driverData);
      const driverRef = doc(db, 'drivers', driverId);
      await updateDoc(driverRef, {
        ...driverData,
        updatedAt: Timestamp.now()
      });
      console.log('[ADMIN] ✅ Driver updated');
      return { success: true };
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error updating driver:', error);
      throw error;
    }
  };

  // =====================================
  // USERS
  // =====================================
  
  const getAllUsers = async () => {
    try {
      console.log('[ADMIN] Fetching users...');
      const q = query(collection(db, 'users'), limit(100));
      const snapshot = await getDocs(q);
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('[ADMIN] ✅ Loaded', users.length, 'users');
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
      console.log('[ADMIN] Fetching offers...');
      const q = query(collection(db, 'offers'), orderBy('createdAt', 'desc'), limit(50));
      const snapshot = await getDocs(q);
      const offers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('[ADMIN] ✅ Loaded', offers.length, 'offers');
      return offers;
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error loading offers:', error);
      return []; // Return empty array if collection doesn't exist yet
    }
  };

  const createOffer = async (offerData: any) => {
    try {
      console.log('[ADMIN] Creating offer:', offerData);
      const offersRef = collection(db, 'offers');
      const docRef = await addDoc(offersRef, {
        ...offerData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        usedCount: 0
      });
      
      console.log('[ADMIN] ✅ Offer created with ID:', docRef.id);
      return { success: true, id: docRef.id };
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error creating offer:', error);
      throw error;
    }
  };

  const updateOffer = async (offerId: string, offerData: any) => {
    try {
      console.log('[ADMIN] Updating offer:', offerId, offerData);
      const offerRef = doc(db, 'offers', offerId);
      await updateDoc(offerRef, {
        ...offerData,
        updatedAt: Timestamp.now()
      });
      console.log('[ADMIN] ✅ Offer updated');
      return { success: true };
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error updating offer:', error);
      throw error;
    }
  };

  const toggleOfferStatus = async (offerId: string, isActive: boolean) => {
    try {
      console.log('[ADMIN] Toggling offer status:', offerId, isActive);
      const offerRef = doc(db, 'offers', offerId);
      await updateDoc(offerRef, {
        isActive,
        updatedAt: Timestamp.now()
      });
      console.log('[ADMIN] ✅ Offer status toggled');
      return { success: true };
    } catch (error: any) {
      console.error('[ADMIN] ❌ Error toggling offer:', error);
      throw error;
    }
  };

  // =====================================
  // DASHBOARD STATS
  // =====================================
  
  const getDashboardStats = async () => {
    try {
      console.log('[ADMIN] Fetching dashboard stats...');
      
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

  return {
    // Bookings
    getAllBookings,
    updateBookingStatus,
    
    // Drivers
    getAllDrivers,
    addDriver,
    updateDriver,
    
    // Users
    getAllUsers,
    
    // Offers
    getAllOffers,
    createOffer,
    updateOffer,
    toggleOfferStatus,
    
    // Dashboard
    getDashboardStats,
    
    // Direct DB access
    db
  };
};

