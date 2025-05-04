
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import BehavioralQuestions from './questions/BehavioralQuestions';
import SocialQuestions from './questions/SocialQuestions';
import CognitiveQuestions from './questions/CognitiveQuestions';
import AdaptiveQuestions from './questions/AdaptiveQuestions';
import { toast } from "@/components/ui/use-toast";

interface AssessmentFormProps {
  childAge: number;
  onComplete: (responses: Record<string, any>) => void;
}

type Domain = 'behavioral' | 'social' | 'cognitive' | 'adaptive';

const AssessmentForm: React.FC<AssessmentFormProps> = ({ childAge, onComplete }) => {
  const [currentDomain, setCurrentDomain] = useState<Domain>('behavioral');
  const [progress, setProgress] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({
    behavioral: {},
    social: {},
    cognitive: {},
    adaptive: {}
  });

  const updateResponses = (domain: Domain, questionResponses: Record<string, any>) => {
    setResponses(prev => ({
      ...prev,
      [domain]: {
        ...prev[domain],
        ...questionResponses
      }
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

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Child Assessment</h1>
        <p className="text-muted-foreground mb-4">
          Please answer the following questions about your child's behaviors and abilities.
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
        <Tabs value={currentDomain} onValueChange={(value) => setCurrentDomain(value as Domain)} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="behavioral" disabled={currentDomain !== 'behavioral' && progress < 25}>
              Behavioral
            </TabsTrigger>
            <TabsTrigger value="social" disabled={currentDomain !== 'social' && progress < 25}>
              Social
            </TabsTrigger>
            <TabsTrigger value="cognitive" disabled={currentDomain !== 'cognitive' && progress < 50}>
              Cognitive
            </TabsTrigger>
            <TabsTrigger value="adaptive" disabled={currentDomain !== 'adaptive' && progress < 75}>
              Adaptive
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
      
      <div className="text-sm text-muted-foreground">
        <p>You can save your progress and return later. All information is stored securely.</p>
      </div>
    </div>
  );
};

export default AssessmentForm;
