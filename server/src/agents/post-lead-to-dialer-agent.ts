import { ReadyModeService } from '../services/readymode/readymode-service';
import { ReadyModeApiRequest, ReadyModeLeadData } from '../services/readymode/types';
import * as admin from 'firebase-admin';

/**
 * MCP Agent: PostLeadToDialerAgent
 * 
 * Handles the automatic posting of qualified leads from GHL to ReadyMode dialer campaigns.
 * Includes lead qualification, campaign routing, and status tracking.
 */
export class PostLeadToDialerAgent {
  private readyModeService: ReadyModeService;
  private db: admin.firestore.Firestore | null;

  constructor() {
    this.readyModeService = ReadyModeService.getInstance();
    
    // Initialize Firestore if Firebase is available
    try {
      if (admin.apps.length > 0) {
        this.db = admin.firestore();
      } else {
        console.warn('Firebase not initialized - agent logging will be disabled');
        this.db = null;
      }
    } catch (error) {
      console.warn('Failed to initialize Firestore:', error);
      this.db = null;
    }
  }

  /**
   * Primary MCP skill: Process and post lead to ReadyMode
   */
  async processLead(leadData: GHLLeadData, options?: PostLeadOptions): Promise<PostLeadResult> {
    const startTime = Date.now();
    const agentId = this.generateAgentId();

    try {
      // Log agent invocation
      await this.logAgentActivity(agentId, 'STARTED', 'Lead processing initiated', leadData);

      // Step 1: Validate and qualify the lead
      const qualification = await this.qualifyLead(leadData);
      if (!qualification.isQualified) {
        const result: PostLeadResult = {
          success: false,
          agentId,
          error: `Lead qualification failed: ${qualification.reason}`,
          leadData,
          processingTime: Date.now() - startTime
        };
        await this.logAgentActivity(agentId, 'FAILED', 'Lead not qualified', leadData, result);
        return result;
      }

      // Step 2: Determine target campaign/channel
      const campaign = await this.determineCampaign(leadData, qualification, options?.preferredChannel);
      if (!campaign) {
        const result: PostLeadResult = {
          success: false,
          agentId,
          error: 'No suitable ReadyMode campaign found for this lead',
          leadData,
          processingTime: Date.now() - startTime
        };
        await this.logAgentActivity(agentId, 'FAILED', 'No campaign available', leadData, result);
        return result;
      }

      // Step 3: Transform GHL lead data to ReadyMode format
      const readyModeData = this.transformLeadData(leadData, qualification);

      // Step 4: Post to ReadyMode
      const readyModeRequest: ReadyModeApiRequest = {
        leadData: readyModeData,
        channelId: campaign.channelId,
        apiUrl: campaign.apiUrl,
        options: {
          contentType: options?.contentType || 'application/x-www-form-urlencoded',
          timeout: options?.timeout || 30000,
          retries: options?.retries || 3
        }
      };

      const readyModeResponse = await this.readyModeService.sendLead(readyModeRequest);

      // Step 5: Update GHL with ReadyMode status
      if (readyModeResponse.success) {
        await this.updateGHLLeadStatus(leadData.ghlContactId, {
          readyModeLeadId: readyModeResponse.xencall_leadId,
          dialerStatus: 'POSTED',
          campaignId: campaign.channelId,
          postedAt: new Date().toISOString()
        });
      }

      // Step 6: Prepare result
      const result: PostLeadResult = {
        success: readyModeResponse.success,
        agentId,
        readyModeResponse,
        campaign,
        qualification,
        leadData,
        processingTime: Date.now() - startTime
      };

      if (!readyModeResponse.success) {
        result.error = readyModeResponse.error;
      }

      // Log final result
      await this.logAgentActivity(
        agentId, 
        readyModeResponse.success ? 'COMPLETED' : 'FAILED', 
        readyModeResponse.success ? 'Lead posted successfully' : `Posting failed: ${readyModeResponse.error}`,
        leadData, 
        result
      );

      return result;

    } catch (error) {
      const result: PostLeadResult = {
        success: false,
        agentId,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        leadData,
        processingTime: Date.now() - startTime
      };

      await this.logAgentActivity(agentId, 'ERROR', 'Agent processing error', leadData, result);
      return result;
    }
  }

  /**
   * Batch processing for multiple leads
   */
  async processLeadBatch(leads: GHLLeadData[], options?: PostLeadOptions): Promise<BatchPostResult> {
    const results: PostLeadResult[] = [];
    const batchId = this.generateBatchId();
    
    for (const lead of leads) {
      const result = await this.processLead(lead, options);
      results.push(result);
      
      // Add delay between requests to avoid rate limiting
      if (options?.batchDelay) {
        await this.delay(options.batchDelay);
      }
    }

    const batchResult: BatchPostResult = {
      batchId,
      totalLeads: leads.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
      processingTime: results.reduce((sum, r) => sum + r.processingTime, 0)
    };

    // Log batch completion
    await this.logBatchActivity(batchId, batchResult);

    return batchResult;
  }

  /**
   * Lead qualification logic
   */
  private async qualifyLead(leadData: GHLLeadData): Promise<LeadQualification> {
    const qualification: LeadQualification = {
      isQualified: false,
      score: 0,
      reason: '',
      leadType: 'unknown',
      priority: 'normal'
    };

    // Required field check
    if (!leadData.phone) {
      qualification.reason = 'Missing required phone number';
      return qualification;
    }

    // Phone validation
    const phoneRegex = /^\+?1?[-.\s]?(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})$/;
    if (!phoneRegex.test(leadData.phone)) {
      qualification.reason = 'Invalid phone number format';
      return qualification;
    }

    // Determine lead type and scoring
    let score = 50; // Base score

    // Lead source scoring
    if (leadData.source) {
      const sourceScore = this.getSourceScore(leadData.source);
      score += sourceScore;
    }

    // Contact completeness scoring
    if (leadData.firstName) score += 5;
    if (leadData.lastName) score += 5;
    if (leadData.email) score += 10;
    if (leadData.address) score += 10;

    // Lead age scoring (newer is better)
    if (leadData.dateAdded) {
      const ageHours = (Date.now() - new Date(leadData.dateAdded).getTime()) / (1000 * 60 * 60);
      if (ageHours < 1) score += 20;
      else if (ageHours < 24) score += 10;
      else if (ageHours < 72) score += 5;
    }

    // Determine lead type
    qualification.leadType = this.determineLeadType(leadData);

    // Priority assignment
    if (score >= 80) qualification.priority = 'high';
    else if (score >= 60) qualification.priority = 'normal';
    else qualification.priority = 'low';

    // Qualification threshold
    const minScore = parseInt(process.env.READYMODE_MIN_LEAD_SCORE || '50');
    qualification.isQualified = score >= minScore;
    qualification.score = score;

    if (!qualification.isQualified) {
      qualification.reason = `Lead score ${score} below minimum threshold ${minScore}`;
    }

    return qualification;
  }

  /**
   * Determine the best ReadyMode campaign for this lead
   */
  private async determineCampaign(
    leadData: GHLLeadData, 
    qualification: LeadQualification,
    preferredChannel?: string
  ): Promise<CampaignRouting | null> {
    // If preferred channel is specified, try to use it
    if (preferredChannel) {
      const channelUrl = process.env[`READYMODE_${preferredChannel.toUpperCase()}_API_URL`];
      if (channelUrl && channelUrl !== 'your_readymode_channel_api_url_here') {
        return {
          channelId: preferredChannel,
          apiUrl: channelUrl,
          campaignName: `${preferredChannel} Campaign`,
          routingReason: 'Preferred channel specified'
        };
      }
    }

    // Route based on lead type and priority
    const routingRules = [
      // High priority solar leads
      {
        condition: (q: LeadQualification) => q.leadType === 'solar' && q.priority === 'high',
        channelId: 'solar_warm',
        campaignName: 'Solar Warm Leads'
      },
      // Normal/low priority solar leads
      {
        condition: (q: LeadQualification) => q.leadType === 'solar',
        channelId: 'solar_cold',
        campaignName: 'Solar Cold Leads'
      },
      // Default routing
      {
        condition: () => true,
        channelId: 'primary',
        campaignName: 'Primary Campaign'
      }
    ];

    for (const rule of routingRules) {
      if (rule.condition(qualification)) {
        const envVar = rule.channelId === 'primary' ? 
          'READYMODE_PRIMARY_API_URL' : 
          `READYMODE_${rule.channelId.toUpperCase()}_API_URL`;
        
        const apiUrl = process.env[envVar];
        if (apiUrl && apiUrl !== 'your_readymode_channel_api_url_here') {
          return {
            channelId: rule.channelId,
            apiUrl,
            campaignName: rule.campaignName,
            routingReason: `Matched rule: ${rule.campaignName}`
          };
        }
      }
    }

    return null;
  }

  /**
   * Transform GHL lead data to ReadyMode format
   */
  private transformLeadData(leadData: GHLLeadData, qualification: LeadQualification): ReadyModeLeadData {
    return {
      phone: leadData.phone,
      firstName: leadData.firstName || '',
      lastName: leadData.lastName || '',
      email: leadData.email || '',
      address: leadData.address || '',
      city: leadData.city || '',
      state: leadData.state || '',
      zip: leadData.postalCode || '',
      customFields: {
        ghlContactId: leadData.ghlContactId,
        leadSource: leadData.source || 'GHL',
        leadType: qualification.leadType,
        leadScore: qualification.score,
        priority: qualification.priority,
        dateAdded: leadData.dateAdded || new Date().toISOString()
      },
      ghlContactId: leadData.ghlContactId,
      leadSource: leadData.source || 'GHL',
      campaignId: leadData.campaignId
    };
  }

  /**
   * Update GHL lead with ReadyMode status
   */
  private async updateGHLLeadStatus(ghlContactId: string, status: GHLDialerStatus): Promise<void> {
    try {
      // This would integrate with GHL API to update the contact
      // For now, we'll store it in Firestore
      await this.db?.collection('ghl_dialer_status').doc(ghlContactId).set({
        ...status,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Failed to update GHL lead status:', error);
    }
  }

  /**
   * Get scoring for lead source
   */
  private getSourceScore(source: string): number {
    const sourceScores: Record<string, number> = {
      'website': 15,
      'referral': 20,
      'social_media': 10,
      'google_ads': 12,
      'facebook_ads': 10,
      'organic_search': 15,
      'cold_call': 5,
      'email_campaign': 8
    };

    return sourceScores[source.toLowerCase()] || 5;
  }

  /**
   * Determine lead type from GHL data
   */
  private determineLeadType(leadData: GHLLeadData): string {
    // Check tags, source, or other indicators
    const tags = leadData.tags || [];
    const source = leadData.source || '';

    if (tags.some(tag => tag.toLowerCase().includes('solar')) || 
        source.toLowerCase().includes('solar')) {
      return 'solar';
    }

    return 'general';
  }

  /**
   * Logging and tracking methods
   */
  private async logAgentActivity(
    agentId: string, 
    status: string, 
    message: string, 
    leadData: GHLLeadData, 
    result?: PostLeadResult
  ): Promise<void> {
    try {
      await this.db?.collection('agent_activity').add({
        agentId,
        agentType: 'PostLeadToDialerAgent',
        status,
        message,
        leadPhone: leadData.phone,
        ghlContactId: leadData.ghlContactId,
        timestamp: new Date().toISOString(),
        result: result ? JSON.stringify(result) : null
      });
    } catch (error) {
      console.error('Failed to log agent activity:', error);
    }
  }

  private async logBatchActivity(batchId: string, result: BatchPostResult): Promise<void> {
    try {
      const { batchId: resultBatchId, ...resultData } = result;
      await this.db?.collection('batch_activity').add({
        batchId,
        agentType: 'PostLeadToDialerAgent',
        ...resultData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log batch activity:', error);
    }
  }

  /**
   * Utility methods
   */
  private generateAgentId(): string {
    return `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateBatchId(): string {
    return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Type definitions for the agent
export interface GHLLeadData {
  ghlContactId: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  source?: string;
  tags?: string[];
  dateAdded?: string;
  campaignId?: string;
  [key: string]: unknown;
}

export interface PostLeadOptions {
  preferredChannel?: string;
  contentType?: 'application/x-www-form-urlencoded' | 'application/json';
  timeout?: number;
  retries?: number;
  batchDelay?: number;
}

export interface LeadQualification {
  isQualified: boolean;
  score: number;
  reason: string;
  leadType: string;
  priority: 'high' | 'normal' | 'low';
}

export interface CampaignRouting {
  channelId: string;
  apiUrl: string;
  campaignName: string;
  routingReason: string;
}

export interface PostLeadResult {
  success: boolean;
  agentId: string;
  readyModeResponse?: import('../services/readymode/types').ReadyModeApiResponse;
  campaign?: CampaignRouting;
  qualification?: LeadQualification;
  leadData: GHLLeadData;
  processingTime: number;
  error?: string;
}

export interface BatchPostResult {
  batchId: string;
  totalLeads: number;
  successful: number;
  failed: number;
  results: PostLeadResult[];
  processingTime: number;
}

export interface GHLDialerStatus {
  readyModeLeadId: string;
  dialerStatus: 'POSTED' | 'CALLED' | 'CONNECTED' | 'FAILED';
  campaignId: string;
  postedAt: string;
  lastCallAt?: string;
  callResult?: string;
} 