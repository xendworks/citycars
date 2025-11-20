#!/usr/bin/env node

/**
 * Seed Admin Users Script
 * 
 * Creates 3 admin users in Firebase Auth and Firestore:
 * 1. Super Admin (admin@citycars.com)
 * 2. Manager (manager@citycars.com)
 * 3. Operator (operator@citycars.com)
 * 
 * Usage: node scripts/seed-admin-users.mjs
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const projectId = 'city-cars-83256';

// Initialize Firebase Admin
let app;
try {
  // Try to use service account if available
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : null;
  
  if (serviceAccount) {
    app = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    // Use project ID for local development
    app = initializeApp({
      projectId: projectId,
    });
    console.log('⚠️  Using development mode (no service account)');
    console.log('⚠️  Make sure you have Firebase Admin permissions');
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error.message);
  process.exit(1);
}

const auth = getAuth(app);
const db = getFirestore(app);

// Admin users to create
const adminUsers = [
  {
    email: 'admin@citycars.com',
    password: 'admin123',
    displayName: 'Super Admin',
    role: 'super_admin',
  },
  {
    email: 'manager@citycars.com',
    password: 'manager123',
    displayName: 'Manager',
    role: 'manager',
  },
  {
    email: 'operator@citycars.com',
    password: 'operator123',
    displayName: 'Operator',
    role: 'operator',
  },
];

async function createAdminUser(userData) {
  try {
    console.log(`\n📝 Creating user: ${userData.email}`);
    
    // Check if user already exists
    let user;
    try {
      user = await auth.getUserByEmail(userData.email);
      console.log(`   ℹ️  User already exists in Firebase Auth (UID: ${user.uid})`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create user in Firebase Auth
        user = await auth.createUser({
          email: userData.email,
          password: userData.password,
          displayName: userData.displayName,
          emailVerified: true,
        });
        console.log(`   ✅ Created in Firebase Auth (UID: ${user.uid})`);
      } else {
        throw error;
      }
    }
    
    // Create/Update user profile in Firestore
    const userRef = db.collection('users').doc(user.uid);
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
      // Update existing document with role
      await userRef.update({
        role: userData.role,
        displayName: userData.displayName,
        updatedAt: Timestamp.now(),
      });
      console.log(`   ✅ Updated Firestore profile with role: ${userData.role}`);
    } else {
      // Create new document
      await userRef.set({
        uid: user.uid,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
        phoneNumber: null,
        photoURL: null,
        preferredPickupLocations: [],
        preferredDropoffLocations: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log(`   ✅ Created Firestore profile with role: ${userData.role}`);
    }
    
    return {
      success: true,
      uid: user.uid,
      email: userData.email,
      role: userData.role,
    };
  } catch (error) {
    console.error(`   ❌ Error creating ${userData.email}:`, error.message);
    return {
      success: false,
      email: userData.email,
      error: error.message,
    };
  }
}

async function seedAdminUsers() {
  console.log('🌱 Seeding Admin Users...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const results = [];
  
  for (const userData of adminUsers) {
    const result = await createAdminUser(userData);
    results.push(result);
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  if (successful.length > 0) {
    console.log('✅ Successfully created/updated:');
    successful.forEach(r => {
      console.log(`   • ${r.email} (${r.role}) - UID: ${r.uid}`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed:');
    failed.forEach(r => {
      console.log(`   • ${r.email}: ${r.error}`);
    });
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 Seeding complete!');
  console.log('\n📋 Admin Credentials:');
  console.log('   • Super Admin: admin@citycars.com / admin123');
  console.log('   • Manager:     manager@citycars.com / manager123');
  console.log('   • Operator:    operator@citycars.com / operator123');
  console.log('\n🌐 Login at: http://localhost:3000/admin/login');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Run the seeder
seedAdminUsers()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });

