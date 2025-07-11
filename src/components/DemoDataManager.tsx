import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Database, Trash2, Plus, AlertTriangle, 
  CheckCircle, Loader2, RefreshCw, FileText,
  Users, BarChart3, DollarSign, FolderOpen,
  Info
} from 'lucide-react';
import { demoDataService, DemoDataConfig } from '@/services/demoDataService';
import { userDataService } from '@/services/userDataService';
import { toast } from 'sonner';

export default function DemoDataManager() {
  const [hasDemoData, setHasDemoData] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [dataStats, setDataStats] = useState<{
    leads: number;
    projects: number;
    users: number;
    financials: number;
    documents: number;
    files: number;
  } | null>(null);

  const [config, setConfig] = useState<DemoDataConfig>({
    enableLeads: true,
    enableProjects: true,
    enableUsers: true,
    enableFinancials: true,
    enableDocuments: true,
    companyType: 'solar',
    teamSize: 3
  });

  useEffect(() => {
    checkDemoData();
    loadDataStats();
  }, []);

  const checkDemoData = async () => {
    try {
      const hasData = await demoDataService.hasDemoData();
      setHasDemoData(hasData);
    } catch (error) {
      console.error('Error checking demo data:', error);
      setError('Failed to check demo data status');
    }
  };

  const loadDataStats = async () => {
    try {
      const stats = await userDataService.getUserDataStats();
      setDataStats(stats);
    } catch (error) {
      console.error('Error loading data stats:', error);
    }
  };

  const handleCreateDemoData = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await demoDataService.createDemoData(config);
      
      if (result.success) {
        setSuccess(result.message);
        setHasDemoData(true);
        setShowCreateForm(false);
        await loadDataStats();
        toast.success('Demo data created successfully');
      } else {
        setError(result.errors.join(', '));
        toast.error('Failed to create demo data');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create demo data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearDemoData = async () => {
    if (!confirm('Are you sure you want to clear all demo data? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await userDataService.clearDemoData();
      
      if (result.success) {
        setSuccess(result.message);
        setHasDemoData(false);
        await loadDataStats();
        toast.success('Demo data cleared successfully');
      } else {
        setError(result.errors.join(', '));
        toast.error('Failed to clear demo data');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear demo data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigChange = (field: keyof DemoDataConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderDataStats = () => {
    if (!dataStats) return null;

    const totalItems = Object.values(dataStats).reduce((sum: number, count: number) => sum + count, 0);

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Current Data Statistics
          </CardTitle>
          <CardDescription>
            Overview of your current data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{dataStats.leads}</div>
              <div className="text-sm text-gray-600">Leads</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{dataStats.projects}</div>
              <div className="text-sm text-gray-600">Projects</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{dataStats.users}</div>
              <div className="text-sm text-gray-600">Users</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{dataStats.financials}</div>
              <div className="text-sm text-gray-600">Financials</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{dataStats.documents}</div>
              <div className="text-sm text-gray-600">Documents</div>
            </div>
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{dataStats.files}</div>
              <div className="text-sm text-gray-600">Files</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Badge variant="outline" className="text-lg">
              Total: {totalItems} items
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCreateForm = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create Demo Data
        </CardTitle>
        <CardDescription>
          Select which types of demo data you'd like to create
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Data Type Selection */}
        <div className="space-y-4">
          <h4 className="font-medium">Data Types</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={config.enableLeads}
                onChange={(e) => handleConfigChange('enableLeads', e.target.checked)}
                className="rounded"
              />
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span>Leads & Contacts</span>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={config.enableProjects}
                onChange={(e) => handleConfigChange('enableProjects', e.target.checked)}
                className="rounded"
              />
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-green-600" />
                <span>Projects</span>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={config.enableUsers}
                onChange={(e) => handleConfigChange('enableUsers', e.target.checked)}
                className="rounded"
              />
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span>Team Members</span>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={config.enableFinancials}
                onChange={(e) => handleConfigChange('enableFinancials', e.target.checked)}
                className="rounded"
              />
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-yellow-600" />
                <span>Financial Data</span>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={config.enableDocuments}
                onChange={(e) => handleConfigChange('enableDocuments', e.target.checked)}
                className="rounded"
              />
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-orange-600" />
                <span>Documents</span>
              </div>
            </label>
          </div>
        </div>

        {/* Company Configuration */}
        <div className="space-y-4">
          <h4 className="font-medium">Company Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Company Type</label>
              <select
                value={config.companyType}
                onChange={(e) => handleConfigChange('companyType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="solar">Solar Installation</option>
                <option value="construction">Construction</option>
                <option value="consulting">Consulting</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Team Size</label>
              <input
                type="number"
                min="1"
                max="20"
                value={config.teamSize}
                onChange={(e) => handleConfigChange('teamSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button
            onClick={handleCreateDemoData}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Demo Data
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowCreateForm(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Data Statistics */}
      {renderDataStats()}

      {/* Error/Success Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Main Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Demo Data Management
          </CardTitle>
          <CardDescription>
            Create or clear demo data to explore BooksBoardroom features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Demo Data Status</h3>
              <p className="text-sm text-gray-600">
                {hasDemoData === null ? 'Checking...' : 
                 hasDemoData ? 'Demo data is available' : 'No demo data found'}
              </p>
            </div>
            <Badge variant={hasDemoData ? 'default' : 'secondary'}>
              {hasDemoData ? 'Available' : 'Not Available'}
            </Badge>
          </div>

          <div className="flex space-x-4">
            {!hasDemoData ? (
              <Button
                onClick={() => setShowCreateForm(true)}
                disabled={isLoading}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Demo Data
              </Button>
            ) : (
              <Button
                onClick={handleClearDemoData}
                disabled={isLoading}
                variant="destructive"
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Demo Data
                  </>
                )}
              </Button>
            )}
            
            <Button
              onClick={checkDemoData}
              disabled={isLoading}
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {showCreateForm && renderCreateForm()}
        </CardContent>
      </Card>
    </div>
  );
} 