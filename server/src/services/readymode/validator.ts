import { ReadyModeLeadData, ReadyModeValidationResult, ReadyModeValidationError } from './types';

/**
 * ReadyMode Lead Data Validator
 */
export class ReadyModeValidator {
  private static readonly PHONE_REGEX = /^\+?1?[-.\s]?(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})$/;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly ZIP_REGEX = /^\d{5}(-\d{4})?$/;

  /**
   * Validate and sanitize lead data for ReadyMode submission
   */
  static validateLead(leadData: ReadyModeLeadData): ReadyModeValidationResult {
    const errors: ReadyModeValidationError[] = [];
    const sanitizedData: ReadyModeLeadData = { ...leadData };

    // Validate required fields
    if (!leadData.phone) {
      errors.push({
        field: 'phone',
        message: 'Phone number is required'
      });
    } else {
      // Validate and sanitize phone number
      const phoneResult = this.validateAndSanitizePhone(leadData.phone);
      if (!phoneResult.isValid) {
        errors.push({
          field: 'phone',
          message: phoneResult.error || 'Invalid phone number format',
          value: leadData.phone
        });
      } else {
        sanitizedData.phone = phoneResult.sanitized!;
      }
    }

    // Validate email if provided
    if (leadData.email) {
      const emailResult = this.validateEmail(leadData.email);
      if (!emailResult.isValid) {
        errors.push({
          field: 'email',
          message: emailResult.error || 'Invalid email format',
          value: leadData.email
        });
      } else {
        sanitizedData.email = emailResult.sanitized!;
      }
    }

    // Validate ZIP code if provided
    if (leadData.zip) {
      const zipResult = this.validateZip(leadData.zip);
      if (!zipResult.isValid) {
        errors.push({
          field: 'zip',
          message: zipResult.error || 'Invalid ZIP code format',
          value: leadData.zip
        });
      } else {
        sanitizedData.zip = zipResult.sanitized!;
      }
    }

    // Sanitize text fields
    if (leadData.firstName) {
      sanitizedData.firstName = this.sanitizeText(leadData.firstName);
    }
    if (leadData.lastName) {
      sanitizedData.lastName = this.sanitizeText(leadData.lastName);
    }
    if (leadData.address) {
      sanitizedData.address = this.sanitizeText(leadData.address);
    }
    if (leadData.city) {
      sanitizedData.city = this.sanitizeText(leadData.city);
    }
    if (leadData.state) {
      sanitizedData.state = this.sanitizeState(leadData.state);
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: errors.length === 0 ? sanitizedData : undefined
    };
  }

  /**
   * Validate and sanitize phone number
   */
  private static validateAndSanitizePhone(phone: string): { isValid: boolean; sanitized?: string; error?: string } {
    if (!phone || typeof phone !== 'string') {
      return { isValid: false, error: 'Phone number is required' };
    }

    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');

    // Handle US phone numbers
    if (digitsOnly.length === 10) {
      return { isValid: true, sanitized: digitsOnly };
    } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
      return { isValid: true, sanitized: digitsOnly.substring(1) };
    }

    return { isValid: false, error: 'Phone number must be 10 digits (US)' };
  }

  /**
   * Validate email address
   */
  private static validateEmail(email: string): { isValid: boolean; sanitized?: string; error?: string } {
    if (!email || typeof email !== 'string') {
      return { isValid: false, error: 'Email is required' };
    }

    const trimmed = email.trim().toLowerCase();
    if (!this.EMAIL_REGEX.test(trimmed)) {
      return { isValid: false, error: 'Invalid email format' };
    }

    return { isValid: true, sanitized: trimmed };
  }

  /**
   * Validate ZIP code
   */
  private static validateZip(zip: string): { isValid: boolean; sanitized?: string; error?: string } {
    if (!zip || typeof zip !== 'string') {
      return { isValid: false, error: 'ZIP code is required' };
    }

    const trimmed = zip.trim();
    if (!this.ZIP_REGEX.test(trimmed)) {
      return { isValid: false, error: 'Invalid ZIP code format (12345 or 12345-6789)' };
    }

    return { isValid: true, sanitized: trimmed };
  }

  /**
   * Sanitize text fields
   */
  private static sanitizeText(text: string): string {
    if (!text || typeof text !== 'string') return '';
    return text.trim().replace(/[<>]/g, ''); // Remove basic HTML chars
  }

  /**
   * Sanitize and validate state
   */
  private static sanitizeState(state: string): string {
    if (!state || typeof state !== 'string') return '';
    const trimmed = state.trim().toUpperCase();
    
    // If it's 2 characters, assume it's a state code
    if (trimmed.length === 2) {
      return trimmed;
    }
    
    // Try to convert common state names to codes
    const stateMap: Record<string, string> = {
      'CALIFORNIA': 'CA',
      'TEXAS': 'TX',
      'FLORIDA': 'FL',
      'NEW YORK': 'NY',
      'PENNSYLVANIA': 'PA',
      // Add more as needed
    };
    
    return stateMap[trimmed] || trimmed;
  }

  /**
   * Check for potential duplicate lead based on phone and timeframe
   */
  static async checkForDuplicate(
    phone: string, 
    windowHours: number = 24,
    // This would typically query your database/Firestore
    checkFunction?: (phone: string, since: Date) => Promise<boolean>
  ): Promise<boolean> {
    if (!checkFunction) return false;
    
    const since = new Date(Date.now() - (windowHours * 60 * 60 * 1000));
    return await checkFunction(phone, since);
  }
} 