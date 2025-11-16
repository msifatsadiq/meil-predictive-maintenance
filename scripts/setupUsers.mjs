/**
 * Quick Setup Script - Create Demo Users
 * 
 * This script creates 3 demo users in Firebase Authentication
 * and adds their role information to Firestore.
 * 
 * Usage: node scripts/setupUsers.mjs
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc, Timestamp } from 'firebase/firestore';

// Your Firebase config from .env
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyCZ4s9NzcCkPZdh1ZZ8iGoi55yCrrFSBDM",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "fir-mvp-c2b6f.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "fir-mvp-c2b6f",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "fir-mvp-c2b6f.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "846009887090",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:846009887090:web:50fb7dd4f0abeacb14b2e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Demo Users to Create
const users = [
  { 
    email: 'admin@meil.com', 
    password: 'admin123', 
    role: 'admin', 
    name: 'Admin User' 
  },
  { 
    email: 'engineer@meil.com', 
    password: 'engineer123', 
    role: 'engineer', 
    name: 'John Engineer' 
  },
  { 
    email: 'viewer@meil.com', 
    password: 'viewer123', 
    role: 'viewer', 
    name: 'Jane Viewer' 
  }
];

async function setupUsers() {
  console.log('🔧 Setting up demo users...\n');
  
  for (const user of users) {
    try {
      // Step 1: Create user in Firebase Authentication
      console.log(`Creating auth user: ${user.email}...`);
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        user.email, 
        user.password
      );
      const uid = userCredential.user.uid;
      
      // Step 2: Add user role document to Firestore
      console.log(`Adding role document for ${user.email}...`);
      await setDoc(doc(db, 'users', uid), {
        email: user.email,
        role: user.role,
        name: user.name,
        createdAt: Timestamp.now()
      });
      
      console.log(`✅ Successfully created: ${user.email} (${user.role})\n`);
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  User already exists: ${user.email}`);
        console.log(`   Note: Role document may need to be created manually in Firestore.\n`);
      } else {
        console.error(`❌ Error creating ${user.email}:`, error.message, '\n');
      }
    }
  }
  
  console.log('✅ User setup complete!\n');
  console.log('📝 Demo Credentials:');
  console.log('   Admin:    admin@meil.com / admin123');
  console.log('   Engineer: engineer@meil.com / engineer123');
  console.log('   Viewer:   viewer@meil.com / viewer123\n');
  console.log('🌐 Now try logging into your app at http://localhost:5174\n');
  
  process.exit(0);
}

setupUsers().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
