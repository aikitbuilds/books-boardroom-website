import { collection, addDoc, doc, setDoc, getDoc, serverTimestamp, Timestamp, FieldValue } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

export interface TestRecord {
  id?: string;
  userId: string;
  name: string;
  email: string;
  type: 'test_lead' | 'test_project' | 'test_contact';
  status: string;
  createdAt: FieldValue | Timestamp | null;
  updatedAt: FieldValue | Timestamp | null;
}

export interface TestResult {
  success: boolean;
  data?: {
    testId?: string;
    recordId?: string;
    collection?: string;
    data?: Record<string, unknown>;
    userId?: string;
    profile?: Record<string, unknown>;
  };
  error?: string;
}

export interface TestSummary {
  success: boolean;
  results: Array<{
    test: string;
    success: boolean;
    data?: Record<string, unknown>;
    error?: string;
  }>;
  errors: string[];
}

/**
 * Diagnostic function to check authentication and Firebase connection
 */
export const diagnoseFirebaseConnection = async (): Promise<{
  auth: boolean;
  user: Record<string, unknown> | null;
  token: string | null;
  error?: string;
}> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return {
        auth: false,
        user: null,
        token: null,
        error: 'No authenticated user'
      };
    }

    // Get the ID token
    const token = await user.getIdToken(true); // Force refresh
    
    console.log('🔍 Firebase Diagnostic:', {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      tokenLength: token.length,
      tokenPreview: token.substring(0, 20) + '...'
    });

    return {
      auth: true,
      user: {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName
      },
      token: token.substring(0, 20) + '...' // Don't log full token
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Firebase diagnostic failed:', error);
    return {
      auth: false,
      user: null,
      token: null,
      error: errorMessage
    };
  }
};

/**
 * Test creating a simple document first
 */
export const testSimpleCreate = async (): Promise<TestResult> => {
  try {
    // First run diagnostics
    const diagnostic = await diagnoseFirebaseConnection();
    if (!diagnostic.auth) {
      return { success: false, error: `Authentication failed: ${diagnostic.error}` };
    }

    console.log('🧪 Testing simple Firestore create...');
    
    const testData = {
      message: 'Hello Firestore!',
      timestamp: serverTimestamp(),
      userId: auth.currentUser?.uid,
      testId: Math.random().toString(36).substring(7)
    };

    // Try to create a simple document
    const testRef = collection(db, 'test_simple');
    const docRef = await addDoc(testRef, testData);
    
    console.log('✅ Simple create successful:', docRef.id);
    
    // Try to read it back
    const readDoc = await getDoc(docRef);
    if (readDoc.exists()) {
      console.log('✅ Simple read successful:', readDoc.data());
      return {
        success: true,
        data: {
          testId: docRef.id,
          data: readDoc.data()
        }
      };
    } else {
      return { success: false, error: 'Document created but could not be read back' };
    }

  } catch (error: unknown) {
    console.error('❌ Simple test failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Check for specific error types
    if (errorMessage.includes('permission-denied')) {
      return {
        success: false,
        error: 'Permission denied - check Firestore rules'
      };
    } else if (errorMessage.includes('unauthenticated')) {
      return {
        success: false,
        error: 'User not authenticated properly'
      };
    } else if (errorMessage.includes('unavailable')) {
      return {
        success: false,
        error: 'Firestore service unavailable'
      };
    }
    
    return {
      success: false,
      error: `Firestore error: ${errorMessage}`
    };
  }
};

/**
 * Test creating a new record in Firestore
 */
export const testCreateRecord = async (type: 'lead' | 'project' | 'contact' = 'lead'): Promise<TestResult> => {
  try {
    if (!auth.currentUser) {
      return { success: false, error: 'User not authenticated' };
    }

    const userId = auth.currentUser.uid;
    const userEmail = auth.currentUser.email || 'test@example.com';
    
    // Create test data
    const testData: Omit<TestRecord, 'id'> = {
      userId,
      name: `Test ${type} - ${new Date().toLocaleTimeString()}`,
      email: userEmail,
      type: `test_${type}` as TestRecord['type'],
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    console.log('🧪 Testing Firestore create operation...', { type, userId, data: testData });

    // Try creating in the test collection first
    const testCollectionRef = collection(db, 'test');
    const testDocRef = await addDoc(testCollectionRef, {
      ...testData,
      collection: 'test',
      message: 'Firestore create test successful!'
    });

    console.log('✅ Test collection create successful:', testDocRef.id);

    // Now try creating in the specific collection
    let collectionName = '';
    switch (type) {
      case 'lead':
        collectionName = 'solar_leads';
        break;
      case 'project':
        collectionName = 'solar_projects';
        break;
      case 'contact':
        collectionName = 'ghl_contacts';
        break;
    }

    const specificCollectionRef = collection(db, collectionName);
    const specificDocRef = await addDoc(specificCollectionRef, testData);

    console.log(`✅ ${collectionName} create successful:`, specificDocRef.id);

    // Verify we can read it back
    const readDoc = await getDoc(specificDocRef);
    if (readDoc.exists()) {
      console.log('✅ Read verification successful:', readDoc.data());
      
      return {
        success: true,
        data: {
          testId: testDocRef.id,
          recordId: specificDocRef.id,
          collection: collectionName,
          data: readDoc.data()
        }
      };
    } else {
      return { success: false, error: 'Created document but could not read it back' };
    }

  } catch (error: unknown) {
    console.error('❌ Firestore test failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Test creating a user profile
 */
export const testCreateUserProfile = async (): Promise<TestResult> => {
  try {
    if (!auth.currentUser) {
      return { success: false, error: 'User not authenticated' };
    }

    const userId = auth.currentUser.uid;
    const userEmail = auth.currentUser.email || 'test@example.com';
    const displayName = auth.currentUser.displayName || 'Test User';

    const profileData = {
      userId,
      email: userEmail,
      displayName,
      firstName: displayName.split(' ')[0] || 'Test',
      lastName: displayName.split(' ')[1] || 'User',
      role: 'user',
      company: 'Test Company',
      phone: '+1-555-0123',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    console.log('🧪 Testing user profile create...', { userId, profileData });

    // Create user profile using setDoc (since we want to use the userId as the document ID)
    const userProfileRef = doc(db, 'userProfiles', userId);
    await setDoc(userProfileRef, profileData);

    console.log('✅ User profile create successful');

    // Verify we can read it back
    const readProfile = await getDoc(userProfileRef);
    if (readProfile.exists()) {
      console.log('✅ User profile read verification successful:', readProfile.data());
      
      return {
        success: true,
        data: {
          userId,
          profile: readProfile.data()
        }
      };
    } else {
      return { success: false, error: 'Created profile but could not read it back' };
    }

  } catch (error: unknown) {
    console.error('❌ User profile test failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Run all tests
 */
export const runAllFirestoreTests = async (): Promise<TestSummary> => {
  console.log('🚀 Starting comprehensive Firestore tests...');
  
  const results: Array<{
    test: string;
    success: boolean;
    data?: Record<string, unknown>;
    error?: string;
  }> = [];
  const errors: string[] = [];

  // Test 0: Diagnostics
  console.log('\n🔍 Test 0: Firebase Connection Diagnostics');
  const diagnostic = await diagnoseFirebaseConnection();
  if (!diagnostic.auth) {
    errors.push(`Authentication: ${diagnostic.error}`);
    return {
      success: false,
      results: [{ test: 'Authentication', success: false, error: diagnostic.error }],
      errors
    };
  }
  console.log('✅ Authentication successful');

  // Test 0.5: Simple Create Test
  console.log('\n🧪 Test 0.5: Simple Create Test');
  const simpleTest = await testSimpleCreate();
  results.push({ test: 'Simple Create', ...simpleTest });
  if (!simpleTest.success) {
    errors.push(`Simple Create: ${simpleTest.error}`);
    // If simple test fails, don't continue with complex tests
    return {
      success: false,
      results,
      errors
    };
  }

  // Test 1: User Profile
  console.log('\n📝 Test 1: User Profile Creation');
  const profileTest = await testCreateUserProfile();
  results.push({ test: 'User Profile', ...profileTest });
  if (!profileTest.success) errors.push(`User Profile: ${profileTest.error}`);

  // Test 2: Lead Creation
  console.log('\n👥 Test 2: Lead Creation');
  const leadTest = await testCreateRecord('lead');
  results.push({ test: 'Lead Creation', ...leadTest });
  if (!leadTest.success) errors.push(`Lead Creation: ${leadTest.error}`);

  // Test 3: Project Creation
  console.log('\n⚡ Test 3: Project Creation');
  const projectTest = await testCreateRecord('project');
  results.push({ test: 'Project Creation', ...projectTest });
  if (!projectTest.success) errors.push(`Project Creation: ${projectTest.error}`);

  // Test 4: Contact Creation
  console.log('\n📞 Test 4: Contact Creation');
  const contactTest = await testCreateRecord('contact');
  results.push({ test: 'Contact Creation', ...contactTest });
  if (!contactTest.success) errors.push(`Contact Creation: ${contactTest.error}`);

  const allSuccessful = errors.length === 0;
  
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Successful tests: ${results.filter(r => r.success).length}`);
  console.log(`❌ Failed tests: ${errors.length}`);
  
  if (allSuccessful) {
    console.log('🎉 All Firestore tests passed! Create operations are working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the errors above.');
    errors.forEach(error => console.log(`   - ${error}`));
  }

  return {
    success: allSuccessful,
    results,
    errors
  };
}; 