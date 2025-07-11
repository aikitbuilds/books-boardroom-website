import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  GitBranch,
  Plus,
  Search,
  Target,
  TrendingUp,
  Users,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { TaskMasterService } from '../services/taskMaster';
import { DocumentationParser } from '../services/documentationParser';
import { Task, Milestone, DocumentationFile } from '../types';
import TaskList from './TaskList';
import MilestoneView from './MilestoneView';
import ProgressCharts from './ProgressCharts';
import DocumentationViewer from './DocumentationViewer';

type ActiveTab = 'overview' | 'tasks' | 'milestones' | 'progress' | 'docs';

const ProjectTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [documentation, setDocumentation] = useState<DocumentationFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const taskMaster = new TaskMasterService();
  const docParser = DocumentationParser.getInstance();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksData, milestonesData, docsData] = await Promise.all([
        taskMaster.getTasks(),
        taskMaster.getMilestones(),
        docParser.loadProjectDocumentation()
      ]);

      setTasks(tasksData);
      setMilestones(milestonesData);
      setDocumentation(docsData);

      // Subscribe to real-time task updates
      taskMaster.subscribe(setTasks);
    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = taskMaster.getTaskStats();
  const projectInfo = docParser.extractProjectInfo();

  const getTabIcon = (tab: ActiveTab) => {
    switch (tab) {
      case 'overview': return <BarChart3 className="w-4 h-4" />;
      case 'tasks': return <CheckCircle2 className="w-4 h-4" />;
      case 'milestones': return <Target className="w-4 h-4" />;
      case 'progress': return <TrendingUp className="w-4 h-4" />;
      case 'docs': return <FileText className="w-4 h-4" />;
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading project data...</span>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <OverviewTab stats={stats} projectInfo={projectInfo} milestones={milestones} />;
      case 'tasks':
        return <TaskList tasks={tasks} onTaskUpdate={loadData} />;
      case 'milestones':
        return <MilestoneView milestones={milestones} tasks={tasks} />;
      case 'progress':
        return <ProgressCharts tasks={tasks} milestones={milestones} />;
      case 'docs':
        return <DocumentationViewer documentation={documentation} searchQuery={searchQuery} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GitBranch className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Project Tracker</h1>
                <p className="text-sm text-gray-500">BooksBoardroom Development</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {activeTab === 'docs' && (
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search documentation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{projectInfo.team.length} team members</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Target: {projectInfo.targetDate?.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {(['overview', 'tasks', 'milestones', 'progress', 'docs'] as ActiveTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {getTabIcon(tab)}
                <span className="capitalize">{tab}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{
  stats: any;
  projectInfo: any;
  milestones: Milestone[];
}> = ({ stats, projectInfo, milestones }) => {
  const upcomingMilestones = milestones
    .filter(m => m.status !== 'completed')
    .sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Project Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Info and Upcoming Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Project Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <div className="flex items-center mt-1">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  projectInfo.status === 'in_progress' ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <p className="text-sm text-gray-900 capitalize">{projectInfo.status.replace('_', ' ')}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tech Stack</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {projectInfo.techStack.slice(0, 4).map((tech: string) => (
                  <span key={tech} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {tech}
                  </span>
                ))}
                {projectInfo.techStack.length > 4 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{projectInfo.techStack.length - 4} more
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Description</p>
              <p className="text-sm text-gray-900 mt-1">{projectInfo.description}</p>
            </div>
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Milestones</h3>
          <div className="space-y-3">
            {upcomingMilestones.map((milestone) => (
              <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{milestone.title}</p>
                  <p className="text-xs text-gray-600">
                    Target: {milestone.targetDate.toLocaleDateString()}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${milestone.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                    milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    milestone.status === 'delayed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {milestone.completionPercentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTracker;