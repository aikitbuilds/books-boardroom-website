import { Agent, AgentOrchestrator, AgentTask, AgentResponse } from './types';
import { FrontendAgent } from './frontend-agent';
import { BackendAgent } from './backend-agent';
import { DevOpsAgent } from './devops-agent';

export class ProjectOrchestrator implements AgentOrchestrator {
  agents: Agent[];

  constructor() {
    this.agents = [
      new FrontendAgent(),
      new BackendAgent(),
      new DevOpsAgent()
    ];
  }

  async assignTask(task: AgentTask): Promise<Agent> {
    // Determine which agent is best suited for the task
    const taskTypeMapping: Record<string, string> = {
      'component': 'Frontend Development Agent',
      'styling': 'Frontend Development Agent',
      'optimization': 'Frontend Development Agent',
      'api': 'Backend Development Agent',
      'database': 'Backend Development Agent',
      'integration': 'Backend Development Agent',
      'deployment': 'DevOps Engineering Agent',
      'infrastructure': 'DevOps Engineering Agent',
      'monitoring': 'DevOps Engineering Agent'
    };

    const agentName = taskTypeMapping[task.type];
    const agent = this.agents.find(a => a.name === agentName);

    if (!agent) {
      throw new Error(`No agent found for task type: ${task.type}`);
    }

    return agent;
  }

  async executeTask(task: AgentTask): Promise<AgentResponse> {
    const agent = await this.assignTask(task);
    const response = await agent.analyze(task);
    
    console.log(`\n🤖 ${agent.name} analyzing task: ${task.description}`);
    console.log(`📊 Analysis: ${response.analysis}`);
    console.log(`⏱️  Estimated time: ${response.estimatedTime}`);
    
    return response;
  }

  async collaborateOnTask(task: AgentTask, agentNames?: string[]): Promise<AgentResponse[]> {
    // Allow specific agents to collaborate or use all agents
    const collaboratingAgents = agentNames 
      ? this.agents.filter(a => agentNames.includes(a.name))
      : this.agents;

    console.log(`\n🤝 Collaborative analysis for: ${task.description}`);
    console.log(`👥 Agents involved: ${collaboratingAgents.map(a => a.name).join(', ')}`);

    const responses = await Promise.all(
      collaboratingAgents.map(agent => agent.analyze(task))
    );

    return responses;
  }

  async planProject(projectDescription: string): Promise<void> {
    console.log(`\n📋 Project Planning: ${projectDescription}\n`);

    // Define project tasks
    const tasks: AgentTask[] = [
      {
        id: '1',
        type: 'component',
        description: 'User authentication and profile management UI',
        priority: 'high'
      },
      {
        id: '2',
        type: 'api',
        description: 'RESTful API for user management and authentication',
        priority: 'high'
      },
      {
        id: '3',
        type: 'database',
        description: 'Database schema for users, sessions, and permissions',
        priority: 'high'
      },
      {
        id: '4',
        type: 'infrastructure',
        description: 'AWS infrastructure setup with auto-scaling',
        priority: 'medium'
      },
      {
        id: '5',
        type: 'deployment',
        description: 'CI/CD pipeline with automated testing',
        priority: 'medium'
      },
      {
        id: '6',
        type: 'monitoring',
        description: 'Application monitoring and alerting setup',
        priority: 'low'
      }
    ];

    // Execute all tasks
    for (const task of tasks) {
      await this.executeTask(task);
      console.log('\n' + '='.repeat(80) + '\n');
    }

    // Example of collaboration
    const integrationTask: AgentTask = {
      id: '7',
      type: 'integration',
      description: 'Full-stack integration of authentication system',
      priority: 'critical'
    };

    const collaborativeResponses = await this.collaborateOnTask(integrationTask);
    
    console.log('\n📍 Collaborative Analysis Results:');
    collaborativeResponses.forEach(response => {
      console.log(`\n${response.agent}:`);
      console.log(`- ${response.recommendations.slice(0, 3).join('\n- ')}`);
    });
  }
}

// Example usage
async function demonstrateAgents() {
  const orchestrator = new ProjectOrchestrator();
  
  // Single task execution
  const singleTask: AgentTask = {
    id: 'demo-1',
    type: 'component',
    description: 'Dashboard component with real-time data updates',
    priority: 'high'
  };
  
  const response = await orchestrator.executeTask(singleTask);
  console.log('\n📄 Code Example:');
  console.log(response.codeExamples[0]?.code.substring(0, 500) + '...');
  
  // Project planning
  await orchestrator.planProject('BooksBoardroom Financial Management System');
}

// Run demonstration if this file is executed directly
if (require.main === module) {
  demonstrateAgents().catch(console.error);
}