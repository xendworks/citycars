# 🏗️ CityCars Monorepo Setup Guide

Complete guide for the CityCars monorepo with separate client and admin portals.

---

## 📦 Architecture

```
citycars/
├── pnpm-workspace.yaml       # Workspace configuration
├── package.json               # Root package with shared scripts
├── .env                       # Shared environment variables
├
── (client files)              # Main client app (existing)
│   ├── pages/
│   ├── components/
│   ├── server/
│   └── nuxt.config.ts         # Port 3000
│
└── admin/                     # Admin portal (new)
    ├── pages/
    ├── components/
    ├── layouts/
    ├── server/
    ├── package.json           # Admin dependencies
    ├── nuxt.config.ts         # Port 4000
    └── README.md              # Admin documentation
```

---

## 🚀 Quick Start

### 1. Install Dependencies

**From project root:**
```bash
# Install all dependencies (client + admin)
pnpm install
```

This will install dependencies for both the client app and admin portal.

---

### 2. Environment Setup

**Create `.env` in project root (if not exists):**
```env
# Firebase Configuration (shared by client and admin)
NUXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBuUPDFnKHfH21vaclS5CaK8O7qV41l8X0
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=city-cars-83256.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=city-cars-83256
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=city-cars-83256.firebasestorage.app
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=413911303220
NUXT_PUBLIC_FIREBASE_APP_ID=1:413911303220:web:e18b7b14c3eba16fcb7661
NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-NPXSZ0VECD

# Firebase Admin SDK
FIREBASE_SERVICE_ACCOUNT=./serviceAccountKey.json

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

---

### 3. Run Applications

**Option A: Run Both Simultaneously (Recommended)**

From project root:
```bash
# Terminal 1 - Client App (port 3000)
pnpm dev

# Terminal 2 - Admin Portal (port 4000)
cd admin && pnpm dev
```

**Option B: Run Using Concurrent Scripts (Future)**

Add to root `package.json`:
```json
{
  "scripts": {
    "dev:client": "nuxt dev",
    "dev:admin": "cd admin && nuxt dev",
    "dev:all": "concurrently \"pnpm dev:client\" \"pnpm dev:admin\""
  }
}
```

Then run:
```bash
pnpm dev:all
```

---

## 🌐 Access Points

| Application | URL | Port | Purpose |
|------------|-----|------|---------|
| **Client App** | http://localhost:3000 | 3000 | Public website for customers |
| **Admin Portal** | http://localhost:4000/admin | 4000 | Internal admin dashboard |

---

## 🔧 Workspace Configuration

### pnpm-workspace.yaml

```yaml
packages:
  - 'admin'
  # Add more packages here if needed
```

This tells pnpm that `admin/` is a separate package in the monorepo.

---

## 📦 Package Management

### Install Dependencies

**For specific package:**
```bash
# Install in admin
pnpm --filter @citycars/admin add package-name

# Install in client (root)
pnpm add package-name
```

**For all packages:**
```bash
pnpm install
```

### Add Shared Dependencies

If you want to share code between client and admin, create a `shared/` package:

```bash
mkdir -p shared
cd shared
pnpm init
```

---

## 🚀 Deployment

### Deploy Client App

```bash
# Build client
pnpm build

# Deploy to Vercel/Netlify
vercel --prod
```

### Deploy Admin Portal

```bash
# Build admin
cd admin
pnpm build

# Deploy to Vercel/Netlify
vercel --prod
```

**Important:** Deploy them as **separate projects** on your hosting platform!

---

## 🔐 Authentication Flow

### Client App
- Users sign up/login via Firebase Auth
- Standard user accounts
- Access to booking features

### Admin Portal
- Admin users have custom claim `isAdmin: true`
- Restricted access to admin routes
- Full database access

### Set Admin Claim

```javascript
// Use Firebase Admin SDK
import { getAuth } from 'firebase-admin/auth';

await getAuth().setCustomUserClaims(userId, {
  isAdmin: true,
  role: 'admin'
});
```

---

## 📊 Shared Resources

Both client and admin share:

✅ **Firebase Project** - Same Firestore database  
✅ **Environment Variables** - Shared Firebase config  
✅ **API Routes** - Can access same server endpoints  
✅ **Firestore Collections** - bookings, users, drivers, etc.

---

## 🎯 Development Workflow

### Working on Client

```bash
# From project root
pnpm dev

# Access: http://localhost:3000
```

### Working on Admin

```bash
# From project root
cd admin
pnpm dev

# Access: http://localhost:4000/admin
```

### Working on Both

```bash
# Terminal 1
pnpm dev

# Terminal 2
cd admin && pnpm dev
```

---

## 🏗️ Project Structure

### Client (Root)
```
citycars/
├── pages/              # Client pages
├── components/         # Client components
├── server/api/         # Client API routes
├── layouts/            # Client layouts
├── plugins/            # Client plugins
├── stores/             # Pinia stores
└── nuxt.config.ts      # Client config (port 3000)
```

### Admin Portal
```
admin/
├── pages/admin/        # Admin pages
│   ├── index.vue       # Dashboard
│   ├── bookings/       # Booking management
│   ├── drivers/        # Driver management
│   ├── offers/         # Offers management
│   └── settings/       # Settings
├── layouts/            # Admin layouts
│   └── default.vue     # Main admin layout
├── server/api/         # Admin API routes (optional)
├── nuxt.config.ts      # Admin config (port 4000)
└── package.json        # Admin dependencies
```

---

## 📝 Adding New Admin Pages

1. **Create page file:**
   ```bash
   touch admin/pages/admin/new-page.vue
   ```

2. **Add to sidebar navigation:**
   Edit `admin/layouts/default.vue`:
   ```vue
   <NuxtLink to="/admin/new-page">
     New Page
   </NuxtLink>
   ```

3. **Access:**
   ```
   http://localhost:4000/admin/new-page
   ```

---

## 🔄 Syncing Changes

### Client Changes
- Changes to client code only affect client app
- Admin is not affected

### Admin Changes
- Changes to admin code only affect admin portal
- Client is not affected

### Shared Changes (Future)
- If you create a `shared/` package
- Changes affect both client and admin

---

## 🐛 Troubleshooting

### Port Already in Use

**Client (3000):**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Admin (4000):**
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9
```

### Dependencies Not Found

```bash
# Re-install all dependencies
rm -rf node_modules admin/node_modules
pnpm install
```

### TypeScript Errors

```bash
# Regenerate Nuxt types
pnpm nuxt prepare

# In admin
cd admin && pnpm nuxt prepare
```

---

## 🎨 Customization

### Change Admin Port

Edit `admin/nuxt.config.ts`:
```typescript
devServer: {
  port: 5000, // Change from 4000 to 5000
}
```

### Add Shared Components

Create `shared/components/` folder and use in both apps.

---

## ✅ Benefits of This Setup

1. **Separation of Concerns**
   - Client and admin are completely separate
   - No code mixing or confusion

2. **Independent Deployment**
   - Deploy client and admin separately
   - Update one without affecting the other

3. **Different Tech Stacks (If Needed)**
   - Admin can use different UI libraries
   - Client can have different optimizations

4. **Better Performance**
   - Admin doesn't bloat client bundle
   - Faster builds and deploys

5. **Security**
   - Admin routes completely separate
   - No accidental admin exposure in client

6. **Scalability**
   - Easy to add more admin features
   - Can add mobile admin app later

---

## 📞 Support

**Client Issues:** Check main `README.md`  
**Admin Issues:** Check `admin/README.md`  
**Monorepo Issues:** This guide

---

## 🚦 Status

- ✅ Workspace configured
- ✅ Admin portal created
- ✅ Separate ports assigned
- ✅ Shared Firebase backend
- ✅ Basic admin pages created
- 🔄 TODO: Shared components package
- 🔄 TODO: Concurrent run scripts

---

**Last Updated:** 2025-11-19  
**Version:** 1.0.0  
**Architecture:** Microfrontend Monorepo

