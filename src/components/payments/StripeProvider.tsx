import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

interface StripeProviderProps {
  children: React.ReactNode;
  publishableKey: string;
}

// Initialize Stripe outside of component to avoid recreating on every render
let stripePromise: Promise<any> | null = null;

const getStripePromise = (publishableKey: string) => {
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export const StripeProvider: React.FC<StripeProviderProps> = ({ 
  children, 
  publishableKey 
}) => {
  const stripePromise = getStripePromise(publishableKey);

  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}; 