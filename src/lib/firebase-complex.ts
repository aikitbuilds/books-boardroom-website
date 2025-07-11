/**
 * Firebase Configuration
 * 
 * This file initializes Firebase services for the Solar Ops Orchestrator AI Platform.
 * It sets up authentication, Firestore database, storage, functions, and analytics.
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
  useEmulators,
  environment: import.meta.env.MODE,
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
    'auth/operation-not-allowed': 'This operation is not allowed. Please enable Google sign-in in Firebase Console.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed before completing the process',
    'auth/popup-blocked': 'Sign-in popup was blocked by the browser. Please allow popups for this site.',
    'auth/unauthorized-domain': 'This domain is not authorized for OAuth operations. Please add it to the authorized domains in Firebase Console.',
    'firestore/permission-denied': 'Permission denied for Firestore operation',
    'firestore/unavailable': 'The Firestore service is unavailable'
  };
  
  const userMessage = errorMap[errorCode] || errorMessage;
  
  console.error('Firebase Error:', {
    code: errorCode,
    message: errorMessage,
    userMessage,
    originalError: error
  });
  
  return {
    code: errorCode,
    message: userMessage,
    originalError: error
  };
};

/**
 * Authentication helper functions
 */
export const authHelpers = {
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

  getCurrentUser: () => auth.currentUser,

  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  }
};

/**
 * Database helper functions
 */
export const dbHelpers = {
  enableNetwork: () => enableNetwork(db),
  disableNetwork: () => disableNetwork(db),
  isOnline: () => navigator.onLine
};

/**
 * Firebase app health check
 */
export const healthCheck = async () => {
  const health = {
    auth: !!auth,
    firestore: !!db,
    storage: !!storage,
    functions: !!functions,
    analytics: !!analytics,
    timestamp: new Date().toISOString()
  };

  console.log('Firebase Health Check:', health);
  return health;
};

// Export all services and utilities
export { analytics, performance };

// Initialize health check on load
if (typeof window !== 'undefined') {
  setTimeout(healthCheck, 1000);
} 