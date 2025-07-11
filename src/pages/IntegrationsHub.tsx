import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertCircle, Check, Database, FileText, Link2, LucideIcon, 
  RefreshCw, Save, Settings, Shield, Users, Calendar, Bot,
  MessageSquare, Phone, Camera, Zap, Globe, Cloud, Server,
  Activity, BarChart3, TrendingUp, DollarSign, Sun, Home,
  Building, MapPin, Clock, CheckCircle, XCircle, Loader2,
  BookOpen, AlertTriangle, Crown, UserCog, LogOut, User
} from 'lucide-react';
import { useMCP } from '@/hooks/useMCP';
import { mcpClient } from '@/lib/mcp-client';
import { useFirebase } from '@/hooks/useFirebase';
import GHLIntegration from '@/components/GHLIntegration';

// Mock data for integration status
const integrationStatus = {
  ghl: { connected: true, lastSync: "10 minutes ago", apiKey: "ghl_***********************" },
  coda: { connected: false, lastSync: "Never", apiKey: "" },
  firestore: { connected: true, lastSync: "5 minutes ago", projectId: "solar-ops-demo" },
  taskmaster: { connected: false, lastSync: "Never", apiKey: "" },
  readymode: { connected: true, lastSync: "1 hour ago", apiKey: "rm_***********************" },
  companycam: { connected: false, lastSync: "Never", apiKey: "" },
};

// Integration card component
interface IntegrationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  status: boolean;
  lastSync: string;
  onConfigure: () => void;
  bgColor?: string;
  isConnecting?: boolean;
  error?: string | null;
}

const IntegrationCard = ({ 
  title, 
  description, 
  icon: Icon, 
  status, 
  lastSync, 
  onConfigure,
  bgColor = "bg-gray-100",
  isConnecting = false,
  error = null
}: IntegrationCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className={`${bgColor} p-3 rounded-lg`}>
            <Icon className="h-6 w-6 text-gray-700" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={status ? "default" : "outline"} className={status ? "bg-green-500 hover:bg-green-600" : ""}>
              {isConnecting ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Connecting...
                </>
              ) : status ? "Connected" : "Not Connected"}
            </Badge>
            {error && (
              <div className="text-xs text-red-500 text-right max-w-32 truncate" title={error}>
                {error}
              </div>
            )}
          </div>
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Last sync: {lastSync}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onConfigure} 
          variant={status ? "outline" : "default"} 
          className="w-full"
          disabled={isConnecting}
        >
          <Settings className="h-4 w-4 mr-2" />
          {status ? "Configure" : "Connect"}
        </Button>
      </CardFooter>
    </Card>
  );
};

// MCP Documentation component
const MCPDocumentation = ({ title, endpoint, description }: { title: string, endpoint: string, description: string }) => {
  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-lg">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <Badge variant="outline" className="shrink-0">
          Context7 MCP
        </Badge>
      </div>
      <div className="mt-3 p-2 bg-gray-100 rounded border text-sm font-mono">
        {endpoint}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-blue-600" />
        <span className="text-sm text-blue-600">View Documentation</span>
      </div>
    </div>
  );
};

// GHL Integration Configuration Component
const GHLConfiguration = () => {
  const { ghl, connectGHL, fetchGHLLocations, fetchGHLContacts, disconnect } = useMCP();
  const [apiKey, setApiKey] = useState('');
  const [locationId, setLocationId] = useState('');
  const [locations, setLocations] = useState<Array<{ id: string; name: string }>>([]);
  const [contacts, setContacts] = useState<Array<{ id: string; firstName: string; lastName: string; email: string }>>([]);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      alert('Please enter your GHL API key');
      return;
    }

    const success = await connectGHL(apiKey, locationId || undefined);
    if (success) {
      alert('GHL connected successfully!');
      // Fetch initial data
      handleFetchLocations();
    }
  };

  const handleDisconnect = () => {
    disconnect('ghl');
    setApiKey('');
    setLocationId('');
    setLocations([]);
    setContacts([]);
  };

  const handleFetchLocations = async () => {
    setIsTestingConnection(true);
    try {
      const fetchedLocations = await fetchGHLLocations();
      setLocations(fetchedLocations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleFetchContacts = async () => {
    setIsTestingConnection(true);
    try {
      const fetchedContacts = await fetchGHLContacts(locationId || undefined);
      setContacts(fetchedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Go High Level (GHL)</h2>
          <p className="text-gray-500">Configure your CRM integration</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={ghl.isConnected ? "default" : "outline"} className={ghl.isConnected ? "bg-green-500 hover:bg-green-600" : ""}>
            {ghl.isConnecting ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Connecting...
              </>
            ) : ghl.isConnected ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 mr-1" />
                Not Connected
              </>
            )}
          </Badge>
          {ghl.isConnected && (
            <Button variant="outline" size="sm" onClick={handleDisconnect}>
              Disconnect
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {ghl.error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>{ghl.error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Connect to your Go High Level account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ghl-api-key">API Key</Label>
                <Input 
                  id="ghl-api-key" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)} 
                  type="password"
                  placeholder="Enter your GHL API key"
                  disabled={ghl.isConnected}
                />
                <p className="text-xs text-gray-500">
                  Find your API key in the GHL dashboard under Settings → API Keys
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ghl-location">Default Location ID (Optional)</Label>
                <Input 
                  id="ghl-location" 
                  value={locationId} 
                  onChange={(e) => setLocationId(e.target.value)} 
                  placeholder="Location ID (optional)"
                  disabled={ghl.isConnected}
                />
              </div>
              <div className="flex items-center space-x-2 pt-4">
                <Switch id="auto-sync" defaultChecked />
                <Label htmlFor="auto-sync">Auto-sync contacts every 30 minutes</Label>
              </div>
            </CardContent>
            <CardFooter>
              {!ghl.isConnected ? (
                <div className="w-full space-y-2">
                  <Button onClick={handleConnect} disabled={ghl.isConnecting || !apiKey} className="w-full">
                    {ghl.isConnecting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Link2 className="h-4 w-4 mr-2" />
                        Connect GHL
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={() => {
                      setApiKey('demo_api_key_12345');
                      setLocationId('loc_demo_12345');
                    }} 
                    variant="outline" 
                    className="w-full"
                    size="sm"
                  >
                    Use Demo Credentials
                  </Button>
                </div>
              ) : (
                <div className="w-full space-y-2">
                  <Button onClick={handleFetchLocations} disabled={isTestingConnection} className="w-full" variant="outline">
                    {isTestingConnection ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Test Connection (Fetch Locations)
                      </>
                    )}
                  </Button>
                  {locations.length > 0 && (
                    <Button onClick={handleFetchContacts} disabled={isTestingConnection} className="w-full" variant="outline">
                      Fetch Contacts
                    </Button>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>

          {/* Display fetched data */}
          {ghl.isConnected && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Live Data Test</CardTitle>
                <CardDescription>Real data from your GHL account</CardDescription>
              </CardHeader>
              <CardContent>
                {locations.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Locations ({locations.length})</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {locations.slice(0, 3).map((location, index) => (
                        <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                          <div className="font-medium">{location.name || `Location ${index + 1}`}</div>
                          <div className="text-gray-500">{location.id}</div>
                        </div>
                      ))}
                      {locations.length > 3 && (
                        <div className="text-xs text-gray-500">...and {locations.length - 3} more</div>
                      )}
                    </div>
                  </div>
                )}

                {contacts.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Contacts ({contacts.length})</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {contacts.slice(0, 3).map((contact, index) => (
                        <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                          <div className="font-medium">{contact.firstName} {contact.lastName}</div>
                          <div className="text-gray-500">{contact.email}</div>
                        </div>
                      ))}
                      {contacts.length > 3 && (
                        <div className="text-xs text-gray-500">...and {contacts.length - 3} more</div>
                      )}
                    </div>
                  </div>
                )}

                {ghl.isConnected && locations.length === 0 && contacts.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p>Click "Test Connection" to fetch live data</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <MCPDocumentation 
            title="GHL MCP Server" 
            endpoint="mcp_context7_connect-ghl" 
            description="Connect to Go High Level using your API key for CRM operations"
          />

          <Card>
            <CardHeader>
              <CardTitle>Connection Status</CardTitle>
              <CardDescription>Real-time connection information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Status:</span>
                <Badge variant={ghl.isConnected ? "default" : "outline"} className={ghl.isConnected ? "bg-green-500" : ""}>
                  {ghl.isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              {ghl.lastSync && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Last Sync:</span>
                  <span className="text-sm text-gray-500">
                    {new Date(ghl.lastSync).toLocaleString()}
                  </span>
                </div>
              )}
              {ghl.connectionId && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Connection ID:</span>
                  <span className="text-xs text-gray-500 font-mono">
                    {ghl.connectionId.substring(0, 8)}...
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sync Options</CardTitle>
              <CardDescription>Configure what data to sync with GHL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="sync-contacts" defaultChecked />
                  <Label htmlFor="sync-contacts">Sync Contacts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="sync-opportunities" defaultChecked />
                  <Label htmlFor="sync-opportunities">Sync Opportunities</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="sync-tasks" defaultChecked />
                  <Label htmlFor="sync-tasks">Sync Tasks</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="sync-calendar" defaultChecked />
                  <Label htmlFor="sync-calendar">Sync Calendar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="bi-directional" />
                  <Label htmlFor="bi-directional">Enable Bi-directional Sync</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>
          Changes to the GHL integration may take up to 5 minutes to fully propagate.
        </AlertDescription>
      </Alert>
    </div>
  );
};

// Coda Integration Configuration Component
const CodaConfiguration = () => {
  const [apiKey, setApiKey] = useState(integrationStatus.coda.apiKey);
  const [loading, setLoading] = useState(false);
  const [docId, setDocId] = useState("");

  const handleConnect = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Coda connected successfully!");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Coda</h2>
          <p className="text-gray-500">Configure your document collaboration integration</p>
        </div>
        <Badge variant={integrationStatus.coda.connected ? "default" : "outline"} className={integrationStatus.coda.connected ? "bg-green-500 hover:bg-green-600" : ""}>
          {integrationStatus.coda.connected ? "Connected" : "Not Connected"}
        </Badge>
      </div>

      <Separator />

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Connect to your Coda account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coda-api-key">API Key</Label>
                <Input 
                  id="coda-api-key" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)} 
                  type="password"
                  placeholder="Enter your Coda API key"
                />
                <p className="text-xs text-gray-500">
                  Generate an API key at https://coda.io/account under API Settings
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="coda-doc-id">Default Doc ID (Optional)</Label>
                <Input 
                  id="coda-doc-id" 
                  value={docId} 
                  onChange={(e) => setDocId(e.target.value)} 
                  placeholder="Doc ID for default document"
                />
              </div>
              <div className="flex items-center space-x-2 pt-4">
                <Switch id="auto-sync-coda" defaultChecked />
                <Label htmlFor="auto-sync-coda">Auto-sync documents every hour</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleConnect} disabled={loading || !apiKey} className="w-full">
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : integrationStatus.coda.connected ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Update Connection
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4 mr-2" />
                    Connect Coda
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <MCPDocumentation 
            title="Coda MCP Server" 
            endpoint="mcp_context7_connect-coda" 
            description="Connect to Coda using your API key for document management"
          />

          <Card>
            <CardHeader>
              <CardTitle>Document Mapping</CardTitle>
              <CardDescription>Configure how Coda documents map to your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="sync-projects" defaultChecked />
                  <Label htmlFor="sync-projects">Sync Projects Table</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="sync-clients" defaultChecked />
                  <Label htmlFor="sync-clients">Sync Clients Table</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="sync-estimates" />
                  <Label htmlFor="sync-estimates">Sync Estimates Table</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="read-only" defaultChecked />
                  <Label htmlFor="read-only">Read-Only Mode (Recommended)</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>
          Initial document sync may take several minutes depending on document size.
        </AlertDescription>
      </Alert>
    </div>
  );
};

// Firestore Integration Configuration Component
const FirestoreConfiguration = () => {
  const { firebase, connectFirebase, fetchFirebaseProjects, fetchFirebaseCollections, fetchFirebaseDocuments, disconnect } = useMCP();
  const { state: firebaseState, signIn, signUp, signInWithGoogle, signOut } = useFirebase();
  const [projectId, setProjectId] = useState('solar-ops-demo');
  const [loading, setLoading] = useState(false);
  const [credentialFile, setCredentialFile] = useState<File | null>(null);
  const [projects, setProjects] = useState<Array<{ id: string; name?: string; displayName?: string }>>([]);
  const [collections, setCollections] = useState<Array<{ name: string; documentCount: number }>>([]);
  const [documents, setDocuments] = useState<Array<{ id: string; customerName?: string; firstName?: string; name?: string }>>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authData, setAuthData] = useState({
    email: 'demo@sunpeachsolar.com',
    password: 'demo123456',
    firstName: 'Demo',
    lastName: 'User',
    role: 'sales' as const
  });

  const handleConnect = async () => {
    setLoading(true);
    try {
      const success = await connectFirebase(projectId);
      if (success) {
        alert('Firebase connected successfully!');
        await handleFetchProjects();
        await handleFetchCollections();
      }
    } catch (error) {
      console.error('Firebase connection error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnect('firebase');
    signOut();
    setProjectId('');
    setProjects([]);
    setCollections([]);
    setDocuments([]);
    setSelectedCollection('');
  };

  const handleFetchProjects = async () => {
    setLoading(true);
    try {
      const fetchedProjects = await fetchFirebaseProjects();
      setProjects(fetchedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchCollections = async () => {
    setLoading(true);
    try {
      const fetchedCollections = await fetchFirebaseCollections(projectId);
      setCollections(fetchedCollections);
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchDocuments = async (collectionPath: string) => {
    setLoading(true);
    try {
      const fetchedDocuments = await fetchFirebaseDocuments(collectionPath, projectId);
      setDocuments(fetchedDocuments);
      setSelectedCollection(collectionPath);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async () => {
    setLoading(true);
    try {
      let success = false;
      if (authMode === 'signin') {
        success = await signIn(authData.email, authData.password);
      } else {
        success = await signUp(authData.email, authData.password, {
          firstName: authData.firstName,
          lastName: authData.lastName,
          role: authData.role,
          isActive: true,
          preferences: {
            notifications: true,
            emailUpdates: true,
            theme: 'light'
          }
        });
      }
      
      if (success) {
        alert(`${authMode === 'signin' ? 'Sign in' : 'Sign up'} successful!`);
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const success = await signInWithGoogle();
      if (success) {
        alert('Google sign in successful!');
      }
    } catch (error) {
      console.error('Google auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDemo = async () => {
    setLoading(true);
    try {
      // Note: seedDemoData function would need to be implemented in useFirebase hook
      // For now, we'll show a placeholder message
      alert('Demo data seeding feature coming soon!');
      // Refresh collections and documents
      await handleFetchCollections();
      if (selectedCollection) {
        await handleFetchDocuments(selectedCollection);
      }
    } catch (error) {
      console.error('Seed demo error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Firebase/Firestore</h2>
          <p className="text-gray-500">Configure your database integration and authentication</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={firebase.isConnected ? "default" : "outline"} className={firebase.isConnected ? "bg-green-500 hover:bg-green-600" : ""}>
            {firebase.isConnecting ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Connecting...
              </>
            ) : firebase.isConnected ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 mr-1" />
                Not Connected
              </>
            )}
          </Badge>
          {firebaseState.user && (
            <Badge variant="outline">
              <Users className="h-3 w-3 mr-1" />
              {firebaseState.user.email}
            </Badge>
          )}
          {firebase.isConnected && (
            <Button variant="outline" size="sm" onClick={handleDisconnect}>
              Disconnect
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {firebase.error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>{firebase.error}</AlertDescription>
        </Alert>
      )}

      {firebaseState.error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{firebaseState.error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Firebase Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Firebase Configuration</CardTitle>
              <CardDescription>Connect to your Firebase project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firebase-project-id">Project ID</Label>
                <Input 
                  id="firebase-project-id" 
                  value={projectId} 
                  onChange={(e) => setProjectId(e.target.value)} 
                  placeholder="Enter your Firebase project ID"
                  disabled={firebase.isConnected}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credential-file">Service Account Credentials (JSON)</Label>
                <Input 
                  id="credential-file" 
                  type="file" 
                  accept=".json"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      setCredentialFile(files[0]);
                    }
                  }}
                  disabled={firebase.isConnected}
                />
                <p className="text-xs text-gray-500">
                  Upload the service account JSON file from Firebase console
                </p>
              </div>
              <div className="flex items-center space-x-2 pt-4">
                <Switch id="real-time-sync" defaultChecked />
                <Label htmlFor="real-time-sync">Enable real-time synchronization</Label>
              </div>
            </CardContent>
            <CardFooter>
              {!firebase.isConnected ? (
                <div className="w-full space-y-2">
                  <Button onClick={handleConnect} disabled={loading || !projectId} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Link2 className="h-4 w-4 mr-2" />
                        Connect Firebase
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={() => setProjectId('solar-ops-demo')} 
                    variant="outline" 
                    className="w-full"
                    size="sm"
                  >
                    Use Demo Project ID
                  </Button>
                </div>
              ) : (
                <div className="w-full space-y-2">
                  <Button onClick={handleFetchProjects} disabled={loading} className="w-full" variant="outline">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Projects
                      </>
                    )}
                  </Button>
                  <Button onClick={handleFetchCollections} disabled={loading} className="w-full" variant="outline">
                    Fetch Collections
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>

          {/* Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>Sign in to access Firebase features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'signin' | 'signup')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input 
                      id="signin-email" 
                      type="email"
                      value={authData.email} 
                      onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))} 
                      placeholder="Enter your email"
                      disabled={!!firebaseState.user}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input 
                      id="signin-password" 
                      type="password"
                      value={authData.password} 
                      onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))} 
                      placeholder="Enter your password"
                      disabled={!!firebaseState.user}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="signup" className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="signup-firstname">First Name</Label>
                      <Input 
                        id="signup-firstname" 
                        value={authData.firstName} 
                        onChange={(e) => setAuthData(prev => ({ ...prev, firstName: e.target.value }))} 
                        placeholder="First name"
                        disabled={!!firebaseState.user}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-lastname">Last Name</Label>
                      <Input 
                        id="signup-lastname" 
                        value={authData.lastName} 
                        onChange={(e) => setAuthData(prev => ({ ...prev, lastName: e.target.value }))} 
                        placeholder="Last name"
                        disabled={!!firebaseState.user}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email"
                      value={authData.email} 
                      onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))} 
                      placeholder="Enter your email"
                      disabled={!!firebaseState.user}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password" 
                      type="password"
                      value={authData.password} 
                      onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))} 
                      placeholder="Enter your password"
                      disabled={!!firebaseState.user}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="space-y-2">
              {!firebaseState.user ? (
                <div className="w-full space-y-2">
                  <Button onClick={handleAuth} disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {authMode === 'signin' ? 'Signing In...' : 'Signing Up...'}
                      </>
                    ) : (
                      <>
                        <Users className="h-4 w-4 mr-2" />
                        {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
                      </>
                    )}
                  </Button>
                  <Button onClick={handleGoogleAuth} disabled={loading} variant="outline" className="w-full">
                    <Bot className="h-4 w-4 mr-2" />
                    Sign in with Google
                  </Button>
                </div>
              ) : (
                <div className="w-full space-y-2">
                  <Button onClick={signOut} variant="outline" className="w-full">
                    Sign Out
                  </Button>
                  <Button onClick={handleSeedDemo} disabled={loading} variant="outline" className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Seeding...
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4 mr-2" />
                        Seed Demo Data
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <MCPDocumentation 
            title="Firebase MCP Server" 
            endpoint="mcp_context7_connect-firebase" 
            description="Connect to Firebase using your project credentials"
          />

          {/* Live Data Display */}
          {firebase.isConnected && (
            <Card>
              <CardHeader>
                <CardTitle>Live Firebase Data</CardTitle>
                <CardDescription>Real data from your Firebase project</CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Projects ({projects.length})</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {projects.slice(0, 3).map((project, index) => (
                        <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                          <div className="font-medium">{project.displayName || project.name}</div>
                          <div className="text-gray-500">{project.id}</div>
                        </div>
                      ))}
                      {projects.length > 3 && (
                        <div className="text-xs text-gray-500">...and {projects.length - 3} more</div>
                      )}
                    </div>
                  </div>
                )}

                {collections.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Collections ({collections.length})</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {collections.slice(0, 5).map((collection, index) => (
                        <div 
                          key={index} 
                          className="text-sm p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                          onClick={() => handleFetchDocuments(collection.name)}
                        >
                          <div className="font-medium">{collection.name}</div>
                          <div className="text-gray-500">{collection.documentCount} documents</div>
                        </div>
                      ))}
                      {collections.length > 5 && (
                        <div className="text-xs text-gray-500">...and {collections.length - 5} more</div>
                      )}
                    </div>
                  </div>
                )}

                {documents.length > 0 && selectedCollection && (
                  <div>
                    <h4 className="font-medium mb-2">Documents from "{selectedCollection}" ({documents.length})</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {documents.slice(0, 3).map((doc, index) => (
                        <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                          <div className="font-medium">{doc.customerName || doc.firstName || doc.name || `Document ${index + 1}`}</div>
                          <div className="text-gray-500">{doc.id}</div>
                        </div>
                      ))}
                      {documents.length > 3 && (
                        <div className="text-xs text-gray-500">...and {documents.length - 3} more</div>
                      )}
                    </div>
                  </div>
                )}

                {firebase.isConnected && projects.length === 0 && collections.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p>Click "Refresh Projects" to fetch live data</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle>Connection Status</CardTitle>
              <CardDescription>Real-time connection information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">MCP Status:</span>
                <Badge variant={firebase.isConnected ? "default" : "outline"} className={firebase.isConnected ? "bg-green-500" : ""}>
                  {firebase.isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Auth Status:</span>
                <Badge variant={firebaseState.user ? "default" : "outline"} className={firebaseState.user ? "bg-blue-500" : ""}>
                  {firebaseState.user ? "Authenticated" : "Not Authenticated"}
                </Badge>
              </div>
              {firebase.lastSync && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Last Sync:</span>
                  <span className="text-sm text-gray-500">
                    {new Date(firebase.lastSync).toLocaleString()}
                  </span>
                </div>
              )}
              {firebase.connectionId && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Connection ID:</span>
                  <span className="text-xs text-gray-500 font-mono">
                    {firebase.connectionId.substring(0, 8)}...
                  </span>
                </div>
              )}
              {firebaseState.userProfile && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">User Role:</span>
                  <Badge variant="outline">
                    {firebaseState.userProfile.role}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Collection Mapping */}
          <Card>
            <CardHeader>
              <CardTitle>Collection Mapping</CardTitle>
              <CardDescription>Configure how Firestore collections map to your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="map-users" defaultChecked />
                  <Label htmlFor="map-users">Map Users Collection</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="map-projects" defaultChecked />
                  <Label htmlFor="map-projects">Map Projects Collection</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="map-customers" defaultChecked />
                  <Label htmlFor="map-customers">Map Customers Collection</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="map-leads" defaultChecked />
                  <Label htmlFor="map-leads">Map Leads Collection</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="map-analytics" />
                  <Label htmlFor="map-analytics">Map Analytics Collection</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Mapping
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Security Warning</AlertTitle>
        <AlertDescription>
          Make sure your Firebase security rules are properly configured to prevent unauthorized access.
        </AlertDescription>
      </Alert>
    </div>
  );
};

// Super Admin Panel Component
const SuperAdminPanel = () => {
  const { state, signOut } = useFirebase();
  const [globalGHLKey, setGlobalGHLKey] = useState('');
  const [globalLocationId, setGlobalLocationId] = useState('');
  const [isSettingGlobal, setIsSettingGlobal] = useState(false);

  const handleSetGlobalGHL = async () => {
    setIsSettingGlobal(true);
    try {
      // Here you would save the global GHL settings to Firestore
      // for all users to inherit
      console.log('Setting global GHL config:', { globalGHLKey, globalLocationId });
      // TODO: Implement global config save to Firestore
      alert('Global GHL configuration saved successfully!');
    } catch (error) {
      console.error('Error setting global config:', error);
      alert('Failed to save global configuration');
    } finally {
      setIsSettingGlobal(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* User Profile Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Crown className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="font-medium flex items-center gap-2">
                  {state.userProfile?.firstName} {state.userProfile?.lastName}
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    <Crown className="h-3 w-3 mr-1" />
                    Super Admin
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">{state.user?.email}</div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Global Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Global Integration Settings
          </CardTitle>
          <CardDescription>
            Configure integrations for all users in the organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Super Admin Access</AlertTitle>
            <AlertDescription>
              These settings will be applied to all users. Individual users can override these settings if needed.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <Label htmlFor="globalGHLKey">Global GHL API Key</Label>
              <Input
                id="globalGHLKey"
                type="password"
                placeholder="Enter organization GHL API key"
                value={globalGHLKey}
                onChange={(e) => setGlobalGHLKey(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="globalLocationId">Default Location ID</Label>
              <Input
                id="globalLocationId"
                placeholder="Enter default location ID"
                value={globalLocationId}
                onChange={(e) => setGlobalLocationId(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleSetGlobalGHL} 
              disabled={isSettingGlobal || !globalGHLKey.trim()}
              className="w-full"
            >
              {isSettingGlobal ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving Global Configuration...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Global GHL Configuration
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Context7 Demo Component
const Context7Demo = () => {
  const [selectedLibrary, setSelectedLibrary] = useState('');
  const [libraryDocs, setLibraryDocs] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const popularLibraries = [
    'react',
    'nextjs', 
    'firebase',
    'mongodb',
    'express',
    'tailwindcss',
    'typescript',
    'nodejs'
  ];

  const handleGetDocs = async () => {
    if (!selectedLibrary.trim()) {
      alert('Please enter a library name');
      return;
    }

    setIsLoading(true);
    try {
      // Here you would call the Context7 MCP to get library docs
      console.log('Getting docs for:', selectedLibrary);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLibraryDocs(`# ${selectedLibrary} Documentation\n\nThis is a demo of Context7 MCP integration.\n\nThe actual implementation would fetch real documentation from the Context7 service.`);
    } catch (error) {
      console.error('Error fetching docs:', error);
      alert('Failed to fetch documentation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Context7 MCP Demo
          </CardTitle>
          <CardDescription>
            Test the Context7 Model Context Protocol integration for fetching library documentation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="library">Library Name</Label>
            <Input
              id="library"
              placeholder="Enter library name (e.g., react, nextjs, firebase)"
              value={selectedLibrary}
              onChange={(e) => setSelectedLibrary(e.target.value)}
            />
          </div>

          <div>
            <Label>Popular Libraries</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {popularLibraries.map((lib) => (
                <Button
                  key={lib}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedLibrary(lib)}
                  className="text-xs"
                >
                  {lib}
                </Button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleGetDocs} 
            disabled={isLoading || !selectedLibrary.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Fetching Documentation...
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4 mr-2" />
                Get Documentation
              </>
            )}
          </Button>

          {libraryDocs && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documentation Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border overflow-auto max-h-96">
                  {libraryDocs}
                </pre>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Integrations Hub Main Component
const IntegrationsHub = () => {
  const { state } = useFirebase();
  const [activeTab, setActiveTab] = useState("ghl");
  const { ghl, coda, firebase, healthCheck } = useMCP();
  const [mcpHealth, setMcpHealth] = useState<{ status: string; message?: string } | null>(null);
  const [isUsingMockServer, setIsUsingMockServer] = useState(false);

  // Check if user is super admin (you can customize this logic)
  const isSuperAdmin = state.userProfile?.role === 'admin' || state.user?.email?.includes('admin');

  // Check MCP server health on mount
  useEffect(() => {
    const checkHealth = async () => {
      const health = await healthCheck();
      setMcpHealth(health);
      setIsUsingMockServer(mcpClient.isUsingMockServer());
    };
    checkHealth();
  }, [healthCheck]);

  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Integrations Hub</h1>
          <p className="text-gray-600">Connect and configure your tools and services</p>
        </div>
        <div className="flex items-center gap-4">
          {isUsingMockServer && (
            <Alert className="w-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Using Mock Server (Context7 MCP not available)
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full ${isSuperAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <TabsTrigger value="ghl" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            GHL Integration
          </TabsTrigger>
          <TabsTrigger value="context7" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Context7 Demo
          </TabsTrigger>
          {isSuperAdmin && (
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Super Admin
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="ghl" className="mt-6">
          <GHLIntegration />
        </TabsContent>

        <TabsContent value="context7" className="mt-6">
          <Context7Demo />
        </TabsContent>

        {isSuperAdmin && (
          <TabsContent value="admin" className="mt-6">
            <SuperAdminPanel />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default IntegrationsHub; 