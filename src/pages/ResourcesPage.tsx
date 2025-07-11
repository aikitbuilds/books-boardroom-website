import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, Clock, Calendar, ExternalLink, 
  BookOpen, TrendingUp, AlertTriangle,
  CheckCircle, Building2, Calculator
} from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Financial Insights & Resources
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-4xl mx-auto">
            Expert insights to help you make informed financial decisions and grow your business strategically.
          </p>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            
            {/* Blog Post 1: LLC vs S-Corp */}
            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 p-8 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <div className="text-center">
                    <Building2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <div className="text-4xl font-bold text-blue-600">LLC vs S-Corp</div>
                  </div>
                </div>
                <div className="lg:col-span-2 p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">Tax Strategy</Badge>
                    <div className="flex items-center text-sm text-text-secondary">
                      <Clock className="h-4 w-4 mr-1" />
                      8 min read
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-primary-900 mb-4">
                    LLC vs. S-Corp: Choosing the Right Business Structure for Your Texas Startup
                  </h2>
                  <p className="text-text-secondary mb-6 text-lg">
                    Understand the key differences in liability, taxation (especially self-employment tax), and administrative requirements to make the best choice for your business.
                  </p>
                  
                  {/* Comparison Table */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-semibold text-primary-900 mb-4">Key Differences at a Glance</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 font-semibold text-primary-900">Aspect</th>
                            <th className="text-left py-2 font-semibold text-blue-600">LLC</th>
                            <th className="text-left py-2 font-semibold text-green-600">S-Corporation</th>
                          </tr>
                        </thead>
                        <tbody className="space-y-2">
                          <tr className="border-b border-gray-100">
                            <td className="py-3 font-medium">Taxation</td>
                            <td className="py-3">Pass-through, all profits subject to self-employment tax (15.3%)</td>
                            <td className="py-3">Pass-through, only wages subject to self-employment tax</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-3 font-medium">Liability Protection</td>
                            <td className="py-3">Personal asset protection from business debts</td>
                            <td className="py-3">Personal asset protection from business debts</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-3 font-medium">Administration</td>
                            <td className="py-3">Minimal paperwork, flexible management</td>
                            <td className="py-3">More paperwork, required board meetings, payroll</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-medium">Best For</td>
                            <td className="py-3">Single owners, irregular income, simple operations</td>
                            <td className="py-3">Profitable businesses, consistent income, multiple owners</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-primary-900 mb-3">The Self-Employment Tax Advantage</h3>
                    <p className="text-text-secondary mb-4">
                      The biggest difference lies in self-employment tax treatment. With an LLC, all profits are subject to the 15.3% self-employment tax. 
                      With an S-Corp, only your reasonable salary is subject to this tax, potentially saving thousands annually.
                    </p>
                    <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
                      <p className="text-accent-800">
                        <strong>Rule of Thumb:</strong> S-Corp election typically makes sense when your business profits exceed $60,000-$80,000 annually.
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                    <p className="text-primary-900 font-medium mb-2">Ready to determine the best structure for your business?</p>
                    <p className="text-primary-800 mb-4">The "right" choice is unique to your situation. A consultation can provide personalized recommendations based on your specific circumstances.</p>
                    <Button asChild className="bg-accent-500 hover:bg-accent-600">
                      <a href={CONTACT_INFO.calendly} target="_blank" rel="noopener noreferrer">
                        Schedule a Consultation
                        <Calendar className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </article>

            {/* Blog Post 2: Cash Flow Secrets */}
            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 p-8 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-green-600">Cash Flow Mastery</div>
                  </div>
                </div>
                <div className="lg:col-span-2 p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Strategic Operations</Badge>
                    <div className="flex items-center text-sm text-text-secondary">
                      <Clock className="h-4 w-4 mr-1" />
                      6 min read
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-primary-900 mb-4">
                    Beyond the Bank Balance: 3 Cash Flow Secrets Every Founder Must Know
                  </h2>
                  <p className="text-text-secondary mb-6 text-lg">
                    Many profitable businesses fail due to poor cash flow management. Understanding the difference between profit and cash flow is crucial for sustainable growth.
                  </p>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-primary-900 mb-3">Profit vs. Cash Flow: The Critical Distinction</h3>
                    <p className="text-text-secondary mb-4">
                      Profit is an accounting concept—revenue minus expenses on paper. Cash flow is the actual money moving in and out of your business. 
                      You can be profitable but cash-poor, especially during growth phases.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="border-l-4 border-green-500 pl-6">
                      <h4 className="text-lg font-semibold text-primary-900 mb-2">Secret #1: Create a 13-Week Cash Flow Forecast</h4>
                      <p className="text-text-secondary mb-3">Project your cash position weekly for the next 13 weeks. Include:</p>
                      <ul className="space-y-1 text-sm text-text-secondary">
                        <li className="flex items-start"><CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />Confirmed receivables with collection dates</li>
                        <li className="flex items-start"><CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />Scheduled payables and payroll</li>
                        <li className="flex items-start"><CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />Seasonal variations in revenue</li>
                        <li className="flex items-start"><CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />Major capital expenditures</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-6">
                      <h4 className="text-lg font-semibold text-primary-900 mb-2">Secret #2: Manage Accounts Receivable Aggressively</h4>
                      <p className="text-text-secondary mb-3">Your receivables are not assets—they're promises. Implement these strategies:</p>
                      <ul className="space-y-1 text-sm text-text-secondary">
                        <li className="flex items-start"><CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />Require deposits or partial payment upfront</li>
                        <li className="flex items-start"><CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />Offer early payment discounts (2/10 net 30)</li>
                        <li className="flex items-start"><CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />Follow up on overdue accounts immediately</li>
                        <li className="flex items-start"><CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />Consider factoring for large receivables</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-6">
                      <h4 className="text-lg font-semibold text-primary-900 mb-2">Secret #3: Understand Your Cash Conversion Cycle</h4>
                      <p className="text-text-secondary mb-3">This measures how long it takes to convert investments into cash flows:</p>
                      <div className="bg-purple-50 rounded-lg p-4 mb-3">
                        <p className="text-center font-mono text-purple-800">
                          <strong>Days Sales Outstanding + Days Inventory Outstanding - Days Payable Outstanding = Cash Conversion Cycle</strong>
                        </p>
                      </div>
                      <p className="text-text-secondary text-sm">The shorter this cycle, the better your cash flow.</p>
                    </div>
                  </div>

                  <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-6 mt-6">
                    <p className="text-secondary-900 font-medium mb-2">Take Action Today</p>
                    <p className="text-secondary-800">Cash flow management separates successful businesses from failed ones. Don't wait until you're in a cash crunch to start planning.</p>
                  </div>
                </div>
              </div>
            </article>

            {/* Blog Post 3: Bookkeeping Mistakes */}
            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 p-8 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                  <div className="text-center">
                    <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-red-600">Avoid These Mistakes</div>
                  </div>
                </div>
                <div className="lg:col-span-2 p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge variant="secondary" className="bg-red-100 text-red-800">Risk Management</Badge>
                    <div className="flex items-center text-sm text-text-secondary">
                      <Clock className="h-4 w-4 mr-1" />
                      7 min read
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-primary-900 mb-4">
                    The Top 5 Bookkeeping Mistakes That Can Sink a New Business
                  </h2>
                  <p className="text-text-secondary mb-6 text-lg">
                    As a business owner, you're juggling countless responsibilities. But neglecting proper bookkeeping can lead to serious consequences that threaten your business's survival.
                  </p>

                  <div className="space-y-6">
                    <div className="border border-red-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-red-700 mb-2">❌ Mistake #1: Mixing Personal and Business Finances</h4>
                      <p className="text-text-secondary mb-3">
                        This is the #1 mistake that can destroy your limited liability protection and create tax nightmares. 
                        Always maintain separate accounts and never pay personal expenses from business accounts.
                      </p>
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <p className="text-green-800 text-sm"><strong>✅ Solution:</strong> Open dedicated business checking and credit card accounts immediately.</p>
                      </div>
                    </div>

                    <div className="border border-red-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-red-700 mb-2">❌ Mistake #2: Not Tracking Reimbursable Expenses</h4>
                      <p className="text-text-secondary mb-3">
                        Missing out on legitimate business deductions costs you money. Track everything: mileage, meals, office supplies, and professional development.
                      </p>
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <p className="text-green-800 text-sm"><strong>✅ Solution:</strong> Use apps like Expensify or maintain detailed receipt records with business purposes noted.</p>
                      </div>
                    </div>

                    <div className="border border-red-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-red-700 mb-2">❌ Mistake #3: Classifying Employees vs. Contractors Incorrectly</h4>
                      <p className="text-text-secondary mb-3">
                        The IRS takes this seriously. Misclassification can result in back taxes, penalties, and benefits obligations.
                      </p>
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <p className="text-green-800 text-sm"><strong>✅ Solution:</strong> Understand the control test—if you control how, when, and where work is done, they're likely an employee.</p>
                      </div>
                    </div>

                    <div className="border border-red-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-red-700 mb-2">❌ Mistake #4: Neglecting Sales Tax</h4>
                      <p className="text-text-secondary mb-3">
                        Sales tax requirements vary by state and product type. Ignorance isn't a defense when it comes to tax compliance.
                      </p>
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <p className="text-green-800 text-sm"><strong>✅ Solution:</strong> Research your obligations early and set up proper collection and remittance procedures.</p>
                      </div>
                    </div>

                    <div className="border border-red-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-red-700 mb-2">❌ Mistake #5: Doing It All Yourself and Losing Focus on Growth</h4>
                      <p className="text-text-secondary mb-3">
                        Your time is valuable. Spending hours on bookkeeping takes you away from growing your business and often results in errors that cost more to fix than prevent.
                      </p>
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <p className="text-green-800 text-sm"><strong>✅ Solution:</strong> Invest in professional bookkeeping services that free you to focus on what you do best.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
                    <h4 className="text-red-900 font-medium mb-3">The Cost of Mistakes</h4>
                    <p className="text-red-800 mb-3">These mistakes can result in:</p>
                    <ul className="space-y-1 text-sm text-red-700">
                      <li className="flex items-start"><AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />IRS audits and penalties</li>
                      <li className="flex items-start"><AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />Lost tax deductions</li>
                      <li className="flex items-start"><AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />Inaccurate financial decisions</li>
                      <li className="flex items-start"><AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />Compliance issues</li>
                      <li className="flex items-start"><AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />Wasted time and stress</li>
                    </ul>
                  </div>

                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mt-6">
                    <p className="text-primary-900 font-medium mb-2">Don't let bookkeeping mistakes sink your business.</p>
                    <p className="text-primary-800 mb-4">Professional bookkeeping services are an investment in your success, not an expense.</p>
                    <Button asChild className="bg-accent-500 hover:bg-accent-600">
                      <Link to="/services">
                        Explore Our Services
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Put These Insights into Action?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Schedule a complimentary consultation to discuss how we can help you implement these strategies and avoid costly mistakes.
          </p>
          <Button asChild size="lg" className="bg-accent-500 hover:bg-accent-600 text-white text-lg px-8 py-4">
            <a href={CONTACT_INFO.calendly} target="_blank" rel="noopener noreferrer">
              Schedule Your Consultation
              <Calendar className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
} 