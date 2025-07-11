import { Agent, AgentConfig, AgentTask, AgentResponse } from './types';

export class BackendAgent implements Agent {
  name = 'Backend Development Agent';
  description = 'Specializes in Node.js, APIs, databases, and server architecture';
  
  private config: AgentConfig = {
    expertise: [
      'Node.js and Express.js API development',
      'RESTful and GraphQL API design',
      'Database design (PostgreSQL, MongoDB, Firebase)',
      'Authentication and authorization (JWT, OAuth)',
      'Microservices architecture',
      'Message queues and event-driven systems',
      'API security and rate limiting',
      'Testing (Jest, Supertest, integration tests)'
    ],
    tools: [
      'TypeScript for type-safe backend code',
      'Prisma/TypeORM for database management',
      'Redis for caching',
      'Docker for containerization',
      'Swagger/OpenAPI for documentation'
    ]
  };

  async analyze(task: AgentTask): Promise<AgentResponse> {
    const response: AgentResponse = {
      agent: this.name,
      analysis: '',
      recommendations: [],
      codeExamples: [],
      estimatedTime: '0h'
    };

    if (task.type === 'api') {
      response.analysis = `Designing ${task.description} API endpoint:`;
      response.recommendations = [
        'Implement proper input validation and sanitization',
        'Use middleware for authentication and error handling',
        'Add request/response logging',
        'Implement rate limiting to prevent abuse',
        'Return consistent error responses',
        'Add comprehensive API documentation'
      ];
      response.codeExamples.push({
        title: 'API Endpoint Template',
        code: this.generateApiTemplate(task.description)
      });
      response.estimatedTime = '3-6h';
    } else if (task.type === 'database') {
      response.analysis = 'Database design and optimization approach:';
      response.recommendations = [
        'Design normalized schema to prevent data redundancy',
        'Add proper indexes for query performance',
        'Implement database migrations',
        'Use transactions for data consistency',
        'Add database connection pooling',
        'Implement backup and recovery strategies'
      ];
      response.codeExamples.push({
        title: 'Database Schema',
        code: this.generateDatabaseSchema()
      });
      response.estimatedTime = '4-8h';
    } else if (task.type === 'integration') {
      response.analysis = 'Third-party integration strategy:';
      response.recommendations = [
        'Create abstraction layer for external services',
        'Implement retry logic with exponential backoff',
        'Add circuit breaker pattern for fault tolerance',
        'Cache responses when appropriate',
        'Handle API versioning and deprecations',
        'Add comprehensive error handling'
      ];
      response.estimatedTime = '6-12h';
    }

    return response;
  }

  async execute(task: AgentTask): Promise<string> {
    return `Backend task "${task.description}" has been analyzed. Implement using the provided patterns and best practices.`;
  }

  private generateApiTemplate(endpoint: string): string {
    return `import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { AppError } from '@/utils/errors';
import { logger } from '@/utils/logger';

// Validation middleware
export const validate${endpoint} = [
  body('name').notEmpty().trim().isLength({ min: 3, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('data').optional().isJSON(),
];

// Controller
export const ${endpoint.toLowerCase()}Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Validation failed', 400, errors.array());
    }

    const { name, email, data } = req.body;
    
    // Log request
    logger.info('${endpoint} request', { 
      userId: req.user?.id,
      body: req.body 
    });

    // Business logic here
    const result = await ${endpoint.toLowerCase()}Service.process({
      name,
      email,
      data: data ? JSON.parse(data) : null,
      userId: req.user?.id
    });

    // Return response
    res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('${endpoint} error', error);
    next(error);
  }
};

// Service layer
class ${endpoint}Service {
  async process(params: ${endpoint}Params): Promise<${endpoint}Result> {
    // Implement business logic
    // Separate database queries into repository layer
    // Handle transactions if needed
    
    return {
      id: 'generated-id',
      ...params,
      createdAt: new Date()
    };
  }
}

export const ${endpoint.toLowerCase()}Service = new ${endpoint}Service();`;
  }

  private generateDatabaseSchema(): string {
    return `-- PostgreSQL schema example
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`;
  }
}