import { useState, useEffect, useCallback } from 'react';
import { mcpClient } from '@/lib/mcp-client';

interface MCPConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  lastSync: string | null;
  connectionId: string | null;
}

interface MCPHookReturn {
  // Connection states
  ghl: MCPConnectionState;
  coda: MCPConnectionState;
  firebase: MCPConnectionState;
  
  // Connection methods
  connectGHL: (apiKey: string, locationId?: string) => Promise<boolean>;
  connectCoda: (apiKey: string, docId?: string) => Promise<boolean>;
  connectFirebase: (projectId: string, credentials?: any) => Promise<boolean>;
  
  // Data fetching methods
  fetchGHLLocations: () => Promise<any[]>;
  fetchGHLContacts: (locationId?: string) => Promise<any[]>;
  fetchGHLOpportunities: (locationId?: string, pipelineId?: string) => Promise<any[]>;
  fetchCodaDocs: () => Promise<any[]>;
  fetchFirebaseProjects: () => Promise<any[]>;
  fetchFirebaseCollections: (projectId?: string) => Promise<any[]>;
  fetchFirebaseDocuments: (collectionPath: string, projectId?: string) => Promise<any[]>;
  
  // Utility methods
  disconnect: (service: string) => void;
  refreshConnections: () => void;
  healthCheck: () => Promise<any>;
}

const initialConnectionState: MCPConnectionState = {
  isConnected: false,
  isConnecting: false,
  error: null,
  lastSync: null,
  connectionId: null,
};

export const useMCP = (): MCPHookReturn => {
  const [ghl, setGHL] = useState<MCPConnectionState>(initialConnectionState);
  const [coda, setCoda] = useState<MCPConnectionState>(initialConnectionState);
  const [firebase, setFirebase] = useState<MCPConnectionState>(initialConnectionState);

  // Initialize connections from localStorage on mount
  useEffect(() => {
    const savedConnections = localStorage.getItem('mcp-connections');
    if (savedConnections) {
      try {
        const connections = JSON.parse(savedConnections);
        
        if (connections.ghl) {
          setGHL(prev => ({
            ...prev,
            isConnected: true,
            connectionId: connections.ghl.connectionId,
            lastSync: connections.ghl.connectedAt,
          }));
        }
        
        if (connections.coda) {
          setCoda(prev => ({
            ...prev,
            isConnected: true,
            connectionId: connections.coda.connectionId,
            lastSync: connections.coda.connectedAt,
          }));
        }
        
        if (connections.firebase) {
          setFirebase(prev => ({
            ...prev,
            isConnected: true,
            connectionId: connections.firebase.connectionId,
            lastSync: connections.firebase.connectedAt,
          }));
        }
      } catch (error) {
        console.error('Error loading saved connections:', error);
      }
    }
  }, []);

  // Save connections to localStorage
  const saveConnections = useCallback(() => {
    const connections = mcpClient.getAllConnections();
    localStorage.setItem('mcp-connections', JSON.stringify(connections));
  }, []);

  // GHL Connection
  const connectGHL = useCallback(async (apiKey: string, locationId?: string): Promise<boolean> => {
    setGHL(prev => ({ ...prev, isConnecting: true, error: null }));
    
    try {
      const result = await mcpClient.connectGHL(apiKey, locationId);
      
      if (result.success) {
        setGHL({
          isConnected: true,
          isConnecting: false,
          error: null,
          lastSync: new Date().toISOString(),
          connectionId: result.data?.connectionId || null,
        });
        saveConnections();
        return true;
      } else {
        setGHL(prev => ({
          ...prev,
          isConnecting: false,
          error: result.error || 'Connection failed',
        }));
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setGHL(prev => ({
        ...prev,
        isConnecting: false,
        error: errorMessage,
      }));
      return false;
    }
  }, [saveConnections]);

  // Coda Connection
  const connectCoda = useCallback(async (apiKey: string, docId?: string): Promise<boolean> => {
    setCoda(prev => ({ ...prev, isConnecting: true, error: null }));
    
    try {
      const result = await mcpClient.connectCoda(apiKey, docId);
      
      if (result.success) {
        setCoda({
          isConnected: true,
          isConnecting: false,
          error: null,
          lastSync: new Date().toISOString(),
          connectionId: result.data?.connectionId || null,
        });
        saveConnections();
        return true;
      } else {
        setCoda(prev => ({
          ...prev,
          isConnecting: false,
          error: result.error || 'Connection failed',
        }));
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setCoda(prev => ({
        ...prev,
        isConnecting: false,
        error: errorMessage,
      }));
      return false;
    }
  }, [saveConnections]);

  // Firebase Connection
  const connectFirebase = useCallback(async (projectId: string, credentials?: any): Promise<boolean> => {
    setFirebase(prev => ({ ...prev, isConnecting: true, error: null }));
    
    try {
      const result = await mcpClient.connectFirebase(projectId, credentials);
      
      if (result.success) {
        setFirebase({
          isConnected: true,
          isConnecting: false,
          error: null,
          lastSync: new Date().toISOString(),
          connectionId: result.data?.connectionId || null,
        });
        saveConnections();
        return true;
      } else {
        setFirebase(prev => ({
          ...prev,
          isConnecting: false,
          error: result.error || 'Connection failed',
        }));
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setFirebase(prev => ({
        ...prev,
        isConnecting: false,
        error: errorMessage,
      }));
      return false;
    }
  }, [saveConnections]);

  // Data fetching methods
  const fetchGHLLocations = useCallback(async (): Promise<any[]> => {
    try {
      const result = await mcpClient.listGHLLocations();
      if (result.success) {
        setGHL(prev => ({ ...prev, lastSync: new Date().toISOString() }));
        return result.data || [];
      } else {
        setGHL(prev => ({ ...prev, error: result.error || 'Failed to fetch locations' }));
        return [];
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setGHL(prev => ({ ...prev, error: errorMessage }));
      return [];
    }
  }, []);

  const fetchGHLContacts = useCallback(async (locationId?: string): Promise<any[]> => {
    try {
      const result = await mcpClient.listGHLContacts(locationId);
      if (result.success) {
        setGHL(prev => ({ ...prev, lastSync: new Date().toISOString() }));
        return result.data || [];
      } else {
        setGHL(prev => ({ ...prev, error: result.error || 'Failed to fetch contacts' }));
        return [];
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setGHL(prev => ({ ...prev, error: errorMessage }));
      return [];
    }
  }, []);

  const fetchGHLOpportunities = useCallback(async (locationId?: string, pipelineId?: string): Promise<any[]> => {
    try {
      const result = await mcpClient.listGHLOpportunities(locationId, pipelineId);
      if (result.success) {
        setGHL(prev => ({ ...prev, lastSync: new Date().toISOString() }));
        return result.data || [];
      } else {
        setGHL(prev => ({ ...prev, error: result.error || 'Failed to fetch opportunities' }));
        return [];
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setGHL(prev => ({ ...prev, error: errorMessage }));
      return [];
    }
  }, []);

  const fetchCodaDocs = useCallback(async (): Promise<any[]> => {
    try {
      const result = await mcpClient.listCodaDocs();
      if (result.success) {
        setCoda(prev => ({ ...prev, lastSync: new Date().toISOString() }));
        return result.data || [];
      } else {
        setCoda(prev => ({ ...prev, error: result.error || 'Failed to fetch documents' }));
        return [];
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setCoda(prev => ({ ...prev, error: errorMessage }));
      return [];
    }
  }, []);

  const fetchFirebaseProjects = useCallback(async (): Promise<any[]> => {
    try {
      const result = await mcpClient.listFirebaseProjects();
      if (result.success) {
        setFirebase(prev => ({ ...prev, lastSync: new Date().toISOString() }));
        return result.data || [];
      } else {
        setFirebase(prev => ({ ...prev, error: result.error || 'Failed to fetch projects' }));
        return [];
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setFirebase(prev => ({ ...prev, error: errorMessage }));
      return [];
    }
  }, []);

  const fetchFirebaseCollections = useCallback(async (projectId?: string): Promise<any[]> => {
    try {
      const result = await mcpClient.getFirebaseCollections(projectId);
      if (result.success) {
        setFirebase(prev => ({ ...prev, lastSync: new Date().toISOString() }));
        return result.data || [];
      } else {
        setFirebase(prev => ({ ...prev, error: result.error || 'Failed to fetch collections' }));
        return [];
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setFirebase(prev => ({ ...prev, error: errorMessage }));
      return [];
    }
  }, []);

  const fetchFirebaseDocuments = useCallback(async (collectionPath: string, projectId?: string): Promise<any[]> => {
    try {
      const result = await mcpClient.getFirebaseDocuments(collectionPath, projectId);
      if (result.success) {
        setFirebase(prev => ({ ...prev, lastSync: new Date().toISOString() }));
        return result.data || [];
      } else {
        setFirebase(prev => ({ ...prev, error: result.error || 'Failed to fetch documents' }));
        return [];
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setFirebase(prev => ({ ...prev, error: errorMessage }));
      return [];
    }
  }, []);

  // Utility methods
  const disconnect = useCallback((service: string) => {
    mcpClient.disconnect(service);
    
    switch (service) {
      case 'ghl':
        setGHL(initialConnectionState);
        break;
      case 'coda':
        setCoda(initialConnectionState);
        break;
      case 'firebase':
        setFirebase(initialConnectionState);
        break;
    }
    
    saveConnections();
  }, [saveConnections]);

  const refreshConnections = useCallback(() => {
    const connections = mcpClient.getAllConnections();
    
    setGHL(prev => ({
      ...prev,
      isConnected: mcpClient.isConnected('ghl'),
      lastSync: connections.ghl?.connectedAt || prev.lastSync,
    }));
    
    setCoda(prev => ({
      ...prev,
      isConnected: mcpClient.isConnected('coda'),
      lastSync: connections.coda?.connectedAt || prev.lastSync,
    }));
    
    setFirebase(prev => ({
      ...prev,
      isConnected: mcpClient.isConnected('firebase'),
      lastSync: connections.firebase?.connectedAt || prev.lastSync,
    }));
  }, []);

  const healthCheck = useCallback(async () => {
    try {
      const result = await mcpClient.healthCheck();
      return result;
    } catch (error) {
      console.error('Health check failed:', error);
      return { success: false, error: 'Health check failed' };
    }
  }, []);

  return {
    // Connection states
    ghl,
    coda,
    firebase,
    
    // Connection methods
    connectGHL,
    connectCoda,
    connectFirebase,
    
    // Data fetching methods
    fetchGHLLocations,
    fetchGHLContacts,
    fetchGHLOpportunities,
    fetchCodaDocs,
    fetchFirebaseProjects,
    fetchFirebaseCollections,
    fetchFirebaseDocuments,
    
    // Utility methods
    disconnect,
    refreshConnections,
    healthCheck,
  };
}; 