// MCP Client stub for development
// This is a placeholder to prevent import errors

export const mcpClient = {
  initialize: async () => {
    console.log('MCP Client initialized (stub)');
    return true;
  },
  
  callTool: async (tool: string, args: any) => {
    console.log('MCP callTool (stub):', tool, args);
    return { success: true, data: {} };
  },
  
  isConnected: () => false,
  
  disconnect: async () => {
    console.log('MCP Client disconnected (stub)');
  }
};

export default mcpClient;