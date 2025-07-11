/**
 * Go High Level (GHL) API Configuration
 * 
 * Update these values with your actual GHL API credentials
 * to enable automatic integration.
 */

export const GHL_CONFIG = {
  // Your GHL API Key - Get this from GHL Settings → API Keys
  API_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlFSTXpVV05kbkJwcmFuTjR1NzFMIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ1NTEzMjEzMzcyLCJzdWIiOiJwbFdmN0lWeUZ0emxMNFZIOUd0ZSJ9.cKe82HwiExP5ZD-1puzGENASiRqAFZ4Q-zByIMfH7aM',
  
  // Your GHL Location ID (extracted from the JWT token)
  LOCATION_ID: 'QRMzUWNdnBpranN4u71L',
  
  // GHL API Base URL (usually doesn't need to be changed)
  API_BASE_URL: 'https://services.leadconnectorhq.com',
  
  // Auto-connect when valid credentials are available
  AUTO_CONNECT: true,
  
  // Sync settings
  SYNC_SETTINGS: {
    // How often to sync data (in minutes)
    SYNC_INTERVAL: 15,
    
    // Batch size for data sync
    BATCH_SIZE: 100,
    
    // Enable real-time sync
    REAL_TIME_SYNC: true,
    
    // What to sync
    SYNC_CONTACTS: true,
    SYNC_OPPORTUNITIES: true,
    SYNC_PIPELINES: false
  }
};

/**
 * Helper function to check if GHL is properly configured
 */
export const isGHLConfigured = (): boolean => {
  return (
    GHL_CONFIG.API_KEY !== 'your_ghl_api_key_here' &&
    GHL_CONFIG.API_KEY.length > 10
  );
};

/**
 * Get the effective API key (from config or environment)
 */
export const getGHLApiKey = (): string => {
  // Try environment variable first, then config file
  return import.meta.env.VITE_GHL_API_KEY || GHL_CONFIG.API_KEY;
};

/**
 * Get the effective location ID (from config or environment)
 */
export const getGHLLocationId = (): string => {
  // Try environment variable first, then config file
  return import.meta.env.VITE_GHL_LOCATION_ID || GHL_CONFIG.LOCATION_ID;
};

/**
 * Instructions for setup
 */
export const SETUP_INSTRUCTIONS = {
  title: "GHL Integration Setup",
  steps: [
    "1. Log into your Go High Level account",
    "2. Navigate to Settings → API Keys",
    "3. Create a new API key or copy an existing one",
    "4. Update the API_KEY value in src/config/ghl-config.ts",
    "5. Optionally, set your LOCATION_ID in the same file",
    "6. Save the file and restart your development server"
  ],
  note: "The integration will automatically connect when valid credentials are detected."
}; 