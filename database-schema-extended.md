# BooksBoardroom - Extended Database Schema

## Overview

This extended database schema builds upon the base Financial Operations Portal to include comprehensive CRM capabilities, file management, communication tracking, and specialized features for BooksBoardroom's business operations.

## Additional Collections

### organizations/{orgId}/contacts

```typescript
interface Contact {
  id: string;                     // Contact ID (document ID)
  type: ContactType;              // Contact type
  status: ContactStatus;          // Contact status
  
  // Personal Information
  personalInfo: {
    firstName: string;
    lastName: string;
    middleName?: string;
    title?: string;               // Mr., Mrs., Dr., etc.
    jobTitle?: string;
    department?: string;
    email: string;
    phone: string;
    mobile?: string;
    alternateEmail?: string;
    linkedIn?: string;
    twitter?: string;
    website?: string;
  };
  
  // Company Information
  companyInfo?: {
    companyName: string;
    industry: string;
    companySize: string;          // "1-10", "11-50", "51-200", etc.
    revenue?: string;             // Revenue range
    website?: string;
    headquarters?: Address;
    description?: string;
  };
  
  // Address Information
  addresses: {
    id: string;
    type: AddressType;            // primary, billing, shipping, office
    address: Address;
    isPrimary: boolean;
  }[];
  
  // Relationship & Lead Information
  leadInfo: {
    source: LeadSource;
    score: number;                // 0-100 AI-generated lead score
    stage: LeadStage;
    priority: Priority;
    assignedTo: string;           // User ID
    estimatedValue: number;
    probability: number;          // 0-100 probability of closing
    expectedCloseDate?: Timestamp;
    lastContactDate?: Timestamp;
    nextFollowUpDate?: Timestamp;
  };
  
  // Communication Preferences
  communicationPrefs: {
    preferredMethod: 'email' | 'phone' | 'text' | 'mail';
    timeZone: string;
    bestTimeToCall?: string;
    doNotCall: boolean;
    doNotEmail: boolean;
    doNotText: boolean;
    emailSubscribed: boolean;
    marketingConsent: boolean;
    consentDate?: Timestamp;
  };
  
  // Custom Fields
  customFields: {
    [key: string]: any;
  };
  
  // Relationships
  relationships: {
    customerId?: string;          // If converted to customer
    parentContactId?: string;     // For organizational hierarchy
    relatedContacts: string[];    // Related contact IDs
    accountId?: string;           // Account/company ID
  };
  
  // Tags and Categories
  tags: string[];
  categories: string[];
  
  // Tracking
  activities: string[];           // Activity IDs
  opportunities: string[];        // Opportunity IDs
  campaigns: string[];           // Campaign IDs
  
  // AI Insights
  aiInsights: {
    id: string;
    type: string;
    content: string;
    confidence: number;
    createdAt: Timestamp;
    actions?: string[];           // Suggested actions
  }[];
  
  // Metadata
  createdBy: string;
  createdAt: Timestamp;
  updatedBy: string;
  updatedAt: Timestamp;
  lastActivityDate?: Timestamp;
}

type ContactType = 'lead' | 'prospect' | 'customer' | 'partner' | 'vendor' | 'other';
type ContactStatus = 'active' | 'inactive' | 'converted' | 'lost' | 'do_not_contact';
type AddressType = 'primary' | 'billing' | 'shipping' | 'office' | 'home' | 'other';
type LeadSource = 'website' | 'referral' | 'social_media' | 'email_campaign' | 'cold_call' | 'trade_show' | 'advertisement' | 'partner' | 'other';
type LeadStage = 'awareness' | 'interest' | 'consideration' | 'intent' | 'evaluation' | 'purchase' | 'post_purchase';
type Priority = 'low' | 'medium' | 'high' | 'urgent';
```

### organizations/{orgId}/activities

```typescript
interface Activity {
  id: string;                     // Activity ID (document ID)
  type: ActivityType;             // Activity type
  subject: string;                // Activity subject
  description: string;            // Detailed description
  status: ActivityStatus;         // Activity status
  priority: Priority;
  
  // Participants
  participants: {
    contactId?: string;           // Related contact
    userId: string;               // User performing/responsible
    role: 'organizer' | 'attendee' | 'required' | 'optional';
  }[];
  
  // Timing
  scheduledDateTime?: Timestamp;  // For scheduled activities
  duration?: number;              // Duration in minutes
  completedDateTime?: Timestamp;  // When completed
  dueDate?: Timestamp;            // Due date for tasks
  
  // Communication Details (for calls, emails, meetings)
  communicationDetails?: {
    direction?: 'inbound' | 'outbound';
    medium?: 'phone' | 'email' | 'video' | 'in_person' | 'text';
    outcome?: string;             // Call outcome, meeting result, etc.
    nextSteps?: string;
    phoneNumber?: string;
    emailSubject?: string;
    emailBody?: string;
    meetingLocation?: string;
    meetingLink?: string;
  };
  
  // Task Details (for tasks)
  taskDetails?: {
    assignedTo: string;
    estimatedHours?: number;
    actualHours?: number;
    dependencies: string[];       // Other task IDs
    checklist?: {
      id: string;
      item: string;
      completed: boolean;
    }[];
  };
  
  // Associations
  associations: {
    contactIds: string[];
    projectId?: string;
    opportunityId?: string;
    campaignId?: string;
    customerId?: string;
  };
  
  // Attachments
  attachments: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedBy: string;
    uploadedAt: Timestamp;
  }[];
  
  // Follow-up
  followUp?: {
    required: boolean;
    dueDate: Timestamp;
    assignedTo: string;
    notes: string;
  };
  
  // Recording & Notes
  recording?: {
    url: string;
    duration: number;
    transcription?: string;
  };
  
  notes: string;
  
  // Metadata
  createdBy: string;
  createdAt: Timestamp;
  updatedBy: string;
  updatedAt: Timestamp;
}

type ActivityType = 'call' | 'email' | 'meeting' | 'task' | 'note' | 'demo' | 'proposal' | 'follow_up' | 'social_interaction' | 'other';
type ActivityStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled' | 'overdue';
```

### organizations/{orgId}/opportunities

```typescript
interface Opportunity {
  id: string;                     // Opportunity ID (document ID)
  name: string;                   // Opportunity name
  description: string;            // Description
  
  // Financial Information
  value: {
    estimated: number;
    weighted: number;             // estimated * probability
    actual?: number;              // When closed
    currency: string;
  };
  
  // Timeline
  timeline: {
    created: Timestamp;
    expectedClose: Timestamp;
    actualClose?: Timestamp;
    lastModified: Timestamp;
    daysInStage: number;
    salesCycle: number;           // Days from creation to close
  };
  
  // Stage & Status
  stage: OpportunityStage;
  status: OpportunityStatus;
  probability: number;            // 0-100
  
  // Relationships
  relationships: {
    primaryContactId: string;
    additionalContactIds: string[];
    accountId?: string;
    assignedUserId: string;
    teamMembers: string[];
  };
  
  // Product/Service Details
  products: {
    id: string;
    name: string;
    category: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    description?: string;
  }[];
  
  // Competition
  competitors: {
    name: string;
    strengths: string[];
    weaknesses: string[];
    status: 'active' | 'eliminated' | 'unknown';
  }[];
  
  // Activities & Communications
  activities: string[];           // Activity IDs
  lastActivity?: Timestamp;
  nextActivity?: {
    type: ActivityType;
    dueDate: Timestamp;
    assignedTo: string;
    description: string;
  };
  
  // Documents & Proposals
  documents: {
    id: string;
    type: 'proposal' | 'contract' | 'presentation' | 'quote' | 'other';
    name: string;
    url: string;
    version: number;
    sentAt?: Timestamp;
    viewedAt?: Timestamp;
    status: 'draft' | 'sent' | 'viewed' | 'signed' | 'rejected';
  }[];
  
  // Requirements & Criteria
  requirements: {
    budget: {
      min?: number;
      max?: number;
      approved: boolean;
    };
    timeline: {
      flexible: boolean;
      deadline?: Timestamp;
    };
    decisionCriteria: string[];
    decisionMakers: string[];     // Contact IDs
    decisionProcess: string;
  };
  
  // Campaign Attribution
  campaign?: {
    id: string;
    name: string;
    source: string;
    medium: string;
    cost?: number;
  };
  
  // AI Insights & Predictions
  aiInsights: {
    id: string;
    type: 'risk' | 'opportunity' | 'next_action' | 'competitor_intel' | 'deal_coaching';
    content: string;
    confidence: number;
    actionItems?: string[];
    createdAt: Timestamp;
  }[];
  
  // Close Reason (when lost/won)
  closeReason?: {
    type: 'won' | 'lost';
    reason: string;
    details: string;
    competitorChosen?: string;
    lessonsLearned?: string;
  };
  
  // Tags and Custom Fields
  tags: string[];
  customFields: {
    [key: string]: any;
  };
  
  // Metadata
  createdBy: string;
  createdAt: Timestamp;
  updatedBy: string;
  updatedAt: Timestamp;
}

type OpportunityStage = 'prospecting' | 'qualification' | 'needs_analysis' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
type OpportunityStatus = 'open' | 'won' | 'lost' | 'on_hold';
```

### organizations/{orgId}/files

```typescript
interface FileRecord {
  id: string;                     // File ID (document ID)
  
  // File Information
  fileInfo: {
    originalName: string;
    storageName: string;          // Name in Firebase Storage
    storagePath: string;          // Full path in Firebase Storage
    url: string;                  // Download URL
    thumbnailUrl?: string;        // Thumbnail URL for images
    mimeType: string;
    size: number;                 // Size in bytes
    checksum?: string;            // File checksum for integrity
  };
  
  // Classification
  classification: {
    type: FileType;
    category: string;
    subcategory?: string;
    confidentiality: 'public' | 'internal' | 'confidential' | 'restricted';
    isSystemGenerated: boolean;
  };
  
  // Content Analysis
  contentAnalysis?: {
    extractedText?: string;       // OCR/text extraction
    aiSummary?: string;          // AI-generated summary
    keywords: string[];
    entities: {                   // Named entities
      type: string;               // person, organization, location, etc.
      value: string;
      confidence: number;
    }[];
    sentiment?: {
      score: number;              // -1 to 1
      magnitude: number;
    };
  };
  
  // Associations
  associations: {
    contactIds: string[];
    projectIds: string[];
    opportunityIds: string[];
    customerIds: string[];
    activityIds: string[];
    taskIds: string[];
    invoiceIds: string[];
  };
  
  // Versioning
  versioning: {
    version: number;
    parentFileId?: string;        // Previous version
    isLatestVersion: boolean;
    versionHistory: {
      version: number;
      fileId: string;
      createdBy: string;
      createdAt: Timestamp;
      changeLog: string;
    }[];
  };
  
  // Access Control
  access: {
    visibility: 'private' | 'team' | 'organization' | 'public';
    permissions: {
      userId: string;
      role: 'viewer' | 'editor' | 'owner';
      grantedBy: string;
      grantedAt: Timestamp;
      expiresAt?: Timestamp;
    }[];
    shareLinks: {
      id: string;
      url: string;
      permissions: 'view' | 'download';
      expiresAt?: Timestamp;
      password?: string;
      createdBy: string;
      createdAt: Timestamp;
      accessCount: number;
    }[];
  };
  
  // Processing Status
  processing: {
    status: 'uploaded' | 'processing' | 'processed' | 'failed';
    thumbnailGenerated: boolean;
    textExtracted: boolean;
    aiAnalyzed: boolean;
    virusScanned: boolean;
    lastProcessedAt?: Timestamp;
    errorMessage?: string;
  };
  
  // Compliance & Retention
  compliance: {
    retentionPolicy?: {
      deleteAfter?: Timestamp;
      archiveAfter?: Timestamp;
      reason: string;
    };
    legalHold: boolean;
    complianceFlags: string[];
    dataClassification: string;
  };
  
  // Usage Analytics
  analytics: {
    views: number;
    downloads: number;
    lastViewed?: Timestamp;
    lastDownloaded?: Timestamp;
    viewHistory: {
      userId: string;
      timestamp: Timestamp;
      action: 'view' | 'download' | 'share';
    }[];
  };
  
  // Metadata
  metadata: {
    title?: string;
    description?: string;
    tags: string[];
    customFields: {
      [key: string]: any;
    };
  };
  
  // Audit Trail
  auditTrail: {
    createdBy: string;
    createdAt: Timestamp;
    uploadedBy: string;
    uploadedAt: Timestamp;
    lastModifiedBy: string;
    lastModifiedAt: Timestamp;
    actions: {
      action: string;
      userId: string;
      timestamp: Timestamp;
      details?: string;
    }[];
  };
}

type FileType = 'document' | 'image' | 'video' | 'audio' | 'spreadsheet' | 'presentation' | 'pdf' | 'archive' | 'code' | 'other';
```

### organizations/{orgId}/campaigns

```typescript
interface Campaign {
  id: string;                     // Campaign ID (document ID)
  name: string;                   // Campaign name
  description: string;            // Description
  
  // Campaign Details
  details: {
    type: CampaignType;
    status: CampaignStatus;
    budget: {
      planned: number;
      actual: number;
      currency: string;
    };
    timeline: {
      startDate: Timestamp;
      endDate: Timestamp;
      launchDate?: Timestamp;
    };
    objectives: string[];
    targetAudience: {
      demographics: {
        ageRange?: string;
        location?: string[];
        interests?: string[];
        industry?: string[];
      };
      segments: string[];
    };
  };
  
  // Channels & Tactics
  channels: {
    email: {
      enabled: boolean;
      templates: string[];
      sendCount: number;
      deliveryRate: number;
      openRate: number;
      clickRate: number;
    };
    socialMedia: {
      enabled: boolean;
      platforms: string[];
      posts: number;
      reach: number;
      engagement: number;
    };
    paidAds: {
      enabled: boolean;
      platforms: string[];
      impressions: number;
      clicks: number;
      cost: number;
    };
    webinar: {
      enabled: boolean;
      registrations: number;
      attendees: number;
      recordings: string[];
    };
    directMail: {
      enabled: boolean;
      sent: number;
      delivered: number;
    };
  };
  
  // Content & Assets
  assets: {
    id: string;
    type: 'email_template' | 'landing_page' | 'ad_creative' | 'brochure' | 'video' | 'other';
    name: string;
    url: string;
    status: 'draft' | 'approved' | 'active' | 'archived';
    performance?: {
      views: number;
      clicks: number;
      conversions: number;
    };
  }[];
  
  // Lead Generation
  leadGeneration: {
    sources: {
      source: string;
      medium: string;
      campaign: string;
      leads: number;
      cost: number;
    }[];
    forms: {
      id: string;
      name: string;
      submissions: number;
      conversionRate: number;
    }[];
    landingPages: {
      id: string;
      url: string;
      visits: number;
      conversions: number;
      conversionRate: number;
    }[];
  };
  
  // Performance Metrics
  metrics: {
    reach: number;
    impressions: number;
    clicks: number;
    leads: number;
    conversions: number;
    revenue: number;
    roi: number;
    costPerLead: number;
    costPerAcquisition: number;
    conversionRate: number;
    engagementRate: number;
  };
  
  // Attribution
  attribution: {
    contacts: string[];            // Contact IDs attributed to campaign
    opportunities: string[];       // Opportunity IDs
    customers: string[];           // Customer IDs
    revenue: number;
  };
  
  // Team & Responsibilities
  team: {
    owner: string;                // User ID
    members: {
      userId: string;
      role: string;
      responsibilities: string[];
    }[];
  };
  
  // Automation & Workflows
  automation: {
    triggers: {
      id: string;
      event: string;
      conditions: any[];
      actions: any[];
      enabled: boolean;
    }[];
    sequences: {
      id: string;
      name: string;
      steps: {
        delay: number;
        action: string;
        content: any;
      }[];
      enrolled: number;
      completed: number;
    }[];
  };
  
  // Analysis & Insights
  insights: {
    bestPerformingContent: string[];
    topSources: string[];
    audienceInsights: any;
    recommendations: string[];
    competitorAnalysis?: any;
  };
  
  // Tags and Custom Fields
  tags: string[];
  customFields: {
    [key: string]: any;
  };
  
  // Metadata
  createdBy: string;
  createdAt: Timestamp;
  updatedBy: string;
  updatedAt: Timestamp;
}

type CampaignType = 'email' | 'social_media' | 'paid_ads' | 'content_marketing' | 'webinar' | 'trade_show' | 'direct_mail' | 'integrated' | 'other';
type CampaignStatus = 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
```

### organizations/{orgId}/communications

```typescript
interface Communication {
  id: string;                     // Communication ID (document ID)
  
  // Communication Details
  type: CommunicationType;
  direction: 'inbound' | 'outbound';
  channel: CommunicationChannel;
  status: CommunicationStatus;
  
  // Participants
  participants: {
    sender: {
      userId?: string;            // If internal user
      contactId?: string;         // If external contact
      email?: string;
      phone?: string;
      name: string;
    };
    recipients: {
      userId?: string;
      contactId?: string;
      email?: string;
      phone?: string;
      name: string;
      type: 'to' | 'cc' | 'bcc';
    }[];
  };
  
  // Content
  content: {
    subject?: string;             // For emails, meeting titles
    body?: string;                // Email body, call notes, etc.
    attachments?: {
      id: string;
      name: string;
      url: string;
      size: number;
    }[];
    metadata?: {
      duration?: number;          // Call duration in seconds
      location?: string;          // Meeting location
      dialInNumber?: string;      // Conference dial-in
      meetingId?: string;         // Meeting ID
    };
  };
  
  // Timing
  timing: {
    sentAt?: Timestamp;
    deliveredAt?: Timestamp;
    readAt?: Timestamp;
    respondedAt?: Timestamp;
    scheduledFor?: Timestamp;     // For scheduled communications
    duration?: number;            // Duration in seconds
  };
  
  // Tracking & Analytics
  tracking: {
    opened: boolean;
    clicked: boolean;
    bounced: boolean;
    unsubscribed: boolean;
    clickedLinks: {
      url: string;
      timestamp: Timestamp;
    }[];
    deviceInfo?: {
      device: string;
      browser: string;
      os: string;
      location: string;
    };
  };
  
  // Integration Data
  integrationData: {
    platform?: string;            // Gmail, Outlook, Slack, etc.
    messageId?: string;           // External message ID
    threadId?: string;            // Email thread ID
    syncedAt?: Timestamp;
    rawData?: any;                // Raw data from integration
  };
  
  // Classification & AI Analysis
  analysis: {
    sentiment?: {
      score: number;              // -1 to 1
      magnitude: number;
      confidence: number;
    };
    intent?: {
      category: string;
      confidence: number;
    };
    topics?: string[];
    extractedEntities?: {
      type: string;
      value: string;
      confidence: number;
    }[];
    summary?: string;
    actionItems?: string[];
    nextSteps?: string[];
  };
  
  // Associations
  associations: {
    contactIds: string[];
    opportunityId?: string;
    projectId?: string;
    customerId?: string;
    campaignId?: string;
    parentCommunicationId?: string; // For replies/forwards
    relatedCommunications: string[];
  };
  
  // Follow-up
  followUp?: {
    required: boolean;
    dueDate?: Timestamp;
    assignedTo?: string;
    notes?: string;
    completed: boolean;
    completedAt?: Timestamp;
  };
  
  // Compliance & Privacy
  compliance: {
    consentGiven: boolean;
    consentType?: string;
    retentionPeriod?: number;     // Days to retain
    isPrivileged: boolean;        // Attorney-client, etc.
    complianceFlags: string[];
  };
  
  // Tags and Categories
  tags: string[];
  categories: string[];
  priority: Priority;
  
  // Metadata
  createdBy?: string;             // May be null for inbound
  createdAt: Timestamp;
  updatedBy?: string;
  updatedAt: Timestamp;
}

type CommunicationType = 'email' | 'call' | 'text' | 'voicemail' | 'meeting' | 'video_call' | 'chat' | 'social_media' | 'mail' | 'other';
type CommunicationChannel = 'email' | 'phone' | 'sms' | 'whatsapp' | 'slack' | 'teams' | 'zoom' | 'linkedin' | 'facebook' | 'twitter' | 'instagram' | 'other';
type CommunicationStatus = 'draft' | 'scheduled' | 'sent' | 'delivered' | 'read' | 'replied' | 'bounced' | 'failed';
```

## File Upload System Components

Now let me create the file upload system components:

```typescript
// File Upload Service
interface FileUploadService {
  // Upload single file
  uploadFile(
    file: File, 
    path: string, 
    metadata?: any,
    onProgress?: (progress: number) => void
  ): Promise<FileRecord>;
  
  // Upload multiple files
  uploadFiles(
    files: File[], 
    path: string, 
    metadata?: any,
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<FileRecord[]>;
  
  // Generate thumbnails
  generateThumbnail(fileRecord: FileRecord): Promise<string>;
  
  // Extract text from documents
  extractText(fileRecord: FileRecord): Promise<string>;
  
  // AI analysis
  analyzeContent(fileRecord: FileRecord): Promise<any>;
  
  // Delete file
  deleteFile(fileId: string): Promise<void>;
  
  // Get file by ID
  getFile(fileId: string): Promise<FileRecord>;
  
  // Search files
  searchFiles(query: string, filters?: any): Promise<FileRecord[]>;
  
  // Generate share link
  generateShareLink(fileId: string, permissions: string, expiresAt?: Date): Promise<string>;
}
```

## CRM Integration Points

```typescript
// CRM Service Interface
interface CRMService {
  // Contact Management
  createContact(contact: Partial<Contact>): Promise<Contact>;
  updateContact(contactId: string, updates: Partial<Contact>): Promise<Contact>;
  getContact(contactId: string): Promise<Contact>;
  searchContacts(query: string, filters?: any): Promise<Contact[]>;
  mergeContacts(primaryContactId: string, duplicateContactIds: string[]): Promise<Contact>;
  
  // Activity Management
  createActivity(activity: Partial<Activity>): Promise<Activity>;
  updateActivity(activityId: string, updates: Partial<Activity>): Promise<Activity>;
  getActivities(contactId?: string, filters?: any): Promise<Activity[]>;
  scheduleActivity(activity: Partial<Activity>): Promise<Activity>;
  
  // Opportunity Management
  createOpportunity(opportunity: Partial<Opportunity>): Promise<Opportunity>;
  updateOpportunity(opportunityId: string, updates: Partial<Opportunity>): Promise<Opportunity>;
  getOpportunities(contactId?: string, filters?: any): Promise<Opportunity[]>;
  
  // Campaign Management
  createCampaign(campaign: Partial<Campaign>): Promise<Campaign>;
  updateCampaign(campaignId: string, updates: Partial<Campaign>): Promise<Campaign>;
  getCampaigns(filters?: any): Promise<Campaign[]>;
  trackCampaignPerformance(campaignId: string): Promise<any>;
  
  // Communication Tracking
  trackCommunication(communication: Partial<Communication>): Promise<Communication>;
  getCommunicationHistory(contactId: string): Promise<Communication[]>;
  
  // Analytics & Reporting
  getContactAnalytics(contactId?: string): Promise<any>;
  getOpportunityAnalytics(): Promise<any>;
  getCampaignAnalytics(campaignId?: string): Promise<any>;
  generateReport(reportType: string, parameters: any): Promise<any>;
  
  // AI Features
  scoreContact(contactId: string): Promise<number>;
  predictOpportunityClose(opportunityId: string): Promise<any>;
  suggestNextActions(contactId: string): Promise<string[]>;
  analyzeEmail(emailContent: string): Promise<any>;
}
```

This comprehensive database structure provides BooksBoardroom with:

1. **Complete CRM capabilities** - Contact management, lead tracking, opportunity management
2. **Advanced file management** - Versioning, access control, content analysis, compliance
3. **Communication tracking** - All interactions across multiple channels
4. **Campaign management** - Multi-channel marketing campaigns with attribution
5. **AI-powered insights** - Throughout all modules for enhanced productivity
6. **Multi-tenant security** - Proper data isolation and access controls
7. **Integration readiness** - Designed to work with external systems via MCP agents

The schema is designed to scale from small businesses to enterprise clients while maintaining data integrity and security.