import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Database, Users, Target, Settings, 
  CheckCircle, AlertCircle, Loader2, RefreshCw,
  Phone, Mail, MapPin, DollarSign, Calendar,
  TrendingUp, Activity, Star, LogOut, User
} from 'lucide-react';
import { ghlFirebaseService } from '@/lib/ghl-firebase-service';
import { useFirebase } from '@/hooks/useFirebase';
import { getGHLApiKey, getGHLLocationId, isGHLConfigured, SETUP_INSTRUCTIONS } from '@/config/ghl-config';

interface GHLIntegrationProps {
  className?: string;
}

interface SyncStatus {
  lastSync: string | null;
  isConnected: boolean;
  contactCount: number;
  opportunityCount: number;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  leadScore?: number;
  estimatedValue?: number;
  status: string;
  syncedAt: string;
}

interface Opportunity {
  id: string;
  name: string;
  monetaryValue: number;
  status: string;
  syncedAt: string;
}

export default function GHLIntegration({ className }: GHLIntegrationProps) {
  const { state, signOut } = useFirebase();
  const user = state.user;
  
  // Use API credentials from config file or environment variables
  const [apiKey, setApiKey] = useState(getGHLApiKey());
  const [locationId, setLocationId] = useState(getGHLLocationId());
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: null,
    isConnected: false,
    contactCount: 0,
    opportunityCount: 0
  });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize service with user ID when user changes
  useEffect(() => {
    if (user?.uid) {
      ghlFirebaseService.setUserId(user.uid);
      loadSyncStatus();
      loadData();
      
      // Auto-connect if valid API credentials are available
      if (isGHLConfigured()) {
        console.log('🔄 Auto-connecting to GHL with configured credentials...');
        handleConnect();
      }
    }
  }, [user]);

  // Subscribe to real-time data updates
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribeContacts = ghlFirebaseService.subscribeToContacts((updatedContacts) => {
      setContacts(updatedContacts.slice(0, 10)); // Show latest 10
    });

    const unsubscribeOpportunities = ghlFirebaseService.subscribeToOpportunities((updatedOpportunities) => {
      setOpportunities(updatedOpportunities.slice(0, 10)); // Show latest 10
    });

    return () => {
      unsubscribeContacts();
      unsubscribeOpportunities();
    };
  }, [user]);

  const loadSyncStatus = async () => {
    try {
      const status = await ghlFirebaseService.getSyncStatus();
      setSyncStatus(status);
    } catch (error) {
      console.error('Failed to load sync status:', error);
    }
  };

  const loadData = async () => {
    try {
      const [contactsData, opportunitiesData] = await Promise.all([
        ghlFirebaseService.getContacts({ limit: 10 }),
        ghlFirebaseService.getOpportunities({ limit: 10 })
      ]);
      
      setContacts(contactsData);
      setOpportunities(opportunitiesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your GHL API key to test');
      return;
    }

    if (apiKey.length < 10) {
      setError('API key appears to be too short. Please check your GHL API key.');
      return;
    }

    setIsConnecting(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('🧪 Testing GHL connection...');
      const result = await ghlFirebaseService.connectGHL(apiKey, locationId || undefined);
      
      if (result) {
        setSuccess('🧪 Connection test successful! Your API key is valid. Click "Connect to GHL" to save the connection.');
      } else {
        setError('🧪 Connection test failed. Please check your API key and permissions.');
      }
    } catch (error) {
      setError(`🧪 Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your GHL API key');
      return;
    }

    setIsConnecting(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('🔄 Connecting to GHL...');
      const connected = await ghlFirebaseService.connectGHL(apiKey, locationId || undefined);
      
      if (connected) {
        setSuccess('✅ Successfully connected to Go High Level! You can now sync your data.');
        await loadSyncStatus();
        console.log('✅ GHL connection successful');
      } else {
        setError('❌ Failed to connect to Go High Level. Please verify your API key and permissions.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      setError(`❌ Connection error: ${errorMessage}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await ghlFirebaseService.disconnect();
      setSuccess('Disconnected from Go High Level');
      await loadSyncStatus();
      setApiKey('');
      setLocationId('');
    } catch (error) {
      setError('Failed to disconnect');
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setError(null);
    setSuccess(null);
    setSyncProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setSyncProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const result = await ghlFirebaseService.syncAllData({
        syncContacts: true,
        syncOpportunities: true,
        batchSize: 50
      });

      clearInterval(progressInterval);
      setSyncProgress(100);

      if (result.success) {
        setSuccess(`✅ Sync completed! ${result.contactsSynced} contacts and ${result.opportunitiesSynced} opportunities synced.`);
        await loadSyncStatus();
        await loadData();
      } else {
        setError(`❌ Sync failed: ${result.errors?.join(', ') || 'Unknown error'}`);
      }
    } catch (error) {
      setError(`❌ Sync error: ${error instanceof Error ? error.message : 'Sync failed'}`);
    } finally {
      setIsSyncing(false);
      setSyncProgress(0);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'hot': case 'qualified': case 'ready': return 'bg-red-100 text-red-800';
      case 'warm': case 'interested': return 'bg-orange-100 text-orange-800';
      case 'cold': case 'new': return 'bg-blue-100 text-blue-800';
      case 'won': case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Please sign in to access GHL integration</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* API Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            API Configuration
          </CardTitle>
          <CardDescription>
            Current GHL API settings and connection status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                <Label className="text-sm font-medium">API Key Status</Label>
                <div className="flex items-center gap-2 mt-1">
                  {isGHLConfigured() ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Configured</span>
                      <Badge variant="outline" className="text-xs">
                        {apiKey.substring(0, 8)}...
                      </Badge>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-orange-600">Not configured</span>
                    </>
                  )}
                </div>
              </div>
            <div>
              <Label className="text-sm font-medium">Location ID</Label>
              <div className="flex items-center gap-2 mt-1">
                {locationId && locationId !== 'your_ghl_location_id_here' ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Set</span>
                    <Badge variant="outline" className="text-xs">
                      {locationId.substring(0, 8)}...
                    </Badge>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Using default</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Quick Setup Instructions */}
          {!isGHLConfigured() && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{SETUP_INSTRUCTIONS.title}</AlertTitle>
              <AlertDescription>
                <div className="space-y-2">
                  <div>
                    {SETUP_INSTRUCTIONS.steps.map((step, index) => (
                      <div key={index} className="text-sm">{step}</div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    {SETUP_INSTRUCTIONS.note}
                  </div>
                  <div className="mt-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
                      File: src/config/ghl-config.ts
                    </code>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Go High Level Integration
          </CardTitle>
          <CardDescription>
            Connect and sync your GHL CRM data for real-time solar operations management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status Badge */}
          <div className="flex items-center gap-2">
            <Badge variant={syncStatus.isConnected ? "default" : "secondary"}>
              {syncStatus.isConnected ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Not Connected
                </>
              )}
            </Badge>
            {syncStatus.lastSync && (
              <span className="text-sm text-gray-600">
                Last sync: {formatDate(syncStatus.lastSync)}
              </span>
            )}
          </div>

          {/* Setup Instructions */}
          {!syncStatus.isConnected && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Setup Required</AlertTitle>
              <AlertDescription>
                To connect to Go High Level:
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Log into your GHL account</li>
                  <li>Go to Settings → API Keys</li>
                  <li>Create or copy your API key</li>
                  <li>Paste it below and click "Test Connection"</li>
                </ol>
              </AlertDescription>
            </Alert>
          )}

          {/* Connection Form */}
          {!syncStatus.isConnected && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="apiKey">GHL API Key *</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your GHL API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Find this in GHL Settings → API Keys
                  </p>
                </div>
                <div>
                  <Label htmlFor="locationId">Location ID (Optional)</Label>
                  <Input
                    id="locationId"
                    placeholder="Enter location ID"
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave blank to use default location
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            {!syncStatus.isConnected ? (
              <>
                <Button 
                  onClick={handleTestConnection} 
                  disabled={isConnecting || !apiKey.trim()}
                  variant="outline"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Test Connection
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleConnect} 
                  disabled={isConnecting || !apiKey.trim()}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Connect to GHL
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleSync} disabled={isSyncing}>
                  {isSyncing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Data
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleDisconnect} 
                  variant="outline"
                  disabled={isSyncing}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </>
            )}
          </div>

          {/* Sync Progress */}
          {isSyncing && syncProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Syncing data...</span>
                <span>{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>
          )}

          {/* Status Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
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

          {/* Connection Stats */}
          {syncStatus.isConnected && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{syncStatus.contactCount}</div>
                <div className="text-sm text-green-700">Contacts Synced</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{syncStatus.opportunityCount}</div>
                <div className="text-sm text-green-700">Opportunities Synced</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Preview */}
      {syncStatus.isConnected && (contacts.length > 0 || opportunities.length > 0) && (
        <Tabs defaultValue="contacts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="contacts">
              <Users className="h-4 w-4 mr-2" />
              Contacts ({contacts.length})
            </TabsTrigger>
            <TabsTrigger value="opportunities">
              <Target className="h-4 w-4 mr-2" />
              Opportunities ({opportunities.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Recent Contacts</CardTitle>
                <CardDescription>Latest contacts synced from Go High Level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {contact.firstName} {contact.lastName}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {contact.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(contact.status)}>
                          {contact.status}
                        </Badge>
                        {contact.leadScore && (
                          <div className="text-sm text-gray-500 mt-1">
                            Score: {contact.leadScore}%
                          </div>
                        )}
                        {contact.estimatedValue && (
                          <div className="text-sm font-medium text-green-600">
                            {formatCurrency(contact.estimatedValue)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities">
            <Card>
              <CardHeader>
                <CardTitle>Recent Opportunities</CardTitle>
                <CardDescription>Latest opportunities synced from Go High Level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {opportunities.map((opportunity) => (
                    <div key={opportunity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Target className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">{opportunity.name}</div>
                          <div className="text-sm text-gray-600">
                            Synced: {formatDate(opportunity.syncedAt)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(opportunity.monetaryValue)}
                        </div>
                        <Badge className={getStatusColor(opportunity.status)}>
                          {opportunity.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Empty State */}
      {syncStatus.isConnected && contacts.length === 0 && opportunities.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Data Found</h3>
            <p className="text-gray-600 mb-4">
              No contacts or opportunities have been synced yet. Click "Sync Data" to import your GHL data.
            </p>
            <Button onClick={handleSync} disabled={isSyncing}>
              {isSyncing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Data Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 