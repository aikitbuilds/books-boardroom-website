import { auth, db } from '@/lib/firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';

/**
 * CSV Upload utility for importing leads and projects
 */

export interface CSVLead {
  name: string;
  email: string;
  phone: string;
  address?: string;
  source?: string;
  status?: string;
  estimatedValue?: number;
  assignedTo?: string;
  tags?: string;
  notes?: string;
}

export interface CSVProject {
  name: string;
  customer: string;
  status?: string;
  progress?: number;
  estimatedCost?: number;
  actualCost?: number;
  startDate?: string;
  completionDate?: string;
  projectManager?: string;
  installer?: string;
  notes?: string;
}

/**
 * Parse CSV content into array of objects
 */
export const parseCSV = (csvContent: string): Record<string, string>[] => {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    data.push(row);
  }

  return data;
};

/**
 * Upload leads from CSV data
 */
export const uploadLeadsFromCSV = async (csvData: CSVLead[]): Promise<{
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
    results.push(`✅ Uploading ${csvData.length} leads for user: ${auth.currentUser.email}`);

    for (const leadData of csvData) {
      try {
        const lead = {
          name: leadData.name || 'Unknown',
          email: leadData.email || '',
          phone: leadData.phone || '',
          address: leadData.address || '',
          source: leadData.source || 'CSV Import',
          status: leadData.status || 'new',
          aiScore: Math.floor(Math.random() * 40) + 60, // Random score 60-100
          estimatedValue: leadData.estimatedValue || 25000,
          lastContact: new Date().toISOString().split('T')[0],
          nextAction: 'Follow up call',
          assignedTo: leadData.assignedTo || auth.currentUser.email,
          tags: leadData.tags ? leadData.tags.split(';') : ['CSV Import'],
          notes: leadData.notes || '',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: userId
        };

        const leadRef = await addDoc(collection(db, 'leads'), lead);
        results.push(`✅ Created lead: ${lead.name} (ID: ${leadRef.id})`);
      } catch (error) {
        errors.push(`❌ Failed to create lead ${leadData.name}: ${error}`);
      }
    }

    return { success: errors.length === 0, results, errors };
  } catch (error) {
    console.error('❌ Error uploading leads:', error);
    errors.push(`❌ Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false, results, errors };
  }
};

/**
 * Upload projects from CSV data
 */
export const uploadProjectsFromCSV = async (csvData: CSVProject[]): Promise<{
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
    results.push(`✅ Uploading ${csvData.length} projects for user: ${auth.currentUser.email}`);

    for (const projectData of csvData) {
      try {
        const project = {
          name: projectData.name || 'Unknown Project',
          customer: projectData.customer || 'Unknown Customer',
          status: projectData.status || 'planning',
          progress: projectData.progress || 0,
          estimatedCost: projectData.estimatedCost || 25000,
          actualCost: projectData.actualCost || 0,
          profit: (projectData.estimatedCost || 25000) - (projectData.actualCost || 0),
          startDate: projectData.startDate || new Date().toISOString().split('T')[0],
          completionDate: projectData.completionDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          projectManager: projectData.projectManager || auth.currentUser.email,
          installer: projectData.installer || 'TBD',
          riskScore: Math.floor(Math.random() * 30) + 10, // Random risk 10-40
          aiInsights: ['Imported from CSV', 'Review project details'],
          notes: projectData.notes || '',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: userId
        };

        const projectRef = await addDoc(collection(db, 'projects'), project);
        results.push(`✅ Created project: ${project.name} (ID: ${projectRef.id})`);
      } catch (error) {
        errors.push(`❌ Failed to create project ${projectData.name}: ${error}`);
      }
    }

    return { success: errors.length === 0, results, errors };
  } catch (error) {
    console.error('❌ Error uploading projects:', error);
    errors.push(`❌ Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false, results, errors };
  }
};

/**
 * Handle file upload and processing
 */
export const handleCSVUpload = async (file: File, type: 'leads' | 'projects'): Promise<{
  success: boolean;
  results: string[];
  errors: string[];
}> => {
  const results: string[] = [];
  const errors: string[] = [];

  try {
    // Read file content
    const content = await file.text();
    const csvData = parseCSV(content);

    if (csvData.length === 0) {
      errors.push('❌ No data found in CSV file');
      return { success: false, results, errors };
    }

    results.push(`✅ Parsed ${csvData.length} rows from CSV`);

    // Upload based on type
    if (type === 'leads') {
      return await uploadLeadsFromCSV(csvData as unknown as CSVLead[]);
    } else {
      return await uploadProjectsFromCSV(csvData as unknown as CSVProject[]);
    }
  } catch (error) {
    console.error('❌ Error processing CSV:', error);
    errors.push(`❌ File processing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false, results, errors };
  }
};

/**
 * Generate sample CSV templates
 */
export const generateLeadsCSVTemplate = (): string => {
  return `name,email,phone,address,source,status,estimatedValue,assignedTo,tags,notes
John Smith,john@email.com,(555) 123-4567,"123 Main St, Austin TX",Website,qualified,28000,sales@company.com,Hot Lead;High Value,Interested in solar installation
Sarah Johnson,sarah@email.com,(555) 987-6543,"456 Oak Ave, Houston TX",Referral,contacted,22000,sales@company.com,Referral,Follow up needed`;
};

export const generateProjectsCSVTemplate = (): string => {
  return `name,customer,status,progress,estimatedCost,actualCost,startDate,completionDate,projectManager,installer,notes
Smith Residence Solar,John Smith,installation,75,25000,18500,2024-01-15,2024-03-01,pm@company.com,installer@company.com,On track for completion
Johnson Commercial Install,Sarah Johnson,permitting,25,85000,35000,2024-02-01,2024-05-15,pm@company.com,TBD,Waiting for permits`;
}; 