import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, X, ChevronDown, 
  BookOpen, Building2, Users, 
  FileText, Phone, Mail
} from 'lucide-react';
import { APP_NAME, NAVIGATION, CONTACT_INFO } from '@/lib/constants';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary-900">
              {APP_NAME}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to={NAVIGATION.home.path}
              className="text-text-primary hover:text-primary-900 font-medium transition-colors"
            >
              {NAVIGATION.home.label}
            </Link>
            
            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center space-x-1 text-text-primary hover:text-primary-900 font-medium transition-colors"
              >
                <span>{NAVIGATION.services.label}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {NAVIGATION.services.dropdown?.map((service) => (
                    <Link
                      key={service.path}
                      to={service.path}
                      className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-50 hover:text-primary-900 transition-colors"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      {service.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link 
              to={NAVIGATION.whoWeServe.path}
              className="text-text-primary hover:text-primary-900 font-medium transition-colors"
            >
              {NAVIGATION.whoWeServe.label}
            </Link>
            
            <Link 
              to={NAVIGATION.about.path}
              className="text-text-primary hover:text-primary-900 font-medium transition-colors"
            >
              {NAVIGATION.about.label}
            </Link>
            
            <Link 
              to={NAVIGATION.resources.path}
              className="text-text-primary hover:text-primary-900 font-medium transition-colors"
            >
              {NAVIGATION.resources.label}
            </Link>
            
            <Link 
              to={NAVIGATION.contact.path}
              className="text-text-primary hover:text-primary-900 font-medium transition-colors"
            >
              {NAVIGATION.contact.label}
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/signup">
                Get Started
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-primary-900 hover:bg-primary-800">
              <Link to="/contact">
                <Phone className="w-4 h-4 mr-2" />
                Contact Us
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-text-primary hover:text-primary-900"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <div className="space-y-4">
              <Link 
                to={NAVIGATION.home.path}
                className="block px-4 py-2 text-text-primary hover:text-primary-900 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {NAVIGATION.home.label}
              </Link>
              
              {/* Mobile Services */}
              <div className="px-4">
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="flex items-center justify-between w-full py-2 text-text-primary hover:text-primary-900 font-medium"
                >
                  <span>{NAVIGATION.services.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isServicesOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    {NAVIGATION.services.dropdown?.map((service) => (
                      <Link
                        key={service.path}
                        to={service.path}
                        className="block py-2 text-sm text-text-secondary hover:text-primary-900"
                        onClick={() => {
                          setIsServicesOpen(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        {service.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <Link 
                to={NAVIGATION.whoWeServe.path}
                className="block px-4 py-2 text-text-primary hover:text-primary-900 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {NAVIGATION.whoWeServe.label}
              </Link>
              
              <Link 
                to={NAVIGATION.about.path}
                className="block px-4 py-2 text-text-primary hover:text-primary-900 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {NAVIGATION.about.label}
              </Link>
              
              <Link 
                to={NAVIGATION.resources.path}
                className="block px-4 py-2 text-text-primary hover:text-primary-900 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {NAVIGATION.resources.label}
              </Link>
              
              <Link 
                to={NAVIGATION.contact.path}
                className="block px-4 py-2 text-text-primary hover:text-primary-900 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {NAVIGATION.contact.label}
              </Link>
              
              {/* Mobile CTA Buttons */}
              <div className="px-4 pt-4 space-y-2">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
                <Button asChild className="w-full bg-primary-900 hover:bg-primary-800">
                  <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 