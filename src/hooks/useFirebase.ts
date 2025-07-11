import { useState, useEffect, useCallback } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  role: string;
  permissions: string[];
  accountId?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  preferences?: {
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    timezone: string;
    language: string;
  };
  metadata?: {
    department?: string;
    position?: string;
    managerId?: string;
    hireDate?: string;
    notes?: string;
  };
}

interface GHLContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: {
    line1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  tags: string[];
  customFields: Record<string, any>;
  dateAdded: string;
  lastActivity: string;
  source: string;
  status: string;
  assignedTo?: string;
  leadScore?: number;
  estimatedValue?: number;
  ghlId: string; // Original GHL ID
  syncedAt: string;
  userId: string; // User who owns this contact
}

interface GHLOpportunity {
  id: string;
  name: string;
  contactId: string;
  pipelineId: string;
  stageId: string;
  status: string;
  monetaryValue: number;
  assignedTo: string;
  dateCreated: string;
  lastUpdated: string;
  ghlId: string; // Original GHL ID
  syncedAt: string;
  userId: string; // User who owns this opportunity
}

interface SolarProject {
  id: string;
  name: string;
  customerId: string;
  status: 'design' | 'permitting' | 'installation' | 'complete' | 'cancelled';
  progress: number;
  estimatedCost: number;
  actualCost: number;
  profit: number;
  startDate: string;
  completionDate: string;
  projectManager: string;
  installer?: string;
  riskScore: number;
  aiInsights: string[];
  systemSize: number; // kW
  panelCount: number;
  inverterType: string;
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  permits: {
    electrical: boolean;
    structural: boolean;
    utility: boolean;
  };
  createdAt: string;
  updatedAt: string;
  userId: string; // User who owns this project
}

interface FirebaseState {
  user: User | null;
  userProfile: UserProfile | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useFirebase() {
  const [state, setState] = useState<FirebaseState>({
    user: null,
    userProfile: null,
    isInitialized: false,
    isLoading: true,
    error: null
  });

  // Initialize Firebase and set up auth listener
  const initialize = useCallback(() => {
    console.log('🔥 Firebase: Initializing auth listener');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        console.log('🔥 Firebase: Auth state changed', { 
          userExists: !!user, 
          email: user?.email,
          uid: user?.uid 
        });
        
        if (user) {
          // User is signed in, fetch their profile
          console.log('🔥 Firebase: Fetching user profile for', user.uid);
          const userProfile = await getUserProfile(user.uid);
          console.log('🔥 Firebase: User profile loaded', { hasProfile: !!userProfile });
          
          setState(prev => ({
            ...prev,
            user,
            userProfile,
            isInitialized: true,
            isLoading: false,
            error: null
          }));
        } else {
          // User is signed out
          console.log('🔥 Firebase: User signed out');
          setState(prev => ({
            ...prev,
            user: null,
            userProfile: null,
            isInitialized: true,
            isLoading: false,
            error: null
          }));
        }
      } catch (error) {
        console.error('🔥 Firebase: Auth state change error:', error);
        setState(prev => ({
          ...prev,
          isInitialized: true,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Authentication error'
        }));
      }
    });

    return unsubscribe;
  }, []);

  // Initialize with production Firebase config
  const initializeProduction = useCallback(() => {
    return initialize();
  }, [initialize]);

  useEffect(() => {
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);

  // Get user profile from Firestore
  const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login
      if (userCredential.user) {
        await updateDoc(doc(db, 'users', userCredential.user.uid), {
          lastLogin: new Date().toISOString()
        });
      }
      
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sign in failed'
      }));
      return false;
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData: Partial<UserProfile>): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile in Firebase Auth
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });
      
      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        firstName: userData.firstName!,
        lastName: userData.lastName!,
        displayName: `${userData.firstName} ${userData.lastName}`,
        role: userData.role || 'user',
        permissions: ['content.view', 'financial.view', 'analytics.view', 'reports.view'],
        isActive: true,
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          timezone: 'UTC',
          language: 'en'
        }
      };
      
      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      // Send email verification
      await sendEmailVerification(user);
      
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sign up failed'
      }));
      return false;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      // Add custom parameters for better UX
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      console.log('Attempting Google sign-in with auth domain:', auth.config.authDomain);
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log('Google sign-in successful:', user.email);
      
      // Check if user profile exists, create if not
      const existingProfile = await getUserProfile(user.uid);
      
      if (!existingProfile) {
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          firstName: user.displayName?.split(' ')[0] || 'User',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || undefined,
          role: 'user',
          permissions: ['content.view', 'financial.view', 'analytics.view', 'reports.view'],
          accountId: '',
          isActive: true,
          isEmailVerified: user.emailVerified,
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          preferences: {
            theme: 'light',
            notifications: {
              email: true,
              push: true,
              sms: false
            },
            timezone: 'UTC',
            language: 'en'
          }
        };
        
        await setDoc(doc(db, 'users', user.uid), userProfile);
        console.log('Created new user profile for:', user.email);
      } else {
        // Update last login
        await updateDoc(doc(db, 'users', user.uid), {
          lastLogin: new Date().toISOString()
        });
        console.log('Updated last login for existing user:', user.email);
      }
      
      return true;
    } catch (error: any) {
      console.error('Google sign in error:', error);
      
      let errorMessage = 'Google sign in failed';
      
      // Handle specific error codes
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in was cancelled. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for Google sign-in. Please contact support.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Google sign-in is not enabled. Please contact support.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      return false;
    }
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // GHL Data Management Functions

  // Save GHL contacts to Firestore
  const saveGHLContacts = async (contacts: Omit<GHLContact, 'id' | 'syncedAt' | 'userId'>[]): Promise<boolean> => {
    if (!state.user) return false;
    
    try {
      const batch = contacts.map(contact => ({
        ...contact,
        syncedAt: new Date().toISOString(),
        userId: state.user!.uid
      }));
      
      for (const contact of batch) {
        await addDoc(collection(db, 'ghl_contacts'), contact);
      }
      
      return true;
    } catch (error) {
      console.error('Error saving GHL contacts:', error);
      return false;
    }
  };

  // Get GHL contacts for current user
  const getGHLContacts = async (): Promise<GHLContact[]> => {
    if (!state.user) return [];
    
    try {
      const q = query(
        collection(db, 'ghl_contacts'),
        where('userId', '==', state.user.uid),
        orderBy('dateAdded', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GHLContact[];
    } catch (error) {
      console.error('Error fetching GHL contacts:', error);
      return [];
    }
  };

  // Save GHL opportunities to Firestore
  const saveGHLOpportunities = async (opportunities: Omit<GHLOpportunity, 'id' | 'syncedAt' | 'userId'>[]): Promise<boolean> => {
    if (!state.user) return false;
    
    try {
      const batch = opportunities.map(opportunity => ({
        ...opportunity,
        syncedAt: new Date().toISOString(),
        userId: state.user!.uid
      }));
      
      for (const opportunity of batch) {
        await addDoc(collection(db, 'ghl_opportunities'), opportunity);
      }
      
      return true;
    } catch (error) {
      console.error('Error saving GHL opportunities:', error);
      return false;
    }
  };

  // Get GHL opportunities for current user
  const getGHLOpportunities = async (): Promise<GHLOpportunity[]> => {
    if (!state.user) return [];
    
    try {
      const q = query(
        collection(db, 'ghl_opportunities'),
        where('userId', '==', state.user.uid),
        orderBy('dateCreated', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GHLOpportunity[];
    } catch (error) {
      console.error('Error fetching GHL opportunities:', error);
      return [];
    }
  };

  // Solar Project Management Functions

  // Create a new solar project
  const createSolarProject = async (projectData: Omit<SolarProject, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<string | null> => {
    if (!state.user) return null;
    
    try {
      const project: Omit<SolarProject, 'id'> = {
        ...projectData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: state.user.uid
      };
      
      const docRef = await addDoc(collection(db, 'solar_projects'), project);
      return docRef.id;
    } catch (error) {
      console.error('Error creating solar project:', error);
      return null;
    }
  };

  // Get solar projects for current user
  const getSolarProjects = async (): Promise<SolarProject[]> => {
    if (!state.user) return [];
    
    try {
      const q = query(
        collection(db, 'solar_projects'),
        where('userId', '==', state.user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SolarProject[];
    } catch (error) {
      console.error('Error fetching solar projects:', error);
      return [];
    }
  };

  // Update solar project
  const updateSolarProject = async (projectId: string, updates: Partial<SolarProject>): Promise<boolean> => {
    if (!state.user) return false;
    
    try {
      await updateDoc(doc(db, 'solar_projects', projectId), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error updating solar project:', error);
      return false;
    }
  };

  // Real-time listeners

  // Listen to GHL contacts changes
  const subscribeToGHLContacts = (callback: (contacts: GHLContact[]) => void) => {
    if (!state.user) return () => {};
    
    const q = query(
      collection(db, 'ghl_contacts'),
      where('userId', '==', state.user.uid),
      orderBy('dateAdded', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const contacts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GHLContact[];
      callback(contacts);
    });
  };

  // Listen to solar projects changes
  const subscribeToSolarProjects = (callback: (projects: SolarProject[]) => void) => {
    if (!state.user) return () => {};
    
    const q = query(
      collection(db, 'solar_projects'),
      where('userId', '==', state.user.uid),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const projects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SolarProject[];
      callback(projects);
    });
  };

  return {
    state,
    initialize,
    initializeProduction,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    getUserProfile,
    // GHL Data Functions
    saveGHLContacts,
    getGHLContacts,
    saveGHLOpportunities,
    getGHLOpportunities,
    // Solar Project Functions
    createSolarProject,
    getSolarProjects,
    updateSolarProject,
    // Real-time subscriptions
    subscribeToGHLContacts,
    subscribeToSolarProjects
  };
} 