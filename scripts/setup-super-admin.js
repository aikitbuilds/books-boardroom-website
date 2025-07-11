const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvQvQvQvQvQvQvQvQvQvQvQvQvQvQvQvQ",
  authDomain: "booksboardroom.firebaseapp.com",
  projectId: "booksboardroom",
  storageBucket: "booksboardroom.appspot.com",
  messagingSenderId: "593618213270",
  appId: "1:593618213270:web:your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function setupSuperAdmin(email, password) {
  try {
    console.log('Setting up super admin user...');
    
    // Sign in with the provided credentials
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('User authenticated:', user.uid);
    
    // Create super admin user document
    const userDoc = {
      uid: user.uid,
      email: user.email,
      role: 'superAdmin',
      permissions: [
        'user:create',
        'user:read',
        'user:update', 
        'user:delete',
        'account:create',
        'account:read',
        'account:update',
        'account:delete',
        'system:manage',
        'demo:manage'
      ],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      displayName: user.displayName || 'Super Admin',
      photoURL: user.photoURL || null,
      accountId: null, // Super admins don't belong to specific accounts
      isEmailVerified: user.emailVerified,
      lastLoginAt: new Date()
    };
    
    // Save to Firestore
    await setDoc(doc(db, 'users', user.uid), userDoc);
    
    console.log('✅ Super admin user created successfully!');
    console.log('User ID:', user.uid);
    console.log('Email:', user.email);
    console.log('Role: superAdmin');
    console.log('Permissions:', userDoc.permissions);
    
    return user.uid;
    
  } catch (error) {
    console.error('❌ Error setting up super admin:', error.message);
    throw error;
  }
}

// Usage example
if (require.main === module) {
  const email = process.argv[2];
  const password = process.argv[3];
  
  if (!email || !password) {
    console.log('Usage: node setup-super-admin.js <email> <password>');
    console.log('Example: node setup-super-admin.js admin@booksboardroom.com mypassword');
    process.exit(1);
  }
  
  setupSuperAdmin(email, password)
    .then(() => {
      console.log('🎉 Super admin setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to setup super admin:', error);
      process.exit(1);
    });
}

module.exports = { setupSuperAdmin }; 