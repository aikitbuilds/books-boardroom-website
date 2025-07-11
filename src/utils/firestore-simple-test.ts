import { auth, db } from '@/lib/firebase';
import { collection, doc, setDoc, getDoc, addDoc } from 'firebase/firestore';

/**
 * Simple Firestore test to verify connectivity and create collections
 */
export const simpleFirestoreTest = async (): Promise<{
  success: boolean;
  results: string[];
  errors: string[];
}> => {
  const results: string[] = [];
  const errors: string[] = [];

  try {
    if (!auth.currentUser) {
      errors.push('❌ No authenticated user');
      return { success: false, results, errors };
    }

    const userId = auth.currentUser.uid;
    results.push(`✅ Testing with user: ${auth.currentUser.email}`);

    // Test 1: Create a simple test document
    try {
      const testDoc = doc(db, 'test', 'connection-test');
      await setDoc(testDoc, {
        message: 'Hello from Firestore!',
        timestamp: new Date().toISOString(),
        userId: userId
      });
      results.push('✅ Can write to test collection');
    } catch (error: unknown) {
      const err = error as { message?: string };
      errors.push(`❌ Test write failed: ${err.message}`);
    }

    // Test 2: Read the test document
    try {
      const testDoc = doc(db, 'test', 'connection-test');
      const docSnap = await getDoc(testDoc);
      if (docSnap.exists()) {
        results.push('✅ Can read from test collection');
      } else {
        errors.push('❌ Test document not found');
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      errors.push(`❌ Test read failed: ${err.message}`);
    }

    // Test 3: Create user profile if it doesn't exist
    try {
      const userDoc = doc(db, 'users', userId);
      const userSnap = await getDoc(userDoc);
      
      if (!userSnap.exists()) {
        await setDoc(userDoc, {
          uid: userId,
          email: auth.currentUser.email,
          firstName: auth.currentUser.displayName?.split(' ')[0] || 'User',
          lastName: auth.currentUser.displayName?.split(' ')[1] || '',
          role: 'user',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          isActive: true
        });
        results.push('✅ Created user profile');
      } else {
        results.push('✅ User profile exists');
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      errors.push(`❌ User profile test failed: ${err.message}`);
    }

    // Test 4: Create a sample lead to initialize the collection
    try {
      const leadData = {
        name: 'Test Lead',
        email: 'test@example.com',
        phone: '555-0123',
        status: 'new',
        source: 'test',
        userId: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, 'leads'), leadData);
      results.push('✅ Created sample lead');
    } catch (error: unknown) {
      const err = error as { message?: string };
      errors.push(`❌ Lead creation failed: ${err.message}`);
    }

    // Test 5: Create a sample project to initialize the collection
    try {
      const projectData = {
        name: 'Test Project',
        status: 'design',
        progress: 0,
        estimatedCost: 25000,
        actualCost: 0,
        userId: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, 'projects'), projectData);
      results.push('✅ Created sample project');
    } catch (error: unknown) {
      const err = error as { message?: string };
      errors.push(`❌ Project creation failed: ${err.message}`);
    }

    // Test 6: Create a sample contact to initialize the collection
    try {
      const contactData = {
        firstName: 'Test',
        lastName: 'Contact',
        email: 'contact@example.com',
        phone: '555-0124',
        status: 'active',
        userId: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, 'contacts'), contactData);
      results.push('✅ Created sample contact');
    } catch (error: unknown) {
      const err = error as { message?: string };
      errors.push(`❌ Contact creation failed: ${err.message}`);
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
 * Log the simple test results to console
 */
export const logSimpleFirestoreTest = async (): Promise<void> => {
  console.log('🔍 Running Simple Firestore Test...');
  
  const testResults = await simpleFirestoreTest();
  
  console.log('\n📊 Test Results:');
  testResults.results.forEach(result => console.log(result));
  
  if (testResults.errors.length > 0) {
    console.log('\n❌ Errors:');
    testResults.errors.forEach(error => console.log(error));
  }
  
  console.log(`\n🎯 Overall Status: ${testResults.success ? '✅ PASS' : '❌ FAIL'}`);
  
  return;
}; 