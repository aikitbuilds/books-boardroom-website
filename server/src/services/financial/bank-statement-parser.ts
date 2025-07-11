import { parse as parseCSV } from 'csv-parse';
import * as XLSX from 'xlsx';
import { parseOFX } from 'node-libofx';
import * as admin from 'firebase-admin';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';

// Additional type definitions for better type safety
interface CSVRecord {
  [key: string]: string | number | undefined;
}

interface OFXTransaction {
  datePosted?: string;
  dateUser?: string;
  name?: string;
  memo?: string;
  amount: string | number;
  fitId?: string;
}

interface OFXBankStatement {
  transactions?: OFXTransaction[];
}

interface OFXData {
  bankStatements?: OFXBankStatement[];
}

interface DocumentAIEntity {
  type?: string;
  confidence?: number;
  properties?: {
    date?: { textAnchor?: { content?: string } };
    description?: { textAnchor?: { content?: string } };
    amount?: { textAnchor?: { content?: string } };
  };
}

/**
 * Bank Statement Parser Service
 * Handles parsing of various bank statement formats using specialized libraries
 */
export class BankStatementParser {
  private documentAIClient?: DocumentProcessorServiceClient;
  private projectId: string;
  private location: string = 'us'; // Google Cloud region
  private processorId: string; // Document AI processor ID

  constructor() {
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || '';
    this.processorId = process.env.DOCUMENT_AI_PROCESSOR_ID || '';
    
    // Initialize Document AI client if credentials are available
    if (this.projectId && this.processorId) {
      try {
        this.documentAIClient = new DocumentProcessorServiceClient();
      } catch (error) {
        console.warn('Document AI not available:', error);
      }
    }
  }

  /**
   * Main parsing method that routes to appropriate parser based on file type
   */
  async parseStatement(fileUrl: string, fileName: string, fileType: string): Promise<ParsedTransaction[]> {
    try {
      console.log(`Parsing bank statement: ${fileName} (${fileType})`);
      
      // Download file from Firebase Storage
      const fileBuffer = await this.downloadFile(fileUrl);
      
      // Determine parser based on file extension and type
      const extension = fileName.split('.').pop()?.toLowerCase();
      
      switch (extension) {
        case 'csv':
        case 'txt':
          return await this.parseCSV(fileBuffer, fileName);
        
        case 'ofx':
        case 'qfx':
          return await this.parseOFX(fileBuffer, fileName);
        
        case 'xls':
        case 'xlsx':
          return await this.parseExcel(fileBuffer, fileName);
        
        default:
          // Fallback to Document AI for unknown formats
          if (this.documentAIClient) {
            return await this.parseWithDocumentAI(fileBuffer, fileName);
          }
          throw new Error(`Unsupported file format: ${extension}`);
      }
    } catch (error) {
      console.error('Error parsing bank statement:', error);
      throw new Error(`Failed to parse ${fileName}: ${(error as Error).message}`);
    }
  }

  /**
   * Parse CSV bank statements using csv-parse library
   */
  private async parseCSV(fileBuffer: Buffer, fileName: string): Promise<ParsedTransaction[]> {
    return new Promise((resolve, reject) => {
      const transactions: ParsedTransaction[] = [];
      const csvContent = fileBuffer.toString('utf-8');

      // Common CSV patterns for different banks
      const bankPatterns = this.detectBankCSVPattern(csvContent);
      
      parseCSV(csvContent, {
        columns: bankPatterns.hasHeaders,
        skip_empty_lines: true,
        trim: true,
        from_line: bankPatterns.skipLines || 1
      }, (err, records: CSVRecord[]) => {
        if (err) {
          reject(new Error(`CSV parsing error: ${err.message}`));
          return;
        }

        try {
          for (const record of records) {
            const transaction = this.normalizeCSVTransaction(record, bankPatterns);
            if (transaction) {
              transactions.push(transaction);
            }
          }
          
          console.log(`Parsed ${transactions.length} transactions from CSV`);
          resolve(transactions);
        } catch (parseError) {
          reject(new Error(`CSV normalization error: ${(parseError as Error).message}`));
        }
      });
    });
  }

  /**
   * Parse OFX/QFX bank statements using node-libofx
   */
  private async parseOFX(fileBuffer: Buffer, fileName: string): Promise<ParsedTransaction[]> {
    try {
      const ofxContent = fileBuffer.toString('utf-8');
      const parsedOFX = parseOFX(ofxContent) as OFXData;
      
      const transactions: ParsedTransaction[] = [];
      
      // Extract transactions from OFX structure
      if (parsedOFX.bankStatements) {
        for (const statement of parsedOFX.bankStatements) {
          if (statement.transactions) {
            for (const txn of statement.transactions) {
              transactions.push({
                date: new Date(txn.datePosted || txn.dateUser || '').toISOString().split('T')[0],
                description: txn.name || txn.memo || '',
                amount: parseFloat(String(txn.amount)) || 0,
                type: parseFloat(String(txn.amount)) >= 0 ? 'credit' : 'debit',
                transactionId: txn.fitId || this.generateTransactionId(),
                rawData: txn,
                source: 'ofx',
                confidence: 0.95 // High confidence for structured OFX data
              });
            }
          }
        }
      }
      
      console.log(`Parsed ${transactions.length} transactions from OFX`);
      return transactions;
    } catch (error) {
      throw new Error(`OFX parsing error: ${(error as Error).message}`);
    }
  }

  /**
   * Parse Excel bank statements using xlsx library
   */
  private async parseExcel(fileBuffer: Buffer, fileName: string): Promise<ParsedTransaction[]> {
    try {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0]; // Use first sheet
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number)[][];
      
      const transactions: ParsedTransaction[] = [];
      
      // Detect header row and data structure
      const headerRowIndex = this.detectExcelHeaders(jsonData);
      const headers = jsonData[headerRowIndex] as string[];
      
      // Map common header variations to standard fields
      const fieldMapping = this.createExcelFieldMapping(headers);
      
      for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (row.length === 0) continue;
        
        const transaction = this.normalizeExcelTransaction(row, fieldMapping, headers);
        if (transaction) {
          transactions.push(transaction);
        }
      }
      
      console.log(`Parsed ${transactions.length} transactions from Excel`);
      return transactions;
    } catch (error) {
      throw new Error(`Excel parsing error: ${(error as Error).message}`);
    }
  }

  /**
   * Parse statements using Google Cloud Document AI for complex/varied formats
   */
  private async parseWithDocumentAI(fileBuffer: Buffer, fileName: string): Promise<ParsedTransaction[]> {
    if (!this.documentAIClient) {
      throw new Error('Document AI not configured');
    }

    try {
      const name = `projects/${this.projectId}/locations/${this.location}/processors/${this.processorId}`;
      
      const [result] = await this.documentAIClient.processDocument({
        name,
        rawDocument: {
          content: fileBuffer.toString('base64'),
          mimeType: 'application/pdf' // Adjust based on actual file type
        }
      });

      const transactions: ParsedTransaction[] = [];
      
      // Extract entities from Document AI response
      if (result.document?.entities) {
        for (const entity of result.document.entities) {
          if (entity.type === 'transaction') {
            const transaction = this.normalizeDocumentAITransaction(entity as DocumentAIEntity);
            if (transaction) {
              transactions.push(transaction);
            }
          }
        }
      }
      
      console.log(`Parsed ${transactions.length} transactions using Document AI`);
      return transactions;
    } catch (error) {
      throw new Error(`Document AI parsing error: ${(error as Error).message}`);
    }
  }

  /**
   * Helper methods for CSV parsing
   */
  private detectBankCSVPattern(csvContent: string): CSVPattern {
    const lines = csvContent.split('\n').slice(0, 10); // Check first 10 lines
    
    // Common bank CSV patterns
    const patterns: { [key: string]: CSVPattern } = {
      chase: {
        hasHeaders: true,
        skipLines: 1,
        dateField: 'Transaction Date',
        descriptionField: 'Description',
        amountField: 'Amount',
        typeField: 'Type'
      },
      bankofamerica: {
        hasHeaders: true,
        skipLines: 1,
        dateField: 'Date',
        descriptionField: 'Description',
        amountField: 'Amount',
        typeField: null
      },
      wells: {
        hasHeaders: true,
        skipLines: 1,
        dateField: 'Date',
        descriptionField: 'Description',
        amountField: 'Amount'
      }
    };

    // Detect bank by headers or content
    const headerLine = lines[0]?.toLowerCase();
    
    if (headerLine?.includes('transaction date')) {
      return patterns.chase;
    } else if (headerLine?.includes('date') && headerLine?.includes('description')) {
      return patterns.bankofamerica;
    }
    
    // Default pattern
    return {
      hasHeaders: true,
      skipLines: 1,
      dateField: 'Date',
      descriptionField: 'Description',
      amountField: 'Amount'
    };
  }

  private normalizeCSVTransaction(record: CSVRecord, pattern: CSVPattern): ParsedTransaction | null {
    try {
      const date = this.parseDate(record[pattern.dateField]);
      const description = record[pattern.descriptionField]?.toString().trim();
      const amount = this.parseAmount(record[pattern.amountField]);
      
      if (!date || !description || amount === null) {
        return null;
      }

      return {
        date: date.toISOString().split('T')[0],
        description,
        amount,
        type: amount >= 0 ? 'credit' : 'debit',
        transactionId: this.generateTransactionId(),
        rawData: record,
        source: 'csv',
        confidence: 0.85
      };
    } catch (error) {
      console.warn('Failed to normalize CSV transaction:', error);
      return null;
    }
  }

  /**
   * Helper methods for Excel parsing
   */
  private detectExcelHeaders(data: (string | number)[][]): number {
    for (let i = 0; i < Math.min(5, data.length); i++) {
      const row = data[i];
      if (row.some((cell: string | number) => 
        typeof cell === 'string' && 
        /date|description|amount|transaction/i.test(cell)
      )) {
        return i;
      }
    }
    return 0; // Default to first row
  }

  private createExcelFieldMapping(headers: string[]): ExcelFieldMapping {
    const mapping: ExcelFieldMapping = {};
    
    headers.forEach((header, index) => {
      const normalized = header?.toString().toLowerCase().trim();
      
      if (/date|posting|trans.*date/.test(normalized)) {
        mapping.dateIndex = index;
      } else if (/description|memo|detail/.test(normalized)) {
        mapping.descriptionIndex = index;
      } else if (/amount|debit|credit/.test(normalized)) {
        mapping.amountIndex = index;
      } else if (/type|dr\/cr/.test(normalized)) {
        mapping.typeIndex = index;
      }
    });
    
    return mapping;
  }

  private normalizeExcelTransaction(row: (string | number)[], mapping: ExcelFieldMapping, headers: string[]): ParsedTransaction | null {
    try {
      const date = this.parseDate(row[mapping.dateIndex || 0]);
      const description = row[mapping.descriptionIndex || 1]?.toString().trim();
      const amount = this.parseAmount(row[mapping.amountIndex || 2]);
      
      if (!date || !description || amount === null) {
        return null;
      }

      return {
        date: date.toISOString().split('T')[0],
        description,
        amount,
        type: amount >= 0 ? 'credit' : 'debit',
        transactionId: this.generateTransactionId(),
        rawData: { row, headers },
        source: 'excel',
        confidence: 0.80
      };
    } catch (error) {
      console.warn('Failed to normalize Excel transaction:', error);
      return null;
    }
  }

  /**
   * Helper methods for Document AI parsing
   */
  private normalizeDocumentAITransaction(entity: DocumentAIEntity): ParsedTransaction | null {
    try {
      // Extract transaction details from Document AI entity
      const properties = entity.properties || {};
      
      const date = this.parseDate(properties.date?.textAnchor?.content);
      const description = properties.description?.textAnchor?.content?.trim();
      const amount = this.parseAmount(properties.amount?.textAnchor?.content);
      
      if (!date || !description || amount === null) {
        return null;
      }

      return {
        date: date.toISOString().split('T')[0],
        description,
        amount,
        type: amount >= 0 ? 'credit' : 'debit',
        transactionId: this.generateTransactionId(),
        rawData: entity,
        source: 'document_ai',
        confidence: entity.confidence || 0.70
      };
    } catch (error) {
      console.warn('Failed to normalize Document AI transaction:', error);
      return null;
    }
  }

  /**
   * Utility methods
   */
  private async downloadFile(fileUrl: string): Promise<Buffer> {
    // Download file from Firebase Storage
    const bucket = admin.storage().bucket();
    const fileName = fileUrl.split('/').pop();
    
    if (!fileName) {
      throw new Error('Invalid file URL');
    }

    const file = bucket.file(fileName);
    const [exists] = await file.exists();
    
    if (!exists) {
      throw new Error('File not found');
    }

    const [buffer] = await file.download();
    return buffer;
  }

  private parseDate(dateStr: string | number | undefined): Date | null {
    if (!dateStr) return null;
    
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }

  private parseAmount(amountStr: string | number | undefined): number | null {
    if (amountStr === null || amountStr === undefined) return null;
    
    const cleanAmount = amountStr.toString()
      .replace(/[$,\s]/g, '') // Remove currency symbols and commas
      .replace(/[()]/g, '-'); // Convert parentheses to negative
    
    const amount = parseFloat(cleanAmount);
    return isNaN(amount) ? null : amount;
  }

  private generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Type definitions
export interface ParsedTransaction {
  transactionId: string;
  date: string; // YYYY-MM-DD format
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  rawData: CSVRecord | OFXTransaction | { row: (string | number)[]; headers: string[] } | DocumentAIEntity;
  source: 'csv' | 'ofx' | 'excel' | 'document_ai';
  confidence: number; // 0-1 confidence score
  category?: string;
  merchantName?: string;
}

interface CSVPattern {
  hasHeaders: boolean;
  skipLines: number;
  dateField: string;
  descriptionField: string;
  amountField: string;
  typeField?: string | null;
}

interface ExcelFieldMapping {
  dateIndex?: number;
  descriptionIndex?: number;
  amountIndex?: number;
  typeIndex?: number;
} 