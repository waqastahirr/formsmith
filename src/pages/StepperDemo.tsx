
import { FC, useState } from 'react';
import { Stepper } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const steps = [
  {
    id: 'step-1',
    label: 'Step 1',
    description: 'Basic Information',
  },
  {
    id: 'step-2',
    label: 'Step 2',
    description: 'Personal Details',
  },
  {
    id: 'step-3',
    label: 'Step 3',
    description: 'Account Setup',
  },
  {
    id: 'step-4',
    label: 'Step 4',
    description: 'Review & Submit',
  },
];

const StepperDemo: FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <p>
              This is the first step of our multi-step form. Here you would collect basic
              information from the user.
            </p>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Details</h3>
            <p>
              The second step collects more detailed personal information from the user.
            </p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Account Setup</h3>
            <p>
              In this step, the user would set up account credentials and preferences.
            </p>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Review & Submit</h3>
            <p>
              Finally, the user reviews all provided information before submitting the form.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Stepper Component Demo</h1>
          <p className="text-lg text-muted-foreground">
            A reusable stepper component for multi-step forms and wizards
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-4">
          {/* Horizontal Stepper */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Horizontal Stepper</CardTitle>
              <CardDescription>Default orientation with progress tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <Stepper 
                steps={steps} 
                currentStep={currentStep} 
                orientation="horizontal"
                className="mb-8" 
              />
              
              <div className="mt-8 p-4 border rounded-md">
                {renderStepContent()}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep} 
                disabled={currentStep === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button 
                onClick={nextStep} 
                disabled={currentStep === steps.length - 1}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Vertical Stepper */}
          <Card>
            <CardHeader>
              <CardTitle>Vertical Stepper</CardTitle>
              <CardDescription>Alternative orientation for complex forms</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <Stepper 
                  steps={steps} 
                  currentStep={currentStep} 
                  orientation="vertical" 
                />
              </div>
              <div className="md:w-2/3 p-4 border rounded-md">
                {renderStepContent()}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep} 
                disabled={currentStep === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button 
                onClick={nextStep} 
                disabled={currentStep === steps.length - 1}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StepperDemo;
