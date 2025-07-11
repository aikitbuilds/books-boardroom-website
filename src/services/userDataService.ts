import { auth, db } from '@/lib/firebase';
import { collection, doc, setDoc, addDoc, deleteDoc, getDocs, query, where, writeBatch, updateDoc } from 'firebase/firestore';
import { storage } from '@/lib/firebase';
import { ref, listAll, deleteObject } from 'firebase/storage';

export interface UserDataResult {
  success: boolean;
  message: string;
  count: number;
  errors: string[];
}

/**
 * Service for managing user data and clearing demo data
 */
export class UserDataService {
  private static instance: UserDataService;
  
  private constructor() {}
  
  static getInstance(): UserDataService {
    if (!UserDataService.instance) {
      UserDataService.instance = new UserDataService();
    }
    return UserDataService.instance;
  }

  /**
   * Clear all demo data for the current user
   */
  async clearDemoData(): Promise<UserDataResult> {
    const result: UserDataResult = {
      success: false,
      message: '',
      count: 0,
      errors: []
    };

    try {
      if (!auth.currentUser) {
        result.errors.push('No authenticated user found');
        return result;
      }

      const userId = auth.currentUser.uid;
      const collections = ['leads', 'projects', 'users', 'financials', 'documents', 'files'];
      let deletedCount = 0;

      for (const collectionName of collections) {
        try {
          const q = query(collection(db, collectionName), where('userId', '==', userId));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const batch = writeBatch(db);
            querySnapshot.forEach((doc) => {
              batch.delete(doc.ref);
              deletedCount++;
            });
            
            await batch.commit();
          }
        } catch (error) {
          console.error(`Error clearing ${collectionName}:`, error);
          result.errors.push(`Failed to clear ${collectionName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Clear storage files
      try {
        await this.clearUserStorageFiles(userId);
      } catch (error) {
        console.error('Error clearing storage files:', error);
        result.errors.push(`Failed to clear storage files: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      result.success = true;
      result.message = `Successfully cleared ${deletedCount} demo records and associated files`;
      result.count = deletedCount;

    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error occurred');
    }

    return result;
  }

  /**
   * Clear user's storage files
   */
  private async clearUserStorageFiles(userId: string): Promise<void> {
    const storagePaths = [
      `uploads/${userId}`,
      `users/${userId}`,
      `financial/${userId}`,
      `bank_statements/${userId}`,
      `tax_documents/${userId}`,
      `documents/${userId}`,
      `projects/${userId}`,
      `temp/${userId}`
    ];

    for (const path of storagePaths) {
      try {
        const storageRef = ref(storage, path);
        const result = await listAll(storageRef);
        
        const deletePromises = result.items.map(itemRef => deleteObject(itemRef));
        await Promise.all(deletePromises);
      } catch (error) {
        console.error(`Error clearing storage path ${path}:`, error);
        // Continue with other paths even if one fails
      }
    }
  }

  /**
   * Check if user has any data
   */
  async hasUserData(): Promise<boolean> {
    try {
      if (!auth.currentUser) return false;

      const userId = auth.currentUser.uid;
      const collections = ['leads', 'projects', 'users', 'financials', 'documents', 'files'];

      for (const collectionName of collections) {
        const q = query(collection(db, collectionName), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking user data:', error);
      return false;
    }
  }

  /**
   * Get user data statistics
   */
  async getUserDataStats(): Promise<{
    leads: number;
    projects: number;
    users: number;
    financials: number;
    documents: number;
    files: number;
  }> {
    const stats = {
      leads: 0,
      projects: 0,
      users: 0,
      financials: 0,
      documents: 0,
      files: 0
    };

    try {
      if (!auth.currentUser) return stats;

      const userId = auth.currentUser.uid;
      const collections = ['leads', 'projects', 'users', 'financials', 'documents', 'files'];

      for (const collectionName of collections) {
        try {
          const q = query(collection(db, collectionName), where('userId', '==', userId));
          const querySnapshot = await getDocs(q);
          stats[collectionName as keyof typeof stats] = querySnapshot.size;
        } catch (error) {
          console.error(`Error getting stats for ${collectionName}:`, error);
        }
      }
    } catch (error) {
      console.error('Error getting user data stats:', error);
    }

    return stats;
  }

  /**
   * Create user profile if it doesn't exist
   */
  async createUserProfile(profileData: any): Promise<UserDataResult> {
    const result: UserDataResult = {
      success: false,
      message: '',
      count: 0,
      errors: []
    };

    try {
      if (!auth.currentUser) {
        result.errors.push('No authenticated user found');
        return result;
      }

      const userId = auth.currentUser.uid;
      const userRef = doc(db, 'users', userId);
      
      await setDoc(userRef, {
        ...profileData,
        id: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });

      result.success = true;
      result.message = 'User profile created successfully';
      result.count = 1;

    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error occurred');
    }

    return result;
  }

  /**
   * Update user profile
   */
  async updateUserProfile(profileData: any): Promise<UserDataResult> {
    const result: UserDataResult = {
      success: false,
      message: '',
      count: 0,
      errors: []
    };

    try {
      if (!auth.currentUser) {
        result.errors.push('No authenticated user found');
        return result;
      }

      const userId = auth.currentUser.uid;
      const userRef = doc(db, 'users', userId);
      
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: new Date().toISOString()
      });

      result.success = true;
      result.message = 'User profile updated successfully';
      result.count = 1;

    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error occurred');
    }

    return result;
  }
}

// Export singleton instance
export const userDataService = UserDataService.getInstance(); 