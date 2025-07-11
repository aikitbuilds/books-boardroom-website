import React, { useState, useEffect } from 'react';
import { useFirebase } from '@/hooks/useFirebase';
import AuthComponent from '@/components/AuthComponent';
import AccountSetupWizard from '@/components/AccountSetupWizard';
import DemoDataManager from '@/components/DemoDataManager';
import FileUploadManager from '@/components/FileUploadManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  User, Settings, Database, Upload, 
  CheckCircle, ArrowRight, Home, AlertTriangle,
  SkipForward
} from 'lucide-react';
import { toast } from 'sonner';

export default function AccountSetup() {
  const [currentStep, setCurrentStep] = useState<'auth' | 'setup' | 'data' | 'upload' | 'complete'>('auth');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useFirebase();

  useEffect(() => {
    // Check if user is authenticated
    if (state.user && state.userProfile) {
      setUserProfile(state.userProfile);
      // Check if user has completed setup (default to setup step for new users)
      setCurrentStep('setup');
    }
  }, [state.user, state.userProfile]);

  const handleAuthSuccess = (user: any) => {
    setCurrentStep('setup');
    setSetupError(null);
  };

  const handleSetupComplete = () => {
    try {
      setCurrentStep('data');
      setSetupError(null);
      toast.success('Account setup completed successfully');
    } catch (error) {
      setSetupError('Failed to complete account setup. Please try again.');
      console.error('Setup error:', error);
    }
  };

  const handleDataComplete = () => {
    try {
      setCurrentStep('upload');
      setSetupError(null);
      toast.success('Demo data configured successfully');
    } catch (error) {
      setSetupError('Failed to configure demo data. You can skip this step and continue.');
      console.error('Data setup error:', error);
    }
  };

  const handleUploadComplete = () => {
    try {
      setCurrentStep('complete');
      setSetupError(null);
      toast.success('File upload setup completed');
    } catch (error) {
      setSetupError('Failed to complete file upload setup. You can continue without uploading files.');
      console.error('Upload setup error:', error);
    }
  };

  const handleSkipStep = (step: string) => {
    toast.info(`Skipped ${step} step. You can configure this later.`);
    switch (step) {
      case 'data':
        setCurrentStep('upload');
        break;
      case 'upload':
        setCurrentStep('complete');
        break;
      default:
        break;
    }
  };

  const handleGoToDashboard = () => {
    window.location.href = '/back-office';
  };

  const renderAuthStep = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to BooksBoardroom</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>
        <AuthComponent onAuthSuccess={handleAuthSuccess} />
      </div>
    </div>
  );

  const renderSetupStep = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Setup</h1>
          <p className="text-gray-600">Let's configure your account for success</p>
        </div>
        
        {setupError && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Setup Error</AlertTitle>
            <AlertDescription>{setupError}</AlertDescription>
          </Alert>
        )}
        
        <AccountSetupWizard />
        <div className="mt-8 text-center">
          <Button 
            onClick={handleSetupComplete} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Continue to Data Setup'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderDataStep = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Demo Data Setup</h1>
          <p className="text-gray-600">Configure demo data to explore features (optional)</p>
        </div>
        
        {setupError && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Setup Error</AlertTitle>
            <AlertDescription>{setupError}</AlertDescription>
          </Alert>
        )}
        
        <DemoDataManager />
        <div className="mt-8 text-center space-x-4">
          <Button 
            onClick={handleDataComplete} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Continue to File Upload'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleSkipStep('data')}
          >
            <SkipForward className="h-4 w-4 mr-2" />
            Skip Demo Data
          </Button>
        </div>
      </div>
    </div>
  );

  const renderUploadStep = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">File Upload Setup</h1>
          <p className="text-gray-600">Upload your documents and files (optional)</p>
        </div>
        
        {setupError && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Setup Error</AlertTitle>
            <AlertDescription>{setupError}</AlertDescription>
          </Alert>
        )}
        
        <FileUploadManager />
        <div className="mt-8 text-center space-x-4">
          <Button 
            onClick={handleUploadComplete} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Complete Setup'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleSkipStep('upload')}
          >
            <SkipForward className="h-4 w-4 mr-2" />
            Skip File Upload
          </Button>
        </div>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Setup Complete!</CardTitle>
          <CardDescription>
            Your BooksBoardroom account is ready to use
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-gray-600">
              Welcome to BooksBoardroom! Your account has been configured with:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Account profile and preferences</li>
              <li>• Secure file storage access</li>
              <li>• Dashboard and analytics</li>
              <li>• User management capabilities</li>
            </ul>
          </div>
          
          <Button 
            onClick={handleGoToDashboard}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderProgressIndicator = () => {
    if (currentStep === 'auth') return null;
    
    const steps = [
      { id: 'auth', label: 'Authentication', completed: ['setup', 'data', 'upload', 'complete'].includes(currentStep) },
      { id: 'setup', label: 'Account Setup', completed: ['setup', 'data', 'upload', 'complete'].includes(currentStep) },
      { id: 'data', label: 'Demo Data', completed: ['data', 'upload', 'complete'].includes(currentStep) },
      { id: 'upload', label: 'File Upload', completed: ['upload', 'complete'].includes(currentStep) },
      { id: 'complete', label: 'Complete', completed: currentStep === 'complete' }
    ];

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {step.completed ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${
                  step.completed ? 'bg-green-200' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          {steps.map(step => (
            <span key={step.id} className="text-center flex-1">
              {step.label}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {currentStep !== 'auth' && renderProgressIndicator()}
      
      {currentStep === 'auth' && renderAuthStep()}
      {currentStep === 'setup' && renderSetupStep()}
      {currentStep === 'data' && renderDataStep()}
      {currentStep === 'upload' && renderUploadStep()}
      {currentStep === 'complete' && renderCompleteStep()}
    </div>
  );
} 