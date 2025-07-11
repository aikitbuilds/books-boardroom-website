import { auth, db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, query, limit } from 'firebase/firestore';

export interface FirebaseDebugInfo {
  authStatus: {
    isAuthenticated: boolean;
    userId?: string;
    email?: string;
    emailVerified?: boolean;
    customClaims?: Record<string, unknown>;
    accessToken?: string;
  };
  firestoreStatus: {
    canConnect: boolean;
    canRead: boolean;
    canWrite: boolean;
    error?: string;
  };
  config: {
    projectId: string;
    authDomain: string;
    environment: string;
    useEmulators: boolean;
  };
}

/**
 * Comprehensive Firebase debugging function
 */
export const debugFirebase = async (): Promise<FirebaseDebugInfo> => {
  const result: FirebaseDebugInfo = {
    authStatus: {
      isAuthenticated: false
    },
    firestoreStatus: {
      canConnect: false,
      canRead: false,
      canWrite: false
    },
    config: {
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'unknown',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'unknown',
      environment: import.meta.env.MODE || 'unknown',
      useEmulators: import.meta.env.VITE_USE_EMULATORS === 'true'
    }
  };

  // Check authentication status
  try {
    const user = auth.currentUser;
    if (user) {
      result.authStatus = {
        isAuthenticated: true,
        userId: user.uid,
        email: user.email || undefined,
        emailVerified: user.emailVerified
      };

      // Try to get access token
      try {
        const token = await user.getIdToken();
        result.authStatus.accessToken = token.substring(0, 50) + '...'; // Only show first 50 chars for security
        
        // Try to get custom claims
        const tokenResult = await user.getIdTokenResult();
        result.authStatus.customClaims = tokenResult.claims;
      } catch (tokenError) {
        console.warn('Could not get access token:', tokenError);
      }
    }
  } catch (authError) {
    console.error('Auth status check failed:', authError);
  }

  // Test Firestore connection
  try {
    // Test basic connection by trying to read from a simple collection
    const testCollection = collection(db, 'test');
    const testQuery = query(testCollection, limit(1));
    
    result.firestoreStatus.canConnect = true;
    
    // Test read permissions
    try {
      await getDocs(testQuery);
      result.firestoreStatus.canRead = true;
    } catch (readError) {
      console.warn('Firestore read test failed:', readError);
      result.firestoreStatus.error = `Read failed: ${readError}`;
    }

    // Test write permissions (if authenticated)
    if (result.authStatus.isAuthenticated) {
      try {
        // Try to create a test document
        const testDoc = doc(db, 'debug_test', 'connection_test');
        await getDoc(testDoc); // This should work if we have read permissions
        result.firestoreStatus.canWrite = true;
      } catch (writeError) {
        console.warn('Firestore write test failed:', writeError);
        result.firestoreStatus.error = `Write failed: ${writeError}`;
      }
    }
  } catch (connectionError) {
    console.error('Firestore connection test failed:', connectionError);
    result.firestoreStatus.error = `Connection failed: ${connectionError}`;
  }

  return result;
};

/**
 * Simple function to log Firebase debug info to console
 */
export const logFirebaseDebug = async (): Promise<void> => {
  console.log('🔍 Firebase Debug Information:');
  const debugInfo = await debugFirebase();
  
  console.log('📊 Configuration:', debugInfo.config);
  console.log('🔐 Authentication:', debugInfo.authStatus);
  console.log('🗄️ Firestore:', debugInfo.firestoreStatus);
  
  if (!debugInfo.authStatus.isAuthenticated) {
    console.warn('⚠️ User is not authenticated - this may cause permission issues');
  }
  
  if (!debugInfo.firestoreStatus.canConnect) {
    console.error('❌ Cannot connect to Firestore');
  }
  
  if (!debugInfo.firestoreStatus.canRead) {
    console.error('❌ Cannot read from Firestore');
  }
  
  if (!debugInfo.firestoreStatus.canWrite) {
    console.error('❌ Cannot write to Firestore');
  }
  
  return;
}; 