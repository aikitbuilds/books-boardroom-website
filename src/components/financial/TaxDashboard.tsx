import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Calculator,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Building,
  Receipt,
  CreditCard,
  Banknote,
  PieChart,
  Brain,
  Zap,
  Target,
  Lightbulb,
  Sparkles,
  TrendingUp as TrendingUpIcon,
  Shield,
  AlertCircle
} from 'lucide-react';

interface TaxRecord {
  id: string;
  year: number;
  quarter?: number;
  type: 'income' | 'sales' | 'payroll' | 'property' | 'estimated';
  status: 'draft' | 'filed' | 'paid' | 'overdue' | 'pending';
  amount: number;
  dueDate: Date;
  filedDate?: Date;
  paidDate?: Date;
  description: string;
  documents: string[];
}

interface TaxDeduction {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: Date;
  receiptUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  businessPurpose: string;
  aiCategorized?: boolean;
  aiConfidence?: number;
  aiSuggested?: boolean;
}

interface AIInsight {
  id: string;
  type: 'optimization' | 'compliance' | 'deduction' | 'warning' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  potentialSavings?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionRequired: boolean;
  createdAt: Date;
}

interface AITaxAnalysis {
  totalPotentialSavings: number;
  missedDeductions: number;
  complianceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: AIInsight[];
}

interface TaxSummary {
  totalTaxLiability: number;
  totalPaid: number;
  totalOwed: number;
  totalRefund: number;
  estimatedPayments: number;
  deductions: number;
  effectiveRate: number;
  nextDueDate: Date;
  nextAmount: number;
}

export const TaxDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [newDeduction, setNewDeduction] = useState({
    category: '',
    description: '',
    amount: 0,
    businessPurpose: ''
  });

  // Mock data - would be fetched from Firebase
  const [taxSummary, setTaxSummary] = useState<TaxSummary>({
    totalTaxLiability: 125000,
    totalPaid: 98000,
    totalOwed: 27000,
    totalRefund: 0,
    estimatedPayments: 85000,
    deductions: 32000,
    effectiveRate: 22.5,
    nextDueDate: new Date('2024-04-15'),
    nextAmount: 15000
  });

  const [taxRecords, setTaxRecords] = useState<TaxRecord[]>([
    {
      id: '1',
      year: 2024,
      quarter: 1,
      type: 'estimated',
      status: 'paid',
      amount: 25000,
      dueDate: new Date('2024-01-15'),
      paidDate: new Date('2024-01-12'),
      description: 'Q1 2024 Estimated Tax Payment',
      documents: ['form_1040es_q1.pdf']
    },
    {
      id: '2',
      year: 2023,
      type: 'income',
      status: 'filed',
      amount: 45000,
      dueDate: new Date('2024-04-15'),
      filedDate: new Date('2024-03-20'),
      description: '2023 Federal Income Tax Return',
      documents: ['form_1040_2023.pdf', 'schedule_c_2023.pdf']
    },
    {
      id: '3',
      year: 2024,
      quarter: 2,
      type: 'sales',
      status: 'overdue',
      amount: 8500,
      dueDate: new Date('2024-01-31'),
      description: 'Q4 2023 Sales Tax - State',
      documents: []
    }
  ]);

  // AI Analysis State
  const [aiAnalysis, setAiAnalysis] = useState<AITaxAnalysis>({
    totalPotentialSavings: 18500,
    missedDeductions: 7,
    complianceScore: 87,
    riskLevel: 'medium',
    recommendations: [
      {
        id: '1',
        type: 'deduction',
        title: 'Missing Home Office Deduction',
        description: 'AI detected you may qualify for home office deduction based on your business activities.',
        confidence: 89,
        potentialSavings: 3200,
        priority: 'high',
        actionRequired: true,
        createdAt: new Date()
      },
      {
        id: '2',
        type: 'optimization',
        title: 'Equipment Depreciation Opportunity',
        description: 'Consider accelerated depreciation for recently purchased equipment.',
        confidence: 76,
        potentialSavings: 5400,
        priority: 'medium',
        actionRequired: false,
        createdAt: new Date()
      },
      {
        id: '3',
        type: 'compliance',
        title: 'Quarterly Filing Reminder',
        description: 'Q2 estimated tax payment due in 15 days.',
        confidence: 100,
        priority: 'urgent',
        actionRequired: true,
        createdAt: new Date()
      }
    ]
  });

  const [deductions, setDeductions] = useState<TaxDeduction[]>([
    {
      id: '1',
      category: 'Office Supplies',
      description: 'Computer equipment and software',
      amount: 2500,
      date: new Date('2024-01-15'),
      status: 'approved',
      businessPurpose: 'Essential equipment for business operations',
      aiCategorized: true,
      aiConfidence: 94
    },
    {
      id: '2',
      category: 'Travel',
      description: 'Business trip to client meeting',
      amount: 850,
      date: new Date('2024-01-20'),
      status: 'pending',
      businessPurpose: 'Client meeting for new contract negotiation',
      aiCategorized: true,
      aiConfidence: 87,
      aiSuggested: true
    },
    {
      id: '3',
      category: 'Professional Services',
      description: 'Legal consultation fees',
      amount: 1200,
      date: new Date('2024-01-10'),
      status: 'approved',
      businessPurpose: 'Contract review and legal advice',
      aiCategorized: false,
      aiConfidence: 0
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'paid': 'bg-green-100 text-green-800',
      'filed': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'overdue': 'bg-red-100 text-red-800',
      'draft': 'bg-gray-100 text-gray-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const deductionCategories = [
    'Office Supplies',
    'Travel',
    'Meals & Entertainment',
    'Professional Services',
    'Equipment',
    'Software',
    'Marketing & Advertising',
    'Insurance',
    'Utilities',
    'Rent',
    'Other'
  ];

  const addDeduction = () => {
    if (newDeduction.category && newDeduction.description && newDeduction.amount > 0) {
      const deduction: TaxDeduction = {
        id: Date.now().toString(),
        ...newDeduction,
        date: new Date(),
        status: 'pending'
      };
      setDeductions([...deductions, deduction]);
      setNewDeduction({
        category: '',
        description: '',
        amount: 0,
        businessPurpose: ''
      });
    }
  };

  const approvedDeductions = deductions.filter(d => d.status === 'approved');
  const totalDeductions = approvedDeductions.reduce((sum, d) => sum + d.amount, 0);
  const pendingDeductions = deductions.filter(d => d.status === 'pending');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tax Management</h1>
          <p className="text-gray-600">Manage taxes, deductions, and compliance</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </div>
      </div>

      {/* Tax Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tax Liability</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(taxSummary.totalTaxLiability)}</div>
            <p className="text-xs text-muted-foreground">
              Effective rate: {taxSummary.effectiveRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount Owed</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(taxSummary.totalOwed)}</div>
            <p className="text-xs text-muted-foreground">
              Due: {taxSummary.nextDueDate.toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
            <Receipt className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalDeductions)}</div>
            <p className="text-xs text-muted-foreground">
              {approvedDeductions.length} approved items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payments Made</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(taxSummary.totalPaid)}</div>
            <p className="text-xs text-muted-foreground">
              Including estimated payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alert for Overdue Items */}
      {taxRecords.some(record => record.status === 'overdue') && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have overdue tax obligations. Please review and file immediately to avoid penalties.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="returns">Tax Returns</TabsTrigger>
          <TabsTrigger value="deductions">Deductions</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tax Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Year-to-Date Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tax Payments</span>
                    <span>{((taxSummary.totalPaid / taxSummary.totalTaxLiability) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(taxSummary.totalPaid / taxSummary.totalTaxLiability) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Deductions Recorded</span>
                    <span>{formatCurrency(totalDeductions)}</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>

                <div className="pt-4 space-y-2">
                  <h4 className="font-medium text-sm">Upcoming Deadlines</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                      <span className="text-sm">Q1 Estimated Payment</span>
                      <span className="text-sm font-medium">Apr 15, 2024</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm">Annual Return Filing</span>
                      <span className="text-sm font-medium">Apr 15, 2024</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Q1 Payment Filed</p>
                      <p className="text-xs text-gray-500">{formatCurrency(25000)} • 3 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Receipt className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New Deduction Added</p>
                      <p className="text-xs text-gray-500">Office supplies • 1 week ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <FileText className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Document Uploaded</p>
                      <p className="text-xs text-gray-500">Form 1040ES • 1 week ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai-insights" className="space-y-4">
          {/* AI Analysis Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Confidence Score</CardTitle>
                <Brain className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{aiAnalysis.complianceScore}%</div>
                <p className="text-xs text-muted-foreground">
                  Tax compliance accuracy
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
                <Target className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(aiAnalysis.totalPotentialSavings)}</div>
                <p className="text-xs text-muted-foreground">
                  AI-identified opportunities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Missed Deductions</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{aiAnalysis.missedDeductions}</div>
                <p className="text-xs text-muted-foreground">
                  Items requiring review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
                <Shield className={`h-4 w-4 ${
                  aiAnalysis.riskLevel === 'low' ? 'text-green-500' :
                  aiAnalysis.riskLevel === 'medium' ? 'text-yellow-500' : 'text-red-500'
                }`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold capitalize ${
                  aiAnalysis.riskLevel === 'low' ? 'text-green-600' :
                  aiAnalysis.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {aiAnalysis.riskLevel}
                </div>
                <p className="text-xs text-muted-foreground">
                  Compliance risk assessment
                </p>
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                AI-Powered Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiAnalysis.recommendations.map((insight) => (
                  <div key={insight.id} className={`border rounded-lg p-4 ${
                    insight.priority === 'urgent' ? 'border-red-200 bg-red-50' :
                    insight.priority === 'high' ? 'border-orange-200 bg-orange-50' :
                    insight.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                    'border-blue-200 bg-blue-50'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-full ${
                          insight.type === 'deduction' ? 'bg-green-100' :
                          insight.type === 'optimization' ? 'bg-blue-100' :
                          insight.type === 'compliance' ? 'bg-purple-100' :
                          insight.type === 'warning' ? 'bg-red-100' :
                          'bg-yellow-100'
                        }`}>
                          {insight.type === 'deduction' && <Receipt className="h-4 w-4 text-green-600" />}
                          {insight.type === 'optimization' && <TrendingUpIcon className="h-4 w-4 text-blue-600" />}
                          {insight.type === 'compliance' && <Shield className="h-4 w-4 text-purple-600" />}
                          {insight.type === 'warning' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                          {insight.type === 'opportunity' && <Lightbulb className="h-4 w-4 text-yellow-600" />}
                        </div>
                        <div>
                          <h4 className="font-medium">{insight.title}</h4>
                          <p className="text-sm text-gray-600">{insight.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`mb-1 ${
                          insight.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          insight.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {insight.priority}
                        </Badge>
                        {insight.potentialSavings && (
                          <div className="text-sm font-medium text-green-600">
                            Save {formatCurrency(insight.potentialSavings)}
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          {insight.confidence}% confidence
                        </div>
                      </div>
                    </div>
                    {insight.actionRequired && (
                      <div className="mt-3 pt-3 border-t">
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <Zap className="h-3 w-3 mr-2" />
                          Take Action
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI-Powered Transaction Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Smart Transaction Categorization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    AI has automatically categorized 94% of your transactions with high confidence.
                    <Button variant="link" className="p-0 ml-2 h-auto">
                      Review suggestions →
                    </Button>
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">156</div>
                    <div className="text-sm text-gray-600">Auto-categorized</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">12</div>
                    <div className="text-sm text-gray-600">Need review</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">7</div>
                    <div className="text-sm text-gray-600">Suggested deductions</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Returns Tab */}
        <TabsContent value="returns" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Tax Returns & Filings</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Filing
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4 font-medium">Type</th>
                      <th className="text-left p-4 font-medium">Period</th>
                      <th className="text-left p-4 font-medium">Amount</th>
                      <th className="text-left p-4 font-medium">Due Date</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxRecords.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="capitalize">{record.type} Tax</span>
                          </div>
                        </td>
                        <td className="p-4">
                          {record.quarter ? `Q${record.quarter} ${record.year}` : record.year}
                        </td>
                        <td className="p-4 font-medium">{formatCurrency(record.amount)}</td>
                        <td className="p-4">{record.dueDate.toLocaleDateString()}</td>
                        <td className="p-4">
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deductions Tab */}
        <TabsContent value="deductions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add New Deduction */}
            <Card>
              <CardHeader>
                <CardTitle>Add Deduction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newDeduction.category} onValueChange={(value) => 
                    setNewDeduction({...newDeduction, category: value})
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {deductionCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newDeduction.description}
                    onChange={(e) => setNewDeduction({...newDeduction, description: e.target.value})}
                    placeholder="Brief description"
                  />
                </div>
                
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newDeduction.amount || ''}
                    onChange={(e) => setNewDeduction({...newDeduction, amount: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="purpose">Business Purpose</Label>
                  <Input
                    id="purpose"
                    value={newDeduction.businessPurpose}
                    onChange={(e) => setNewDeduction({...newDeduction, businessPurpose: e.target.value})}
                    placeholder="Explain business purpose"
                  />
                </div>
                
                <Button onClick={addDeduction} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Deduction
                </Button>
              </CardContent>
            </Card>

            {/* Deductions List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Tax Deductions ({selectedYear})</CardTitle>
                    <div className="text-sm text-gray-600">
                      Total: {formatCurrency(totalDeductions)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deductions.map((deduction) => (
                      <div key={deduction.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{deduction.description}</h4>
                              <Badge className={getStatusColor(deduction.status)}>
                                {deduction.status}
                              </Badge>
                              {deduction.aiCategorized && (
                                <Badge className="bg-purple-100 text-purple-800">
                                  <Brain className="h-3 w-3 mr-1" />
                                  AI: {deduction.aiConfidence}%
                                </Badge>
                              )}
                              {deduction.aiSuggested && (
                                <Badge className="bg-blue-100 text-blue-800">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  AI Suggested
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{deduction.category}</p>
                            <p className="text-xs text-gray-500">{deduction.businessPurpose}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-lg">{formatCurrency(deduction.amount)}</div>
                            <div className="text-xs text-gray-500">{deduction.date.toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-3">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Upload className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History & Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Payment tracking will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Compliance tracking will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};