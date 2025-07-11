// Books & Boardroom - Brand Constants
export const APP_NAME = "Books & Boardroom";
export const APP_DESCRIPTION = "From foundational financial data to high-level strategic decision-making";
export const APP_TAGLINE = "Where Books Meet Boardroom";

// Color Palette
export const COLORS = {
  // Primary Color (Trust & Stability)
  primary: {
    main: '#0A2342', // Deep Navy Blue
    light: '#1a3a5a',
    dark: '#061626',
    contrast: '#ffffff'
  },
  // Secondary Color (Growth & Engagement)
  secondary: {
    main: '#2CA58D', // Muted Teal
    light: '#4db8a3',
    dark: '#1e8a73',
    contrast: '#ffffff'
  },
  // Accent Color (Value & Action) - Light Gold
  accent: {
    main: '#B88B4A', // Soft Gold/Ochre
    light: '#c9a06b',
    dark: '#a67a3a',
    contrast: '#ffffff'
  },
  // Background (Stress Reduction)
  background: {
    main: '#F7F7F7', // Light Gray
    paper: '#ffffff',
    dark: '#e8e8e8'
  },
  // Text Colors
  text: {
    primary: '#333333', // Dark Gray
    secondary: '#666666',
    disabled: '#999999',
    inverse: '#ffffff'
  },
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6'
};

// Navigation Structure
export const NAVIGATION = {
  home: { label: 'Home', path: '/' },
  services: { 
    label: 'Services', 
    path: '/services',
    dropdown: [
      { label: 'Bookkeeping', path: '/services/bookkeeping' },
      { label: 'Tax Services', path: '/services/tax-services' },
      { label: 'Accounting Consulting', path: '/services/accounting-consulting' },
      { label: 'Fractional Controller', path: '/services/fractional-controller' },
      { label: 'Fractional CFO', path: '/services/fractional-cfo' }
    ]
  },
  whoWeServe: { label: 'Who We Serve', path: '/who-we-serve' },
  about: { label: 'Our Approach', path: '/about' },
  resources: { label: 'Resources', path: '/resources' },
  contact: { label: 'Contact', path: '/contact' },
  schedule: { label: 'Schedule', path: '/schedule' }
};

// Services with Updated Texas Market Pricing
export const SERVICES = [
  {
    id: 'bookkeeping',
    title: 'Foundational Bookkeeping',
    subtitle: 'The "Books"',
    description: 'Flawless, stress-free bookkeeping that gives you a crystal-clear view of your financial health. We manage your daily transactions, reconcile accounts, and deliver timely reports you can actually understand.',
    icon: '📊',
    pricing: {
      essentials: {
        name: 'Essentials Package',
        subtitle: 'The "Books"',
        price: '$400 - $800',
        period: 'month',
        description: 'For solopreneurs and very small businesses with low transaction volume',
        features: [
          'Bank/credit card transaction categorization (up to 75-100 transactions)',
          'Monthly bank reconciliations',
          'Standard monthly reports (P&L, Balance Sheet)',
          'Basic financial health monitoring'
        ],
        ideal: 'Solopreneurs, very small businesses with low transaction volume'
      },
      growth: {
        name: 'Growth Package',
        subtitle: 'The "Bridge"',
        price: '$800 - $2,000',
        period: 'month',
        description: 'For growing small businesses with more complex operations',
        features: [
          'Everything in Essentials',
          'Up to 250 transactions',
          'Accounts payable & receivable management',
          'Payroll support',
          'Customized reporting',
          'Quarterly check-in call'
        ],
        ideal: 'Growing small businesses, more complex operations'
      },
      strategic: {
        name: 'Strategic Package',
        subtitle: 'The "Boardroom Prep"',
        price: '$2,000 - $4,000',
        period: 'month',
        description: 'For established businesses needing comprehensive oversight',
        features: [
          'Everything in Growth',
          'Unlimited transactions',
          'Cash flow forecasting',
          'Budget vs. actual analysis',
          'Monthly strategy call',
          'Priority support'
        ],
        ideal: 'Established businesses needing more oversight'
      }
    }
  },
  {
    id: 'tax-services',
    title: 'Proactive Tax Strategy',
    description: 'Go beyond simple tax filing. We build year-round tax strategies designed to maximize deductions, ensure compliance, and minimize your tax burden, saving you money and preventing surprises.',
    icon: '📋',
    pricing: {
      individual: {
        name: 'Individual Tax Prep',
        price: '$450 - $900+',
        period: 'filing',
        description: 'Form 1040 preparation with increasing complexity',
        features: [
          'Basic 1040 preparation',
          'Schedule C for small business',
          'Rental property reporting (K-1s)',
          'Multiple state filings',
          'Complex individual situations'
        ],
        note: 'Price increases with complexity like Schedule C for small business, K-1s, rental properties'
      },
      business: {
        name: 'Business Tax Prep',
        price: '$1,200 - $3,500+',
        period: 'filing',
        description: 'Form 1120S, 1065 depending on complexity',
        features: [
          'Business entity tax preparation',
          'Multi-state tax compliance',
          'Complex business structures',
          'Partnership and S-Corp returns',
          'Audit support included'
        ],
        note: 'Depends heavily on the quality of the books and complexity of the business'
      },
      planning: {
        name: 'Tax Planning & Strategy',
        price: '$200 - $400',
        period: 'hour',
        description: 'Year-round advisory service to minimize tax burden',
        features: [
          'Quarterly tax planning sessions',
          'Entity structure optimization',
          'Deduction maximization strategies',
          'Tax law change updates',
          'Proactive compliance guidance'
        ],
        note: 'Separate advisory service for year-round tax optimization, not just year-end filing'
      }
    }
  },
  {
    id: 'accounting-consulting',
    title: 'Strategic CFO & Consulting',
    description: 'Leverage high-level financial intelligence to drive profitability. We provide forecasting, cash flow management, KPI tracking, and strategic guidance to help you make informed, data-driven boardroom decisions.',
    icon: '💡',
    pricing: {
      hourly: {
        name: 'Consulting Services',
        price: '$150 - $300',
        period: 'hour',
        description: 'Project-based or hourly consulting',
        features: [
          'QuickBooks cleanup and setup',
          'Financial system implementation',
          'Process optimization',
          'Internal controls development',
          'Financial analysis projects'
        ],
        uses: 'One-off projects like cleaning up messy QuickBooks files, setting up a new accounting system, or specific financial analysis projects'
      }
    }
  },
  {
    id: 'fractional-controller',
    title: 'Fractional Controller',
    description: 'Part-time financial leadership to manage your accounting operations. We oversee your financial close process, manage accounting staff, and ensure audit readiness. This is a significant step up from bookkeeping - you are managing the accounting function.',
    icon: '🎯',
    pricing: {
      retainer: {
        name: 'Controller Services',
        price: '$3,500 - $7,000',
        period: 'month',
        description: 'High-level oversight for businesses needing financial management',
        features: [
          'All bookkeeping and reporting oversight',
          'Managing accounting staff (if any)',
          'Implementing internal controls',
          'Overseeing financial close process',
          'Detailed budget and variance analysis',
          'Cash flow management',
          'Ensuring audit readiness'
        ],
        ideal: 'Businesses that need high-level oversight but can\'t afford a full-time $120k+ controller'
      }
    }
  },
  {
    id: 'fractional-cfo',
    title: 'Fractional CFO',
    subtitle: 'The "Boardroom" Service',
    description: 'Strategic financial leadership to drive growth and profitability. We provide financial modeling, KPI tracking, strategic planning, and act as your financial liaison to banks and investors. You are a key part of the leadership team, focused on the future.',
    icon: '📈',
    pricing: {
      retainer: {
        name: 'CFO Services',
        price: '$5,000 - $10,000+',
        period: 'month',
        description: 'Strategic financial leadership for growth-focused companies',
        features: [
          'All controller functions oversight',
          'Long-term financial modeling',
          'Key performance indicator (KPI) tracking',
          'Strategic planning and analysis',
          'Fundraising support (pitch deck financials)',
          'M&A due diligence support',
          'Board and investor reporting',
          'Banking and investor relations'
        ],
        ideal: 'Companies poised for major growth, seeking investment, or needing high-level financial strategy'
      }
    }
  }
];

// Updated Pricing Disclaimer
export const PRICING_DISCLAIMER = `These are competitive estimates for the Texas market (Austin, DFW, Houston, San Antonio). Rates can vary based on experience, client complexity (number of transactions, accounts, employees), and specific industry. The key is to price based on value delivered, not just hours worked. This structure reflects the increasing strategic value from bookkeeping to CFO services.`;

// Client Segments
export const CLIENT_SEGMENTS = [
  {
    id: 'startups-entrepreneurs',
    title: 'Startups & Entrepreneurs',
    description: 'Scaling businesses that need financial infrastructure to support growth and attract investment.',
    challenges: [
      'Establishing financial processes from scratch',
      'Managing cash flow during rapid growth phases',
      'Preparing financials for funding rounds',
      'Building financial credibility with investors',
      'Optimizing entity structure for tax efficiency'
    ],
    solutions: [
      'Foundational bookkeeping setup',
      'Cash flow forecasting and management',
      'Investor-ready financial reporting',
      'Entity structure consulting',
      'Growth-focused financial strategy'
    ]
  },
  {
    id: 'established-small-businesses',
    title: 'Established Small Businesses',
    description: 'Mature businesses looking to optimize operations, improve profitability, and plan for the future.',
    challenges: [
      'Improving profit margins and operational efficiency',
      'Streamlining financial processes',
      'Strategic planning for expansion',
      'Succession planning and exit strategies',
      'Managing complex tax situations'
    ],
    solutions: [
      'Process optimization and automation',
      'Profitability analysis and improvement',
      'Strategic financial planning',
      'Advanced tax planning strategies',
      'Fractional CFO services'
    ]
  },
  {
    id: 'growing-corporations',
    title: 'Growing Corporations',
    description: 'Larger organizations requiring sophisticated financial management and strategic oversight.',
    challenges: [
      'Complex multi-entity accounting',
      'Advanced financial reporting requirements',
      'Strategic financial planning at scale',
      'Investor and board reporting',
      'Merger and acquisition support'
    ],
    solutions: [
      'Multi-entity financial management',
      'Advanced reporting and analytics',
      'Strategic CFO services',
      'Board-ready financial presentations',
      'M&A financial due diligence'
    ]
  },
  {
    id: 'diverse-industries',
    title: 'Across Diverse Industries',
    description: 'Specialized expertise across multiple industries with unique financial challenges.',
    industries: [
      'Technology and Software',
      'Real Estate and Construction',
      'Healthcare and Professional Services',
      'E-commerce and Retail',
      'Manufacturing and Distribution',
      'Consulting and Service Businesses'
    ],
    solutions: [
      'Industry-specific accounting practices',
      'Specialized tax strategies',
      'Regulatory compliance expertise',
      'Industry benchmarking and KPIs',
      'Sector-specific financial planning'
    ]
  }
];

// Contact Information - Updated with direct line
export const CONTACT_INFO = {
  email: 'booksboardroom@gmail.com',
  phone: '(281) 766-7866',
  directLine: '(281) 685-3250',
  address: {
    street: '23015 Colonial Parkway, Suite A108',
    city: 'Katy',
    state: 'TX',
    zip: '77449'
  },
  hours: 'Monday - Friday: 9:00 AM - 6:00 PM CST',
  calendly: 'https://calendly.com/dinhcyndi'
};

// Social Media
export const SOCIAL_MEDIA = {
  linkedin: 'https://linkedin.com/in/cyndidinh'
};

// Testimonials including SmartView Solutions
export const TESTIMONIALS = [
  {
    id: 'smartview-solutions',
    name: 'Mike Nguyen',
    title: 'Owner',
    company: 'SmartView Solutions',
    website: 'https://smartview-solutions.biz/',
    logo: '/images/smartview-logo.png',
    image: '/images/smartview-solutions.jpg',
    quote: "Books & Boardroom has been a game-changer for our business. Their expertise in financial strategy and attention to detail have given us the clarity and confidence to scale SmartView Solutions. I highly recommend Cyndi and her team to any business owner who wants to focus on growth, not spreadsheets.",
    rating: 5,
    featured: true
  },
  {
    id: 'testimonial-2',
    name: 'Sarah Chen',
    title: 'CEO',
    company: 'Tech Innovations LLC',
    image: '/images/testimonial-2.jpg',
    quote: "Working with Books & Boardroom transformed how we handle our finances. Their proactive tax strategies saved us thousands, and their monthly reports give us the insights we need to make smart business decisions.",
    rating: 5,
    featured: false
  },
  {
    id: 'testimonial-3',
    name: 'David Rodriguez',
    title: 'Founder',
    company: 'Rodriguez Construction',
    image: '/images/testimonial-3.jpg',
    quote: "Cyndi and her team took our chaotic bookkeeping and turned it into a strategic advantage. We now have clear visibility into our cash flow and profitability by project. Highly recommended!",
    rating: 5,
    featured: false
  }
];

// Blog Posts
export const BLOG_POSTS = [
  {
    id: 'llc-vs-scorp',
    title: 'LLC vs. S-Corp: Choosing the Right Business Structure for Your Texas Startup',
    excerpt: 'Understand the key differences in liability, taxation, and administrative requirements to make the best choice for your business.',
    author: 'Cyndi Dinh',
    date: '2024-01-15',
    readTime: '8 min read',
    image: '/images/blog-llc-scorp.jpg',
    content: `
      <p>Choosing the right business structure is one of the most important decisions you'll make as a startup founder in Texas. The choice between an LLC and S-Corporation can significantly impact your taxes, liability protection, and administrative burden.</p>
      
      <h2>Key Differences at a Glance</h2>
      
      <h3>Limited Liability Company (LLC)</h3>
      <ul>
        <li><strong>Taxation:</strong> Pass-through taxation, but subject to self-employment tax on all profits</li>
        <li><strong>Liability:</strong> Personal asset protection from business debts and obligations</li>
        <li><strong>Administration:</strong> Minimal paperwork, flexible management structure</li>
        <li><strong>Best for:</strong> Single owners, partnerships, businesses with irregular income</li>
      </ul>

      <h3>S-Corporation</h3>
      <ul>
        <li><strong>Taxation:</strong> Pass-through taxation, but only wages subject to self-employment tax</li>
        <li><strong>Liability:</strong> Personal asset protection from business debts and obligations</li>
        <li><strong>Administration:</strong> More paperwork, required board meetings, payroll requirements</li>
        <li><strong>Best for:</strong> Profitable businesses with consistent income, multiple owners</li>
      </ul>

      <h2>The Self-Employment Tax Advantage</h2>
      <p>The biggest difference lies in self-employment tax treatment. With an LLC, all profits are subject to the 15.3% self-employment tax. With an S-Corp, only your reasonable salary is subject to this tax, potentially saving thousands annually.</p>

      <h2>Making the Right Choice</h2>
      <p>The decision depends on your specific situation, including income level, number of owners, and growth plans. Generally, S-Corp election makes sense when your business profits exceed $60,000-$80,000 annually.</p>

      <p><strong>Ready to determine the best structure for your business?</strong> Schedule a consultation to discuss your specific situation and get personalized recommendations.</p>
    `
  },
  {
    id: 'cash-flow-secrets',
    title: 'Beyond the Bank Balance: 3 Cash Flow Secrets Every Founder Must Know',
    excerpt: 'Discover the difference between profit and cash flow, plus three actionable strategies to master your cash conversion cycle.',
    author: 'Cyndi Dinh',
    date: '2024-01-10',
    readTime: '6 min read',
    image: '/images/blog-cash-flow.jpg',
    content: `
      <p>Many profitable businesses fail due to poor cash flow management. Understanding the difference between profit and cash flow is crucial for sustainable growth.</p>

      <h2>Profit vs. Cash Flow: The Critical Distinction</h2>
      <p>Profit is an accounting concept—revenue minus expenses on paper. Cash flow is the actual money moving in and out of your business. You can be profitable but cash-poor, especially during growth phases.</p>

      <h2>Secret #1: Create a 13-Week Cash Flow Forecast</h2>
      <p>Project your cash position weekly for the next 13 weeks. Include:</p>
      <ul>
        <li>Confirmed receivables with collection dates</li>
        <li>Scheduled payables and payroll</li>
        <li>Seasonal variations in revenue</li>
        <li>Major capital expenditures</li>
      </ul>

      <h2>Secret #2: Manage Accounts Receivable Aggressively</h2>
      <p>Your receivables are not assets—they're promises. Implement these strategies:</p>
      <ul>
        <li>Require deposits or partial payment upfront</li>
        <li>Offer early payment discounts (2/10 net 30)</li>
        <li>Follow up on overdue accounts immediately</li>
        <li>Consider factoring for large receivables</li>
      </ul>

      <h2>Secret #3: Understand Your Cash Conversion Cycle</h2>
      <p>This measures how long it takes to convert investments into cash flows:</p>
      <p><strong>Days Sales Outstanding + Days Inventory Outstanding - Days Payable Outstanding = Cash Conversion Cycle</strong></p>
      <p>The shorter this cycle, the better your cash flow.</p>

      <h2>Take Action Today</h2>
      <p>Cash flow management is a skill that separates successful businesses from failed ones. Don't wait until you're in a cash crunch to start planning.</p>
    `
  },
  {
    id: 'bookkeeping-mistakes',
    title: 'The Top 5 Bookkeeping Mistakes That Can Sink a New Business',
    excerpt: 'Avoid these common bookkeeping pitfalls that can derail your business growth and create costly problems down the road.',
    author: 'Cyndi Dinh',
    date: '2024-01-05',
    readTime: '7 min read',
    image: '/images/blog-mistakes.jpg',
    content: `
      <p>As a business owner, you're juggling countless responsibilities. But neglecting proper bookkeeping can lead to serious consequences that threaten your business's survival.</p>

      <h2>Mistake #1: Mixing Personal and Business Finances</h2>
      <p>This is the #1 mistake that can destroy your limited liability protection and create tax nightmares. Always maintain separate accounts and never pay personal expenses from business accounts.</p>
      <p><strong>Solution:</strong> Open dedicated business checking and credit card accounts immediately.</p>

      <h2>Mistake #2: Not Tracking Reimbursable Expenses</h2>
      <p>Missing out on legitimate business deductions costs you money. Track everything: mileage, meals, office supplies, and professional development.</p>
      <p><strong>Solution:</strong> Use apps like Expensify or maintain detailed receipt records with business purposes noted.</p>

      <h2>Mistake #3: Misclassifying Employees vs. Contractors</h2>
      <p>The IRS takes this seriously. Misclassification can result in back taxes, penalties, and benefits obligations.</p>
      <p><strong>Solution:</strong> Understand the control test—if you control how, when, and where work is done, they're likely an employee.</p>

      <h2>Mistake #4: Ignoring Sales Tax Obligations</h2>
      <p>Sales tax requirements vary by state and product type. Ignorance isn't a defense when it comes to tax compliance.</p>
      <p><strong>Solution:</strong> Research your obligations early and set up proper collection and remittance procedures.</p>

      <h2>Mistake #5: Trying to Do Everything Yourself</h2>
      <p>Your time is valuable. Spending hours on bookkeeping takes you away from growing your business and often results in errors that cost more to fix than prevent.</p>
      <p><strong>Solution:</strong> Invest in professional bookkeeping services that free you to focus on what you do best.</p>

      <h2>The Cost of Mistakes</h2>
      <p>These mistakes can result in:</p>
      <ul>
        <li>IRS audits and penalties</li>
        <li>Lost tax deductions</li>
        <li>Inaccurate financial decisions</li>
        <li>Compliance issues</li>
        <li>Wasted time and stress</li>
      </ul>

      <p><strong>Don't let bookkeeping mistakes sink your business.</strong> Professional bookkeeping services are an investment in your success, not an expense.</p>
    `
  }
];

// Company Info for About Section
export const COMPANY_INFO = {
  founder: {
    name: 'Cyndi Dinh',
    title: 'Founder & Strategic Financial Partner',
    image: '/images/cyndi-dinh-professional.jpg',
    bio: `My name is Cyndi Dinh, and I founded Books & Boardroom on a simple principle: every business owner deserves financial clarity and a strategic partner to help them navigate growth.

With years of experience in both public and private accounting, I've seen firsthand how clean books can transform a business. My expertise lies in not only ensuring perfect compliance but also in identifying key tax strategies—like optimizing entity structure (LLC vs. S-Corp), maximizing depreciation, and leveraging tax credits—that directly impact your bottom line.

We're more than your accountants; we are a dedicated part of your team, committed to turning your financial data into your most powerful asset.`,
    linkedin: 'https://linkedin.com/in/cyndidinh',
    credentials: [
      'Licensed CPA',
      'QuickBooks ProAdvisor',
      'Texas Society of CPAs Member',
      '10+ Years Experience'
    ]
  },
  values: [
    {
      title: 'Financial Clarity',
      description: 'We transform complex financial data into clear, actionable insights that drive business decisions.',
      icon: '🔍'
    },
    {
      title: 'Strategic Partnership',
      description: 'We work as an extension of your team, providing ongoing support and strategic guidance.',
      icon: '🤝'
    },
    {
      title: 'Proactive Approach',
      description: 'We anticipate challenges and opportunities, keeping you ahead of financial and regulatory changes.',
      icon: '🎯'
    },
    {
      title: 'Growth Focused',
      description: 'Every service we provide is designed to support and accelerate your business growth.',
      icon: '📈'
    }
  ]
};

// Stripe Configuration (will be updated with actual keys)
export const STRIPE_CONFIG = {
  publishableKey: 'pk_live_51RjNv5FTUbzUe3a6XxT8l643MJ1gUJmvcY9sgQ4c8kA0e2a2i6IHLX35zDjHOx2neqqyKIptdhoeMOfbIa3ojdu300xb9552QB',
  testAmount: 100 // $1.00 in cents
}; 