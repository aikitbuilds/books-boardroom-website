import { Agent, AgentConfig, AgentTask, AgentResponse } from './types';

export class DevOpsAgent implements Agent {
  name = 'DevOps Engineering Agent';
  description = 'Specializes in CI/CD, infrastructure, monitoring, and deployment';
  
  private config: AgentConfig = {
    expertise: [
      'CI/CD pipeline design (GitHub Actions, GitLab CI, Jenkins)',
      'Container orchestration (Docker, Kubernetes)',
      'Infrastructure as Code (Terraform, CloudFormation)',
      'Cloud platforms (AWS, GCP, Azure)',
      'Monitoring and observability (Prometheus, Grafana, ELK)',
      'Security and compliance (SAST, DAST, secrets management)',
      'Performance optimization and scaling',
      'Disaster recovery and backup strategies'
    ],
    tools: [
      'Docker and Docker Compose',
      'Kubernetes and Helm charts',
      'Terraform for infrastructure',
      'Ansible for configuration management',
      'Git for version control',
      'Cloud CLIs (aws, gcloud, az)'
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

    if (task.type === 'deployment') {
      response.analysis = `Setting up deployment pipeline for ${task.description}:`;
      response.recommendations = [
        'Implement multi-stage deployment (dev, staging, prod)',
        'Add automated testing in CI pipeline',
        'Use environment-specific configurations',
        'Implement blue-green or canary deployments',
        'Add rollback mechanisms',
        'Set up monitoring and alerts',
        'Implement secrets management with vault'
      ];
      response.codeExamples.push({
        title: 'GitHub Actions Workflow',
        code: this.generateCIPipeline()
      });
      response.codeExamples.push({
        title: 'Docker Configuration',
        code: this.generateDockerConfig()
      });
      response.estimatedTime = '6-12h';
    } else if (task.type === 'infrastructure') {
      response.analysis = 'Infrastructure setup and configuration:';
      response.recommendations = [
        'Design for high availability and fault tolerance',
        'Implement auto-scaling based on metrics',
        'Use managed services where appropriate',
        'Set up VPC with proper network segmentation',
        'Implement least privilege access policies',
        'Add cost optimization strategies',
        'Plan for disaster recovery'
      ];
      response.codeExamples.push({
        title: 'Terraform Infrastructure',
        code: this.generateTerraformConfig()
      });
      response.estimatedTime = '8-16h';
    } else if (task.type === 'monitoring') {
      response.analysis = 'Monitoring and observability implementation:';
      response.recommendations = [
        'Set up application performance monitoring (APM)',
        'Implement distributed tracing',
        'Create custom metrics and dashboards',
        'Set up log aggregation and analysis',
        'Configure alerts for critical metrics',
        'Implement SLIs and SLOs',
        'Add synthetic monitoring for user journeys'
      ];
      response.codeExamples.push({
        title: 'Monitoring Configuration',
        code: this.generateMonitoringConfig()
      });
      response.estimatedTime = '4-8h';
    }

    return response;
  }

  async execute(task: AgentTask): Promise<string> {
    return `DevOps task "${task.description}" has been analyzed. Follow the infrastructure as code examples and best practices.`;
  }

  private generateCIPipeline(): string {
    return `name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '20.x'
  DOCKER_REGISTRY: ghcr.io

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type check
        run: npm run typecheck
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          token: \${{ secrets.CODECOV_TOKEN }}

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run security audit
        run: npm audit --audit-level=moderate
      
      - name: Run SAST scan
        uses: github/super-linter@v5
        env:
          DEFAULT_BRANCH: main
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}

  build:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Log in to registry
        uses: docker/login-action@v3
        with:
          registry: \${{ env.DOCKER_REGISTRY }}
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            \${{ env.DOCKER_REGISTRY }}/\${{ github.repository }}:latest
            \${{ env.DOCKER_REGISTRY }}/\${{ github.repository }}:\${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to production
        env:
          DEPLOY_KEY: \${{ secrets.DEPLOY_KEY }}
        run: |
          # Deploy script here
          echo "Deploying to production..."`;
  }

  private generateDockerConfig(): string {
    return `# Multi-stage Dockerfile for production
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy production dependencies
COPY --from=dependencies --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/package*.json ./

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]

# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=\${DATABASE_URL}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=booksboardroom
      - POSTGRES_USER=\${DB_USER}
      - POSTGRES_PASSWORD=\${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass \${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:`;
  }

  private generateTerraformConfig(): string {
    return `# main.tf - AWS Infrastructure
terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "terraform-state-bucket"
    key    = "booksboardroom/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC Configuration
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "\${var.project_name}-vpc"
  cidr = "10.0.0.0/16"

  azs             = data.aws_availability_zones.available.names
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  enable_vpn_gateway = false
  enable_dns_hostnames = true

  tags = var.common_tags
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "\${var.project_name}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "\${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = module.vpc.public_subnets

  enable_deletion_protection = true
  enable_http2              = true
}

# Auto Scaling Group
resource "aws_autoscaling_group" "app" {
  name                = "\${var.project_name}-asg"
  vpc_zone_identifier = module.vpc.private_subnets
  target_group_arns   = [aws_lb_target_group.app.arn]
  health_check_type   = "ELB"
  health_check_grace_period = 300

  min_size         = var.min_instances
  max_size         = var.max_instances
  desired_capacity = var.desired_instances

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "\${var.project_name}-instance"
    propagate_at_launch = true
  }
}

# CloudWatch Alarms
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "\${var.project_name}-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors CPU utilization"

  dimensions = {
    ClusterName = aws_ecs_cluster.main.name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
}`;
  }

  private generateMonitoringConfig(): string {
    return `# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093

rule_files:
  - "alerts/*.yml"

scrape_configs:
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['localhost:9100']

  - job_name: 'application'
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/metrics'

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

# alerts/application.yml
groups:
  - name: application
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"

      - alert: HighMemoryUsage
        expr: process_resident_memory_bytes / 1024 / 1024 > 500
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value }}MB"

      - alert: SlowResponseTime
        expr: histogram_quantile(0.95, http_request_duration_seconds_bucket) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Slow response times"
          description: "95th percentile response time is {{ $value }}s"

# grafana-dashboard.json
{
  "dashboard": {
    "title": "BooksBoardroom Monitoring",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ]
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~'5..'}[5m])"
          }
        ]
      },
      {
        "title": "Response Time",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, http_request_duration_seconds_bucket)"
          }
        ]
      }
    ]
  }
}`;
  }
}