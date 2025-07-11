import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, CheckCircle, Users, BarChart3, 
  DollarSign, FileText, Target, TrendingUp,
  BookOpen, Building2, Calculator, Shield,
  Clock, Star, Award, Phone, Mail, MapPin,
  Calendar, ExternalLink, Info, Quote
} from 'lucide-react';
import { 
  APP_NAME, 
  SERVICES, 
  CONTACT_INFO,
  PRICING_DISCLAIMER
} from '@/lib/constants';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Your Path from Books to Boardroom
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Scalable solutions designed to meet your needs today and support your growth tomorrow
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-accent-500 hover:bg-accent-600 text-white text-lg px-8 py-4">
                  <Link to="/schedule">
                    Schedule a Consultation
                    <Calendar className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-900 text-lg px-8 py-4">
                  <a href={`tel:${CONTACT_INFO.directLine}`}>
                    Call Cyndi Direct
                    <Phone className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img 
                  src="/images/cyndinew3.jpg" 
                  alt="Cyndi Dinh - Founder of Books & Boardroom" 
                  className="w-80 h-96 object-cover rounded-lg shadow-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Disclaimer */}
      <section className="py-8 bg-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-soft">
            <Info className="h-5 w-5 text-accent-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-text-secondary">
              <strong className="text-text-primary">Texas Market Pricing:</strong> {PRICING_DISCLAIMER}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {SERVICES.map((service) => (
              <div key={service.id} className="border-b border-gray-200 pb-16 last:border-b-0 last:pb-0">
                {/* Service Header */}
                <div className="text-center mb-12">
                  <div className="text-6xl mb-4">{service.icon}</div>
                  <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-2">
                    {service.title}
                  </h2>
                  {service.subtitle && (
                    <p className="text-lg font-medium text-accent-600 mb-4">{service.subtitle}</p>
                  )}
                  <p className="text-xl text-text-secondary max-w-4xl mx-auto">
                    {service.description}
                  </p>
                </div>

                {/* Pricing Packages */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Object.entries(service.pricing).map(([key, package_]) => (
                    <Card key={key} className="relative group hover:shadow-large transition-all duration-300 border-0 shadow-soft">
                      <CardHeader className="pb-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <CardTitle className="text-xl text-primary-900 mb-1">
                              {package_.name}
                            </CardTitle>
                            {package_.subtitle && (
                              <p className="text-sm font-medium text-accent-600">{package_.subtitle}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary-900">{package_.price}</div>
                            <div className="text-sm text-text-secondary">per {package_.period}</div>
                          </div>
                        </div>
                        <CardDescription className="text-text-secondary">
                          {package_.description}
                        </CardDescription>
                        {package_.ideal && (
                          <div className="mt-3 p-3 bg-accent-50 rounded-lg">
                            <p className="text-sm text-accent-800">
                              <strong>Ideal for:</strong> {package_.ideal}
                            </p>
                          </div>
                        )}
                        {package_.uses && (
                          <div className="mt-3 p-3 bg-secondary-50 rounded-lg">
                            <p className="text-sm text-secondary-800">
                              <strong>Use for:</strong> {package_.uses}
                            </p>
                          </div>
                        )}
                        {package_.note && (
                          <div className="mt-3 p-3 bg-primary-50 rounded-lg">
                            <p className="text-sm text-primary-800">
                              <strong>Note:</strong> {package_.note}
                            </p>
                          </div>
                        )}
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3 mb-6">
                          {package_.features.map((feature, index) => (
                            <li key={index} className="flex items-start text-sm text-text-secondary">
                              <CheckCircle className="h-4 w-4 text-secondary-500 mr-3 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button asChild className="w-full bg-accent-500 hover:bg-accent-600">
                          <Link to="/schedule">
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Success Story */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/images/smartview.jpg" 
                alt="SmartView Solutions - Client Success Story" 
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div>
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <img 
                    src="/images/smartview.jpg" 
                    alt="SmartView Solutions Logo" 
                    className="w-12 h-12 object-cover rounded-lg mr-3"
                  />
                  <Quote className="h-8 w-8 text-accent-600" />
                </div>
                <blockquote className="text-xl text-text-primary mb-6 italic">
                  "Books & Boardroom has been a game-changer for our business. Their expertise in financial strategy and attention to detail have given us the clarity and confidence to scale SmartView Solutions."
                </blockquote>
                <div className="flex items-center space-x-4">
                  <img 
                    src="/images/cyndinew3.jpg" 
                    alt="Mike Nguyen - Owner of SmartView Solutions" 
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-primary-900">Mike Nguyen</p>
                    <p className="text-text-secondary">Owner, SmartView Solutions</p>
                  </div>
                  <div className="flex text-accent-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-text-secondary mb-6">
                SmartView Solutions partnered with Books & Boardroom to transform their financial operations from basic bookkeeping to strategic financial planning, enabling them to focus on growth while we handled their complex financial needs.
              </p>
              <Button asChild variant="outline" className="border-secondary-600 text-secondary-600 hover:bg-secondary-600 hover:text-white">
                <a href="https://smartview-solutions.biz/" target="_blank" rel="noopener noreferrer">
                  Visit SmartView Solutions
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
            Why Choose Books & Boardroom?
          </h2>
          <p className="text-xl text-text-secondary mb-12 max-w-3xl mx-auto">
            We price based on value delivered, not just hours worked. This structure reflects the increasing strategic value from bookkeeping to CFO services.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary-900" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Texas Expertise</h3>
              <p className="text-text-secondary text-sm">
                Deep understanding of Texas tax laws, regulations, and business environment.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-secondary-700" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Scalable Solutions</h3>
              <p className="text-text-secondary text-sm">
                Grow with us from startup bookkeeping to strategic CFO services.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-accent-700" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Strategic Focus</h3>
              <p className="text-text-secondary text-sm">
                We don't just record numbers—we help you understand and act on them.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-900" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Trusted Partner</h3>
              <p className="text-text-secondary text-sm">
                Long-term relationships built on transparency, reliability, and results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Clarity Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
            Financial Clarity for Every Stage of Business
          </h2>
          <p className="text-xl text-text-secondary mb-12 max-w-3xl mx-auto">
            From startups establishing their first financial processes to corporations requiring sophisticated CFO services, we provide the expertise you need at every growth stage.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-soft">
              <Users className="h-12 w-12 text-accent-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Startups & Entrepreneurs</h3>
              <p className="text-text-secondary text-sm">
                Establishing financial infrastructure for growth and investment readiness.
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-soft">
              <Building2 className="h-12 w-12 text-accent-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Established Small Businesses</h3>
              <p className="text-text-secondary text-sm">
                Optimizing operations and improving profitability through strategic insights.
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-soft">
              <TrendingUp className="h-12 w-12 text-accent-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Growing Corporations</h3>
              <p className="text-text-secondary text-sm">
                Sophisticated financial management and strategic oversight for scale.
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-soft">
              <Target className="h-12 w-12 text-accent-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Across Diverse Industries</h3>
              <p className="text-text-secondary text-sm">
                Specialized expertise across technology, real estate, healthcare, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Cyndi Section */}
      <section className="py-20 bg-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
                Your Strategic Financial Partner
              </h2>
              <div className="space-y-4 text-text-secondary">
                <p>
                  My name is Cyndi Dinh, and I founded Books & Boardroom on a simple principle: every business owner deserves financial clarity and a strategic partner to help them navigate growth.
                </p>
                <p>
                  With years of experience in both public and private accounting, I've seen firsthand how clean books can transform a business. My expertise lies in not only ensuring perfect compliance but also in identifying key tax strategies—like optimizing entity structure (LLC vs. S-Corp), maximizing depreciation, and leveraging tax credits—that directly impact your bottom line.
                </p>
                <p className="font-medium text-primary-900">
                  We're more than your accountants; we are a dedicated part of your team, committed to turning your financial data into your most powerful asset.
                </p>
              </div>
              <div className="mt-8">
                <Button asChild variant="outline" className="border-accent-600 text-accent-600 hover:bg-accent-600 hover:text-white">
                  <a href="https://linkedin.com/in/cyndidinh" target="_blank" rel="noopener noreferrer">
                    Connect on LinkedIn
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                <img 
                  src="/images/cyndinew2.jpg" 
                  alt="Cyndi Dinh - Founder & Strategic Financial Partner" 
                  className="w-80 h-96 object-cover rounded-lg shadow-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-accent-500/10 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Financial Data into Strategic Advantage?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Schedule a complimentary consultation to discuss your business needs and determine the best service package for your growth stage. We'll help you move from managing books to making boardroom decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-accent-500 hover:bg-accent-600 text-white text-lg px-8 py-4">
              <a href={CONTACT_INFO.calendly} target="_blank" rel="noopener noreferrer">
                Schedule a Consultation
                <Calendar className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-900 text-lg px-8 py-4">
              <a href={`tel:${CONTACT_INFO.directLine}`}>
                Call Cyndi Direct
                <Phone className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
          
          <div className="mt-8 text-center space-y-2">
            <p className="text-primary-200 text-sm">
              Direct Line: <a href={`tel:${CONTACT_INFO.directLine}`} className="text-accent-300 hover:text-accent-200 font-medium">{CONTACT_INFO.directLine}</a> | 
              Office: <a href={`tel:${CONTACT_INFO.phone}`} className="text-accent-300 hover:text-accent-200 font-medium">{CONTACT_INFO.phone}</a>
            </p>
            <p className="text-primary-200 text-sm">
              Email: <a href={`mailto:${CONTACT_INFO.email}`} className="text-accent-300 hover:text-accent-200 font-medium">{CONTACT_INFO.email}</a>
            </p>
            <p className="text-primary-200 text-sm">
              {CONTACT_INFO.address.street}, {CONTACT_INFO.address.city}, {CONTACT_INFO.address.state} {CONTACT_INFO.address.zip}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 