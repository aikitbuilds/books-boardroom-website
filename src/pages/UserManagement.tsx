import React from 'react';
import { useFirebase } from '@/hooks/useFirebase';
import { UserManagementDashboard } from '@/components/UserManagementDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Building, AlertTriangle } from 'lucide-react';

const UserManagement: React.FC = () => {
  const { state } = useFirebase();

  // Check if user has access to user management
  const canAccessUserManagement = state.userProfile?.role === 'superAdmin' || 
                                 state.userProfile?.role === 'admin' ||
                                 state.userProfile?.permissions?.includes('users.view');

  if (!state.isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!state.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication Required
            </CardTitle>
            <CardDescription>
              Please sign in to access user management features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              You need to be logged in to view and manage users and accounts.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canAccessUserManagement) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You don't have permission to access user management.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                User management requires administrative privileges.
              </p>
              <div className="text-xs text-gray-500">
                <p>Your role: <span className="font-medium">{state.userProfile?.role || 'Unknown'}</span></p>
                <p>Your permissions: {state.userProfile?.permissions?.join(', ') || 'None'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">
          Manage users, accounts, and permissions across the platform.
        </p>
      </div>

      {/* User Management Dashboard */}
      <UserManagementDashboard />

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Across all accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Super admin users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Role Information */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Role Hierarchy</CardTitle>
            <CardDescription>
              Understanding user roles and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-red-600">Super Admin</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Full system access, can manage all accounts and users
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-purple-600">Admin</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Account-level management, can manage users within their account
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-blue-600">Manager</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Team management, can view users and manage content
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-green-600">User</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Basic access, can create content and view reports
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-600">Viewer</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Read-only access to content and reports
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Information */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Security Features</CardTitle>
            <CardDescription>
              Industry-standard security measures implemented
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Authentication</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Firebase Authentication with email/password</li>
                  <li>• Google OAuth integration</li>
                  <li>• Email verification required</li>
                  <li>• Password reset functionality</li>
                  <li>• Session management with token refresh</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Authorization</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Role-based access control (RBAC)</li>
                  <li>• Granular permission system</li>
                  <li>• Multi-tenant data isolation</li>
                  <li>• Firestore security rules</li>
                  <li>• Storage access controls</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement; 