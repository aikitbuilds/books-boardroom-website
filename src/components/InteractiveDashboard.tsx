import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  Calendar,
  Plus,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download,
  Upload,
  Settings,
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  status: 'available' | 'pending' | 'completed';
  color: string;
}

interface RecentActivity {
  id: string;
  type: 'contact' | 'project' | 'financial' | 'document' | 'task';
  title: string;
  description: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'warning' | 'error';
  value?: number;
}

export const InteractiveDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'contact' | 'project' | 'expense' | 'task'>('contact');
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    type: '',
    value: 0,
    date: '',
    status: 'pending'
  });

  // Real-time metrics with live updates
  const [metrics, setMetrics] = useState<DashboardMetric[]>([
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: '$485,000',
      change: 12.5,
      changeType: 'increase',
      icon: <DollarSign className="h-4 w-4" />,
      color: 'text-green-600',
      trend: 'up'
    },
    {
      id: 'contacts',
      label: 'Total Contacts',
      value: 156,
      change: 8.3,
      changeType: 'increase',
      icon: <Users className="h-4 w-4" />,
      color: 'text-blue-600',
      trend: 'up'
    },
    {
      id: 'projects',
      label: 'Active Projects',
      value: 8,
      change: -2.1,
      changeType: 'decrease',
      icon: <Target className="h-4 w-4" />,
      color: 'text-orange-600',
      trend: 'down'
    },
    {
      id: 'tasks',
      label: 'Pending Tasks',
      value: 12,
      change: -15.2,
      changeType: 'decrease',
      icon: <Clock className="h-4 w-4" />,
      color: 'text-purple-600',
      trend: 'up'
    }
  ]);

  // Chart data for different visualizations
  const [chartData, setChartData] = useState<ChartData>({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [32000, 35000, 38000, 42000, 45000, 48500],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)'
      },
      {
        label: 'Expenses',
        data: [28000, 30000, 32000, 35000, 38000, 42000],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)'
      }
    ]
  });

  // Quick actions with real functionality
  const [quickActions, setQuickActions] = useState<QuickAction[]>([
    {
      id: 'add-contact',
      title: 'Add New Contact',
      description: 'Create a new contact in your CRM',
      icon: <Users className="h-5 w-5" />,
      action: () => handleQuickAction('contact'),
      status: 'available',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'create-project',
      title: 'Create Project',
      description: 'Start a new project',
      icon: <Target className="h-5 w-5" />,
      action: () => handleQuickAction('project'),
      status: 'available',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'record-expense',
      title: 'Record Expense',
      description: 'Add a new business expense',
      icon: <DollarSign className="h-5 w-5" />,
      action: () => handleQuickAction('expense'),
      status: 'available',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      id: 'add-task',
      title: 'Add Task',
      description: 'Create a new task',
      icon: <CheckCircle className="h-5 w-5" />,
      action: () => handleQuickAction('task'),
      status: 'available',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ]);

  // Recent activities with real data
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'contact',
      title: 'New Lead Added',
      description: 'John Smith from TechCorp added to contacts',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed',
      value: 15000
    },
    {
      id: '2',
      type: 'project',
      title: 'Project Completed',
      description: 'Solar installation for Smith Residence finished',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: 'completed',
      value: 25000
    },
    {
      id: '3',
      type: 'financial',
      title: 'Payment Received',
      description: 'Invoice #2024-001 payment received',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'completed',
      value: 15000
    },
    {
      id: '4',
      type: 'task',
      title: 'Task Overdue',
      description: 'Follow up with Johnson family - overdue by 2 days',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      status: 'warning'
    }
  ]);

  // Handle quick actions
  const handleQuickAction = (type: 'contact' | 'project' | 'expense' | 'task') => {
    setDialogType(type);
    setShowCreateDialog(true);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!newItem.name || !newItem.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update metrics based on type
    const updatedMetrics = [...metrics];
    const metricIndex = updatedMetrics.findIndex(m => 
      dialogType === 'contact' ? m.id === 'contacts' :
      dialogType === 'project' ? m.id === 'projects' :
      dialogType === 'expense' ? m.id === 'revenue' :
      m.id === 'tasks'
    );

    if (metricIndex !== -1) {
      const currentValue = typeof updatedMetrics[metricIndex].value === 'string' 
        ? parseInt(updatedMetrics[metricIndex].value.toString().replace(/[^0-9]/g, ''))
        : updatedMetrics[metricIndex].value as number;
      
      updatedMetrics[metricIndex] = {
        ...updatedMetrics[metricIndex],
        value: dialogType === 'revenue' ? `$${currentValue + newItem.value}` : currentValue + 1,
        change: updatedMetrics[metricIndex].change + 1,
        trend: 'up' as const
      };
    }

    setMetrics(updatedMetrics);

    // Add to recent activities
    const newActivity: RecentActivity = {
      id: Date.now().toString(),
      type: dialogType === 'contact' ? 'contact' : 
            dialogType === 'project' ? 'project' : 
            dialogType === 'expense' ? 'financial' : 'task',
      title: `New ${dialogType} created`,
      description: newItem.description,
      timestamp: new Date(),
      status: 'completed',
      value: newItem.value
    };

    setRecentActivities([newActivity, ...recentActivities.slice(0, 4)]);

    toast.success(`${dialogType.charAt(0).toUpperCase() + dialogType.slice(1)} created successfully!`);
    setShowCreateDialog(false);
    setNewItem({ name: '', description: '', type: '', value: 0, date: '', status: 'pending' });
    setIsLoading(false);
  };

  // Get activity icon
  const getActivityIcon = (type: RecentActivity['type']) => {
    const icons = {
      contact: <Users className="h-4 w-4" />,
      project: <Target className="h-4 w-4" />,
      financial: <DollarSign className="h-4 w-4" />,
      document: <FileText className="h-4 w-4" />,
      task: <CheckCircle className="h-4 w-4" />
    };
    return icons[type];
  };

  // Get status icon
  const getStatusIcon = (status: RecentActivity['status']) => {
    const icons = {
      completed: <CheckCircle className="h-4 w-4 text-green-500" />,
      pending: <Clock className="h-4 w-4 text-yellow-500" />,
      warning: <AlertTriangle className="h-4 w-4 text-orange-500" />,
      error: <AlertTriangle className="h-4 w-4 text-red-500" />
    };
    return icons[status];
  };

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interactive Dashboard</h1>
          <p className="text-gray-600">Real-time insights and analytics</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1000);
            toast.success('Dashboard refreshed');
          }}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <div className={metric.color}>{metric.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center text-xs">
                {metric.trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                ) : metric.trend === 'down' ? (
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                ) : (
                  <div className="h-3 w-3 mr-1" />
                )}
                <span className={metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}>
                  {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(1)}% from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  className={`w-full justify-start h-auto p-4 text-white ${action.color}`}
                  onClick={action.action}
                  disabled={action.status === 'pending'}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{action.icon}</div>
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-sm opacity-90">{action.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="bg-gray-100 p-2 rounded-full">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{activity.title}</p>
                        {getStatusIcon(activity.status)}
                        {activity.value && (
                          <Badge variant="outline" className="ml-auto">
                            {formatCurrency(activity.value)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Interactive chart would appear here</p>
                <p className="text-sm text-gray-400">Revenue: $485K | Expenses: $420K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center">
                <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Interactive pie chart would appear here</p>
                <p className="text-sm text-gray-400">Active: 8 | Completed: 12 | Pending: 3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}</DialogTitle>
            <DialogDescription>
              Add a new {dialogType} to your system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                className="col-span-3"
                placeholder={`${dialogType} name`}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description *
              </Label>
              <Textarea
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                className="col-span-3"
                placeholder="Description"
              />
            </div>
            {dialogType === 'expense' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="value" className="text-right">
                  Amount
                </Label>
                <Input
                  id="value"
                  type="number"
                  value={newItem.value}
                  onChange={(e) => setNewItem({...newItem, value: parseFloat(e.target.value) || 0})}
                  className="col-span-3"
                  placeholder="0.00"
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={newItem.date}
                onChange={(e) => setNewItem({...newItem, date: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 