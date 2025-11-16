/**
 * Data Seeder Script for Predictive Maintenance Dashboard
 * 
 * This script populates Firestore with demo data:
 * - Users (admin, engineer, viewer)
 * - Machines
 * - Downtime Events
 * - Work Orders
 * 
 * Usage:
 * 1. Make sure Firebase config is set up in src/firebase/config.js
 * 2. Run: node scripts/seedData.js
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, setDoc, doc, Timestamp } from 'firebase/firestore';

// Import your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Demo Users
const users = [
  { email: 'admin@meil.com', password: 'admin123', role: 'admin', name: 'Admin User' },
  { email: 'engineer@meil.com', password: 'engineer123', role: 'engineer', name: 'John Engineer' },
  { email: 'viewer@meil.com', password: 'viewer123', role: 'viewer', name: 'Jane Viewer' }
];

// Demo Machines
const machines = [
  { name: 'Conveyor Motor A1', line: 'Line A', assetCode: 'MTR-001', status: 'Running', criticality: 'High' },
  { name: 'Hydraulic Press B2', line: 'Line B', assetCode: 'HYD-002', status: 'Running', criticality: 'High' },
  { name: 'CNC Machine C3', line: 'Line C', assetCode: 'CNC-003', status: 'Under Maintenance', criticality: 'Medium' },
  { name: 'Packaging Unit D4', line: 'Line D', assetCode: 'PKG-004', status: 'Running', criticality: 'Low' },
  { name: 'Assembly Robot E5', line: 'Line E', assetCode: 'ROB-005', status: 'Stopped', criticality: 'High' },
  { name: 'Welding Station F6', line: 'Line F', assetCode: 'WLD-006', status: 'Running', criticality: 'Medium' },
  { name: 'Quality Checker G7', line: 'Line G', assetCode: 'QCH-007', status: 'Running', criticality: 'Low' },
  { name: 'Paint Booth H8', line: 'Line H', assetCode: 'PNT-008', status: 'Faulted', criticality: 'Medium' }
];

// Generate random date within last N days
function randomDate(days) {
  const now = new Date();
  const past = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const random = new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
  return Timestamp.fromDate(random);
}

// Generate random downtime duration (10-120 minutes)
function randomDowntime() {
  return Math.floor(Math.random() * 110) + 10;
}

const categories = ['Mechanical', 'Electrical', 'Breakdown', 'Planned Maintenance'];
const reasons = [
  'Motor overheating',
  'Belt misalignment',
  'Sensor malfunction',
  'Hydraulic leak',
  'Power supply failure',
  'Software error',
  'Bearing wear',
  'Routine inspection',
  'Component replacement',
  'Calibration required'
];

async function seedUsers() {
  console.log('Seeding users...');
  
  for (const user of users) {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      const uid = userCredential.user.uid;
      
      // Add user document to Firestore
      await setDoc(doc(db, 'users', uid), {
        email: user.email,
        role: user.role,
        name: user.name,
        createdAt: Timestamp.now()
      });
      
      console.log(`✓ Created user: ${user.email} (${user.role})`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`- User already exists: ${user.email}`);
      } else {
        console.error(`✗ Error creating user ${user.email}:`, error.message);
      }
    }
  }
}

async function seedMachines() {
  console.log('\nSeeding machines...');
  const machineIds = [];
  
  for (const machine of machines) {
    try {
      const docRef = await addDoc(collection(db, 'machines'), {
        ...machine,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      machineIds.push(docRef.id);
      console.log(`✓ Created machine: ${machine.name}`);
    } catch (error) {
      console.error(`✗ Error creating machine ${machine.name}:`, error.message);
    }
  }
  
  return machineIds;
}

async function seedEvents(machineIds) {
  console.log('\nSeeding downtime events...');
  
  for (let i = 0; i < 30; i++) {
    const machineId = machineIds[Math.floor(Math.random() * machineIds.length)];
    const startTime = randomDate(30);
    const downtimeMinutes = randomDowntime();
    const endTime = Timestamp.fromMillis(startTime.toMillis() + downtimeMinutes * 60 * 1000);
    
    const event = {
      machineId,
      startTime,
      endTime,
      downtimeMinutes,
      category: categories[Math.floor(Math.random() * categories.length)],
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      comments: Math.random() > 0.5 ? 'Investigated and resolved' : '',
      createdBy: users[Math.floor(Math.random() * users.length)].email,
      createdAt: Timestamp.now()
    };
    
    try {
      await addDoc(collection(db, 'events'), event);
      console.log(`✓ Created event for machine ${machineId.slice(0, 8)}... (${downtimeMinutes}min)`);
    } catch (error) {
      console.error('✗ Error creating event:', error.message);
    }
  }
}

async function seedWorkOrders(machineIds) {
  console.log('\nSeeding work orders...');
  
  const workOrders = [
    { title: 'Replace conveyor belt', priority: 'High', status: 'Open' },
    { title: 'Hydraulic system inspection', priority: 'Medium', status: 'In Progress' },
    { title: 'CNC calibration', priority: 'High', status: 'In Progress' },
    { title: 'Motor maintenance', priority: 'Medium', status: 'Open' },
    { title: 'Software update', priority: 'Low', status: 'Open' },
    { title: 'Safety system check', priority: 'High', status: 'Closed' },
    { title: 'Bearing replacement', priority: 'High', status: 'Open' },
    { title: 'Paint booth cleaning', priority: 'Low', status: 'Closed' },
    { title: 'Robot arm recalibration', priority: 'High', status: 'In Progress' },
    { title: 'Sensor replacement', priority: 'Medium', status: 'Open' }
  ];
  
  const engineers = ['John Engineer', 'Mike Smith', 'Sarah Johnson'];
  
  for (const wo of workOrders) {
    const machineId = machineIds[Math.floor(Math.random() * machineIds.length)];
    const dueDate = Timestamp.fromDate(
      new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000)
    );
    
    const workOrder = {
      ...wo,
      machineId,
      dueDate,
      assignedTo: engineers[Math.floor(Math.random() * engineers.length)],
      description: 'Routine maintenance task as per schedule',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    try {
      await addDoc(collection(db, 'workOrders'), workOrder);
      console.log(`✓ Created work order: ${wo.title}`);
    } catch (error) {
      console.error(`✗ Error creating work order ${wo.title}:`, error.message);
    }
  }
}

async function main() {
  console.log('🌱 Starting data seeding...\n');
  console.log('⚠️  Make sure to update Firebase config in this file!\n');
  
  try {
    await seedUsers();
    const machineIds = await seedMachines();
    await seedEvents(machineIds);
    await seedWorkOrders(machineIds);
    
    console.log('\n✅ Data seeding completed successfully!');
    console.log('\n📝 Demo Credentials:');
    console.log('  Admin:    admin@meil.com / admin123');
    console.log('  Engineer: engineer@meil.com / engineer123');
    console.log('  Viewer:   viewer@meil.com / viewer123');
    
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
  }
  
  process.exit(0);
}

main();
