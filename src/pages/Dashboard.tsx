import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Chart } from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CalendarDays, CheckCircle, AlertCircle, TrendingUp, Lightbulb, FileText, Users, Settings } from "lucide-react"
import { ProfileMenu } from '@/components/ProfileMenu';
import { fetchAllDashboardData } from '@/services/firebaseParser'
import { parseAllMdFiles, mermaidToSvg } from '@/services/mdParser'
import mermaid from 'mermaid'

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'neutral',
  securityLevel: 'loose',
});

// Mock data - would be replaced with Firebase/Firestore data
const projectData = {
  milestones: [
    {
      id: 1,
      name: "Project Setup and Infrastructure",
      status: "In Progress",
      completion: 75,
      tasks: 13,
      tasksCompleted: 10
    },
    {
      id: 2, 
      name: "Core Authentication and User Management",
      status: "Not Started",
      completion: 0,
      tasks: 10,
      tasksCompleted: 0
    },
    {
      id: 3,
      name: "Project Management Module",
      status: "Not Started",
      completion: 0,
      tasks: 11,
      tasksCompleted: 0
    }
  ],
  insights: [
    {
      id: 1,
      type: "Performance",
      title: "System Efficiency Opportunity",
      description: "Analysis of system SYS-1042 shows 15% below expected performance. Panel cleaning and inverter optimization could improve output by up to 20%.",
      confidence: 92,
      timestamp: "2 hours ago",
      color: "indigo"
    },
    {
      id: 2,
      type: "Risk",
      title: "Permit Approval Delay Risk",
      description: "Projects in Riverside County are experiencing 30% longer permit approval times. Consider adjusting timelines for PRJ-2305 and PRJ-2306.",
      confidence: 87,
      timestamp: "1 day ago",
      color: "yellow"
    },
    {
      id: 3,
      type: "Opportunity",
      title: "Lead Conversion Opportunity",
      description: "Lead scoring model identifies 5 high-potential leads that match your most successful conversion patterns. Prioritize follow-up for 35% higher close rate.",
      confidence: 94,
      timestamp: "3 days ago",
      color: "green"
    }
  ]
}

// This would be populated from the MD files
const mdContent = {
  projectBrief: "The Solar Ops Orchestrator AI is a comprehensive platform designed to revolutionize solar energy operations through AI-driven automation, intelligent monitoring, and seamless integration with existing business systems.",
  currentPhase: "Phase 1: Core Platform & Authentication",
  projectProgress: 12 // Overall project progress percentage
}

// Function to load the content of a markdown file
const loadMarkdownFile = async (filename: string) => {
  try {
    const response = await fetch(`/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return '';
  }
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>({
    firebaseData: null,
    markdownData: null
  });
  const [mermaidSvg, setMermaidSvg] = useState<Record<string, string>>({});
  
  // Load data from Firebase and MD files
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load Firebase data
        const firebaseData = await fetchAllDashboardData();
        
        // Load markdown files
        const projectBrief = await loadMarkdownFile('projectBrief.md');
        const planningBoard = await loadMarkdownFile('planning_board.md');
        const workflow = await loadMarkdownFile('workflow.md');
        const progress = await loadMarkdownFile('progress.md');
        const rules = await loadMarkdownFile('rules.md');
        
        const markdownData = parseAllMdFiles({
          projectBrief,
          planningBoard,
          workflow,
          progress,
          rules
        });
        
        setDashboardData({
          firebaseData,
          markdownData
        });
        
        // Convert Mermaid diagrams to SVG
        if (markdownData.workflow && markdownData.workflow.diagrams) {
          const svgPromises = markdownData.workflow.diagrams.map((diagram, index) => 
            mermaidToSvg(diagram).then(svg => ({ 
              [`diagram${index}`]: svg 
            }))
          );
          
          const svgResults = await Promise.all(svgPromises);
          const svgMap = svgResults.reduce((acc, item) => ({ ...acc, ...item }), {});
          setMermaidSvg(svgMap);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Use loaded data or fallback to mock data
  const data = {
    milestones: dashboardData.firebaseData?.milestones || dashboardData.markdownData?.planningBoard?.milestones || projectData.milestones,
    insights: dashboardData.firebaseData?.insights || projectData.insights,
    projectBrief: dashboardData.markdownData?.projectBrief?.overview || mdContent.projectBrief,
    currentPhase: dashboardData.markdownData?.projectBrief?.phases?.split('\n')[0] || mdContent.currentPhase,
    projectProgress: dashboardData.markdownData?.planningBoard?.overallCompletion || mdContent.projectProgress,
    workflow: dashboardData.markdownData?.workflow || {},
    rules: dashboardData.markdownData?.rules?.rules || []
  };

  return (
    <div className="container mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Solar Ops Orchestrator AI</h1>
          <p className="text-muted-foreground">Project Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            View Documentation
          </Button>
          <ProfileMenu />
        </div>
      </header>

      <Alert className="mb-6">
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>Current Phase</AlertTitle>
        <AlertDescription>
          {data.currentPhase} - Overall Progress: {data.projectProgress}%
        </AlertDescription>
      </Alert>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent align-middle"></div>
            <p className="mt-2">Loading dashboard data...</p>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="overview" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="milestones">Milestones & Tasks</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="rules">Project Rules</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Brief</CardTitle>
                  <CardDescription>Key information about the project</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-40">
                    <p>{data.projectBrief}</p>
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">View Full Brief</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Timeline</CardTitle>
                  <CardDescription>Major milestones and deadlines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.milestones.map((milestone: any) => (
                      <div key={milestone.id} className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${
                          milestone.status === "Completed" ? "bg-green-500" : 
                          milestone.status === "In Progress" ? "bg-blue-500" : "bg-gray-500"
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{milestone.name}</p>
                          <p className="text-xs text-muted-foreground">{milestone.status}</p>
                        </div>
                        <Badge variant={
                          milestone.status === "Completed" ? "outline" : 
                          milestone.status === "In Progress" ? "default" : "secondary"
                        }>
                          {milestone.completion}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">View Timeline</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Stats</CardTitle>
                  <CardDescription>Current project statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm font-medium">{data.projectProgress}%</span>
                      </div>
                      <Progress value={data.projectProgress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-100 p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">Total Milestones</p>
                        <p className="text-2xl font-bold">{data.milestones.length}</p>
                      </div>
                      <div className="bg-slate-100 p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">Tasks Completed</p>
                        <p className="text-2xl font-bold">
                          {data.milestones.reduce((acc: number, milestone: any) => acc + (milestone.tasksCompleted || 0), 0)} / 
                          {data.milestones.reduce((acc: number, milestone: any) => acc + (milestone.tasks || milestone.tasks?.length || 0), 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">View All Stats</Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent AI Insights</CardTitle>
                  <CardDescription>Latest AI-generated insights for your project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.insights.map((insight: any) => (
                      <div key={insight.id} className={`p-4 border-l-4 border-${insight.color}-500 rounded-md bg-white shadow-sm`}>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className={`bg-${insight.color}-100 text-${insight.color}-800 hover:bg-${insight.color}-100`}>
                            {insight.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{typeof insight.timestamp === 'string' ? insight.timestamp : new Date(insight.timestamp).toLocaleString()}</span>
                        </div>
                        <h3 className="font-semibold mb-2">{insight.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Confidence: <span className="font-semibold text-primary">{insight.confidence}%</span></span>
                          <Button variant="link" size="sm" className="p-0 h-auto">View Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">View All Insights</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="milestones" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Project Milestones</CardTitle>
                    <CardDescription>Track progress across all project milestones</CardDescription>
                  </div>
                  <Button>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {data.milestones.map((milestone: any) => (
                    <div key={milestone.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">{milestone.name}</h3>
                        <Badge variant={
                          milestone.status === "Completed" ? "outline" : 
                          milestone.status === "In Progress" ? "default" : "secondary"
                        }>
                          {milestone.status}
                        </Badge>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Progress</span>
                          <span className="text-sm">{milestone.completion}%</span>
                        </div>
                        <Progress value={milestone.completion} className="h-2" />
                      </div>
                      
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          Tasks: {milestone.tasksCompleted || milestone.tasks?.filter((t: any) => t.completed).length || 0} / 
                          {milestone.tasks?.length || 0}
                        </span>
                        <Button variant="link" size="sm" className="p-0 h-auto">View Tasks</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Insights</CardTitle>
                  <CardDescription>Intelligence gathered from project data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.insights.map((insight: any) => (
                      <div key={insight.id} className={`p-4 border-l-4 border-${insight.color}-500 rounded-md bg-white shadow-sm`}>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className={`bg-${insight.color}-100 text-${insight.color}-800 hover:bg-${insight.color}-100`}>
                            {insight.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{typeof insight.timestamp === 'string' ? insight.timestamp : new Date(insight.timestamp).toLocaleString()}</span>
                        </div>
                        <h3 className="font-semibold mb-2">{insight.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Confidence: <span className="font-semibold text-primary">{insight.confidence}%</span></span>
                          <Button variant="link" size="sm" className="p-0 h-auto">View Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                  <CardDescription>AI-powered project performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <div className="relative">
                      <Chart
                        type="line"
                        options={{
                          chart: {
                            toolbar: { show: false }
                          },
                          xaxis: {
                            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                          },
                          stroke: { curve: 'smooth' }
                        }}
                        series={[
                          {
                            name: 'Progress',
                            data: [10, 15, 25, 32, 45, 55]
                          },
                          {
                            name: 'Estimated',
                            data: [12, 24, 36, 48, 60, 72]
                          }
                        ]}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none">
                        <p>Chart visualization would appear here</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="workflow" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Workflow</CardTitle>
                <CardDescription>Visual representation of the project workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4 bg-slate-50">
                  {mermaidSvg.diagram0 ? (
                    <div className="overflow-auto" dangerouslySetInnerHTML={{ __html: mermaidSvg.diagram0 }} />
                  ) : (
                    <div className="text-center p-6">
                      <p className="text-muted-foreground mb-2">Workflow diagram will be loaded from workflow.md</p>
                      <Button variant="outline">View Full Workflow</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {mermaidSvg.diagram1 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>System Architecture</CardTitle>
                  <CardDescription>Technical architecture of the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md p-4 bg-slate-50">
                    <div className="overflow-auto" dangerouslySetInnerHTML={{ __html: mermaidSvg.diagram1 }} />
                  </div>
                </CardContent>
              </Card>
            )}
            
            {mermaidSvg.diagram2 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>User Journey</CardTitle>
                  <CardDescription>End-to-end user journey through the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md p-4 bg-slate-50">
                    <div className="overflow-auto" dangerouslySetInnerHTML={{ __html: mermaidSvg.diagram2 }} />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="rules" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Rules</CardTitle>
                <CardDescription>Guidelines and rules for project development</CardDescription>
              </CardHeader>
              <CardContent>
                {data.rules && data.rules.length > 0 ? (
                  <div className="space-y-6">
                    {data.rules.map((rule: any) => (
                      <div key={rule.id} className="border rounded-md p-4">
                        <h3 className="text-lg font-semibold mb-2">{rule.id}. {rule.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{rule.description}</p>
                        {rule.steps && rule.steps.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Key Steps:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {rule.steps.map((step: string, index: number) => (
                                <li key={index}>{step}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border rounded-md p-4">
                    <div className="text-center p-6">
                      <p className="text-muted-foreground mb-2">Project rules will be loaded from rules.md</p>
                      <Button variant="outline">Create Rules File</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

export default Dashboard 