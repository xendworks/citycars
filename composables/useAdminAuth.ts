import { ref, computed } from 'vue';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

// Define admin roles with permissions
export type AdminRole = 'super_admin' | 'manager' | 'operator';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: {
    canViewBookings: boolean;
    canEditBookings: boolean;
    canDeleteBookings: boolean;
    canViewDrivers: boolean;
    canEditDrivers: boolean;
    canDeleteDrivers: boolean;
    canViewUsers: boolean;
    canEditUsers: boolean;
    canDeleteUsers: boolean;
    canViewOffers: boolean;
    canEditOffers: boolean;
    canDeleteOffers: boolean;
    canViewPricing: boolean;
    canEditPricing: boolean;
    canViewSettings: boolean;
    canEditSettings: boolean;
  };
}

// Role-based permissions
const rolePermissions: Record<AdminRole, AdminUser['permissions']> = {
  super_admin: {
    canViewBookings: true,
    canEditBookings: true,
    canDeleteBookings: true,
    canViewDrivers: true,
    canEditDrivers: true,
    canDeleteDrivers: true,
    canViewUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canViewOffers: true,
    canEditOffers: true,
    canDeleteOffers: true,
    canViewPricing: true,
    canEditPricing: true,
    canViewSettings: true,
    canEditSettings: true,
  },
  manager: {
    canViewBookings: true,
    canEditBookings: true,
    canDeleteBookings: false,
    canViewDrivers: true,
    canEditDrivers: true,
    canDeleteDrivers: false,
    canViewUsers: true,
    canEditUsers: true,
    canDeleteUsers: false,
    canViewOffers: true,
    canEditOffers: true,
    canDeleteOffers: false,
    canViewPricing: true,
    canEditPricing: true,
    canViewSettings: true,
    canEditSettings: false,
  },
  operator: {
    canViewBookings: true,
    canEditBookings: true,
    canDeleteBookings: false,
    canViewDrivers: true,
    canEditDrivers: false,
    canDeleteDrivers: false,
    canViewUsers: true,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewOffers: true,
    canEditOffers: false,
    canDeleteOffers: false,
    canViewPricing: true,
    canEditPricing: false,
    canViewSettings: false,
    canEditSettings: false,
  },
};

const adminUser = ref<AdminUser | null>(null);
const isAuthenticated = ref(false);
const isLoading = ref(true);

export const useAdminAuth = () => {
  const { $firebaseAuth } = useNuxtApp();
  
  // Initialize auth state listener
  if (process.client && $firebaseAuth) {
    onAuthStateChanged($firebaseAuth, async (firebaseUser) => {
      isLoading.value = true;
      
      if (firebaseUser) {
        try {
          // Fetch user profile from Firestore to get role
          const { getUserProfile } = useFirestore();
          const userProfile = await getUserProfile(firebaseUser.uid);
          
          // Check if user has an admin role
          const adminRole = userProfile?.role as AdminRole;
          if (adminRole && ['super_admin', 'manager', 'operator'].includes(adminRole)) {
            const user: AdminUser = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: userProfile?.displayName || firebaseUser.displayName || 'Admin',
              role: adminRole,
              permissions: rolePermissions[adminRole],
            };
            
            adminUser.value = user;
            isAuthenticated.value = true;
            console.log('[ADMIN AUTH] ✅ Admin user authenticated:', adminRole);
          } else {
            // User exists but doesn't have admin role
            console.warn('[ADMIN AUTH] ❌ User does not have admin role');
            adminUser.value = null;
            isAuthenticated.value = false;
            await signOut($firebaseAuth);
          }
        } catch (error) {
          console.error('[ADMIN AUTH] ❌ Error fetching user profile:', error);
          adminUser.value = null;
          isAuthenticated.value = false;
        }
      } else {
        adminUser.value = null;
        isAuthenticated.value = false;
      }
      
      isLoading.value = false;
    });
  }

  const loginAdmin = async (email: string, password: string, remember: boolean = false) => {
    if (!process.client || !$firebaseAuth) {
      throw new Error('Firebase Auth not available');
    }

    try {
      console.log('[ADMIN AUTH] Attempting login for:', email);
      
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword($firebaseAuth, email, password);
      console.log('[ADMIN AUTH] ✅ Firebase Auth successful');
      
      // Fetch user profile to check role
      const { getUserProfile } = useFirestore();
      const userProfile = await getUserProfile(userCredential.user.uid);
      
      const adminRole = userProfile?.role as AdminRole;
      
      // Verify user has admin role
      if (!adminRole || !['super_admin', 'manager', 'operator'].includes(adminRole)) {
        await signOut($firebaseAuth);
        throw new Error('You do not have admin access');
      }
      
      console.log('[ADMIN AUTH] ✅ Admin role verified:', adminRole);
      
      // Create admin user with permissions
      const user: AdminUser = {
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
        name: userProfile?.displayName || userCredential.user.displayName || 'Admin',
        role: adminRole,
        permissions: rolePermissions[adminRole],
      };

      adminUser.value = user;
      isAuthenticated.value = true;

      return user;
    } catch (error: any) {
      console.error('[ADMIN AUTH] ❌ Login error:', error);
      
      // Handle specific Firebase Auth errors
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.');
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Login failed. Please try again.');
      }
    }
  };

  const logoutAdmin = async () => {
    if (!process.client || !$firebaseAuth) {
      return;
    }

    try {
      await signOut($firebaseAuth);
      adminUser.value = null;
      isAuthenticated.value = false;
      console.log('[ADMIN AUTH] ✅ Logged out successfully');
    } catch (error) {
      console.error('[ADMIN AUTH] ❌ Logout error:', error);
    }
  };

  // Permission checks
  const can = (permission: keyof AdminUser['permissions']): boolean => {
    return adminUser.value?.permissions[permission] ?? false;
  };

  const hasRole = (role: AdminRole): boolean => {
    return adminUser.value?.role === role;
  };

  const isSuperAdmin = computed(() => hasRole('super_admin'));

  return {
    adminUser: computed(() => adminUser.value),
    isAuthenticated: computed(() => isAuthenticated.value),
    isLoading: computed(() => isLoading.value),
    loginAdmin,
    logoutAdmin,
    can,
    hasRole,
    isSuperAdmin,
  };
};

