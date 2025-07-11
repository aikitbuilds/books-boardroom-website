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
  APP_DESCRIPTION, 
  APP_TAGLINE, 
  SERVICES, 
  CLIENT_SEGMENTS, 
  CONTACT_INFO,
  TESTIMONIALS,
  COMPANY_INFO
} from '@/lib/constants';

export default function BooksBoardroomHome() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-white opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 text-sm font-medium bg-accent-500 text-white">
              {APP_TAGLINE}
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              From Clean Books to<br />
              <span className="text-accent-300">Confident Decisions</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-4xl mx-auto leading-relaxed">
              We handle your complex finances so you can focus on what you do best: growing your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent-500 hover:bg-accent-600 text-white text-lg px-8 py-4">
                <Link to="/schedule">
                  Schedule Your Financial Roadmap
                  <Calendar className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-900 text-lg px-8 py-4">
                <Link to="/services">
                  Explore Our Services
                </Link>
              </Button>
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
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Startups & Entrepreneurs</h3>
              <p className="text-text-secondary text-sm">Building financial foundations for growth</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Established Small Businesses</h3>
              <p className="text-text-secondary text-sm">Optimizing operations for profitability</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Growing Corporations</h3>
              <p className="text-text-secondary text-sm">Strategic financial leadership at scale</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Across Diverse Industries</h3>
              <p className="text-text-secondary text-sm">Specialized expertise for your sector</p>
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
                    Monthly financial statements
                  </li>
                  <li className="flex items-center text-sm text-text-secondary">
                    <CheckCircle className="h-4 w-4 text-secondary-500 mr-2 flex-shrink-0" />
                    Bank reconciliation
                  </li>
                  <li className="flex items-center text-sm text-text-secondary">
                    <CheckCircle className="h-4 w-4 text-secondary-500 mr-2 flex-shrink-0" />
                    Accounts payable/receivable
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
                    Entity structure optimization
                  </li>
                  <li className="flex items-center text-sm text-text-secondary">
                    <CheckCircle className="h-4 w-4 text-secondary-500 mr-2 flex-shrink-0" />
                    Deduction maximization
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
                    KPI tracking & analysis
                  </li>
                  <li className="flex items-center text-sm text-text-secondary">
                    <CheckCircle className="h-4 w-4 text-secondary-500 mr-2 flex-shrink-0" />
                    Strategic planning support
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
            <Button asChild size="lg" className="bg-accent-500 hover:bg-accent-600 text-white">
              <Link to="/services">
                Explore Our Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Photo */}
            <div className="text-center lg:text-left">
              <div className="relative inline-block">
                <div className="w-80 h-80 mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-large">
                  <img 
                    src="/images/cyndinew3.jpg" 
                    alt="Cyndi Dinh, CPA and Founder of Books & Boardroom"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/cyndinew3.jpg";
                    }}
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

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-text-secondary">
              Real results from real business owners who trust Books & Boardroom
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial) => (
              <Card key={testimonial.id} className="relative overflow-hidden border-0 shadow-soft hover:shadow-large transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                      <img 
                        src={`/images/${testimonial.id}.jpg`}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/images/cyndinew3.jpg";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-primary-900">{testimonial.name}</h4>
                      <p className="text-sm text-text-secondary">{testimonial.title}</p>
                      {testimonial.website ? (
                        <a 
                          href={testimonial.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-accent-600 hover:text-accent-700 flex items-center"
                        >
                          {testimonial.company}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      ) : (
                        <p className="text-sm text-text-secondary">{testimonial.company}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-text-secondary italic">
                    "{testimonial.quote}"
                  </blockquote>
                </CardContent>
                {testimonial.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-accent-500 text-white">Featured</Badge>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
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
              <Link to="/schedule">
                Schedule a Consultation
                <Calendar className="ml-2 h-5 w-5" />
              </Link>
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

      {/* Footer */}
      <footer className="bg-primary-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">{APP_NAME}</h3>
              <p className="text-primary-200 mb-6 max-w-md">
                {APP_DESCRIPTION}
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-accent-500" />
                  <span className="text-primary-200">
                    {CONTACT_INFO.address.street}, {CONTACT_INFO.address.city}, {CONTACT_INFO.address.state} {CONTACT_INFO.address.zip}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-accent-500" />
                  <a href={`tel:${CONTACT_INFO.phone}`} className="text-primary-200 hover:text-white transition-colors">
                    {CONTACT_INFO.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-accent-500" />
                  <a href={`mailto:${CONTACT_INFO.email}`} className="text-primary-200 hover:text-white transition-colors">
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-primary-200">
                <li><Link to="/services/bookkeeping" className="hover:text-white transition-colors">Bookkeeping</Link></li>
                <li><Link to="/services/tax-services" className="hover:text-white transition-colors">Tax Services</Link></li>
                <li><Link to="/services/accounting-consulting" className="hover:text-white transition-colors">Consulting</Link></li>
                <li><Link to="/services/fractional-controller" className="hover:text-white transition-colors">Controller</Link></li>
                <li><Link to="/services/fractional-cfo" className="hover:text-white transition-colors">CFO</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-primary-200">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Our Approach</Link></li>
                <li><Link to="/who-we-serve" className="hover:text-white transition-colors">Who We Serve</Link></li>
                <li><Link to="/resources" className="hover:text-white transition-colors">Resources</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-300 text-center md:text-left">
              &copy; 2024 {APP_NAME}. All Rights Reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <Button asChild size="sm" className="bg-accent-500 hover:bg-accent-600 text-white">
                <Link to="/schedule">
                  Schedule a Consultation
                  <Calendar className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}