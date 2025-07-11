import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, X, ChevronDown, Calendar, 
  BookOpen, Phone, Mail 
} from 'lucide-react';
import { 
  APP_NAME, 
  NAVIGATION, 
  CONTACT_INFO 
} from '@/lib/constants';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <nav className="bg-white shadow-soft border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary-900">{APP_NAME}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to={NAVIGATION.home.path}
              className={`text-sm font-medium transition-colors hover:text-accent-600 ${
                isActivePath(NAVIGATION.home.path) 
                  ? 'text-accent-600' 
                  : 'text-text-primary'
              }`}
            >
              {NAVIGATION.home.label}
            </Link>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('services')}
                className={`flex items-center text-sm font-medium transition-colors hover:text-accent-600 ${
                  isActivePath(NAVIGATION.services.path) 
                    ? 'text-accent-600' 
                    : 'text-text-primary'
                }`}
              >
                {NAVIGATION.services.label}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {openDropdown === 'services' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-large border border-gray-100 py-2 z-50">
                  {NAVIGATION.services.dropdown?.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="block px-4 py-2 text-sm text-text-primary hover:bg-background-main hover:text-accent-600 transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to={NAVIGATION.whoWeServe.path}
              className={`text-sm font-medium transition-colors hover:text-accent-600 ${
                isActivePath(NAVIGATION.whoWeServe.path) 
                  ? 'text-accent-600' 
                  : 'text-text-primary'
              }`}
            >
              {NAVIGATION.whoWeServe.label}
            </Link>

            <Link
              to={NAVIGATION.about.path}
              className={`text-sm font-medium transition-colors hover:text-accent-600 ${
                isActivePath(NAVIGATION.about.path) 
                  ? 'text-accent-600' 
                  : 'text-text-primary'
              }`}
            >
              {NAVIGATION.about.label}
            </Link>

            <Link
              to={NAVIGATION.resources.path}
              className={`text-sm font-medium transition-colors hover:text-accent-600 ${
                isActivePath(NAVIGATION.resources.path) 
                  ? 'text-accent-600' 
                  : 'text-text-primary'
              }`}
            >
              {NAVIGATION.resources.label}
            </Link>

            <Link
              to={NAVIGATION.contact.path}
              className={`text-sm font-medium transition-colors hover:text-accent-600 ${
                isActivePath(NAVIGATION.contact.path) 
                  ? 'text-accent-600' 
                  : 'text-text-primary'
              }`}
            >
              {NAVIGATION.contact.label}
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <a href={`tel:${CONTACT_INFO.phone}`}>
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </a>
            </Button>
            <Button size="sm" className="bg-accent-500 hover:bg-accent-600" asChild>
              <Link to={NAVIGATION.schedule.path}>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-primary"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="space-y-4">
              <Link
                to={NAVIGATION.home.path}
                className={`block text-sm font-medium transition-colors ${
                  isActivePath(NAVIGATION.home.path) 
                    ? 'text-accent-600' 
                    : 'text-text-primary'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {NAVIGATION.home.label}
              </Link>

              {/* Mobile Services */}
              <div>
                <button
                  onClick={() => toggleDropdown('mobile-services')}
                  className={`flex items-center justify-between w-full text-sm font-medium transition-colors ${
                    isActivePath(NAVIGATION.services.path) 
                      ? 'text-accent-600' 
                      : 'text-text-primary'
                  }`}
                >
                  {NAVIGATION.services.label}
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {openDropdown === 'mobile-services' && (
                  <div className="mt-2 pl-4 space-y-2">
                    {NAVIGATION.services.dropdown?.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block text-sm text-text-secondary hover:text-accent-600 transition-colors"
                        onClick={() => {
                          setIsOpen(false);
                          setOpenDropdown(null);
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to={NAVIGATION.whoWeServe.path}
                className={`block text-sm font-medium transition-colors ${
                  isActivePath(NAVIGATION.whoWeServe.path) 
                    ? 'text-accent-600' 
                    : 'text-text-primary'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {NAVIGATION.whoWeServe.label}
              </Link>

              <Link
                to={NAVIGATION.about.path}
                className={`block text-sm font-medium transition-colors ${
                  isActivePath(NAVIGATION.about.path) 
                    ? 'text-accent-600' 
                    : 'text-text-primary'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {NAVIGATION.about.label}
              </Link>

              <Link
                to={NAVIGATION.resources.path}
                className={`block text-sm font-medium transition-colors ${
                  isActivePath(NAVIGATION.resources.path) 
                    ? 'text-accent-600' 
                    : 'text-text-primary'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {NAVIGATION.resources.label}
              </Link>

              <Link
                to={NAVIGATION.contact.path}
                className={`block text-sm font-medium transition-colors ${
                  isActivePath(NAVIGATION.contact.path) 
                    ? 'text-accent-600' 
                    : 'text-text-primary'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {NAVIGATION.contact.label}
              </Link>

              {/* Mobile CTA Buttons */}
              <div className="pt-4 space-y-3">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={`tel:${CONTACT_INFO.phone}`} onClick={() => setIsOpen(false)}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </a>
                </Button>
                <Button size="sm" className="w-full bg-accent-500 hover:bg-accent-600" asChild>
                  <Link to={NAVIGATION.schedule.path} onClick={() => setIsOpen(false)}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Consultation
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for dropdowns */}
      {openDropdown && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-10"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </nav>
  );
} 