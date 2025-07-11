
import React from 'react';
import { Sun, Zap } from 'lucide-react'; // Example icons

const Header = () => {
  return (
    <header className="py-4 sticky top-0 z-50 bg-background/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="flex items-center space-x-2 text-2xl font-bold text-primary">
          <Sun className="w-8 h-8 text-solar-orange" />
          <span>SolarOS</span>
          <Zap className="w-6 h-6 text-gold-accent" />
        </a>
        <nav className="space-x-4">
          <a href="#solutions" className="text-foreground hover:text-primary transition-colors">Solutions</a>
          <a href="#pricing" className="text-foreground hover:text-primary transition-colors">Pricing</a>
          <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
          <a
            href="#demo"
            className="bg-solar-orange text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-all"
          >
            Get Demo
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
