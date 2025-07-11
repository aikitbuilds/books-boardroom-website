import Stripe from 'stripe';

// Initialize Stripe with secret key
// ⚠️ SECURITY: This should only be used in server-side code
const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-06-30.basil',
});

// Helper function to handle Stripe errors
const handleStripeError = (error: any) => {
  console.error('Stripe error:', error);
  
  if (error.type === 'StripeCardError') {
    return { error: error.message };
  } else if (error.type === 'StripeInvalidRequestError') {
    return { error: 'Invalid request to Stripe' };
  } else if (error.type === 'StripeAPIError') {
    return { error: 'Stripe API error' };
  } else if (error.type === 'StripeConnectionError') {
    return { error: 'Failed to connect to Stripe' };
  } else if (error.type === 'StripeAuthenticationError') {
    return { error: 'Stripe authentication failed' };
  } else {
    return { error: 'An unexpected error occurred' };
  }
};

// Create payment intent
export const createPaymentIntent = async (request: Request) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = await request.json();

    if (!amount || amount < 50) {
      return new Response(
        JSON.stringify({ error: 'Amount must be at least 50 cents' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return new Response(
      JSON.stringify(paymentIntent),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const { error: errorMessage } = handleStripeError(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Create customer
export const createCustomer = async (request: Request) => {
  try {
    const { email, name, phone } = await request.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const customer = await stripe.customers.create({
      email,
      name,
      phone,
    });

    return new Response(
      JSON.stringify(customer),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const { error: errorMessage } = handleStripeError(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Get customer by ID
export const getCustomer = async (request: Request, customerId: string) => {
  try {
    const customer = await stripe.customers.retrieve(customerId);

    return new Response(
      JSON.stringify(customer),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const { error: errorMessage } = handleStripeError(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Create subscription
export const createSubscription = async (request: Request) => {
  try {
    const { customerId, priceId, metadata = {} } = await request.json();

    if (!customerId || !priceId) {
      return new Response(
        JSON.stringify({ error: 'Customer ID and Price ID are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata,
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    return new Response(
      JSON.stringify(subscription),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const { error: errorMessage } = handleStripeError(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Cancel subscription
export const cancelSubscription = async (request: Request, subscriptionId: string) => {
  try {
    const { cancelAtPeriodEnd = true } = await request.json();

    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: cancelAtPeriodEnd,
    });

    return new Response(
      JSON.stringify(subscription),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const { error: errorMessage } = handleStripeError(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Create invoice
export const createInvoice = async (request: Request) => {
  try {
    const { customerId, amount, currency = 'usd', description } = await request.json();

    if (!customerId || !amount) {
      return new Response(
        JSON.stringify({ error: 'Customer ID and amount are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const invoice = await stripe.invoices.create({
      customer: customerId,
      currency,
      description,
      auto_advance: false,
    });

    // Add invoice item
    await stripe.invoiceItems.create({
      customer: customerId,
      invoice: invoice.id,
      amount,
      currency,
      description: description || 'Service charge',
    });

    // Finalize the invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

    return new Response(
      JSON.stringify(finalizedInvoice),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const { error: errorMessage } = handleStripeError(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Get invoice by ID
export const getInvoice = async (request: Request, invoiceId: string) => {
  try {
    const invoice = await stripe.invoices.retrieve(invoiceId);

    return new Response(
      JSON.stringify(invoice),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const { error: errorMessage } = handleStripeError(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Get customer invoices
export const getCustomerInvoices = async (request: Request, customerId: string) => {
  try {
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 100,
    });

    return new Response(
      JSON.stringify(invoices.data),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const { error: errorMessage } = handleStripeError(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Setup payment method for customer
export const setupPaymentMethod = async (request: Request, customerId: string) => {
  try {
    const { paymentMethodId } = await request.json();

    if (!paymentMethodId) {
      return new Response(
        JSON.stringify({ error: 'Payment method ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const { error: errorMessage } = handleStripeError(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Get customer payment methods
export const getCustomerPaymentMethods = async (request: Request, customerId: string) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return new Response(
      JSON.stringify(paymentMethods.data),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const { error: errorMessage } = handleStripeError(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Validate payment method
export const validatePaymentMethod = async (request: Request) => {
  try {
    const { paymentMethodId } = await request.json();

    if (!paymentMethodId) {
      return new Response(
        JSON.stringify({ error: 'Payment method ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    return new Response(
      JSON.stringify({ valid: true, paymentMethod }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const { error: errorMessage } = handleStripeError(error);
    return new Response(
      JSON.stringify({ valid: false, error: errorMessage }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 