# Firebase Admin SDK Setup

## Error: "Unable to detect a Project Id in the current environment"

This error means the Firebase Admin SDK can't authenticate. Here's how to fix it:

---

## **Quick Fix (Development)**

### Option 1: Download Service Account Key (Recommended)

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. Select your project: **city-cars-83256**
3. Click the gear icon ⚙️ → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Save the JSON file as `serviceAccountKey.json` in your project root

7. **Create `.env` file** in project root:

```bash
# .env
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"city-cars-83256",...}'
```

8. **Or set as environment variable** (easier):

```bash
# Just point to the file
export GOOGLE_APPLICATION_CREDENTIALS="/Users/saicharan/Documents/GitHub/citycars/serviceAccountKey.json"
```

Then restart your dev server:
```bash
pnpm dev
```

---

### Option 2: Use gcloud CLI (Simpler)

1. **Install Google Cloud SDK**:
```bash
brew install --cask google-cloud-sdk
```

2. **Login and set project**:
```bash
gcloud auth application-default login
gcloud config set project city-cars-83256
```

3. **Restart dev server**:
```bash
pnpm dev
```

---

## **For Production (Deployment)**

Set the `FIREBASE_SERVICE_ACCOUNT` environment variable with your service account JSON:

```bash
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"city-cars-83256","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'
```

---

## **Quick Test After Setup**

Try editing your profile and saving. The error should be gone!

---

## **Security Notes**

⚠️ **NEVER commit `serviceAccountKey.json` or `.env` to git!**

Already added to `.gitignore`:
- `serviceAccountKey.json`
- `.env`
- `.env.local`

---

## **What This Fixes**

- ✅ User profile updates
- ✅ Saved addresses (pickup/dropoff)
- ✅ Wallet balance & transactions
- ✅ All Firestore database operations

