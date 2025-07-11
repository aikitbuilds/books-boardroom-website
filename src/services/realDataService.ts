import { ghlFirebaseService } from '@/lib/ghl-firebase-service';
import { mcpClient } from '@/lib/mcp-client';
import { 
  collection, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface RealLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  aiScore: number;
  estimatedValue: number;
  lastContact: string;
  nextAction: string;
  assignedTo: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface RealProject {
  id: string;
  name: string;
  customer: string;
  customerEmail?: string;
  customerPhone?: string;
  status: 'planning' | 'permitting' | 'installation' | 'inspection' | 'completed' | 'cancelled';
  progress: number;
  estimatedCost: number;
  actualCost: number;
  profit: number;
  startDate: string;
  completionDate: string;
  projectManager: string;
  installer: string;
  riskScore: number;
  aiInsights: string[];
  address?: string;
  systemSize?: number;
  panelCount?: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface RealMetrics {
  totalLeads: number;
  qualifiedLeads: number;
  activeProjects: number;
  monthlyRevenue: number;
  conversionRate: number;
  averageProjectValue: number;
  totalRevenue: number;
  completedProjects: number;
  pendingProjects: number;
  lastUpdated: string;
}

export interface RealUser {
  id: string;
  name: string;
  email: string;
  role: 'SuperAdmin' | 'PM' | 'Sales' | 'Installer' | 'Customer';
  avatar?: string;
  phone?: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  companyId: string;
}

class RealDataService {
  private userId: string | null = null;
  private listeners: (() => void)[] = [];

  setUserId(userId: string) {
    this.userId = userId;
    // Initialize GHL service with user ID
    ghlFirebaseService.setUserId(userId);
  }

  // Fetch real leads from GHL and Firebase
  async getLeads(limit: number = 50): Promise<RealLead[]> {
    if (!this.userId) return [];

    try {
      // First try to get leads from GHL via Firebase
      const ghlContacts = await ghlFirebaseService.getContacts({ limit });
      
      // Convert GHL contacts to our lead format
      const ghlLeads: RealLead[] = ghlContacts.map(contact => ({
        id: contact.id,
        name: `${contact.firstName} ${contact.lastName}`.trim(),
        email: contact.email,
        phone: contact.phone,
        address: contact.address ? 
          `${contact.address.line1 || ''}, ${contact.address.city || ''}, ${contact.address.state || ''}`.trim() : 
          'Address not provided',
        source: contact.source || 'Unknown',
        status: this.mapGHLStatusToLeadStatus(contact.status),
        aiScore: contact.leadScore || 0,
        estimatedValue: contact.estimatedValue || 0,
        lastContact: contact.lastActivity,
        nextAction: this.generateNextAction(contact.status),
        assignedTo: contact.assignedTo || 'Unassigned',
        tags: contact.tags,
        createdAt: contact.dateAdded,
        updatedAt: contact.syncedAt,
        userId: this.userId!
      }));

      // Also get leads from our custom Firebase collection
      const leadsQuery = query(
        collection(db, 'leads'),
        where('userId', '==', this.userId),
        orderBy('createdAt', 'desc'),
        firestoreLimit(limit)
      );

      const leadsSnapshot = await getDocs(leadsQuery);
      const firebaseLeads: RealLead[] = leadsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as RealLead));

      // Merge and deduplicate leads
      const allLeads = [...ghlLeads, ...firebaseLeads];
      const uniqueLeads = allLeads.filter((lead, index, self) => 
        index === self.findIndex(l => l.email === lead.email)
      );

      return uniqueLeads.slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch real leads:', error);
      return [];
    }
  }

  // Fetch real projects from Firebase
  async getProjects(limit: number = 50): Promise<RealProject[]> {
    if (!this.userId) return [];

    try {
      const projectsQuery = query(
        collection(db, 'projects'),
        where('userId', '==', this.userId),
        orderBy('createdAt', 'desc'),
        firestoreLimit(limit)
      );

      const projectsSnapshot = await getDocs(projectsQuery);
      const projects: RealProject[] = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as RealProject));

      return projects;
    } catch (error) {
      console.error('Failed to fetch real projects:', error);
      return [];
    }
  }

  // Calculate real metrics from actual data
  async getMetrics(): Promise<RealMetrics> {
    if (!this.userId) {
      return {
        totalLeads: 0,
        qualifiedLeads: 0,
        activeProjects: 0,
        monthlyRevenue: 0,
        conversionRate: 0,
        averageProjectValue: 0,
        totalRevenue: 0,
        completedProjects: 0,
        pendingProjects: 0,
        lastUpdated: new Date().toISOString()
      };
    }

    try {
      const [leads, projects] = await Promise.all([
        this.getLeads(1000), // Get all leads for metrics
        this.getProjects(1000) // Get all projects for metrics
      ]);

      const qualifiedLeads = leads.filter(lead => 
        ['qualified', 'proposal', 'negotiation'].includes(lead.status)
      ).length;

      const activeProjects = projects.filter(project => 
        ['planning', 'permitting', 'installation', 'inspection'].includes(project.status)
      ).length;

      const completedProjects = projects.filter(project => 
        project.status === 'completed'
      ).length;

      const totalRevenue = projects
        .filter(project => project.status === 'completed')
        .reduce((sum, project) => sum + (project.actualCost || project.estimatedCost), 0);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlyRevenue = projects
        .filter(project => {
          const completionDate = new Date(project.completionDate);
          return completionDate.getMonth() === currentMonth && 
                 completionDate.getFullYear() === currentYear &&
                 project.status === 'completed';
        })
        .reduce((sum, project) => sum + (project.actualCost || project.estimatedCost), 0);

      const averageProjectValue = completedProjects > 0 ? totalRevenue / completedProjects : 0;
      
      const closedWonLeads = leads.filter(lead => lead.status === 'closed-won').length;
      const conversionRate = leads.length > 0 ? (closedWonLeads / leads.length) * 100 : 0;

      return {
        totalLeads: leads.length,
        qualifiedLeads,
        activeProjects,
        monthlyRevenue,
        conversionRate,
        averageProjectValue,
        totalRevenue,
        completedProjects,
        pendingProjects: activeProjects,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to calculate real metrics:', error);
      return {
        totalLeads: 0,
        qualifiedLeads: 0,
        activeProjects: 0,
        monthlyRevenue: 0,
        conversionRate: 0,
        averageProjectValue: 0,
        totalRevenue: 0,
        completedProjects: 0,
        pendingProjects: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  // Get real users from Firebase
  async getUsers(): Promise<RealUser[]> {
    if (!this.userId) return [];

    try {
      const usersQuery = query(
        collection(db, 'users'),
        where('companyId', '==', this.userId), // Assuming users belong to a company
        orderBy('createdAt', 'desc')
      );

      const usersSnapshot = await getDocs(usersQuery);
      const users: RealUser[] = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as RealUser));

      return users;
    } catch (error) {
      console.error('Failed to fetch real users:', error);
      return [];
    }
  }

  // Subscribe to real-time data updates
  subscribeToLeads(callback: (leads: RealLead[]) => void): () => void {
    if (!this.userId) return () => {};

    const leadsQuery = query(
      collection(db, 'leads'),
      where('userId', '==', this.userId),
      orderBy('updatedAt', 'desc'),
      firestoreLimit(50)
    );

    const unsubscribe = onSnapshot(leadsQuery, (snapshot) => {
      const leads: RealLead[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as RealLead));
      callback(leads);
    });

    this.listeners.push(unsubscribe);
    return unsubscribe;
  }

  subscribeToProjects(callback: (projects: RealProject[]) => void): () => void {
    if (!this.userId) return () => {};

    const projectsQuery = query(
      collection(db, 'projects'),
      where('userId', '==', this.userId),
      orderBy('updatedAt', 'desc'),
      firestoreLimit(50)
    );

    const unsubscribe = onSnapshot(projectsQuery, (snapshot) => {
      const projects: RealProject[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as RealProject));
      callback(projects);
    });

    this.listeners.push(unsubscribe);
    return unsubscribe;
  }

  // Sync data from GHL
  async syncFromGHL(): Promise<{ success: boolean; message: string }> {
    try {
      const result = await ghlFirebaseService.syncAllData({
        syncContacts: true,
        syncOpportunities: true,
        batchSize: 100
      });

      return {
        success: result.success,
        message: result.success 
          ? `Synced ${result.contactsSynced} contacts and ${result.opportunitiesSynced} opportunities`
          : `Sync failed: ${result.errors?.join(', ')}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Helper methods
  private mapGHLStatusToLeadStatus(ghlStatus: string): RealLead['status'] {
    const statusMap: Record<string, RealLead['status']> = {
      'new': 'new',
      'contacted': 'contacted',
      'qualified': 'qualified',
      'proposal': 'proposal',
      'negotiation': 'negotiation',
      'closed': 'closed-won',
      'lost': 'closed-lost'
    };

    return statusMap[ghlStatus.toLowerCase()] || 'new';
  }

  private generateNextAction(status: string): string {
    const actionMap: Record<string, string> = {
      'new': 'Initial contact call',
      'contacted': 'Follow up and qualify',
      'qualified': 'Schedule site visit',
      'proposal': 'Send detailed proposal',
      'negotiation': 'Finalize contract terms',
      'closed': 'Project handoff',
      'lost': 'Archive and analyze'
    };

    return actionMap[status.toLowerCase()] || 'Review and update';
  }

  // Cleanup method
  cleanup() {
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners = [];
  }
}

export const realDataService = new RealDataService(); 