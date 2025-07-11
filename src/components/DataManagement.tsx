import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  Trash2, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { seedUserData, clearUserData } from '@/utils/seedData';
import { useFirebase } from '@/hooks/useFirebase';

interface DataManagementProps {
  onDataUpdate?: () => void;
}

const DataManagement: React.FC<DataManagementProps> = ({ onDataUpdate }) => {
  const { state } = useFirebase();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [lastAction, setLastAction] = useState<{
    type: 'seed' | 'clear' | null;
    success: boolean;
    message: string;
  }>({ type: null, success: false, message: '' });

  const handleSeedData = async () => {
    if (!state.user?.uid) {
      setLastAction({
        type: 'seed',
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    setIsSeeding(true);
    try {
      const result = await seedUserData(state.user.uid);
      setLastAction({
        type: 'seed',
        success: result.success,
        message: result.message
      });
      
      if (result.success && onDataUpdate) {
        onDataUpdate();
      }
    } catch (error) {
      setLastAction({
        type: 'seed',
        success: false,
        message: `Error seeding data: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearData = async () => {
    if (!state.user?.uid) {
      setLastAction({
        type: 'clear',
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    if (!confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      return;
    }

    setIsClearing(true);
    try {
      const result = await clearUserData(state.user.uid);
      setLastAction({
        type: 'clear',
        success: result.success,
        message: result.message
      });
      
      if (result.success && onDataUpdate) {
        onDataUpdate();
      }
    } catch (error) {
      setLastAction({
        type: 'clear',
        success: false,
        message: `Error clearing data: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Data Management</h2>
        <p className="text-gray-600">
          Manage your real data, seed sample data for testing, or clear existing data.
        </p>
      </div>

      {/* Current User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Current Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">User:</span>
              <span className="text-sm">{state.user?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">User ID:</span>
              <span className="text-sm font-mono text-xs">{state.user?.uid}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant="default">Authenticated</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-green-600" />
              Seed Sample Data
            </CardTitle>
            <CardDescription>
              Add sample leads, projects, and users to test the platform with realistic data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              This will create:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>5 sample leads with various statuses</li>
                <li>4 sample projects in different stages</li>
                <li>4 team members with different roles</li>
              </ul>
            </div>
            <Button 
              onClick={handleSeedData}
              disabled={isSeeding || !state.user}
              className="w-full"
            >
              {isSeeding ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Seeding Data...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Seed Sample Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Clear All Data
            </CardTitle>
            <CardDescription>
              Remove all leads, projects, and users from your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-red-600">
              ⚠️ This action cannot be undone. All your data will be permanently deleted.
            </div>
            <Button 
              onClick={handleClearData}
              disabled={isClearing || !state.user}
              variant="destructive"
              className="w-full"
            >
              {isClearing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Clearing Data...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Action Result */}
      {lastAction.type && (
        <Alert className={lastAction.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <div className="flex items-center gap-2">
            {lastAction.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={lastAction.success ? 'text-green-800' : 'text-red-800'}>
              <strong>{lastAction.type === 'seed' ? 'Seed Data' : 'Clear Data'} Result:</strong> {lastAction.message}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm font-medium">Firebase Firestore</span>
              <Badge variant="default">Connected</Badge>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm font-medium">Go High Level</span>
              <Badge variant="secondary">Not Connected</Badge>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm font-medium">Coda</span>
              <Badge variant="secondary">Not Connected</Badge>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Connect your integrations to automatically sync real data from your existing tools.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Structure Info */}
      <Card>
        <CardHeader>
          <CardTitle>Data Structure</CardTitle>
          <CardDescription>
            Understanding how your data is organized in the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Leads Collection</h4>
              <p className="text-gray-600">
                Stores potential customers with contact information, AI scoring, and status tracking.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Projects Collection</h4>
              <p className="text-gray-600">
                Tracks solar installations from planning to completion with cost and progress data.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Users Collection</h4>
              <p className="text-gray-600">
                Team members with roles and permissions for accessing different platform features.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataManagement; 