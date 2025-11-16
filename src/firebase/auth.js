import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

/**
 * Sign in user with email and password
 */
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user role from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    
    return {
      uid: user.uid,
      email: user.email,
      role: userData?.role || 'viewer',
      name: userData?.name || email.split('@')[0]
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Subscribe to auth state changes
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      callback({
        uid: user.uid,
        email: user.email,
        role: userData?.role || 'viewer',
        name: userData?.name || user.email.split('@')[0]
      });
    } else {
      callback(null);
    }
  });
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};
