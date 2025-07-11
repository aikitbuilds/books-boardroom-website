# User Management System

## Overview

The BooksBoardroom platform implements a comprehensive user management system with role-based access control (RBAC) following industry standards. This system provides secure, scalable user and account management with proper multi-tenant architecture.

## Architecture

### Core Components

1. **User Management Types** (`src/types/userManagement.ts`)
   - Defines user roles, permissions, and interfaces
   - Implements role hierarchy and permission checking
   - Provides helper functions for access control

2. **User Management Service** (`src/services/userManagementService.ts`)
   - Handles all user and account operations
   - Integrates with Firebase Authentication and Firestore
   - Implements security best practices

3. **User Management Hook** (`src/hooks/useUserManagement.ts`)
   - Provides state management for user operations
   - Implements permission checking and access control
   - Manages loading states and error handling

4. **User Management Dashboard** (`src/components/UserManagementDashboard.tsx`)
   - Comprehensive UI for managing users and accounts
   - Role-based interface with proper access controls
   - Real-time data management with filtering and search

5. **User Management Page** (`src/pages/UserManagement.tsx`)
   - Main page for user management operations
   - Access control and security validation
   - Educational content about roles and permissions

## User Roles and Permissions

### Role Hierarchy

1. **Super Admin** (Highest Level)
   - Full system access
   - Can manage all accounts and users
   - Can delete accounts and users
   - Access to system settings and logs
   - All permissions granted

2. **Admin**
   - Account-level management
   - Can manage users within their account
   - Can modify account settings
   - Cannot delete accounts
   - Limited to account-scoped operations

3. **Manager**
   - Team management capabilities
   - Can view users and manage content
   - Cannot manage user roles
   - Limited to content and project management

4. **User**
   - Basic access to platform features
   - Can create content and view reports
   - Cannot manage other users
   - Standard user permissions

5. **Viewer** (Lowest Level)
   - Read-only access
   - Can view content and reports
   - Cannot create or modify data
   - Minimal permissions

### Permission System

The system implements granular permissions across different areas:

#### User Management Permissions
- `users.view` - View user profiles
- `users.create` - Create new users
- `users.update` - Update user information
- `users.delete` - Delete users
- `users.manageRoles` - Change user roles
- `users.managePermissions` - Modify user permissions

#### Account Management Permissions
- `accounts.view` - View account information
- `accounts.create` - Create new accounts
- `accounts.update` - Update account settings
- `accounts.delete` - Delete accounts
- `accounts.suspend` - Suspend accounts
- `accounts.activate` - Activate accounts

#### Content Management Permissions
- `content.view` - View content
- `content.create` - Create content
- `content.update` - Update content
- `content.delete` - Delete content
- `content.publish` - Publish content
- `content.approve` - Approve content

#### Financial Management Permissions
- `financial.view` - View financial data
- `financial.create` - Create financial records
- `financial.update` - Update financial data
- `financial.delete` - Delete financial records
- `financial.reports` - Generate financial reports
- `financial.export` - Export financial data

#### System Management Permissions
- `system.settings` - Access system settings
- `system.logs` - View system logs
- `system.backup` - Perform system backups
- `system.restore` - Restore system data
- `system.integrations` - Manage integrations
- `system.security` - Access security settings

#### Demo Data Management Permissions
- `demo.create` - Create demo data
- `demo.clear` - Clear demo data
- `demo.manage` - Manage demo data settings

#### Analytics and Reports Permissions
- `analytics.view` - View analytics
- `analytics.create` - Create analytics reports
- `analytics.export` - Export analytics data
- `reports.view` - View reports
- `reports.create` - Create reports
- `reports.schedule` - Schedule reports

## Security Features

### Authentication
- **Firebase Authentication**: Email/password and Google OAuth
- **Email Verification**: Required for all new accounts
- **Password Reset**: Secure password reset functionality
- **Session Management**: Automatic token refresh
- **Multi-factor Authentication**: Ready for future implementation

### Authorization
- **Role-Based Access Control (RBAC)**: Hierarchical role system
- **Permission-Based Access**: Granular permission checking
- **Multi-Tenant Isolation**: Account-level data separation
- **Firestore Security Rules**: Database-level access control
- **Storage Security**: File-level access controls

### Data Protection
- **Encryption**: Data encrypted in transit and at rest
- **Audit Logging**: All user actions logged
- **Data Isolation**: Cross-account access prevention
- **Secure APIs**: All endpoints protected by authentication
- **Input Validation**: Comprehensive input sanitization

## Account Management

### Account Types
1. **Free** - Basic features, limited users
2. **Basic** - Standard features, 5 users
3. **Premium** - Advanced features, 25 users
4. **Enterprise** - Full features, 100 users

### Account Features
- **Demo Data**: Create and manage sample data
- **Advanced Analytics**: Premium and Enterprise only
- **Custom Branding**: Enterprise only
- **API Access**: Enterprise only
- **Storage Limits**: Based on plan tier

### Account Settings
- **User Limits**: Maximum number of users per plan
- **Project Limits**: Maximum number of projects
- **Storage Limits**: Maximum file storage (MB)
- **Feature Toggles**: Enable/disable features per plan

## User Management Features

### User Operations
- **Create Users**: Add new users with role assignment
- **Update Users**: Modify user information and permissions
- **Delete Users**: Remove users from the system
- **Suspend Users**: Temporarily disable user accounts
- **Activate Users**: Re-enable suspended accounts
- **Reset Passwords**: Send password reset emails

### User Profiles
- **Personal Information**: Name, email, phone
- **Role Assignment**: Assign appropriate roles
- **Permission Management**: Granular permission control
- **Account Association**: Link users to accounts
- **Preferences**: User-specific settings
- **Metadata**: Additional user information

### Account Operations
- **Create Accounts**: Set up new accounts with admin users
- **Update Accounts**: Modify account settings and plans
- **Delete Accounts**: Remove accounts and all associated data
- **Suspend Accounts**: Temporarily disable accounts
- **Activate Accounts**: Re-enable suspended accounts

## Implementation Details

### Database Schema

#### Users Collection
```typescript
interface UserProfile {
  uid: string;                    // Firebase Auth UID
  email: string;                  // User email
  firstName: string;              // First name
  lastName: string;               // Last name
  displayName?: string;           // Display name
  photoURL?: string;              // Profile photo
  phoneNumber?: string;           // Phone number
  role: UserRole;                 // User role
  permissions: Permission[];      // Array of permissions
  accountId?: string;             // Associated account
  isActive: boolean;              // Account status
  isEmailVerified: boolean;       // Email verification
  lastLogin?: string;             // Last login timestamp
  createdAt: string;              // Creation timestamp
  updatedAt: string;              // Update timestamp
  preferences?: UserPreferences;  // User preferences
  metadata?: UserMetadata;        // Additional data
}
```

#### Accounts Collection
```typescript
interface Account {
  id: string;                     // Account ID
  name: string;                   // Account name
  domain?: string;                // Custom domain
  type: AccountType;              // Account type
  status: AccountStatus;          // Account status
  plan: AccountPlan;              // Subscription plan
  adminId: string;                // Admin user UID
  users: string[];                // User UIDs
  settings: AccountSettings;      // Account settings
  createdAt: string;              // Creation timestamp
  updatedAt: string;              // Update timestamp
  trialEndsAt?: string;          // Trial end date
  subscriptionEndsAt?: string;    // Subscription end date
}
```

### Security Rules

The Firestore security rules implement comprehensive access control:

```javascript
// Helper functions for role and permission checking
function hasRole(role) {
  return isAuthenticated() && 
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
}

function hasPermission(permission) {
  return isAuthenticated() && 
    permission in get(/databases/$(database)/documents/users/$(request.auth.uid)).data.permissions;
}

// User management rules
match /users/{userId} {
  allow read: if isAuthenticated() && (
    isSuperAdmin() ||
    isOwner(userId) ||
    (isAdmin() && isAccountMember(resource.data.accountId))
  );
  allow create: if isAuthenticated() && (
    isSuperAdmin() ||
    isOwner(userId)
  );
  allow update: if isAuthenticated() && (
    isSuperAdmin() ||
    isOwner(userId) ||
    (isAdmin() && isAccountMember(resource.data.accountId))
  );
  allow delete: if isAuthenticated() && (
    isSuperAdmin() ||
    (isAdmin() && isAccountMember(resource.data.accountId))
  );
}
```

## Usage Guide

### For Super Admins

1. **Access User Management**
   - Navigate to `/user-management`
   - Use the profile menu to access user management

2. **Create Accounts**
   - Click "Add Account" button
   - Fill in account details and admin information
   - Account will be created with admin user

3. **Manage Users**
   - View all users across all accounts
   - Create, update, delete users
   - Assign roles and permissions
   - Suspend/activate users

4. **System Administration**
   - Monitor system health
   - Manage system settings
   - View audit logs
   - Perform system maintenance

### For Admins

1. **Account Management**
   - View and update account settings
   - Manage users within your account
   - Monitor account usage

2. **User Management**
   - Create users for your account
   - Assign appropriate roles
   - Manage user permissions
   - Reset user passwords

3. **Content Management**
   - Manage account content
   - Approve user content
   - Monitor content quality

### For Users

1. **Profile Management**
   - Update personal information
   - Change preferences
   - Manage notifications

2. **Content Creation**
   - Create and manage content
   - Upload files
   - Generate reports

3. **Data Access**
   - View analytics
   - Access reports
   - Manage personal data

## Best Practices

### Security
- Always verify permissions before operations
- Use principle of least privilege
- Implement proper input validation
- Log all administrative actions
- Regular security audits

### User Experience
- Clear role descriptions
- Intuitive permission management
- Helpful error messages
- Responsive design
- Accessibility compliance

### Performance
- Efficient database queries
- Proper indexing
- Caching strategies
- Lazy loading
- Optimized rendering

### Scalability
- Multi-tenant architecture
- Horizontal scaling support
- Efficient data partitioning
- Resource optimization
- Monitoring and alerting

## Troubleshooting

### Common Issues

1. **Permission Denied**
   - Check user role and permissions
   - Verify account membership
   - Review security rules

2. **User Creation Failed**
   - Check email format
   - Verify Firebase configuration
   - Review error logs

3. **Account Access Issues**
   - Verify account status
   - Check user account association
   - Review account settings

### Debug Tools

1. **Firebase Console**
   - Authentication logs
   - Firestore rules testing
   - Performance monitoring

2. **Application Logs**
   - User action logging
   - Error tracking
   - Performance metrics

3. **Security Monitoring**
   - Access pattern analysis
   - Suspicious activity detection
   - Audit trail review

## Future Enhancements

### Planned Features
- Multi-factor authentication
- Advanced audit logging
- Bulk user operations
- Advanced analytics
- API rate limiting
- Custom role creation
- Advanced permission system
- Integration with external identity providers

### Technical Improvements
- Enhanced caching
- Real-time updates
- Advanced search
- Export capabilities
- Mobile optimization
- Offline support
- Advanced reporting
- Performance optimization

## Support

For technical support or questions about the user management system:

1. **Documentation**: Review this guide and related documentation
2. **Logs**: Check application and Firebase logs
3. **Testing**: Use Firebase console for rule testing
4. **Development**: Review source code and comments
5. **Community**: Check for similar issues in Firebase community

---

*This user management system provides enterprise-grade security and scalability while maintaining ease of use and comprehensive functionality.* 