
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProblemAgitationSection = () => {
  return (
    <section className="py-16 bg-tech-blue/5 section-animate">
      <div className="container mx-auto text-center">
        <AlertTriangle className="w-12 h-12 text-solar-orange mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-6 text-tech-blue">The Hidden Cost of Operational Chaos</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
          Juggling multiple disconnected systems? Wasting hours on manual data entry and reconciliation? 
          These inefficiencies aren't just frustrating – they're actively costing your business time, money, and growth opportunities.
        </p>
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-xl">
          <h3 className="text-xl font-semibold mb-4 text-solar-orange">Estimate Your Inefficiency Cost:</h3>
          <p className="text-sm text-muted-foreground mb-6">
            (Interactive calculator coming soon! For now, consider these common pain points.)
          </p>
          <ul className="text-left space-y-2 text-foreground mb-6">
            <li className="flex items-center"><ChevronRight className="w-5 h-5 text-solar-orange mr-2 flex-shrink-0" /> Multiple software subscriptions</li>
            <li className="flex items-center"><ChevronRight className="w-5 h-5 text-solar-orange mr-2 flex-shrink-0" /> Hours spent on manual data entry</li>
            <li className="flex items-center"><ChevronRight className="w-5 h-5 text-solar-orange mr-2 flex-shrink-0" /> Delayed project timelines</li>
            <li className="flex items-center"><ChevronRight className="w-5 h-5 text-solar-orange mr-2 flex-shrink-0" /> Onboarding and training overhead</li>
          </ul>
          <Button variant="outline" className="border-tech-blue text-tech-blue hover:bg-tech-blue/10">
            Learn How We Solve This
          </Button>
        </div>
         <p className="mt-12 text-sm text-muted-foreground">
            Visual of chaotic lines transforming into an organized system will be added here.
         </p>
      </div>
    </section>
  );
};

// Helper to import ChevronRight, if not already globally available.
// For this example, assuming it's available or will be added.
import { ChevronRight } from 'lucide-react'; 

export default ProblemAgitationSection;
