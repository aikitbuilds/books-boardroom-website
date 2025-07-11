import React, { useState, useEffect } from 'react';
import { ChevronRight, Upload, Brain, BarChart3, Clock, Target, Lightbulb, Shield, Menu, X, ArrowRight, Sparkles, FileText, TrendingUp, Zap, Star, Calendar, DollarSign, Users, PieChart, Activity, CheckCircle } from 'lucide-react';

const BooksboardroomLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => (prev < 120 ? prev + 1 : 0));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "E-commerce Store Owner",
      company: "Bloom Boutique",
      image: "👩‍💼",
      quote: "I went from spending 15 hours a month on bookkeeping to just 30 minutes. The AI catches things I would have missed!",
      savings: "14.5 hours/month saved",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      name: "Marcus Thompson",
      role: "YouTube Content Creator",
      company: "Tech Reviews Daily",
      image: "👨‍💻",
      quote: "As a creator, I need to focus on content, not spreadsheets. BooksBoard Room handles all my revenue streams automatically.",
      savings: "20 hours/month saved",
      gradient: "from-red-600 to-orange-600"
    },
    {
      name: "Elena Rodriguez",
      role: "Restaurant Owner",
      company: "Casa Elena",
      image: "👩‍🍳",
      quote: "Managing restaurant finances was a nightmare. Now I get real-time insights on food costs and profit margins instantly.",
      savings: "25 hours/month saved",
      gradient: "from-green-600 to-teal-600"
    },
    {
      name: "David Park",
      role: "Freelance Designer",
      company: "Park Creative Studio",
      image: "🎨",
      quote: "Tax season used to terrify me. Now everything is organized and categorized perfectly. Worth every penny!",
      savings: "30 hours/quarter saved",
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      name: "Aisha Patel",
      role: "Fitness Coach",
      company: "FitLife Personal Training",
      image: "💪",
      quote: "I can finally see which services are most profitable and where my money goes. It's like having a CFO on demand.",
      savings: "18 hours/month saved",
      gradient: "from-yellow-600 to-red-600"
    }
  ];

  const timeSavingsData = [
    { task: "Manual Entry", before: 8, after: 0.5 },
    { task: "Categorization", before: 4, after: 0 },
    { task: "Reconciliation", before: 6, after: 1 },
    { task: "Report Generation", before: 3, after: 0.5 },
    { task: "Tax Prep", before: 12, after: 2 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/90 backdrop-blur-md border-b border-slate-700' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-xl font-bold text-white">
                BooksBoard Room
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('how-it-works')} className="text-slate-300 hover:text-teal-400 transition-colors font-medium">
                How It Works
              </button>
              <button onClick={() => scrollToSection('features')} className="text-slate-300 hover:text-teal-400 transition-colors font-medium">
                Features
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="text-slate-300 hover:text-teal-400 transition-colors font-medium">
                Testimonials
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-slate-300 hover:text-teal-400 transition-colors font-medium">
                Pricing
              </button>
              <a href="https://sps.ainx.pro" className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg hover:shadow-teal-500/25 hover:scale-105 transition-all duration-300">
                Start Free Trial
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800/95 backdrop-blur-md border-t border-slate-700">
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left text-slate-300 hover:text-teal-400 font-medium py-2">
                How It Works
              </button>
              <button onClick={() => scrollToSection('features')} className="block w-full text-left text-slate-300 hover:text-teal-400 font-medium py-2">
                Features
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="block w-full text-left text-slate-300 hover:text-teal-400 font-medium py-2">
                Testimonials
              </button>
              <button onClick={() => scrollToSection('pricing')} className="block w-full text-left text-slate-300 hover:text-teal-400 font-medium py-2">
                Pricing
              </button>
              <a href="https://sps.ainx.pro" className="block bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-full font-medium text-center">
                Start Free Trial
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Interactive Dashboard */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-900/50 to-purple-900/50 border border-teal-500/30 text-teal-400 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in backdrop-blur-sm">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>AI That Works While You Sleep</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Stop Wasting
                <span className="relative">
                  <span className="bg-gradient-to-r from-teal-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                    {' '}{timeSpent} Hours
                  </span>
                </span>
                <span className="block text-slate-300">on Bookkeeping</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-xl">
                Join 2,547 business owners who automated their finances and got their life back. Real-time insights, zero manual work.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8">
                <a href="https://sps.ainx.pro" className="group relative bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:shadow-lg hover:shadow-teal-500/25 hover:scale-105 transition-all duration-300 flex items-center space-x-2 overflow-hidden">
                  <span className="relative z-10">See Your Dashboard Demo</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                </a>
                <p className="text-sm text-slate-500">
                  No credit card required • 5-minute setup
                </p>
              </div>

              {/* Live Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-md">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-3">
                  <p className="text-2xl font-bold text-teal-400">847</p>
                  <p className="text-xs text-slate-400">Hours saved today</p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-3">
                  <p className="text-2xl font-bold text-purple-400">$2.4M</p>
                  <p className="text-xs text-slate-400">Processed today</p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-3">
                  <p className="text-2xl font-bold text-pink-400">99.9%</p>
                  <p className="text-xs text-slate-400">Accuracy rate</p>
                </div>
              </div>
            </div>
            
            {/* Right Visual - Live Dashboard Preview */}
            <div className="relative lg:pl-8">
              {/* Main Dashboard Container */}
              <div className="relative">
                <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl p-6 transform hover:scale-[1.02] transition-transform duration-300">
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Live Financial Dashboard</h3>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-xs text-green-400">Real-time</span>
                    </div>
                  </div>
                  
                  {/* Revenue Chart */}
                  <div className="mb-6">
                    <p className="text-sm text-slate-400 mb-3">Monthly Revenue Trend</p>
                    <div className="flex items-end space-x-2 h-32">
                      {[65, 45, 80, 95, 75, 90, 110, 85, 95, 120, 105, 130].map((height, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-teal-500 to-teal-300 rounded-t-lg hover:from-teal-400 hover:to-teal-200 transition-all duration-300 cursor-pointer relative group"
                          style={{
                            height: `${height}%`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            ${(height * 500).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                      <span>Jan</span>
                      <span>Dec</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 border border-green-700/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-green-400">Total Revenue</p>
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      </div>
                      <p className="text-2xl font-bold text-white">$127,482</p>
                      <p className="text-xs text-green-400 flex items-center mt-1">
                        <ArrowRight className="w-3 h-3 rotate-[-45deg]" />
                        <span>+23.5% from last month</span>
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-700/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-purple-400">Net Profit</p>
                        <DollarSign className="w-4 h-4 text-purple-400" />
                      </div>
                      <p className="text-2xl font-bold text-white">$47,923</p>
                      <p className="text-xs text-purple-400 flex items-center mt-1">
                        <ArrowRight className="w-3 h-3 rotate-[-45deg]" />
                        <span>37.6% margin</span>
                      </p>
                    </div>
                  </div>

                  {/* Expense Breakdown */}
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <p className="text-sm text-slate-400 mb-3">Expense Categories</p>
                    <div className="space-y-2">
                      {[
                        { name: 'Operations', percent: 35, color: 'from-blue-500 to-blue-600' },
                        { name: 'Marketing', percent: 25, color: 'from-purple-500 to-purple-600' },
                        { name: 'Payroll', percent: 30, color: 'from-teal-500 to-teal-600' },
                        { name: 'Other', percent: 10, color: 'from-pink-500 to-pink-600' }
                      ].map((category, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-300">{category.name}</span>
                            <span className="text-slate-400">{category.percent}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${category.color} h-2 rounded-full transition-all duration-1000`}
                              style={{ width: `${category.percent}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Feature Badges */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-medium animate-float">
                Auto-categorized
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium animate-float-delayed">
                Bank-synced
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Time Savings Visualization */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
              Your Time Back, Visualized
            </h2>
            <p className="text-xl text-slate-400">See exactly how much time you'll save each month</p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
            <div className="space-y-6">
              {timeSavingsData.map((item, index) => (
                <div key={index} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium text-white">{item.task}</h3>
                    <div className="text-right">
                      <span className="text-slate-400 line-through text-sm">{item.before}h</span>
                      <span className="text-teal-400 font-bold ml-2">{item.after}h</span>
                    </div>
                  </div>
                  <div className="relative h-8 bg-slate-700 rounded-full overflow-hidden">
                    <div className="absolute inset-0 flex">
                      <div
                        className="bg-gradient-to-r from-red-500 to-red-600 transition-all duration-1000 group-hover:opacity-50"
                        style={{ width: `${(item.before / 12) * 100}%` }}
                      ></div>
                    </div>
                    <div className="absolute inset-0 flex">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-1000"
                        style={{ width: `${(item.after / 12) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-3xl font-bold text-white">
                Total: <span className="text-teal-400">29 hours saved</span> every month
              </p>
              <p className="text-slate-400 mt-2">That's almost a full work week back in your life!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Real Results from Real Business Owners
            </h2>
            <p className="text-xl text-slate-400">From solopreneurs to growing businesses</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-teal-500/50 transition-all duration-300 cursor-pointer ${
                  activeTestimonial === index ? 'ring-2 ring-teal-500 scale-105' : ''
                }`}
                onClick={() => setActiveTestimonial(index)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{testimonial.image}</div>
                    <div>
                      <h3 className="font-bold text-white">{testimonial.name}</h3>
                      <p className="text-xs text-slate-400">{testimonial.role}</p>
                      <p className="text-xs text-slate-500">{testimonial.company}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-300 mb-4 italic">"{testimonial.quote}"</p>
                <div className={`inline-flex items-center space-x-2 bg-gradient-to-r ${testimonial.gradient} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                  <Clock className="w-3 h-3" />
                  <span>{testimonial.savings}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Client Logos/Trust Section */}
          <div className="text-center">
            <p className="text-sm text-slate-500 mb-4">Trusted by businesses across industries</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
              <div className="text-slate-400">E-commerce</div>
              <div className="text-slate-400">•</div>
              <div className="text-slate-400">Content Creators</div>
              <div className="text-slate-400">•</div>
              <div className="text-slate-400">Restaurants</div>
              <div className="text-slate-400">•</div>
              <div className="text-slate-400">Freelancers</div>
              <div className="text-slate-400">•</div>
              <div className="text-slate-400">Coaches</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              From Chaos to Clarity in 3 Steps
            </h2>
            <p className="text-xl text-slate-400">Our AI handles the heavy lifting</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Upload className="w-8 h-8" />,
                title: "Connect Your Accounts",
                description: "Securely link your bank accounts, credit cards, and payment processors. We support 12,000+ institutions.",
                features: ["Bank-level encryption", "Read-only access", "Auto-sync daily"],
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: <Brain className="w-8 h-8" />,
                title: "AI Categorizes Everything",
                description: "Our AI learns your business and automatically categorizes transactions with 99.9% accuracy.",
                features: ["Smart categorization", "Duplicate detection", "Receipt matching"],
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Get Instant Insights",
                description: "See real-time dashboards, profit margins, cash flow forecasts, and tax-ready reports.",
                features: ["Live dashboards", "Custom reports", "Tax optimization"],
                color: "from-teal-500 to-teal-600"
              }
            ].map((step, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-teal-500/50 transition-all duration-300">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${step.color} rounded-xl text-white mb-6 group-hover:scale-110 transition-transform`}>
                    {step.icon}
                  </div>
                  <div className="absolute top-4 right-4 text-6xl font-bold text-slate-700/30">
                    {index + 1}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{step.title}</h3>
                  <p className="text-slate-400 mb-4">{step.description}</p>
                  <ul className="space-y-2">
                    {step.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-2 text-sm text-slate-500">
                        <CheckCircle className="w-4 h-4 text-teal-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to Master Your Finances
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Real-Time Sync",
                description: "Your finances update automatically every hour, 24/7.",
                gradient: "from-orange-400 to-pink-500"
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: "99.9% Accuracy",
                description: "AI trained on millions of transactions for perfect categorization.",
                gradient: "from-green-400 to-teal-500"
              },
              {
                icon: <PieChart className="w-6 h-6" />,
                title: "Visual Analytics",
                description: "Beautiful charts that make complex data instantly understandable.",
                gradient: "from-purple-400 to-indigo-500"
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Bank-Level Security",
                description: "256-bit encryption and SOC2 compliance keep your data safe.",
                gradient: "from-blue-400 to-cyan-500"
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Multi-User Access",
                description: "Share access with your accountant or business partners.",
                gradient: "from-red-400 to-orange-500"
              },
              {
                icon: <Calendar className="w-6 h-6" />,
                title: "Tax Ready",
                description: "Export everything your CPA needs in one click.",
                gradient: "from-teal-400 to-green-500"
              },
              {
                icon: <Activity className="w-6 h-6" />,
                title: "Cash Flow Forecast",
                description: "AI predicts your cash position 30-90 days out.",
                gradient: "from-indigo-400 to-purple-500"
              },
              {
                icon: <FileText className="w-6 h-6" />,
                title: "Custom Reports",
                description: "Build any report you need with our drag-and-drop builder.",
                gradient: "from-pink-400 to-red-500"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-slate-800/80 transition-all duration-300 border border-slate-700 hover:border-transparent"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-lg text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple Pricing That Scales With You
            </h2>
            <p className="text-xl text-slate-400">Choose the plan that fits your business needs</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Basic",
                price: "$200",
                annualPrice: "$1,920",
                description: "Perfect for small businesses getting started",
                features: [
                  "Up to 5 users",
                  "Basic CRM features",
                  "File management",
                  "Email support",
                  "Standard reporting",
                  "Mobile app access"
                ],
                gradient: "from-slate-600 to-slate-700",
                popular: false
              },
              {
                name: "Professional",
                price: "$450",
                annualPrice: "$4,320",
                description: "For growing businesses and teams",
                features: [
                  "Up to 25 users",
                  "Advanced CRM features",
                  "Priority support",
                  "Advanced analytics",
                  "Custom integrations",
                  "Team collaboration",
                  "Advanced reporting",
                  "API access"
                ],
                gradient: "from-teal-500 to-teal-600",
                popular: true
              },
              {
                name: "Enterprise",
                price: "$700",
                annualPrice: "$6,720",
                description: "For established businesses",
                features: [
                  "Unlimited users",
                  "Enterprise CRM",
                  "24/7 phone support",
                  "Custom development",
                  "Advanced security",
                  "White-label options",
                  "Dedicated account manager",
                  "SLA guarantees"
                ],
                gradient: "from-purple-600 to-purple-700",
                popular: false
              }
            ].map((plan, index) => (
              <div key={index} className="relative group">
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-1 rounded-full text-sm font-medium z-10">
                    MOST POPULAR
                  </div>
                )}
                <div className={`relative bg-slate-800/80 backdrop-blur-sm border ${plan.popular ? 'border-teal-500' : 'border-slate-700'} rounded-2xl p-8 hover:scale-105 transition-all duration-300`}>
                  <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400">/ month</span>
                    <div className="text-sm text-teal-400 mt-1">
                      {plan.annualPrice}/year (Save 20%)
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://sps.ainx.pro"
                    className={`block w-full bg-gradient-to-r ${plan.gradient} text-white text-center py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300`}
                  >
                    {plan.popular ? 'Start Free Trial' : 'Get Started'}
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-slate-400">All plans include a 14-day free trial. Annual billing saves 20%.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Join 2,547 Happy Business Owners?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Start your free trial and see your complete financial picture in under 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="https://sps.ainx.pro" className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:shadow-xl hover:shadow-teal-500/25 hover:scale-105 transition-all duration-300 group">
              <span>Start Your Free Trial</span>
              <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </a>
            <p className="text-sm text-slate-400">No credit card required • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">BooksBoard Room</span>
              </div>
              <p className="text-sm text-slate-400">AI-powered bookkeeping that gives you time back.</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-teal-400 text-sm">Features</a></li>
                <li><a href="#" className="text-slate-400 hover:text-teal-400 text-sm">Pricing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-teal-400 text-sm">Security</a></li>
                <li><a href="#" className="text-slate-400 hover:text-teal-400 text-sm">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-teal-400 text-sm">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-teal-400 text-sm">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-teal-400 text-sm">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-teal-400 text-sm">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-teal-400 text-sm">Help Center</a></li>
                <li><a href="#" className="text-slate-400 hover:text-teal-400 text-sm">API Docs</a></li>
                <li><a href="#" className="text-slate-400 hover:text-teal-400 text-sm">Status</a></li>
                <li><a href="#" className="text-slate-400 hover:text-teal-400 text-sm">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400">© 2025 BooksBoard Room. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-teal-400 text-sm">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-teal-400 text-sm">Terms of Service</a>
              <span className="text-slate-600 text-sm">Powered by AI Ninjas</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes gradient {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 4s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BooksboardroomLanding;