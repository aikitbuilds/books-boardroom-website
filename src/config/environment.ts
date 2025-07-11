// Environment configuration for the application
export const environment = {
  // Firebase Configuration
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  },

  // Stripe Configuration
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY,
    // ⚠️ SECURITY WARNING: Never expose secret keys in client-side code
    // The secret key should only be used in server-side API routes
  },

  // OpenAI Configuration
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  },

  // Google Cloud Configuration
  googleCloud: {
    projectId: import.meta.env.VITE_GOOGLE_CLOUD_PROJECT_ID,
    documentAiProcessorId: import.meta.env.VITE_DOCUMENT_AI_PROCESSOR_ID,
  },

  // Application Configuration
  app: {
    name: 'BooksBoardroom',
    version: '1.0.0',
    environment: import.meta.env.MODE,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  },
};

// Validation function to check if required environment variables are set
export const validateEnvironment = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_STRIPE_PUBLISHABLE_KEY',
  ];

  const missingVars = requiredVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    console.warn(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
    return false;
  }

  return true;
};

// Helper function to get Stripe configuration
export const getStripeConfig = () => {
  if (!environment.stripe.publishableKey) {
    console.warn('Stripe publishable key not found');
    return null;
  }

  return {
    publishableKey: environment.stripe.publishableKey,
  };
};

// Helper function to check if Stripe is configured
export const isStripeConfigured = () => {
  return !!environment.stripe.publishableKey;
};

// ⚠️ SECURITY WARNING: This function should only be used in server-side code
// Never expose secret keys in client-side code
export const getStripeSecretKey = () => {
  if (typeof window !== 'undefined') {
    console.error('SECURITY WARNING: Attempting to access secret key in client-side code');
    return null;
  }
  return environment.stripe.secretKey;
}; 