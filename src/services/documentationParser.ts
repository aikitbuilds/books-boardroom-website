import { DocumentationFile, ProjectInfo } from '../types';

export class DocumentationParser {
  private static instance: DocumentationParser;
  private documentationFiles: DocumentationFile[] = [];

  static getInstance(): DocumentationParser {
    if (!DocumentationParser.instance) {
      DocumentationParser.instance = new DocumentationParser();
    }
    return DocumentationParser.instance;
  }

  // Simulate reading documentation files from project
  async loadProjectDocumentation(): Promise<DocumentationFile[]> {
    // In a real implementation, this would read actual .md files from the project
    // For now, we'll create sample documentation based on common project files
    
    const sampleDocs: DocumentationFile[] = [
      {
        path: './README.md',
        name: 'README.md',
        type: 'readme',
        lastModified: new Date('2025-06-02'),
        content: `# BooksBoardroom Project Tracker

## Overview
A comprehensive project tracking system that integrates with Task Master MCP to provide real-time task management, milestone tracking, and project health monitoring.

## Features
- 📋 **Task Management**: Create, update, and track tasks with priorities and dependencies
- 🎯 **Milestone Tracking**: Set and monitor project milestones with progress visualization
- 📊 **Progress Analytics**: Real-time charts and statistics for project health
- 📝 **Documentation Integration**: Parse and display project documentation from markdown files
- 🔄 **Real-time Updates**: Live task status updates and notifications

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Routing**: React Router v7
- **Task Management**: Task Master MCP integration

## Getting Started
1. Install dependencies: \`npm install\`
2. Start development server: \`npm run dev\`
3. Build for production: \`npm run build\`

## Project Structure
\`\`\`
src/
├── components/     # React components
├── services/       # Business logic and API services
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── hooks/          # Custom React hooks
\`\`\`

## Milestones
- **Phase 1**: Project Setup & Architecture (Target: June 15, 2025)
- **Phase 2**: Core Features Development (Target: July 1, 2025)
- **Phase 3**: Testing & Deployment (Target: July 15, 2025)
`
      },
      {
        path: './CHANGELOG.md',
        name: 'CHANGELOG.md',
        type: 'changelog',
        lastModified: new Date('2025-06-02'),
        content: `# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2025-06-02

### Added
- Initial project setup with React TypeScript and Vite
- Task Master service integration for task management
- Milestone tracking system with progress visualization
- Documentation parser for markdown files
- Real-time task updates and notifications
- Project health monitoring and analytics

### Dependencies
- React 18.2.0
- TypeScript 5.2.2
- Vite 5.2.0
- Tailwind CSS 4.1.8
- React Router 7.6.1
- Recharts 2.15.3
- Lucide React 0.511.0

### Development
- Set up Vite development environment
- Configured Tailwind CSS for styling
- Created TypeScript type definitions
- Implemented sample data for development testing
`
      },
      {
        path: './docs/API.md',
        name: 'API.md',
        type: 'api',
        lastModified: new Date('2025-06-02'),
        content: `# API Documentation

## Task Master Service

### Tasks API

#### \`getTasks(): Promise<Task[]>\`
Retrieves all tasks from the system.

#### \`createTask(task: CreateTaskInput): Promise<Task>\`
Creates a new task.

**Parameters:**
- \`task\`: Task data without id, createdAt, and updatedAt fields

**Returns:** The created task with generated ID and timestamps

#### \`updateTask(id: string, updates: Partial<Task>): Promise<Task | null>\`
Updates an existing task.

**Parameters:**
- \`id\`: Task ID
- \`updates\`: Partial task data to update

**Returns:** Updated task or null if not found

#### \`deleteTask(id: string): Promise<boolean>\`
Deletes a task.

**Returns:** True if deleted successfully, false otherwise

### Milestones API

#### \`getMilestones(): Promise<Milestone[]>\`
Retrieves all project milestones.

#### \`createMilestone(milestone: CreateMilestoneInput): Promise<Milestone>\`
Creates a new milestone.

#### \`updateMilestone(id: string, updates: Partial<Milestone>): Promise<Milestone | null>\`
Updates an existing milestone.

### Statistics API

#### \`getTaskStats(): TaskStats\`
Returns task statistics including completion rates and counts by status.

### Real-time Updates

#### \`subscribe(callback: (tasks: Task[]) => void): () => void\`
Subscribes to real-time task updates.

**Returns:** Unsubscribe function
`
      },
      {
        path: './docs/ARCHITECTURE.md',
        name: 'ARCHITECTURE.md',
        type: 'guide',
        lastModified: new Date('2025-06-02'),
        content: `# System Architecture

## Overview
The BooksBoardroom Project Tracker is built with a modular, service-oriented architecture that separates concerns and enables easy testing and maintenance.

## Architecture Layers

### 1. Presentation Layer (React Components)
- **ProjectTracker**: Main dashboard component
- **TaskList**: Task management interface
- **MilestoneView**: Milestone tracking and visualization
- **ProgressCharts**: Analytics and statistics display
- **DocumentationViewer**: Markdown documentation renderer

### 2. Service Layer
- **TaskMasterService**: Core task and milestone management
- **DocumentationParser**: Markdown file parsing and processing
- **AnalyticsService**: Progress tracking and health monitoring

### 3. Data Layer
- **Types**: TypeScript interfaces and type definitions
- **Mock Data**: Sample data for development and testing

## Component Architecture

\`\`\`
ProjectTracker
├── Header (Navigation & Stats)
├── Sidebar (Milestones & Filters)
└── Main Content
    ├── TaskList
    ├── MilestoneView
    ├── ProgressCharts
    └── DocumentationViewer
\`\`\`

## Data Flow

1. **Task Creation**: User creates task → TaskMasterService → Real-time update
2. **Progress Updates**: Task status change → Milestone progress recalculation → UI update
3. **Documentation**: Load markdown files → Parse content → Render in UI

## State Management
- Local component state for UI interactions
- Service layer for business logic and data persistence
- Event-driven updates for real-time synchronization

## Real-time Features
- Task status updates
- Milestone progress recalculation
- Live statistics and charts
- Notification system for important events
`
      },
      {
        path: './docs/DEPLOYMENT.md',
        name: 'DEPLOYMENT.md',
        type: 'guide',
        lastModified: new Date('2025-06-02'),
        content: `# Deployment Guide

## Production Deployment

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Production server with HTTPS support

### Build Process
1. Install dependencies: \`npm install\`
2. Run tests: \`npm test\`
3. Build for production: \`npm run build\`
4. Preview build locally: \`npm run preview\`

### Environment Configuration
Create a \`.env.production\` file with:
\`\`\`
VITE_API_BASE_URL=https://api.yourproject.com
VITE_ENABLE_ANALYTICS=true
VITE_TASK_MASTER_ENDPOINT=wss://taskmaster.yourproject.com
\`\`\`

### Deployment Options

#### Option 1: Static Hosting (Recommended)
Deploy the \`dist\` folder to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

#### Option 2: Self-hosted
1. Copy \`dist\` folder to web server
2. Configure NGINX/Apache for SPA routing
3. Set up SSL certificate
4. Configure reverse proxy for API endpoints

### CI/CD Pipeline
Example GitHub Actions workflow:
\`\`\`yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - name: Deploy
        run: # Deploy commands here
\`\`\`

### Performance Optimization
- Enable gzip compression
- Set up CDN for static assets
- Configure caching headers
- Monitor Core Web Vitals

### Health Monitoring
- Set up uptime monitoring
- Configure error tracking
- Monitor API response times
- Track user analytics
`
      }
    ];

    this.documentationFiles = sampleDocs;
    return sampleDocs;
  }

  async getDocumentationFile(path: string): Promise<DocumentationFile | null> {
    return this.documentationFiles.find(doc => doc.path === path) || null;
  }

  async searchDocumentation(query: string): Promise<DocumentationFile[]> {
    const lowercaseQuery = query.toLowerCase();
    return this.documentationFiles.filter(doc => 
      doc.name.toLowerCase().includes(lowercaseQuery) ||
      doc.content.toLowerCase().includes(lowercaseQuery)
    );
  }

  extractProjectInfo(): ProjectInfo {
    const readmeDoc = this.documentationFiles.find(doc => doc.type === 'readme');
    const changelogDoc = this.documentationFiles.find(doc => doc.type === 'changelog');

    // Parse basic project info from README and other docs
    return {
      name: 'BooksBoardroom Project Tracker',
      description: 'A comprehensive project tracking system with Task Master MCP integration',
      status: 'in_progress',
      startDate: new Date('2025-06-02'),
      targetDate: new Date('2025-07-15'),
      techStack: [
        'React 18',
        'TypeScript',
        'Vite',
        'Tailwind CSS',
        'React Router',
        'Recharts',
        'Task Master MCP'
      ],
      team: ['Development Team'],
      repository: 'https://github.com/yourorg/booksboardroom-tracker',
      documentation: this.documentationFiles
    };
  }

  // Extract milestones from documentation
  extractMilestonesFromDocs(): Array<{title: string; description: string; targetDate: Date}> {
    const readmeContent = this.documentationFiles.find(doc => doc.type === 'readme')?.content || '';
    
    // Simple regex to find milestone patterns in markdown
    const milestonePattern = /\*\*Phase \d+\*\*:\s*([^(]+)\(Target:\s*([^)]+)\)/g;
    const milestones: Array<{title: string; description: string; targetDate: Date}> = [];
    
    let match;
    while ((match = milestonePattern.exec(readmeContent)) !== null) {
      milestones.push({
        title: match[1].trim(),
        description: `Milestone: ${match[1].trim()}`,
        targetDate: new Date(match[2].trim())
      });
    }
    
    return milestones;
  }
}