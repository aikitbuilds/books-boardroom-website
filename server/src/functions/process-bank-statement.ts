import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { BankStatementParser, ParsedTransaction } from '../services/financial/bank-statement-parser';
import { 
  FinancialFirestoreService, 
  FinancialTransaction, 
  BankStatementUpload,
  BankAccount 
} from '../services/financial/firestore-models';
import { v4 as uuidv4 } from 'uuid';

/**
 * Cloud Function triggered when bank statements are uploaded to Firebase Storage
 * Automatically parses and processes the uploaded files
 */
export const processBankStatement = functions.storage.object().onFinalize(async (object) => {
  // Only process files in the financial/bank-statements directory
  if (!object.name?.startsWith('financial/bank-statements/')) {
    console.log('Skipping non-bank-statement file:', object.name);
    return;
  }

  const filePath = object.name;
  const fileName = filePath.split('/').pop() || '';
  const userId = extractUserIdFromPath(filePath);
  
  if (!userId) {
    console.error('Could not extract user ID from file path:', filePath);
    return;
  }

  console.log(`Processing bank statement: ${fileName} for user: ${userId}`);

  // Initialize services
  const parser = new BankStatementParser();
  const firestoreService = new FinancialFirestoreService();
  
  // Create upload record
  const uploadId = uuidv4();
  const uploadRecord: BankStatementUpload = {
    uploadId,
    userId,
    fileName,
    fileSize: parseInt(object.size || '0'),
    fileType: object.contentType || 'unknown',
    uploadPath: filePath,
    status: 'processing',
    totalTransactions: 0,
    processedTransactions: 0,
    failedTransactions: 0,
    uploadedAt: object.timeCreated || new Date().toISOString(),
    processingStarted: new Date().toISOString(),
    errors: [],
    warnings: [],
    bankAccountId: '', // Will be determined/created during processing
    transactionIds: [],
    duplicateCount: 0,
    categorizationSummary: {
      automaticallyCategorized: 0,
      needsReview: 0,
      confidence: 0
    }
  };

  try {
    await firestoreService.createUploadRecord(uploadRecord);

    // Get download URL for the uploaded file
    const bucket = admin.storage().bucket();
    const file = bucket.file(filePath);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000 // 1 hour
    });

    // Parse the bank statement
    console.log(`Parsing bank statement: ${fileName}`);
    const parsedTransactions = await parser.parseStatement(url, fileName, object.contentType || '');
    
    if (parsedTransactions.length === 0) {
      throw new Error('No transactions found in the uploaded file');
    }

    console.log(`Parsed ${parsedTransactions.length} transactions`);

    // Determine or create bank account
    const bankAccount = await determineBankAccount(firestoreService, userId, fileName, parsedTransactions);
    uploadRecord.bankAccountId = bankAccount.accountId;

    // Process each transaction
    const processedTransactionIds: string[] = [];
    const errors: string[] = [];
    let duplicateCount = 0;
    let automaticallyCategorized = 0;
    let totalConfidence = 0;

    for (const parsedTxn of parsedTransactions) {
      try {
        // Check for duplicates
        const isDuplicate = await checkForDuplicate(firestoreService, userId, parsedTxn);
        if (isDuplicate) {
          duplicateCount++;
          uploadRecord.warnings.push(`Duplicate transaction detected: ${parsedTxn.description} on ${parsedTxn.date}`);
          continue;
        }

        // Convert to Firestore format
        const transaction = await convertToFinancialTransaction(
          parsedTxn, 
          userId, 
          bankAccount, 
          uploadId
        );

        // Attempt automatic categorization
        const categorization = await attemptCategorization(firestoreService, transaction);
        if (categorization) {
          transaction.categoryId = categorization.categoryId;
          transaction.categoryName = categorization.categoryName;
          transaction.isCategorized = true;
          transaction.categorizationConfidence = categorization.confidence;
          automaticallyCategorized++;
        }

        // Save transaction
        await firestoreService.saveTransaction(transaction);
        processedTransactionIds.push(transaction.transactionId);
        totalConfidence += transaction.confidence;

        // Update category usage if categorized
        if (transaction.categoryId && transaction.categoryName) {
          await firestoreService.updateCategoryUsage(transaction.categoryId, Math.abs(transaction.amount));
        }

      } catch (error) {
        console.error('Error processing transaction:', error);
        errors.push(`Failed to process transaction: ${parsedTxn.description} - ${(error as Error).message}`);
        uploadRecord.failedTransactions++;
      }
    }

    // Update upload record with results
    uploadRecord.status = 'completed';
    uploadRecord.totalTransactions = parsedTransactions.length;
    uploadRecord.processedTransactions = processedTransactionIds.length;
    uploadRecord.transactionIds = processedTransactionIds;
    uploadRecord.duplicateCount = duplicateCount;
    uploadRecord.errors = errors;
    uploadRecord.processingCompleted = new Date().toISOString();
    uploadRecord.categorizationSummary = {
      automaticallyCategorized,
      needsReview: processedTransactionIds.length - automaticallyCategorized,
      confidence: totalConfidence / Math.max(processedTransactionIds.length, 1)
    };

    await firestoreService.updateUploadStatus(uploadId, 'completed', uploadRecord);

    // Update bank account statistics
    await firestoreService.updateBankAccountStats(
      bankAccount.accountId,
      processedTransactionIds.length,
      parsedTransactions[0]?.date || new Date().toISOString().split('T')[0]
    );

    console.log(`Successfully processed ${processedTransactionIds.length} transactions from ${fileName}`);

  } catch (error) {
    console.error('Error processing bank statement:', error);
    
    // Update upload record with error
    uploadRecord.status = 'failed';
    uploadRecord.errors = [`Processing failed: ${(error as Error).message}`];
    uploadRecord.processingCompleted = new Date().toISOString();
    
    await firestoreService.updateUploadStatus(uploadId, 'failed', uploadRecord);
  }
});

/**
 * Helper Functions
 */

function extractUserIdFromPath(filePath: string): string | null {
  // Expected path: financial/bank-statements/{userId}/{timestamp}_{filename}
  const pathParts = filePath.split('/');
  if (pathParts.length >= 3 && pathParts[0] === 'financial' && pathParts[1] === 'bank-statements') {
    return pathParts[2];
  }
  return null;
}

async function determineBankAccount(
  firestoreService: FinancialFirestoreService,
  userId: string,
  fileName: string,
  transactions: ParsedTransaction[]
): Promise<BankAccount> {
  // Try to find existing bank account based on transaction patterns
  const existingAccounts = await firestoreService.getBankAccounts(userId);
  
  // Simple matching logic - could be enhanced with AI
  const bankNameGuess = guessBankName(fileName, transactions);
  const accountTypeGuess = guessAccountType(transactions);
  
  // Look for existing account with similar characteristics
  for (const account of existingAccounts) {
    if (account.bankName.toLowerCase().includes(bankNameGuess.toLowerCase()) ||
        bankNameGuess.toLowerCase().includes(account.bankName.toLowerCase())) {
      return account;
    }
  }
  
  // Create new bank account
  const newAccount: BankAccount = {
    accountId: uuidv4(),
    userId,
    accountName: `${bankNameGuess} ${accountTypeGuess}`,
    accountType: accountTypeGuess,
    bankName: bankNameGuess,
    defaultCurrency: 'USD',
    timezone: 'America/Los_Angeles', // Default to Pacific Time
    transactionCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  };
  
  await firestoreService.createBankAccount(newAccount);
  console.log(`Created new bank account: ${newAccount.accountName}`);
  
  return newAccount;
}

function guessBankName(fileName: string, transactions: ParsedTransaction[]): string {
  const fileNameLower = fileName.toLowerCase();
  
  // Common bank identifiers in filenames
  if (fileNameLower.includes('chase')) return 'Chase Bank';
  if (fileNameLower.includes('bankofamerica') || fileNameLower.includes('boa')) return 'Bank of America';
  if (fileNameLower.includes('wells')) return 'Wells Fargo';
  if (fileNameLower.includes('citi')) return 'Citibank';
  if (fileNameLower.includes('usbank')) return 'US Bank';
  
  // Could also analyze transaction descriptions for bank identifiers
  // For now, default to generic name
  return 'Business Bank';
}

function guessAccountType(transactions: ParsedTransaction[]): BankAccount['accountType'] {
  // Analyze transaction patterns to guess account type
  const creditCount = transactions.filter(t => t.type === 'credit').length;
  const debitCount = transactions.filter(t => t.type === 'debit').length;
  
  // If mostly debits, likely checking account
  if (debitCount > creditCount * 2) {
    return 'checking';
  }
  
  // Default to checking for business accounts
  return 'checking';
}

async function checkForDuplicate(
  firestoreService: FinancialFirestoreService,
  userId: string,
  transaction: ParsedTransaction
): Promise<boolean> {
  try {
    // Look for transactions with same amount and date (within a few days)
    const startDate = new Date(transaction.date);
    startDate.setDate(startDate.getDate() - 2); // 2 days before
    
    const endDate = new Date(transaction.date);
    endDate.setDate(startDate.getDate() + 2); // 2 days after
    
    const existingTransactions = await firestoreService.getTransactions(userId, {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      limit: 50
    });
    
    // Check for matches based on amount and description similarity
    for (const existing of existingTransactions) {
      if (Math.abs(existing.amount - transaction.amount) < 0.01 && // Same amount (within 1 cent)
          calculateStringSimilarity(existing.descriptionRaw, transaction.description) > 0.8) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.warn('Error checking for duplicates:', error);
    return false;
  }
}

function calculateStringSimilarity(str1: string, str2: string): number {
  // Simple Levenshtein distance-based similarity
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + substitutionCost // substitution
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

async function convertToFinancialTransaction(
  parsedTxn: ParsedTransaction,
  userId: string,
  bankAccount: BankAccount,
  uploadId: string
): Promise<FinancialTransaction> {
  const transactionId = uuidv4();
  const now = new Date().toISOString();
  
  return {
    transactionId,
    userId,
    date: parsedTxn.date,
    amount: parsedTxn.amount,
    type: parsedTxn.type,
    descriptionRaw: parsedTxn.description,
    descriptionCleaned: cleanDescription(parsedTxn.description),
    merchantName: extractMerchantName(parsedTxn.description),
    isCategorized: false,
    bankAccountId: bankAccount.accountId,
    bankAccountName: bankAccount.accountName,
    source: parsedTxn.source,
    uploadId,
    createdAt: now,
    updatedAt: now,
    processedAt: now,
    confidence: parsedTxn.confidence,
    userReviewed: false,
    rawData: parsedTxn.rawData,
    isRecurring: false,
    isDuplicate: false,
    isBusinessExpense: parsedTxn.type === 'debit' // Assume debits are expenses
  };
}

function cleanDescription(description: string): string {
  // Remove common bank codes and clean up description
  return description
    .replace(/\*+/g, '') // Remove asterisks
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/^\d+\s*/, '') // Remove leading numbers
    .trim()
    .toUpperCase();
}

function extractMerchantName(description: string): string | undefined {
  // Simple merchant name extraction - could be enhanced with AI/NLP
  const cleaned = cleanDescription(description);
  
  // Remove common transaction codes and identifiers
  const withoutCodes = cleaned
    .replace(/\b(DEBIT|CREDIT|PURCHASE|PAYMENT|TRANSFER|DEPOSIT|WITHDRAWAL)\b/g, '')
    .replace(/\b\d{4}\*+\d{4}\b/g, '') // Remove card numbers
    .replace(/\b\d{2}\/\d{2}\b/g, '') // Remove dates
    .trim();
  
  // Take first meaningful part as merchant name
  const parts = withoutCodes.split(/\s+/);
  const meaningfulParts = parts.filter(part => 
    part.length > 2 && 
    !/^\d+$/.test(part) && 
    !['THE', 'AND', 'OF', 'FOR', 'TO', 'FROM'].includes(part)
  );
  
  return meaningfulParts.slice(0, 3).join(' ') || undefined;
}

async function attemptCategorization(
  firestoreService: FinancialFirestoreService,
  transaction: FinancialTransaction
): Promise<{ categoryId: string; categoryName: string; confidence: number } | null> {
  try {
    // Get user's categories
    const categories = await firestoreService.getCategories(transaction.userId);
    
    // Find best matching category
    let bestMatch: { categoryId: string; categoryName: string; confidence: number } | null = null;
    
    for (const category of categories) {
      const confidence = calculateCategorizationConfidence(transaction, category);
      
      if (confidence > 0.7 && (!bestMatch || confidence > bestMatch.confidence)) {
        bestMatch = {
          categoryId: category.categoryId,
          categoryName: category.name,
          confidence
        };
      }
    }
    
    return bestMatch;
  } catch (error) {
    console.warn('Error attempting categorization:', error);
    return null;
  }
}

function calculateCategorizationConfidence(
  transaction: FinancialTransaction,
  category: import('../services/financial/firestore-models').TransactionCategory
): number {
  let score = 0;
  const description = transaction.descriptionCleaned.toLowerCase();
  const merchant = transaction.merchantName?.toLowerCase() || '';
  
  // Check keywords
  for (const keyword of category.keywords) {
    if (description.includes(keyword.toLowerCase()) || merchant.includes(keyword.toLowerCase())) {
      score += 0.3;
    }
  }
  
  // Check patterns
  for (const pattern of category.patterns) {
    try {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(description) || regex.test(merchant)) {
        score += 0.4;
      }
    } catch (error) {
      // Invalid regex pattern
      continue;
    }
  }
  
  // Check merchant rules
  for (const merchantRule of category.merchantRules) {
    if (merchant.includes(merchantRule.toLowerCase()) || description.includes(merchantRule.toLowerCase())) {
      score += 0.5;
    }
  }
  
  return Math.min(score, 1.0); // Cap at 1.0
} 