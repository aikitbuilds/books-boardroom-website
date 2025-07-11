import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  FileText,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  Share2,
  Building,
  CreditCard,
  Banknote,
  Receipt
} from 'lucide-react';

interface FinancialMetrics {
  revenue: {
    current: number;
    previous: number;
    growth: number;
  };
  expenses: {
    current: number;
    previous: number;
    growth: number;
  };
  profit: {
    current: number;
    previous: number;
    margin: number;
  };
  cashFlow: {
    operating: number;
    investing: number;
    financing: number;
    net: number;
  };
}

interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
  budget: number;
  variance: number;
}

interface Report {
  id: string;
  name: string;
  type: 'income-statement' | 'balance-sheet' | 'cash-flow' | 'budget-variance' | 'tax-summary';
  period: string;
  generatedDate: Date;
  status: 'ready' | 'generating' | 'error';
  size: string;
  format: 'pdf' | 'excel' | 'csv';
}

export const FinancialReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('current-year');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data - would be fetched from Firebase
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    revenue: {
      current: 485000,
      previous: 428000,
      growth: 13.3
    },
    expenses: {
      current: 342000,
      previous: 315000,
      growth: 8.6
    },
    profit: {
      current: 143000,
      previous: 113000,
      margin: 29.5
    },
    cashFlow: {
      operating: 125000,
      investing: -45000,
      financing: -25000,
      net: 55000
    }
  });

  const [revenueData, setRevenueData] = useState<RevenueData[]>([
    { month: 'Jan', revenue: 42000, expenses: 28000, profit: 14000 },
    { month: 'Feb', revenue: 38000, expenses: 27000, profit: 11000 },
    { month: 'Mar', revenue: 45000, expenses: 31000, profit: 14000 },
    { month: 'Apr', revenue: 41000, expenses: 29000, profit: 12000 },
    { month: 'May', revenue: 48000, expenses: 33000, profit: 15000 },
    { month: 'Jun', revenue: 52000, expenses: 35000, profit: 17000 },
    { month: 'Jul', revenue: 47000, expenses: 32000, profit: 15000 },
    { month: 'Aug', revenue: 49000, expenses: 34000, profit: 15000 },
    { month: 'Sep', revenue: 44000, expenses: 30000, profit: 14000 },
    { month: 'Oct', revenue: 46000, expenses: 31000, profit: 15000 },
    { month: 'Nov', revenue: 51000, expenses: 36000, profit: 15000 },
    { month: 'Dec', revenue: 54000, expenses: 38000, profit: 16000 }
  ]);

  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([
    { category: 'Salaries & Benefits', amount: 168000, percentage: 49.1, budget: 170000, variance: -2000 },
    { category: 'Marketing & Advertising', amount: 52000, percentage: 15.2, budget: 50000, variance: 2000 },
    { category: 'Office Rent', amount: 36000, percentage: 10.5, budget: 36000, variance: 0 },
    { category: 'Professional Services', amount: 28000, percentage: 8.2, budget: 25000, variance: 3000 },
    { category: 'Technology & Software', amount: 24000, percentage: 7.0, budget: 22000, variance: 2000 },
    { category: 'Travel & Entertainment', amount: 18000, percentage: 5.3, budget: 20000, variance: -2000 },
    { category: 'Utilities & Communications', amount: 12000, percentage: 3.5, budget: 12000, variance: 0 },
    { category: 'Other', amount: 4000, percentage: 1.2, budget: 5000, variance: -1000 }
  ]);

  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      name: 'Income Statement - 2024',
      type: 'income-statement',
      period: 'Year-to-Date 2024',
      generatedDate: new Date('2024-01-15'),
      status: 'ready',
      size: '2.3 MB',
      format: 'pdf'
    },
    {
      id: '2',
      name: 'Cash Flow Statement - Q4 2023',
      type: 'cash-flow',
      period: 'Q4 2023',
      generatedDate: new Date('2024-01-10'),
      status: 'ready',
      size: '1.8 MB',
      format: 'excel'
    },
    {
      id: '3',
      name: 'Budget vs Actual - December 2023',
      type: 'budget-variance',
      period: 'December 2023',
      generatedDate: new Date('2024-01-05'),
      status: 'ready',
      size: '945 KB',
      format: 'pdf'
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

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-red-600'; // Over budget
    if (variance < 0) return 'text-green-600'; // Under budget
    return 'text-gray-600'; // On budget
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const generateReport = async (type: Report['type']) => {
    setIsGenerating(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newReport: Report = {
      id: Date.now().toString(),
      name: `${type.replace('-', ' ').toUpperCase()} - ${new Date().toLocaleDateString()}`,
      type,
      period: selectedPeriod,
      generatedDate: new Date(),
      status: 'ready',
      size: '1.2 MB',
      format: 'pdf'
    };
    
    setReports([newReport, ...reports]);
    setIsGenerating(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-600">Comprehensive financial analysis and reporting</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Current Month</SelectItem>
              <SelectItem value="current-quarter">Current Quarter</SelectItem>
              <SelectItem value="current-year">Current Year</SelectItem>
              <SelectItem value="previous-year">Previous Year</SelectItem>
              <SelectItem value="ytd">Year-to-Date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.revenue.current)}</div>
            <p className={`text-xs ${getGrowthColor(metrics.revenue.growth)}`}>
              {formatPercentage(metrics.revenue.growth)} from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.expenses.current)}</div>
            <p className={`text-xs ${getGrowthColor(metrics.expenses.growth)}`}>
              {formatPercentage(metrics.expenses.growth)} from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(metrics.profit.current)}</div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(metrics.profit.margin, false)} profit margin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metrics.cashFlow.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(metrics.cashFlow.net)}
            </div>
            <p className="text-xs text-muted-foreground">Net cash flow</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="income">Income Statement</TabsTrigger>
          <TabsTrigger value="expenses">Expense Analysis</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend (12 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-64 flex items-end justify-between gap-2">
                    {revenueData.map((data, index) => (
                      <div key={data.month} className="flex flex-col items-center flex-1">
                        <div className="w-full bg-blue-100 rounded-t relative" 
                             style={{ height: `${(data.revenue / 60000) * 200}px` }}>
                          <div className="absolute inset-0 bg-blue-500 rounded-t"
                               style={{ height: `${(data.profit / data.revenue) * 100}%` }}>
                          </div>
                        </div>
                        <span className="text-xs mt-2 text-gray-600">{data.month}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-100 rounded"></div>
                      <span>Revenue</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Profit</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expense Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expenseCategories.slice(0, 6).map((category) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{category.category}</span>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{formatCurrency(category.amount)}</div>
                          <div className="text-xs text-gray-500">{formatPercentage(category.percentage, false)}</div>
                        </div>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cash Flow Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Operating</div>
                  <div className={`text-xl font-bold ${metrics.cashFlow.operating >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(metrics.cashFlow.operating)}
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Investing</div>
                  <div className={`text-xl font-bold ${metrics.cashFlow.investing >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(metrics.cashFlow.investing)}
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Financing</div>
                  <div className={`text-xl font-bold ${metrics.cashFlow.financing >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(metrics.cashFlow.financing)}
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg bg-gray-50">
                  <div className="text-sm text-gray-600 mb-1">Net Cash Flow</div>
                  <div className={`text-xl font-bold ${metrics.cashFlow.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(metrics.cashFlow.net)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Income Statement Tab */}
        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Income Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg mb-3">Revenue</h3>
                  <div className="flex justify-between items-center">
                    <span>Total Revenue</span>
                    <span className="font-semibold">{formatCurrency(metrics.revenue.current)}</span>
                  </div>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg mb-3">Expenses</h3>
                  {expenseCategories.map((category) => (
                    <div key={category.category} className="flex justify-between items-center py-1">
                      <span>{category.category}</span>
                      <span>{formatCurrency(category.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 border-t font-semibold">
                    <span>Total Expenses</span>
                    <span>{formatCurrency(metrics.expenses.current)}</span>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center text-lg font-bold text-green-700">
                    <span>Net Income</span>
                    <span>{formatCurrency(metrics.profit.current)}</span>
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    Profit Margin: {formatPercentage(metrics.profit.margin, false)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expense Analysis Tab */}
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget vs Actual Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4 font-medium">Category</th>
                      <th className="text-right p-4 font-medium">Budget</th>
                      <th className="text-right p-4 font-medium">Actual</th>
                      <th className="text-right p-4 font-medium">Variance</th>
                      <th className="text-right p-4 font-medium">% of Budget</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenseCategories.map((category) => (
                      <tr key={category.category} className="border-b hover:bg-gray-50">
                        <td className="p-4">{category.category}</td>
                        <td className="p-4 text-right">{formatCurrency(category.budget)}</td>
                        <td className="p-4 text-right">{formatCurrency(category.amount)}</td>
                        <td className={`p-4 text-right font-medium ${getVarianceColor(category.variance)}`}>
                          {formatCurrency(category.variance)}
                        </td>
                        <td className="p-4 text-right">
                          {((category.amount / category.budget) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cash Flow Tab */}
        <TabsContent value="cashflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                <LineChart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Detailed cash flow analysis will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report Generation */}
            <Card>
              <CardHeader>
                <CardTitle>Generate Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => generateReport('income-statement')} 
                  disabled={isGenerating}
                  className="w-full"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Income Statement
                </Button>
                <Button 
                  onClick={() => generateReport('balance-sheet')} 
                  disabled={isGenerating}
                  className="w-full"
                  variant="outline"
                >
                  <Building className="h-4 w-4 mr-2" />
                  Balance Sheet
                </Button>
                <Button 
                  onClick={() => generateReport('cash-flow')} 
                  disabled={isGenerating}
                  className="w-full"
                  variant="outline"
                >
                  <Banknote className="h-4 w-4 mr-2" />
                  Cash Flow
                </Button>
                <Button 
                  onClick={() => generateReport('budget-variance')} 
                  disabled={isGenerating}
                  className="w-full"
                  variant="outline"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Budget Analysis
                </Button>
                <Button 
                  onClick={() => generateReport('tax-summary')} 
                  disabled={isGenerating}
                  className="w-full"
                  variant="outline"
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  Tax Summary
                </Button>
                
                {isGenerating && (
                  <div className="text-center text-sm text-gray-600">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Generating report...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generated Reports */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <div key={report.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{report.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{report.period}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>Generated: {report.generatedDate.toLocaleDateString()}</span>
                              <span>Size: {report.size}</span>
                              <Badge variant="outline">{report.format.toUpperCase()}</Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Share2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};