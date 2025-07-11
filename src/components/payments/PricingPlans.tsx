import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { StripeProvider } from './StripeProvider';
import { StripePaymentForm } from './StripePaymentForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number; // 20% discount applied
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for small businesses getting started',
    monthlyPrice: 200,
    annualPrice: 1920, // 200 * 12 * 0.8 (20% discount)
    features: [
      'Up to 5 users',
      'Basic CRM features',
      'File management',
      'Email support',
      'Standard reporting',
      'Mobile app access'
    ],
    icon: <Zap className="h-6 w-6" />,
    color: 'bg-blue-500'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Ideal for growing businesses',
    monthlyPrice: 450,
    annualPrice: 4320, // 450 * 12 * 0.8 (20% discount)
    features: [
      'Up to 25 users',
      'Advanced CRM features',
      'Priority support',
      'Advanced analytics',
      'Custom integrations',
      'Team collaboration',
      'Advanced reporting',
      'API access'
    ],
    popular: true,
    icon: <Star className="h-6 w-6" />,
    color: 'bg-purple-500'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with complex needs',
    monthlyPrice: 700,
    annualPrice: 6720, // 700 * 12 * 0.8 (20% discount)
    features: [
      'Unlimited users',
      'Enterprise CRM',
      '24/7 phone support',
      'Custom development',
      'Advanced security',
      'White-label options',
      'Dedicated account manager',
      'SLA guarantees'
    ],
    icon: <Crown className="h-6 w-6" />,
    color: 'bg-orange-500'
  }
];

interface PricingPlansProps {
  className?: string;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({ className }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [stripeKey] = useState(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

  const handlePlanSelect = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = (paymentIntent: any) => {
    toast.success(`Payment successful! Welcome to ${selectedPlan?.name} plan.`);
    setShowPaymentDialog(false);
    setSelectedPlan(null);
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
  };

  const getPrice = (plan: PricingPlan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
  };

  const getBillingText = (plan: PricingPlan) => {
    if (billingCycle === 'monthly') {
      return `$${plan.monthlyPrice}/month`;
    } else {
      return `$${plan.annualPrice}/year (Save 20%)`;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={className}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
        <p className="text-lg text-gray-600 mb-6">
          Select the perfect plan for your business needs
        </p>
        
        {/* Billing Cycle Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              billingCycle === 'annual' ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
            Annual
            {billingCycle === 'annual' && (
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                Save 20%
              </Badge>
            )}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${plan.popular ? 'ring-2 ring-purple-500 shadow-lg' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-500 text-white px-3 py-1">
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <div className={`inline-flex p-3 rounded-full ${plan.color} text-white mb-4`}>
                {plan.icon}
              </div>
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              <p className="text-gray-600 text-sm">{plan.description}</p>
            </CardHeader>
            
            <CardContent className="text-center">
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(getPrice(plan))}
                </div>
                <div className="text-sm text-gray-600">
                  {billingCycle === 'monthly' ? 'per month' : 'per year'}
                </div>
                {billingCycle === 'annual' && (
                  <div className="text-xs text-green-600 mt-1">
                    Save {formatCurrency(plan.monthlyPrice * 12 - plan.annualPrice)} annually
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-6 text-left">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handlePlanSelect(plan)}
                className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                size="lg"
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Dialog */}
      {selectedPlan && showPaymentDialog && (
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Your Purchase</DialogTitle>
              <DialogDescription>
                You're subscribing to the {selectedPlan.name} plan for{' '}
                {billingCycle === 'monthly' ? 'monthly' : 'annual'} billing.
              </DialogDescription>
            </DialogHeader>
            
            {stripeKey && (
              <StripeProvider publishableKey={stripeKey}>
                <StripePaymentForm
                  amount={getPrice(selectedPlan) * 100} // Convert to cents
                  description={`${selectedPlan.name} Plan - ${billingCycle === 'monthly' ? 'Monthly' : 'Annual'} Billing`}
                  metadata={{
                    planId: selectedPlan.id,
                    billingCycle: billingCycle,
                    planName: selectedPlan.name
                  }}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </StripeProvider>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* FAQ Section */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900">Can I change my plan later?</h4>
              <p className="text-sm text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">What payment methods do you accept?</h4>
              <p className="text-sm text-gray-600">We accept all major credit cards, debit cards, and digital wallets through our secure Stripe integration.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900">Is there a setup fee?</h4>
              <p className="text-sm text-gray-600">No setup fees. You only pay the monthly or annual subscription fee.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Can I cancel anytime?</h4>
              <p className="text-sm text-gray-600">Yes, you can cancel your subscription at any time. No long-term contracts required.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 