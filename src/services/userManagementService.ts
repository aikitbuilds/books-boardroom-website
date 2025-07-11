import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  writeBatch,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  deleteUser as firebaseDeleteUser,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { 
  UserProfile, 
  Account, 
  CreateUserData, 
  UpdateUserData, 
  CreateAccountData, 
  UpdateAccountData,
  UserRole,
  Permission,
  ROLE_PERMISSIONS
} from '@/types/userManagement';
import { toast } from 'sonner';

export class UserManagementService {
  private static instance: UserManagementService;
  
  private constructor() {}
  
  static getInstance(): UserManagementService {
    if (!UserManagementService.instance) {
      UserManagementService.instance = new UserManagementService();
    }
    return UserManagementService.instance;
  }

  // User Management Methods
  async createUser(data: CreateUserData): Promise<boolean> {
    try {
      // Generate a temporary password
      const tempPassword = this.generateTempPassword();
      
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, tempPassword);
      const user = userCredential.user;
      
      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: `${data.firstName} ${data.lastName}`,
        phoneNumber: data.phoneNumber,
        role: data.role,
        permissions: data.permissions || ROLE_PERMISSIONS[data.role],
        accountId: data.accountId,
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
      
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: userProfile.displayName
      });
      
      // Save to Firestore
      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      // If accountId is provided, add user to account
      if (data.accountId) {
        await this.addUserToAccount(user.uid, data.accountId);
      }
      
      // Send invitation email if requested
      if (data.sendInvitation) {
        await this.sendUserInvitation(data.email, tempPassword);
      }
      
      toast.success('User created successfully', {
        description: data.sendInvitation ? 'Invitation email sent' : 'User account created'
      });
      
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  async updateUser(uid: string, data: UpdateUserData): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      
      const updateData: any = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      // Update display name if name changed
      if (data.firstName || data.lastName) {
        const currentData = userDoc.data() as UserProfile;
        const newFirstName = data.firstName || currentData.firstName;
        const newLastName = data.lastName || currentData.lastName;
        updateData.displayName = `${newFirstName} ${newLastName}`;
      }
      
      await updateDoc(userRef, updateData);
      
      toast.success('User updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  async deleteUser(uid: string): Promise<boolean> {
    try {
      // Delete from Firestore first
      await deleteDoc(doc(db, 'users', uid));
      
      // Note: Firebase Auth user deletion requires admin SDK
      // This would typically be done via Cloud Functions
      toast.success('User deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  async suspendUser(uid: string): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'users', uid), {
        isActive: false,
        updatedAt: new Date().toISOString()
      });
      
      toast.success('User suspended successfully');
      return true;
    } catch (error) {
      console.error('Error suspending user:', error);
      toast.error('Failed to suspend user', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  async activateUser(uid: string): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'users', uid), {
        isActive: true,
        updatedAt: new Date().toISOString()
      });
      
      toast.success('User activated successfully');
      return true;
    } catch (error) {
      console.error('Error activating user:', error);
      toast.error('Failed to activate user', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  async resetUserPassword(uid: string): Promise<boolean> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      
      const userData = userDoc.data() as UserProfile;
      await sendPasswordResetEmail(auth, userData.email);
      
      toast.success('Password reset email sent');
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to send password reset', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  // Account Management Methods
  async createAccount(data: CreateAccountData): Promise<boolean> {
    try {
      const batch = writeBatch(db);
      
      // Create account document
      const accountId = `account_${Date.now()}`;
      const account: Account = {
        id: accountId,
        name: data.name,
        domain: data.domain,
        type: data.type,
        status: 'pending',
        plan: data.plan,
        adminId: '', // Will be set after admin user creation
        users: [],
        settings: {
          features: {
            demoData: true,
            advancedAnalytics: data.plan === 'premium' || data.plan === 'enterprise',
            customBranding: data.plan === 'enterprise',
            apiAccess: data.plan === 'enterprise'
          },
          limits: {
            maxUsers: this.getPlanUserLimit(data.plan),
            maxProjects: this.getPlanProjectLimit(data.plan),
            maxStorage: this.getPlanStorageLimit(data.plan)
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days trial
      };
      
      batch.set(doc(db, 'accounts', accountId), account);
      
      // Create admin user
      const adminUserData: CreateUserData = {
        email: data.adminEmail,
        firstName: data.adminFirstName,
        lastName: data.adminLastName,
        role: 'admin',
        permissions: ROLE_PERMISSIONS['admin'],
        accountId: accountId,
        sendInvitation: true
      };
      
      const adminCreated = await this.createUser(adminUserData);
      if (!adminCreated) {
        throw new Error('Failed to create admin user');
      }
      
      // Get the created admin user
      const adminUserQuery = query(
        collection(db, 'users'),
        where('email', '==', data.adminEmail)
      );
      const adminUserDocs = await getDocs(adminUserQuery);
      const adminUserDoc = adminUserDocs.docs[0];
      
      if (!adminUserDoc) {
        throw new Error('Admin user not found after creation');
      }
      
      // Update account with admin ID
      batch.update(doc(db, 'accounts', accountId), {
        adminId: adminUserDoc.id,
        users: [adminUserDoc.id],
        status: 'active'
      });
      
      // Update admin user with account ID
      batch.update(doc(db, 'users', adminUserDoc.id), {
        accountId: accountId
      });
      
      await batch.commit();
      
      toast.success('Account created successfully', {
        description: 'Admin user invitation sent'
      });
      
      return true;
    } catch (error) {
      console.error('Error creating account:', error);
      toast.error('Failed to create account', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  async updateAccount(accountId: string, data: UpdateAccountData): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'accounts', accountId), {
        ...data,
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Account updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('Failed to update account', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  async deleteAccount(accountId: string): Promise<boolean> {
    try {
      const batch = writeBatch(db);
      
      // Get all users in the account
      const usersQuery = query(
        collection(db, 'users'),
        where('accountId', '==', accountId)
      );
      const userDocs = await getDocs(usersQuery);
      
      // Delete all users in the account
      userDocs.docs.forEach(userDoc => {
        batch.delete(userDoc.ref);
      });
      
      // Delete the account
      batch.delete(doc(db, 'accounts', accountId));
      
      await batch.commit();
      
      toast.success('Account deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  async suspendAccount(accountId: string): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'accounts', accountId), {
        status: 'suspended',
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Account suspended successfully');
      return true;
    } catch (error) {
      console.error('Error suspending account:', error);
      toast.error('Failed to suspend account', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  async activateAccount(accountId: string): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'accounts', accountId), {
        status: 'active',
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Account activated successfully');
      return true;
    } catch (error) {
      console.error('Error activating account:', error);
      toast.error('Failed to activate account', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  // Data Loading Methods
  async loadUsers(filters?: any): Promise<UserProfile[]> {
    try {
      let usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      
      if (filters?.role) {
        usersQuery = query(usersQuery, where('role', '==', filters.role));
      }
      
      if (filters?.status) {
        usersQuery = query(usersQuery, where('isActive', '==', filters.status === 'active'));
      }
      
      if (filters?.accountId) {
        usersQuery = query(usersQuery, where('accountId', '==', filters.accountId));
      }
      
      const querySnapshot = await getDocs(usersQuery);
      const users: UserProfile[] = [];
      
      querySnapshot.forEach(doc => {
        users.push({ uid: doc.id, ...doc.data() } as UserProfile);
      });
      
      // Apply search filter if provided
      if (filters?.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        return users.filter(user => 
          user.firstName.toLowerCase().includes(searchTerm) ||
          user.lastName.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        );
      }
      
      return users;
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      return [];
    }
  }

  async loadAccounts(): Promise<Account[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'accounts'));
      const accounts: Account[] = [];
      
      querySnapshot.forEach(doc => {
        accounts.push({ id: doc.id, ...doc.data() } as Account);
      });
      
      return accounts;
    } catch (error) {
      console.error('Error loading accounts:', error);
      toast.error('Failed to load accounts', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      return [];
    }
  }

  // Helper Methods
  private generateTempPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  private async sendUserInvitation(email: string, password: string): Promise<void> {
    // This would typically integrate with an email service
    // For now, we'll just log the invitation
    console.log(`Invitation sent to ${email} with temporary password: ${password}`);
  }

  private async addUserToAccount(userId: string, accountId: string): Promise<void> {
    const accountRef = doc(db, 'accounts', accountId);
    const accountDoc = await getDoc(accountRef);
    
    if (accountDoc.exists()) {
      const accountData = accountDoc.data() as Account;
      const updatedUsers = [...accountData.users, userId];
      
      await updateDoc(accountRef, {
        users: updatedUsers,
        updatedAt: new Date().toISOString()
      });
    }
  }

  private getPlanUserLimit(plan: Account['plan']): number {
    const limits = {
      free: 1,
      basic: 5,
      premium: 25,
      enterprise: 100
    };
    return limits[plan];
  }

  private getPlanProjectLimit(plan: Account['plan']): number {
    const limits = {
      free: 3,
      basic: 10,
      premium: 50,
      enterprise: 200
    };
    return limits[plan];
  }

  private getPlanStorageLimit(plan: Account['plan']): number {
    const limits = {
      free: 100, // 100 MB
      basic: 1024, // 1 GB
      premium: 10240, // 10 GB
      enterprise: 102400 // 100 GB
    };
    return limits[plan];
  }
}

export const userManagementService = UserManagementService.getInstance(); 