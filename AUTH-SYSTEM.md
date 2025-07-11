# Solar Ops Orchestrator AI - Authentication System

## Overview

The Solar Ops Orchestrator AI platform implements a comprehensive authentication and authorization system using Firebase Authentication and custom role-based access control (RBAC). This document outlines the architecture, implementation details, and best practices for the authentication system.

## Authentication Architecture

### Components

1. **Firebase Authentication**: Provides the core authentication functionality, including:
   - Email/password authentication
   - Google OAuth authentication
   - Password reset and email verification
   - Token generation and validation

2. **Firestore User Profiles**: Stores extended user information and role assignments:
   - User profile data
   - Role assignments
   - Company affiliations
   - Permission sets

3. **Custom Claims**: Firebase Authentication custom claims are used to store:
   - User role (systemAdmin, companyAdmin, projectManager, salesRep, technician, customer)
   - Company ID
   - Permission flags

4. **Role-Based Access Control (RBAC)**: Implements access control based on:
   - User roles
   - Specific permissions
   - Resource ownership
   - Company membership

5. **Security Rules**: Firestore and Storage security rules enforce access control at the database level.

## User Roles and Permissions

### Roles

1. **System Administrator**
   - Full access to all system features and data
   - Can manage companies, users, and system settings
   - Can access and modify any resource

2. **Company Administrator**
   - Full access to their company's data
   - Can manage users within their company
   - Can configure company settings and integrations

3. **Project Manager**
   - Can create and manage projects
   - Can assign tasks to team members
   - Can access all project-related data
   - Can generate reports and analytics

4. **Sales Representative**
   - Can manage leads and opportunities
   - Can create proposals and contracts
   - Can access customer information
   - Limited access to project details

5. **Technician**
   - Can view assigned tasks and projects
   - Can update task status and add notes
   - Can access system installation and maintenance data
   - Limited access to customer information

6. **Customer**
   - Can view their own projects and systems
   - Can access performance data for their systems
   - Can submit service requests
   - Limited access to project timeline and documents

### Permissions

Permissions are granular access controls that can be assigned to users independently of their roles. Key permission categories include:

1. **User Management**
   - `createUsers`: Can create new user accounts
   - `viewUsers`: Can view user profiles
   - `updateUsers`: Can update user information
   - `deleteUsers`: Can delete user accounts

2. **Company Management**
   - `viewCompany`: Can view company information
   - `updateCompany`: Can update company settings
   - `manageIntegrations`: Can configure external integrations

3. **Project Management**
   - `createProjects`: Can create new projects
   - `viewProjects`: Can view project details
   - `updateProjects`: Can update project information
   - `deleteProjects`: Can delete projects
   - `assignTasks`: Can assign tasks to users

4. **Lead Management**
   - `createLeads`: Can create new leads
   - `viewLeads`: Can view lead information
   - `updateLeads`: Can update lead details
   - `deleteLeads`: Can delete leads
   - `convertLeads`: Can convert leads to projects

5. **System Management**
   - `viewSystems`: Can view solar system details
   - `updateSystems`: Can update system information
   - `manageSystemData`: Can manage system performance data

6. **Financial Management**
   - `viewFinancials`: Can view financial information
   - `createInvoices`: Can create invoices
   - `processPayments`: Can process payments

7. **AI Insights**
   - `viewAIInsights`: Can view AI-generated insights
   - `createAIInsights`: Can generate new insights
   - `updateAIInsights`: Can update insight status

## Implementation Details

### User Authentication Flow

1. **Registration**
   - User registers with email/password or Google OAuth
   - Firebase Authentication creates the user account
   - Cloud Function creates the user profile in Firestore
   - Default role and permissions are assigned

2. **Login**
   - User logs in with credentials
   - Firebase Authentication validates credentials
   - Custom claims are loaded into the authentication token
   - Application loads user profile and permissions

3. **Session Management**
   - Firebase handles token refresh automatically
   - Token expiration is set to 1 hour
   - Refresh tokens are valid for 2 weeks
   - Session persistence can be configured by the user

4. **Password Reset**
   - User requests password reset
   - Firebase sends password reset email
   - User sets new password
   - Password history prevents reuse of recent passwords

### Custom Claims Management

Custom claims are used to store essential user information in the authentication token:

```javascript
{
  "role": "companyAdmin",
  "companyId": "company123",
  "permissions": ["viewUsers", "updateUsers", "manageIntegrations"]
}
```

Custom claims are managed through Firebase Admin SDK:

```javascript
// Set custom claims for a user
admin.auth().setCustomUserClaims(uid, {
  role: 'companyAdmin',
  companyId: 'company123',
  permissions: ['viewUsers', 'updateUsers', 'manageIntegrations']
});
```

### Role and Permission Verification

Role and permission checks are implemented in both client and server code:

**Client-side checks:**

```typescript
// Check if user has a specific role
const hasRole = (role: string): boolean => {
  const user = auth.currentUser;
  if (!user) return false;
  
  const token = await user.getIdTokenResult();
  return token.claims.role === role;
};

// Check if user has a specific permission
const hasPermission = (permission: string): boolean => {
  const user = auth.currentUser;
  if (!user) return false;
  
  const token = await user.getIdTokenResult();
  return token.claims.permissions?.includes(permission) || false;
};
```

**Server-side checks (Cloud Functions):**

```typescript
// Verify role in a Cloud Function
const verifyRole = (context: CallableContext, role: string): boolean => {
  if (!context.auth) return false;
  return context.auth.token.role === role;
};

// Verify permission in a Cloud Function
const verifyPermission = (context: CallableContext, permission: string): boolean => {
  if (!context.auth) return false;
  return context.auth.token.permissions?.includes(permission) || false;
};
```

### Security Rules

Firestore and Storage security rules enforce access control at the database level:

**Firestore Security Rules:**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function hasRole(role) {
      return isAuthenticated() && request.auth.token.role == role;
    }
    
    function hasPermission(permission) {
      return isAuthenticated() && permission in request.auth.token.permissions;
    }
    
    function isCompanyMember(companyId) {
      return isAuthenticated() && request.auth.token.companyId == companyId;
    }
    
    // Company collection
    match /companies/{companyId} {
      allow read: if isAuthenticated() && (hasRole('systemAdmin') || isCompanyMember(companyId));
      allow write: if isAuthenticated() && (hasRole('systemAdmin') || (hasRole('companyAdmin') && isCompanyMember(companyId)));
      
      // Users subcollection
      match /users/{userId} {
        allow read: if isAuthenticated() && (hasRole('systemAdmin') || (isCompanyMember(companyId) && (hasRole('companyAdmin') || request.auth.uid == userId)));
        allow write: if isAuthenticated() && (hasRole('systemAdmin') || (hasRole('companyAdmin') && isCompanyMember(companyId)));
      }
      
      // Projects subcollection
      match /projects/{projectId} {
        allow read: if isAuthenticated() && (hasRole('systemAdmin') || (isCompanyMember(companyId) && (hasRole('companyAdmin') || hasRole('projectManager') || resource.data.assignedTo == request.auth.uid)));
        allow write: if isAuthenticated() && (hasRole('systemAdmin') || (isCompanyMember(companyId) && (hasRole('companyAdmin') || hasRole('projectManager'))));
      }
    }
  }
}
```

**Storage Security Rules:**

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function hasRole(role) {
      return isAuthenticated() && request.auth.token.role == role;
    }
    
    // Company files
    match /companies/{companyId}/{allPaths=**} {
      allow read: if isAuthenticated() && (hasRole('systemAdmin') || request.auth.token.companyId == companyId);
      allow write: if isAuthenticated() && (hasRole('systemAdmin') || (request.auth.token.companyId == companyId && hasRole('companyAdmin')));
    }
    
    // User files
    match /users/{userId}/{allPaths=**} {
      allow read: if isAuthenticated() && (hasRole('systemAdmin') || request.auth.uid == userId);
      allow write: if isAuthenticated() && (hasRole('systemAdmin') || request.auth.uid == userId);
    }
  }
}
```

## Multi-tenancy Implementation

The system implements multi-tenancy through company isolation:

1. **Company Data Isolation**
   - Each company has its own document in the `companies` collection
   - Company-specific data is stored in subcollections under the company document
   - Cross-company access is prevented by security rules

2. **User-Company Association**
   - Users are associated with a company through the `companyId` custom claim
   - Company membership is verified in security rules and application code
   - Users can only access data from their own company

3. **System Administrator Access**
   - System administrators can access data across all companies
   - Special security rule exceptions allow system administrators to bypass company isolation

## Best Practices and Security Considerations

1. **Token Validation**
   - Always validate authentication tokens on the server side
   - Use Firebase Admin SDK for token verification in Cloud Functions
   - Implement proper error handling for authentication failures

2. **Least Privilege Principle**
   - Assign the minimum necessary permissions to each role
   - Use custom permissions for fine-grained access control
   - Regularly review and audit role assignments

3. **Security Rules Testing**
   - Thoroughly test security rules with the Firebase Emulator Suite
   - Create test cases for both allowed and denied access patterns
   - Verify rule behavior with different user roles and permissions

4. **Authentication Monitoring**
   - Monitor authentication events with Firebase Authentication logs
   - Set up alerts for suspicious activities
   - Implement rate limiting for authentication attempts

5. **Regular Security Audits**
   - Conduct regular security audits of the authentication system
   - Review role and permission assignments
   - Update security rules as application requirements change

6. **Secure Token Handling**
   - Never store authentication tokens in local storage
   - Use secure HTTP-only cookies for token storage when possible
   - Implement proper token refresh mechanisms

7. **User Session Management**
   - Provide users with the ability to view and manage active sessions
   - Implement session timeout for inactive users
   - Allow users to revoke sessions on other devices

## Integration with MCP Architecture

The authentication system integrates with the Model Context Protocol (MCP) architecture:

1. **Authentication Token Propagation**
   - Authentication tokens are included in MCP server requests
   - MCP servers validate tokens before processing requests
   - User identity and permissions are preserved across system boundaries

2. **Cross-Service Authorization**
   - MCP servers enforce consistent authorization rules
   - Permission checks are performed at both the application and MCP server levels
   - External system credentials are securely managed by MCP servers

3. **Secure External API Access**
   - MCP servers handle authentication with external APIs
   - API keys and credentials are stored securely
   - User permissions determine access to external system capabilities
