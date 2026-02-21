import { defineStore } from 'pinia';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  PhoneAuthProvider,
  linkWithCredential
} from 'firebase/auth';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  companyName?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  specialRequirements?: string | null;
  photoURL: string | null;
  preferredPickupLocations?: string[];
  preferredDropoffLocations?: string[];
}

// Helper function to get error messages
function getErrorMessage(error: any): string {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/invalid-credential': 'Invalid email or password.'
  };

  return errorMessages[error.code] || error.message || 'An error occurred. Please try again.';
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    userProfile: null as UserProfile | null,
    isLoading: false,
    isAuthenticated: false,
    error: null as string | null,
    confirmationResult: null as ConfirmationResult | null,
    recaptchaVerifier: null as RecaptchaVerifier | null
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated && state.user !== null
  },

  actions: {
    async initializeAuth() {
      if (process.server) return;

      return new Promise<void>((resolve) => {
        const nuxtApp = useNuxtApp();
        const $firebaseAuth = nuxtApp.$firebaseAuth as any;
        
        if (!$firebaseAuth) {
          console.warn('Firebase Auth not initialized');
          resolve();
          return;
        }

        this.isLoading = true;
        
        onAuthStateChanged($firebaseAuth, async (user) => {
          this.user = user;
          this.isAuthenticated = !!user;
          
          if (user) {
            // First, set basic profile from Firebase Auth
            this.userProfile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              phoneNumber: user.phoneNumber,
              photoURL: user.photoURL
            };
            
            // Then, load full profile from Firestore
            try {
              const { getUserProfile } = useFirestore();
              const firestoreProfile = await getUserProfile(user.uid);
              
              if (firestoreProfile) {
                // Merge Firestore data with Firebase Auth data
                this.userProfile = {
                  uid: user.uid,
                  email: firestoreProfile.email || user.email,
                  displayName: firestoreProfile.displayName || user.displayName,
                  phoneNumber: firestoreProfile.phoneNumber || user.phoneNumber,
                  companyName: firestoreProfile.companyName || null,
                  emergencyContactName: firestoreProfile.emergencyContactName || null,
                  emergencyContactPhone: firestoreProfile.emergencyContactPhone || null,
                  specialRequirements: firestoreProfile.specialRequirements || null,
                  photoURL: firestoreProfile.photoURL || user.photoURL,
                  preferredPickupLocations: firestoreProfile.preferredPickupLocations || [],
                  preferredDropoffLocations: firestoreProfile.preferredDropoffLocations || []
                };
              } else {
              }
            } catch (err) {
            }
          } else {
            this.userProfile = null;
          }
          
          this.isLoading = false;
          resolve();
        });
      });
    },

    async signUp(email: string, password: string, displayName?: string) {
      this.isLoading = true;
      this.error = null;

      try {
        const nuxtApp = useNuxtApp();
        const $firebaseAuth = nuxtApp.$firebaseAuth as any;
        
        if (!$firebaseAuth) {
          throw new Error('Firebase Auth not initialized');
        }

        const userCredential = await createUserWithEmailAndPassword(
          $firebaseAuth,
          email,
          password
        );

        // Update profile if display name provided
        if (displayName && userCredential.user) {
          await updateProfile(userCredential.user, {
            displayName: displayName
          });
        }

        this.user = userCredential.user;
        this.isAuthenticated = true;
        this.userProfile = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName || displayName || null,
          phoneNumber: userCredential.user.phoneNumber,
          photoURL: userCredential.user.photoURL
        };

        // Create user profile in Firestore (client-side only)
        if (process.client) {
          try {
            const { saveUserProfile } = useFirestore();
            await saveUserProfile(userCredential.user.uid, {
              email: userCredential.user.email || '',
              displayName: userCredential.user.displayName || displayName || null,
              phoneNumber: userCredential.user.phoneNumber,
              photoURL: userCredential.user.photoURL
            });
          } catch (err) {
            console.error('Failed to create user profile in Firestore:', err);
          }
        }

        return { success: true, user: userCredential.user };
      } catch (error: any) {
        this.error = getErrorMessage(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async signIn(email: string, password: string) {
      this.isLoading = true;
      this.error = null;

      try {
        const nuxtApp = useNuxtApp();
        const $firebaseAuth = nuxtApp.$firebaseAuth as any;
        
        if (!$firebaseAuth) {
          throw new Error('Firebase Auth not initialized');
        }

        const userCredential = await signInWithEmailAndPassword(
          $firebaseAuth,
          email,
          password
        );

        this.user = userCredential.user;
        this.isAuthenticated = true;
        this.userProfile = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          phoneNumber: userCredential.user.phoneNumber,
          photoURL: userCredential.user.photoURL
        };

        return { success: true, user: userCredential.user };
      } catch (error: any) {
        this.error = getErrorMessage(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async signInWithGoogle() {
      this.isLoading = true;
      this.error = null;

      try {
        const nuxtApp = useNuxtApp();
        const $firebaseAuth = nuxtApp.$firebaseAuth as any;
                
        if (!$firebaseAuth) {
          throw new Error('Firebase Auth not initialized');
        }

        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
          prompt: 'select_account'
        });
        const userCredential = await signInWithPopup($firebaseAuth, provider);        
        this.user = userCredential.user;
        this.isAuthenticated = true;
        this.userProfile = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          phoneNumber: userCredential.user.phoneNumber,
          photoURL: userCredential.user.photoURL
        };
        
        // Create/update user profile in Firestore (client-side only)
        if (process.client) {
          try {
            const { saveUserProfile } = useFirestore();
            await saveUserProfile(userCredential.user.uid, {
              email: userCredential.user.email || '',
              displayName: userCredential.user.displayName,
              phoneNumber: userCredential.user.phoneNumber,
              photoURL: userCredential.user.photoURL
            });
          } catch (err) {
            console.error('Failed to sync user profile to Firestore:', err);
          }
        }
        
        return { 
          success: true, 
          user: userCredential.user,
          isNewUser: !userCredential.user.phoneNumber // If no phone, likely new user
        };
      } catch (error: any) {
        if (error.code === 'auth/popup-closed-by-user') {
          this.error = 'Sign-in cancelled';
        } else if (error.code === 'auth/popup-blocked') {
          this.error = 'Popup blocked. Please allow popups for this site.';
        } else {
          this.error = getErrorMessage(error);
        }
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateUserPhone(phoneNumber: string) {
      this.isLoading = true;
      this.error = null;

      try {
        if (!this.user) {
          throw new Error('No user logged in');
        }

        if (this.userProfile) {
          this.userProfile.phoneNumber = phoneNumber;
        }

        return { success: true };
      } catch (error: any) {
        this.error = getErrorMessage(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      this.isLoading = true;
      this.error = null;

      try {
        const nuxtApp = useNuxtApp();
        const $firebaseAuth = nuxtApp.$firebaseAuth as any;
        
        if (!$firebaseAuth) {
          throw new Error('Firebase Auth not initialized');
        }

        await signOut($firebaseAuth);
        
        this.user = null;
        this.userProfile = null;
        this.isAuthenticated = false;
        this.confirmationResult = null;
        this.recaptchaVerifier = null;

        return { success: true };
      } catch (error: any) {
        this.error = getErrorMessage(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async setupRecaptcha(containerId: string) {
      try {
        const nuxtApp = useNuxtApp();
        const $firebaseAuth = nuxtApp.$firebaseAuth as any;
        
        if (!$firebaseAuth) {
          throw new Error('Firebase Auth not initialized');
        }

        // Clear existing verifier
        if (this.recaptchaVerifier) {
          this.recaptchaVerifier.clear();
        }

        this.recaptchaVerifier = new RecaptchaVerifier($firebaseAuth, containerId, {
          size: 'invisible',
          callback: () => {
          },
          'expired-callback': () => {
            console.error('[AUTH] reCAPTCHA expired');
            this.error = 'reCAPTCHA expired. Please try again.';
          }
        });

        await this.recaptchaVerifier.render();
        
        return this.recaptchaVerifier;
      } catch (error: any) {
        console.error('[AUTH] reCAPTCHA setup error:', error);
        this.error = getErrorMessage(error);
        throw error;
      }
    },

    async sendSMSVerification(phoneNumber: string) {
      this.isLoading = true;
      this.error = null;

      try {
        const nuxtApp = useNuxtApp();
        const $firebaseAuth = nuxtApp.$firebaseAuth as any;
        
        if (!$firebaseAuth) {
          throw new Error('Firebase Auth not initialized');
        }

        if (!this.recaptchaVerifier) {
          throw new Error('reCAPTCHA not initialized. Call setupRecaptcha first.');
        }

        this.confirmationResult = await signInWithPhoneNumber(
          $firebaseAuth,
          phoneNumber,
          this.recaptchaVerifier
        );
        
        return { success: true, message: 'SMS verification code sent!' };
      } catch (error: any) {
        console.error('[AUTH] SMS send error:', error);
        this.error = getErrorMessage(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async verifySMSCode(code: string) {
      this.isLoading = true;
      this.error = null;

      try {
        if (!this.confirmationResult) {
          throw new Error('No SMS verification in progress. Send SMS first.');
        }

        const userCredential = await this.confirmationResult.confirm(code);
        
        this.user = userCredential.user;
        this.isAuthenticated = true;
        this.userProfile = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          phoneNumber: userCredential.user.phoneNumber,
          photoURL: userCredential.user.photoURL
        };

        return { success: true, user: userCredential.user };
      } catch (error: any) {
        console.error('[AUTH] SMS verification error:', error);
        if (error.code === 'auth/invalid-verification-code') {
          this.error = 'Invalid verification code. Please try again.';
        } else {
          this.error = getErrorMessage(error);
        }
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async linkPhoneNumber(phoneNumber: string, verificationCode: string) {
      this.isLoading = true;
      this.error = null;

      try {
        if (!this.user) {
          throw new Error('No user logged in');
        }

        const nuxtApp = useNuxtApp();
        const $firebaseAuth = nuxtApp.$firebaseAuth as any;
        
        if (!$firebaseAuth) {
          throw new Error('Firebase Auth not initialized');
        }

        // Send SMS if not already sent
        if (!this.confirmationResult) {
          await this.sendSMSVerification(phoneNumber);
        }

        // Verify and link
        if (this.confirmationResult) {
          const userCredential = await this.confirmationResult.confirm(verificationCode);
          
          // Update local state
          this.user = userCredential.user;
          if (this.userProfile) {
            this.userProfile.phoneNumber = userCredential.user.phoneNumber;
          }

          return { success: true };
        }

        throw new Error('Failed to verify phone number');
      } catch (error: any) {
        console.error('[AUTH] Phone linking error:', error);
        this.error = getErrorMessage(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    }
  },

  persist: true
});

