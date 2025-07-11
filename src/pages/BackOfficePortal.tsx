import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CRMDashboard } from '@/pages/CRMDashboard';
import { FinancialDashboard } from '@/pages/FinancialDashboard';
import { ProjectBoard } from '@/components/projects/ProjectBoard';
import { FileUpload } from '@/components/file-management/FileUpload';
import { InteractiveDashboard } from '@/components/InteractiveDashboard';
import { EnhancedCharts } from '@/components/EnhancedCharts';
import { PaymentDashboard } from '@/components/payments/PaymentDashboard';
import { 
  LayoutDashboard,
  Users,
  Calculator,
  FolderOpen,
  BarChart3,
  Calendar,
  Settings,
  Bell,
  Search,
  Plus,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  DollarSign,
  FileText,
  Target,
  Menu,
  ChevronLeft,
  CreditCard
} from 'lucide-react';
import { ProfileMenu } from '@/components/ProfileMenu';
import { toast } from 'sonner';

interface DashboardStats {
  totalRevenue: number;
  activeProjects: number;
  totalContacts: number;
  pendingTasks: number;
  monthlyGrowth: number;
  conversionRate: number;
}

interface RecentActivity {
  id: string;
  type: 'contact' | 'project' | 'financial' | 'document';
  title: string;
  description: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'warning';
}

interface QuickMetric {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  budget: {
    estimated: number;
    actual: number;
    remaining: number;
  };
  timeline: {
    startDate: Date;
    endDate: Date;
    daysRemaining: number;
  };
  team: {
    manager: string;
    members: string[];
  };
  client?: {
    name: string;
    company: string;
  };
  tasks: {
    total: number;
    completed: number;
    overdue: number;
  };
  tags: string[];
}

export const BackOfficePortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'crm' | 'projects' | 'financial' | 'files' | 'analytics' | 'payments'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'planning' as 'planning' | 'active' | 'completed' | 'on_hold',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    startDate: '',
    endDate: '',
    budget: 0
  });

  // Helper function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Mock data
  const stats: DashboardStats = {
    totalRevenue: 125000,
    activeProjects: 8,
    totalContacts: 156,
    pendingTasks: 12,
    monthlyGrowth: 15.2,
    conversionRate: 23.5
  };

  const recentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'project',
      title: 'Solar Installation - Smith Residence',
      description: 'Project completed successfully',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed'
    },
    {
      id: '2',
      type: 'contact',
      title: 'New Lead - Johnson Family',
      description: 'Contact information added',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: 'pending'
    },
    {
      id: '3',
      type: 'financial',
      title: 'Invoice #2024-001',
      description: 'Payment received',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'completed'
    }
  ];

  const quickMetrics: QuickMetric[] = [
    {
      label: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      change: stats.monthlyGrowth,
      icon: <DollarSign className="h-4 w-4" />,
      color: 'text-green-600'
    },
    {
      label: 'Active Projects',
      value: stats.activeProjects.toString(),
      change: 12.5,
      icon: <BarChart3 className="h-4 w-4" />,
      color: 'text-blue-600'
    },
    {
      label: 'Total Contacts',
      value: stats.totalContacts.toString(),
      change: 8.3,
      icon: <Users className="h-4 w-4" />,
      color: 'text-purple-600'
    },
    {
      label: 'Pending Tasks',
      value: stats.pendingTasks.toString(),
      change: -5.2,
      icon: <Clock className="h-4 w-4" />,
      color: 'text-orange-600'
    }
  ];

  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'Solar Installation - Smith Residence',
      description: 'Complete solar panel installation for residential property',
      status: 'active',
      priority: 'high',
      progress: 75,
      budget: {
        estimated: 25000,
        actual: 18000,
        remaining: 7000
      },
      timeline: {
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-02-15'),
        daysRemaining: 15
      },
      team: {
        manager: 'John Smith',
        members: ['Sarah Johnson', 'Mike Chen']
      },
      client: {
        name: 'Robert Smith',
        company: 'Smith Residence'
      },
      tasks: {
        total: 25,
        completed: 19,
        overdue: 1
      },
      tags: ['solar', 'residential', 'installation']
    },
    {
      id: '2',
      name: 'Commercial Solar - Downtown Office',
      description: 'Large-scale commercial solar installation',
      status: 'planning',
      priority: 'medium',
      progress: 25,
      budget: {
        estimated: 150000,
        actual: 25000,
        remaining: 125000
      },
      timeline: {
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-04-01'),
        daysRemaining: 45
      },
      team: {
        manager: 'Emma Davis',
        members: ['Alex Wilson', 'Lisa Brown', 'Tom Johnson']
      },
      client: {
        name: 'Downtown Office LLC',
        company: 'Downtown Office Complex'
      },
      tasks: {
        total: 40,
        completed: 10,
        overdue: 0
      },
      tags: ['solar', 'commercial', 'large-scale']
    }
  ];

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'contact': return <Users className="h-4 w-4" />;
      case 'project': return <BarChart3 className="h-4 w-4" />;
      case 'financial': return <DollarSign className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: RecentActivity['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Here you would typically save to Firebase
    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      status: newProject.status,
      priority: newProject.priority,
      progress: 0,
      budget: {
        estimated: newProject.budget,
        actual: 0,
        remaining: newProject.budget
      },
      timeline: {
        startDate: newProject.startDate ? new Date(newProject.startDate) : new Date(),
        endDate: newProject.endDate ? new Date(newProject.endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        daysRemaining: 30
      },
      team: {
        manager: 'Current User',
        members: []
      },
      client: {
        name: 'TBD',
        company: 'TBD'
      },
      tasks: {
        total: 0,
        completed: 0,
        overdue: 0
      },
      tags: ['new-project']
    };

    // Add to mock projects (in real app, save to Firebase)
    mockProjects.push(project);
    
    toast.success('Project created successfully!');
    setShowCreateProjectDialog(false);
    
    // Reset form
    setNewProject({
      name: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      startDate: '',
      endDate: '',
      budget: 0
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">BooksBoardroom</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <ProfileMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
              { id: 'crm', label: 'CRM', icon: <Users className="h-4 w-4" /> },
              { id: 'projects', label: 'Projects', icon: <BarChart3 className="h-4 w-4" /> },
              { id: 'financial', label: 'Financial', icon: <Calculator className="h-4 w-4" /> },
              { id: 'files', label: 'Files', icon: <FolderOpen className="h-4 w-4" /> },
              { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
              { id: 'payments', label: 'Payments', icon: <CreditCard className="h-4 w-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                  <div className={metric.color}>{metric.icon}</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className={`text-xs ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(1)}% from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="bg-gray-100 p-2 rounded-full">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{activity.title}</p>
                            {getStatusIcon(activity.status)}
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

            {/* Quick Actions & Summary */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => {
                      toast.info('Contact form will open here');
                      // In real implementation, open contact form modal
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Contact
                  </Button>
                  <Dialog open={showCreateProjectDialog} onOpenChange={setShowCreateProjectDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full justify-start" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Create New Project</DialogTitle>
                        <DialogDescription>
                          Add a new project to track progress and manage resources.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name *
                          </Label>
                          <Input
                            id="name"
                            value={newProject.name}
                            onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                            className="col-span-3"
                            placeholder="Project name"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description *
                          </Label>
                          <Textarea
                            id="description"
                            value={newProject.description}
                            onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                            className="col-span-3"
                            placeholder="Project description"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="status" className="text-right">
                            Status
                          </Label>
                          <Select value={newProject.status} onValueChange={(value) => setNewProject({...newProject, status: value as any})}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="planning">Planning</SelectItem>
                              <SelectItem value="active">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="on_hold">On Hold</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="priority" className="text-right">
                            Priority
                          </Label>
                          <Select value={newProject.priority} onValueChange={(value) => setNewProject({...newProject, priority: value as any})}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="startDate" className="text-right">
                            Start Date
                          </Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={newProject.startDate}
                            onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="endDate" className="text-right">
                            End Date
                          </Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={newProject.endDate}
                            onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="budget" className="text-right">
                            Budget
                          </Label>
                          <Input
                            id="budget"
                            type="number"
                            value={newProject.budget}
                            onChange={(e) => setNewProject({...newProject, budget: parseFloat(e.target.value) || 0})}
                            className="col-span-3"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateProjectDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateProject}>
                          Create Project
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => {
                      toast.info('Report generation will start here');
                      // In real implementation, generate and download report
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => {
                      toast.info('Expense recording form will open here');
                      // In real implementation, open expense form modal
                    }}
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Record Expense
                  </Button>
                </CardContent>
              </Card>

              {/* Summary Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>This Month</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Revenue</span>
                    <span className="font-semibold">{formatCurrency(stats.totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Projects</span>
                    <Badge variant="outline">{stats.activeProjects}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">New Contacts</span>
                    <Badge variant="outline">{stats.totalContacts}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending Tasks</span>
                    <Badge variant={stats.pendingTasks > 5 ? "destructive" : "outline"}>
                      {stats.pendingTasks}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          </div>
        )}

        {/* CRM Tab */}
        {activeTab === 'crm' && (
          <CRMDashboard />
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
                <p className="text-gray-600">Track and manage all your projects</p>
              </div>
              <Dialog open={showCreateProjectDialog} onOpenChange={setShowCreateProjectDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Add a new project to track progress and manage resources.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                        className="col-span-3"
                        placeholder="Project name"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        className="col-span-3"
                        placeholder="Project description"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Status
                      </Label>
                      <Select value={newProject.status} onValueChange={(value) => setNewProject({...newProject, status: value as any})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="active">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="on_hold">On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="priority" className="text-right">
                        Priority
                      </Label>
                      <Select value={newProject.priority} onValueChange={(value) => setNewProject({...newProject, priority: value as any})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="startDate" className="text-right">
                        Start Date
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newProject.startDate}
                        onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="endDate" className="text-right">
                        End Date
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newProject.endDate}
                        onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="budget" className="text-right">
                        Budget
                      </Label>
                      <Input
                        id="budget"
                        type="number"
                        value={newProject.budget}
                        onChange={(e) => setNewProject({...newProject, budget: parseFloat(e.target.value) || 0})}
                        className="col-span-3"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCreateProjectDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateProject}>
                      Create Project
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <ProjectBoard
              projects={mockProjects}
              onProjectUpdate={(projectId, updates) => {
                console.log('Update project:', projectId, updates);
              }}
              onProjectDelete={(projectId) => {
                console.log('Delete project:', projectId);
              }}
              onProjectView={(projectId) => {
                console.log('View project:', projectId);
              }}
            />
          </div>
        )}

        {/* Financial Tab */}
        {activeTab === 'financial' && (
          <FinancialDashboard />
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">File Management</h2>
                <p className="text-gray-600">Upload and organize business documents</p>
              </div>
            </div>
            
            <FileUpload
              organizationId="demo-org"
              userId="demo-user"
              path="general"
              onUploadComplete={(files) => {
                console.log('Files uploaded:', files);
                toast.success(`${files.length} files uploaded successfully`);
              }}
              maxFileSize={50}
              maxFiles={10}
            />
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
                <p className="text-gray-600">Interactive charts and data insights</p>
              </div>
            </div>
            
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="dashboard">Interactive Dashboard</TabsTrigger>
                <TabsTrigger value="charts">Enhanced Charts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="mt-6">
                <InteractiveDashboard />
              </TabsContent>
              
              <TabsContent value="charts" className="mt-6">
                <EnhancedCharts />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
                <p className="text-gray-600">Process payments and manage subscriptions</p>
              </div>
            </div>
            
            <PaymentDashboard 
              customerId="cus_demo_123"
              className="space-y-6"
            />
          </div>
        )}
      </div>
    </div>
  );
};