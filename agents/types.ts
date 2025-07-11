// Common types for all agents

export interface AgentTask {
  id: string;
  type: 'component' | 'api' | 'database' | 'deployment' | 'infrastructure' | 'monitoring' | 'optimization' | 'styling' | 'integration';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  requirements?: string[];
  constraints?: string[];
  dependencies?: string[];
}

export interface AgentResponse {
  agent: string;
  analysis: string;
  recommendations: string[];
  codeExamples: CodeExample[];
  estimatedTime: string;
  risks?: string[];
  dependencies?: string[];
}

export interface CodeExample {
  title: string;
  code: string;
  language?: string;
  description?: string;
}

export interface AgentConfig {
  expertise: string[];
  tools: string[];
  constraints?: string[];
}

export interface Agent {
  name: string;
  description: string;
  analyze(task: AgentTask): Promise<AgentResponse>;
  execute(task: AgentTask): Promise<string>;
}

export interface AgentOrchestrator {
  agents: Agent[];
  assignTask(task: AgentTask): Promise<Agent>;
  executeTask(task: AgentTask): Promise<AgentResponse>;
  collaborateOnTask(task: AgentTask, agents: Agent[]): Promise<AgentResponse[]>;
}