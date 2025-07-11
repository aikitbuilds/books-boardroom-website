import { useState, useEffect, useCallback } from 'react';
import { useFirebase } from '@/hooks/useFirebase';
import { userManagementService } from '@/services/userManagementService';
import { 
  UserProfile, 
  Account, 
  UserRole, 
  Permission,
  CreateUserData,
  UpdateUserData,
  CreateAccountData,
  UpdateAccountData,
  UserManagementState,
  UserManagementActions,
  canManageUser,
  canManageAccount,
  hasPermission,
  ROLE_PERMISSIONS
} from '@/types/userManagement';

export function useUserManagement() {
  const { state } = useFirebase();
  const [userManagementState, setUserManagementState] = useState<UserManagementState>({
    users: [],
    accounts: [],
    isLoading: false,
    error: null,
    selectedUser: null,
    selectedAccount: null,
    filters: {
      role: undefined,
      status: undefined,
      accountId: undefined,
      searchTerm: ''
    },
    pagination: {
      page: 1,
      limit: 20,
      total: 0
    }
  });

  // Check permissions
  const canManageUsers = hasPermission(state.userProfile?.permissions || [], 'users.view');
  const canCreateUsers = hasPermission(state.userProfile?.permissions || [], 'users.create');
  const canUpdateUsers = hasPermission(state.userProfile?.permissions || [], 'users.update');
  const canDeleteUsers = hasPermission(state.userProfile?.permissions || [], 'users.delete');
  const canManageAccounts = hasPermission(state.userProfile?.permissions || [], 'accounts.view');
  const canCreateAccounts = hasPermission(state.userProfile?.permissions || [], 'accounts.create');
  const canDeleteAccounts = hasPermission(state.userProfile?.permissions || [], 'accounts.delete');
  const isSuperAdmin = state.userProfile?.role === 'superAdmin';
  const isAdmin = state.userProfile?.role === 'admin';

  // Load users
  const loadUsers = useCallback(async (filters?: UserManagementState['filters']) => {
    if (!canManageUsers) return;

    setUserManagementState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const users = await userManagementService.loadUsers(filters);
      setUserManagementState(prev => ({
        ...prev,
        users,
        isLoading: false,
        pagination: {
          ...prev.pagination,
          total: users.length
        }
      }));
    } catch (error) {
      setUserManagementState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load users'
      }));
    }
  }, [canManageUsers]);

  // Load accounts
  const loadAccounts = useCallback(async () => {
    if (!canManageAccounts) return;

    setUserManagementState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const accounts = await userManagementService.loadAccounts();
      setUserManagementState(prev => ({
        ...prev,
        accounts,
        isLoading: false
      }));
    } catch (error) {
      setUserManagementState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load accounts'
      }));
    }
  }, [canManageAccounts]);

  // Create user
  const createUser = useCallback(async (data: CreateUserData): Promise<boolean> => {
    if (!canCreateUsers) {
      setUserManagementState(prev => ({
        ...prev,
        error: 'You do not have permission to create users'
      }));
      return false;
    }

    setUserManagementState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await userManagementService.createUser(data);
      if (success) {
        await loadUsers(userManagementState.filters);
      }
      setUserManagementState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      setUserManagementState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create user'
      }));
      return false;
    }
  }, [canCreateUsers, loadUsers, userManagementState.filters]);

  // Update user
  const updateUser = useCallback(async (uid: string, data: UpdateUserData): Promise<boolean> => {
    if (!canUpdateUsers) {
      setUserManagementState(prev => ({
        ...prev,
        error: 'You do not have permission to update users'
      }));
      return false;
    }

    setUserManagementState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await userManagementService.updateUser(uid, data);
      if (success) {
        await loadUsers(userManagementState.filters);
      }
      setUserManagementState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      setUserManagementState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update user'
      }));
      return false;
    }
  }, [canUpdateUsers, loadUsers, userManagementState.filters]);

  // Delete user
  const deleteUser = useCallback(async (uid: string): Promise<boolean> => {
    if (!canDeleteUsers) {
      setUserManagementState(prev => ({
        ...prev,
        error: 'You do not have permission to delete users'
      }));
      return false;
    }

    setUserManagementState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await userManagementService.deleteUser(uid);
      if (success) {
        await loadUsers(userManagementState.filters);
      }
      setUserManagementState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      setUserManagementState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete user'
      }));
      return false;
    }
  }, [canDeleteUsers, loadUsers, userManagementState.filters]);

  // Suspend user
  const suspendUser = useCallback(async (uid: string): Promise<boolean> => {
    if (!canUpdateUsers) {
      setUserManagementState(prev => ({
        ...prev,
        error: 'You do not have permission to suspend users'
      }));
      return false;
    }

    setUserManagementState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await userManagementService.suspendUser(uid);
      if (success) {
        await loadUsers(userManagementState.filters);
      }
      setUserManagementState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      setUserManagementState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to suspend user'
      }));
      return false;
    }
  }, [canUpdateUsers, loadUsers, userManagementState.filters]);

  // Activate user
  const activateUser = useCallback(async (uid: string): Promise<boolean> => {
    if (!canUpdateUsers) {
      setUserManagementState(prev => ({
        ...prev,
        error: 'You do not have permission to activate users'
      }));
      return false;
    }

    setUserManagementState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await userManagementService.activateUser(uid);
      if (success) {
        await loadUsers(userManagementState.filters);
      }
      setUserManagementState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      setUserManagementState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to activate user'
      }));
      return false;
    }
  }, [canUpdateUsers, loadUsers, userManagementState.filters]);

  // Reset user password
  const resetUserPassword = useCallback(async (uid: string): Promise<boolean> => {
    if (!canUpdateUsers) {
      setUserManagementState(prev => ({
        ...prev,
        error: 'You do not have permission to reset passwords'
      }));
      return false;
    }

    setUserManagementState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await userManagementService.resetUserPassword(uid);
      setUserManagementState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      setUserManagementState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to reset password'
      }));
      return false;
    }
  }, [canUpdateUsers]);

  // Create account
  const createAccount = useCallback(async (data: CreateAccountData): Promise<boolean> => {
    if (!canCreateAccounts) {
      setUserManagementState(prev => ({
        ...prev,
        error: 'You do not have permission to create accounts'
      }));
      return false;
    }

    setUserManagementState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await userManagementService.createAccount(data);
      if (success) {
        await loadAccounts();
      }
      setUserManagementState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      setUserManagementState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create account'
      }));
      return false;
    }
  }, [canCreateAccounts, loadAccounts]);

  // Update account
  const updateAccount = useCallback(async (accountId: string, data: UpdateAccountData): Promise<boolean> => {
    if (!canManageAccounts) {
      setUserManagementState(prev => ({
        ...prev,
        error: 'You do not have permission to update accounts'
      }));
      return false;
    }

    setUserManagementState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await userManagementService.updateAccount(accountId, data);
      if (success) {
        await loadAccounts();
      }
      setUserManagementState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      setUserManagementState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update account'
      }));
      return false;
    }
  }, [canManageAccounts, loadAccounts]);

  // Delete account
  const deleteAccount = useCallback(async (accountId: string): Promise<boolean> => {
    if (!canDeleteAccounts) {
      setUserManagementState(prev => ({
        ...prev,
        error: 'You do not have permission to delete accounts'
      }));
      return false;
    }

    setUserManagementState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await userManagementService.deleteAccount(accountId);
      if (success) {
        await loadAccounts();
      }
      setUserManagementState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      setUserManagementState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete account'
      }));
      return false;
    }
  }, [canDeleteAccounts, loadAccounts]);

  // Suspend account
  const suspendAccount = useCallback(async (accountId: string): Promise<boolean> => {
    if (!canManageAccounts) {
      setUserManagementState(prev => ({
        ...prev,
        error: 'You do not have permission to suspend accounts'
      }));
      return false;
    }

    setUserManagementState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await userManagementService.suspendAccount(accountId);
      if (success) {
        await loadAccounts();
      }
      setUserManagementState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      setUserManagementState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to suspend account'
      }));
      return false;
    }
  }, [canManageAccounts, loadAccounts]);

  // Activate account
  const activateAccount = useCallback(async (accountId: string): Promise<boolean> => {
    if (!canManageAccounts) {
      setUserManagementState(prev => ({
        ...prev,
        error: 'You do not have permission to activate accounts'
      }));
      return false;
    }

    setUserManagementState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await userManagementService.activateAccount(accountId);
      if (success) {
        await loadAccounts();
      }
      setUserManagementState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      setUserManagementState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to activate account'
      }));
      return false;
    }
  }, [canManageAccounts, loadAccounts]);

  // Update user role
  const updateUserRole = useCallback(async (uid: string, role: UserRole): Promise<boolean> => {
    if (!canUpdateUsers) {
      setUserManagementState(prev => ({
        ...prev,
        error: 'You do not have permission to update user roles'
      }));
      return false;
    }

    return await updateUser(uid, { 
      role, 
      permissions: ROLE_PERMISSIONS[role] 
    });
  }, [canUpdateUsers, updateUser]);

  // Update user permissions
  const updateUserPermissions = useCallback(async (uid: string, permissions: Permission[]): Promise<boolean> => {
    if (!canUpdateUsers) {
      setUserManagementState(prev => ({
        ...prev,
        error: 'You do not have permission to update user permissions'
      }));
      return false;
    }

    return await updateUser(uid, { permissions });
  }, [canUpdateUsers, updateUser]);

  // Clear demo data
  const clearDemoData = useCallback(async (accountId: string): Promise<boolean> => {
    if (!hasPermission(state.userProfile?.permissions || [], 'demo.clear')) {
      setUserManagementState(prev => ({
        ...prev,
        error: 'You do not have permission to clear demo data'
      }));
      return false;
    }

    setUserManagementState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // This would integrate with the demo data service
      const success = true; // Placeholder
      setUserManagementState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      setUserManagementState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to clear demo data'
      }));
      return false;
    }
  }, [state.userProfile?.permissions]);

  // Create demo data
  const createDemoData = useCallback(async (accountId: string): Promise<boolean> => {
    if (!hasPermission(state.userProfile?.permissions || [], 'demo.create')) {
      setUserManagementState(prev => ({
        ...prev,
        error: 'You do not have permission to create demo data'
      }));
      return false;
    }

    setUserManagementState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // This would integrate with the demo data service
      const success = true; // Placeholder
      setUserManagementState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      setUserManagementState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create demo data'
      }));
      return false;
    }
  }, [state.userProfile?.permissions]);

  // Set filters
  const setFilters = useCallback((filters: UserManagementState['filters']) => {
    setUserManagementState(prev => ({ ...prev, filters }));
  }, []);

  // Set selected user
  const setSelectedUser = useCallback((user: UserProfile | null) => {
    setUserManagementState(prev => ({ ...prev, selectedUser: user }));
  }, []);

  // Set selected account
  const setSelectedAccount = useCallback((account: Account | null) => {
    setUserManagementState(prev => ({ ...prev, selectedAccount: account }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setUserManagementState(prev => ({ ...prev, error: null }));
  }, []);

  // Load initial data
  useEffect(() => {
    if (canManageUsers) {
      loadUsers();
    }
    if (canManageAccounts) {
      loadAccounts();
    }
  }, [canManageUsers, canManageAccounts, loadUsers, loadAccounts]);

  const actions: UserManagementActions = {
    createUser,
    updateUser,
    deleteUser,
    suspendUser,
    activateUser,
    resetUserPassword,
    createAccount,
    updateAccount,
    deleteAccount,
    suspendAccount,
    activateAccount,
    updateUserRole,
    updateUserPermissions,
    loadUsers,
    loadAccounts,
    clearDemoData,
    createDemoData
  };

  return {
    state: userManagementState,
    actions,
    permissions: {
      canManageUsers,
      canCreateUsers,
      canUpdateUsers,
      canDeleteUsers,
      canManageAccounts,
      canCreateAccounts,
      canDeleteAccounts,
      isSuperAdmin,
      isAdmin
    },
    helpers: {
      setFilters,
      setSelectedUser,
      setSelectedAccount,
      clearError,
      canManageUser: (targetUser: UserProfile) => canManageUser(state.userProfile!, targetUser),
      canManageAccount: (accountId: string) => canManageAccount(state.userProfile!, accountId)
    }
  };
} 