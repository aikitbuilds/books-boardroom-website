# 🚀 Stripe Payment Integration Setup Guide

This guide will help you set up secure payment processing with Stripe in the BooksBoardroom portal.

## 📋 Prerequisites

1. **Stripe Account**: Create a free account at [stripe.com](https://stripe.com)
2. **Domain Verification**: Ensure your domain is verified in Stripe Dashboard
3. **Webhook Endpoint**: Set up webhook endpoints for real-time payment events

## 🔧 Step 1: Stripe Account Setup

### 1.1 Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and sign up
2. Complete account verification
3. Navigate to Dashboard → Developers → API keys

### 1.2 Get API Keys
```bash
# Test Keys (for development)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_SECRET_KEY=sk_test_...

# Live Keys (for production)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_STRIPE_SECRET_KEY=sk_live_...
```

## 🔐 Step 2: Environment Configuration

### 2.1 Create Environment File
Create a `.env` file in your project root:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
VITE_STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Other API Keys
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id
VITE_DOCUMENT_AI_PROCESSOR_ID=your_document_ai_processor_id
```

### 2.2 Security Best Practices
- ✅ Never commit `.env` files to version control
- ✅ Use different keys for development and production
- ✅ Rotate keys regularly
- ✅ Use environment-specific configurations

## 🌐 Step 3: Webhook Configuration

### 3.1 Set Up Webhook Endpoint
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Set endpoint URL: `https://your-domain.com/api/stripe/webhooks`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 3.2 Webhook Secret
Copy the webhook signing secret and add to environment:
```bash
VITE_STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 🔒 Step 4: Security Implementation

### 4.1 CORS Configuration
Ensure your API endpoints allow requests from your domain:

```typescript
// In your API configuration
const corsOptions = {
  origin: [
    'https://your-domain.com',
    'http://localhost:5173' // for development
  ],
  credentials: true
};
```

### 4.2 Input Validation
All payment inputs are validated server-side:

```typescript
// Amount validation
if (!amount || amount < 50) {
  return new Response(
    JSON.stringify({ error: 'Amount must be at least 50 cents' }),
    { status: 400 }
  );
}
```

### 4.3 Error Handling
Comprehensive error handling for all Stripe operations:

```typescript
const handleStripeError = (error: any) => {
  if (error.type === 'StripeCardError') {
    return { error: error.message };
  } else if (error.type === 'StripeAuthenticationError') {
    return { error: 'Stripe authentication failed' };
  }
  // ... more error types
};
```

## 💳 Step 5: Payment Flow Implementation

### 5.1 Frontend Payment Form
The payment form includes:
- ✅ Real-time card validation
- ✅ Secure card element integration
- ✅ Loading states and error handling
- ✅ Success/failure notifications

### 5.2 Backend Payment Processing
- ✅ Payment intent creation
- ✅ Customer management
- ✅ Subscription handling
- ✅ Invoice generation

## 🧪 Step 6: Testing

### 6.1 Test Cards
Use these test card numbers:

```bash
# Successful payments
4242 4242 4242 4242  # Visa
4000 0000 0000 0002  # Visa (declined)

# 3D Secure
4000 0025 0000 3155  # Requires authentication

# International cards
4000 0000 0000 9995  # International card
```

### 6.2 Test Scenarios
1. **Successful Payment**: Use `4242 4242 4242 4242`
2. **Declined Payment**: Use `4000 0000 0000 0002`
3. **Insufficient Funds**: Use `4000 0000 0000 9995`
4. **3D Secure**: Use `4000 0025 0000 3155`

## 📊 Step 7: Monitoring & Analytics

### 7.1 Stripe Dashboard
Monitor payments in real-time:
- Payment success/failure rates
- Revenue analytics
- Customer insights
- Dispute management

### 7.2 Logging
All payment events are logged:
```typescript
console.log('Payment processed:', {
  amount,
  currency,
  customerId,
  timestamp: new Date().toISOString()
});
```

## 🚀 Step 8: Production Deployment

### 8.1 Environment Variables
Update production environment:
```bash
# Production Stripe keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_STRIPE_SECRET_KEY=sk_live_...
```

### 8.2 SSL Certificate
Ensure your domain has valid SSL certificate for secure payments.

### 8.3 PCI Compliance
Stripe handles PCI compliance automatically - no additional setup required.

## 🔧 Step 9: Advanced Features

### 9.1 Subscription Management
- Create recurring subscriptions
- Handle subscription updates
- Process cancellations
- Proration calculations

### 9.2 Invoice Management
- Generate invoices automatically
- Send payment reminders
- Handle late payments
- Generate reports

### 9.3 Customer Portal
- Self-service payment method updates
- Invoice history access
- Subscription management
- Payment method storage

## 🛡️ Security Checklist

- ✅ Environment variables secured
- ✅ API keys rotated regularly
- ✅ Webhook signatures verified
- ✅ Input validation implemented
- ✅ Error handling comprehensive
- ✅ SSL certificate valid
- ✅ CORS properly configured
- ✅ Rate limiting implemented
- ✅ Logging and monitoring active

## 📞 Support

### Stripe Support
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- [Stripe Community](https://community.stripe.com)

### Application Support
- Check logs for detailed error messages
- Verify environment variables
- Test with Stripe test cards
- Monitor Stripe Dashboard for issues

## 🎯 Next Steps

1. **Test Payment Flow**: Use test cards to verify functionality
2. **Monitor Dashboard**: Check Stripe Dashboard for successful payments
3. **Set Up Webhooks**: Configure webhook endpoints for real-time updates
4. **Production Deployment**: Switch to live keys when ready
5. **Analytics Setup**: Configure payment analytics and reporting

---

**Important**: Always test thoroughly in development before going live. Stripe provides excellent test tools and sandbox environments for safe testing. 