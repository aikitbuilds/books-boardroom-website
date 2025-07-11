import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus,
  Edit3,
  Trash2,
  Filter,
  ChevronDown,
  Tag
} from 'lucide-react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskUpdate }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'blocked'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'status' | 'dueDate' | 'created'>('priority');
  const [showFilters, setShowFilters] = useState(false);

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    blocked: 'bg-red-100 text-red-800'
  };

  const statusIcons = {
    pending: <Clock className="w-4 h-4" />,
    in_progress: <AlertCircle className="w-4 h-4" />,
    completed: <CheckCircle2 className="w-4 h-4" />,
    blocked: <AlertCircle className="w-4 h-4" />
  };

  const filteredTasks = tasks.filter(task => 
    filter === 'all' || task.status === filter
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'status':
        return a.status.localeCompare(b.status);
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      case 'created':
        return b.createdAt.getTime() - a.createdAt.getTime();
      default:
        return 0;
    }
  });

  const getTaskProgress = (task: Task) => {
    if (task.estimatedHours && task.actualHours) {
      return Math.min((task.actualHours / task.estimatedHours) * 100, 100);
    }
    return task.status === 'completed' ? 100 : task.status === 'in_progress' ? 50 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          <p className="text-gray-600">
            {filteredTasks.length} of {tasks.length} tasks
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${
              showFilters ? 'rotate-180' : ''
            }`} />
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="priority">Priority</option>
                <option value="status">Status</option>
                <option value="dueDate">Due Date</option>
                <option value="created">Created Date</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="space-y-3">
        {sortedTasks.map((task) => (
          <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    statusColors[task.status]
                  }`}>
                    {statusIcons[task.status]}
                    {task.status.replace('_', ' ')}
                  </div>
                  
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    priorityColors[task.priority]
                  }`}>
                    {task.priority}
                  </div>
                  
                  {task.milestone && (
                    <div className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                      Milestone
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className="text-gray-600 text-sm mb-3">
                    {task.description}
                  </p>
                )}
                
                {/* Task details */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  {task.dueDate && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Due {task.dueDate.toLocaleDateString()}
                    </div>
                  )}
                  
                  {task.estimatedHours && (
                    <div>
                      Est: {task.estimatedHours}h
                      {task.actualHours && ` / Actual: ${task.actualHours}h`}
                    </div>
                  )}
                  
                  <div>
                    Created {task.createdAt.toLocaleDateString()}
                  </div>
                </div>
                
                {/* Tags */}
                {task.tags && task.tags.length > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(getTaskProgress(task))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        task.status === 'completed' ? 'bg-green-500' :
                        task.status === 'in_progress' ? 'bg-blue-500' :
                        task.status === 'blocked' ? 'bg-red-500' :
                        'bg-gray-400'
                      }`}
                      style={{ width: `${getTaskProgress(task)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2 ml-4">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {sortedTasks.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No tasks found' : `No ${filter.replace('_', ' ')} tasks`}
          </h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? 'Create your first task to get started.' 
              : 'Try changing the filter to see other tasks.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;