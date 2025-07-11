// User Management Types and Interfaces

export type UserRole = 'superAdmin' | 'admin' | 'manager' | 'user' | 'viewer';

export type Permission = 
  // User Management
  | 'users.view' | 'users.create' | 'users.update' | 'users.delete'
  | 'users.manageRoles' | 'users.managePermissions'
  
  // Account Management
  | 'accounts.view' | 'accounts.create' | 'accounts.update' | 'accounts.delete'
  | 'accounts.suspend' | 'accounts.activate'
  
  // Content Management
  | 'content.view' | 'content.create' | 'content.update' | 'content.delete'
  | 'content.publish' | 'content.approve'
  
  // Financial Management
  | 'financial.view' | 'financial.create' | 'financial.update' | 'financial.delete'
  | 'financial.reports' | 'financial.export'
  
  // System Management
  | 'system.settings' | 'system.logs' | 'system.backup' | 'system.restore'
  | 'system.integrations' | 'system.security'
  
  // Demo Data Management
  | 'demo.create' | 'demo.clear' | 'demo.manage'
  
  // Analytics and Reports
  | 'analytics.view' | 'analytics.create' | 'analytics.export'
  | 'reports.view' | 'reports.create' | 'reports.schedule';

export interface UserPermissions {
  [key: string]: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  role: UserRole;
  permissions: Permission[];
  accountId?: string; // For admin users, the account they manage
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  preferences?: {
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    timezone: string;
    language: string;
  };
  metadata?: {
    department?: string;
    position?: string;
    managerId?: string;
    hireDate?: string;
    notes?: string;
  };
}

export interface Account {
  id: string;
  name: string;
  domain?: string;
  type: 'enterprise' | 'business' | 'startup' | 'individual';
  status: 'active' | 'suspended' | 'pending' | 'cancelled';
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  adminId: string; // UID of the admin user
  users: string[]; // Array of user UIDs
  settings: {
    features: {
      demoData: boolean;
      advancedAnalytics: boolean;
      customBranding: boolean;
      apiAccess: boolean;
    };
    limits: {
      maxUsers: number;
      maxProjects: number;
      maxStorage: number; // in MB
    };
  };
  createdAt: string;
  updatedAt: string;
  trialEndsAt?: string;
  subscriptionEndsAt?: string;
}

export interface UserManagementState {
  users: UserProfile[];
  accounts: Account[];
  isLoading: boolean;
  error: string | null;
  selectedUser: UserProfile | null;
  selectedAccount: Account | null;
  filters: {
    role?: UserRole;
    status?: 'active' | 'inactive';
    accountId?: string;
    searchTerm?: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: Permission[];
  accountId?: string;
  phoneNumber?: string;
  sendInvitation?: boolean;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  permissions?: Permission[];
  isActive?: boolean;
  preferences?: UserProfile['preferences'];
  metadata?: UserProfile['metadata'];
}

export interface CreateAccountData {
  name: string;
  domain?: string;
  type: Account['type'];
  plan: Account['plan'];
  adminEmail: string;
  adminFirstName: string;
  adminLastName: string;
}

export interface UpdateAccountData {
  name?: string;
  domain?: string;
  status?: Account['status'];
  plan?: Account['plan'];
  settings?: Account['settings'];
}

export interface UserManagementActions {
  // User Management
  createUser: (data: CreateUserData) => Promise<boolean>;
  updateUser: (uid: string, data: UpdateUserData) => Promise<boolean>;
  deleteUser: (uid: string) => Promise<boolean>;
  suspendUser: (uid: string) => Promise<boolean>;
  activateUser: (uid: string) => Promise<boolean>;
  resetUserPassword: (uid: string) => Promise<boolean>;
  
  // Account Management
  createAccount: (data: CreateAccountData) => Promise<boolean>;
  updateAccount: (accountId: string, data: UpdateAccountData) => Promise<boolean>;
  deleteAccount: (accountId: string) => Promise<boolean>;
  suspendAccount: (accountId: string) => Promise<boolean>;
  activateAccount: (accountId: string) => Promise<boolean>;
  
  // Role and Permission Management
  updateUserRole: (uid: string, role: UserRole) => Promise<boolean>;
  updateUserPermissions: (uid: string, permissions: Permission[]) => Promise<boolean>;
  
  // Data Management
  loadUsers: (filters?: UserManagementState['filters']) => Promise<void>;
  loadAccounts: () => Promise<void>;
  clearDemoData: (accountId: string) => Promise<boolean>;
  createDemoData: (accountId: string) => Promise<boolean>;
}

// Role-based permission mappings
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  superAdmin: [
    // Full system access
    'users.view', 'users.create', 'users.update', 'users.delete', 'users.manageRoles', 'users.managePermissions',
    'accounts.view', 'accounts.create', 'accounts.update', 'accounts.delete', 'accounts.suspend', 'accounts.activate',
    'content.view', 'content.create', 'content.update', 'content.delete', 'content.publish', 'content.approve',
    'financial.view', 'financial.create', 'financial.update', 'financial.delete', 'financial.reports', 'financial.export',
    'system.settings', 'system.logs', 'system.backup', 'system.restore', 'system.integrations', 'system.security',
    'demo.create', 'demo.clear', 'demo.manage',
    'analytics.view', 'analytics.create', 'analytics.export',
    'reports.view', 'reports.create', 'reports.schedule'
  ],
  admin: [
    // Account-level management
    'users.view', 'users.create', 'users.update', 'users.delete',
    'content.view', 'content.create', 'content.update', 'content.delete', 'content.publish',
    'financial.view', 'financial.create', 'financial.update', 'financial.reports',
    'demo.create', 'demo.clear', 'demo.manage',
    'analytics.view', 'analytics.create',
    'reports.view', 'reports.create'
  ],
  manager: [
    // Team management
    'users.view',
    'content.view', 'content.create', 'content.update',
    'financial.view', 'financial.create', 'financial.update',
    'demo.create', 'demo.clear',
    'analytics.view',
    'reports.view', 'reports.create'
  ],
  user: [
    // Basic user permissions
    'content.view', 'content.create',
    'financial.view',
    'analytics.view',
    'reports.view'
  ],
  viewer: [
    // Read-only access
    'content.view',
    'financial.view',
    'analytics.view',
    'reports.view'
  ]
};

// Helper functions for permission checking
export const hasPermission = (userPermissions: Permission[], permission: Permission): boolean => {
  return userPermissions.includes(permission);
};

export const hasRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  const roleHierarchy: Record<UserRole, number> = {
    superAdmin: 5,
    admin: 4,
    manager: 3,
    user: 2,
    viewer: 1
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

export const canManageUser = (currentUser: UserProfile, targetUser: UserProfile): boolean => {
  // Super admin can manage anyone
  if (currentUser.role === 'superAdmin') return true;
  
  // Admin can manage users in their account
  if (currentUser.role === 'admin' && currentUser.accountId === targetUser.accountId) return true;
  
  // Users can manage themselves
  if (currentUser.uid === targetUser.uid) return true;
  
  return false;
};

export const canManageAccount = (currentUser: UserProfile, accountId: string): boolean => {
  // Super admin can manage any account
  if (currentUser.role === 'superAdmin') return true;
  
  // Admin can manage their own account
  if (currentUser.role === 'admin' && currentUser.accountId === accountId) return true;
  
  return false;
}; 