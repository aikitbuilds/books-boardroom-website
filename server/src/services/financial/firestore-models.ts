import * as admin from 'firebase-admin';

/**
 * Firestore Data Models for Financial Management
 * Comprehensive schemas for transactions, categories, and bank accounts
 */

// Main transaction record
export interface FinancialTransaction {
  // Core transaction data
  transactionId: string; // Unique identifier
  userId: string; // Owner of the transaction
  date: string; // Transaction date (YYYY-MM-DD)
  amount: number; // Transaction amount (negative for debits, positive for credits)
  type: 'debit' | 'credit';
  
  // Description and processing
  descriptionRaw: string; // Original description from bank
  descriptionCleaned: string; // AI-processed/cleaned description
  merchantName?: string; // Extracted merchant name
  
  // Categorization
  categoryId?: string; // Reference to transaction_categories
  categoryName?: string; // Denormalized for performance
  isCategorized: boolean; // Manual or AI categorization status
  categorizationConfidence?: number; // AI confidence score (0-1)
  
  // Source and metadata
  bankAccountId: string; // Reference to bank_accounts
  bankAccountName: string; // Denormalized account name
  source: 'csv' | 'ofx' | 'excel' | 'document_ai' | 'manual';
  uploadId?: string; // Reference to the upload batch
  
  // Processing metadata
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  processedAt?: string; // When AI processing completed
  confidence: number; // Overall parsing confidence
  
  // User interaction
  userReviewed: boolean; // Has user manually reviewed?
  userNotes?: string; // User-added notes
  tags?: string[]; // User-added tags
  
  // Raw data for debugging
  rawData: Record<string, unknown>; // Original parsed data
  
  // Financial flags
  isRecurring?: boolean; // Detected as recurring payment
  recurringPattern?: string; // Frequency if recurring
  isDuplicate?: boolean; // Flagged as potential duplicate
  duplicateOf?: string; // Reference to original transaction
  
  // Business context
  isBusinessExpense?: boolean; // Tax deductible business expense
  projectId?: string; // Associated with specific project
  taxCategory?: string; // For tax reporting
}

// Transaction categories for AI and manual categorization
export interface TransactionCategory {
  categoryId: string;
  userId: string;
  
  // Category details
  name: string; // "Software Subscriptions", "Marketing Spend", etc.
  description?: string;
  parentCategoryId?: string; // For subcategories
  level: number; // 0 = top level, 1 = subcategory, etc.
  
  // Display and organization
  icon?: string; // Icon name or emoji
  color?: string; // Hex color for UI
  sortOrder: number; // Display order
  
  // AI categorization rules
  keywords: string[]; // Keywords for automatic categorization
  patterns: string[]; // Regex patterns for matching
  merchantRules: string[]; // Specific merchant name rules
  
  // Business context
  isDefault: boolean; // System-provided category
  isTaxDeductible?: boolean; // Business expense category
  quickBooksAccount?: string; // QB Chart of Accounts mapping
  
  // Statistics and usage
  transactionCount: number; // Number of transactions in this category
  totalAmount: number; // Total amount across all transactions
  lastUsed?: string; // Last transaction date
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// Bank account information
export interface BankAccount {
  accountId: string;
  userId: string;
  
  // Account details
  accountName: string; // "Chase Business Checking"
  accountType: 'checking' | 'savings' | 'credit' | 'loan' | 'investment';
  bankName: string; // "Chase Bank"
  accountNumber?: string; // Last 4 digits only
  routingNumber?: string; // If available
  
  // Balance tracking (estimates based on transactions)
  currentBalance?: number; // Calculated from transactions
  lastBalanceUpdate?: string; // When balance was last calculated
  
  // Upload and sync settings
  defaultCurrency: string; // USD, etc.
  timezone: string; // For transaction date processing
  statementFormat?: 'csv' | 'ofx' | 'excel'; // Preferred format
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  
  // Sync status
  lastUploadAt?: string; // Last bank statement upload
  lastTransactionDate?: string; // Most recent transaction
  transactionCount: number; // Total transactions
}

// Upload batch tracking
export interface BankStatementUpload {
  uploadId: string;
  userId: string;
  
  // File details
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadPath: string; // Firebase Storage path
  
  // Processing status
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  totalTransactions: number;
  processedTransactions: number;
  failedTransactions: number;
  
  // Processing metadata
  uploadedAt: string;
  processingStarted?: string;
  processingCompleted?: string;
  
  // Error handling
  errors: string[]; // Processing errors
  warnings: string[]; // Processing warnings
  
  // Results
  bankAccountId: string;
  transactionIds: string[]; // Successfully processed transactions
  duplicateCount: number; // Detected duplicates
  
  // AI processing summary
  categorizationSummary: {
    automaticallyCategorized: number;
    needsReview: number;
    confidence: number; // Average confidence
  };
}

/**
 * Firestore Service for Financial Data
 * Handles CRUD operations and data validation
 */
export class FinancialFirestoreService {
  private db: admin.firestore.Firestore;

  constructor() {
    this.db = admin.firestore();
  }

  // Transaction operations
  async saveTransaction(transaction: FinancialTransaction): Promise<void> {
    const docRef = this.db.collection('financial_transactions').doc(transaction.transactionId);
    await docRef.set(transaction);
  }

  async getTransactions(
    userId: string,
    options: {
      startDate?: string;
      endDate?: string;
      categoryId?: string;
      bankAccountId?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<FinancialTransaction[]> {
    let query = this.db
      .collection('financial_transactions')
      .where('userId', '==', userId)
      .orderBy('date', 'desc');

    if (options.startDate) {
      query = query.where('date', '>=', options.startDate);
    }
    if (options.endDate) {
      query = query.where('date', '<=', options.endDate);
    }
    if (options.categoryId) {
      query = query.where('categoryId', '==', options.categoryId);
    }
    if (options.bankAccountId) {
      query = query.where('bankAccountId', '==', options.bankAccountId);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.offset(options.offset);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => doc.data() as FinancialTransaction);
  }

  async updateTransactionCategory(
    transactionId: string,
    categoryId: string,
    categoryName: string,
    confidence: number = 1.0
  ): Promise<void> {
    const docRef = this.db.collection('financial_transactions').doc(transactionId);
    await docRef.update({
      categoryId,
      categoryName,
      isCategorized: true,
      categorizationConfidence: confidence,
      userReviewed: confidence === 1.0, // Assume manual if perfect confidence
      updatedAt: new Date().toISOString()
    });
  }

  // Category operations
  async getCategories(userId: string): Promise<TransactionCategory[]> {
    const snapshot = await this.db
      .collection('transaction_categories')
      .where('userId', '==', userId)
      .where('isActive', '==', true)
      .orderBy('sortOrder')
      .get();
    
    return snapshot.docs.map(doc => doc.data() as TransactionCategory);
  }

  async createCategory(category: TransactionCategory): Promise<void> {
    const docRef = this.db.collection('transaction_categories').doc(category.categoryId);
    await docRef.set(category);
  }

  async updateCategoryUsage(categoryId: string, amount: number): Promise<void> {
    const docRef = this.db.collection('transaction_categories').doc(categoryId);
    await docRef.update({
      transactionCount: admin.firestore.FieldValue.increment(1),
      totalAmount: admin.firestore.FieldValue.increment(amount),
      lastUsed: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  // Bank account operations
  async getBankAccounts(userId: string): Promise<BankAccount[]> {
    const snapshot = await this.db
      .collection('bank_accounts')
      .where('userId', '==', userId)
      .where('isActive', '==', true)
      .orderBy('accountName')
      .get();
    
    return snapshot.docs.map(doc => doc.data() as BankAccount);
  }

  async createBankAccount(account: BankAccount): Promise<void> {
    const docRef = this.db.collection('bank_accounts').doc(account.accountId);
    await docRef.set(account);
  }

  async updateBankAccountStats(accountId: string, transactionCount: number, lastTransactionDate: string): Promise<void> {
    const docRef = this.db.collection('bank_accounts').doc(accountId);
    await docRef.update({
      transactionCount: admin.firestore.FieldValue.increment(transactionCount),
      lastTransactionDate,
      lastUploadAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  // Upload tracking operations
  async createUploadRecord(upload: BankStatementUpload): Promise<void> {
    const docRef = this.db.collection('bank_statement_uploads').doc(upload.uploadId);
    await docRef.set(upload);
  }

  async updateUploadStatus(
    uploadId: string,
    status: BankStatementUpload['status'],
    metadata?: Partial<BankStatementUpload>
  ): Promise<void> {
    const docRef = this.db.collection('bank_statement_uploads').doc(uploadId);
    await docRef.update({
      status,
      ...metadata,
      updatedAt: new Date().toISOString()
    });
  }

  // Analytics and aggregation queries
  async getSpendingByCategory(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Array<{ categoryId: string; categoryName: string; totalAmount: number; transactionCount: number }>> {
    const snapshot = await this.db
      .collection('financial_transactions')
      .where('userId', '==', userId)
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .where('type', '==', 'debit')
      .get();

    const categoryTotals = new Map<string, { categoryName: string; totalAmount: number; transactionCount: number }>();

    snapshot.docs.forEach(doc => {
      const transaction = doc.data() as FinancialTransaction;
      const categoryId = transaction.categoryId || 'uncategorized';
      const categoryName = transaction.categoryName || 'Uncategorized';
      const amount = Math.abs(transaction.amount); // Convert to positive for spending

      if (categoryTotals.has(categoryId)) {
        const existing = categoryTotals.get(categoryId)!;
        existing.totalAmount += amount;
        existing.transactionCount += 1;
      } else {
        categoryTotals.set(categoryId, {
          categoryName,
          totalAmount: amount,
          transactionCount: 1
        });
      }
    });

    return Array.from(categoryTotals.entries()).map(([categoryId, data]) => ({
      categoryId,
      ...data
    }));
  }

  async getCashFlowSummary(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<{ totalIncome: number; totalExpenses: number; netCashFlow: number; transactionCount: number }> {
    const snapshot = await this.db
      .collection('financial_transactions')
      .where('userId', '==', userId)
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .get();

    let totalIncome = 0;
    let totalExpenses = 0;
    let transactionCount = 0;

    snapshot.docs.forEach(doc => {
      const transaction = doc.data() as FinancialTransaction;
      if (transaction.type === 'credit') {
        totalIncome += transaction.amount;
      } else {
        totalExpenses += Math.abs(transaction.amount);
      }
      transactionCount += 1;
    });

    return {
      totalIncome,
      totalExpenses,
      netCashFlow: totalIncome - totalExpenses,
      transactionCount
    };
  }
}

// Default categories to initialize for new users
export const DEFAULT_CATEGORIES: Omit<TransactionCategory, 'categoryId' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Software Subscriptions',
    description: 'Monthly/annual software and SaaS subscriptions',
    level: 0,
    icon: '💻',
    color: '#3b82f6',
    sortOrder: 1,
    keywords: ['adobe', 'microsoft', 'google', 'software', 'subscription', 'saas'],
    patterns: ['.*subscription.*', '.*monthly.*', '.*annual.*'],
    merchantRules: ['Adobe Inc.', 'Microsoft Corp', 'Google LLC'],
    isDefault: true,
    isTaxDeductible: true,
    quickBooksAccount: 'Computer and Internet Expenses',
    transactionCount: 0,
    totalAmount: 0,
    isActive: true
  },
  {
    name: 'Marketing & Advertising',
    description: 'Digital marketing, ads, and promotional expenses',
    level: 0,
    icon: '📢',
    color: '#f59e0b',
    sortOrder: 2,
    keywords: ['facebook ads', 'google ads', 'marketing', 'advertising', 'promotion'],
    patterns: ['.*ads.*', '.*marketing.*', '.*advertising.*'],
    merchantRules: ['Meta Platforms', 'Google Ads', 'Facebook'],
    isDefault: true,
    isTaxDeductible: true,
    quickBooksAccount: 'Advertising and Marketing',
    transactionCount: 0,
    totalAmount: 0,
    isActive: true
  },
  {
    name: 'Material Costs',
    description: 'Solar panels, equipment, and installation materials',
    level: 0,
    icon: '🔧',
    color: '#10b981',
    sortOrder: 3,
    keywords: ['solar', 'panel', 'equipment', 'materials', 'supplies'],
    patterns: ['.*solar.*', '.*equipment.*', '.*materials.*'],
    merchantRules: [],
    isDefault: true,
    isTaxDeductible: true,
    quickBooksAccount: 'Cost of Goods Sold',
    transactionCount: 0,
    totalAmount: 0,
    isActive: true
  },
  {
    name: 'GoodLeap Payouts',
    description: 'Financing payouts from GoodLeap',
    level: 0,
    icon: '💰',
    color: '#06d6a0',
    sortOrder: 4,
    keywords: ['goodleap', 'payout', 'financing'],
    patterns: ['.*goodleap.*', '.*payout.*'],
    merchantRules: ['GoodLeap'],
    isDefault: true,
    isTaxDeductible: false,
    quickBooksAccount: 'Income',
    transactionCount: 0,
    totalAmount: 0,
    isActive: true
  },
  {
    name: 'Client Deposits',
    description: 'Customer down payments and deposits',
    level: 0,
    icon: '💳',
    color: '#8b5cf6',
    sortOrder: 5,
    keywords: ['deposit', 'payment', 'customer', 'client'],
    patterns: ['.*deposit.*', '.*payment.*'],
    merchantRules: [],
    isDefault: true,
    isTaxDeductible: false,
    quickBooksAccount: 'Income',
    transactionCount: 0,
    totalAmount: 0,
    isActive: true
  }
]; 