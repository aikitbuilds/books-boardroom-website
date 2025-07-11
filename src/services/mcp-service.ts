/**
 * MCP Service
 * 
 * This service handles interactions with Model Context Protocol (MCP) servers.
 * It provides methods for using MCP tools and accessing MCP resources.
 */

import { auth } from '../lib/firebase';

/**
 * Interface for MCP tool arguments
 */
interface MCPToolArguments {
  [key: string]: any;
}

/**
 * Interface for MCP tool response
 */
interface MCPToolResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Interface for MCP resource response
 */
interface MCPResourceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * MCP Service class for interacting with MCP servers
 */
export class MCPService {
  private baseUrl: string;
  
  /**
   * Constructor
   * @param baseUrl Base URL for MCP API endpoints
   */
  constructor(baseUrl: string = '/api/mcp') {
    this.baseUrl = baseUrl;
  }
  
  /**
   * Get authentication token for MCP requests
   * @returns Promise resolving to authentication token
   */
  private async getAuthToken(): Promise<string> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const token = await currentUser.getIdToken();
    return token;
  }
  
  /**
   * Use an MCP tool
   * @param serverName Name of the MCP server
   * @param toolName Name of the tool to use
   * @param args Tool arguments
   * @returns Promise resolving to tool response
   */
  async useTool<T = any>(
    serverName: string,
    toolName: string,
    args: MCPToolArguments
  ): Promise<MCPToolResponse<T>> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${this.baseUrl}/${serverName}/tools/${toolName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(args)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: {
            code: errorData.code || 'unknown_error',
            message: errorData.message || 'An unknown error occurred',
            details: errorData.details
          }
        };
      }
      
      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'request_failed',
          message: error.message || 'Request failed',
          details: error
        }
      };
    }
  }
  
  /**
   * Access an MCP resource
   * @param serverName Name of the MCP server
   * @param uri Resource URI
   * @returns Promise resolving to resource response
   */
  async accessResource<T = any>(
    serverName: string,
    uri: string
  ): Promise<MCPResourceResponse<T>> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${this.baseUrl}/${serverName}/resources${uri}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: {
            code: errorData.code || 'unknown_error',
            message: errorData.message || 'An unknown error occurred',
            details: errorData.details
          }
        };
      }
      
      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'request_failed',
          message: error.message || 'Request failed',
          details: error
        }
      };
    }
  }
  
  /**
   * Get available MCP servers
   * @returns Promise resolving to list of available MCP servers
   */
  async getServers(): Promise<MCPResourceResponse<Array<{
    name: string;
    displayName: string;
    description: string;
    tools: Array<{
      name: string;
      displayName: string;
      description: string;
    }>;
    resources: Array<{
      name: string;
      displayName: string;
      description: string;
      uriTemplate: string;
    }>;
  }>>> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${this.baseUrl}/servers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: {
            code: errorData.code || 'unknown_error',
            message: errorData.message || 'An unknown error occurred',
            details: errorData.details
          }
        };
      }
      
      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'request_failed',
          message: error.message || 'Request failed',
          details: error
        }
      };
    }
  }
  
  /**
   * Get tools for a specific MCP server
   * @param serverName Name of the MCP server
   * @returns Promise resolving to list of available tools
   */
  async getServerTools(serverName: string): Promise<MCPResourceResponse<Array<{
    name: string;
    displayName: string;
    description: string;
    inputSchema: any;
  }>>> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${this.baseUrl}/${serverName}/tools`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: {
            code: errorData.code || 'unknown_error',
            message: errorData.message || 'An unknown error occurred',
            details: errorData.details
          }
        };
      }
      
      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'request_failed',
          message: error.message || 'Request failed',
          details: error
        }
      };
    }
  }
  
  /**
   * Get resources for a specific MCP server
   * @param serverName Name of the MCP server
   * @returns Promise resolving to list of available resources
   */
  async getServerResources(serverName: string): Promise<MCPResourceResponse<Array<{
    name: string;
    displayName: string;
    description: string;
    uriTemplate: string;
  }>>> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${this.baseUrl}/${serverName}/resources`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: {
            code: errorData.code || 'unknown_error',
            message: errorData.message || 'An unknown error occurred',
            details: errorData.details
          }
        };
      }
      
      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'request_failed',
          message: error.message || 'Request failed',
          details: error
        }
      };
    }
  }
}

// Create and export a singleton instance of the MCP service
export const mcpService = new MCPService();

// Export types
export type { MCPToolArguments, MCPToolResponse, MCPResourceResponse };
