
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain, MessageSquare, Zap, BarChartBig } from 'lucide-react';

const pillars = [
  {
    icon: Brain,
    title: "Intelligent Aggregation",
    description: "AI that understands your business context, ensuring real-time data synchronization and intelligent conflict resolution across all your systems.",
    color: "text-solar-orange",
  },
  {
    icon: MessageSquare,
    title: "Natural Language Interface",
    description: "Ask questions in plain English, get instant answers. Interact with your operations using voice or text commands for unparalleled ease of use.",
    color: "text-tech-blue",
  },
  {
    icon: Zap,
    title: "Workflow Automation",
    description: "Eliminate up to 80% of manual tasks with smart trigger systems and predictive action recommendations, freeing up your team for high-value work.",
    color: "text-growth-green",
  },
  {
    icon: BarChartBig,
    title: "Unified Intelligence",
    description: "Access every metric that matters, when you need it. Benefit from real-time dashboards and predictive analytics to make data-driven decisions.",
    color: "text-purple-500", // Example color, can be themed
  },
];

const SolutionOverviewSection = () => {
  return (
    <section className="py-16 bg-background section-animate">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 text-tech-blue">Meet Your AI Operations Command Center</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Our AI-powered Central Operating System is built on four key pillars, designed to transform your solar operations from reactive to proactive.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow duration-300 group animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s`}}>
              <CardHeader className="items-center text-center">
                <pillar.icon className={`w-12 h-12 mb-4 ${pillar.color} group-hover:scale-110 transition-transform`} />
                <CardTitle className={`${pillar.color}`}>{pillar.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-foreground/80">{pillar.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionOverviewSection;
