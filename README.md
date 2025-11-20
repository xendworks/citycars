# 🚕 CityCars - Airport Taxi Booking Platform

Professional taxi booking platform with real-time pricing, Google Maps integration, and admin management portal.

## 🏗️ Architecture

**Module Federation / Monorepo**
```
citycars/
├── Main App (Port 3001)          # Customer-facing booking platform
├── Admin Portal (Port 4000)      # Management dashboard
└── Proxy Server (Port 3000)      # Routes traffic between apps
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 9.14.2
- Firebase project
- Google Maps API key

### Installation
```bash
# Install dependencies (both main and admin)
pnpm install
cd admin && pnpm install && cd ..
```

### Development
```bash
# Start all services (main + admin + proxy)
pnpm run dev:all

# Access:
# Main App:     http://localhost:3000
# Admin Portal: http://localhost:3000/admin
```

### Production Build
```bash
# Build all applications
pnpm run build:all

# Start in production mode
pnpm run start:production
```

## 📁 Project Structure

```
citycars/
├── admin/                      # Admin portal (separate Nuxt app)
│   ├── components/            # Admin-specific components
│   ├── composables/           # Admin Firestore & auth
│   ├── layouts/               # Admin layout
│   ├── pages/                 # Admin pages
│   └── nuxt.config.ts         # Admin config
│
├── components/                 # Shared components
├── composables/                # Client-side composables
├── pages/                      # Main app pages
├── server/                     # API routes
├── stores/                     # Pinia stores
├── utils/                      # Utilities (pricing, etc.)
│
├── proxy-server.cjs            # Dev proxy
├── proxy-production.cjs        # Production proxy
├── start-all.sh                # Dev startup script
├── stop-all.sh                 # Stop all services
└── build-all.sh                # Production build script
```

## 🔧 Environment Variables

Create `.env` file in the root:

```env
# Google Maps
GOOGLE_MAPS_API_KEY=your_key_here

# Firebase
NUXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NUXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Admin (optional for local dev)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

## 📦 Key Features

### Customer Platform
- ✅ Real-time fare calculation
- ✅ Google Maps integration with live traffic
- ✅ Multiple vehicle types (Saloon, Estate, MPV, Wheelchair)
- ✅ User authentication (Email + Google OAuth)
- ✅ Phone verification (SMS)
- ✅ Booking management
- ✅ Profile with saved addresses
- ✅ Wallet system

### Admin Portal
- ✅ Bookings management
- ✅ Driver management
- ✅ User management
- ✅ Offers & promotions
- ✅ Real-time dashboard
- ✅ Role-based access control

## 🎨 Tech Stack

- **Framework**: Nuxt 3 (Vue 3)
- **Styling**: Tailwind CSS + Element Plus (admin)
- **State Management**: Pinia
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Maps**: Google Maps JavaScript API
- **Email**: Nodemailer
- **Package Manager**: pnpm

## 📊 Pricing Logic

Located in `utils/pricing.ts`:
- **1-5 miles**: £5/mile (£25 minimum)
- **6-10 miles**: Base + £3/mile
- **11-30 miles**: Base + £2/mile
- **30+ miles**: Base + £1.50/mile

**Vehicle Surcharges**:
- Saloon: 0% (base)
- Estate: +15%
- MPV: +30%
- 7 Seater: +45%
- 9 Seater: +60%
- Wheelchair: +15%

## 🔐 Firestore Security

Deploy rules from `FIRESTORE_RULES.txt` to Firebase Console:
```bash
firebase deploy --only firestore:rules
```

## 🚢 Deployment

See **[DIGITALOCEAN_DEPLOYMENT.md](./DIGITALOCEAN_DEPLOYMENT.md)** for detailed deployment instructions.

### DigitalOcean App Platform
```yaml
# Use .do/app.yaml for App Platform deployment
build_command: pnpm run build:all
run_command: pnpm run start:production
http_port: 8080
```

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start main app only (dev) |
| `pnpm run dev:all` | Start all services with proxy |
| `pnpm run build` | Build main app |
| `pnpm run build:all` | Build main + admin |
| `pnpm run start` | Start main app (production) |
| `pnpm run start:production` | Start all services (production) |
| `pnpm run stop` | Stop all running services |

## 🆘 Troubleshooting

### Admin portal not loading bookings
- Check Firebase config in `admin/nuxt.config.ts`
- Verify Firestore rules are deployed
- Check browser console for Firebase errors

### Proxy not working
- Ensure all ports are free (3000, 3001, 4000)
- Run `pnpm run stop` to kill all processes
- Check logs in `logs/` directory

### CSS flash (FOUC) on page navigation
- Already fixed with `inlineSSRStyles: true`
- Clear browser cache if still seeing it

## 📄 License

Proprietary - © 2025 CityCars

## 🤝 Support

For deployment or technical issues, refer to:
- [DigitalOcean Deployment Guide](./DIGITALOCEAN_DEPLOYMENT.md)
- [Firestore Rules](./FIRESTORE_RULES.txt)

---

**Version**: 1.0.0  
**Last Updated**: November 2024
