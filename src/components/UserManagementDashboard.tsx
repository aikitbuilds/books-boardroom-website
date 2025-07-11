import React, { useState, useEffect } from 'react';
import { useFirebase } from '@/hooks/useFirebase';
import { userManagementService } from '@/services/userManagementService';
import { 
  UserProfile, 
  Account, 
  UserRole, 
  Permission,
  CreateUserData,
  CreateAccountData,
  canManageUser,
  canManageAccount,
  hasPermission,
  ROLE_PERMISSIONS
} from '@/types/userManagement';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Users, 
  Building, 
  Plus, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX, 
  Shield, 
  Settings,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  Mail,
  Key,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface UserManagementDashboardProps {
  className?: string;
}

export const UserManagementDashboard: React.FC<UserManagementDashboardProps> = ({ className }) => {
  const { state } = useFirebase();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [showCreateAccountDialog, setShowCreateAccountDialog] = useState(false);
  const [showUserDetailsDialog, setShowUserDetailsDialog] = useState(false);
  const [showAccountDetailsDialog, setShowAccountDetailsDialog] = useState(false);
  const [filters, setFilters] = useState({
    role: '' as UserRole | '',
    status: '' as 'active' | 'inactive' | '',
    searchTerm: ''
  });

  // Check if current user has super admin privileges
  const isSuperAdmin = state.userProfile?.role === 'superAdmin';
  const isAdmin = state.userProfile?.role === 'admin';
  const canManageUsers = hasPermission(state.userProfile?.permissions || [], 'users.view');
  const canCreateUsers = hasPermission(state.userProfile?.permissions || [], 'users.create');
  const canDeleteUsers = hasPermission(state.userProfile?.permissions || [], 'users.delete');
  const canManageAccounts = hasPermission(state.userProfile?.permissions || [], 'accounts.view');

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersData, accountsData] = await Promise.all([
        userManagementService.loadUsers(filters),
        userManagementService.loadAccounts()
      ]);
      
      setUsers(usersData);
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (data: CreateUserData) => {
    const success = await userManagementService.createUser(data);
    if (success) {
      setShowCreateUserDialog(false);
      loadData();
    }
  };

  const handleCreateAccount = async (data: CreateAccountData) => {
    const success = await userManagementService.createAccount(data);
    if (success) {
      setShowCreateAccountDialog(false);
      loadData();
    }
  };

  const handleDeleteUser = async (user: UserProfile) => {
    if (!confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      return;
    }

    const success = await userManagementService.deleteUser(user.uid);
    if (success) {
      loadData();
    }
  };

  const handleDeleteAccount = async (account: Account) => {
    if (!confirm(`Are you sure you want to delete account "${account.name}"? This will delete all associated users.`)) {
      return;
    }

    const success = await userManagementService.deleteAccount(account.id);
    if (success) {
      loadData();
    }
  };

  const handleSuspendUser = async (user: UserProfile) => {
    const success = await userManagementService.suspendUser(user.uid);
    if (success) {
      loadData();
    }
  };

  const handleActivateUser = async (user: UserProfile) => {
    const success = await userManagementService.activateUser(user.uid);
    if (success) {
      loadData();
    }
  };

  const handleResetPassword = async (user: UserProfile) => {
    const success = await userManagementService.resetUserPassword(user.uid);
    if (success) {
      toast.success('Password reset email sent');
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    const colors = {
      superAdmin: 'bg-red-100 text-red-800',
      admin: 'bg-purple-100 text-purple-800',
      manager: 'bg-blue-100 text-blue-800',
      user: 'bg-green-100 text-green-800',
      viewer: 'bg-gray-100 text-gray-800'
    };
    return colors[role];
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getAccountStatusBadgeColor = (status: Account['status']) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status];
  };

  if (!canManageUsers && !canManageAccounts) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Access Denied
          </CardTitle>
          <CardDescription>
            You don't have permission to access user management features.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage users and accounts across the platform
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={loadData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {canCreateUsers && (
                <Button onClick={() => setShowCreateUserDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              )}
              {isSuperAdmin && (
                <Button onClick={() => setShowCreateAccountDialog(true)}>
                  <Building className="h-4 w-4 mr-2" />
                  Add Account
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
              {isSuperAdmin && (
                <TabsTrigger value="accounts">Accounts ({accounts.length})</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search users..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className="max-w-sm"
                  />
                </div>
                <Select value={filters.role} onValueChange={(value) => setFilters(prev => ({ ...prev, role: value as UserRole }))}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Roles</SelectItem>
                    <SelectItem value="superAdmin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as 'active' | 'inactive' }))}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.uid}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              {user.photoURL ? (
                                <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full" />
                              ) : (
                                <span className="text-sm font-medium">
                                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{user.firstName} {user.lastName}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(user.isActive)}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.accountId ? (
                            <span className="text-sm">{user.accountId}</span>
                          ) : (
                            <span className="text-sm text-gray-400">No account</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-500">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserDetailsDialog(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {canManageUser(state.userProfile!, user) && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleResetPassword(user)}
                                >
                                  <Key className="h-4 w-4" />
                                </Button>
                                {user.isActive ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSuspendUser(user)}
                                  >
                                    <UserX className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleActivateUser(user)}
                                  >
                                    <UserCheck className="h-4 w-4" />
                                  </Button>
                                )}
                                {canDeleteUsers && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteUser(user)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {isSuperAdmin && (
              <TabsContent value="accounts" className="space-y-4">
                {/* Accounts Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{account.name}</div>
                              {account.domain && (
                                <div className="text-sm text-gray-500">{account.domain}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{account.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{account.plan}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getAccountStatusBadgeColor(account.status)}>
                              {account.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{account.users.length} users</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-500">
                              {new Date(account.createdAt).toLocaleDateString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedAccount(account);
                                  setShowAccountDetailsDialog(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAccount(account)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <CreateUserDialog
        open={showCreateUserDialog}
        onOpenChange={setShowCreateUserDialog}
        onCreateUser={handleCreateUser}
        accounts={accounts}
      />

      {/* Create Account Dialog */}
      <CreateAccountDialog
        open={showCreateAccountDialog}
        onOpenChange={setShowCreateAccountDialog}
        onCreateAccount={handleCreateAccount}
      />

      {/* User Details Dialog */}
      <UserDetailsDialog
        open={showUserDetailsDialog}
        onOpenChange={setShowUserDetailsDialog}
        user={selectedUser}
        onUpdateUser={loadData}
      />

      {/* Account Details Dialog */}
      <AccountDetailsDialog
        open={showAccountDetailsDialog}
        onOpenChange={setShowAccountDetailsDialog}
        account={selectedAccount}
        onUpdateAccount={loadData}
      />
    </div>
  );
};

// Create User Dialog Component
interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateUser: (data: CreateUserData) => Promise<void>;
  accounts: Account[];
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({ open, onOpenChange, onCreateUser, accounts }) => {
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'user',
    permissions: ROLE_PERMISSIONS['user'],
    accountId: '',
    sendInvitation: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateUser(formData);
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      role: 'user',
      permissions: ROLE_PERMISSIONS['user'],
      accountId: '',
      sendInvitation: true
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the platform. They will receive an invitation email.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Role</label>
            <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ 
              ...prev, 
              role: value as UserRole,
              permissions: ROLE_PERMISSIONS[value as UserRole]
            }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Account (Optional)</label>
            <Select value={formData.accountId} onValueChange={(value) => setFormData(prev => ({ ...prev, accountId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No account</SelectItem>
                {accounts.map(account => (
                  <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sendInvitation"
              checked={formData.sendInvitation}
              onChange={(e) => setFormData(prev => ({ ...prev, sendInvitation: e.target.checked }))}
            />
            <label htmlFor="sendInvitation" className="text-sm">Send invitation email</label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create User</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Create Account Dialog Component
interface CreateAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAccount: (data: CreateAccountData) => Promise<void>;
}

const CreateAccountDialog: React.FC<CreateAccountDialogProps> = ({ open, onOpenChange, onCreateAccount }) => {
  const [formData, setFormData] = useState<CreateAccountData>({
    name: '',
    domain: '',
    type: 'business',
    plan: 'basic',
    adminEmail: '',
    adminFirstName: '',
    adminLastName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateAccount(formData);
    setFormData({
      name: '',
      domain: '',
      type: 'business',
      plan: 'basic',
      adminEmail: '',
      adminFirstName: '',
      adminLastName: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Account</DialogTitle>
          <DialogDescription>
            Create a new account with an admin user. The admin will receive an invitation email.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Account Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Domain (Optional)</label>
            <Input
              value={formData.domain}
              onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
              placeholder="example.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Plan</label>
              <Select value={formData.plan} onValueChange={(value) => setFormData(prev => ({ ...prev, plan: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Admin User</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <Input
                  value={formData.adminFirstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, adminFirstName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  value={formData.adminLastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, adminLastName: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="mt-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.adminEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, adminEmail: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Account</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// User Details Dialog Component
interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfile | null;
  onUpdateUser: () => void;
}

const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({ open, onOpenChange, user, onUpdateUser }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View and manage user information
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <p className="text-sm">{user.firstName} {user.lastName}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <Badge className="mt-1">{user.role}</Badge>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Badge className={`mt-1 ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium">Created</label>
              <p className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Last Login</label>
              <p className="text-sm">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Permissions</label>
            <div className="mt-1 flex flex-wrap gap-1">
              {user.permissions.map(permission => (
                <Badge key={permission} variant="outline" className="text-xs">
                  {permission}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Account Details Dialog Component
interface AccountDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account | null;
  onUpdateAccount: () => void;
}

const AccountDetailsDialog: React.FC<AccountDetailsDialogProps> = ({ open, onOpenChange, account, onUpdateAccount }) => {
  if (!account) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Account Details</DialogTitle>
          <DialogDescription>
            View account information and settings
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <p className="text-sm">{account.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Domain</label>
              <p className="text-sm">{account.domain || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <Badge className="mt-1">{account.type}</Badge>
            </div>
            <div>
              <label className="text-sm font-medium">Plan</label>
              <Badge className="mt-1">{account.plan}</Badge>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Badge className={`mt-1 ${getAccountStatusBadgeColor(account.status)}`}>
                {account.status}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium">Users</label>
              <p className="text-sm">{account.users.length} users</p>
            </div>
            <div>
              <label className="text-sm font-medium">Created</label>
              <p className="text-sm">{new Date(account.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Trial Ends</label>
              <p className="text-sm">{account.trialEndsAt ? new Date(account.trialEndsAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Features</label>
            <div className="mt-1 space-y-1">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={account.settings.features.demoData} disabled />
                <span className="text-sm">Demo Data</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={account.settings.features.advancedAnalytics} disabled />
                <span className="text-sm">Advanced Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={account.settings.features.customBranding} disabled />
                <span className="text-sm">Custom Branding</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={account.settings.features.apiAccess} disabled />
                <span className="text-sm">API Access</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 