import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, Users, Building2, TrendingUp, Target,
  Rocket, Factory, Briefcase, Globe, Calendar,
  CheckCircle, DollarSign, BarChart3, Shield
} from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

export default function WhoWeServePage() {
  const clientTypes = [
    {
      id: 'startups',
      icon: <Rocket className="h-12 w-12" />,
      title: 'Startups & Entrepreneurs',
      subtitle: 'Building Financial Foundations',
      description: 'Early-stage companies need clean books from day one to attract investors and scale effectively.',
      challenges: [
        'Limited resources for full-time financial staff',
        'Need for investor-ready financial statements',
        'Complex equity and funding structures',
        'Rapid growth requiring scalable systems'
      ],
      solutions: [
        'Essential bookkeeping with growth in mind',
        'Investor-ready financial reporting',
        'Entity structure optimization (LLC vs S-Corp)',
        'Scalable accounting systems setup'
      ],
      priceRange: '$400 - $2,000/month',
      bgColor: 'from-blue-100 to-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      id: 'small-business',
      icon: <Building2 className="h-12 w-12" />,
      title: 'Established Small Businesses',
      subtitle: 'Optimizing Operations',
      description: 'Growing businesses that need strategic financial guidance to improve profitability and efficiency.',
      challenges: [
        'Cash flow management during growth',
        'Tax planning and optimization',
        'Financial decision-making support',
        'Operational efficiency improvements'
      ],
      solutions: [
        'Strategic bookkeeping and reporting',
        'Cash flow forecasting and management',
        'Tax planning and preparation',
        'KPI tracking and analysis'
      ],
      priceRange: '$800 - $4,000/month',
      bgColor: 'from-green-100 to-green-200',
      iconColor: 'text-green-600'
    },
    {
      id: 'corporations',
      icon: <Factory className="h-12 w-12" />,
      title: 'Growing Corporations',
      subtitle: 'Strategic Financial Leadership',
      description: 'Established companies requiring sophisticated financial management and strategic oversight.',
      challenges: [
        'Complex financial operations',
        'Multiple stakeholders and reporting needs',
        'Strategic planning and forecasting',
        'Compliance and audit readiness'
      ],
      solutions: [
        'Fractional Controller/CFO services',
        'Advanced financial modeling',
        'Strategic planning support',
        'Audit preparation and compliance'
      ],
      priceRange: '$3,500 - $10,000+/month',
      bgColor: 'from-purple-100 to-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      id: 'industries',
      icon: <Globe className="h-12 w-12" />,
      title: 'Diverse Industries',
      subtitle: 'Specialized Expertise',
      description: 'We serve clients across multiple industries with specialized knowledge and tailored solutions.',
      challenges: [
        'Industry-specific accounting requirements',
        'Regulatory compliance needs',
        'Specialized tax considerations',
        'Unique operational metrics'
      ],
      solutions: [
        'Industry-specific expertise',
        'Tailored reporting and KPIs',
        'Compliance management',
        'Specialized tax strategies'
      ],
      priceRange: 'Custom pricing',
      bgColor: 'from-orange-100 to-orange-200',
      iconColor: 'text-orange-600'
    }
  ];

  const industries = [
    { name: 'Technology & SaaS', icon: '💻' },
    { name: 'Real Estate', icon: '🏢' },
    { name: 'Healthcare', icon: '🏥' },
    { name: 'Professional Services', icon: '🤝' },
    { name: 'Manufacturing', icon: '🏭' },
    { name: 'Retail & E-commerce', icon: '🛍️' },
    { name: 'Construction', icon: '🏗️' },
    { name: 'Restaurants & Hospitality', icon: '🍽️' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Who We Serve
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-4xl mx-auto">
            From ambitious startups to established corporations, we provide financial clarity and strategic guidance 
            tailored to your business stage and industry needs.
          </p>
        </div>
      </section>

      {/* Client Types Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
              Financial Solutions for Every Business Stage
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Our services scale with your business, providing the right level of financial support at each stage of your growth journey.
            </p>
          </div>

          <div className="space-y-16">
            {clientTypes.map((client, index) => (
              <Card key={client.id} className="overflow-hidden border-0 shadow-lg">
                <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  {/* Icon & Title */}
                  <div className={`lg:col-span-1 p-8 bg-gradient-to-br ${client.bgColor} flex items-center justify-center ${index % 2 === 1 ? 'lg:order-3' : ''}`}>
                    <div className="text-center">
                      <div className={`${client.iconColor} mb-4`}>
                        {client.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-primary-900 mb-2">{client.title}</h3>
                      <p className="text-lg font-medium text-accent-600">{client.subtitle}</p>
                      <div className="mt-4">
                        <Badge variant="secondary" className="bg-white text-primary-900">
                          {client.priceRange}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`lg:col-span-2 p-8 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <p className="text-lg text-text-secondary mb-6">
                      {client.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Challenges */}
                      <div>
                        <h4 className="text-lg font-semibold text-primary-900 mb-3 flex items-center">
                          <Target className="h-5 w-5 text-red-500 mr-2" />
                          Common Challenges
                        </h4>
                        <ul className="space-y-2">
                          {client.challenges.map((challenge, idx) => (
                            <li key={idx} className="flex items-start text-sm text-text-secondary">
                              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              {challenge}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Solutions */}
                      <div>
                        <h4 className="text-lg font-semibold text-primary-900 mb-3 flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          Our Solutions
                        </h4>
                        <ul className="space-y-2">
                          {client.solutions.map((solution, idx) => (
                            <li key={idx} className="flex items-start text-sm text-text-secondary">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                              {solution}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <Button asChild className="bg-accent-500 hover:bg-accent-600">
                        <Link to="/services">
                          View Services & Pricing
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
              Industries We Serve
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Our expertise spans across diverse industries, allowing us to understand your unique challenges and provide tailored financial solutions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <Card key={index} className="text-center border-0 shadow-soft hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">{industry.icon}</div>
                  <h3 className="font-semibold text-primary-900">{industry.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
              Proven Results Across All Client Types
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-primary-900 mb-2">$2M+</div>
              <p className="text-text-secondary">In tax savings identified for clients</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-primary-900 mb-2">95%</div>
              <p className="text-text-secondary">Client retention rate</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-primary-900 mb-2">40%</div>
              <p className="text-text-secondary">Average improvement in cash flow management</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-primary-900 mb-2">100%</div>
              <p className="text-text-secondary">Compliance and audit readiness</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Our Success Stories?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            No matter what stage your business is in or what industry you're in, we have the expertise to help you achieve financial clarity and growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-accent-500 hover:bg-accent-600 text-white text-lg px-8 py-4">
              <a href={CONTACT_INFO.calendly} target="_blank" rel="noopener noreferrer">
                Schedule Discovery Call
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