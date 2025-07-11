import { auth, db } from '@/lib/firebase';
import { collection, doc, setDoc, addDoc, deleteDoc, getDocs, query, where, writeBatch } from 'firebase/firestore';

export interface DemoDataConfig {
  enableLeads: boolean;
  enableProjects: boolean;
  enableUsers: boolean;
  enableFinancials: boolean;
  enableDocuments: boolean;
  companyType: 'solar' | 'construction' | 'consulting' | 'other';
  teamSize: number;
}

export interface DemoDataResult {
  success: boolean;
  message: string;
  createdCount: number;
  errors: string[];
}

/**
 * Comprehensive demo data service for BooksBoardroom
 * Handles creation, management, and cleanup of demo data
 */
export class DemoDataService {
  private static instance: DemoDataService;
  
  private constructor() {}
  
  static getInstance(): DemoDataService {
    if (!DemoDataService.instance) {
      DemoDataService.instance = new DemoDataService();
    }
    return DemoDataService.instance;
  }

  /**
   * Create comprehensive demo data for a new user
   */
  async createDemoData(config: DemoDataConfig): Promise<DemoDataResult> {
    const result: DemoDataResult = {
      success: false,
      message: '',
      createdCount: 0,
      errors: []
    };

    try {
      if (!auth.currentUser) {
        result.errors.push('No authenticated user found');
        return result;
      }

      const userId = auth.currentUser.uid;
      const batch = writeBatch(db);
      let createdCount = 0;

      // Create demo leads
      if (config.enableLeads) {
        const leads = this.generateDemoLeads(config.companyType, userId);
        for (const lead of leads) {
          const leadRef = doc(collection(db, 'leads'));
          batch.set(leadRef, { ...lead, id: leadRef.id });
          createdCount++;
        }
      }

      // Create demo projects
      if (config.enableProjects) {
        const projects = this.generateDemoProjects(config.companyType, userId);
        for (const project of projects) {
          const projectRef = doc(collection(db, 'projects'));
          batch.set(projectRef, { ...project, id: projectRef.id });
          createdCount++;
        }
      }

      // Create demo team members
      if (config.enableUsers) {
        const users = this.generateDemoUsers(config.teamSize, userId);
        for (const user of users) {
          const userRef = doc(collection(db, 'users'));
          batch.set(userRef, { ...user, id: userRef.id });
          createdCount++;
        }
      }

      // Create demo financial data
      if (config.enableFinancials) {
        const financials = this.generateDemoFinancials(userId);
        for (const financial of financials) {
          const financialRef = doc(collection(db, 'financials'));
          batch.set(financialRef, { ...financial, id: financialRef.id });
          createdCount++;
        }
      }

      // Create demo documents
      if (config.enableDocuments) {
        const documents = this.generateDemoDocuments(userId);
        for (const document of documents) {
          const documentRef = doc(collection(db, 'documents'));
          batch.set(documentRef, { ...document, id: documentRef.id });
          createdCount++;
        }
      }

      // Commit all changes
      await batch.commit();

      result.success = true;
      result.message = `Successfully created ${createdCount} demo records`;
      result.createdCount = createdCount;

    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error occurred');
    }

    return result;
  }

  /**
   * Clear all demo data for a user
   */
  async clearDemoData(): Promise<DemoDataResult> {
    const result: DemoDataResult = {
      success: false,
      message: '',
      createdCount: 0,
      errors: []
    };

    try {
      if (!auth.currentUser) {
        result.errors.push('No authenticated user found');
        return result;
      }

      const userId = auth.currentUser.uid;
      const collections = ['leads', 'projects', 'users', 'financials', 'documents'];
      let deletedCount = 0;

      for (const collectionName of collections) {
        const q = query(collection(db, collectionName), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        const batch = writeBatch(db);
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
          deletedCount++;
        });
        
        await batch.commit();
      }

      result.success = true;
      result.message = `Successfully cleared ${deletedCount} demo records`;
      result.createdCount = deletedCount;

    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error occurred');
    }

    return result;
  }

  /**
   * Check if user has demo data
   */
  async hasDemoData(): Promise<boolean> {
    try {
      if (!auth.currentUser) return false;

      const userId = auth.currentUser.uid;
      const q = query(collection(db, 'leads'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking demo data:', error);
      return false;
    }
  }

  /**
   * Generate demo leads based on company type
   */
  private generateDemoLeads(companyType: string, userId: string) {
    const baseLeads = [
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        address: '123 Main St, Austin, TX',
        source: 'Website',
        status: 'qualified',
        aiScore: 85,
        estimatedValue: 28000,
        lastContact: new Date().toISOString().split('T')[0],
        nextAction: 'Schedule site visit',
        assignedTo: auth.currentUser?.email || '',
        tags: ['High Value', 'Hot Lead'],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '(555) 987-6543',
        address: '456 Oak Ave, Houston, TX',
        source: 'Referral',
        status: 'contacted',
        aiScore: 72,
        estimatedValue: 22000,
        lastContact: new Date().toISOString().split('T')[0],
        nextAction: 'Send proposal',
        assignedTo: auth.currentUser?.email || '',
        tags: ['Referral'],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId
      },
      {
        name: 'Mike Chen',
        email: 'mike.chen@business.com',
        phone: '(555) 234-5678',
        address: '789 Business Blvd, Dallas, TX',
        source: 'Cold Call',
        status: 'new',
        aiScore: 65,
        estimatedValue: 35000,
        lastContact: new Date().toISOString().split('T')[0],
        nextAction: 'Initial contact',
        assignedTo: auth.currentUser?.email || '',
        tags: ['Enterprise'],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId
      }
    ];

    // Customize leads based on company type
    if (companyType === 'solar') {
      baseLeads.forEach(lead => {
        lead.tags = [...lead.tags, 'Solar Interest'];
        lead.nextAction = lead.nextAction.replace('site visit', 'solar assessment');
      });
    } else if (companyType === 'construction') {
      baseLeads.forEach(lead => {
        lead.tags = [...lead.tags, 'Construction Project'];
        lead.nextAction = lead.nextAction.replace('site visit', 'project consultation');
      });
    }

    return baseLeads;
  }

  /**
   * Generate demo projects based on company type
   */
  private generateDemoProjects(companyType: string, userId: string) {
    const baseProjects = [
      {
        name: 'Smith Residence Installation',
        customer: 'John Smith',
        status: 'installation',
        progress: 75,
        estimatedCost: 25000,
        actualCost: 18500,
        profit: 6500,
        startDate: new Date().toISOString().split('T')[0],
        completionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        projectManager: auth.currentUser?.email || '',
        installer: 'TBD',
        riskScore: 15,
        aiInsights: ['On track for completion', 'Weather delay possible this week'],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId
      },
      {
        name: 'Johnson Commercial Project',
        customer: 'Sarah Johnson',
        status: 'design',
        progress: 25,
        estimatedCost: 45000,
        actualCost: 12000,
        profit: 0,
        startDate: new Date().toISOString().split('T')[0],
        completionDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        projectManager: auth.currentUser?.email || '',
        installer: 'TBD',
        riskScore: 25,
        aiInsights: ['Design phase progressing well', 'Permit approval expected next week'],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId
      }
    ];

    // Customize projects based on company type
    if (companyType === 'solar') {
      baseProjects.forEach(project => {
        project.aiInsights = [...project.aiInsights, 'Solar panel efficiency optimized'];
      });
    } else if (companyType === 'construction') {
      baseProjects.forEach(project => {
        project.aiInsights = [...project.aiInsights, 'Construction timeline on schedule'];
      });
    }

    return baseProjects;
  }

  /**
   * Generate demo team members
   */
  private generateDemoUsers(teamSize: number, userId: string) {
    const baseUsers = [
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        role: 'PM',
        phone: '(555) 111-2222',
        isActive: true,
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        companyId: userId
      },
      {
        name: 'Mike Chen',
        email: 'mike.chen@company.com',
        role: 'Sales',
        phone: '(555) 333-4444',
        isActive: true,
        lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        companyId: userId
      },
      {
        name: 'Alex Rodriguez',
        email: 'alex.rodriguez@company.com',
        role: 'Installer',
        phone: '(555) 555-6666',
        isActive: true,
        lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        companyId: userId
      }
    ];

    return baseUsers.slice(0, Math.min(teamSize, baseUsers.length));
  }

  /**
   * Generate demo financial data
   */
  private generateDemoFinancials(userId: string) {
    return [
      {
        type: 'invoice',
        customer: 'John Smith',
        amount: 25000,
        status: 'paid',
        dueDate: new Date().toISOString().split('T')[0],
        paidDate: new Date().toISOString().split('T')[0],
        description: 'Solar installation - Smith Residence',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId
      },
      {
        type: 'expense',
        category: 'Materials',
        amount: 12000,
        status: 'paid',
        date: new Date().toISOString().split('T')[0],
        description: 'Solar panels and equipment',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId
      },
      {
        type: 'invoice',
        customer: 'Sarah Johnson',
        amount: 45000,
        status: 'pending',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'Commercial solar project',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId
      }
    ];
  }

  /**
   * Generate demo documents
   */
  private generateDemoDocuments(userId: string) {
    return [
      {
        name: 'Smith Residence Proposal.pdf',
        type: 'proposal',
        size: 2048576, // 2MB
        uploadedBy: auth.currentUser?.email || '',
        uploadedAt: new Date().toISOString(),
        status: 'approved',
        tags: ['Proposal', 'Residential'],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId
      },
      {
        name: 'Johnson Commercial Contract.pdf',
        type: 'contract',
        size: 3145728, // 3MB
        uploadedBy: auth.currentUser?.email || '',
        uploadedAt: new Date().toISOString(),
        status: 'pending',
        tags: ['Contract', 'Commercial'],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId
      },
      {
        name: 'Q1 Financial Report.csv',
        type: 'report',
        size: 1048576, // 1MB
        uploadedBy: auth.currentUser?.email || '',
        uploadedAt: new Date().toISOString(),
        status: 'processed',
        tags: ['Report', 'Financial'],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId
      }
    ];
  }
}

// Export singleton instance
export const demoDataService = DemoDataService.getInstance(); 