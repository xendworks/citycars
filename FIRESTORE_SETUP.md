# Firestore Backend Setup

This project uses **Firebase Firestore** as the database for all backend operations.

## Collections Structure

The app uses these Firestore collections:

### 1. **users**
Stores user information
```
{
  email: string
  phone: string
  firstName: string
  lastName: string
  role: 'customer' | 'admin' | 'driver'
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 2. **drivers**
Stores driver and vehicle information
```
{
  userId: string | null
  licenseNumber: string
  licenseExpiry: Timestamp
  vehicleRegistration: string
  vehicleMake: string | null
  vehicleModel: string | null
  vehicleType: 'saloon' | 'estate' | 'mpv' | 'wheelchair'
  vehicleYear: number | null
  isAvailable: boolean
  isActive: boolean
  rating: number
  totalTrips: number
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 3. **bookings**
Stores all booking/ride information
```
{
  bookingReference: string (e.g., "CC2501191234")
  userId: string | null
  driverId: string | null
  pickupAddress: string
  pickupLatitude: number
  pickupLongitude: number
  pickupDateTime: Timestamp
  dropoffAddress: string
  dropoffLatitude: number
  dropoffLongitude: number
  distanceMiles: number
  estimatedDurationMinutes: number
  vehicleType: 'saloon' | 'estate' | 'mpv' | 'wheelchair'
  passengers: number
  luggage: number
  baseFare: number
  distanceCost: number
  peakHourSurcharge: number
  trafficSurcharge: number
  vehicleSurcharge: number
  totalFare: number
  specialInstructions: string | null
  flightNumber: string | null
  paymentMethod: 'cash' | 'card' | 'account'
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed'
  createdAt: Timestamp
  updatedAt: Timestamp
  completedAt: Timestamp | null
}
```

### 4. **pricingRules** (optional for admin)
Stores pricing configuration
```
{
  minMiles: number
  maxMiles: number | null
  pricePerMile: number
  minimumFare: number | null
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

## Environment Setup

### Option 1: Using Service Account (Recommended for Production)

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Convert it to a single-line string:
   ```bash
   cat serviceAccountKey.json | jq -c
   ```
5. Add to `.env`:
   ```
   FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"...","private_key":"..."}' ```

### Option 2: Default Credentials (For Cloud Deployment)

When deploying to Google Cloud (Cloud Functions, Cloud Run, App Engine), Firebase Admin SDK will automatically use application default credentials. No extra configuration needed!

## Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. The app will automatically initialize Firestore on first API call

## API Endpoints

All endpoints return JSON with this structure:
```json
{
  "success": true,
  "data": {...},
  "pagination": {...}  // For list endpoints
}
```

### Bookings
- `GET /api/bookings` - List bookings (with pagination, filters)
- `POST /api/bookings` - Create a new booking

### Drivers
- `GET /api/drivers` - List drivers
- `POST /api/drivers` - Create a new driver

### Users
- `GET /api/users` - List users
- `POST /api/users` - Create a new user

### Pricing
- `POST /api/pricing/calculate` - Calculate fare for a trip

## Firestore Indexes

For better performance, create these composite indexes in Firebase Console:

1. **bookings**
   - `status` (Ascending) + `createdAt` (Descending)
   - `userId` (Ascending) + `createdAt` (Descending)
   - `driverId` (Ascending) + `createdAt` (Descending)

2. **drivers**
   - `isAvailable` (Ascending) + `createdAt` (Descending)
   - `isActive` (Ascending) + `createdAt` (Descending)

3. **users**
   - `role` (Ascending) + `createdAt` (Descending)
   - `isActive` (Ascending) + `createdAt` (Descending)

Firebase will automatically prompt you to create these indexes when you make queries that need them.

## Security Rules

Add these Firestore Security Rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == userId || request.auth.token.admin == true;
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.userId || 
        request.auth.token.admin == true
      );
    }
    
    // Drivers collection (admin only for writes)
    match /drivers/{driverId} {
      allow read: if true;  // Public read
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Pricing rules (admin only)
    match /pricingRules/{ruleId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## Development

Run the dev server:
```bash
pnpm dev
```

The API will be available at `http://localhost:3000/api`

## Production Deployment

1. Build the app:
   ```bash
   pnpm build
   ```

2. Set environment variables on your hosting platform

3. Deploy!

## Notes

- **No PostgreSQL needed!** All removed ✅
- **No Docker needed!** All removed ✅
- Firestore handles scaling automatically
- Authentication is handled by Firebase Auth (already set up in your project)
- Real-time updates available if needed (use `onSnapshot` in client code)

