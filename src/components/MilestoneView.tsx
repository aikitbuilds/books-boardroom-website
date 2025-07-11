import React, { useState } from 'react';
import { 
  Target, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Plus,
  ChevronRight,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { Milestone, Task } from '../types';

interface MilestoneViewProps {
  milestones: Milestone[];
  tasks: Task[];
}

const MilestoneView: React.FC<MilestoneViewProps> = ({ milestones, tasks }) => {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);

  const statusColors = {
    not_started: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    delayed: 'bg-red-100 text-red-800'
  };

  const statusIcons = {
    not_started: <Clock className="w-4 h-4" />,
    in_progress: <BarChart3 className="w-4 h-4" />,
    completed: <CheckCircle2 className="w-4 h-4" />,
    delayed: <AlertTriangle className="w-4 h-4" />
  };

  const getMilestoneTasks = (milestoneId: string) => {
    return tasks.filter(task => task.milestone === milestoneId);
  };

  const getMilestoneStats = (milestoneId: string) => {
    const milestoneTasks = getMilestoneTasks(milestoneId);
    const completed = milestoneTasks.filter(t => t.status === 'completed').length;
    const inProgress = milestoneTasks.filter(t => t.status === 'in_progress').length;
    const pending = milestoneTasks.filter(t => t.status === 'pending').length;
    const blocked = milestoneTasks.filter(t => t.status === 'blocked').length;
    
    return {
      total: milestoneTasks.length,
      completed,
      inProgress,
      pending,
      blocked
    };
  };

  const getDaysUntilDue = (targetDate: Date) => {
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const sortedMilestones = [...milestones].sort((a, b) => 
    a.targetDate.getTime() - b.targetDate.getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Milestones</h2>
          <p className="text-gray-600">
            {milestones.filter(m => m.status === 'completed').length} of {milestones.length} completed
          </p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Add Milestone
        </button>
      </div>

      {/* Milestone timeline */}
      <div className="space-y-4">
        {sortedMilestones.map((milestone, index) => {
          const stats = getMilestoneStats(milestone.id);
          const daysUntilDue = getDaysUntilDue(milestone.targetDate);
          const isExpanded = expandedMilestone === milestone.id;
          const milestoneTasks = getMilestoneTasks(milestone.id);

          return (
            <div key={milestone.id} className="bg-white border border-gray-200 rounded-lg">
              {/* Milestone header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedMilestone(isExpanded ? null : milestone.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Timeline connector */}
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        milestone.status === 'completed' ? 'bg-green-500' :
                        milestone.status === 'in_progress' ? 'bg-blue-500' :
                        milestone.status === 'delayed' ? 'bg-red-500' :
                        'bg-gray-300'
                      }`}>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      {index < sortedMilestones.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {milestone.title}
                        </h3>
                        
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[milestone.status]
                        }`}>
                          {statusIcons[milestone.status]}
                          {milestone.status.replace('_', ' ')}
                        </div>
                      </div>
                      
                      {milestone.description && (
                        <p className="text-gray-600 mb-3">
                          {milestone.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {milestone.targetDate.toLocaleDateString()}
                          {daysUntilDue > 0 && (
                            <span className="ml-1 text-orange-600">
                              ({daysUntilDue} days left)
                            </span>
                          )}
                          {daysUntilDue < 0 && milestone.status !== 'completed' && (
                            <span className="ml-1 text-red-600">
                              ({Math.abs(daysUntilDue)} days overdue)
                            </span>
                          )}
                        </div>
                        
                        <div>
                          {stats.total} tasks
                        </div>
                        
                        <div>
                          {stats.completed}/{stats.total} completed
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Progress circle */}
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="stroke-gray-200"
                          strokeWidth="3"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={`stroke-current ${
                            milestone.status === 'completed' ? 'text-green-500' :
                            milestone.status === 'in_progress' ? 'text-blue-500' :
                            milestone.status === 'delayed' ? 'text-red-500' :
                            'text-gray-400'
                          }`}
                          strokeWidth="3"
                          strokeDasharray={`${milestone.completionPercentage}, 100`}
                          strokeLinecap="round"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-900">
                          {milestone.completionPercentage}%
                        </span>
                      </div>
                    </div>
                    
                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`} />
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        milestone.status === 'completed' ? 'bg-green-500' :
                        milestone.status === 'in_progress' ? 'bg-blue-500' :
                        milestone.status === 'delayed' ? 'bg-red-500' :
                        'bg-gray-400'
                      }`}
                      style={{ width: `${milestone.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-gray-200 p-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Milestone Tasks ({milestoneTasks.length})
                  </h4>
                  
                  {milestoneTasks.length > 0 ? (
                    <div className="space-y-3">
                      {milestoneTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              task.status === 'completed' ? 'bg-green-500' :
                              task.status === 'in_progress' ? 'bg-blue-500' :
                              task.status === 'blocked' ? 'bg-red-500' :
                              'bg-gray-400'
                            }`}></div>
                            
                            <div>
                              <p className="font-medium text-gray-900">{task.title}</p>
                              <p className="text-sm text-gray-600">
                                {task.status.replace('_', ' ')} • {task.priority} priority
                                {task.dueDate && ` • Due ${task.dueDate.toLocaleDateString()}`}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {task.estimatedHours && (
                              <span className="text-sm text-gray-500">
                                {task.estimatedHours}h
                              </span>
                            )}
                            
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              task.status === 'completed' ? 'bg-green-100 text-green-800' :
                              task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              task.status === 'blocked' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {task.status.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No tasks assigned to this milestone yet.
                    </p>
                  )}
                  
                  {/* Task statistics */}
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                      <div className="text-sm text-gray-600">In Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
                      <div className="text-sm text-gray-600">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
                      <div className="text-sm text-gray-600">Blocked</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {milestones.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No milestones found
          </h3>
          <p className="text-gray-600">
            Create your first milestone to track project progress.
          </p>
        </div>
      )}
    </div>
  );
};

export default MilestoneView;