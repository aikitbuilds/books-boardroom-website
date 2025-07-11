/**
 * ReadyMode Dialer Integration Configuration
 * 
 * Update these values with your actual ReadyMode Channel API URLs
 * to enable automatic lead posting to your dialer campaigns.
 */

export interface ReadyModeChannelConfig {
  id: string;
  name: string;
  apiUrl: string;
  description?: string;
  isActive: boolean;
  leadTypes?: string[]; // e.g., ['solar', 'hvac', 'roofing']
}

export interface LeadData {
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  customFields?: Record<string, unknown>;
}

export const READYMODE_CONFIG = {
  // Default/Primary Channel API URL
  // Format: https://<yourCRM_or_s2s>.readymode.com/lead-api/<YOURAPIENDPOINT>
  PRIMARY_API_URL: 'your_readymode_channel_api_url_here',
  
  // Multiple Campaign Channels
  CHANNELS: [
    {
      id: 'solar_warm',
      name: 'Solar Warm Leads',
      apiUrl: 'your_readymode_channel_api_url_here',
      description: 'Qualified solar leads for immediate outreach',
      isActive: false,
      leadTypes: ['solar']
    },
    {
      id: 'solar_cold',
      name: 'Solar Cold Leads',
      apiUrl: 'your_readymode_channel_api_url_here',
      description: 'Cold solar prospects for initial contact',
      isActive: false,
      leadTypes: ['solar']
    }
  ] as ReadyModeChannelConfig[],
  
  // API Configuration
  API_SETTINGS: {
    // Request timeout in milliseconds
    TIMEOUT: 30000,
    
    // Retry configuration
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    
    // Content-Type preference (will try both if needed)
    PREFERRED_CONTENT_TYPE: 'application/x-www-form-urlencoded' as 'application/x-www-form-urlencoded' | 'application/json',
    
    // Enable automatic fallback to JSON if form-encoded fails
    ENABLE_FORMAT_FALLBACK: true
  },
  
  // Lead Processing Settings
  LEAD_SETTINGS: {
    // Required fields validation
    REQUIRED_FIELDS: ['phone'],
    
    // Recommended fields to include when available
    RECOMMENDED_FIELDS: ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zip'],
    
    // Phone number validation
    VALIDATE_PHONE: true,
    
    // Lead deduplication window (hours)
    DEDUP_WINDOW: 24,
    
    // Enable lead validation before posting
    ENABLE_VALIDATION: true
  },
  
  // Monitoring and Logging
  MONITORING: {
    // Enable detailed logging
    ENABLE_LOGGING: true,
    
    // Log successful submissions
    LOG_SUCCESS: true,
    
    // Log failed submissions
    LOG_FAILURES: true,
    
    // Enable performance metrics
    TRACK_PERFORMANCE: true
  }
};

/**
 * Helper function to check if ReadyMode is properly configured
 */
export const isReadyModeConfigured = (): boolean => {
  const primaryConfigured = READYMODE_CONFIG.PRIMARY_API_URL !== 'your_readymode_channel_api_url_here' &&
                           READYMODE_CONFIG.PRIMARY_API_URL.includes('readymode.com');
  
  const channelsConfigured = READYMODE_CONFIG.CHANNELS.some(channel => 
    channel.apiUrl !== 'your_readymode_channel_api_url_here' && 
    channel.apiUrl.includes('readymode.com') &&
    channel.isActive
  );
  
  return primaryConfigured || channelsConfigured;
};

/**
 * Get all active ReadyMode channels
 */
export const getActiveChannels = (): ReadyModeChannelConfig[] => {
  return READYMODE_CONFIG.CHANNELS.filter(channel => channel.isActive);
};

/**
 * Get channel by ID
 */
export const getChannelById = (channelId: string): ReadyModeChannelConfig | undefined => {
  return READYMODE_CONFIG.CHANNELS.find(channel => channel.id === channelId);
};

/**
 * Get channels for specific lead type
 */
export const getChannelsForLeadType = (leadType: string): ReadyModeChannelConfig[] => {
  return READYMODE_CONFIG.CHANNELS.filter(channel => 
    channel.isActive && 
    (!channel.leadTypes || channel.leadTypes.includes(leadType))
  );
};

/**
 * Get the effective API URL (from environment or config)
 */
export const getReadyModeApiUrl = (channelId?: string): string => {
  // Try environment variable first
  if (channelId) {
    const envVar = `VITE_READYMODE_${channelId.toUpperCase()}_API_URL`;
    const envUrl = import.meta.env[envVar];
    if (envUrl) return envUrl;
    
    // Fallback to config
    const channel = getChannelById(channelId);
    if (channel) return channel.apiUrl;
  }
  
  // Try primary environment variable
  const primaryEnvUrl = import.meta.env.VITE_READYMODE_PRIMARY_API_URL;
  if (primaryEnvUrl) return primaryEnvUrl;
  
  // Fallback to primary config
  return READYMODE_CONFIG.PRIMARY_API_URL;
};

/**
 * Validate ReadyMode API URL format
 */
export const validateApiUrl = (url: string): boolean => {
  const urlRegex = /^https:\/\/[a-zA-Z0-9._-]+\.readymode\.com\/lead-api\/[a-zA-Z0-9]+\/?$/;
  return urlRegex.test(url);
};

/**
 * Format lead data for ReadyMode API
 */
export const formatLeadForReadyMode = (leadData: LeadData): Record<string, unknown> => {
  const formatted: Record<string, unknown> = {};
  
  // Map standard fields
  if (leadData.phone) formatted['lead[0][phone]'] = leadData.phone;
  if (leadData.firstName) formatted['lead[0][firstName]'] = leadData.firstName;
  if (leadData.lastName) formatted['lead[0][lastName]'] = leadData.lastName;
  if (leadData.email) formatted['lead[0][email]'] = leadData.email;
  if (leadData.address) formatted['lead[0][address]'] = leadData.address;
  if (leadData.city) formatted['lead[0][city]'] = leadData.city;
  if (leadData.state) formatted['lead[0][state]'] = leadData.state;
  if (leadData.zip) formatted['lead[0][zip]'] = leadData.zip;
  
  // Map custom fields
  if (leadData.customFields) {
    Object.entries(leadData.customFields).forEach(([key, value]) => {
      formatted[`lead[0][${key}]`] = value;
    });
  }
  
  return formatted;
};

/**
 * Setup instructions for ReadyMode integration
 */
export const READYMODE_SETUP_INSTRUCTIONS = {
  title: "ReadyMode Integration Setup",
  steps: [
    "1. Log into your ReadyMode account",
    "2. Navigate to Channel Management",
    "3. Create a new channel or select an existing one",
    "4. Copy the Channel API Endpoint URL",
    "5. Update the CHANNELS array in src/config/readymode-config.ts",
    "6. Set isActive: true for the channels you want to use",
    "7. Optionally, set environment variables for sensitive URLs",
    "8. Save the file and restart your development server"
  ],
  note: "Each channel can be configured for different lead types and campaigns.",
  urlFormat: "https://<yourCRM_or_s2s>.readymode.com/lead-api/<YOURAPIENDPOINT>",
  envExample: `# .env.local example
VITE_READYMODE_PRIMARY_API_URL=https://s2s.readymode.com/lead-api/aBcDeFgHiJkL
VITE_READYMODE_SOLAR_WARM_API_URL=https://s2s.readymode.com/lead-api/MnOpQrStUvWx`
}; 