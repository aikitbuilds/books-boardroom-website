import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, Lock, Eye, UserCheck, Mail, Phone,
  ArrowRight, Calendar
} from 'lucide-react';
import { CONTACT_INFO, APP_NAME } from '@/lib/constants';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Shield className="h-16 w-16 text-accent-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-primary-100 max-w-3xl mx-auto">
            Your privacy and the security of your financial information is our top priority.
          </p>
          <p className="text-lg text-primary-200">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <Card className="mb-8 border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-2xl text-primary-900 flex items-center">
                  <Lock className="h-6 w-6 text-accent-600 mr-3" />
                  Our Commitment to Your Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary space-y-4">
                <p>
                  At {APP_NAME}, we understand that your financial information is highly sensitive and personal. 
                  As a professional accounting firm, we are committed to protecting your privacy and maintaining 
                  the confidentiality of all information you share with us.
                </p>
                <p>
                  This Privacy Policy explains how we collect, use, protect, and share information about you when 
                  you use our website, services, or communicate with us. By using our services, you agree to the 
                  terms outlined in this policy.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card className="mb-8 border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary-900 flex items-center">
                  <Eye className="h-5 w-5 text-accent-600 mr-3" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Name, address, phone number, and email address</li>
                    <li>Business information including company name, industry, and tax ID</li>
                    <li>Financial information necessary to provide accounting services</li>
                    <li>Communication preferences and service requirements</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">Website Usage Information</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>IP address, browser type, and device information</li>
                    <li>Pages visited, time spent on our website, and referral sources</li>
                    <li>Cookies and similar tracking technologies (with your consent)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">Service-Related Information</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Financial records, bank statements, and transaction data</li>
                    <li>Tax returns and supporting documentation</li>
                    <li>Payroll information and employee records (when applicable)</li>
                    <li>Communications related to our services</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card className="mb-8 border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary-900 flex items-center">
                  <UserCheck className="h-5 w-5 text-accent-600 mr-3" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary space-y-4">
                <p>We use your information solely for legitimate business purposes, including:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Providing bookkeeping, tax preparation, and CFO services</li>
                  <li>Communicating with you about your account and services</li>
                  <li>Processing payments and managing billing</li>
                  <li>Complying with legal and regulatory requirements</li>
                  <li>Improving our services and website functionality</li>
                  <li>Sending service updates and important notifications</li>
                  <li>Providing customer support and responding to inquiries</li>
                </ul>
                
                <div className="bg-accent-50 border border-accent-200 rounded-lg p-4 mt-4">
                  <p className="text-accent-800 font-medium">
                    <strong>Important:</strong> We will never sell, rent, or trade your personal information to third parties 
                    for marketing purposes. Your financial data is confidential and protected under professional accounting standards.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card className="mb-8 border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary-900">Information Sharing and Disclosure</CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary space-y-4">
                <p>We may share your information only in the following limited circumstances:</p>
                
                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">With Your Consent</h3>
                  <p>We will share information when you explicitly authorize us to do so, such as when communicating with your bank, attorney, or other professional advisors.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">Legal Requirements</h3>
                  <p>We may disclose information when required by law, such as:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>In response to court orders, subpoenas, or government requests</li>
                    <li>To comply with tax reporting obligations</li>
                    <li>When required by regulatory authorities</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">Service Providers</h3>
                  <p>We may share information with trusted service providers who assist us in delivering our services, such as:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Cloud storage and software providers (under strict confidentiality agreements)</li>
                    <li>Payment processors for billing and payment handling</li>
                    <li>IT support and security services</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="mb-8 border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary-900 flex items-center">
                  <Shield className="h-5 w-5 text-accent-600 mr-3" />
                  Data Security and Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary space-y-4">
                <p>We implement industry-standard security measures to protect your information:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure, password-protected file sharing systems</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to information on a need-to-know basis</li>
                  <li>Staff training on confidentiality and data protection</li>
                  <li>Secure physical storage of documents and records</li>
                </ul>
                
                <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 mt-4">
                  <p className="text-secondary-800">
                    <strong>Professional Standards:</strong> As CPAs, we are bound by professional ethics rules 
                    that require us to maintain client confidentiality and protect sensitive financial information.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="mb-8 border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary-900">Your Privacy Rights</CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary space-y-4">
                <p>You have the following rights regarding your personal information:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Access:</strong> Request copies of your personal information we hold</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your information (subject to legal retention requirements)</li>
                  <li><strong>Portability:</strong> Request transfer of your information to another service provider</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                  <li><strong>Restriction:</strong> Request limitation on how we process your information</li>
                </ul>
                
                <p className="mt-4">
                  To exercise any of these rights, please contact us using the information provided below. 
                  We will respond to your request within 30 days.
                </p>
              </CardContent>
            </Card>

            {/* Cookies and Tracking */}
            <Card className="mb-8 border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary-900">Cookies and Website Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary space-y-4">
                <p>Our website uses cookies and similar technologies to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Remember your preferences and improve user experience</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Ensure website security and prevent fraud</li>
                  <li>Provide customer support and troubleshooting</li>
                </ul>
                
                <p>
                  You can control cookie settings through your browser preferences. However, disabling cookies 
                  may affect the functionality of our website.
                </p>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card className="mb-8 border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary-900">Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary space-y-4">
                <p>We retain your information for as long as necessary to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide ongoing services to you</li>
                  <li>Comply with legal and regulatory requirements</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Meet professional record-keeping standards</li>
                </ul>
                
                <p>
                  Generally, we retain client records for seven years after the termination of services, 
                  in accordance with professional accounting standards and IRS requirements.
                </p>
              </CardContent>
            </Card>

            {/* Updates to Policy */}
            <Card className="mb-8 border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary-900">Updates to This Policy</CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary space-y-4">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices, 
                  technology, legal requirements, or other factors. We will notify you of any material changes by:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Posting the updated policy on our website with a new "Last Updated" date</li>
                  <li>Sending email notifications for significant changes</li>
                  <li>Providing notice during your next service interaction</li>
                </ul>
                
                <p>
                  We encourage you to review this policy periodically to stay informed about how we protect your information.
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
            Questions About This Privacy Policy?
          </h2>
          <p className="text-xl text-text-secondary mb-8">
            We're here to help you understand how we protect your information. Contact us with any questions or concerns.
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