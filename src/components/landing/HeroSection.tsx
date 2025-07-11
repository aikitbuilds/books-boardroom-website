
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-tech-blue/5 via-background to-solar-orange/5">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          <span className="block text-tech-blue">Stop Managing Systems.</span>
          <span className="block text-gradient-orange-gold">Start Orchestrating Success.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          The first AI-powered Central Operating System built specifically for solar companies. One platform. Infinite possibilities.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button size="lg" className="bg-solar-orange hover:bg-solar-orange/90 text-white group w-full sm:w-auto">
            See It In Action 
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" className="border-tech-blue text-tech-blue hover:bg-tech-blue/10 w-full sm:w-auto">
            Calculate Your Savings
          </Button>
        </div>
        <div className="mt-16">
          {/* Placeholder for "efficiency gained" counter or network visualization */}
          <img 
            src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
            alt="Abstract representation of connected systems" 
            className="rounded-lg shadow-2xl mx-auto max-w-3xl w-full aspect-video object-cover"
          />
           <p className="text-sm text-muted-foreground mt-2">Conceptual representation of AI orchestrating solar operations.</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
