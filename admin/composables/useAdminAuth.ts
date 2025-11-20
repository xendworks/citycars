import { ref, computed } from 'vue';

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

// Demo admin accounts
const demoAccounts = [
  {
    id: '1',
    email: 'admin@citycars.com',
    password: 'admin123',
    name: 'Super Admin',
    role: 'super_admin' as AdminRole,
  },
  {
    id: '2',
    email: 'manager@citycars.com',
    password: 'manager123',
    name: 'Manager',
    role: 'manager' as AdminRole,
  },
  {
    id: '3',
    email: 'operator@citycars.com',
    password: 'operator123',
    name: 'Operator',
    role: 'operator' as AdminRole,
  },
];

const adminUser = ref<AdminUser | null>(null);
const isAuthenticated = ref(false);

export const useAdminAuth = () => {
  // Check if user is logged in on mount (from localStorage)
  if (process.client) {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        adminUser.value = parsed;
        isAuthenticated.value = true;
      } catch (e) {
        localStorage.removeItem('adminUser');
      }
    }
  }

  const loginAdmin = async (email: string, password: string, remember: boolean = false) => {
    // Find matching demo account
    const account = demoAccounts.find(
      (acc) => acc.email === email && acc.password === password
    );

    if (!account) {
      throw new Error('Invalid email or password');
    }

    // Create admin user with permissions
    const user: AdminUser = {
      id: account.id,
      email: account.email,
      name: account.name,
      role: account.role,
      permissions: rolePermissions[account.role],
    };

    adminUser.value = user;
    isAuthenticated.value = true;

    // Store in localStorage if remember me is checked
    if (process.client && remember) {
      localStorage.setItem('adminUser', JSON.stringify(user));
    } else if (process.client) {
      // Store in sessionStorage for current session only
      sessionStorage.setItem('adminUser', JSON.stringify(user));
    }

    return user;
  };

  const logoutAdmin = () => {
    adminUser.value = null;
    isAuthenticated.value = false;

    if (process.client) {
      localStorage.removeItem('adminUser');
      sessionStorage.removeItem('adminUser');
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
    loginAdmin,
    logoutAdmin,
    can,
    hasRole,
    isSuperAdmin,
  };
};

