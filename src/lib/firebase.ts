/**
 * Minimal Firebase Configuration
 * Simple, working Firebase setup without complex emulator logic
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// BooksBoardroom Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdrQ7LKW7KBRZ-3XSQHs30NL__Pm6UgUY",
  authDomain: "booksboardroom.firebaseapp.com",
  projectId: "booksboardroom",
  storageBucket: "booksboardroom.firebasestorage.app",
  messagingSenderId: "593618213270",
  appId: "1:593618213270:web:dafe703dfefbd1a61be5b7",
  databaseURL: "https://booksboardroom-default-rtdb.firebaseio.com",
  measurementId: "G-SWMP0X5MQM"
};

console.log('🔥 Firebase Config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

console.log('✅ Firebase initialized successfully');

// Simple error handler
export const handleFirebaseError = (error: Error & { code?: string }) => {
  console.error('Firebase Error:', error);
  return {
    code: error.code || 'unknown',
    message: error.message || 'An unknown error occurred',
    originalError: error
  };
};

// Auth helpers for compatibility
export const authHelpers = {
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error) {
      throw handleFirebaseError(error as Error & { code?: string });
    }
  },

  signOut: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw handleFirebaseError(error as Error & { code?: string });
    }
  },

  getCurrentUser: () => auth.currentUser,

  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  }
}; 