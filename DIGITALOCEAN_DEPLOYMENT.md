# 🚀 DigitalOcean App Platform Deployment Guide

## 📋 Overview

CityCars uses a **Module Federation / Monorepo** architecture with:
- **Main App** (port 3001 internal)
- **Admin Portal** (port 4000 internal)
- **Proxy Server** (port 8080 public)

The proxy routes:
- `domain.com/*` → Main App
- `domain.com/admin/*` → Admin Portal

---

## 🏗️ Architecture

```
                    DigitalOcean App Platform
                              │
                              ▼
                    ┌─────────────────────┐
                    │   Proxy (Port 8080) │
                    │  (Public Facing)    │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
    ┌──────────────────┐         ┌──────────────────┐
    │  Main App (3001) │         │  Admin (4000)    │
    │    (Internal)    │         │   (Internal)     │
    └──────────────────┘         └──────────────────┘
```

---

## 📦 Pre-Deployment Checklist

### 1. **Environment Variables**

Set these in DigitalOcean App Platform dashboard:

| Variable | Type | Value |
|----------|------|-------|
| `NODE_ENV` | Plain Text | `production` |
| `GOOGLE_MAPS_API_KEY` | Secret | Your Google Maps API Key |
| `FIREBASE_SERVICE_ACCOUNT` | Secret | Your Firebase service account JSON |
| `NUXT_PUBLIC_FIREBASE_API_KEY` | Secret | `AIzaSyBuUPDFnKHfH21vaclS5CaK8O7qV41l8X0` |
| `NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Plain Text | `city-cars-83256.firebaseapp.com` |
| `NUXT_PUBLIC_FIREBASE_PROJECT_ID` | Plain Text | `city-cars-83256` |
| `NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Plain Text | `city-cars-83256.firebasestorage.app` |
| `NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Plain Text | `413911303220` |
| `NUXT_PUBLIC_FIREBASE_APP_ID` | Plain Text | `1:413911303220:web:e18b7b14c3eba16fcb7661` |
| `NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Plain Text | `G-NPXSZ0VECD` |

### 2. **Firestore Security Rules**

Ensure you've deployed the Firestore security rules from `FIRESTORE_RULES.txt`.

### 3. **Firebase Service Account**

Create a service account key:
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Copy the entire JSON content
4. Paste it into the `FIREBASE_SERVICE_ACCOUNT` environment variable in DigitalOcean

---

## 🚀 Deployment Steps

### Option 1: Using App Spec (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for DigitalOcean deployment"
   git push origin main
   ```

2. **Create a new App in DigitalOcean**
   - Go to DigitalOcean Dashboard → Apps
   - Click "Create App"
   - Connect your GitHub repository
   - Select the `citycars` repository and `main` branch

3. **Upload App Spec**
   - Click "Edit App Spec"
   - Copy contents from `.do/app.yaml`
   - Paste and update:
     - `github.repo` → Your GitHub username/citycars
     - `region` → Your preferred region (nyc, sfo, lon, etc.)

4. **Configure Environment Variables**
   - Go to "Settings" → "Environment Variables"
   - Add all variables from the checklist above

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (5-10 minutes)

### Option 2: Manual Configuration

1. **Create App**
   - Connect GitHub repository
   - Select `citycars` repository and `main` branch

2. **Build Configuration**
   - Build Command: `pnpm run build:all`
   - Run Command: `pnpm run start:production`
   - HTTP Port: `8080`

3. **Resource Configuration**
   - Instance Size: `Basic (512MB RAM, 1 vCPU)` or higher
   - Instance Count: `1` (scale as needed)

4. **Environment Variables**
   - Add all variables from checklist

5. **Deploy**

---

## 🔍 Post-Deployment Verification

### 1. **Check Health**
```bash
curl https://your-app.ondigitalocean.app/health
# Should return: OK
```

### 2. **Test Main App**
```bash
curl https://your-app.ondigitalocean.app/
# Should return HTML for homepage
```

### 3. **Test Admin Portal**
```bash
curl https://your-app.ondigitalocean.app/admin/login
# Should return HTML for admin login
```

### 4. **Check Logs**
- Go to DigitalOcean Dashboard → Your App → "Runtime Logs"
- Look for:
  ```
  ✅ CityCars Production Proxy Server is running
  🟢 Starting Main App on port 3001...
  🟠 Starting Admin Portal on port 4000...
  ```

---

## 🐛 Troubleshooting

### Issue: "Bad Gateway" on /admin
**Solution**: Check that admin app is running on port 4000
```bash
# In DigitalOcean console
curl http://localhost:4000/admin
```

### Issue: CSS not loading
**Solution**: Already fixed with `inlineSSRStyles: true` in nuxt.config.ts

### Issue: Firebase connection errors
**Solution**: Verify `FIREBASE_SERVICE_ACCOUNT` is set correctly

### Issue: Build fails
**Solution**: Check build logs in DigitalOcean
```bash
# Common fixes:
# 1. Ensure all scripts are executable (chmod +x *.sh)
# 2. Check pnpm version matches package.json
# 3. Verify Node.js version >= 18.0.0
```

---

## 📊 Monitoring

### Performance
- Use DigitalOcean's built-in monitoring
- Watch for high memory usage (upgrade instance if needed)

### Error Tracking
- Check "Runtime Logs" for errors
- Monitor Firestore usage in Firebase Console

---

## 🔄 Updating the App

### Automatic Deployment
- Push to `main` branch
- DigitalOcean auto-deploys

### Manual Deployment
- Go to your App → "Actions" → "Force Rebuild and Deploy"

---

## 💰 Cost Estimation

| Component | Cost |
|-----------|------|
| Basic Instance (512MB RAM) | ~$5/month |
| Professional Instance (1GB RAM) | ~$12/month |
| Bandwidth | Included (1TB) |
| **Total** | **$5-12/month** |

*Note: Firestore and Firebase costs are separate*

---

## 🎯 Custom Domain Setup

1. Go to your App → "Settings" → "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., `citycars.com`)
4. Add DNS records:
   ```
   Type: CNAME
   Name: @
   Value: your-app.ondigitalocean.app
   TTL: 3600
   ```
5. Wait for DNS propagation (5-30 minutes)

### Admin Portal Access
- Main: `https://citycars.com`
- Admin: `https://citycars.com/admin`

---

## 📝 Production Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Build All | `pnpm run build:all` | Builds main + admin apps |
| Start Production | `pnpm run start:production` | Starts all services |
| Dev (Local) | `pnpm run dev:all` | Runs dev servers with proxy |
| Stop All | `pnpm run stop` | Kills all local processes |

---

## ✅ Success Checklist

- [ ] Code pushed to GitHub
- [ ] App created in DigitalOcean
- [ ] Environment variables configured
- [ ] App deployed successfully
- [ ] Main app accessible at domain.com
- [ ] Admin accessible at domain.com/admin
- [ ] Login works for both main and admin
- [ ] Bookings work end-to-end
- [ ] Firebase/Firestore connected
- [ ] Google Maps API working
- [ ] CSS loads without flash (FOUC fixed)
- [ ] Custom domain configured (optional)

---

## 🆘 Support

If you encounter issues:
1. Check DigitalOcean Runtime Logs
2. Verify environment variables
3. Test locally with `pnpm run dev:all`
4. Check Firestore security rules
5. Verify Firebase service account permissions

---

**Deployment Date**: {DATE}  
**Version**: 1.0.0  
**Platform**: DigitalOcean App Platform

