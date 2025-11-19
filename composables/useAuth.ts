import { computed } from 'vue';
import { useAuthStore } from '~/stores/auth';

export const useAuth = () => {
  const authStore = useAuthStore();

  // Initialize auth state on mount
  if (process.client && !authStore.isLoading && !authStore.user) {
    authStore.initializeAuth();
  }

  return {
    // State
    user: computed(() => authStore.user),
    userProfile: computed(() => authStore.userProfile),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isLoading: computed(() => authStore.isLoading),
    error: computed(() => authStore.error),

    // Actions
    signUp: authStore.signUp.bind(authStore),
    signIn: authStore.signIn.bind(authStore),
    signInWithGoogle: authStore.signInWithGoogle.bind(authStore),
    updateUserPhone: authStore.updateUserPhone.bind(authStore),
    setupRecaptcha: authStore.setupRecaptcha.bind(authStore),
    sendSMSVerification: authStore.sendSMSVerification.bind(authStore),
    verifySMSCode: authStore.verifySMSCode.bind(authStore),
    linkPhoneNumber: authStore.linkPhoneNumber.bind(authStore),
    logout: authStore.logout.bind(authStore),
    initializeAuth: authStore.initializeAuth.bind(authStore)
  };
};

