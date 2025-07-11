import * as admin from 'firebase-admin';
import axios, { AxiosResponse, AxiosError } from 'axios';
import * as qs from 'querystring';
import { 
  ReadyModeApiRequest, 
  ReadyModeApiResponse, 
  ReadyModeLeadData, 
  ReadyModeSubmissionLog,
  ReadyModeSuccessResponse,
  ReadyModeErrorResponse 
} from './types';
import { ReadyModeValidator } from './validator';

/**
 * ReadyMode API Service
 * Handles lead posting to ReadyMode dialer system
 */
export class ReadyModeService {
  private static instance: ReadyModeService;
  private db: admin.firestore.Firestore;

  constructor() {
    this.db = admin.firestore();
  }

  static getInstance(): ReadyModeService {
    if (!ReadyModeService.instance) {
      ReadyModeService.instance = new ReadyModeService();
    }
    return ReadyModeService.instance;
  }

  /**
   * Send lead to ReadyMode with automatic format fallback
   */
  async sendLead(request: ReadyModeApiRequest): Promise<ReadyModeApiResponse> {
    const startTime = Date.now();
    let retryCount = 0;
    const maxRetries = request.options?.retries || 3;

    // Validate lead data
    const validation = ReadyModeValidator.validateLead(request.leadData);
    if (!validation.isValid) {
      const errorResponse: ReadyModeErrorResponse = {
        success: false,
        error: `Validation failed: ${validation.errors.map(e => e.message).join(', ')}`,
        field: validation.errors[0]?.field,
        timestamp: new Date().toISOString()
      };
      await this.logSubmission(request, errorResponse, Date.now() - startTime, retryCount);
      return errorResponse;
    }

    const sanitizedData = validation.sanitizedData!;

    // Check for duplicates if enabled
    if (process.env.READYMODE_CHECK_DUPLICATES === 'true') {
      const isDuplicate = await this.checkForDuplicate(sanitizedData.phone);
      if (isDuplicate) {
        const errorResponse: ReadyModeErrorResponse = {
          success: false,
          error: 'Duplicate lead detected within deduplication window',
          field: 'phone',
          code: 'DUPLICATE_LEAD',
          timestamp: new Date().toISOString()
        };
        await this.logSubmission(request, errorResponse, Date.now() - startTime, retryCount);
        return errorResponse;
      }
    }

    // Determine API URL
    const apiUrl = request.apiUrl || this.getChannelApiUrl(request.channelId);
    if (!apiUrl || apiUrl === 'your_readymode_channel_api_url_here') {
      const errorResponse: ReadyModeErrorResponse = {
        success: false,
        error: 'ReadyMode API URL not configured',
        code: 'CONFIG_ERROR',
        timestamp: new Date().toISOString()
      };
      await this.logSubmission(request, errorResponse, Date.now() - startTime, retryCount);
      return errorResponse;
    }

    // Try posting with retry logic
    while (retryCount <= maxRetries) {
      try {
        const response = await this.postLead(sanitizedData, apiUrl, request.options);
        await this.logSubmission(request, response, Date.now() - startTime, retryCount);
        return response;
      } catch (error) {
        retryCount++;
        
        if (retryCount > maxRetries) {
          const errorResponse: ReadyModeErrorResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            code: 'API_ERROR',
            timestamp: new Date().toISOString()
          };
          await this.logSubmission(request, errorResponse, Date.now() - startTime, retryCount);
          return errorResponse;
        }

        // Wait before retry
        await this.delay(1000 * retryCount);
      }
    }

    // This should never be reached, but TypeScript requires it
    const errorResponse: ReadyModeErrorResponse = {
      success: false,
      error: 'Maximum retries exceeded',
      code: 'MAX_RETRIES',
      timestamp: new Date().toISOString()
    };
    return errorResponse;
  }

  /**
   * Post lead to ReadyMode API with format fallback
   */
  private async postLead(
    leadData: ReadyModeLeadData, 
    apiUrl: string, 
    options?: ReadyModeApiRequest['options']
  ): Promise<ReadyModeApiResponse> {
    const timeout = options?.timeout || 30000;
    const preferredFormat = options?.contentType || 'application/x-www-form-urlencoded';

    // Try preferred format first
    try {
      return await this.makeApiRequest(leadData, apiUrl, preferredFormat, timeout);
    } catch (error) {
      // If fallback is enabled and we tried form-encoded, try JSON
      if (process.env.READYMODE_ENABLE_FORMAT_FALLBACK === 'true' && 
          preferredFormat === 'application/x-www-form-urlencoded') {
        console.log('Form-encoded request failed, attempting JSON fallback');
        return await this.makeApiRequest(leadData, apiUrl, 'application/json', timeout);
      }
      throw error;
    }
  }

  /**
   * Make HTTP request to ReadyMode API
   */
  private async makeApiRequest(
    leadData: ReadyModeLeadData,
    apiUrl: string,
    contentType: 'application/x-www-form-urlencoded' | 'application/json',
    timeout: number
  ): Promise<ReadyModeApiResponse> {
    let data: string | object;
    let headers: Record<string, string>;

    if (contentType === 'application/x-www-form-urlencoded') {
      // Format data as form-encoded with lead[0][field] structure
      const formData = this.formatLeadForFormPost(leadData);
      data = qs.stringify(formData);
      headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    } else {
      // Format data as JSON
      data = { lead: [leadData] };
      headers = { 'Content-Type': 'application/json' };
    }

    try {
      const response: AxiosResponse = await axios.post(apiUrl, data, {
        headers,
        timeout,
        validateStatus: () => true // Don't throw on HTTP error status
      });

      return this.parseReadyModeResponse(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        throw new Error(`HTTP ${axiosError.response?.status || 'unknown'}: ${axiosError.message}`);
      }
      throw error;
    }
  }

  /**
   * Format lead data for form POST (lead[0][field] structure)
   */
  private formatLeadForFormPost(leadData: ReadyModeLeadData): Record<string, string> {
    const formatted: Record<string, string> = {};

    // Standard fields
    if (leadData.phone) formatted['lead[0][phone]'] = leadData.phone;
    if (leadData.firstName) formatted['lead[0][firstName]'] = leadData.firstName;
    if (leadData.lastName) formatted['lead[0][lastName]'] = leadData.lastName;
    if (leadData.email) formatted['lead[0][email]'] = leadData.email;
    if (leadData.address) formatted['lead[0][address]'] = leadData.address;
    if (leadData.city) formatted['lead[0][city]'] = leadData.city;
    if (leadData.state) formatted['lead[0][state]'] = leadData.state;
    if (leadData.zip) formatted['lead[0][zip]'] = leadData.zip;

    // Custom fields
    if (leadData.customFields) {
      Object.entries(leadData.customFields).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formatted[`lead[0][${key}]`] = String(value);
        }
      });
    }

    return formatted;
  }

  /**
   * Parse ReadyMode API response
   */
  private parseReadyModeResponse(response: AxiosResponse): ReadyModeApiResponse {
    const timestamp = new Date().toISOString();

    // Handle non-200 status codes
    if (response.status < 200 || response.status >= 300) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        code: `HTTP_${response.status}`,
        timestamp
      };
    }

    // Parse JSON response
    let responseData: Record<string, unknown>;
    try {
      responseData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    } catch (error) {
      return {
        success: false,
        error: 'Invalid JSON response from ReadyMode API',
        code: 'INVALID_JSON',
        timestamp
      };
    }

    // Check for success indicator
    if (responseData.success === true || responseData.xencall_leadId) {
      return {
        success: true,
        xencall_leadId: String(responseData.xencall_leadId || responseData.leadId || 'unknown'),
        message: responseData.message ? String(responseData.message) : undefined,
        timestamp
      };
    }

    // Handle error response
    return {
      success: false,
      error: String(responseData.error || responseData.message || 'Unknown error from ReadyMode API'),
      field: responseData.field ? String(responseData.field) : undefined,
      code: responseData.code ? String(responseData.code) : undefined,
      timestamp
    };
  }

  /**
   * Get channel API URL from environment or config
   */
  private getChannelApiUrl(channelId?: string): string {
    if (channelId) {
      const envVar = `READYMODE_${channelId.toUpperCase()}_API_URL`;
      const envUrl = process.env[envVar];
      if (envUrl) return envUrl;
    }

    return process.env.READYMODE_PRIMARY_API_URL || '';
  }

  /**
   * Check for duplicate leads
   */
  private async checkForDuplicate(phone: string): Promise<boolean> {
    try {
      const windowHours = parseInt(process.env.READYMODE_DEDUP_WINDOW || '24');
      const since = new Date(Date.now() - (windowHours * 60 * 60 * 1000));

      const query = await this.db
        .collection('readymode_submissions')
        .where('leadData.phone', '==', phone)
        .where('timestamp', '>=', since.toISOString())
        .limit(1)
        .get();

      return !query.empty;
    } catch (error) {
      console.warn('Error checking for duplicates:', error);
      return false; // Don't block submission on duplicate check failure
    }
  }

  /**
   * Log submission to Firestore
   */
  private async logSubmission(
    request: ReadyModeApiRequest,
    response: ReadyModeApiResponse,
    processingTime: number,
    retryCount: number
  ): Promise<void> {
    if (process.env.READYMODE_ENABLE_LOGGING !== 'true') return;

    try {
      const log: ReadyModeSubmissionLog = {
        id: this.generateLogId(),
        leadData: request.leadData,
        channelId: request.channelId,
        apiUrl: request.apiUrl || this.getChannelApiUrl(request.channelId),
        response,
        timestamp: new Date().toISOString(),
        processingTime,
        retryCount
      };

      await this.db.collection('readymode_submissions').add(log);
    } catch (error) {
      console.error('Error logging ReadyMode submission:', error);
    }
  }

  /**
   * Generate unique log ID
   */
  private generateLogId(): string {
    return `rm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Delay helper for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
} 