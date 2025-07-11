import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TaxDashboard } from '@/components/financial/TaxDashboard';
import { FinancialReports } from '@/components/financial/FinancialReports';
import { 
  Calculator,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  PieChart,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  Receipt,
  Banknote,
  BarChart3
} from 'lucide-react';
import { ProfileMenu } from '@/components/ProfileMenu';
import { toast } from 'sonner';

interface DashboardMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  cashFlow: number;
  accountsReceivable: number;
  accountsPayable: number;
  currentRatio: number;
  monthlyGrowth: number;
  yearlyGrowth: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  status: 'available' | 'pending' | 'completed';
}

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  dueDate?: Date;
  priority: 'high' | 'medium' | 'low';
}

export const FinancialDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');

  // Mock data - would be fetched from Firebase
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRevenue: 485000,
    totalExpenses: 342000,
    netProfit: 143000,
    profitMargin: 29.5,
    cashFlow: 85000,
    accountsReceivable: 125000,
    accountsPayable: 68000,
    currentRatio: 2.1,
    monthlyGrowth: 8.2,
    yearlyGrowth: 15.7
  });

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Upcoming Tax Payment',
      message: 'Q1 estimated tax payment due in 5 days',
      dueDate: new Date('2024-01-20'),
      priority: 'high'
    },
    {
      id: '2',
      type: 'info',
      title: 'Monthly Report Ready',
      message: 'December financial report is ready for review',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'success',
      title: 'Invoice Payment Received',
      message: 'Payment of $15,000 received from TechCorp',
      priority: 'low'
    }
  ]);

  const [quickActions, setQuickActions] = useState<QuickAction[]>([
    {
      id: '1',
      title: 'Generate Monthly Report',
      description: 'Create comprehensive financial report for current month',
      icon: <FileText className="h-5 w-5" />,
      action: () => {
        toast.success('Monthly report generated successfully!');
        // In real implementation, generate and download report
      },
      status: 'available'
    },
    {
      id: '2',
      title: 'Record Expense',
      description: 'Add new business expense with receipt',
      icon: <Receipt className="h-5 w-5" />,
      action: () => {
        toast.info('Expense recording form will open here');
        // In real implementation, open expense form modal
      },
      status: 'available'
    },
    {
      id: '3',
      title: 'Send Invoice',
      description: 'Create and send invoice to client',
      icon: <CreditCard className="h-5 w-5" />,
      action: () => {
        toast.info('Invoice creation form will open here');
        // In real implementation, open invoice form modal
      },
      status: 'available'
    },
    {
      id: '4',
      title: 'Tax Filing',
      description: 'Prepare quarterly tax documents',
      icon: <Calculator className="h-5 w-5" />,
      action: () => {
        toast.info('Tax filing preparation will start here');
        // In real implementation, open tax filing workflow
      },
      status: 'pending'
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number, showSign: boolean = true) => {
    const sign = showSign && value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getAlertColor = (type: Alert['type']) => {
    const colors = {
      'warning': 'border-yellow-200 bg-yellow-50',
      'info': 'border-blue-200 bg-blue-50',
      'success': 'border-green-200 bg-green-50',
      'error': 'border-red-200 bg-red-50'
    };
    return colors[type];
  };

  const getAlertIcon = (type: Alert['type']) => {
    const icons = {
      'warning': <AlertTriangle className="h-4 w-4 text-yellow-600" />,
      'info': <Clock className="h-4 w-4 text-blue-600" />,
      'success': <CheckCircle className="h-4 w-4 text-green-600" />,
      'error': <AlertTriangle className="h-4 w-4 text-red-600" />
    };
    return icons[type];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="text-gray-600">Complete financial overview and management</p>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            New Report
          </Button>
          <ProfileMenu />
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="taxes">Tax Management</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
                <p className="text-xs text-green-600">
                  {formatPercentage(metrics.monthlyGrowth)} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(metrics.netProfit)}</div>
                <p className="text-xs text-muted-foreground">
                  {formatPercentage(metrics.profitMargin, false)} profit margin
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
                <Banknote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(metrics.cashFlow)}</div>
                <p className="text-xs text-muted-foreground">
                  Current ratio: {metrics.currentRatio.toFixed(1)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">A/R vs A/P</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(metrics.accountsReceivable - metrics.accountsPayable)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Net receivables position
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    className="w-full justify-start h-auto p-4"
                    onClick={action.action}
                    disabled={action.status === 'pending'}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{action.icon}</div>
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-gray-500">{action.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity & Alerts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle>Alerts & Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`border rounded-lg p-3 ${getAlertColor(alert.type)}`}
                    >
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{alert.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                          {alert.dueDate && (
                            <p className="text-xs text-gray-500 mt-2">
                              Due: {alert.dueDate.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {alert.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Financial Health Score */}
              <Card>
                <CardHeader>
                  <CardTitle>Financial Health Score</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">85</div>
                    <div className="text-sm text-gray-600">Excellent Financial Health</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Profitability</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Liquidity</span>
                        <span>88%</span>
                      </div>
                      <Progress value={88} className="h-2" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Efficiency</span>
                        <span>76%</span>
                      </div>
                      <Progress value={76} className="h-2" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Growth</span>
                        <span>84%</span>
                      </div>
                      <Progress value={84} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {formatCurrency(metrics.totalRevenue)}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
                  <div className="text-xs text-green-600">
                    {formatPercentage(metrics.yearlyGrowth)} YoY growth
                  </div>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600 mb-2">
                    {formatCurrency(metrics.totalExpenses)}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">Total Expenses</div>
                  <div className="text-xs text-gray-500">
                    {((metrics.totalExpenses / metrics.totalRevenue) * 100).toFixed(1)}% of revenue
                  </div>
                </div>
                
                <div className="text-center p-4 border rounded-lg bg-green-50">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {formatCurrency(metrics.netProfit)}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">Net Profit</div>
                  <div className="text-xs text-green-600">
                    {formatPercentage(metrics.profitMargin, false)} margin
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <FinancialReports />
        </TabsContent>

        {/* Tax Management Tab */}
        <TabsContent value="taxes">
          <TaxDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};