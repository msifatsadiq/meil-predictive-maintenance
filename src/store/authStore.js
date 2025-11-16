import { create } from 'zustand';
import { onAuthChange, signIn as firebaseSignIn, signOut as firebaseSignOut } from '../firebase/auth';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  // Initialize auth listener
  initialize: () => {
    const unsubscribe = onAuthChange((user) => {
      set({ user, loading: false });
    });
    return unsubscribe;
  },

  // Sign in
  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const user = await firebaseSignIn(email, password);
      set({ user, loading: false });
      return user;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    set({ loading: true, error: null });
    try {
      await firebaseSignOut();
      set({ user: null, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
