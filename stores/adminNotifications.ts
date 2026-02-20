import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { 
  getFirestore, 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  Timestamp 
} from 'firebase/firestore';

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: any;
  isRead: boolean;
  link?: string;
}

export const useAdminNotificationsStore = defineStore('adminNotifications', () => {
  const notifications = ref<AdminNotification[]>([]);
  const isDrawerOpen = ref(false);
  const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length);
  
  // Notification Sound
  const playSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.warn('[NOTIFICATIONS] Sound blocked by browser/error:', e));
  };

  const addNotification = (notif: Omit<AdminNotification, 'id' | 'isRead' | 'timestamp'>) => {
    const newNotif: AdminNotification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      isRead: false,
      timestamp: new Date(),
    };
    notifications.value.unshift(newNotif);
    
    // Keep only last 50 notifications
    if (notifications.value.length > 50) {
      notifications.value.pop();
    }
    
    playSound();
  };

  const markAsRead = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications.value[index].isRead = true;
    }
  };

  const markAllAsRead = () => {
    notifications.value.forEach(n => n.isRead = true);
  };

  const clearAll = () => {
    notifications.value = [];
  };

  let unsubscribe: (() => void) | null = null;

  const initListener = () => {
    if (unsubscribe) return;

    const { $firebase } = useNuxtApp();
    if (!$firebase) return;

    const db = getFirestore($firebase as any);
    const bookingsRef = collection(db, 'bookings');
    
    // Listen to very recent changes (last 5 minutes) to avoid flooding on load
    // Actually, onSnapshot returns the initial set. We should ignore the first initial burst if needed.
    let isInitial = true;

    const q = query(bookingsRef, orderBy('updatedAt', 'desc'), limit(10));
    
    unsubscribe = onSnapshot(q, (snapshot) => {
      if (isInitial) {
        isInitial = false;
        return; // Ignore existing bookings on first load
      }

      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        const bookingRef = data.bookingReference || change.doc.id.slice(0, 8);

        if (change.type === 'added') {
          addNotification({
            title: 'New Booking Request',
            message: `New booking ${bookingRef} received from ${data.customerName || 'Guest'}.`,
            type: 'success',
            link: `/admin/bookings/${change.doc.id}`
          });
        } 
        
        if (change.type === 'modified') {
          // Check what changed
          if (data.status === 'confirmed' && data.driverId) {
            addNotification({
              title: 'Driver Assigned',
              message: `Driver ${data.driverName} has accepted booking ${bookingRef}.`,
              type: 'info',
              link: `/admin/bookings/${change.doc.id}`
            });
          } else if (data.status === 'completed') {
            addNotification({
              title: 'Job Completed',
              message: `Booking ${bookingRef} has been successfully completed by ${data.driverName || 'driver'}.`,
              type: 'success',
              link: `/admin/bookings/${change.doc.id}`
            });
          } else if (data.status === 'cancelled') {
            addNotification({
              title: 'Booking Cancelled',
              message: `Booking ${bookingRef} was cancelled.`,
              type: 'error',
              link: `/admin/bookings/${change.doc.id}`
            });
          }
        }
      });
    });
  };

  const stopListener = () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  };

  return {
    notifications,
    unreadCount,
    isDrawerOpen,
    initListener,
    stopListener,
    markAsRead,
    markAllAsRead,
    clearAll,
    addNotification
  };
});
