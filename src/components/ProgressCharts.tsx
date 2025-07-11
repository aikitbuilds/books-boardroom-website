import React from 'react';
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
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  BarChart3,
  Target,
  Calendar
} from 'lucide-react';
import { Task, Milestone } from '../types';

interface ProgressChartsProps {
  tasks: Task[];
  milestones: Milestone[];
}

const ProgressCharts: React.FC<ProgressChartsProps> = ({ tasks, milestones }) => {
  // Task status distribution
  const taskStatusData = [
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: '#10B981' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: '#3B82F6' },
    { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length, color: '#6B7280' },
    { name: 'Blocked', value: tasks.filter(t => t.status === 'blocked').length, color: '#EF4444' }
  ];

  // Priority distribution
  const priorityData = [
    { name: 'Critical', value: tasks.filter(t => t.priority === 'critical').length, color: '#DC2626' },
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#F59E0B' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#3B82F6' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#6B7280' }
  ];

  // Milestone progress data
  const milestoneProgressData = milestones.map(milestone => ({
    name: milestone.title.length > 20 ? milestone.title.substring(0, 20) + '...' : milestone.title,
    fullName: milestone.title,
    progress: milestone.completionPercentage,
    targetDate: milestone.targetDate.toLocaleDateString(),
    status: milestone.status
  }));

  // Weekly progress simulation (since we don't have historical data)
  const weeklyProgressData = [
    { week: 'Week 1', completed: 2, inProgress: 3, pending: 5 },
    { week: 'Week 2', completed: 4, inProgress: 4, pending: 3 },
    { week: 'Week 3', completed: 6, inProgress: 3, pending: 2 },
    { week: 'Current', completed: tasks.filter(t => t.status === 'completed').length, inProgress: tasks.filter(t => t.status === 'in_progress').length, pending: tasks.filter(t => t.status === 'pending').length }
  ];

  // Burndown chart data (simulated)
  const burndownData = [
    { day: 'Day 1', ideal: 100, actual: 100 },
    { day: 'Day 5', ideal: 80, actual: 85 },
    { day: 'Day 10', ideal: 60, actual: 70 },
    { day: 'Day 15', ideal: 40, actual: 45 },
    { day: 'Day 20', ideal: 20, actual: 25 },
    { day: 'Today', ideal: 10, actual: 100 - (tasks.filter(t => t.status === 'completed').length / tasks.length * 100) }
  ];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const milestoneCompletionRate = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  const averageTaskTime = tasks
    .filter(t => t.estimatedHours && t.actualHours)
    .reduce((acc, t) => acc + (t.actualHours! - t.estimatedHours!), 0) / tasks.filter(t => t.estimatedHours && t.actualHours).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Progress Analytics</h2>
        <p className="text-gray-600">
          Comprehensive view of project progress and team performance
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Task Completion</p>
              <p className="text-2xl font-semibold text-gray-900">{Math.round(completionRate)}%</p>
              <p className="text-xs text-gray-500">{completedTasks} of {totalTasks} tasks</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Milestones</p>
              <p className="text-2xl font-semibold text-gray-900">{Math.round(milestoneCompletionRate)}%</p>
              <p className="text-xs text-gray-500">{completedMilestones} of {totalMilestones} completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Variance</p>
              <p className="text-2xl font-semibold text-gray-900">
                {averageTaskTime > 0 ? '+' : ''}{Math.round(averageTaskTime * 10) / 10}h
              </p>
              <p className="text-xs text-gray-500">vs. estimated time</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Velocity</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(completedTasks / 4)}  {/* Assuming 4 weeks */}
              </p>
              <p className="text-xs text-gray-500">tasks per week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
              >
                {taskStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={(entry) => entry.color}>
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Milestone Progress */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Milestone Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={milestoneProgressData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Progress']}
                labelFormatter={(label, payload) => {
                  const data = payload?.[0]?.payload;
                  return data ? `${data.fullName} (Due: ${data.targetDate})` : label;
                }}
              />
              <Bar dataKey="progress" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Progress Trend */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="completed" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
              <Area type="monotone" dataKey="inProgress" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.8} />
              <Area type="monotone" dataKey="pending" stackId="1" stroke="#6B7280" fill="#6B7280" fillOpacity={0.8} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Burndown Chart */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Burndown</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={burndownData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis label={{ value: 'Remaining Work (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => [`${value}%`, 'Remaining Work']} />
            <Line 
              type="monotone" 
              dataKey="ideal" 
              stroke="#6B7280" 
              strokeDasharray="5 5" 
              name="Ideal Progress"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#3B82F6" 
              strokeWidth={3}
              name="Actual Progress"
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-gray-600">
          <p>The burndown chart shows ideal vs. actual progress. The gap indicates whether the project is ahead or behind schedule.</p>
        </div>
      </div>

      {/* Summary insights */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Progress Summary</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• {completedTasks} tasks completed out of {totalTasks} total</li>
              <li>• {completedMilestones} milestones completed out of {totalMilestones} total</li>
              <li>• {tasks.filter(t => t.status === 'blocked').length} tasks currently blocked</li>
              <li>• {milestones.filter(m => m.status === 'delayed').length} milestones behind schedule</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {tasks.filter(t => t.status === 'blocked').length > 0 && (
                <li>• Focus on unblocking {tasks.filter(t => t.status === 'blocked').length} blocked tasks</li>
              )}
              {tasks.filter(t => t.priority === 'critical').length > 0 && (
                <li>• Prioritize {tasks.filter(t => t.priority === 'critical').length} critical tasks</li>
              )}
              {averageTaskTime > 1 && (
                <li>• Review task estimation accuracy (tasks taking {Math.round(averageTaskTime * 10) / 10}h longer than estimated)</li>
              )}
              <li>• {Math.round((tasks.filter(t => t.status === 'in_progress').length / totalTasks) * 100)}% of tasks are in progress - good velocity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCharts;