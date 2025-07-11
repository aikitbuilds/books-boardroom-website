import { mcpClient } from './mcp-client';
import { useFirebase } from '@/hooks/useFirebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

interface GHLSyncOptions {
  syncContacts?: boolean;
  syncOpportunities?: boolean;
  syncPipelines?: boolean;
  batchSize?: number;
  realTimeSync?: boolean;
}

interface SyncResult {
  success: boolean;
  contactsSynced?: number;
  opportunitiesSynced?: number;
  errors?: string[];
  lastSyncTime: string;
}

// Updated interface to match actual GHL contact structure
interface GHLContactFromAPI {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tags: string[];
  customFields: Record<string, any>;
  dateAdded: string;
  lastActivity: string;
  // Note: address, source, status, assignedTo may not be directly available
  // We'll handle these in the mapping logic
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
  assignedTo: string;
  leadScore?: number;
  estimatedValue?: number;
  ghlId: string;
  syncedAt: string;
  userId: string;
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
  ghlId: string;
  syncedAt: string;
  userId: string;
}

interface GHLPipeline {
  id: string;
  name: string;
  stages: {
    id: string;
    name: string;
    position: number;
  }[];
  ghlId: string;
  syncedAt: string;
  userId: string;
}

export class GHLFirebaseService {
  private userId: string | null = null;
  private isConnected = false;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    // This will be called when the service is instantiated
    // The actual user ID will be set when the user authenticates
  }

  // Set the current user ID for data operations
  setUserId(userId: string) {
    this.userId = userId;
  }

  // Connect to GHL using MCP client
  async connectGHL(apiKey: string, locationId?: string): Promise<boolean> {
    try {
      const result = await mcpClient.connectGHL(apiKey, locationId);
      this.isConnected = result.success;
      
      if (this.isConnected && this.userId) {
        // Store GHL connection info in Firebase
        await this.storeGHLConnection(apiKey, locationId);
      }
      
      return this.isConnected;
    } catch (error) {
      console.error('Failed to connect to GHL:', error);
      return false;
    }
  }

  // Store GHL connection information in Firebase
  private async storeGHLConnection(apiKey: string, locationId?: string) {
    if (!this.userId) return;

    try {
      const connectionData = {
        apiKey: apiKey.substring(0, 10) + '...', // Store only partial key for security
        locationId,
        connectedAt: new Date().toISOString(),
        isActive: true,
        lastSync: null
      };

      await setDoc(doc(db, 'ghl_connections', this.userId), connectionData);
    } catch (error) {
      console.error('Failed to store GHL connection:', error);
    }
  }

  // Sync all GHL data to Firebase
  async syncAllData(options: GHLSyncOptions = {}): Promise<SyncResult> {
    if (!this.isConnected || !this.userId) {
      return {
        success: false,
        errors: ['Not connected to GHL or user not authenticated'],
        lastSyncTime: new Date().toISOString()
      };
    }

    const {
      syncContacts = true,
      syncOpportunities = true,
      syncPipelines = false, // Disabled by default since method may not be available
      batchSize = 100
    } = options;

    const result: SyncResult = {
      success: true,
      contactsSynced: 0,
      opportunitiesSynced: 0,
      errors: [],
      lastSyncTime: new Date().toISOString()
    };

    try {
      // Sync contacts
      if (syncContacts) {
        const contactsResult = await this.syncContacts(batchSize);
        result.contactsSynced = contactsResult.synced;
        if (contactsResult.errors.length > 0) {
          result.errors?.push(...contactsResult.errors);
        }
      }

      // Sync opportunities
      if (syncOpportunities) {
        const opportunitiesResult = await this.syncOpportunities(batchSize);
        result.opportunitiesSynced = opportunitiesResult.synced;
        if (opportunitiesResult.errors.length > 0) {
          result.errors?.push(...opportunitiesResult.errors);
        }
      }

      // Sync pipelines (optional)
      if (syncPipelines) {
        await this.syncPipelines();
      }

      // Update last sync time
      await this.updateLastSyncTime();

      result.success = (result.errors?.length || 0) === 0;
      
    } catch (error) {
      result.success = false;
      result.errors?.push(error instanceof Error ? error.message : 'Unknown sync error');
    }

    return result;
  }

  // Sync GHL contacts to Firebase
  private async syncContacts(batchSize: number = 100): Promise<{ synced: number; errors: string[] }> {
    const errors: string[] = [];
    let synced = 0;

    try {
      // Get contacts from GHL via MCP
      const ghlContactsResponse = await mcpClient.listGHLContacts();
      
      if (!ghlContactsResponse.success || !ghlContactsResponse.data) {
        errors.push('Failed to fetch contacts from GHL');
        return { synced, errors };
      }

      const ghlContacts = ghlContactsResponse.data as GHLContactFromAPI[];
      const batch = writeBatch(db);
      let batchCount = 0;

      for (const ghlContact of ghlContacts) {
        try {
          // Map GHL contact to our Firestore structure
          const firestoreContact: Omit<GHLContact, 'id'> = {
            firstName: ghlContact.firstName || '',
            lastName: ghlContact.lastName || '',
            email: ghlContact.email || '',
            phone: ghlContact.phone || '',
            address: this.extractAddressFromCustomFields(ghlContact.customFields),
            tags: ghlContact.tags || [],
            customFields: ghlContact.customFields || {},
            dateAdded: ghlContact.dateAdded || new Date().toISOString(),
            lastActivity: ghlContact.lastActivity || new Date().toISOString(),
            source: this.extractSourceFromCustomFields(ghlContact.customFields) || 'GHL',
            status: this.extractStatusFromCustomFields(ghlContact.customFields) || 'new',
            assignedTo: this.extractAssignedToFromCustomFields(ghlContact.customFields) || '',
            leadScore: this.calculateLeadScore(ghlContact),
            estimatedValue: this.estimateContactValue(ghlContact),
            ghlId: ghlContact.id,
            syncedAt: new Date().toISOString(),
            userId: this.userId!
          };

          // Use GHL ID as document ID to prevent duplicates
          const docRef = doc(db, 'ghl_contacts', `${this.userId}_${ghlContact.id}`);
          batch.set(docRef, firestoreContact);
          
          batchCount++;
          synced++;

          // Commit batch when it reaches the batch size
          if (batchCount >= batchSize) {
            await batch.commit();
            batchCount = 0;
          }

        } catch (error) {
          errors.push(`Failed to sync contact ${ghlContact.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Commit remaining items in batch
      if (batchCount > 0) {
        await batch.commit();
      }

    } catch (error) {
      errors.push(`Contact sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { synced, errors };
  }

  // Extract address from custom fields
  private extractAddressFromCustomFields(customFields: Record<string, any>): GHLContact['address'] {
    return {
      line1: customFields?.address || customFields?.street || '',
      city: customFields?.city || '',
      state: customFields?.state || '',
      postalCode: customFields?.zipCode || customFields?.postalCode || '',
      country: customFields?.country || 'US'
    };
  }

  // Extract source from custom fields or tags
  private extractSourceFromCustomFields(customFields: Record<string, any>): string {
    return customFields?.source || customFields?.leadSource || 'GHL';
  }

  // Extract status from custom fields or tags
  private extractStatusFromCustomFields(customFields: Record<string, any>): string {
    return customFields?.status || customFields?.leadStatus || 'new';
  }

  // Extract assigned to from custom fields
  private extractAssignedToFromCustomFields(customFields: Record<string, any>): string | undefined {
    return customFields?.assignedTo || customFields?.salesRep || customFields?.owner;
  }

  // Sync GHL opportunities to Firebase
  private async syncOpportunities(batchSize: number = 100): Promise<{ synced: number; errors: string[] }> {
    const errors: string[] = [];
    let synced = 0;

    try {
      // Get opportunities from GHL via MCP
      const ghlOpportunitiesResponse = await mcpClient.listGHLOpportunities();
      
      if (!ghlOpportunitiesResponse.success || !ghlOpportunitiesResponse.data) {
        errors.push('Failed to fetch opportunities from GHL');
        return { synced, errors };
      }

      const ghlOpportunities = ghlOpportunitiesResponse.data;
      const batch = writeBatch(db);
      let batchCount = 0;

      for (const ghlOpportunity of ghlOpportunities) {
        try {
          const firestoreOpportunity: Omit<GHLOpportunity, 'id'> = {
            name: ghlOpportunity.name || '',
            contactId: ghlOpportunity.contactId || '',
            pipelineId: ghlOpportunity.pipelineId || '',
            stageId: ghlOpportunity.stageId || '',
            status: ghlOpportunity.status || 'open',
            monetaryValue: ghlOpportunity.monetaryValue || 0,
            assignedTo: ghlOpportunity.assignedTo || '',
            dateCreated: ghlOpportunity.dateCreated || new Date().toISOString(),
            lastUpdated: ghlOpportunity.lastUpdated || new Date().toISOString(),
            ghlId: ghlOpportunity.id,
            syncedAt: new Date().toISOString(),
            userId: this.userId!
          };

          // Use GHL ID as document ID to prevent duplicates
          const docRef = doc(db, 'ghl_opportunities', `${this.userId}_${ghlOpportunity.id}`);
          batch.set(docRef, firestoreOpportunity);
          
          batchCount++;
          synced++;

          // Commit batch when it reaches the batch size
          if (batchCount >= batchSize) {
            await batch.commit();
            batchCount = 0;
          }

        } catch (error) {
          errors.push(`Failed to sync opportunity ${ghlOpportunity.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Commit remaining items in batch
      if (batchCount > 0) {
        await batch.commit();
      }

    } catch (error) {
      errors.push(`Opportunity sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { synced, errors };
  }

  // Sync GHL pipelines to Firebase (optional, may not be available)
  private async syncPipelines(): Promise<void> {
    try {
      // Check if the method exists on mcpClient
      if (typeof (mcpClient as any).listGHLPipelines === 'function') {
        const ghlPipelinesResponse = await (mcpClient as any).listGHLPipelines();
        
        if (!ghlPipelinesResponse?.success || !ghlPipelinesResponse.data) {
          console.warn('Failed to fetch pipelines from GHL');
          return;
        }

        const ghlPipelines = ghlPipelinesResponse.data;

        for (const ghlPipeline of ghlPipelines) {
          const firestorePipeline: Omit<GHLPipeline, 'id'> = {
            name: ghlPipeline.name || '',
            stages: ghlPipeline.stages || [],
            ghlId: ghlPipeline.id,
            syncedAt: new Date().toISOString(),
            userId: this.userId!
          };

          await setDoc(doc(db, 'ghl_pipelines', `${this.userId}_${ghlPipeline.id}`), firestorePipeline);
        }
      } else {
        console.warn('Pipeline sync method not available on MCP client');
      }

    } catch (error) {
      console.error('Pipeline sync failed:', error);
    }
  }

  // Calculate lead score based on GHL contact data
  private calculateLeadScore(contact: GHLContactFromAPI): number {
    let score = 50; // Base score

    // Email presence
    if (contact.email) score += 10;
    
    // Phone presence
    if (contact.phone) score += 10;
    
    // Recent activity (within 7 days)
    if (contact.lastActivity) {
      const lastActivity = new Date(contact.lastActivity);
      const daysSinceActivity = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceActivity <= 7) score += 15;
      else if (daysSinceActivity <= 30) score += 5;
    }

    // Tags indicating interest
    const highValueTags = ['hot lead', 'qualified', 'interested', 'ready to buy'];
    const contactTags = (contact.tags || []).map((tag: string) => tag.toLowerCase());
    const hasHighValueTag = highValueTags.some(tag => contactTags.includes(tag));
    if (hasHighValueTag) score += 20;

    // Custom fields indicating solar interest
    const customFields = contact.customFields || {};
    if (customFields.solarInterest === 'high') score += 15;
    if (customFields.budget && parseFloat(customFields.budget) > 20000) score += 10;

    return Math.min(100, Math.max(0, score));
  }

  // Estimate contact value based on available data
  private estimateContactValue(contact: GHLContactFromAPI): number {
    let estimatedValue = 25000; // Base solar installation value

    // Adjust based on custom fields
    const customFields = contact.customFields || {};
    
    if (customFields.budget) {
      const budget = parseFloat(customFields.budget);
      if (!isNaN(budget)) {
        estimatedValue = budget;
      }
    }

    if (customFields.homeSize) {
      const homeSize = parseFloat(customFields.homeSize);
      if (!isNaN(homeSize)) {
        // Estimate $15-20 per sq ft for solar
        estimatedValue = Math.max(estimatedValue, homeSize * 17.5);
      }
    }

    if (customFields.electricBill) {
      const monthlyBill = parseFloat(customFields.electricBill);
      if (!isNaN(monthlyBill)) {
        // Estimate system size based on monthly bill
        // Rough calculation: $100/month = ~7kW system = ~$21,000
        estimatedValue = Math.max(estimatedValue, monthlyBill * 210);
      }
    }

    return Math.round(estimatedValue);
  }

  // Update last sync time
  private async updateLastSyncTime(): Promise<void> {
    if (!this.userId) return;

    try {
      await updateDoc(doc(db, 'ghl_connections', this.userId), {
        lastSync: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to update last sync time:', error);
    }
  }

  // Get synced contacts from Firebase
  async getContacts(filters?: { status?: string; assignedTo?: string; limit?: number }): Promise<GHLContact[]> {
    if (!this.userId) return [];

    try {
      let q = query(
        collection(db, 'ghl_contacts'),
        where('userId', '==', this.userId),
        orderBy('syncedAt', 'desc')
      );

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
      })) as GHLContact[];

    } catch (error) {
      console.error('Failed to get contacts:', error);
      return [];
    }
  }

  // Get synced opportunities from Firebase
  async getOpportunities(filters?: { status?: string; pipelineId?: string; limit?: number }): Promise<GHLOpportunity[]> {
    if (!this.userId) return [];

    try {
      let q = query(
        collection(db, 'ghl_opportunities'),
        where('userId', '==', this.userId),
        orderBy('syncedAt', 'desc')
      );

      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters?.pipelineId) {
        q = query(q, where('pipelineId', '==', filters.pipelineId));
      }

      if (filters?.limit) {
        q = query(q, limit(filters.limit));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GHLOpportunity[];

    } catch (error) {
      console.error('Failed to get opportunities:', error);
      return [];
    }
  }

  // Start real-time sync (polls GHL data periodically)
  startRealTimeSync(intervalMinutes: number = 15): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(async () => {
      if (this.isConnected && this.userId) {
        console.log('Starting scheduled GHL sync...');
        const result = await this.syncAllData({ realTimeSync: true });
        console.log('Scheduled sync completed:', result);
      }
    }, intervalMinutes * 60 * 1000);
  }

  // Stop real-time sync
  stopRealTimeSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Subscribe to real-time contact changes
  subscribeToContacts(callback: (contacts: GHLContact[]) => void): () => void {
    if (!this.userId) return () => {};

    const q = query(
      collection(db, 'ghl_contacts'),
      where('userId', '==', this.userId),
      orderBy('syncedAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const contacts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GHLContact[];
      callback(contacts);
    });
  }

  // Subscribe to real-time opportunity changes
  subscribeToOpportunities(callback: (opportunities: GHLOpportunity[]) => void): () => void {
    if (!this.userId) return () => {};

    const q = query(
      collection(db, 'ghl_opportunities'),
      where('userId', '==', this.userId),
      orderBy('syncedAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const opportunities = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GHLOpportunity[];
      callback(opportunities);
    });
  }

  // Get sync status
  async getSyncStatus(): Promise<{ lastSync: string | null; isConnected: boolean; contactCount: number; opportunityCount: number }> {
    if (!this.userId) {
      return { lastSync: null, isConnected: false, contactCount: 0, opportunityCount: 0 };
    }

    try {
      // Get connection info
      const connectionDoc = await getDoc(doc(db, 'ghl_connections', this.userId));
      const connectionData = connectionDoc.exists() ? connectionDoc.data() : null;

      // Get contact count
      const contactsQuery = query(
        collection(db, 'ghl_contacts'),
        where('userId', '==', this.userId)
      );
      const contactsSnapshot = await getDocs(contactsQuery);

      // Get opportunity count
      const opportunitiesQuery = query(
        collection(db, 'ghl_opportunities'),
        where('userId', '==', this.userId)
      );
      const opportunitiesSnapshot = await getDocs(opportunitiesQuery);

      return {
        lastSync: connectionData?.lastSync || null,
        isConnected: this.isConnected,
        contactCount: contactsSnapshot.size,
        opportunityCount: opportunitiesSnapshot.size
      };

    } catch (error) {
      console.error('Failed to get sync status:', error);
      return { lastSync: null, isConnected: false, contactCount: 0, opportunityCount: 0 };
    }
  }

  // Cleanup
  disconnect(): void {
    this.stopRealTimeSync();
    this.isConnected = false;
    this.userId = null;
  }
}

// Singleton instance
export const ghlFirebaseService = new GHLFirebaseService(); 