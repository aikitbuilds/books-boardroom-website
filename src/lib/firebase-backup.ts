/**
 * Firebase Configuration
 * 
 * This file initializes Firebase services for the Solar Ops Orchestrator AI Platform.
 * It sets up authentication, Firestore database, storage, functions, and analytics.
 * In development mode, it connects to Firebase emulators for local development.
 */

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';

// Environment variable validation
const getEnvVar = (key: string, fallback?: string): string => {
  const value = import.meta.env[key];
  if (!value && !fallback) {
    console.warn(`Missing environment variable: ${key}`);
  }
  return value || fallback || '';
};

// Check if Firebase config is available
const hasValidConfig = (): boolean => {
  const hasApiKey = !!getEnvVar('VITE_FIREBASE_API_KEY');
  const hasProjectId = !!getEnvVar('VITE_FIREBASE_PROJECT_ID');
  
  console.log('Environment variables check:', {
    hasApiKey,
    hasProjectId,
    apiKey: hasApiKey ? 'Present' : 'Missing',
    projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID') || 'Missing',
    environment: import.meta.env.MODE
  });
  
  return hasApiKey && hasProjectId;
};

// Production configuration from environment variables
const productionConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY', "AIzaSyCNM1u_mE8j9k3LBq3mnZDGn96C9yh2DNw"),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN', "gen-lang-client-0686783756.firebaseapp.com"),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID', "gen-lang-client-0686783756"),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET', "gen-lang-client-0686783756.appspot.com"),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID', "942449514075"),
  appId: getEnvVar('VITE_FIREBASE_APP_ID', "1:942449514075:web:c7578453425413149fd17e"),
  measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID', "G-MEMY6GHJ54")
};

// Use demo config if no valid config is available
const demoConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project-id",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789",
  measurementId: "G-DEMO123456"
};

// Local development configuration
const localConfig = {
  apiKey: "demo-key",
  authDomain: "localhost",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo",
  measurementId: "G-DEMO123456"
};

// Firebase configuration - use emulator config only if explicitly enabled, otherwise use production
const useEmulators = import.meta.env.VITE_USE_EMULATORS === 'true';
const firebaseConfig = import.meta.env.DEV && useEmulators 
  ? localConfig 
  : productionConfig;

// Log configuration being used
console.log('Firebase Config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasEnvVars: hasValidConfig()
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

// Initialize Performance Monitoring
let performance = null;
if (typeof window !== 'undefined' && import.meta.env.PROD) {
  try {
    performance = getPerformance(app);
  } catch (error) {
    console.warn('Firebase Performance initialization skipped:', error);
  }
}

// Initialize Analytics conditionally (only in browser environments and with valid config)
let analytics = null;
if (typeof window !== 'undefined' && firebaseConfig.measurementId && firebaseConfig.measurementId !== 'G-MEASUREMENT_ID') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(error => {
    console.warn('Firebase Analytics initialization skipped:', error.message);
  });
}

// Connect to emulators in development mode only if explicitly enabled
let emulatorsConnected = false;

if (import.meta.env.DEV && useEmulators && !emulatorsConnected) {
  const emulatorHost = import.meta.env.VITE_EMULATOR_HOST || 'localhost';
  
  try {
    // Only connect if not already connected
    if (!emulatorsConnected) {
      connectAuthEmulator(auth, `http://${emulatorHost}:9099`, { disableWarnings: true });
      connectFirestoreEmulator(db, emulatorHost, 8081);
      connectStorageEmulator(storage, emulatorHost, 9199);
      connectFunctionsEmulator(functions, emulatorHost, 5001);
      
      emulatorsConnected = true;
      console.log('🔥 Connected to Firebase emulators for local development');
    }
  } catch (error) {
    console.warn('⚠️ Firebase emulators connection failed, using production config:', error);
    console.log('🔥 Using production Firebase configuration');
  }
} else {
  console.log('🔥 Using production Firebase configuration');
}

/**
 * Custom Firebase error handler
 * @param error Firebase error object
 * @returns Formatted error object with code, message, and additional details
 */
export const handleFirebaseError = (error: Error & { code?: string }) => {
  const errorCode = error.code || 'unknown';
  const errorMessage = error.message || 'An unknown error occurred';
  
  // Map common Firebase error codes to user-friendly messages
  const errorMap: Record<string, string> = {
    'auth/user-not-found': 'No user found with this email address',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'This email is already registered',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/invalid-email': 'Invalid email address format',
    'auth/account-exists-with-different-credential': 'An account already exists with the same email but different sign-in credentials',
    'auth/operation-not-allowed': 'This operation is not allowed. Please enable Google sign-in in Firebase Console.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed before completing the process',
    'auth/popup-blocked': 'Sign-in popup was blocked by the browser. Please allow popups for this site.',
    'auth/unauthorized-domain': 'This domain is not authorized for OAuth operations. Please add it to the authorized domains in Firebase Console.',
    'auth/too-many-requests': 'Too many unsuccessful login attempts. Please try again later',
    'auth/user-disabled': 'This user account has been disabled',
    'auth/requires-recent-login': 'This operation requires recent authentication. Please log in again',
    'auth/invalid-credential': 'The authentication credential is invalid',
    'auth/invalid-verification-code': 'The verification code is invalid',
    'auth/invalid-verification-id': 'The verification ID is invalid',
    'auth/missing-verification-code': 'The verification code is missing',
    'auth/missing-verification-id': 'The verification ID is missing',
    'auth/phone-number-already-exists': 'This phone number is already in use',
    'auth/invalid-phone-number': 'The phone number format is incorrect',
    'auth/missing-phone-number': 'The phone number is missing',
    'auth/quota-exceeded': 'SMS quota exceeded',
    'storage/unauthorized': 'User does not have permission to access the storage',
    'storage/canceled': 'User canceled the upload',
    'storage/unknown': 'Unknown error occurred during storage operation',
    'firestore/permission-denied': 'Permission denied for Firestore operation',
    'firestore/unavailable': 'The Firestore service is unavailable',
    'firestore/data-loss': 'Unrecoverable data loss or corruption',
    'functions/cancelled': 'The operation was cancelled',
    'functions/unknown': 'Unknown error in Cloud Function',
    'functions/invalid-argument': 'Invalid argument provided to Cloud Function',
    'functions/deadline-exceeded': 'Deadline exceeded in Cloud Function',
    'functions/not-found': 'Cloud Function resource not found',
    'functions/already-exists': 'Cloud Function resource already exists',
    'functions/permission-denied': 'Permission denied for Cloud Function',
    'functions/unauthenticated': 'Unauthenticated request to Cloud Function',
    'functions/resource-exhausted': 'Resource quota exceeded in Cloud Function',
    'functions/failed-precondition': 'Operation rejected because system not in correct state',
    'functions/aborted': 'The operation was aborted',
    'functions/out-of-range': 'Operation attempted past valid range',
    'functions/unimplemented': 'Operation not implemented or supported',
    'functions/internal': 'Internal error in Cloud Function',
    'functions/unavailable': 'Cloud Function service unavailable',
    'functions/data-loss': 'Unrecoverable data loss or corruption in Cloud Function'
  };
  
  // Get user-friendly message if available, otherwise use the original message
  const userMessage = errorMap[errorCode] || errorMessage;
  
  // Log the error for debugging
  console.error('Firebase Error:', {
    code: errorCode,
    message: errorMessage,
    userMessage,
    originalError: error
  });
  
  // Return formatted error object
  return {
    code: errorCode,
    message: userMessage,
    originalError: error
  };
};

/**
 * Function to ensure environment variables are properly loaded
 * For debugging purposes during development
 */
export const verifyFirebaseConfig = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('Missing Firebase environment variables:', missingVars.join(', '));
    console.warn('Using production configuration instead.');
    return false;
  }
  
  return true;
};

/**
 * Authentication helper functions
 */
export const authHelpers = {
  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (analytics) {
        logEvent(analytics, 'login', { method: 'google' });
      }
      return result;
    } catch (error) {
      throw handleFirebaseError(error as Error & { code?: string });
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      if (analytics) {
        logEvent(analytics, 'logout');
      }
    } catch (error) {
      throw handleFirebaseError(error as Error & { code?: string });
    }
  },

  // Get current user
  getCurrentUser: () => auth.currentUser,

  // Listen to auth state changes
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  }
};

/**
 * Database helper functions
 */
export const dbHelpers = {
  // Enable/disable network for offline support
  enableNetwork: () => enableNetwork(db),
  disableNetwork: () => disableNetwork(db),
  
  // Check if online
  isOnline: () => navigator.onLine
};

/**
 * Firebase app health check
 */
export const healthCheck = async () => {
  const health = {
    auth: false,
    firestore: false,
    storage: false,
    functions: false,
    analytics: false,
    timestamp: new Date().toISOString()
  };

  try {
    // Check auth
    health.auth = !!auth;
    
    // Check Firestore
    health.firestore = !!db;
    
    // Check Storage
    health.storage = !!storage;
    
    // Check Functions
    health.functions = !!functions;
    
    // Check Analytics
    health.analytics = !!analytics;
    
    console.log('Firebase Health Check:', health);
    return health;
  } catch (error) {
    console.error('Firebase Health Check Failed:', error);
    return health;
  }
};

// Export all services and utilities
export { 
  analytics, 
  performance
};

// Initialize health check on load
if (typeof window !== 'undefined') {
  setTimeout(healthCheck, 1000);
}
