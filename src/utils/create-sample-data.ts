import { auth, db } from '@/lib/firebase';
import { collection, doc, setDoc, addDoc } from 'firebase/firestore';

/**
 * Create sample real data for the user's account
 * This will populate their Firestore with real data instead of showing demo data
 */
export const createSampleRealData = async (): Promise<{
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
    results.push(`✅ Creating sample data for user: ${auth.currentUser.email}`);

    // Create sample leads
    const sampleLeads = [
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
        assignedTo: auth.currentUser.email,
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
        assignedTo: auth.currentUser.email,
        tags: ['Referral'],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId
      }
    ];

    // Create leads
    for (const lead of sampleLeads) {
      const leadRef = await addDoc(collection(db, 'leads'), lead);
      results.push(`✅ Created lead: ${lead.name} (ID: ${leadRef.id})`);
    }

    // Create sample projects
    const sampleProjects = [
      {
        name: 'Smith Residence Solar Installation',
        customer: 'John Smith',
        status: 'installation',
        progress: 75,
        estimatedCost: 25000,
        actualCost: 18500,
        profit: 6500,
        startDate: new Date().toISOString().split('T')[0],
        completionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        projectManager: auth.currentUser.email,
        installer: 'TBD',
        riskScore: 15,
        aiInsights: ['On track for completion', 'Weather delay possible this week'],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId
      }
    ];

    // Create projects
    for (const project of sampleProjects) {
      const projectRef = await addDoc(collection(db, 'projects'), project);
      results.push(`✅ Created project: ${project.name} (ID: ${projectRef.id})`);
    }

    // Create user profile
    const userProfile = {
      firstName: auth.currentUser.displayName?.split(' ')[0] || 'User',
      lastName: auth.currentUser.displayName?.split(' ')[1] || '',
      email: auth.currentUser.email,
      role: 'Admin',
      company: 'Solar Operations',
      phone: '(555) 000-0000',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'users', userId), userProfile);
    results.push(`✅ Created user profile for: ${userProfile.firstName} ${userProfile.lastName}`);

    // Create sample contacts
    const sampleContacts = [
      {
        name: 'Mike Wilson',
        email: 'mike.w@email.com',
        phone: '(555) 111-2222',
        company: 'Wilson Enterprises',
        status: 'active',
        source: 'Cold Call',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId
      }
    ];

    // Create contacts
    for (const contact of sampleContacts) {
      const contactRef = await addDoc(collection(db, 'contacts'), contact);
      results.push(`✅ Created contact: ${contact.name} (ID: ${contactRef.id})`);
    }

    results.push(`🎉 Sample data creation completed! You now have real data in your account.`);
    return { success: true, results, errors };

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    errors.push(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false, results, errors };
  }
};

/**
 * Log the sample data creation process to console
 */
export const logCreateSampleData = async () => {
  console.log('🏗️ Creating sample real data...');
  const result = await createSampleRealData();
  
  console.log('\n📊 Sample Data Creation Results:');
  result.results.forEach(msg => console.log(msg));
  
  if (result.errors.length > 0) {
    console.log('\n❌ Errors:');
    result.errors.forEach(error => console.error(error));
  }
  
  console.log(`\n🎯 Overall Status: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  
  if (result.success) {
    alert('✅ Sample data created! Refresh the page to see your real data.');
  } else {
    alert('❌ Failed to create sample data. Check console for details.');
  }
  
  return result;
}; 