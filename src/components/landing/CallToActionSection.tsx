
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Assuming Input component is available
import { Mail, PlayCircle, MessageCircle } from 'lucide-react';

const CallToActionSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-tech-blue to-blue-800 text-white section-animate">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Solar Operations?</h2>
        <p className="text-lg text-blue-100/90 max-w-2xl mx-auto mb-12">
          Choose the path that's right for you. Start small or dive deep – the future of solar operations is here.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Tier 1: I'm Interested */}
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all">
            <Mail className="w-10 h-10 text-solar-orange mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">I'm Interested</h3>
            <p className="text-sm text-blue-100/80 mb-4">Get our newsletter & free resources.</p>
            <div className="flex">
              <Input type="email" placeholder="Enter your email" className="bg-white/20 text-white placeholder-blue-100/70 border-transparent focus:ring-solar-orange flex-grow mr-2" />
              <Button className="bg-solar-orange hover:bg-solar-orange/90 text-white">Sign Up</Button>
            </div>
          </div>

          {/* Tier 2: Show Me More */}
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all">
            <PlayCircle className="w-10 h-10 text-solar-orange mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Show Me More</h3>
            <p className="text-sm text-blue-100/80 mb-4">Book a personalized demo.</p>
            <Button className="bg-solar-orange hover:bg-solar-orange/90 text-white w-full">Book Demo</Button>
          </div>

          {/* Tier 3: Let's Talk Business */}
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all">
            <MessageCircle className="w-10 h-10 text-solar-orange mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Let's Talk Business</h3>
            <p className="text-sm text-blue-100/80 mb-4">Request a direct consultation.</p>
            <Button className="bg-solar-orange hover:bg-solar-orange/90 text-white w-full">Consult Us</Button>
          </div>
        </div>

        <div className="mt-12 text-sm text-blue-100/80">
          <p>Risk Reversal: 30-day money-back guarantee • Free migration support • Dedicated success manager</p>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
