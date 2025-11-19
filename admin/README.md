# 🚗 CityCars Admin Portal

A comprehensive admin dashboard for managing bookings, drivers, users, and all aspects of the CityCars platform.

---

## 🎯 Features

### ✅ Dashboard
- Real-time statistics (bookings, revenue, drivers, users)
- Recent bookings overview
- Quick access to all management sections

### 📋 Bookings Management
- View all bookings with advanced filtering
- Update booking status in real-time
- Search by booking ID, customer name, or phone
- Filter by status and date range
- Export bookings to CSV

### 👥 Drivers Management
- Add new drivers
- Edit driver information
- Manage driver availability
- View driver performance metrics
- Assign drivers to bookings

### 🎁 Offers & Promotions
- Create promotional offers
- Set discount codes
- Manage active/inactive offers
- Track offer usage

### 💰 Pricing Rules
- Configure fare calculation rules
- Manage vehicle type surcharges
- Set distance-based pricing
- Peak hour surcharges

### 👤 Users Management
- View all registered users
- User activity tracking
- Manage user accounts

### ⚙️  Settings
- Website configuration
- Email templates
- Notification settings
- System preferences

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- pnpm 9+ installed
- Access to Firebase project

### Installation

1. **Navigate to admin directory:**
   ```bash
   cd admin
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   Create `.env` file in the admin directory:
   ```env
   # Firebase Configuration
   NUXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NUXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NUXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

   # Firebase Admin SDK (for server-side operations)
   FIREBASE_SERVICE_ACCOUNT=path/to/serviceAccountKey.json
   ```

4. **Start development server:**
   ```bash
   pnpm dev
   ```

   Admin portal will run on: **http://localhost:4000**

### Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

---

## 📁 Project Structure

```
admin/
├── layouts/
│   └── default.vue           # Main admin layout with sidebar
├── pages/
│   └── admin/
│       ├── index.vue          # Dashboard
│       ├── bookings/
│       │   └── index.vue      # Bookings management
│       ├── drivers/
│       │   └── index.vue      # Drivers management
│       ├── offers/
│       │   └── index.vue      # Offers management
│       ├── pricing/
│       │   └── index.vue      # Pricing rules
│       ├── users/
│       │   └── index.vue      # Users management
│       └── settings/
│           └── index.vue      # Settings
├── composables/               # Shared composables
├── components/                # Reusable components
├── server/                    # Server API routes
│   └── api/                   # API endpoints
├── nuxt.config.ts             # Nuxt configuration
├── package.json               # Dependencies
└── tailwind.config.js         # Tailwind CSS config
```

---

## 🔐 Authentication

The admin portal uses Firebase Authentication with role-based access control.

### Admin User Setup

1. Create an admin user in Firebase Console
2. Add custom claim `isAdmin: true` using Firebase Admin SDK:

```javascript
// Run this in your server or Firebase Functions
import { getAuth } from 'firebase-admin/auth';

await getAuth().setCustomUserClaims(uid, {
  isAdmin: true,
  role: 'admin'
});
```

3. Admin users can access the portal at `/admin/login`

---

## 🎨 Design System

### Brand Colors
- **Primary:** Amber (#F59E0B) - Brand color
- **Secondary:** Gray-900 (#111827) - Dark backgrounds
- **Success:** Green
- **Warning:** Yellow
- **Danger:** Red

### Typography
- **Headings:** Bold, Gray-900
- **Body:** Regular, Gray-700
- **Small text:** Gray-500

---

## 🔧 Configuration

### Port Configuration

The admin portal runs on **port 4000** by default. To change:

**nuxt.config.ts:**
```typescript
devServer: {
  port: 4000, // Change this port
  host: 'localhost'
}
```

### API Integration

All admin API routes are located in `server/api/` and are accessible at:
```
http://localhost:4000/api/*
```

---

## 📊 Firestore Integration

The admin portal connects directly to Firestore collections:

- `bookings` - All ride bookings
- `drivers` - Driver profiles
- `users` - Customer accounts
- `offers` - Promotional offers
- `pricingRules` - Fare calculation rules

### Security Rules

Ensure admin users have read/write access in Firestore rules:

```javascript
match /{document=**} {
  allow read, write: if request.auth.token.isAdmin == true;
}
```

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
pnpm install -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify

```bash
# Install Netlify CLI
pnpm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Environment Variables

Remember to set all environment variables in your hosting platform's dashboard.

---

## 📱 Features to Implement

### Phase 1 (Current)
- [x] Dashboard with stats
- [x] Bookings management
- [x] Drivers management (UI)
- [x] Basic layout and navigation

### Phase 2 (Next)
- [ ] Real-time booking updates
- [ ] Driver assignment to bookings
- [ ] Offers management (full CRUD)
- [ ] Pricing rules editor
- [ ] CSV export functionality

### Phase 3 (Future)
- [ ] Analytics and reports
- [ ] Email notification system
- [ ] SMS integration
- [ ] Live driver tracking map
- [ ] Automated driver dispatch
- [ ] Revenue analytics
- [ ] Customer support chat

---

## 🛠️ Development

### Run in Development Mode

```bash
pnpm dev
```

Access at: **http://localhost:4000/admin**

### Linting & Type Checking

```bash
# Type check
pnpm nuxt typecheck

# Build check
pnpm build
```

---

## 📞 Support

For issues or questions about the admin portal:
1. Check the documentation
2. Review Firestore rules
3. Check browser console for errors
4. Verify Firebase configuration

---

## 🔒 Security Best Practices

1. **Never commit `.env` files**
2. **Use Firebase security rules** to restrict admin access
3. **Enable 2FA** for admin accounts
4. **Regular security audits**
5. **Monitor admin activity logs**

---

## 📝 Notes

- Admin portal is completely separate from client app
- Runs on different port (4000)
- Shares Firebase backend with client
- Can be deployed independently
- Uses monorepo structure with pnpm workspaces

---

**Last Updated:** 2025-11-19  
**Version:** 1.0.0  
**Status:** ✅ Development Ready

