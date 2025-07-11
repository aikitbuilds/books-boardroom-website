import { loadStripe, Stripe } from '@stripe/stripe-js';
import { toast } from 'sonner';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
  created: number;
}

export interface Customer {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  created: number;
}

export interface Subscription {
  id: string;
  customerId: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  items: {
    data: Array<{
      id: string;
      price: {
        id: string;
        product: string;
        unit_amount: number;
        currency: string;
      };
    }>;
  };
}

export interface Invoice {
  id: string;
  customerId: string;
  amount_due: number;
  amount_paid: number;
  currency: string;
  status: string;
  due_date?: number;
  created: number;
  invoice_pdf?: string;
  hosted_invoice_url?: string;
}

export class StripeService {
  private stripe: Stripe | null = null;
  private publishableKey: string;

  constructor() {
    this.publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
    this.initializeStripe();
  }

  private async initializeStripe() {
    if (!this.publishableKey) {
      console.warn('Stripe publishable key not found');
      return;
    }

    try {
      this.stripe = await loadStripe(this.publishableKey);
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
    }
  }

  // Create a payment intent for one-time payments
  async createPaymentIntent(amount: number, currency: string = 'usd', metadata?: Record<string, string>): Promise<PaymentIntent> {
    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          metadata,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const paymentIntent = await response.json();
      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Payment setup failed');
    }
  }

  // Process payment with Stripe Elements
  async processPayment(paymentIntent: PaymentIntent, paymentMethod: any): Promise<{ success: boolean; error?: string }> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    try {
      const { error } = await this.stripe.confirmCardPayment(paymentIntent.client_secret, {
        payment_method: paymentMethod,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Payment processing error:', error);
      return { success: false, error: 'Payment processing failed' };
    }
  }

  // Create or retrieve customer
  async createCustomer(email: string, name?: string, phone?: string): Promise<Customer> {
    try {
      const response = await fetch('/api/stripe/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          phone,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create customer');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating customer:', error);
      throw new Error('Customer creation failed');
    }
  }

  // Get customer by ID
  async getCustomer(customerId: string): Promise<Customer> {
    try {
      const response = await fetch(`/api/stripe/customers/${customerId}`);

      if (!response.ok) {
        throw new Error('Failed to get customer');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting customer:', error);
      throw new Error('Customer retrieval failed');
    }
  }

  // Create subscription
  async createSubscription(customerId: string, priceId: string, metadata?: Record<string, string>): Promise<Subscription> {
    try {
      const response = await fetch('/api/stripe/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          priceId,
          metadata,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error('Subscription creation failed');
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true): Promise<Subscription> {
    try {
      const response = await fetch(`/api/stripe/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cancelAtPeriodEnd,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw new Error('Subscription cancellation failed');
    }
  }

  // Create invoice
  async createInvoice(customerId: string, amount: number, currency: string = 'usd', description?: string): Promise<Invoice> {
    try {
      const response = await fetch('/api/stripe/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          amount,
          currency,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create invoice');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw new Error('Invoice creation failed');
    }
  }

  // Get invoice by ID
  async getInvoice(invoiceId: string): Promise<Invoice> {
    try {
      const response = await fetch(`/api/stripe/invoices/${invoiceId}`);

      if (!response.ok) {
        throw new Error('Failed to get invoice');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting invoice:', error);
      throw new Error('Invoice retrieval failed');
    }
  }

  // Get customer's invoices
  async getCustomerInvoices(customerId: string): Promise<Invoice[]> {
    try {
      const response = await fetch(`/api/stripe/customers/${customerId}/invoices`);

      if (!response.ok) {
        throw new Error('Failed to get customer invoices');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting customer invoices:', error);
      throw new Error('Invoice retrieval failed');
    }
  }

  // Setup payment method for customer
  async setupPaymentMethod(customerId: string, paymentMethodId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/stripe/customers/${customerId}/payment-methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to setup payment method');
      }

      return { success: true };
    } catch (error) {
      console.error('Error setting up payment method:', error);
      return { success: false, error: 'Payment method setup failed' };
    }
  }

  // Get customer's payment methods
  async getCustomerPaymentMethods(customerId: string): Promise<any[]> {
    try {
      const response = await fetch(`/api/stripe/customers/${customerId}/payment-methods`);

      if (!response.ok) {
        throw new Error('Failed to get payment methods');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw new Error('Payment method retrieval failed');
    }
  }

  // Validate payment method
  async validatePaymentMethod(paymentMethodId: string): Promise<{ valid: boolean; error?: string }> {
    try {
      const response = await fetch('/api/stripe/validate-payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to validate payment method');
      }

      return await response.json();
    } catch (error) {
      console.error('Error validating payment method:', error);
      return { valid: false, error: 'Payment method validation failed' };
    }
  }

  // Get Stripe instance
  getStripe(): Stripe | null {
    return this.stripe;
  }

  // Check if Stripe is initialized
  isInitialized(): boolean {
    return this.stripe !== null;
  }
}

// Export singleton instance
export const stripeService = new StripeService(); 