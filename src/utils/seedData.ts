import { 
  collection, 
  doc, 
  setDoc, 
  writeBatch,
  serverTimestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { RealLead, RealProject, RealUser } from '@/services/realDataService';

// Sample data for seeding
const sampleLeads: Omit<RealLead, 'id' | 'createdAt' | 'updatedAt' | 'userId'>[] = [
  {
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Austin, TX 78701',
    source: 'Website',
    status: 'qualified',
    aiScore: 85,
    estimatedValue: 25000,
    lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    nextAction: 'Schedule site visit',
    assignedTo: 'Sarah Johnson',
    tags: ['residential', 'high-priority', 'roof-replacement']
  },
  {
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '(555) 234-5678',
    address: '456 Oak Ave, Dallas, TX 75201',
    source: 'Referral',
    status: 'proposal',
    aiScore: 92,
    estimatedValue: 32000,
    lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    nextAction: 'Send detailed proposal',
    assignedTo: 'Mike Chen',
    tags: ['residential', 'premium', 'energy-storage']
  },
  {
    name: 'Robert Wilson',
    email: 'robert.wilson@business.com',
    phone: '(555) 345-6789',
    address: '789 Business Blvd, Houston, TX 77001',
    source: 'Google Ads',
    status: 'negotiation',
    aiScore: 78,
    estimatedValue: 85000,
    lastContact: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    nextAction: 'Finalize contract terms',
    assignedTo: 'Sarah Johnson',
    tags: ['commercial', 'large-system', 'tax-incentives']
  },
  {
    name: 'Lisa Thompson',
    email: 'lisa.thompson@email.com',
    phone: '(555) 456-7890',
    address: '321 Pine St, San Antonio, TX 78201',
    source: 'Facebook',
    status: 'new',
    aiScore: 65,
    estimatedValue: 18000,
    lastContact: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    nextAction: 'Initial contact call',
    assignedTo: 'Mike Chen',
    tags: ['residential', 'budget-conscious']
  },
  {
    name: 'David Brown',
    email: 'david.brown@email.com',
    phone: '(555) 567-8901',
    address: '654 Elm Dr, Fort Worth, TX 76101',
    source: 'Door-to-door',
    status: 'contacted',
    aiScore: 71,
    estimatedValue: 22000,
    lastContact: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    nextAction: 'Follow up and qualify',
    assignedTo: 'Sarah Johnson',
    tags: ['residential', 'follow-up-needed']
  }
];

const sampleProjects: Omit<RealProject, 'id' | 'createdAt' | 'updatedAt' | 'userId'>[] = [
  {
    name: 'Smith Residence Solar Installation',
    customer: 'John Smith',
    customerEmail: 'john.smith@email.com',
    customerPhone: '(555) 123-4567',
    status: 'installation',
    progress: 75,
    estimatedCost: 25000,
    actualCost: 24500,
    profit: 7500,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    completionDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    projectManager: 'Sarah Johnson',
    installer: 'Texas Solar Crew A',
    riskScore: 15,
    aiInsights: [
      'Project on track for early completion',
      'Weather conditions favorable',
      'Customer satisfaction high'
    ],
    address: '123 Main St, Austin, TX 78701',
    systemSize: 8.5,
    panelCount: 24
  },
  {
    name: 'Garcia Residence Solar + Storage',
    customer: 'Maria Garcia',
    customerEmail: 'maria.garcia@email.com',
    customerPhone: '(555) 234-5678',
    status: 'permitting',
    progress: 25,
    estimatedCost: 32000,
    actualCost: 0,
    profit: 9600,
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    completionDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    projectManager: 'Mike Chen',
    installer: 'Texas Solar Crew B',
    riskScore: 25,
    aiInsights: [
      'Permit approval expected within 2 weeks',
      'Battery storage requires special handling',
      'HOA approval obtained'
    ],
    address: '456 Oak Ave, Dallas, TX 75201',
    systemSize: 12.0,
    panelCount: 36
  },
  {
    name: 'Wilson Commercial Solar Array',
    customer: 'Robert Wilson',
    customerEmail: 'robert.wilson@business.com',
    customerPhone: '(555) 345-6789',
    status: 'planning',
    progress: 10,
    estimatedCost: 85000,
    actualCost: 0,
    profit: 25500,
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    completionDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    projectManager: 'Sarah Johnson',
    installer: 'Commercial Solar Solutions',
    riskScore: 35,
    aiInsights: [
      'Large commercial project requires specialized crew',
      'Structural assessment needed',
      'Tax incentive deadline approaching'
    ],
    address: '789 Business Blvd, Houston, TX 77001',
    systemSize: 50.0,
    panelCount: 150
  },
  {
    name: 'Thompson Residence Solar',
    customer: 'Lisa Thompson',
    customerEmail: 'lisa.thompson@email.com',
    customerPhone: '(555) 456-7890',
    status: 'completed',
    progress: 100,
    estimatedCost: 18000,
    actualCost: 17800,
    profit: 5340,
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    completionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    projectManager: 'Mike Chen',
    installer: 'Texas Solar Crew A',
    riskScore: 5,
    aiInsights: [
      'Project completed successfully',
      'Customer very satisfied',
      'Excellent referral potential'
    ],
    address: '321 Pine St, San Antonio, TX 78201',
    systemSize: 6.0,
    panelCount: 18
  }
];

const sampleUsers: Omit<RealUser, 'id' | 'createdAt' | 'companyId'>[] = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@sunpeach.com',
    role: 'PM',
    phone: '(555) 111-2222',
    isActive: true,
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    name: 'Mike Chen',
    email: 'mike.chen@sunpeach.com',
    role: 'Sales',
    phone: '(555) 333-4444',
    isActive: true,
    lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@sunpeach.com',
    role: 'Installer',
    phone: '(555) 555-6666',
    isActive: true,
    lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    name: 'Emma Davis',
    email: 'emma.davis@sunpeach.com',
    role: 'SuperAdmin',
    phone: '(555) 777-8888',
    isActive: true,
    lastLogin: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  }
];

export async function seedUserData(userId: string): Promise<{ success: boolean; message: string }> {
  try {
    const batch = writeBatch(db);
    let totalSeeded = 0;

    // Seed leads
    for (const leadData of sampleLeads) {
      const leadRef = doc(collection(db, 'leads'));
      const lead: RealLead = {
        ...leadData,
        id: leadRef.id,
        userId,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      };
      batch.set(leadRef, lead);
      totalSeeded++;
    }

    // Seed projects
    for (const projectData of sampleProjects) {
      const projectRef = doc(collection(db, 'projects'));
      const project: RealProject = {
        ...projectData,
        id: projectRef.id,
        userId,
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      };
      batch.set(projectRef, project);
      totalSeeded++;
    }

    // Seed users (company team members)
    for (const userData of sampleUsers) {
      const userRef = doc(collection(db, 'users'));
      const user: RealUser = {
        ...userData,
        id: userRef.id,
        companyId: userId, // Link to the current user's company
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
      };
      batch.set(userRef, user);
      totalSeeded++;
    }

    // Commit the batch
    await batch.commit();

    return {
      success: true,
      message: `Successfully seeded ${totalSeeded} records (${sampleLeads.length} leads, ${sampleProjects.length} projects, ${sampleUsers.length} users)`
    };

  } catch (error) {
    console.error('Error seeding data:', error);
    return {
      success: false,
      message: `Failed to seed data: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export async function clearUserData(userId: string): Promise<{ success: boolean; message: string }> {
  try {
    const batch = writeBatch(db);
    let totalDeleted = 0;

    // Get and delete leads
    const leadsQuery = query(collection(db, 'leads'), where('userId', '==', userId));
    const leadsSnapshot = await getDocs(leadsQuery);
    leadsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
      totalDeleted++;
    });

    // Get and delete projects
    const projectsQuery = query(collection(db, 'projects'), where('userId', '==', userId));
    const projectsSnapshot = await getDocs(projectsQuery);
    projectsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
      totalDeleted++;
    });

    // Get and delete users
    const usersQuery = query(collection(db, 'users'), where('companyId', '==', userId));
    const usersSnapshot = await getDocs(usersQuery);
    usersSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
      totalDeleted++;
    });

    await batch.commit();

    return {
      success: true,
      message: `Successfully deleted ${totalDeleted} records`
    };

  } catch (error) {
    console.error('Error clearing data:', error);
    return {
      success: false,
      message: `Failed to clear data: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
} 