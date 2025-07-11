import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Calendar,
  Clock,
  DollarSign,
  MoreHorizontal,
  Plus,
  User,
  AlertTriangle,
  CheckCircle,
  Circle,
  Play,
  Pause
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
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

interface ProjectBoardProps {
  projects: Project[];
  onProjectUpdate?: (projectId: string, updates: Partial<Project>) => void;
  onProjectDelete?: (projectId: string) => void;
  onProjectView?: (projectId: string) => void;
  className?: string;
}

const ProjectCard: React.FC<{
  project: Project;
  index: number;
  onUpdate?: (projectId: string, updates: Partial<Project>) => void;
  onDelete?: (projectId: string) => void;
  onView?: (projectId: string) => void;
}> = ({ project, index, onUpdate, onDelete, onView }) => {
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
      'planning': 'bg-blue-100 text-blue-800',
      'active': 'bg-green-100 text-green-800',
      'on_hold': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'low': 'bg-green-100 text-green-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'high': 'bg-orange-100 text-orange-700',
      'urgent': 'bg-red-100 text-red-700'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning':
        return <Circle className="h-4 w-4" />;
      case 'active':
        return <Play className="h-4 w-4" />;
      case 'on_hold':
        return <Pause className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const isOverdue = project.timeline.daysRemaining < 0;
  const isAtRisk = project.timeline.daysRemaining <= 7 && project.progress < 80;

  return (
    <Draggable draggableId={project.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 cursor-pointer hover:shadow-md transition-shadow ${
            snapshot.isDragging ? 'shadow-lg rotate-2' : ''
          }`}
          onClick={() => onView?.(project.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {project.name}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {project.description}
                </p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView?.(project.id); }}>
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); /* Edit logic */ }}>
                    Edit Project
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); onDelete?.(project.id); }}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor(project.status)}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(project.status)}
                  {project.status.replace('_', ' ').toUpperCase()}
                </div>
              </Badge>
              <Badge className={getPriorityColor(project.priority)}>
                {project.priority.toUpperCase()}
              </Badge>
              {isOverdue && (
                <Badge variant="destructive">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  OVERDUE
                </Badge>
              )}
              {isAtRisk && !isOverdue && (
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                  AT RISK
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>

            {/* Budget */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center gap-1 text-gray-600">
                  <DollarSign className="h-3 w-3" />
                  <span>Budget</span>
                </div>
                <p className="font-medium">{formatCurrency(project.budget.estimated)}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-gray-600">
                  <DollarSign className="h-3 w-3" />
                  <span>Remaining</span>
                </div>
                <p className="font-medium">{formatCurrency(project.budget.remaining)}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span>Timeline</span>
                </div>
                <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                  {Math.abs(project.timeline.daysRemaining)} days {isOverdue ? 'overdue' : 'remaining'}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {project.timeline.startDate.toLocaleDateString()} - {project.timeline.endDate.toLocaleDateString()}
              </div>
            </div>

            {/* Tasks Summary */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <CheckCircle className="h-3 w-3" />
                <span>Tasks</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{project.tasks.completed}/{project.tasks.total}</span>
                {project.tasks.overdue > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {project.tasks.overdue} overdue
                  </Badge>
                )}
              </div>
            </div>

            {/* Client Info */}
            {project.client && (
              <div className="text-sm">
                <div className="flex items-center gap-1 text-gray-600 mb-1">
                  <User className="h-3 w-3" />
                  <span>Client</span>
                </div>
                <div>
                  <p className="font-medium">{project.client.name}</p>
                  <p className="text-xs text-gray-500">{project.client.company}</p>
                </div>
              </div>
            )}

            {/* Team */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Team ({project.team.members.length + 1})
              </div>
              <div className="flex -space-x-2">
                {[project.team.manager, ...project.team.members.slice(0, 3)].map((member, idx) => (
                  <Avatar key={idx} className="h-6 w-6 border-2 border-white">
                    <AvatarFallback className="text-xs">
                      {member.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {project.team.members.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium">
                    +{project.team.members.length - 3}
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {project.tags.slice(0, 3).map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export const ProjectBoard: React.FC<ProjectBoardProps> = ({
  projects,
  onProjectUpdate,
  onProjectDelete,
  onProjectView,
  className = ''
}) => {
  const [projectsByStatus, setProjectsByStatus] = useState(() => {
    const grouped: Record<string, Project[]> = {
      planning: [],
      active: [],
      on_hold: [],
      completed: []
    };
    
    projects.forEach(project => {
      if (grouped[project.status]) {
        grouped[project.status].push(project);
      }
    });
    
    return grouped;
  });

  const statuses = [
    { id: 'planning', label: 'Planning', color: 'bg-blue-50 border-blue-200' },
    { id: 'active', label: 'Active', color: 'bg-green-50 border-green-200' },
    { id: 'on_hold', label: 'On Hold', color: 'bg-yellow-50 border-yellow-200' },
    { id: 'completed', label: 'Completed', color: 'bg-gray-50 border-gray-200' }
  ];

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      const items = Array.from(projectsByStatus[source.droppableId]);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      
      setProjectsByStatus(prev => ({
        ...prev,
        [source.droppableId]: items
      }));
    } else {
      // Moving between columns
      const sourceItems = Array.from(projectsByStatus[source.droppableId]);
      const destItems = Array.from(projectsByStatus[destination.droppableId]);
      const [movedItem] = sourceItems.splice(source.index, 1);
      
      // Update the project status
      const updatedItem = { ...movedItem, status: destination.droppableId as Project['status'] };
      destItems.splice(destination.index, 0, updatedItem);
      
      setProjectsByStatus(prev => ({
        ...prev,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems
      }));

      // Notify parent component
      onProjectUpdate?.(draggableId, { status: destination.droppableId as Project['status'] });
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
          {statuses.map((status) => (
            <div key={status.id} className="flex flex-col">
              <div className={`rounded-lg border-2 border-dashed ${status.color} p-4 mb-4`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{status.label}</h3>
                  <Badge variant="secondary">
                    {projectsByStatus[status.id]?.length || 0}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </div>

              <Droppable droppableId={status.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 min-h-[400px] rounded-lg p-2 transition-colors ${
                      snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'
                    }`}
                  >
                    {projectsByStatus[status.id]?.map((project, index) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                        onUpdate={onProjectUpdate}
                        onDelete={onProjectDelete}
                        onView={onProjectView}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};