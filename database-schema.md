# Financial Operations Portal - Database Schema

## Overview

The Financial Operations Portal uses Firebase Firestore as its primary database. This document outlines the database schema, collection structure, and relationships between different data entities for a multi-tenant business operations platform.

## Collection Structure

The database follows a hierarchical structure with top-level collections and nested subcollections to enforce data isolation and access control.

### Top-Level Collections

1. **organizations**: Stores information about organizations using the platform
2. **users**: Stores user profile information
3. **aiInsights**: Stores AI-generated insights that apply across organizations
4. **systemSettings**: Stores global system settings and configuration

### Nested Collections

Each organization has its own set of nested collections to maintain multi-tenancy:

1. **organizations/{orgId}/users**: Organization-specific user information
2. **organizations/{orgId}/projects**: Business projects and initiatives
3. **organizations/{orgId}/leads**: Sales leads and opportunities
4. **organizations/{orgId}/customers**: Customer information
5. **organizations/{orgId}/tasks**: Tasks associated with projects
6. **organizations/{orgId}/invoices**: Financial invoices and billing
7. **organizations/{orgId}/transactions**: Financial transactions
8. **organizations/{orgId}/reports**: Financial and business reports
9. **organizations/{orgId}/documents**: Document metadata
10. **organizations/{orgId}/aiInsights**: Organization-specific AI insights
11. **organizations/{orgId}/integrations**: Integration configurations

## Schema Definitions

### organizations

```typescript
interface Organization {
  id: string;                     // Organization ID (document ID)
  name: string;                   // Organization name
  logo: string;                   // URL to organization logo
  address: Address;               // Organization address
  phone: string;                  // Organization phone number
  email: string;                  // Organization email
  website: string;                // Organization website
  taxId: string;                  // Tax ID / EIN
  industry: string;               // Industry type
  settings: {                     // Organization-specific settings
    defaultTaskDurations: {       // Default durations for task types
      [taskType: string]: number;
    };
    notificationPreferences: {    // Notification settings
      email: boolean;
      sms: boolean;
      slack: boolean;
    };
    branding: {                   // Branding settings
      primaryColor: string;
      secondaryColor: string;
      accentColor: string;
    };
    fiscalYear: {                 // Fiscal year settings
      startMonth: number;         // 1-12 (January = 1)
      endMonth: number;           // 1-12 (December = 12)
    };
  };
  subscriptionTier: string;       // Subscription tier (basic, pro, enterprise)
  subscriptionStatus: string;     // Subscription status (active, past_due, canceled)
  subscriptionExpiry: Timestamp;  // Subscription expiration date
  createdAt: Timestamp;           // Creation timestamp
  updatedAt: Timestamp;           // Last update timestamp
}

interface Address {
  street1: string;                // Street address line 1
  street2?: string;               // Street address line 2 (optional)
  city: string;                   // City
  state: string;                  // State/province
  postalCode: string;             // Postal/ZIP code
  country: string;                // Country
  coordinates?: {                 // Geolocation coordinates (optional)
    latitude: number;
    longitude: number;
  };
}
```

### users (top-level)

```typescript
interface User {
  id: string;                     // User ID (document ID, matches Firebase Auth UID)
  email: string;                  // User email
  displayName: string;            // Display name
  photoURL?: string;              // Profile photo URL (optional)
  phoneNumber?: string;           // Phone number (optional)
  role: UserRole;                 // User role (systemAdmin, orgAdmin, etc.)
  permissions: string[];          // Array of permission keys
  organizationId?: string;        // Associated organization ID (null for system admins)
  settings: {                     // User-specific settings
    theme: string;                // UI theme preference
    notifications: {              // Notification preferences
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    timezone: string;             // Preferred timezone
  };
  lastLogin: Timestamp;           // Last login timestamp
  createdAt: Timestamp;           // Creation timestamp
  updatedAt: Timestamp;           // Last update timestamp
}

type UserRole = 'systemAdmin' | 'orgAdmin' | 'projectManager' | 'accountant' | 'user' | 'viewer';
```

### organizations/{orgId}/users

```typescript
interface OrganizationUser {
  id: string;                     // User ID (document ID, matches Firebase Auth UID)
  email: string;                  // User email
  displayName: string;            // Display name
  photoURL?: string;              // Profile photo URL (optional)
  phoneNumber?: string;           // Phone number (optional)
  role: OrgUserRole;              // User role within the organization
  permissions: string[];          // Array of permission keys
  department?: string;            // Department (optional)
  position?: string;              // Job position/title (optional)
  employeeId?: string;            // Employee ID (optional)
  skills: string[];               // Array of skill tags
  availability: {                 // Availability settings for scheduling
    workingDays: number[];        // Array of working days (0-6, where 0 is Sunday)
    workingHours: {               // Working hours by day
      [day: number]: {
        start: string;            // Start time (HH:MM format)
        end: string;              // End time (HH:MM format)
      };
    };
    vacationDates: {              // Vacation/time-off periods
      start: Timestamp;
      end: Timestamp;
      type: string;               // Time-off type (vacation, sick, personal, etc.)
    }[];
  };
  performanceMetrics: {           // Performance metrics
    projectsCompleted: number;
    averageTaskCompletionTime: number;
    clientSatisfactionScore: number;
  };
  lastActive: Timestamp;          // Last activity timestamp
  createdAt: Timestamp;           // Creation timestamp
  updatedAt: Timestamp;           // Last update timestamp
}

type OrgUserRole = 'orgAdmin' | 'projectManager' | 'accountant' | 'user' | 'viewer';
```

### organizations/{orgId}/leads

```typescript
interface Lead {
  id: string;                     // Lead ID (document ID)
  source: string;                 // Lead source (website, referral, partner, etc.)
  status: LeadStatus;             // Lead status
  score: number;                  // Lead score (0-100, AI-generated)
  contact: {                      // Contact information
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
    position?: string;
    address?: Address;
  };
  businessDetails: {              // Business details
    industry?: string;            // Industry type
    companySize?: string;         // Company size category
    budget?: number;              // Budget range
    timeframe?: string;           // Project timeframe
    requirements: string[];       // Requirements list
  };
  assignedTo: string;             // User ID of assigned representative
  notes: {                        // Lead notes
    id: string;
    userId: string;
    content: string;
    createdAt: Timestamp;
  }[];
  interactions: {                 // Interaction history
    id: string;
    type: string;                 // Interaction type (call, email, meeting, etc.)
    userId: string;               // User who performed the interaction
    details: string;              // Interaction details
    outcome: string;              // Interaction outcome
    createdAt: Timestamp;
  }[];
  aiInsights: {                   // AI-generated insights
    id: string;
    type: string;                 // Insight type
    content: string;              // Insight content
    confidence: number;           // Confidence score (0-1)
    createdAt: Timestamp;
  }[];
  createdAt: Timestamp;           // Creation timestamp
  updatedAt: Timestamp;           // Last update timestamp
}

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
```

### organizations/{orgId}/customers

```typescript
interface Customer {
  id: string;                     // Customer ID (document ID)
  userId?: string;                // Associated user ID (if customer has login)
  firstName: string;              // First name
  lastName: string;               // Last name
  email: string;                  // Email address
  phone: string;                  // Phone number
  company?: string;               // Company name
  address: Address;               // Primary address
  billingAddress?: Address;       // Billing address (if different)
  communicationPreferences: {     // Communication preferences
    email: boolean;
    sms: boolean;
    phone: boolean;
    mailings: boolean;
  };
  projects: string[];             // Array of project IDs
  contracts: {                    // Contracts
    id: string;                   // Contract ID
    projectId: string;            // Associated project ID
    type: string;                 // Contract type
    status: string;               // Contract status
    signedAt?: Timestamp;         // Signing timestamp
    documentUrl: string;          // URL to contract document
  }[];
  financials: {                   // Financial information
    paymentMethod: {              // Payment method
      type: string;               // Payment type (credit, bank, etc.)
      last4: string;              // Last 4 digits of account
      expiryDate?: string;        // Expiry date (for credit cards)
    };
    invoices: string[];           // Array of invoice IDs
    accountBalance: number;       // Current account balance
    creditLimit?: number;         // Credit limit (if applicable)
  };
  tags: string[];                 // Array of customer tags
  notes: {                        // Customer notes
    id: string;
    userId: string;
    content: string;
    createdAt: Timestamp;
  }[];
  createdAt: Timestamp;           // Creation timestamp
  updatedAt: Timestamp;           // Last update timestamp
}
```

### organizations/{orgId}/projects

```typescript
interface Project {
  id: string;                     // Project ID (document ID)
  name: string;                   // Project name
  description: string;            // Project description
  status: ProjectStatus;          // Project status
  type: string;                   // Project type
  customerId?: string;            // Customer ID (optional)
  budget: {                       // Budget information
    estimated: number;            // Estimated budget
    actual: number;               // Actual costs
    approved: number;             // Approved budget
    remaining: number;            // Remaining budget
  };
  timeline: {                     // Project timeline
    estimatedStartDate: Timestamp;// Estimated start date
    estimatedEndDate: Timestamp;  // Estimated end date
    actualStartDate?: Timestamp;  // Actual start date
    actualEndDate?: Timestamp;    // Actual end date
    milestones: {                 // Project milestones
      id: string;
      name: string;
      description: string;
      status: string;
      estimatedDate: Timestamp;
      actualDate?: Timestamp;
      dependsOn: string[];        // Array of milestone IDs this depends on
    }[];
  };
  team: {                         // Project team
    projectManager: string;       // Project manager user ID
    accountManager?: string;      // Account manager user ID
    members: string[];            // Array of team member user IDs
  };
  tasks: string[];                // Array of task IDs
  documents: string[];            // Array of document IDs
  notes: {                        // Project notes
    id: string;
    userId: string;
    content: string;
    createdAt: Timestamp;
  }[];
  aiInsights: {                   // AI-generated insights
    id: string;
    type: string;
    content: string;
    confidence: number;
    createdAt: Timestamp;
  }[];
  createdAt: Timestamp;           // Creation timestamp
  updatedAt: Timestamp;           // Last update timestamp
}

type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
```

### organizations/{orgId}/invoices

```typescript
interface Invoice {
  id: string;                     // Invoice ID (document ID)
  invoiceNumber: string;          // Invoice number
  customerId: string;             // Customer ID
  projectId?: string;             // Associated project ID (optional)
  type: InvoiceType;              // Invoice type
  status: InvoiceStatus;          // Invoice status
  amount: {                       // Amount breakdown
    subtotal: number;             // Subtotal
    tax: number;                  // Tax amount
    discount: number;             // Discount amount
    total: number;                // Total amount
  };
  currency: string;               // Currency code (USD, EUR, etc.)
  lineItems: {                    // Line items
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    taxRate?: number;             // Tax rate for this item
  }[];
  dates: {                        // Important dates
    issued: Timestamp;            // Issue date
    due: Timestamp;               // Due date
    paid?: Timestamp;             // Payment date
    sent?: Timestamp;             // Date sent to customer
  };
  paymentTerms: string;           // Payment terms
  paymentMethod?: string;         // Payment method used
  transactionId?: string;         // Payment transaction ID
  notes?: string;                 // Invoice notes
  metadata: {                     // Additional metadata
    [key: string]: any;
  };
  createdBy: string;              // User ID who created the invoice
  createdAt: Timestamp;           // Creation timestamp
  updatedAt: Timestamp;           // Last update timestamp
}

type InvoiceType = 'standard' | 'recurring' | 'credit_note' | 'proforma';
type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
```

### organizations/{orgId}/transactions

```typescript
interface Transaction {
  id: string;                     // Transaction ID (document ID)
  type: TransactionType;          // Transaction type
  category: string;               // Transaction category
  subcategory?: string;           // Transaction subcategory
  amount: number;                 // Transaction amount
  currency: string;               // Currency code
  description: string;            // Transaction description
  date: Timestamp;                // Transaction date
  account: {                      // Account information
    name: string;                 // Account name
    type: string;                 // Account type (checking, savings, credit, etc.)
    number: string;               // Account number (last 4 digits)
  };
  counterparty?: {                // Other party in transaction
    name: string;                 // Name
    type: string;                 // Type (customer, vendor, employee, etc.)
    id?: string;                  // ID if known entity
  };
  projectId?: string;             // Associated project ID
  invoiceId?: string;             // Associated invoice ID
  customerId?: string;            // Associated customer ID
  tags: string[];                 // Transaction tags
  reconciled: boolean;            // Whether transaction is reconciled
  aiCategorized: boolean;         // Whether categorized by AI
  aiConfidence?: number;          // AI categorization confidence (0-1)
  attachments: string[];          // Array of document IDs
  notes?: string;                 // Transaction notes
  createdBy: string;              // User ID who created the transaction
  createdAt: Timestamp;           // Creation timestamp
  updatedAt: Timestamp;           // Last update timestamp
}

type TransactionType = 'income' | 'expense' | 'transfer' | 'adjustment';
```

### organizations/{orgId}/tasks

```typescript
interface Task {
  id: string;                     // Task ID (document ID)
  title: string;                  // Task title
  description: string;            // Task description
  status: TaskStatus;             // Task status
  priority: TaskPriority;         // Task priority
  type: string;                   // Task type
  projectId?: string;             // Associated project ID (optional)
  customerId?: string;            // Associated customer ID (optional)
  assignedTo: string;             // Assigned user ID
  assignedBy: string;             // User ID who assigned the task
  dueDate: Timestamp;             // Due date
  estimatedDuration: number;      // Estimated duration in minutes
  actualDuration?: number;        // Actual duration in minutes
  dependencies: string[];         // Array of task IDs this task depends on
  subtasks: {                     // Subtasks
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    assignedTo: string;
    dueDate: Timestamp;
    completedAt?: Timestamp;
  }[];
  attachments: {                  // Attachments
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedBy: string;
    uploadedAt: Timestamp;
  }[];
  comments: {                     // Comments
    id: string;
    userId: string;
    content: string;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
  }[];
  history: {                      // Task history
    id: string;
    userId: string;
    action: string;               // Action performed
    details: string;              // Action details
    timestamp: Timestamp;
  }[];
  createdAt: Timestamp;           // Creation timestamp
  updatedAt: Timestamp;           // Last update timestamp
  startedAt?: Timestamp;          // Start timestamp
  completedAt?: Timestamp;        // Completion timestamp
}

type TaskStatus = 'not_started' | 'in_progress' | 'blocked' | 'completed' | 'cancelled';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
```

### organizations/{orgId}/reports

```typescript
interface Report {
  id: string;                     // Report ID (document ID)
  name: string;                   // Report name
  type: ReportType;               // Report type
  format: ReportFormat;           // Report format
  status: ReportStatus;           // Report status
  parameters: {                   // Report parameters
    dateRange: {
      start: Timestamp;
      end: Timestamp;
    };
    filters: {
      [key: string]: any;
    };
    groupBy?: string[];           // Grouping fields
    sortBy?: string;              // Sort field
  };
  data?: {                        // Report data (when generated)
    headers: string[];
    rows: any[][];
    summary?: {
      [key: string]: any;
    };
  };
  schedule?: {                    // Scheduled report settings
    frequency: string;            // Frequency (daily, weekly, monthly)
    dayOfWeek?: number;           // Day of week (for weekly)
    dayOfMonth?: number;          // Day of month (for monthly)
    time: string;                 // Time to run (HH:MM)
    recipients: string[];         // Email recipients
    enabled: boolean;
  };
  url?: string;                   // URL to generated report file
  createdBy: string;              // User ID who created the report
  createdAt: Timestamp;           // Creation timestamp
  updatedAt: Timestamp;           // Last update timestamp
  generatedAt?: Timestamp;        // Last generation timestamp
}

type ReportType = 'financial' | 'project' | 'customer' | 'tax' | 'custom';
type ReportFormat = 'pdf' | 'excel' | 'csv' | 'html';
type ReportStatus = 'draft' | 'generating' | 'ready' | 'error';
```

## Multi-Tenant Security Rules

```javascript
// Firestore Security Rules for Multi-Tenant Architecture
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Organization access control
    match /organizations/{orgId} {
      allow read, write: if request.auth != null && 
        (isOrgAdmin(orgId) || isSystemAdmin());
      
      // Nested collections within organizations
      match /{collection}/{docId} {
        allow read, write: if request.auth != null && 
          (hasOrgAccess(orgId) || isSystemAdmin());
      }
    }
    
    // Helper functions
    function isSystemAdmin() {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'systemAdmin';
    }
    
    function isOrgAdmin(orgId) {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.organizationId == orgId &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'orgAdmin';
    }
    
    function hasOrgAccess(orgId) {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.organizationId == orgId;
    }
  }
}
```

## Indexes

```json
{
  "indexes": [
    {
      "collectionGroup": "projects",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "status", "order": "ASCENDING"},
        {"fieldPath": "createdAt", "order": "DESCENDING"}
      ]
    },
    {
      "collectionGroup": "tasks",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "assignedTo", "order": "ASCENDING"},
        {"fieldPath": "dueDate", "order": "ASCENDING"}
      ]
    },
    {
      "collectionGroup": "invoices",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "status", "order": "ASCENDING"},
        {"fieldPath": "dates.due", "order": "ASCENDING"}
      ]
    },
    {
      "collectionGroup": "transactions",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "date", "order": "DESCENDING"},
        {"fieldPath": "type", "order": "ASCENDING"}
      ]
    }
  ]
}
```

This schema provides a flexible foundation for a multi-tenant financial operations portal with support for project management, customer relationship management, financial tracking, and tax reporting capabilities.