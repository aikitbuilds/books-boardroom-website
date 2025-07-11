// Firebase Configuration and Setup
import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
  databaseURL: string;
}

// Data structure interfaces for Business Operations
export interface Project {
  id?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  projectName: string;
  description: string;
  value: number;
  actualCost?: number;
  status: 'lead' | 'proposal' | 'approved' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  manager: string;
  startDate?: Date;
  completionDate?: Date;
  category: string;
  milestones: {
    name: string;
    completed: boolean;
    dueDate: Date;
  }[];
  documents: string[]; // URLs to stored documents
  notes: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface Customer {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  type: 'individual' | 'business' | 'enterprise';
  leadSource: string;
  tags: string[];
  status: 'lead' | 'qualified' | 'proposal-sent' | 'customer' | 'inactive';
  assignedRep: string;
  lastContact: Date;
  nextFollowUp?: Date;
  projects: string[]; // Project IDs
  documents: string[]; // Document URLs
  notes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Lead {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  leadSource: 'website' | 'referral' | 'social-media' | 'cold-call' | 'event' | 'other';
  interest: string;
  budget?: number;
  timeframe?: 'immediate' | '1-3-months' | '3-6-months' | '6-12-months' | 'just-researching';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id?: string;
  projectId?: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  estimatedHours?: number;
  actualHours?: number;
  dependencies?: string[]; // Task IDs
  attachments: string[];
  notes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id?: string;
  projectId?: string;
  customerId: string;
  invoiceNumber: string;
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  paidDate?: Date;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemUser {
  id?: string;
  uid: string; // Firebase Auth UID
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'user' | 'viewer';
  department: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  profile: {
    phone?: string;
    avatar?: string;
    bio?: string;
    location?: string;
  };
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  createdAt: Date;
  updatedAt: Date;
}

class FirebaseService {
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private db: Firestore | null = null;
  private storage: any | null = null;
  private currentUser: User | null = null;
  private unsubscribes: (() => void)[] = [];

  // Production configuration for BooksBoardroom Portal
  private productionConfig: FirebaseConfig = {
    apiKey: "AIzaSyBdrQ7LKW7KBRZ-3XSQHs30NL__Pm6UgUY",
    authDomain: "booksboardroom.firebaseapp.com",
    projectId: "booksboardroom",
    storageBucket: "booksboardroom.appspot.com",
    messagingSenderId: "593618213270",
    appId: "1:593618213270:web:booksboardroom-portal",
    databaseURL: "https://booksboardroom-default-rtdb.firebaseio.com/"
  };

  // Demo configuration for testing
  private demoConfig: FirebaseConfig = {
    apiKey: "demo-api-key-financial-ops",
    authDomain: "financial-ops-demo.firebaseapp.com",
    projectId: "financial-ops-demo",
    storageBucket: "financial-ops-demo.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456",
    measurementId: "G-ABCDEF123",
    databaseURL: "https://financial-ops-demo-default-rtdb.firebaseio.com/"
  };

  // Initialize Firebase with configuration
  async initialize(config?: FirebaseConfig): Promise<boolean> {
    try {
      // Use production config by default
      const firebaseConfig = config || this.productionConfig;
      
      // Initialize Firebase app
      this.app = initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);
      
      // Connect to Firestore database
      this.db = getFirestore(this.app);
      this.storage = getStorage(this.app);

      // Set up auth state listener
      this.setupAuthListener();

      console.log('Firebase initialized successfully with project:', firebaseConfig.projectId);
      return true;
    } catch (error) {
      console.error('Firebase initialization error:', error);
      return false;
    }
  }

  // Initialize with production configuration
  async initializeProduction(): Promise<boolean> {
    return this.initialize(this.productionConfig);
  }

  // Initialize with demo configuration
  async initializeDemo(): Promise<boolean> {
    return this.initialize(this.demoConfig);
  }

  // Get current configuration info
  getCurrentConfig(): { projectId: string; environment: string } | null {
    if (!this.app) return null;
    
    const currentProjectId = this.app.options.projectId;
    const environment = currentProjectId === this.productionConfig.projectId ? 'production' : 'demo';
    
    return {
      projectId: currentProjectId || 'unknown',
      environment
    };
  }

  // Set up authentication state listener
  private setupAuthListener(): void {
    if (!this.auth) return;

    const unsubscribe = onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
      if (user) {
        console.log('User signed in:', user.email);
        this.updateUserLastLogin(user.uid);
      } else {
        console.log('User signed out');
      }
    });

    this.unsubscribes.push(unsubscribe);
  }

  // Authentication methods
  async signInWithEmail(email: string, password: string): Promise<User | null> {
    if (!this.auth) throw new Error('Firebase not initialized');

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signUpWithEmail(email: string, password: string, userData: Partial<SystemUser>): Promise<User | null> {
    if (!this.auth) throw new Error('Firebase not initialized');

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      await this.createUserDocument(user.uid, {
        uid: user.uid,
        email: user.email || email,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      } as SystemUser);

      return user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signInWithGoogle(): Promise<User | null> {
    if (!this.auth) throw new Error('Firebase not initialized');

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      const user = userCredential.user;

      // Check if user document exists, create if not
      const userDoc = await this.getUserDocument(user.uid);
      if (!userDoc) {
        await this.createUserDocument(user.uid, {
          uid: user.uid,
          email: user.email || '',
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          role: 'user', // Default role
          department: 'general',
          permissions: ['read:projects', 'read:customers'],
          isActive: true,
          profile: {
            avatar: user.photoURL || undefined
          },
          preferences: {
            notifications: true,
            emailUpdates: true,
            theme: 'light'
          },
          createdAt: new Date(),
          updatedAt: new Date()
        } as SystemUser);
      }

      return user;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    if (!this.auth) throw new Error('Firebase not initialized');

    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // User management
  async createUserDocument(uid: string, userData: SystemUser): Promise<void> {
    if (!this.db) throw new Error('Firestore not initialized');

    try {
      await updateDoc(doc(this.db, 'users', uid), {
        ...userData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      // If document doesn't exist, create it
      await addDoc(collection(this.db, 'users'), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  }

  async getUserDocument(uid: string): Promise<SystemUser | null> {
    if (!this.db) throw new Error('Firestore not initialized');

    try {
      const docRef = doc(this.db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as SystemUser;
      }
      return null;
    } catch (error) {
      console.error('Get user document error:', error);
      return null;
    }
  }

  async updateUserLastLogin(uid: string): Promise<void> {
    if (!this.db) return;

    try {
      const userRef = doc(this.db, 'users', uid);
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Update last login error:', error);
    }
  }

  // Project management
  async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.db) throw new Error('Firestore not initialized');

    try {
      const docRef = await addDoc(collection(this.db, 'projects'), {
        ...projectData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Create project error:', error);
      throw error;
    }
  }

  async getProjects(filters?: { status?: string; assignedTo?: string; limit?: number }): Promise<Project[]> {
    if (!this.db) throw new Error('Firestore not initialized');

    try {
      let q = query(collection(this.db, 'projects'), orderBy('createdAt', 'desc'));

      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters?.assignedTo) {
        q = query(q, where('assignedTo', '==', filters.assignedTo));
      }
      if (filters?.limit) {
        q = query(q, limit(filters.limit));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
    } catch (error) {
      console.error('Get projects error:', error);
      throw error;
    }
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
    if (!this.db) throw new Error('Firestore not initialized');

    try {
      const projectRef = doc(this.db, 'projects', projectId);
      await updateDoc(projectRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Update project error:', error);
      throw error;
    }
  }

  // Customer management
  async createCustomer(customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.db) throw new Error('Firestore not initialized');

    try {
      const docRef = await addDoc(collection(this.db, 'customers'), {
        ...customerData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Create customer error:', error);
      throw error;
    }
  }

  async getCustomers(filters?: { status?: string; assignedRep?: string }): Promise<Customer[]> {
    if (!this.db) throw new Error('Firestore not initialized');

    try {
      let q = query(collection(this.db, 'customers'), orderBy('createdAt', 'desc'));

      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters?.assignedRep) {
        q = query(q, where('assignedRep', '==', filters.assignedRep));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Customer[];
    } catch (error) {
      console.error('Get customers error:', error);
      throw error;
    }
  }

  // Lead management
  async createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.db) throw new Error('Firestore not initialized');

    try {
      const docRef = await addDoc(collection(this.db, 'leads'), {
        ...leadData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Create lead error:', error);
      throw error;
    }
  }

  async getLeads(filters?: { status?: string; assignedTo?: string }): Promise<Lead[]> {
    if (!this.db) throw new Error('Firestore not initialized');

    try {
      let q = query(collection(this.db, 'leads'), orderBy('createdAt', 'desc'));

      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters?.assignedTo) {
        q = query(q, where('assignedTo', '==', filters.assignedTo));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lead[];
    } catch (error) {
      console.error('Get leads error:', error);
      throw error;
    }
  }

  // Real-time subscriptions
  subscribeToProjects(callback: (projects: Project[]) => void, filters?: { status?: string }): () => void {
    if (!this.db) throw new Error('Firestore not initialized');

    let q = query(collection(this.db, 'projects'), orderBy('updatedAt', 'desc'));
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      callback(projects);
    });

    this.unsubscribes.push(unsubscribe);
    return unsubscribe;
  }

  subscribeToLeads(callback: (leads: Lead[]) => void, filters?: { status?: string }): () => void {
    if (!this.db) throw new Error('Firestore not initialized');

    let q = query(collection(this.db, 'leads'), orderBy('updatedAt', 'desc'));
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const leads = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lead[];
      callback(leads);
    });

    this.unsubscribes.push(unsubscribe);
    return unsubscribe;
  }

  // Utility methods
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isInitialized(): boolean {
    return this.app !== null && this.auth !== null && this.db !== null;
  }

  async disconnect(): Promise<void> {
    // Unsubscribe from all listeners
    this.unsubscribes.forEach(unsubscribe => unsubscribe());
    this.unsubscribes = [];

    // Sign out if signed in
    if (this.currentUser) {
      await this.signOut();
    }

    // Reset instances
    this.app = null;
    this.auth = null;
    this.db = null;
    this.storage = null;
    this.currentUser = null;
  }

  // Demo data seeding
  async seedDemoData(): Promise<void> {
    if (!this.db) throw new Error('Firestore not initialized');

    try {
      // Create demo leads
      const demoLeads: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          firstName: 'Alice',
          lastName: 'Johnson',
          email: 'alice.johnson@email.com',
          phone: '+1 (555) 123-4567',
          company: 'ABC Corporation',
          leadSource: 'website',
          interest: 'Financial consulting',
          budget: 5000,
          timeframe: '1-3-months',
          status: 'new',
          priority: 'high',
          notes: ['Interested in tax optimization', 'Needs financial reporting setup']
        },
        {
          firstName: 'Bob',
          lastName: 'Martinez',
          email: 'bob.martinez@business.com',
          phone: '+1 (555) 234-5678',
          company: 'XYZ Enterprises',
          leadSource: 'referral',
          interest: 'Business operations platform',
          budget: 15000,
          timeframe: 'immediate',
          status: 'qualified',
          assignedTo: 'manager_1',
          priority: 'urgent',
          notes: ['Enterprise client', 'Needs full implementation', 'Budget approved']
        }
      ];

      for (const lead of demoLeads) {
        await this.createLead(lead);
      }

      console.log('Demo data seeded successfully');
    } catch (error) {
      console.error('Error seeding demo data:', error);
    }
  }
}

// Initialize Firebase directly for development
const firebaseConfig = {
  apiKey: "AIzaSyBdrQ7LKW7KBRZ-3XSQHs30NL__Pm6UgUY",
  authDomain: "booksboardroom.firebaseapp.com",
  projectId: "booksboardroom",
  storageBucket: "booksboardroom.appspot.com",
  messagingSenderId: "593618213270",
  appId: "1:593618213270:web:booksboardroom-portal",
  databaseURL: "https://booksboardroom-default-rtdb.firebaseio.com/"
};

// Initialize Firebase safely (check if already initialized)
import { getApps } from 'firebase/app';

let app: FirebaseApp;
if (getApps().length === 0) {
  console.log('🔥 Firebase Config:', firebaseConfig);
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
} else {
  app = getApps()[0];
  console.log('✅ Firebase already initialized, using existing app');
}

// Export Firebase instances for direct use
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Singleton instance
export const firebaseService = new FirebaseService();

export default FirebaseService;