export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  dependencies?: string[];
  milestone?: string;
  estimatedHours?: number;
  actualHours?: number;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  targetDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  tasks: string[]; // Task IDs
  completionPercentage: number;
  createdAt: Date;
}

export interface ProjectInfo {
  name: string;
  description: string;
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed';
  startDate: Date;
  targetDate?: Date;
  techStack: string[];
  team: string[];
  repository?: string;
  documentation: DocumentationFile[];
}

export interface DocumentationFile {
  path: string;
  name: string;
  content: string;
  lastModified: Date;
  type: 'readme' | 'changelog' | 'api' | 'guide' | 'other';
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  blocked: number;
  completionRate: number;
  averageCompletionTime: number;
}

export interface ProjectHealth {
  score: number; // 0-100
  factors: {
    taskCompletion: number;
    milestoneProgress: number;
    codeQuality: number;
    documentation: number;
    teamVelocity: number;
  };
}