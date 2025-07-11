
import React from 'react';
import { Sun, Zap } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-8 bg-gray-100 border-t">
      <div className="container mx-auto text-center text-muted-foreground">
        <a href="/" className="flex items-center justify-center space-x-2 text-xl font-bold text-primary mb-4">
          <Sun className="w-7 h-7 text-solar-orange" />
          <span>SolarOS</span>
          <Zap className="w-5 h-5 text-gold-accent" />
        </a>
        <p className="text-sm">
          Transforming solar operations with AI.
        </p>
        <p className="text-sm mt-2">
          &copy; {currentYear} Solar Ops Orchestrator AI. All rights reserved.
        </p>
        <div className="mt-4 space-x-4">
          <a href="/privacy" className="hover:text-primary">Privacy Policy</a>
          <a href="/terms" className="hover:text-primary">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
