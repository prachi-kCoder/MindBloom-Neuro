
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from 'lucide-react';
import BehavioralQuestions from './questions/BehavioralQuestions';
import SocialQuestions from './questions/SocialQuestions';
import CognitiveQuestions from './questions/CognitiveQuestions';
import AdaptiveQuestions from './questions/AdaptiveQuestions';
import { toast } from "@/components/ui/use-toast";

interface AssessmentFormProps {
  childAge: number;
  assessmentType: 'video' | 'quiz';
  onComplete: (responses: Record<string, any>) => void;
}

type Domain = 'behavioral' | 'social' | 'cognitive' | 'adaptive';

const AssessmentForm: React.FC<AssessmentFormProps> = ({ childAge, assessmentType, onComplete }) => {
  const [currentDomain, setCurrentDomain] = useState<Domain>('behavioral');
  const [progress, setProgress] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({
    behavioral: {},
    social: {},
    cognitive: {},
    adaptive: {}
  });
  
  // Track domain completion status
  const [domainStatus, setDomainStatus] = useState({
    behavioral: false,
    social: false,
    cognitive: false,
    adaptive: false
  });

  const updateResponses = (domain: Domain, questionResponses: Record<string, any>) => {
    setResponses(prev => ({
      ...prev,
      [domain]: {
        ...prev[domain],
        ...questionResponses
      }
    }));
    
    // Mark the domain as completed
    setDomainStatus(prev => ({
      ...prev,
      [domain]: true
    }));
  };

  const handleDomainComplete = (domain: Domain, questionResponses: Record<string, any>) => {
    updateResponses(domain, questionResponses);
    
    // Update progress
    const domains: Domain[] = ['behavioral', 'social', 'cognitive', 'adaptive'];
    const currentIndex = domains.indexOf(domain);
    const nextDomain = domains[currentIndex + 1];
    
    if (nextDomain) {
      setCurrentDomain(nextDomain);
      setProgress(((currentIndex + 1) / domains.length) * 100);
      window.scrollTo(0, 0);
      toast({
        title: "Section Complete",
        description: `${capitalizeFirstLetter(domain)} section saved. Moving to ${capitalizeFirstLetter(nextDomain)}.`,
      });
    } else {
      // Final domain completed
      setProgress(100);
      toast({
        title: "Assessment Complete",
        description: "Thank you for completing the assessment. Processing your results...",
      });
      setTimeout(() => {
        onComplete(responses);
      }, 1500);
    }
  };

  // Handle manual tab changes
  const handleTabChange = (value: string) => {
    // Only allow navigation to completed domains or the current one
    const selectedDomain = value as Domain;
    const domains: Domain[] = ['behavioral', 'social', 'cognitive', 'adaptive'];
    const currentIndex = domains.indexOf(currentDomain);
    const selectedIndex = domains.indexOf(selectedDomain);
    
    // Allow going back to completed domains or staying on current
    if (domainStatus[selectedDomain] || selectedIndex <= currentIndex) {
      setCurrentDomain(selectedDomain);
    } else {
      toast({
        title: "Complete Current Section",
        description: `Please complete the ${capitalizeFirstLetter(currentDomain)} section before proceeding.`,
        variant: "destructive"
      });
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Update allowed tabs when domain status changes
  useEffect(() => {
    const completedCount = Object.values(domainStatus).filter(Boolean).length;
    setProgress((completedCount / 4) * 100);
  }, [domainStatus]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {assessmentType === 'video' ? 'Follow-Up Assessment' : 'Child Assessment Questionnaire'}
        </h1>
        <p className="text-muted-foreground mb-4">
          {assessmentType === 'video' 
            ? "Please complete the following questions to complement the video analysis." 
            : "Please answer the following questions about your child's behaviors and abilities."}
          The assessment is tailored for a {childAge}-year-old child.
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
      
      <Card className="mb-6">
        <Tabs value={currentDomain} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="behavioral">
              Behavioral
              {domainStatus.behavioral && <span className="ml-1 text-green-500">✓</span>}
            </TabsTrigger>
            <TabsTrigger value="social" disabled={!domainStatus.behavioral && currentDomain !== 'social'}>
              Social
              {domainStatus.social && <span className="ml-1 text-green-500">✓</span>}
            </TabsTrigger>
            <TabsTrigger value="cognitive" disabled={!domainStatus.social && currentDomain !== 'cognitive'}>
              Cognitive
              {domainStatus.cognitive && <span className="ml-1 text-green-500">✓</span>}
            </TabsTrigger>
            <TabsTrigger value="adaptive" disabled={!domainStatus.cognitive && currentDomain !== 'adaptive'}>
              Adaptive
              {domainStatus.adaptive && <span className="ml-1 text-green-500">✓</span>}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="behavioral" className="p-4 md:p-6">
            <BehavioralQuestions 
              childAge={childAge} 
              initialResponses={responses.behavioral}
              onComplete={(responses) => handleDomainComplete('behavioral', responses)} 
            />
          </TabsContent>
          
          <TabsContent value="social" className="p-4 md:p-6">
            <SocialQuestions 
              childAge={childAge} 
              initialResponses={responses.social}
              onComplete={(responses) => handleDomainComplete('social', responses)} 
            />
          </TabsContent>
          
          <TabsContent value="cognitive" className="p-4 md:p-6">
            <CognitiveQuestions 
              childAge={childAge} 
              initialResponses={responses.cognitive}
              onComplete={(responses) => handleDomainComplete('cognitive', responses)} 
            />
          </TabsContent>
          
          <TabsContent value="adaptive" className="p-4 md:p-6">
            <AdaptiveQuestions 
              childAge={childAge} 
              initialResponses={responses.adaptive}
              onComplete={(responses) => handleDomainComplete('adaptive', responses)} 
            />
          </TabsContent>
        </Tabs>
      </Card>
      
      <div className="text-sm text-muted-foreground flex items-center justify-between">
        <div>
          <p>You can save your progress and return later. All information is stored securely.</p>
        </div>
        {currentDomain !== 'behavioral' && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => {
              const domains: Domain[] = ['behavioral', 'social', 'cognitive', 'adaptive'];
              const currentIndex = domains.indexOf(currentDomain);
              const prevDomain = domains[currentIndex - 1];
              setCurrentDomain(prevDomain);
            }}
          >
            <ArrowLeft className="h-3 w-3" /> Previous Section
          </Button>
        )}
      </div>
    </div>
  );
};

export default AssessmentForm;
