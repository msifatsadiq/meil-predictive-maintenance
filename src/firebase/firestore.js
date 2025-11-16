import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

// ============ MACHINES ============
export const getMachines = async () => {
  const q = query(collection(db, 'machines'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getMachine = async (id) => {
  const docRef = doc(db, 'machines', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const addMachine = async (data) => {
  const docRef = await addDoc(collection(db, 'machines'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateMachine = async (id, data) => {
  const docRef = doc(db, 'machines', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deleteMachine = async (id) => {
  await deleteDoc(doc(db, 'machines', id));
};

// ============ EVENTS ============
export const getEvents = async (filters = {}) => {
  let q = query(collection(db, 'events'), orderBy('startTime', 'desc'));
  
  if (filters.machineId) {
    q = query(collection(db, 'events'), where('machineId', '==', filters.machineId), orderBy('startTime', 'desc'));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getEvent = async (id) => {
  const docRef = doc(db, 'events', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const addEvent = async (data) => {
  // Calculate downtime in minutes
  const startTime = data.startTime instanceof Timestamp ? data.startTime : Timestamp.fromDate(new Date(data.startTime));
  const endTime = data.endTime instanceof Timestamp ? data.endTime : Timestamp.fromDate(new Date(data.endTime));
  const downtimeMinutes = (endTime.toMillis() - startTime.toMillis()) / 60000;
  
  const docRef = await addDoc(collection(db, 'events'), {
    ...data,
    startTime,
    endTime,
    downtimeMinutes,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateEvent = async (id, data) => {
  const docRef = doc(db, 'events', id);
  
  // Recalculate downtime if times changed
  let updateData = { ...data };
  if (data.startTime && data.endTime) {
    const startTime = data.startTime instanceof Timestamp ? data.startTime : Timestamp.fromDate(new Date(data.startTime));
    const endTime = data.endTime instanceof Timestamp ? data.endTime : Timestamp.fromDate(new Date(data.endTime));
    updateData.downtimeMinutes = (endTime.toMillis() - startTime.toMillis()) / 60000;
    updateData.startTime = startTime;
    updateData.endTime = endTime;
  }
  
  await updateDoc(docRef, updateData);
};

export const deleteEvent = async (id) => {
  await deleteDoc(doc(db, 'events', id));
};

// ============ WORK ORDERS ============
export const getWorkOrders = async (filters = {}) => {
  let q = query(collection(db, 'workOrders'), orderBy('createdAt', 'desc'));
  
  if (filters.machineId) {
    q = query(collection(db, 'workOrders'), where('machineId', '==', filters.machineId), orderBy('createdAt', 'desc'));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getWorkOrder = async (id) => {
  const docRef = doc(db, 'workOrders', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const addWorkOrder = async (data) => {
  const docRef = await addDoc(collection(db, 'workOrders'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateWorkOrder = async (id, data) => {
  const docRef = doc(db, 'workOrders', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deleteWorkOrder = async (id) => {
  await deleteDoc(doc(db, 'workOrders', id));
};

// ============ USERS ============
export const getUser = async (uid) => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const getUsers = async () => {
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
