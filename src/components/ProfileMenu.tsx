import React, { useState } from 'react';
import { useFirebase } from '@/hooks/useFirebase';
import { demoDataService } from '@/services/demoDataService';
import { toast } from 'sonner';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  LogOut, 
  Settings, 
  Database, 
  Trash2, 
  Plus,
  HelpCircle,
  Info,
  ChevronDown,
  UserCheck,
  FileText,
  RefreshCw,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileMenuProps {
  className?: string;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ className }) => {
  const { state, signOut } = useFirebase();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [demoDataStatus, setDemoDataStatus] = useState<{
    hasData: boolean | null;
    isLoading: boolean;
  }>({ hasData: null, isLoading: false });

  // Check demo data status on mount
  React.useEffect(() => {
    checkDemoDataStatus();
  }, []);

  const checkDemoDataStatus = async () => {
    if (!state.user) return;
    
    setDemoDataStatus(prev => ({ ...prev, isLoading: true }));
    try {
      const hasData = await demoDataService.hasDemoData();
      setDemoDataStatus({ hasData, isLoading: false });
    } catch (error) {
      console.error('Error checking demo data status:', error);
      setDemoDataStatus({ hasData: null, isLoading: false });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Sign out failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  const handleAccountSetup = () => {
    toast.info('Navigating to account setup');
    navigate('/setup');
  };

  const handleUserManagement = () => {
    toast.info('Navigating to user management');
    navigate('/user-management');
  };

  const handleClearDemoData = async () => {
    if (!confirm('Are you sure you want to clear all demo data? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await demoDataService.clearDemoData();
      if (result.success) {
        setDemoDataStatus({ hasData: false, isLoading: false });
        toast.success('Demo data cleared successfully', {
          description: `${result.createdCount} records removed`
        });
      } else {
        toast.error('Failed to clear demo data', {
          description: result.errors.join(', ')
        });
      }
    } catch (error) {
      toast.error('Error clearing demo data', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadDemoData = async () => {
    setIsLoading(true);
    try {
      const config = {
        enableLeads: true,
        enableProjects: true,
        enableUsers: true,
        enableFinancials: true,
        enableDocuments: true,
        companyType: 'solar' as const,
        teamSize: 3
      };

      const result = await demoDataService.createDemoData(config);
      if (result.success) {
        setDemoDataStatus({ hasData: true, isLoading: false });
        toast.success('Demo data loaded successfully', {
          description: `${result.createdCount} records created`
        });
      } else {
        toast.error('Failed to load demo data', {
          description: result.errors.join(', ')
        });
      }
    } catch (error) {
      toast.error('Error loading demo data', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSettings = () => {
    // Navigate to profile settings page (to be implemented)
    console.log('Navigate to profile settings');
  };

  const handleHelpSupport = () => {
    // Open help/support modal or navigate to help page
    console.log('Open help/support');
  };

  const handleAbout = () => {
    // Show about modal with version info
    console.log('Show about information');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!state.userProfile) return 'U';
    const { firstName, lastName } = state.userProfile;
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'U';
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!state.userProfile) return state.user?.email || 'User';
    const { firstName, lastName } = state.userProfile;
    return `${firstName || ''} ${lastName || ''}`.trim() || state.user?.email || 'User';
  };

  if (!state.user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`h-10 w-auto px-3 ${className}`}>
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={state.userProfile?.photoURL} alt={getUserDisplayName()} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-medium text-gray-900">{getUserDisplayName()}</span>
              <span className="text-xs text-gray-500">{state.userProfile?.role || 'User'}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64" align="end" forceMount>
        {/* User Info Section */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
            <p className="text-xs leading-none text-muted-foreground">{state.user.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {state.userProfile?.role || 'User'}
              </Badge>
              {state.userProfile?.accountId && (
                <Badge variant="secondary" className="text-xs">
                  Account: {state.userProfile.accountId}
                </Badge>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {/* Account Management */}
        <DropdownMenuItem onClick={handleAccountSetup}>
          <UserCheck className="mr-2 h-4 w-4" />
          <span>Account Setup</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleProfileSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Profile Settings</span>
        </DropdownMenuItem>
        
        {/* User Management - Only for Admin/Super Admin */}
        {(state.userProfile?.role === 'admin' || state.userProfile?.role === 'superAdmin') && (
          <DropdownMenuItem onClick={handleUserManagement}>
            <Users className="mr-2 h-4 w-4" />
            <span>User Management</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        {/* Demo Data Management */}
        <DropdownMenuLabel className="text-xs font-medium text-gray-500">
          Demo Data
        </DropdownMenuLabel>
        
        {demoDataStatus.isLoading ? (
          <DropdownMenuItem disabled>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            <span>Checking status...</span>
          </DropdownMenuItem>
        ) : demoDataStatus.hasData ? (
          <>
            <DropdownMenuItem onClick={handleClearDemoData} disabled={isLoading}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>{isLoading ? 'Clearing...' : 'Clear Demo Data'}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={checkDemoDataStatus}>
              <RefreshCw className="mr-2 h-4 w-4" />
              <span>Refresh Status</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={handleLoadDemoData} disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" />
            <span>{isLoading ? 'Loading...' : 'Load Demo Data'}</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        {/* Help & Support */}
        <DropdownMenuItem onClick={handleHelpSupport}>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleAbout}>
          <Info className="mr-2 h-4 w-4" />
          <span>About</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Logout */}
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 