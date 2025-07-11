import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  ComposedChart,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Activity,
  Download,
  RefreshCw,
  Eye,
  Settings
} from 'lucide-react';

interface ChartData {
  name?: string;
  metric?: string;
  week?: string;
  value?: number;
  target?: number;
  actual?: number;
  revenue?: number;
  expenses?: number;
  profit?: number;
  contacts?: number;
  projects?: number;
  tasks?: number;
  completed?: number;
  inProgress?: number;
  pending?: number;
  fullMark?: number;
  [key: string]: any;
}

interface ChartConfig {
  type: 'bar' | 'line' | 'area' | 'pie' | 'radar' | 'scatter' | 'composed';
  title: string;
  description: string;
  data: ChartData[];
  colors: string[];
  height?: number;
}

export const EnhancedCharts: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedChart, setSelectedChart] = useState('revenue');
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for different chart types
  const chartConfigs: Record<string, ChartConfig> = {
    revenue: {
      type: 'composed',
      title: 'Revenue vs Expenses',
      description: 'Monthly revenue and expense tracking',
      data: [
        { name: 'Jan', revenue: 32000, expenses: 28000, profit: 4000 },
        { name: 'Feb', revenue: 35000, expenses: 30000, profit: 5000 },
        { name: 'Mar', revenue: 38000, expenses: 32000, profit: 6000 },
        { name: 'Apr', revenue: 42000, expenses: 35000, profit: 7000 },
        { name: 'May', revenue: 45000, expenses: 38000, profit: 7000 },
        { name: 'Jun', revenue: 48500, expenses: 42000, profit: 6500 }
      ],
      colors: ['#10B981', '#EF4444', '#3B82F6'],
      height: 400
    },
    projects: {
      type: 'bar',
      title: 'Project Status Distribution',
      description: 'Current project status breakdown',
      data: [
        { name: 'Active', value: 8, color: '#3B82F6' },
        { name: 'Completed', value: 12, color: '#10B981' },
        { name: 'On Hold', value: 3, color: '#F59E0B' },
        { name: 'Cancelled', value: 1, color: '#EF4444' }
      ],
      colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
      height: 300
    },
    contacts: {
      type: 'line',
      title: 'Contact Growth',
      description: 'Monthly contact acquisition trend',
      data: [
        { name: 'Jan', contacts: 120 },
        { name: 'Feb', contacts: 135 },
        { name: 'Mar', contacts: 142 },
        { name: 'Apr', contacts: 148 },
        { name: 'May', contacts: 152 },
        { name: 'Jun', contacts: 156 }
      ],
      colors: ['#8B5CF6'],
      height: 300
    },
    performance: {
      type: 'radar',
      title: 'Performance Metrics',
      description: 'Multi-dimensional performance analysis',
      data: [
        { metric: 'Revenue', value: 85, fullMark: 100 },
        { metric: 'Efficiency', value: 78, fullMark: 100 },
        { metric: 'Customer Satisfaction', value: 92, fullMark: 100 },
        { metric: 'Project Completion', value: 88, fullMark: 100 },
        { metric: 'Team Productivity', value: 81, fullMark: 100 },
        { metric: 'Innovation', value: 75, fullMark: 100 }
      ],
      colors: ['#3B82F6'],
      height: 400
    },
    tasks: {
      type: 'area',
      title: 'Task Completion Trend',
      description: 'Weekly task completion rates',
      data: [
        { week: 'Week 1', completed: 15, inProgress: 8, pending: 5 },
        { week: 'Week 2', completed: 18, inProgress: 6, pending: 4 },
        { week: 'Week 3', completed: 22, inProgress: 5, pending: 3 },
        { week: 'Week 4', completed: 25, inProgress: 4, pending: 2 },
        { week: 'Current', completed: 28, inProgress: 3, pending: 1 }
      ],
      colors: ['#10B981', '#3B82F6', '#6B7280'],
      height: 300
    }
  };

  const currentConfig = chartConfigs[selectedChart];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleExport = () => {
    // Simulate chart export
    console.log('Exporting chart data...');
  };

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-80">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      );
    }

    switch (currentConfig.type) {
      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={currentConfig.height || 400}>
            <ComposedChart data={currentConfig.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `$${value.toLocaleString()}`, 
                  name === 'revenue' ? 'Revenue' : 
                  name === 'expenses' ? 'Expenses' : 'Profit'
                ]}
              />
              <Legend />
              <Bar dataKey="revenue" fill={currentConfig.colors[0]} />
              <Bar dataKey="expenses" fill={currentConfig.colors[1]} />
              <Line type="monotone" dataKey="profit" stroke={currentConfig.colors[2]} strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={currentConfig.height || 300}>
            <BarChart data={currentConfig.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={currentConfig.colors[0]}>
                {currentConfig.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || currentConfig.colors[index % currentConfig.colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={currentConfig.height || 300}>
            <LineChart data={currentConfig.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="contacts" 
                stroke={currentConfig.colors[0]} 
                strokeWidth={3}
                dot={{ fill: currentConfig.colors[0], strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={currentConfig.height || 300}>
            <AreaChart data={currentConfig.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="completed" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
              <Area type="monotone" dataKey="inProgress" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.8} />
              <Area type="monotone" dataKey="pending" stackId="1" stroke="#6B7280" fill="#6B7280" fillOpacity={0.8} />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={currentConfig.height || 400}>
            <RadarChart data={currentConfig.data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar 
                name="Performance" 
                dataKey="value" 
                stroke={currentConfig.colors[0]} 
                fill={currentConfig.colors[0]} 
                fillOpacity={0.3} 
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={currentConfig.height || 300}>
            <PieChart>
              <Pie
                data={currentConfig.data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
              >
                {currentConfig.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || currentConfig.colors[index % currentConfig.colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center h-80">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart not available</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Interactive Analytics</h2>
          <p className="text-gray-600">Real-time data visualization and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="quarter">Quarter</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.keys(chartConfigs).map((chartKey) => (
          <Button
            key={chartKey}
            variant={selectedChart === chartKey ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedChart(chartKey)}
            className="whitespace-nowrap"
          >
            {chartKey === 'revenue' && <DollarSign className="h-4 w-4 mr-2" />}
            {chartKey === 'projects' && <Target className="h-4 w-4 mr-2" />}
            {chartKey === 'contacts' && <Users className="h-4 w-4 mr-2" />}
            {chartKey === 'performance' && <Activity className="h-4 w-4 mr-2" />}
            {chartKey === 'tasks' && <Calendar className="h-4 w-4 mr-2" />}
            {chartKey.charAt(0).toUpperCase() + chartKey.slice(1)}
          </Button>
        ))}
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{currentConfig.title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{currentConfig.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>

      {/* Chart Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Key Insight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm">Revenue increased by 12.5% this month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Project completion rate slightly declined</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Focus on high-value projects this quarter</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 