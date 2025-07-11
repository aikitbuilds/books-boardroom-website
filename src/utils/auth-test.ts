import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';

/**
 * Simple authentication test to diagnose login issues
 */
export const testAuthentication = async (): Promise<{
  success: boolean;
  results: string[];
  errors: string[];
}> => {
  const results: string[] = [];
  const errors: string[] = [];

  try {
    // Test 1: Check Firebase auth initialization
    if (auth) {
      results.push('✅ Firebase Auth initialized');
      results.push(`✅ Auth app name: ${auth.app.name}`);
      results.push(`✅ Auth app options: ${JSON.stringify(auth.app.options)}`);
    } else {
      errors.push('❌ Firebase Auth not initialized');
      return { success: false, results, errors };
    }

    // Test 2: Check current auth state
    const currentUser = auth.currentUser;
    if (currentUser) {
      results.push(`✅ User already signed in: ${currentUser.email}`);
      results.push(`✅ User ID: ${currentUser.uid}`);
      results.push(`✅ Email verified: ${currentUser.emailVerified}`);
    } else {
      results.push('ℹ️ No user currently signed in');
    }

    // Test 3: Check Google provider configuration
    if (googleProvider) {
      results.push('✅ Google Auth Provider configured');
      const scopes = googleProvider.getScopes();
      results.push(`✅ Google scopes: ${scopes.join(', ')}`);
    } else {
      errors.push('❌ Google Auth Provider not configured');
    }

    // Test 4: Test Google sign-in popup (without actually signing in)
    try {
      // Just test if the popup can be created (this will fail but we can catch the error type)
      await signInWithPopup(auth, googleProvider);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        results.push('✅ Google sign-in popup can be created (user cancelled)');
      } else if (err.code === 'auth/popup-blocked') {
        errors.push('❌ Popup blocked by browser - please allow popups for this site');
      } else if (err.code === 'auth/network-request-failed') {
        errors.push('❌ Network error - check internet connection');
      } else {
        results.push(`ℹ️ Google sign-in test result: ${err.code || 'unknown'}`);
      }
    }

    return {
      success: errors.length === 0,
      results,
      errors
    };

  } catch (error: unknown) {
    const err = error as { message?: string };
    errors.push(`❌ Test execution failed: ${err.message}`);
    return {
      success: false,
      results,
      errors
    };
  }
};

/**
 * Test email/password authentication
 */
export const testEmailAuth = async (email: string, password: string): Promise<{
  success: boolean;
  results: string[];
  errors: string[];
}> => {
  const results: string[] = [];
  const errors: string[] = [];

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    results.push(`✅ Email sign-in successful: ${userCredential.user.email}`);
    results.push(`✅ User ID: ${userCredential.user.uid}`);
    return { success: true, results, errors };
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    
    switch (err.code) {
      case 'auth/user-not-found':
        errors.push('❌ No account found with this email address');
        break;
      case 'auth/wrong-password':
        errors.push('❌ Incorrect password');
        break;
      case 'auth/invalid-email':
        errors.push('❌ Invalid email address format');
        break;
      case 'auth/user-disabled':
        errors.push('❌ This account has been disabled');
        break;
      case 'auth/too-many-requests':
        errors.push('❌ Too many failed attempts. Please try again later');
        break;
      case 'auth/network-request-failed':
        errors.push('❌ Network error - check internet connection');
        break;
      default:
        errors.push(`❌ Sign-in failed: ${err.message || 'Unknown error'}`);
    }
    
    return { success: false, results, errors };
  }
};

/**
 * Log authentication test results to console
 */
export const logAuthTest = async (): Promise<void> => {
  console.log('🔍 Running Authentication Test...');
  
  const testResults = await testAuthentication();
  
  console.log('\n📊 Authentication Test Results:');
  testResults.results.forEach(result => console.log(result));
  
  if (testResults.errors.length > 0) {
    console.log('\n❌ Errors:');
    testResults.errors.forEach(error => console.log(error));
  }
  
  console.log(`\n🎯 Overall Status: ${testResults.success ? '✅ PASS' : '❌ FAIL'}`);
  
  return;
}; 