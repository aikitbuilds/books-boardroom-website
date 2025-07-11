import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText, 
  Settings,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { PricingPlans } from '@/components/payments/PricingPlans';
import { StripeProvider } from '@/components/payments/StripeProvider';
import { StripePaymentForm } from '@/components/payments/StripePaymentForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Subscription {
  id: string;
  planName: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  amount: number;
  billingCycle: 'monthly' | 'annual';
  nextBillingDate: string;
}

interface PaymentHistory {
  id: string;
  amount: number;
  status: 'succeeded' | 'failed' | 'pending';
  date: string;
  description: string;
  invoiceUrl?: string;
}

const PaymentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate loading subscription data
    setTimeout(() => {
      setSubscription({
        id: 'sub_123456789',
        planName: 'Professional',
        status: 'active',
        currentPeriodStart: '2024-01-01',
        currentPeriodEnd: '2024-02-01',
        amount: 450,
        billingCycle: 'monthly',
        nextBillingDate: '2024-02-01'
      });

      setPaymentHistory([
        {
          id: 'pi_123456789',
          amount: 450,
          status: 'succeeded',
          date: '2024-01-01',
          description: 'Professional Plan - Monthly Billing',
          invoiceUrl: 'https://invoice.stripe.com/i/acct_123/test_YWNjdF8xMjM0NTY3ODksX2ludm9pY2VfMTIzNDU2Nzg5'
        },
        {
          id: 'pi_123456788',
          amount: 450,
          status: 'succeeded',
          date: '2023-12-01',
          description: 'Professional Plan - Monthly Billing',
          invoiceUrl: 'https://invoice.stripe.com/i/acct_123/test_YWNjdF8xMjM0NTY3ODksX2ludm9pY2VfMTIzNDU2Nzg4'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = (paymentIntent: any) => {
    toast.success('Payment successful! Your subscription has been updated.');
    setShowPaymentDialog(false);
    setSelectedPlan(null);
    // Refresh subscription data
    window.location.reload();
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800';
      case 'trialing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      case 'past_due':
        return <AlertCircle className="h-4 w-4" />;
      case 'trialing':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Dashboard</h1>
        <p className="text-gray-600">Manage your subscription and payment history</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans & Pricing</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subscription?.planName}</div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(subscription?.amount || 0)}/{subscription?.billingCycle}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(subscription?.status || '')}
                  <Badge className={getStatusColor(subscription?.status || '')}>
                    {subscription?.status?.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDate(subscription?.nextBillingDate || '')}
                </div>
                <p className="text-xs text-muted-foreground">
                  {subscription?.billingCycle === 'annual' ? 'Annual' : 'Monthly'} billing
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Plan</label>
                  <p className="text-sm">{subscription?.planName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Amount</label>
                  <p className="text-sm">{formatCurrency(subscription?.amount || 0)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Billing Cycle</label>
                  <p className="text-sm capitalize">{subscription?.billingCycle}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <p className="text-sm capitalize">{subscription?.status?.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Current Period Start</label>
                  <p className="text-sm">{formatDate(subscription?.currentPeriodStart || '')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Current Period End</label>
                  <p className="text-sm">{formatDate(subscription?.currentPeriodEnd || '')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <PricingPlans />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Method</label>
                  <p className="text-sm">•••• •••• •••• 4242</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Billing Address</label>
                  <p className="text-sm">123 Main St, City, State 12345</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Update Payment Method
                </Button>
                <Button variant="outline" size="sm">
                  Update Billing Address
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{payment.description}</p>
                      <p className="text-sm text-gray-600">{formatDate(payment.date)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{formatCurrency(payment.amount)}</span>
                      {payment.invoiceUrl && (
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${
                        payment.status === 'succeeded' ? 'bg-green-100' : 
                        payment.status === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
                      }`}>
                        {payment.status === 'succeeded' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : payment.status === 'failed' ? (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{payment.description}</p>
                        <p className="text-sm text-gray-600">{formatDate(payment.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(payment.amount)}</p>
                      <Badge variant={payment.status === 'succeeded' ? 'default' : 'secondary'}>
                        {payment.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Dialog */}
      {selectedPlan && showPaymentDialog && (
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Your Purchase</DialogTitle>
              <DialogDescription>
                You're subscribing to the {selectedPlan.name} plan for{' '}
                {selectedPlan.billingCycle === 'monthly' ? 'monthly' : 'annual'} billing.
              </DialogDescription>
            </DialogHeader>
            
            <StripeProvider publishableKey={import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''}>
              <StripePaymentForm
                amount={selectedPlan.amount * 100} // Convert to cents
                description={`${selectedPlan.name} Plan - ${selectedPlan.billingCycle === 'monthly' ? 'Monthly' : 'Annual'} Billing`}
                metadata={{
                  planId: selectedPlan.id,
                  billingCycle: selectedPlan.billingCycle,
                  planName: selectedPlan.name
                }}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </StripeProvider>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PaymentDashboard; 