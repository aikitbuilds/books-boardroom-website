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
  Calendar, ExternalLink
} from 'lucide-react';
import { 
  APP_NAME, 
  SERVICES, 
  CONTACT_INFO,
  COMPANY_INFO
} from '@/lib/constants';

export default function BooksBoardroomHome() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-white opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                From Clean Books to<br />
                <span className="text-accent-300">Confident Decisions</span>
              </h1>
              <h2 className="text-xl md:text-2xl mb-8 text-primary-100 leading-relaxed">
                We handle your complex finances so you can focus on what you do best: growing your business.
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-accent-500 hover:bg-accent-600 text-white text-lg px-8 py-4">
                  <a href={CONTACT_INFO.calendly} target="_blank" rel="noopener noreferrer">
                    Schedule Your Financial Roadmap
                    <Calendar className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-900 text-lg px-8 py-4">
                  <Link to="/services">
                    Explore Our Services
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img 
                  src="/images/cyndinew3.jpg" 
                  alt="Professional financial documents and modern office setting" 
                  className="w-80 h-96 object-cover rounded-lg shadow-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent rounded-lg"></div>
                <div className="absolute -bottom-4 -right-4 bg-accent-500 text-white p-3 rounded-full shadow-lg">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve Trust Bar */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-900 mb-4">
              Financial Clarity for Every Stage of Business
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">STARTUPS & ENTREPRENEURS</h3>
              <p className="text-text-secondary text-sm">Building financial foundations for rapid growth and investment readiness</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">ESTABLISHED SMALL BUSINESSES</h3>
              <p className="text-text-secondary text-sm">Optimizing operations and improving profitability through strategic insights</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">GROWING CORPORATIONS</h3>
              <p className="text-text-secondary text-sm">Sophisticated financial management and strategic oversight for scale</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Target className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">ACROSS DIVERSE INDUSTRIES</h3>
              <p className="text-text-secondary text-sm">Specialized expertise across technology, real estate, healthcare, and more</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Your Path from Books to Boardroom
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Scalable solutions designed to meet your needs today and support your growth tomorrow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: Bookkeeping & Accounting */}
            <Card className="group hover:shadow-large transition-all duration-300 border-0 shadow-soft">
              <CardHeader className="pb-4">
                <div className="text-4xl mb-4">📊</div>
                <CardTitle className="text-xl text-primary-900">Foundational Bookkeeping</CardTitle>
                <CardDescription className="text-text-secondary">
                  Flawless, stress-free bookkeeping that gives you a crystal-clear view of your financial health. We manage your daily transactions, reconcile accounts, and deliver timely reports you can actually understand.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-text-secondary">
                    <CheckCircle className="h-4 w-4 text-secondary-500 mr-2 flex-shrink-0" />
                    Daily transaction management
                  </li>
                  <li className="flex items-center text-sm text-text-secondary">
                    <CheckCircle className="h-4 w-4 text-secondary-500 mr-2 flex-shrink-0" />
                    Monthly bank reconciliation
                  </li>
                  <li className="flex items-center text-sm text-text-secondary">
                    <CheckCircle className="h-4 w-4 text-secondary-500 mr-2 flex-shrink-0" />
                    Crystal-clear financial reports
                  </li>
                </ul>
                <Button asChild className="w-full bg-primary-900 hover:bg-primary-800">
                  <Link to="/services/bookkeeping">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Column 2: Tax Services */}
            <Card className="group hover:shadow-large transition-all duration-300 border-0 shadow-soft">
              <CardHeader className="pb-4">
                <div className="text-4xl mb-4">📋</div>
                <CardTitle className="text-xl text-primary-900">Proactive Tax Strategy</CardTitle>
                <CardDescription className="text-text-secondary">
                  Go beyond simple tax filing. We build year-round tax strategies designed to maximize deductions, ensure compliance, and minimize your tax burden, saving you money and preventing surprises.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-text-secondary">
                    <CheckCircle className="h-4 w-4 text-secondary-500 mr-2 flex-shrink-0" />
                    Year-round tax planning
                  </li>
                  <li className="flex items-center text-sm text-text-secondary">
                    <CheckCircle className="h-4 w-4 text-secondary-500 mr-2 flex-shrink-0" />
                    Deduction maximization
                  </li>
                  <li className="flex items-center text-sm text-text-secondary">
                    <CheckCircle className="h-4 w-4 text-secondary-500 mr-2 flex-shrink-0" />
                    Compliance assurance
                  </li>
                </ul>
                <Button asChild className="w-full bg-primary-900 hover:bg-primary-800">
                  <Link to="/services/tax-services">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Column 3: CFO & Consulting */}
            <Card className="group hover:shadow-large transition-all duration-300 border-0 shadow-soft">
              <CardHeader className="pb-4">
                <div className="text-4xl mb-4">📈</div>
                <CardTitle className="text-xl text-primary-900">Strategic CFO & Consulting</CardTitle>
                <CardDescription className="text-text-secondary">
                  Leverage high-level financial intelligence to drive profitability. We provide forecasting, cash flow management, KPI tracking, and strategic guidance to help you make informed, data-driven boardroom decisions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-text-secondary">
                    <CheckCircle className="h-4 w-4 text-secondary-500 mr-2 flex-shrink-0" />
                    Financial modeling & forecasting
                  </li>
                  <li className="flex items-center text-sm text-text-secondary">
                    <CheckCircle className="h-4 w-4 text-secondary-500 mr-2 flex-shrink-0" />
                    Strategic KPI tracking
                  </li>
                  <li className="flex items-center text-sm text-text-secondary">
                    <CheckCircle className="h-4 w-4 text-secondary-500 mr-2 flex-shrink-0" />
                    Boardroom-ready insights
                  </li>
                </ul>
                <Button asChild className="w-full bg-primary-900 hover:bg-primary-800">
                  <Link to="/services/fractional-cfo">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-4">
              <Link to="/services">
                Explore Our Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Professional Photo */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div className="w-80 h-80 mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-large">
                  <img 
                    src="/images/cyndinew2.jpg" 
                    alt="Cyndi Dinh, CPA and Founder of Books & Boardroom"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-accent-500 text-white p-3 rounded-full shadow-lg">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
                Your Strategic Financial Partner
              </h2>
              <div className="prose prose-lg text-text-secondary mb-8">
                <p className="mb-4">
                  My name is Cyndi Dinh, and I founded Books & Boardroom on a simple principle: every business owner deserves financial clarity and a strategic partner to help them navigate growth.
                </p>
                <p className="mb-4">
                  With years of experience in both public and private accounting, I've seen firsthand how clean books can transform a business. My expertise lies in not only ensuring perfect compliance but also in identifying key tax strategies—like optimizing entity structure (LLC vs. S-Corp), maximizing depreciation, and leveraging tax credits—that directly impact your bottom line.
                </p>
                <p>
                  We're more than your accountants; we are a dedicated part of your team, committed to turning your financial data into your most powerful asset.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-8">
                {COMPANY_INFO.founder.credentials.map((credential, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary-100 text-primary-900">
                    {credential}
                  </Badge>
                ))}
              </div>

              <Button asChild className="bg-accent-500 hover:bg-accent-600 text-white">
                <a href={COMPANY_INFO.founder.linkedin} target="_blank" rel="noopener noreferrer">
                  Meet Cyndi on LinkedIn
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call-to-Action Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Stop wasting time on confusing spreadsheets and start making decisions with confidence. Schedule a complimentary consultation today to discuss your business goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-accent-500 hover:bg-accent-600 text-white text-lg px-8 py-4">
              <a href={CONTACT_INFO.calendly} target="_blank" rel="noopener noreferrer">
                Schedule a Consultation
                <Calendar className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-900 text-lg px-8 py-4">
              <Link to="/contact">
                Get in Touch
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}