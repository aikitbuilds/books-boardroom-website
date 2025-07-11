import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  User, Mail, Building, Phone, MapPin, Upload, 
  FileText, BarChart3, Settings, CheckCircle, 
  ArrowRight, ArrowLeft, Loader2, AlertCircle,
  Briefcase, Calendar, Target, Users
} from 'lucide-react';
import { useFirebase } from '@/hooks/useFirebase';
import { createSampleRealData } from '@/utils/create-sample-data';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface AccountSetupData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Company Information
  companyName: string;
  companyType: 'solar' | 'construction' | 'consulting' | 'other';
  industry: string;
  companySize: '1-10' | '11-50' | '51-200' | '200+';
  
  // Business Information
  businessAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Preferences
  primaryUseCase: 'crm' | 'project-management' | 'financial-tracking' | 'all';
  dataImportTypes: ('pdf' | 'csv' | 'excel' | 'manual')[];
  teamSize: number;
  
  // Features
  enableDemoData: boolean;
  enableFileUpload: boolean;
  enableAnalytics: boolean;
  enableIntegrations: boolean;
}

export default function AccountSetupWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { state, getUserProfile } = useFirebase();
  
  const [setupData, setSetupData] = useState<AccountSetupData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    companyType: 'solar',
    industry: '',
    companySize: '1-10',
    businessAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    primaryUseCase: 'all',
    dataImportTypes: ['manual'],
    teamSize: 1,
    enableDemoData: true,
    enableFileUpload: true,
    enableAnalytics: true,
    enableIntegrations: true
  });

  const steps: SetupStep[] = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Tell us about yourself',
      icon: <User className="h-5 w-5" />,
      completed: !!(setupData.firstName && setupData.lastName && setupData.email)
    },
    {
      id: 'company',
      title: 'Company Details',
      description: 'Information about your business',
      icon: <Building className="h-5 w-5" />,
      completed: !!(setupData.companyName && setupData.companyType)
    },
    {
      id: 'location',
      title: 'Business Location',
      description: 'Where is your business located?',
      icon: <MapPin className="h-5 w-5" />,
      completed: !!(setupData.businessAddress && setupData.city && setupData.state)
    },
    {
      id: 'preferences',
      title: 'Preferences & Features',
      description: 'Customize your experience',
      icon: <Settings className="h-5 w-5" />,
      completed: !!(setupData.primaryUseCase && setupData.dataImportTypes.length > 0)
    },
    {
      id: 'data',
      title: 'Data Setup',
      description: 'Configure your data and demo content',
      icon: <BarChart3 className="h-5 w-5" />,
      completed: false
    }
  ];

  useEffect(() => {
    // Load existing user data if available
    if (state.userProfile) {
      setSetupData(prev => ({
        ...prev,
        firstName: state.userProfile.firstName || '',
        lastName: state.userProfile.lastName || '',
        email: state.userProfile.email || '',
        company: state.userProfile.company || ''
      }));
    }
  }, [state.userProfile]);

  const handleInputChange = (field: keyof AccountSetupData, value: any) => {
    setSetupData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCompleteSetup = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Update user profile with setup data
      if (state.user) {
        const userProfile = await getUserProfile(state.user.uid);
        if (userProfile) {
          // Update profile with setup data
          // This would typically be done through a service
          console.log('Updating user profile with setup data:', setupData);
        }
      }

      // Create sample data if enabled
      if (setupData.enableDemoData) {
        const result = await createSampleRealData();
        if (result.success) {
          setSuccess('Account setup completed! Demo data has been loaded.');
        } else {
          setError('Setup completed but demo data creation failed: ' + result.errors.join(', '));
        }
      } else {
        setSuccess('Account setup completed successfully!');
      }

      // Redirect to dashboard after a delay
      setTimeout(() => {
        window.location.href = '/back-office';
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={setupData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="Enter your first name"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={setupData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Enter your last name"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={setupData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="your.email@company.com"
        />
      </div>
      
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={setupData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="(555) 123-4567"
        />
      </div>
    </div>
  );

  const renderCompanyStep = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="companyName">Company Name *</Label>
        <Input
          id="companyName"
          value={setupData.companyName}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
          placeholder="Your Company Name"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="companyType">Company Type *</Label>
          <select
            id="companyType"
            value={setupData.companyType}
            onChange={(e) => handleInputChange('companyType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="solar">Solar Installation</option>
            <option value="construction">Construction</option>
            <option value="consulting">Consulting</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <Label htmlFor="companySize">Company Size</Label>
          <select
            id="companySize"
            value={setupData.companySize}
            onChange={(e) => handleInputChange('companySize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="200+">200+ employees</option>
          </select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="industry">Industry/Industry Focus</Label>
        <Input
          id="industry"
          value={setupData.industry}
          onChange={(e) => handleInputChange('industry', e.target.value)}
          placeholder="e.g., Residential Solar, Commercial Construction"
        />
      </div>
    </div>
  );

  const renderLocationStep = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="businessAddress">Business Address *</Label>
        <Input
          id="businessAddress"
          value={setupData.businessAddress}
          onChange={(e) => handleInputChange('businessAddress', e.target.value)}
          placeholder="123 Business Street"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={setupData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="City"
          />
        </div>
        <div>
          <Label htmlFor="state">State/Province *</Label>
          <Input
            id="state"
            value={setupData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            placeholder="State"
          />
        </div>
        <div>
          <Label htmlFor="zipCode">ZIP/Postal Code</Label>
          <Input
            id="zipCode"
            value={setupData.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
            placeholder="12345"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="country">Country</Label>
        <select
          id="country"
          value={setupData.country}
          onChange={(e) => handleInputChange('country', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="United States">United States</option>
          <option value="Canada">Canada</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Australia">Australia</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>
  );

  const renderPreferencesStep = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="primaryUseCase">Primary Use Case *</Label>
        <select
          id="primaryUseCase"
          value={setupData.primaryUseCase}
          onChange={(e) => handleInputChange('primaryUseCase', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Features (CRM, Projects, Financial)</option>
          <option value="crm">Customer Relationship Management</option>
          <option value="project-management">Project Management</option>
          <option value="financial-tracking">Financial Tracking</option>
        </select>
      </div>
      
      <div>
        <Label>Data Import Types</Label>
        <div className="space-y-2 mt-2">
          {['pdf', 'csv', 'excel', 'manual'].map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={setupData.dataImportTypes.includes(type as any)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleInputChange('dataImportTypes', [...setupData.dataImportTypes, type]);
                  } else {
                    handleInputChange('dataImportTypes', setupData.dataImportTypes.filter(t => t !== type));
                  }
                }}
                className="rounded"
              />
              <span className="capitalize">{type.toUpperCase()}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <Label htmlFor="teamSize">Team Size</Label>
        <Input
          id="teamSize"
          type="number"
          min="1"
          value={setupData.teamSize}
          onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value))}
          placeholder="Number of team members"
        />
      </div>
    </div>
  );

  const renderDataSetupStep = () => (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Data Configuration</AlertTitle>
        <AlertDescription>
          Configure how you want to start with BooksBoardroom. You can always change these settings later.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <Label className="font-medium">Enable Demo Data</Label>
              <p className="text-sm text-gray-600">Start with sample projects, leads, and data to explore features</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={setupData.enableDemoData}
            onChange={(e) => handleInputChange('enableDemoData', e.target.checked)}
            className="rounded"
          />
        </div>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <Upload className="h-5 w-5 text-blue-600" />
            <div>
              <Label className="font-medium">Enable File Upload</Label>
              <p className="text-sm text-gray-600">Upload PDFs, CSVs, and other documents</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={setupData.enableFileUpload}
            onChange={(e) => handleInputChange('enableFileUpload', e.target.checked)}
            className="rounded"
          />
        </div>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <div>
              <Label className="font-medium">Enable Analytics</Label>
              <p className="text-sm text-gray-600">Track performance and generate insights</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={setupData.enableAnalytics}
            onChange={(e) => handleInputChange('enableAnalytics', e.target.checked)}
            className="rounded"
          />
        </div>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <Settings className="h-5 w-5 text-orange-600" />
            <div>
              <Label className="font-medium">Enable Integrations</Label>
              <p className="text-sm text-gray-600">Connect with external tools and services</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={setupData.enableIntegrations}
            onChange={(e) => handleInputChange('enableIntegrations', e.target.checked)}
            className="rounded"
          />
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalInfoStep();
      case 1:
        return renderCompanyStep();
      case 2:
        return renderLocationStep();
      case 3:
        return renderPreferencesStep();
      case 4:
        return renderDataSetupStep();
      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 className="h-8 w-8 text-teal-500" />
            <span className="text-2xl font-bold">BooksBoardroom Setup</span>
          </div>
          <CardTitle>Welcome to BooksBoardroom!</CardTitle>
          <CardDescription>
            Let's get your account configured for success
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col items-center space-y-2 ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index < currentStep ? 'bg-green-100 text-green-600' :
                  index === currentStep ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span className="text-xs text-center hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
          
          {/* Current Step Content */}
          <div className="py-6">
            <div className="flex items-center space-x-2 mb-4">
              {steps[currentStep].icon}
              <div>
                <h3 className="font-semibold">{steps[currentStep].title}</h3>
                <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
              </div>
            </div>
            
            {renderStepContent()}
          </div>
          
          {/* Error/Success Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0 || isLoading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleCompleteSetup}
                disabled={isLoading}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Complete Setup
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!steps[currentStep].completed}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 