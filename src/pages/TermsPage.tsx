import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, Scale, AlertTriangle, Shield, Clock,
  ArrowRight, Calendar, Mail, Phone
} from 'lucide-react';
import { CONTACT_INFO, APP_NAME } from '@/lib/constants';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Scale className="h-16 w-16 text-accent-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Terms of Service
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-primary-100 max-w-3xl mx-auto">
            Professional accounting services agreement and terms of engagement.
          </p>
          <p className="text-lg text-primary-200">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <Card className="mb-8 border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-2xl text-primary-900 flex items-center">
                  <FileText className="h-6 w-6 text-accent-600 mr-3" />
                  Agreement to Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary space-y-4">
                <p>
                  Welcome to {APP_NAME}. These Terms of Service ("Terms") govern your use of our website, 
                  services, and any related communications. By accessing our website or engaging our services, 
                  you agree to be bound by these Terms.
                </p>
                <p>
                  These Terms constitute a legally binding agreement between you and {APP_NAME}. 
                  If you do not agree to these Terms, please do not use our website or services.
                </p>
                
                <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
                  <p className="text-accent-800 font-medium">
                    <strong>Professional Services:</strong> Our accounting, tax, and CFO services are subject to 
                    additional engagement letters and professional standards that will supplement these Terms.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Services Description */}
            <Card className="mb-8 border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary-900">Description of Services</CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary space-y-4">
                <p>{APP_NAME} provides professional accounting and financial services, including:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Bookkeeping and financial record maintenance</li>
                  <li>Tax preparation and planning services</li>
                  <li>Fractional CFO and controller services</li>
                  <li>Financial consulting and advisory services</li>
                  <li>Business formation and compliance assistance</li>
                  <li>Financial analysis and reporting</li>
                </ul>
                
                <p>
                  Specific services will be detailed in individual engagement letters or service agreements 
                  that will be executed prior to beginning work.
                </p>
              </CardContent>
            </Card>

            {/* Engagement Process */}
            <Card className="mb-8 border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary-900 flex items-center">
                  <Clock className="h-5 w-5 text-accent-600 mr-3" />
                  Service Engagement and Client Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">Engagement Process</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Initial consultation to understand your needs</li>
                    <li>Proposal outlining scope, timeline, and fees</li>
                    <li>Execution of engagement letter or service agreement</li>
                    <li>Ongoing service delivery and communication</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">Client Responsibilities</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Provide complete and accurate financial information</li>
                    <li>Respond promptly to requests for documentation</li>
                    <li>Maintain organized records and supporting documentation</li>
                    <li>Pay invoices according to agreed-upon terms</li>
                    <li>Communicate changes in business operations promptly</li>
                    <li>Review and approve work product in a timely manner</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Fees and Payment */}
            <Card className="mb-8 border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary-900">Fees and Payment Terms</CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">Fee Structure</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Monthly retainer fees for ongoing services</li>
                    <li>Hourly rates for consulting and project work</li>
                    <li>Fixed fees for specific deliverables (e.g., tax returns)</li>
                    <li>Fees are based on scope, complexity, and time requirements</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">Payment Terms</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Monthly retainers are due on the first of each month</li>
                    <li>Project fees are typically 50% upfront, 50% upon completion</li>
                    <li>Hourly work is billed monthly with net 15-day payment terms</li>
                    <li>Late fees may apply to overdue accounts</li>
                    <li>Services may be suspended for non-payment</li>
                  </ul>
                </div>

                <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                  <p className="text-secondary-800">
                    <strong>Note:</strong> Specific fee arrangements will be detailed in your engagement letter. 
                    We accept payment by check, ACH transfer, or credit card.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Professional Standards */}
            <Card className="mb-8 border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary-900 flex items-center">
                  <Shield className="h-5 w-5 text-accent-600 mr-3" />
                  Professional Standards and Limitations
                </CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">Professional Compliance</h3>
                  <p>Our services are provided in accordance with:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Generally Accepted Accounting Principles (GAAP)</li>
                    <li>Professional standards for CPAs and accounting firms</li>
                    <li>Texas State Board of Public Accountancy regulations</li>
                    <li>IRS and other regulatory requirements</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">Service Limitations</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>We do not provide audited financial statements unless specifically engaged</li>
                    <li>Tax advice is general in nature unless part of a specific engagement</li>
                    <li>We do not provide legal advice or investment recommendations</li>
                    <li>Services are limited to the scope defined in engagement letters</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Confidentiality */}
            <Card className="mb-8 border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary-900">Confidentiality and Data Protection</CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary space-y-4">
                <p>
                  We maintain strict confidentiality of all client information in accordance with 
                  professional standards and applicable law. This includes:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Financial records and business information</li>
                  <li>Tax returns and supporting documentation</li>
                  <li>Strategic business plans and forecasts</li>
                  <li>Personal financial information</li>
                </ul>
                
                <p>
                  We will not disclose confidential information except as required by law, professional standards, 
                  or with your explicit written consent. See our Privacy Policy for additional details on data protection.
                </p>
              </CardContent>
            </Card>

            {/* Liability and Disclaimers */}
            <Card className="mb-8 border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary-900 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-3" />
                  Liability Limitations and Disclaimers
                </CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">Service Disclaimers</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Our services are based on information provided by clients</li>
                    <li>We are not responsible for the completeness or accuracy of client-provided data</li>
                    <li>Tax and financial advice is based on current laws and regulations, which may change</li>
                    <li>Results cannot be guaranteed and depend on various factors</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">Limitation of Liability</h3>
                  <p>
                    To the maximum extent permitted by law, our liability for any damages arising from our services 
                    shall not exceed the amount of fees paid by the client for the specific service giving rise to the claim.
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 font-medium">
                    <strong>Important:</strong> Professional liability insurance coverage may apply to certain services. 
                    Specific liability terms will be detailed in individual engagement letters.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card className="mb-8 border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary-900">Termination of Services</CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">Termination Rights</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Either party may terminate services with 30 days written notice</li>
                    <li>Immediate termination may occur for non-payment or breach of agreement</li>
                    <li>We may terminate if continuation would violate professional standards</li>
                    <li>Termination does not affect obligations for work already performed</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">Post-Termination</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>All outstanding fees must be paid promptly</li>
                    <li>Client files will be returned or made available as requested</li>
                    <li>Confidentiality obligations continue after termination</li>
                    <li>We may retain copies of records as required by professional standards</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Website Terms */}
            <Card className="mb-8 border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary-900">Website Use and Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">Acceptable Use</h3>
                  <p>When using our website, you agree to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Use the website for lawful purposes only</li>
                    <li>Not attempt to gain unauthorized access to our systems</li>
                    <li>Not transmit viruses or malicious code</li>
                    <li>Respect intellectual property rights</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">Intellectual Property</h3>
                  <p>
                    All website content, including text, graphics, logos, and software, is the property of 
                    {APP_NAME} or our licensors and is protected by copyright and other intellectual property laws.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card className="mb-8 border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary-900">Governing Law and Dispute Resolution</CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary space-y-4">
                <p>
                  These Terms are governed by the laws of the State of Texas. Any disputes arising from these Terms 
                  or our services will be resolved through:
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Good faith negotiation between the parties</li>
                  <li>Mediation, if negotiation is unsuccessful</li>
                  <li>Binding arbitration or court proceedings in Harris County, Texas</li>
                </ol>
                
                <p>
                  This dispute resolution process aims to resolve issues efficiently while maintaining our professional relationship.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card className="mb-8 border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary-900">Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary space-y-4">
                <p>
                  We may update these Terms from time to time to reflect changes in our services, legal requirements, 
                  or business practices. We will notify you of material changes by:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Posting updated Terms on our website with a new effective date</li>
                  <li>Sending email notification to active clients</li>
                  <li>Providing notice in our next service communication</li>
                </ul>
                
                <p>
                  Continued use of our services after changes become effective constitutes acceptance of the updated Terms.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-900 mb-6">
            Questions About These Terms?
          </h2>
          <p className="text-xl text-text-secondary mb-8">
            We're happy to discuss our terms of service and answer any questions about our engagement process.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-accent-600 mx-auto mb-3" />
                <h3 className="font-semibold text-primary-900 mb-2">Email Us</h3>
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-accent-600 hover:text-accent-700">
                  {CONTACT_INFO.email}
                </a>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-accent-600 mx-auto mb-3" />
                <h3 className="font-semibold text-primary-900 mb-2">Call Us</h3>
                <a href={`tel:${CONTACT_INFO.directLine}`} className="text-accent-600 hover:text-accent-700">
                  {CONTACT_INFO.directLine}
                </a>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-accent-500 hover:bg-accent-600">
              <Link to="/contact">
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <a href={CONTACT_INFO.calendly} target="_blank" rel="noopener noreferrer">
                Schedule Consultation
                <Calendar className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 