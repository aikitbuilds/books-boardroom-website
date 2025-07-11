import { Task, Milestone } from '../types';

export class TaskMasterService {
  private tasks: Task[] = [];
  private milestones: Milestone[] = [];
  private listeners: ((tasks: Task[]) => void)[] = [];

  // Initialize with sample data for development
  constructor() {
    this.initializeSampleData();
  }

  // Task Management
  async getTasks(): Promise<Task[]> {
    return this.tasks;
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const newTask: Task = {
      ...task,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.tasks.push(newTask);
    this.notifyListeners();
    return newTask;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return null;

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updates,
      updatedAt: new Date(),
    };

    this.notifyListeners();
    return this.tasks[taskIndex];
  }

  async deleteTask(id: string): Promise<boolean> {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.notifyListeners();
    return this.tasks.length < initialLength;
  }

  // Milestone Management
  async getMilestones(): Promise<Milestone[]> {
    return this.milestones;
  }

  async createMilestone(milestone: Omit<Milestone, 'id' | 'createdAt' | 'completionPercentage'>): Promise<Milestone> {
    const newMilestone: Milestone = {
      ...milestone,
      id: this.generateId(),
      createdAt: new Date(),
      completionPercentage: 0,
    };
    
    this.milestones.push(newMilestone);
    this.updateMilestoneProgress(newMilestone.id);
    return newMilestone;
  }

  async updateMilestone(id: string, updates: Partial<Milestone>): Promise<Milestone | null> {
    const milestoneIndex = this.milestones.findIndex(m => m.id === id);
    if (milestoneIndex === -1) return null;

    this.milestones[milestoneIndex] = {
      ...this.milestones[milestoneIndex],
      ...updates,
    };

    return this.milestones[milestoneIndex];
  }

  // Progress Calculation
  private updateMilestoneProgress(milestoneId: string) {
    const milestone = this.milestones.find(m => m.id === milestoneId);
    if (!milestone) return;

    const milestoneTasks = this.tasks.filter(t => t.milestone === milestoneId);
    const completedTasks = milestoneTasks.filter(t => t.status === 'completed');
    
    milestone.completionPercentage = milestoneTasks.length > 0 
      ? Math.round((completedTasks.length / milestoneTasks.length) * 100)
      : 0;

    // Update milestone status based on progress
    if (milestone.completionPercentage === 100) {
      milestone.status = 'completed';
    } else if (milestone.completionPercentage > 0) {
      milestone.status = 'in_progress';
    } else {
      milestone.status = 'not_started';
    }

    // Check if milestone is delayed
    if (new Date() > milestone.targetDate && milestone.status !== 'completed') {
      milestone.status = 'delayed';
    }
  }

  // Statistics
  getTaskStats(): {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    blocked: number;
    completionRate: number;
  } {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.status === 'completed').length;
    const inProgress = this.tasks.filter(t => t.status === 'in_progress').length;
    const pending = this.tasks.filter(t => t.status === 'pending').length;
    const blocked = this.tasks.filter(t => t.status === 'blocked').length;
    
    return {
      total,
      completed,
      inProgress,
      pending,
      blocked,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }

  // Real-time updates
  subscribe(callback: (tasks: Task[]) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.tasks]));
    // Update milestone progress for all milestones
    this.milestones.forEach(milestone => {
      this.updateMilestoneProgress(milestone.id);
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private initializeSampleData() {
    // Create sample milestones
    const milestone1: Milestone = {
      id: 'milestone-1',
      title: 'Project Setup & Architecture',
      description: 'Initial project setup, architecture design, and development environment configuration',
      targetDate: new Date('2025-06-15'),
      status: 'in_progress',
      tasks: [],
      completionPercentage: 0,
      createdAt: new Date('2025-06-01'),
    };

    const milestone2: Milestone = {
      id: 'milestone-2',
      title: 'Core Features Development',
      description: 'Implementation of core project tracking features and task management',
      targetDate: new Date('2025-07-01'),
      status: 'not_started',
      tasks: [],
      completionPercentage: 0,
      createdAt: new Date('2025-06-01'),
    };

    const milestone3: Milestone = {
      id: 'milestone-3',
      title: 'Testing & Deployment',
      description: 'Comprehensive testing, optimization, and production deployment',
      targetDate: new Date('2025-07-15'),
      status: 'not_started',
      tasks: [],
      completionPercentage: 0,
      createdAt: new Date('2025-06-01'),
    };

    this.milestones = [milestone1, milestone2, milestone3];

    // Create sample tasks
    const sampleTasks: Task[] = [
      {
        id: 'task-1',
        title: 'Set up React TypeScript project with Vite',
        description: 'Initialize new React project with TypeScript, Vite, and Tailwind CSS',
        status: 'completed',
        priority: 'high',
        createdAt: new Date('2025-06-02'),
        updatedAt: new Date('2025-06-02'),
        milestone: 'milestone-1',
        estimatedHours: 2,
        actualHours: 1.5,
        tags: ['setup', 'react', 'typescript'],
      },
      {
        id: 'task-2',
        title: 'Install project dependencies',
        description: 'Install necessary packages for routing, UI components, and markdown parsing',
        status: 'completed',
        priority: 'high',
        createdAt: new Date('2025-06-02'),
        updatedAt: new Date('2025-06-02'),
        milestone: 'milestone-1',
        estimatedHours: 1,
        actualHours: 1,
        tags: ['setup', 'dependencies'],
      },
      {
        id: 'task-3',
        title: 'Create project tracker component structure',
        description: 'Design and implement the main project tracker component with markdown parsing',
        status: 'in_progress',
        priority: 'high',
        createdAt: new Date('2025-06-02'),
        updatedAt: new Date('2025-06-02'),
        milestone: 'milestone-1',
        estimatedHours: 4,
        tags: ['development', 'components'],
      },
      {
        id: 'task-4',
        title: 'Integrate Task Master MCP for task management',
        description: 'Connect with Task Master MCP service for real-time task updates',
        status: 'pending',
        priority: 'high',
        createdAt: new Date('2025-06-02'),
        updatedAt: new Date('2025-06-02'),
        milestone: 'milestone-1',
        estimatedHours: 3,
        tags: ['integration', 'mcp'],
      },
      {
        id: 'task-5',
        title: 'Add milestone tracking and progress visualization',
        description: 'Implement milestone management with progress charts and timeline views',
        status: 'pending',
        priority: 'medium',
        createdAt: new Date('2025-06-02'),
        updatedAt: new Date('2025-06-02'),
        milestone: 'milestone-2',
        estimatedHours: 5,
        tags: ['development', 'visualization'],
      },
      {
        id: 'task-6',
        title: 'Create markdown file readers for project documentation',
        description: 'Parse and display project documentation from markdown files',
        status: 'pending',
        priority: 'medium',
        createdAt: new Date('2025-06-02'),
        updatedAt: new Date('2025-06-02'),
        milestone: 'milestone-2',
        estimatedHours: 3,
        tags: ['development', 'markdown'],
      },
      {
        id: 'task-7',
        title: 'Implement real-time task updates and status tracking',
        description: 'Add live updates and notifications for task status changes',
        status: 'pending',
        priority: 'medium',
        createdAt: new Date('2025-06-02'),
        updatedAt: new Date('2025-06-02'),
        milestone: 'milestone-2',
        estimatedHours: 4,
        tags: ['development', 'real-time'],
      },
      {
        id: 'task-8',
        title: 'Write comprehensive tests',
        description: 'Create unit and integration tests for all components',
        status: 'pending',
        priority: 'medium',
        createdAt: new Date('2025-06-02'),
        updatedAt: new Date('2025-06-02'),
        milestone: 'milestone-3',
        estimatedHours: 6,
        tags: ['testing', 'quality'],
      },
      {
        id: 'task-9',
        title: 'Deploy to production',
        description: 'Set up CI/CD pipeline and deploy to production environment',
        status: 'pending',
        priority: 'high',
        createdAt: new Date('2025-06-02'),
        updatedAt: new Date('2025-06-02'),
        milestone: 'milestone-3',
        estimatedHours: 3,
        tags: ['deployment', 'devops'],
      },
    ];

    this.tasks = sampleTasks;

    // Update milestone task references and progress
    this.milestones.forEach(milestone => {
      milestone.tasks = this.tasks
        .filter(task => task.milestone === milestone.id)
        .map(task => task.id);
      this.updateMilestoneProgress(milestone.id);
    });
  }
}