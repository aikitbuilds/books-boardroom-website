import { auth, db } from '@/lib/firebase';
import { collection, doc, getDoc } from 'firebase/firestore';

/**
 * Simple Firebase connection test
 */
export const simpleFirebaseTest = async (): Promise<{
  success: boolean;
  results: string[];
  errors: string[];
}> => {
  const results: string[] = [];
  const errors: string[] = [];

  try {
    // Test 1: Check if Firebase is initialized
    results.push('✅ Firebase app initialized');
    
    // Test 2: Check authentication
    if (auth) {
      results.push('✅ Firebase Auth service available');
      
      const user = auth.currentUser;
      if (user) {
        results.push(`✅ User authenticated: ${user.email}`);
        results.push(`✅ User ID: ${user.uid}`);
        results.push(`✅ Email verified: ${user.emailVerified}`);
      } else {
        errors.push('❌ No user currently authenticated');
      }
    } else {
      errors.push('❌ Firebase Auth service not available');
    }

    // Test 3: Check Firestore
    if (db) {
      results.push('✅ Firestore service available');
      
      try {
        // Try to access a simple collection reference
        const testCollection = collection(db, 'test');
        results.push('✅ Can create collection reference');
        
        // Try to create a document reference
        const testDoc = doc(testCollection, 'connection-test');
        results.push('✅ Can create document reference');
        
        // Try to read (this will test permissions)
        try {
          await getDoc(testDoc);
          results.push('✅ Can read from Firestore (permissions OK)');
        } catch (readError: unknown) {
          const error = readError as { code?: string; message?: string };
          if (error.code === 'permission-denied') {
            errors.push('❌ Firestore read permission denied - check rules');
          } else if (error.code === 'unavailable') {
            errors.push('❌ Firestore service unavailable');
          } else {
            errors.push(`❌ Firestore read error: ${error.message || 'Unknown error'}`);
          }
        }
      } catch (firestoreError: unknown) {
        const error = firestoreError as { message?: string };
        errors.push(`❌ Firestore connection error: ${error.message || 'Unknown error'}`);
      }
    } else {
      errors.push('❌ Firestore service not available');
    }

    // Test 4: Environment variables
    const envVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_USE_EMULATORS'
    ];

    envVars.forEach(varName => {
      const value = import.meta.env[varName];
      if (value) {
        results.push(`✅ ${varName}: ${varName.includes('API_KEY') ? value.substring(0, 10) + '...' : value}`);
      } else {
        errors.push(`❌ Missing environment variable: ${varName}`);
      }
    });

    return {
      success: errors.length === 0,
      results,
      errors
    };

  } catch (error: unknown) {
    const err = error as { message?: string };
    errors.push(`❌ Test execution failed: ${err.message || 'Unknown error'}`);
    return {
      success: false,
      results,
      errors
    };
  }
};

/**
 * Log the simple test results to console
 */
export const logSimpleFirebaseTest = async (): Promise<void> => {
  console.log('🔍 Running Simple Firebase Test...');
  
  const testResults = await simpleFirebaseTest();
  
  console.log('\n📊 Test Results:');
  testResults.results.forEach(result => console.log(result));
  
  if (testResults.errors.length > 0) {
    console.log('\n❌ Errors:');
    testResults.errors.forEach(error => console.log(error));
  }
  
  console.log(`\n🎯 Overall Status: ${testResults.success ? '✅ PASS' : '❌ FAIL'}`);
  
  return;
}; 