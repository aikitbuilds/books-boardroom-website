import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { OpportunityCard } from '@/components/crm/OpportunityCard';
import { ContactForm } from '@/components/crm/ContactForm';
import { 
  Users, 
  Target, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Phone,
  Mail,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { ProfileMenu } from '@/components/ProfileMenu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DashboardMetrics {
  totalContacts: number;
  totalOpportunities: number;
  totalValue: number;
  avgDealSize: number;
  conversionRate: number;
  activitiesThisWeek: number;
  leadsThisMonth: number;
  closedDealsThisMonth: number;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  score: number;
  lastContact: Date;
  assignedTo: string;
}

interface Opportunity {
  id: string;
  name: string;
  value: {
    estimated: number;
    weighted: number;
    currency: string;
  };
  stage: string;
  probability: number;
  expectedClose: Date;
  contact: {
    name: string;
    email: string;
    company: string;
    avatar?: string;
  };
  assignedTo: {
    name: string;
    avatar?: string;
  };
  daysInStage: number;
  lastActivity?: Date;
  nextActivity?: {
    type: string;
    date: Date;
    description: string;
  };
}

export const CRMDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [showContactForm, setShowContactForm] = useState(false);

  // Mock data - would be fetched from Firebase
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalContacts: 1247,
    totalOpportunities: 89,
    totalValue: 2450000,
    avgDealSize: 27500,
    conversionRate: 23.5,
    activitiesThisWeek: 156,
    leadsThisMonth: 87,
    closedDealsThisMonth: 12
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: '1',
      name: 'Enterprise Software Implementation',
      value: { estimated: 150000, weighted: 120000, currency: 'USD' },
      stage: 'proposal',
      probability: 80,
      expectedClose: new Date('2024-02-15'),
      contact: {
        name: 'Sarah Johnson',
        email: 'sarah@techcorp.com',
        company: 'TechCorp Industries'
      },
      assignedTo: { name: 'John Smith' },
      daysInStage: 12,
      lastActivity: new Date('2024-01-10'),
      nextActivity: {
        type: 'Demo',
        date: new Date('2024-01-15'),
        description: 'Product demonstration for stakeholders'
      }
    },
    {
      id: '2',
      name: 'Digital Marketing Campaign',
      value: { estimated: 45000, weighted: 22500, currency: 'USD' },
      stage: 'negotiation',
      probability: 50,
      expectedClose: new Date('2024-01-30'),
      contact: {
        name: 'Mike Chen',
        email: 'mike@startup.io',
        company: 'Startup.io'
      },
      assignedTo: { name: 'Emma Davis' },
      daysInStage: 8,
      lastActivity: new Date('2024-01-08')
    }
  ]);

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@techcorp.com',
      phone: '+1 (555) 123-4567',
      company: 'TechCorp Industries',
      status: 'qualified',
      score: 85,
      lastContact: new Date('2024-01-10'),
      assignedTo: 'John Smith'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@startup.io',
      phone: '+1 (555) 987-6543',
      company: 'Startup.io',
      status: 'new',
      score: 72,
      lastContact: new Date('2024-01-08'),
      assignedTo: 'Emma Davis'
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
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'qualified': 'bg-green-100 text-green-800',
      'proposal': 'bg-purple-100 text-purple-800',
      'lost': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'all' || opp.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
          <p className="text-gray-600">Manage your customer relationships and sales pipeline</p>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowContactForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
          <ProfileMenu />
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalContacts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics.leadsThisMonth} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Opportunities</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOpportunities}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(metrics.totalValue)} total value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.avgDealSize)}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.closedDealsThisMonth} deals closed this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activitiesThisWeek} activities this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Pipeline */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['prospecting', 'qualification', 'proposal', 'negotiation'].map((stage) => {
                    const stageOpps = opportunities.filter(opp => opp.stage === stage);
                    const stageValue = stageOpps.reduce((sum, opp) => sum + opp.value.estimated, 0);
                    const percentage = (stageValue / metrics.totalValue) * 100;
                    
                    return (
                      <div key={stage} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium capitalize">
                            {stage.replace('_', ' ')} ({stageOpps.length})
                          </span>
                          <span className="text-sm text-gray-600">
                            {formatCurrency(stageValue)}
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Phone className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Called Sarah Johnson</p>
                      <p className="text-xs text-gray-500">TechCorp Industries • 2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Mail className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Sent proposal to Mike Chen</p>
                      <p className="text-xs text-gray-500">Startup.io • 5 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Calendar className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Meeting scheduled</p>
                      <p className="text-xs text-gray-500">Product demo tomorrow at 2 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStage} onValueChange={setFilterStage}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="prospecting">Prospecting</SelectItem>
                <SelectItem value="qualification">Qualification</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onViewDetails={(id) => console.log('View details:', id)}
                onEdit={(id) => console.log('Edit:', id)}
                onDelete={(id) => console.log('Delete:', id)}
                onScheduleActivity={(id) => console.log('Schedule activity:', id)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4 font-medium">Contact</th>
                      <th className="text-left p-4 font-medium">Company</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Score</th>
                      <th className="text-left p-4 font-medium">Last Contact</th>
                      <th className="text-left p-4 font-medium">Assigned To</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((contact) => (
                      <tr key={contact.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-gray-600">{contact.email}</p>
                          </div>
                        </td>
                        <td className="p-4">{contact.company}</td>
                        <td className="p-4">
                          <Badge className={getStatusColor(contact.status)}>
                            {contact.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Progress value={contact.score} className="w-16 h-2" />
                            <span className="text-sm">{contact.score}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {contact.lastContact.toLocaleDateString()}
                        </td>
                        <td className="p-4 text-sm">{contact.assignedTo}</td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Mail className="h-4 w-4" />
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

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Phone className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Call with John Smith</p>
                      <p className="text-xs text-gray-600">Follow up on proposal - 2 hours ago</p>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Mail className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Email sent to TechCorp</p>
                      <p className="text-xs text-gray-600">Proposal sent - 4 hours ago</p>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <Calendar className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Meeting scheduled</p>
                      <p className="text-xs text-gray-600">Demo with Johnson Family - Tomorrow</p>
                    </div>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">$485K</p>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">23.5%</p>
                      <p className="text-sm text-gray-600">Conversion Rate</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Prospecting</span>
                      <span>$125K</span>
                    </div>
                    <Progress value={25} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>Qualification</span>
                      <span>$180K</span>
                    </div>
                    <Progress value={35} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>Proposal</span>
                      <span>$120K</span>
                    </div>
                    <Progress value={25} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>Negotiation</span>
                      <span>$60K</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pipeline Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">156</p>
                      <p className="text-sm text-gray-600">Total Contacts</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">24</p>
                      <p className="text-sm text-gray-600">Active Opportunities</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">High Value</span>
                      <Badge variant="outline">8</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Medium Value</span>
                      <Badge variant="outline">12</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Low Value</span>
                      <Badge variant="outline">4</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <ContactForm
              onSubmit={async (data) => {
                console.log('Contact data:', data);
                setShowContactForm(false);
              }}
              onCancel={() => setShowContactForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};