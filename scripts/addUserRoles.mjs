/**
 * Add User Role Documents to Firestore
 * 
 * This script adds role documents to Firestore for existing Firebase Auth users.
 * Run this if users can log in but get permission errors.
 * 
 * Usage: node scripts/addUserRoles.mjs
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, setDoc, doc, Timestamp } from 'firebase/firestore';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCZ4s9NzcCkPZdh1ZZ8iGoi55yCrrFSBDM",
  authDomain: "fir-mvp-c2b6f.firebaseapp.com",
  projectId: "fir-mvp-c2b6f",
  storageBucket: "fir-mvp-c2b6f.firebasestorage.app",
  messagingSenderId: "846009887090",
  appId: "1:846009887090:web:50fb7dd4f0abeacb14b2e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// User roles to add/update
const users = [
  { email: 'admin@meil.com', password: 'admin123', role: 'admin', name: 'Admin User' },
  { email: 'engineer@meil.com', password: 'engineer123', role: 'engineer', name: 'John Engineer' },
  { email: 'viewer@meil.com', password: 'viewer123', role: 'viewer', name: 'Jane Viewer' }
];

async function addUserRoles() {
  console.log('📝 Adding/updating user role documents in Firestore...\n');
  
  for (const user of users) {
    try {
      // Sign in to get the user's UID
      console.log(`Signing in as ${user.email}...`);
      const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);
      const uid = userCredential.user.uid;
      
      // Add/update role document in Firestore
      console.log(`Adding role document: users/${uid}`);
      await setDoc(doc(db, 'users', uid), {
        email: user.email,
        role: user.role,
        name: user.name,
        createdAt: Timestamp.now()
      }, { merge: true }); // merge: true updates without overwriting
      
      console.log(`✅ Role document created: ${user.email} → ${user.role}\n`);
      
      // Sign out
      await signOut(auth);
      
    } catch (error) {
      console.error(`❌ Error for ${user.email}:`, error.message, '\n');
    }
  }
  
  console.log('✅ All role documents added/updated!\n');
  console.log('🔐 Firestore Rules:');
  console.log('   Make sure you have deployed firestore.rules to Firebase.');
  console.log('   Run: firebase deploy --only firestore:rules\n');
  console.log('🧪 Test Now:');
  console.log('   1. Go to http://localhost:5174');
  console.log('   2. Login as admin@meil.com / admin123');
  console.log('   3. Try creating/editing/deleting a machine\n');
  
  process.exit(0);
}

addUserRoles().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
