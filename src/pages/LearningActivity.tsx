
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

// Import specific learning components
import AlphabetLearning from '@/components/learning/AlphabetLearning';
import ColoringActivity from '@/components/learning/ColoringActivity';
import FlashcardActivity from '@/components/learning/FlashcardActivity';

const LearningActivity = () => {
  const { ageGroup, activityId } = useParams<{ ageGroup: string, activityId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Activity configuration based on age group and activity ID
  const getActivityComponent = () => {
    if (ageGroup === '0-3') {
      if (activityId === 'alphabet') {
        return <AlphabetLearning 
          onProgress={handleProgress} 
          currentStep={currentStep} 
          setCurrentStep={setCurrentStep}
          ageGroup={ageGroup}
        />;
      } else if (activityId === 'coloring') {
        return <ColoringActivity 
          onProgress={handleProgress} 
          currentStep={currentStep} 
          setCurrentStep={setCurrentStep}
          ageGroup={ageGroup}
        />;
      }
    }
    
    // Default component for activities not yet implemented
    return <FlashcardActivity 
      onProgress={handleProgress} 
      currentStep={currentStep} 
      setCurrentStep={setCurrentStep}
      ageGroup={ageGroup || '0-3'} 
      activityType={activityId || 'general'}
    />;
  };

  const handleProgress = (newProgress: number) => {
    setProgress(newProgress);
    if (newProgress >= 100) {
      setIsComplete(true);
      toast({
        title: "Activity Complete! 🎉",
        description: "Great job! You've finished this activity.",
      });
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(((currentStep + 1) / (totalSteps - 1)) * 100);
    } else {
      setIsComplete(true);
      setProgress(100);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setProgress((currentStep / (totalSteps - 1)) * 100);
    }
  };

  // Activity details
  const getActivityDetails = () => {
    if (ageGroup === '0-3') {
      if (activityId === 'alphabet') {
        return {
          title: "Alphabet Recognition",
          description: "Learn to recognize letters with fun images and sounds",
          totalSteps: 6,
          tutorName: "Miss Sunny",
          tutorAvatar: "https://ui-avatars.com/api/?name=Miss+Sunny&background=FFD700&color=fff"
        };
      } else if (activityId === 'coloring') {
        return {
          title: "Coloring Fun",
          description: "Color fun pictures and learn about objects",
          totalSteps: 4,
          tutorName: "Mr. Rainbow",
          tutorAvatar: "https://ui-avatars.com/api/?name=Mr+Rainbow&background=6A5ACD&color=fff"
        };
      }
    }
    
    // Default activity details
    return {
      title: "Learning Activity",
      description: "Interactive learning for development",
      totalSteps: 5,
      tutorName: "Teacher Bloom",
      tutorAvatar: "https://ui-avatars.com/api/?name=Teacher+Bloom&background=9370DB&color=fff"
    };
  };

  const { title, description, totalSteps, tutorName, tutorAvatar } = getActivityDetails();

  useEffect(() => {
    // Reset states when activity changes
    setProgress(0);
    setCurrentStep(0);
    setIsComplete(false);
  }, [ageGroup, activityId]);

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 pl-0" 
          onClick={() => navigate('/learning')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Learning Center
        </Button>
        
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9">
            <Card className="overflow-hidden mb-6">
              <CardContent className="p-0">
                <div className="p-4 bg-muted/30 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary text-white text-xs px-3 py-1 rounded-full">
                      {ageGroup} Years
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Step {currentStep + 1} of {totalSteps}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
                
                <div className="p-6 min-h-[400px]">
                  {getActivityComponent()}
                </div>
                
                <div className="px-6 py-4 border-t bg-muted/10">
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="outline" 
                      onClick={handlePrevious} 
                      disabled={currentStep === 0}
                    >
                      Previous
                    </Button>
                    <div className="w-1/2">
                      <Progress value={progress} className="h-2" />
                    </div>
                    <Button
                      onClick={handleNext}
                      disabled={isComplete || currentStep === totalSteps - 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {isComplete && (
              <div className="p-6 border rounded-lg bg-muted/20 text-center animate-fade-in">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold mb-2">Excellent Work!</h3>
                <p className="text-muted-foreground mb-4">
                  You've successfully completed this activity. Would you like to try another one?
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={() => navigate('/learning')}>
                    More Activities
                  </Button>
                  <Button onClick={() => {
                    setIsComplete(false);
                    setProgress(0);
                    setCurrentStep(0);
                  }}>
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-3">
            <div className="bg-card rounded-lg p-5 border mb-6">
              <div className="flex flex-col items-center text-center mb-4">
                <Avatar className="h-20 w-20 mb-3">
                  <AvatarImage src={tutorAvatar} alt={tutorName} />
                  <AvatarFallback>{tutorName[0]}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{tutorName}</h3>
                <p className="text-sm text-muted-foreground">Your Learning Guide</p>
              </div>
              
              <div className="text-sm space-y-1">
                <p className="py-2 border-t">
                  I'll guide you through this activity and provide helpful tips along the way!
                </p>
                <p className="italic text-muted-foreground">
                  Parents: Stay nearby to assist when needed
                </p>
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-5 border mb-6">
              <h3 className="font-semibold mb-3">Learning Benefits</h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-soft-blue"></div>
                  <span>Cognitive Development</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-soft-pink"></div>
                  <span>Fine Motor Skills</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-soft-peach"></div>
                  <span>Attention & Focus</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-soft-purple"></div>
                  <span>Memory Enhancement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LearningActivity;
