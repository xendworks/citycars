# Firebase Authentication Setup

## Overview
Firebase Authentication has been integrated into the City Cars application, providing instant signup and login functionality.

## Features Implemented

### 1. Firebase Configuration
- **Plugin**: `plugins/firebase.client.ts`
- Initializes Firebase App, Analytics, and Auth
- Uses runtime config for environment variables

### 2. Authentication Store
- **Store**: `stores/auth.ts`
- Manages authentication state (user, isAuthenticated, isLoading, error)
- Provides actions: `signUp`, `signIn`, `logout`, `initializeAuth`
- Persists authentication state using Pinia persisted state

### 3. Authentication Composable
- **Composable**: `composables/useAuth.ts`
- Provides easy access to auth state and actions
- Auto-initializes auth on mount

### 4. Login & Signup Pages
- **Login**: `/login` - Email/password login
- **Signup**: `/signup` - Create new account with email/password
- Both pages include:
  - Form validation
  - Error handling
  - Loading states
  - Responsive design matching City Cars branding

### 5. Navigation Integration
- **Navbar**: Updated to show:
  - Login/Signup buttons when not authenticated
  - User name and Logout button when authenticated

### 6. API Integration
- **API Store**: Updated to automatically include Firebase auth tokens in API requests
- All API calls now include `Authorization: Bearer <token>` header when user is authenticated

## Firebase Configuration

The Firebase config is set in `nuxt.config.ts` with fallback values:

```typescript
firebaseApiKey: "AIzaSyBZdrBlI_EXGq1XuyQir95Rl5V5XT6bAKk"
firebaseAuthDomain: "city-cars-adba5.firebaseapp.com"
firebaseProjectId: "city-cars-adba5"
firebaseStorageBucket: "city-cars-adba5.firebasestorage.app"
firebaseMessagingSenderId: "83200697019"
firebaseAppId: "1:83200697019:web:4178d6e4c4ccde39be3f9e"
firebaseMeasurementId: "G-DVMHXRRVJG"
```

## Environment Variables

Add to your `.env` file (optional, defaults are set):

```env
NUXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NUXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Usage Examples

### In Components
```vue
<script setup>
const { isAuthenticated, userProfile, signIn, signOut } = useAuth();

// Check if user is logged in
if (isAuthenticated.value) {
  console.log('User:', userProfile.value);
}

// Sign in
await signIn('user@example.com', 'password123');

// Sign out
await signOut();
</script>
```

### Protected Routes
Create a middleware for protected routes:
```typescript
// middleware/protected.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated.value) {
    return navigateTo('/login?redirect=' + to.path);
  }
});
```

## Error Handling

The auth store includes user-friendly error messages for common Firebase errors:
- Email already in use
- Invalid email
- Weak password
- Wrong password
- Too many requests
- Network errors

## Next Steps

1. **Enable Email/Password in Firebase Console**:
   - Go to Firebase Console > Authentication > Sign-in method
   - Enable "Email/Password" provider

2. **Optional Features to Add**:
   - Password reset functionality
   - Email verification
   - Social login (Google, Facebook, etc.)
   - Phone number authentication
   - Profile management page

3. **Backend Integration**:
   - Verify Firebase tokens on the server
   - Sync Firebase users with PostgreSQL users table
   - Add role-based access control

## Files Created/Modified

- `plugins/firebase.client.ts` - Firebase initialization
- `plugins/auth-init.client.ts` - Auth state initialization
- `stores/auth.ts` - Authentication store
- `composables/useAuth.ts` - Auth composable
- `pages/login.vue` - Login page
- `pages/signup.vue` - Signup page
- `components/Navbar.vue` - Updated with auth UI
- `stores/api.ts` - Updated to include auth tokens
- `nuxt.config.ts` - Added Firebase config


