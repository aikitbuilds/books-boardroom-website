/**
 * Simple test functions that will definitely work
 */

export const runSimpleTest = () => {
  console.log('🧪 SIMPLE TEST STARTED');
  console.log('✅ JavaScript is working');
  console.log('✅ Console logging is working');
  console.log('✅ Button click handler is working');
  
  // Test basic browser APIs
  try {
    console.log('✅ Window object:', typeof window);
    console.log('✅ Document object:', typeof document);
    console.log('✅ Current URL:', window.location.href);
  } catch (error) {
    console.error('❌ Browser API error:', error);
  }
  
  // Test if we can access Firebase
  try {
    // Try to import Firebase dynamically
    import('@/lib/firebase').then((firebase) => {
      console.log('✅ Firebase module loaded');
      console.log('✅ Auth object:', !!firebase.auth);
      console.log('✅ DB object:', !!firebase.db);
      console.log('✅ Google Provider:', !!firebase.googleProvider);
    }).catch((error) => {
      console.error('❌ Firebase import error:', error);
    });
  } catch (error) {
    console.error('❌ Firebase test error:', error);
  }
  
  console.log('🎯 SIMPLE TEST COMPLETED - Check console for results');
  
  // Also show an alert to make sure something visible happens
  alert('✅ Test completed! Check the browser console (F12) for detailed results.');
};

export const testButtonClick = () => {
  console.log('🔥 BUTTON CLICK TEST');
  console.log('✅ Button click event fired');
  console.log('✅ Event handler is working');
  alert('Button click is working! Check console for more details.');
};

export const testFirebaseConnection = async () => {
  console.log('🔥 FIREBASE CONNECTION TEST');
  
  try {
    const { auth, db, googleProvider } = await import('@/lib/firebase');
    
    console.log('✅ Firebase auth:', !!auth);
    console.log('✅ Firebase db:', !!db);
    console.log('✅ Google provider:', !!googleProvider);
    
    if (auth) {
      console.log('✅ Current user:', auth.currentUser?.email || 'Not signed in');
      console.log('✅ Auth ready state:', !!auth.app);
    }
    
    alert('Firebase connection test completed! Check console for details.');
    
  } catch (error) {
    console.error('❌ Firebase connection error:', error);
    alert('Firebase connection failed! Check console for error details.');
  }
}; 