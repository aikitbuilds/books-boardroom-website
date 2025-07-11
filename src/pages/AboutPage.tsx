import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, Award, BookOpen, Building2, 
  CheckCircle, ExternalLink, Target, TrendingUp,
  Users, Shield, Calculator, Calendar
} from 'lucide-react';
import { CONTACT_INFO, COMPANY_INFO } from '@/lib/constants';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-white opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Our Approach to<br />
                <span className="text-accent-300">Financial Excellence</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100 leading-relaxed">
                We believe every business deserves a strategic financial partner who understands their unique challenges and growth objectives.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img 
                  src="/images/cyndinew4.jpg" 
                  alt="Cyndi Dinh - Founder of Books & Boardroom" 
                  className="w-80 h-96 object-cover rounded-lg shadow-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
              From Clean Books to Confident Decisions
            </h2>
            <p className="text-xl text-text-secondary max-w-4xl mx-auto">
              Our mission is simple: transform complex financial data into clear, actionable insights that drive business growth and profitability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-soft">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-primary-900">Clean Books</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Accurate, organized financial records that provide a crystal-clear view of your business health and performance.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-soft">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-primary-900">Strategic Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Data-driven analysis and forecasting that helps you identify opportunities and make informed business decisions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-soft">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-primary-900">Confident Decisions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  The clarity and confidence to make boardroom-level decisions that drive growth and maximize profitability.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Cyndi */}
      <section className="py-20 bg-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="relative">
                <img 
                  src="/images/cyndinew2.jpg" 
                  alt="Cyndi Dinh, CPA - Founder & CEO" 
                  className="w-full h-96 object-cover rounded-lg shadow-xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-accent-500 text-white p-4 rounded-full shadow-lg">
                  <Award className="w-8 h-8" />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
                Meet Cyndi Dinh, CPA
              </h2>
              <div className="space-y-4 text-text-secondary mb-6">
                <p>
                  With over a decade of experience in both public and private accounting, Cyndi founded Books & Boardroom 
                  with a clear vision: to provide business owners with the financial clarity and strategic guidance they 
                  need to scale their operations successfully.
                </p>
                <p>
                  Her expertise spans across multiple industries, from technology startups to established corporations, 
                  and she specializes in identifying key tax strategies that directly impact profitability—such as 
                  optimizing entity structure, maximizing depreciation benefits, and leveraging available tax credits.
                </p>
                <p>
                  Cyndi's approach goes beyond traditional accounting. She acts as a strategic partner, helping business 
                  owners understand their financial position and make data-driven decisions that support long-term growth.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {COMPANY_INFO.founder.credentials.map((credential, index) => (
                  <Badge key={index} variant="secondary" className="bg-accent-100 text-accent-800 p-2 text-center">
                    {credential}
                  </Badge>
                ))}
              </div>

              <Button asChild className="bg-accent-500 hover:bg-accent-600 text-white">
                <a href={COMPANY_INFO.founder.linkedin} target="_blank" rel="noopener noreferrer">
                  Connect on LinkedIn
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-text-secondary">
              The principles that guide every client relationship and service we provide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Integrity</h3>
              <p className="text-text-secondary text-sm">
                Transparent communication and ethical practices in all our client relationships and financial reporting.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Precision</h3>
              <p className="text-text-secondary text-sm">
                Meticulous attention to detail ensuring accuracy in every transaction and financial analysis.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Partnership</h3>
              <p className="text-text-secondary text-sm">
                We're not just service providers—we're strategic partners invested in your long-term success.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Growth</h3>
              <p className="text-text-secondary text-sm">
                Focused on helping businesses scale by providing insights that drive profitability and efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Texas Expertise */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
                Deep Texas Market Knowledge
              </h2>
              <div className="space-y-4 text-text-secondary">
                <p>
                  Based in Katy, Texas, we understand the unique business environment, tax implications, and regulatory 
                  requirements that affect Texas businesses. Our local expertise gives us insights into:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mr-3 mt-0.5 flex-shrink-0" />
                    Texas state tax laws and franchise tax requirements
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mr-3 mt-0.5 flex-shrink-0" />
                    Local industry trends across Austin, DFW, Houston, and San Antonio
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mr-3 mt-0.5 flex-shrink-0" />
                    Business formation and compliance requirements in Texas
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mr-3 mt-0.5 flex-shrink-0" />
                    Regional banking relationships and financial institutions
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mr-3 mt-0.5 flex-shrink-0" />
                    Economic incentives and tax credits available to Texas businesses
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-secondary-200 to-secondary-300 rounded-lg shadow-xl flex items-center justify-center">
                  <div className="text-center text-secondary-800">
                    <Building2 className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold">Texas-Based</h3>
                    <p className="text-lg">Local Expertise</p>
                    <p className="text-sm mt-2">Serving the Greater Houston Area</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
              Why Businesses Choose Books & Boardroom
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary-900 flex items-center">
                  <Calculator className="h-6 w-6 text-accent-600 mr-3" />
                  Value-Based Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  We price based on the value we deliver, not just hours worked. Our competitive Texas market 
                  pricing structure reflects the increasing strategic value from basic bookkeeping to CFO services.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary-900 flex items-center">
                  <TrendingUp className="h-6 w-6 text-accent-600 mr-3" />
                  Scalable Solutions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Our services grow with your business. Start with foundational bookkeeping and scale up to 
                  strategic CFO services as your needs evolve.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary-900 flex items-center">
                  <Award className="h-6 w-6 text-accent-600 mr-3" />
                  Proven Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Years of experience across diverse industries, with a track record of helping businesses 
                  optimize their financial operations and tax strategies.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary-900 flex items-center">
                  <Users className="h-6 w-6 text-accent-600 mr-3" />
                  Personal Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  You work directly with Cyndi and our experienced team. No junior staff or turnover 
                  concerns—just consistent, high-quality service.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience the Books & Boardroom Difference?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Schedule a complimentary consultation to learn how we can help transform your financial operations 
            and support your business growth objectives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-accent-500 hover:bg-accent-600 text-white text-lg px-8 py-4">
              <a href={CONTACT_INFO.calendly} target="_blank" rel="noopener noreferrer">
                Schedule Consultation
                <Calendar className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-900 text-lg px-8 py-4">
              <Link to="/contact">
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 