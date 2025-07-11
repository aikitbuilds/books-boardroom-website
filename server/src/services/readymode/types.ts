/**
 * TypeScript types for ReadyMode integration
 */

export interface ReadyModeLeadData {
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  customFields?: Record<string, unknown>;
  // GHL specific fields
  ghlContactId?: string;
  leadSource?: string;
  campaignId?: string;
}

export interface ReadyModeApiRequest {
  leadData: ReadyModeLeadData;
  channelId?: string;
  apiUrl?: string;
  options?: {
    contentType?: 'application/x-www-form-urlencoded' | 'application/json';
    timeout?: number;
    retries?: number;
  };
}

export interface ReadyModeSuccessResponse {
  success: true;
  xencall_leadId: string;
  message?: string;
  timestamp: string;
}

export interface ReadyModeErrorResponse {
  success: false;
  error: string;
  field?: string;
  code?: string;
  timestamp: string;
}

export type ReadyModeApiResponse = ReadyModeSuccessResponse | ReadyModeErrorResponse;

export interface ReadyModeSubmissionLog {
  id: string;
  leadData: ReadyModeLeadData;
  channelId?: string;
  apiUrl: string;
  response: ReadyModeApiResponse;
  timestamp: string;
  processingTime: number;
  retryCount: number;
}

export interface ReadyModeValidationError {
  field: string;
  message: string;
  value?: unknown;
}

export interface ReadyModeValidationResult {
  isValid: boolean;
  errors: ReadyModeValidationError[];
  sanitizedData?: ReadyModeLeadData;
} 