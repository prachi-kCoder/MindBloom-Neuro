
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AssessmentIntro from '@/components/assessment/AssessmentIntro';
import AssessmentForm from '@/components/assessment/AssessmentForm';
import AssessmentComplete from '@/components/assessment/AssessmentComplete';

const Assessment = () => {
  const [assessmentStep, setAssessmentStep] = useState<'intro' | 'form' | 'complete'>('intro');
  const [childAge, setChildAge] = useState<number | null>(null);
  const [assessmentResponses, setAssessmentResponses] = useState<Record<string, any>>({});

  const startAssessment = (age: number) => {
    setChildAge(age);
    setAssessmentStep('form');
  };

  const completeAssessment = (responses: Record<string, any>) => {
    setAssessmentResponses(responses);
    setAssessmentStep('complete');
    // In a real application, you would send this data to your backend
    console.log("Assessment responses:", responses);
  };

  const resetAssessment = () => {
    setAssessmentStep('intro');
    setChildAge(null);
    setAssessmentResponses({});
  };

  return (
    <MainLayout>
      <div className="container py-12 px-4 md:px-6">
        {assessmentStep === 'intro' && (
          <AssessmentIntro onStart={startAssessment} />
        )}
        {assessmentStep === 'form' && childAge !== null && (
          <AssessmentForm 
            childAge={childAge} 
            onComplete={completeAssessment} 
          />
        )}
        {assessmentStep === 'complete' && (
          <AssessmentComplete 
            responses={assessmentResponses}
            onReset={resetAssessment} 
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Assessment;
