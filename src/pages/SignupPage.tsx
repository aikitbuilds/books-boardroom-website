import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, Star, Zap, Crown, ArrowRight, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { StripeProvider } from '@/components/payments/StripeProvider';
import { StripePaymentForm } from '@/components/payments/StripePaymentForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
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
    annualPrice: 1920,
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
    annualPrice: 4320,
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
    annualPrice: 6720,
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

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'plans' | 'details' | 'payment'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [stripeKey] = useState(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');
  
  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptMarketing: false
  });

  const handlePlanSelect = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setStep('details');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setStep('payment');
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = (paymentIntent: any) => {
    toast.success(`Welcome to BooksBoardroom! Your ${selectedPlan?.name} plan is now active.`);
    setShowPaymentDialog(false);
    
    // Here you would typically:
    // 1. Create user account in Firebase
    // 2. Set up subscription in your backend
    // 3. Redirect to dashboard
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
  };

  const getPrice = (plan: PricingPlan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join BooksBoardroom</h1>
          <p className="text-gray-600">Choose your plan and get started in minutes</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${step === 'plans' ? 'text-blue-600' : step === 'details' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'plans' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Choose Plan</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-200"></div>
            <div className={`flex items-center ${step === 'details' ? 'text-blue-600' : step === 'payment' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Account Details</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-200"></div>
            <div className={`flex items-center ${step === 'payment' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        {/* Step 1: Plan Selection */}
        {step === 'plans' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
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
                  className={`relative cursor-pointer transition-all hover:shadow-lg ${
                    selectedPlan?.id === plan.id ? 'ring-2 ring-blue-500' : ''
                  } ${plan.popular ? 'ring-2 ring-purple-500 shadow-lg' : ''}`}
                  onClick={() => handlePlanSelect(plan)}
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
                      className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                      size="lg"
                    >
                      Select Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Account Details */}
        {step === 'details' && selectedPlan && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Account Details</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{selectedPlan.name}</Badge>
                    <Badge variant="outline">{billingCycle === 'monthly' ? 'Monthly' : 'Annual'}</Badge>
                  </div>
                </CardTitle>
                <p className="text-gray-600">
                  {formatCurrency(getPrice(selectedPlan))} {billingCycle === 'monthly' ? 'per month' : 'per year'}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => handleInputChange('acceptTerms', checked as boolean)}
                      />
                      <Label htmlFor="acceptTerms" className="text-sm">
                        I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
                        <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> *
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="acceptMarketing"
                        checked={formData.acceptMarketing}
                        onCheckedChange={(checked) => handleInputChange('acceptMarketing', checked as boolean)}
                      />
                      <Label htmlFor="acceptMarketing" className="text-sm">
                        I want to receive updates about new features and offers
                      </Label>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep('plans')}
                    >
                      Back to Plans
                    </Button>
                    <Button type="submit" className="flex-1">
                      Continue to Payment
                      <CreditCard className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payment Dialog */}
        {showPaymentDialog && selectedPlan && (
          <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Complete Your Signup</DialogTitle>
                <DialogDescription>
                  You're signing up for the {selectedPlan.name} plan for{' '}
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
                      planName: selectedPlan.name,
                      userEmail: formData.email,
                      userFirstName: formData.firstName,
                      userLastName: formData.lastName,
                      userCompany: formData.company
                    }}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </StripeProvider>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default SignupPage; 