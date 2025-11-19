# Firestore Setup Guide

## ✅ What's Been Implemented

### 1. **User Profile Management**
- ✅ Phone number can be edited in profile page
- ✅ Users automatically created/updated in Firestore on signup/login
- ✅ Profile includes: name, email, phone, preferred pickup locations (up to 3), preferred dropoff locations (up to 3)
- ✅ Photo URL from Google OAuth is saved

### 2. **Wallet System**
- ✅ Wallet balance per user
- ✅ Transaction history with full audit trail
- ✅ Foreign key relationship: `walletTransactions.uid` → `walletData.uid`
- ✅ Atomic transactions to prevent race conditions

### 3. **API Endpoints Created**

**User Profile**:
- `POST /api/users/profile` - Create/update user profile
- `GET /api/users/profile?uid=xxx` - Get user profile

**Wallet**:
- `GET /api/wallet/:uid` - Get wallet balance
- `POST /api/wallet/transaction` - Create transaction (credit/debit)
- `GET /api/wallet/transactions?uid=xxx` - Get transaction history

### 4. **Auth Integration**
- ✅ User profiles automatically created in Firestore when:
  - Signing up with email/password
  - Signing in with Google OAuth
- ✅ Profile data synced between Firebase Auth and Firestore

---

## 🚀 Firebase Console Setup

### Step 1: Go to Firestore Database
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **city-cars-83256**
3. Go to **Firestore Database**
4. You should see a screen that says "Your database is ready to go. Just add data."

### Step 2: Collections Will Be Auto-Created
When users sign up or perform actions, these collections will be automatically created:
- ✅ `users`
- ✅ `walletData`
- ✅ `walletTransactions`
- ✅ `bookings`
- ✅ `drivers`
- ✅ `pricingRules`

**No manual setup needed!**

### Step 3: Create Indexes (Recommended)

For better query performance, create these composite indexes:

1. Go to **Firestore Database** → **Indexes** tab
2. Click **Create Index** and add these:

**Index 1: walletTransactions**
- Collection: `walletTransactions`
- Fields:
  - `uid` (Ascending)
  - `createdAt` (Descending)

**Index 2: bookings**
- Collection: `bookings`
- Fields:
  - `userId` (Ascending)
  - `createdAt` (Descending)

### Step 4: Set Up Security Rules (Important!)

1. Go to **Firestore Database** → **Rules** tab
2. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(uid) {
      return isAuthenticated() && request.auth.uid == uid;
    }
    
    // Users - can read/write own profile
    match /users/{uid} {
      allow read, write: if isOwner(uid);
    }
    
    // Wallet - can read own wallet, but only server can write
    match /walletData/{uid} {
      allow read: if isOwner(uid);
      allow write: if false;
    }
    
    // Transactions - can read own transactions, but only server can write
    match /walletTransactions/{transactionId} {
      allow read: if isAuthenticated() && resource.data.uid == request.auth.uid;
      allow write: if false;
    }
    
    // Bookings - can read own bookings, can create new ones
    match /bookings/{bookingId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated();
      allow update, delete: if false;
    }
    
    // Pricing rules - read-only for all
    match /pricingRules/{ruleId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Drivers - read-only for all
    match /drivers/{driverId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

3. Click **Publish**

---

## 🧪 How to Test

### 1. Test User Profile Creation
1. Sign up with a new email or sign in with Google
2. Go to Firebase Console → Firestore Database → `users` collection
3. You should see a new document with your UID containing:
   - email
   - displayName
   - phoneNumber
   - photoURL (if signed in with Google)
   - preferredPickupLocations (empty array initially)
   - preferredDropoffLocations (empty array initially)

### 2. Test Phone Number Update
1. Go to your profile page (`/profile`)
2. Click **Edit Profile**
3. Change your phone number
4. Click **Save Changes**
5. Check Firestore → `users` → your UID → `phoneNumber` should be updated

### 3. Test Wallet
**Test wallet balance**:
```javascript
// In browser console
const walletData = await $fetch('/api/wallet/YOUR_UID_HERE');
console.log('Wallet balance:', walletData.wallet.balance);
```

**Test adding money**:
```javascript
// Add £50 to wallet
await $fetch('/api/wallet/transaction', {
  method: 'POST',
  body: {
    uid: 'YOUR_UID_HERE',
    amount: 50,
    type: 'credit',
    description: 'Test top-up'
  }
});

// Check new balance
const updated = await $fetch('/api/wallet/YOUR_UID_HERE');
console.log('New balance:', updated.wallet.balance);
```

**Test transaction history**:
```javascript
const history = await $fetch('/api/wallet/transactions?uid=YOUR_UID_HERE&limit=10');
console.log('Transactions:', history.transactions);
```

---

## 📝 Next Steps

### To add preferred locations:
Update the profile page to allow users to add their favorite pickup and dropoff locations. You can add these fields to the edit form:

```vue
<!-- In pages/profile.vue, add after phone number -->
<div>
  <label class="block text-sm font-medium text-gray-700 mb-1">
    Preferred Pickup Locations (up to 3)
  </label>
  <div v-for="(loc, idx) in editForm.preferredPickupLocations" :key="idx" class="mb-2">
    <input
      v-model="editForm.preferredPickupLocations[idx]"
      type="text"
      :disabled="!isEditing"
      class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg"
      placeholder="e.g., Horley, Gatwick RH6 0NP"
    />
  </div>
  <button
    v-if="isEditing && editForm.preferredPickupLocations.length < 3"
    @click="editForm.preferredPickupLocations.push('')"
    class="text-sm text-blue-600 hover:text-blue-800"
  >
    + Add Pickup Location
  </button>
</div>

<!-- Similar for dropoff locations -->
```

### To integrate wallet with bookings:
When a user books a ride, deduct from their wallet:

```typescript
// In booking API
await $fetch('/api/wallet/transaction', {
  method: 'POST',
  body: {
    uid: userId,
    amount: bookingFare,
    type: 'debit',
    description: `Payment for booking ${bookingReference}`,
    metadata: {
      bookingId: bookingReference,
      source: 'booking_payment'
    }
  }
});
```

---

## 📚 Documentation

- **Full Schema**: See `FIRESTORE_SCHEMA.md` for detailed collection structures
- **API Docs**: All endpoints documented in the schema file

---

**Setup Complete! 🎉**

Your Firestore database is now ready with:
- ✅ User profiles with phone number and preferred locations
- ✅ Wallet system with balance and transaction history
- ✅ Automatic syncing from Firebase Auth to Firestore

