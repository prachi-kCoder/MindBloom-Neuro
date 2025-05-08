
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import AssessmentIntro from '@/components/assessment/AssessmentIntro';
import AssessmentForm from '@/components/assessment/AssessmentForm';
import VideoAnalysis from '@/components/assessment/VideoAnalysis';
import AssessmentComplete from '@/components/assessment/AssessmentComplete';
import AssessmentTypeSelection from '@/components/assessment/AssessmentTypeSelection';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

const Assessment = () => {
  const [assessmentStep, setAssessmentStep] = useState<'intro' | 'type-selection' | 'video' | 'form' | 'complete'>('intro');
  const [assessmentType, setAssessmentType] = useState<'video' | 'quiz' | null>(null);
  const [childAge, setChildAge] = useState<number | null>(null);
  const [assessmentResponses, setAssessmentResponses] = useState<Record<string, any>>({});
  const [videoResponses, setVideoResponses] = useState<Record<string, any>>({});
  const navigate = useNavigate();

  const startAssessment = (age: number) => {
    setChildAge(age);
    setAssessmentStep('type-selection');
  };

  const selectAssessmentType = (type: 'video' | 'quiz') => {
    setAssessmentType(type);
    if (type === 'video') {
      setAssessmentStep('video');
    } else {
      setAssessmentStep('form');
    }
  };

  const handleVideoComplete = (responses: Record<string, any>) => {
    setVideoResponses(responses);
    setAssessmentStep('form');
  };

  const skipVideo = () => {
    setAssessmentStep('form');
  };

  const completeAssessment = (responses: Record<string, any>) => {
    const combinedResponses = assessmentType === 'video' 
      ? { ...responses, video_analysis: videoResponses }
      : responses;
      
    setAssessmentResponses(combinedResponses);
    setAssessmentStep('complete');
    // In a real application, you would send this data to your backend
    console.log("Assessment responses:", combinedResponses);
  };

  const resetAssessment = () => {
    setAssessmentStep('intro');
    setChildAge(null);
    setAssessmentType(null);
    setAssessmentResponses({});
    setVideoResponses({});
  };

  const goBack = () => {
    if (assessmentStep === 'form') {
      if (assessmentType === 'video') {
        setAssessmentStep('video');
      } else {
        setAssessmentStep('type-selection');
      }
    } else if (assessmentStep === 'video') {
      setAssessmentStep('type-selection');
    } else if (assessmentStep === 'type-selection') {
      setAssessmentStep('intro');
    } else if (assessmentStep === 'intro') {
      navigate('/');
    }
  };

  return (
    <MainLayout>
      <div className="container py-12 px-4 md:px-6">
        {/* Back button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 hover:bg-muted" 
            onClick={goBack}
          >
            <ArrowLeft className="h-4 w-4" />
            {assessmentStep === 'intro' ? 'Return to Home' : 
              assessmentStep === 'type-selection' ? 'Back to Introduction' :
              assessmentStep === 'video' ? 'Back to Assessment Type' : 
              assessmentStep === 'form' && assessmentType === 'video' ? 'Back to Video Analysis' : 
              assessmentStep === 'form' && assessmentType === 'quiz' ? 'Back to Assessment Type' : ''}
          </Button>
        </div>
        
        {assessmentStep === 'intro' && (
          <AssessmentIntro onStart={startAssessment} />
        )}
        {assessmentStep === 'type-selection' && (
          <AssessmentTypeSelection onSelect={selectAssessmentType} />
        )}
        {assessmentStep === 'video' && childAge !== null && (
          <VideoAnalysis 
            childAge={childAge}
            onComplete={handleVideoComplete}
            onSkip={skipVideo}
          />
        )}
        {assessmentStep === 'form' && childAge !== null && (
          <AssessmentForm 
            childAge={childAge}
            assessmentType={assessmentType || 'quiz'}
            onComplete={completeAssessment}
          />
        )}
        {assessmentStep === 'complete' && (
          <AssessmentComplete 
            responses={assessmentResponses}
            assessmentType={assessmentType || 'quiz'}
            onReset={resetAssessment} 
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Assessment;
