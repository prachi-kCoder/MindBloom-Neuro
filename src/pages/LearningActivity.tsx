import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Star, Grid3X3 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

// Import learning components
import AlphabetLearning from '@/components/learning/AlphabetLearning';
import ColoringActivity from '@/components/learning/ColoringActivity';
import FlashcardActivity from '@/components/learning/FlashcardActivity';
import FullScreenToggle from '@/components/learning/FullScreenToggle';
import MemoryMatchGame from '@/components/learning/MemoryMatchGame';
import WordBuildingGame from '@/components/learning/WordBuildingGame';

// Define extended interface for all possible props in components
interface ExtendedActivityProps {
  onProgress: (newProgress: number) => void;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  ageGroup: string;
  disabilityType?: string;
  activityType?: string;
}

const LearningActivity = () => {
  const { ageGroup, activityId } = useParams<{ ageGroup: string, activityId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get disability type from location state
  const disabilityType = location.state?.disabilityType || 'dyslexia';
  
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Activity configuration based on age group and activity ID
  const getActivityComponent = () => {
    // Age group 0-3
    if (ageGroup === '0-3') {
      if (activityId === 'alphabet') {
        return <AlphabetLearning 
          onProgress={handleProgress} 
          currentStep={currentStep} 
          setCurrentStep={setCurrentStep}
          ageGroup={ageGroup}
          disabilityType={disabilityType}
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
    
    // Add new games mapped to their activity IDs
    if (activityId === 'memory-match') {
      return <MemoryMatchGame 
        onProgress={handleProgress} 
        currentStep={currentStep} 
        setCurrentStep={setCurrentStep}
        ageGroup={ageGroup || '0-3'}
        disabilityType={disabilityType}
      />;
    } else if (activityId === 'word-building') {
      return <WordBuildingGame 
        onProgress={handleProgress} 
        currentStep={currentStep} 
        setCurrentStep={setCurrentStep}
        ageGroup={ageGroup || '4-5'}
        disabilityType={disabilityType}
      />;
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

  const handleFullscreenChange = (fullscreenState: boolean) => {
    setIsFullscreen(fullscreenState);
  };

  const goToMoreActivities = () => {
    navigate('/learning', { 
      state: { 
        disabilityType,
        ageGroup,
        showIntro: false 
      } 
    });
  };

  // Activity details based on disability type
  const getActivityDetails = () => {
    const baseDetails: {[key: string]: any} = {
      "alphabet": {
        title: "Alphabet Recognition",
        description: "Learn to recognize letters with fun images and sounds",
        totalSteps: 6,
        tutorName: "Miss Sunny",
        tutorAvatar: "https://ui-avatars.com/api/?name=Miss+Sunny&background=FFD700&color=fff"
      },
      "coloring": {
        title: "Coloring Fun", 
        description: "Color fun pictures and learn about objects",
        totalSteps: 4,
        tutorName: "Mr. Rainbow",
        tutorAvatar: "https://ui-avatars.com/api/?name=Mr+Rainbow&background=6A5ACD&color=fff"
      }
    };
    
    // Special details for disabilities
    const disabilityDetails: {[key: string]: any} = {
      "dyslexia": {
        "alphabet": {
          title: "Letter Recognition for Dyslexia",
          description: "Learn to tell similar letters apart with special techniques",
          benefits: ["Visual Processing", "Letter Recognition", "Reading Readiness"]
        },
        "letter-compare": {
          title: "Similar Letters Comparison",
          description: "Practice identifying commonly confused letters",
          totalSteps: 5,
          tutorName: "Dr. Reader",
          tutorAvatar: "https://ui-avatars.com/api/?name=Dr+Reader&background=FF7F50&color=fff",
          benefits: ["Visual Discrimination", "Letter Recognition", "Reading Confidence"]
        },
        "memory-match": {
          title: "Visual Memory Match",
          description: "Strengthen visual memory with matching pairs",
          benefits: ["Visual Memory", "Pattern Recognition", "Focus Building"]
        },
        "word-building": {
          title: "Word Building for Dyslexia",
          description: "Practice letter arrangement with visual and auditory support",
          benefits: ["Letter Sequencing", "Word Formation", "Phonemic Awareness"]
        }
      },
      "adhd": {
        "alphabet": {
          title: "Focused Alphabet Learning",
          description: "Short, engaging alphabet activities with movement breaks",
          benefits: ["Attention Training", "Focus Building", "Letter Recognition"]
        },
        "focus-game": {
          title: "Focus Challenge",
          description: "Build focus through fun, quick-reward activities",
          totalSteps: 4,
          tutorName: "Coach Attention",
          tutorAvatar: "https://ui-avatars.com/api/?name=Coach+Attention&background=20B2AA&color=fff",
          benefits: ["Sustained Attention", "Task Completion", "Working Memory"]
        },
        "memory-match": {
          title: "Concentration Match",
          description: "Build focus through engaging memory games",
          benefits: ["Attention Training", "Working Memory", "Visual Processing"]
        },
        "word-building": {
          title: "Active Word Building",
          description: "Interactive letter arrangement with movement breaks",
          benefits: ["Focus Development", "Spelling Practice", "Task Completion"]
        }
      },
      "asd": {
        "alphabet": {
          title: "Structured Alphabet Learning",
          description: "Predictable routine for learning letters with visual supports",
          benefits: ["Pattern Recognition", "Visual Learning", "Literacy Foundation"]
        },
        "social-stories": {
          title: "Social Stories",
          description: "Learn social skills through illustrated stories",
          totalSteps: 5,
          tutorName: "Friend Guide",
          tutorAvatar: "https://ui-avatars.com/api/?name=Friend+Guide&background=4682B4&color=fff",
          benefits: ["Social Understanding", "Emotional Recognition", "Conversation Skills"]
        },
        "pattern-match": {
          title: "Pattern Memory Match",
          description: "Predictable memory matching with clear visual feedback",
          benefits: ["Pattern Recognition", "Visual Processing", "Cognitive Organization"]
        },
        "structured-word-building": {
          title: "Structured Word Building",
          description: "Clear, consistent word building with structured approach",
          benefits: ["Visual Learning", "Word Recognition", "Pattern Understanding"]
        }
      }
    };
    
    // Get base activity details
    let details = baseDetails[activityId || "alphabet"] || {
      title: "Learning Activity",
      description: "Interactive learning for development",
      totalSteps: 5,
      tutorName: "Teacher Bloom",
      tutorAvatar: "https://ui-avatars.com/api/?name=Teacher+Bloom&background=9370DB&color=fff"
    };
    
    // Override with disability-specific details if available
    if (disabilityType && disabilityDetails[disabilityType] && disabilityDetails[disabilityType][activityId || ""]) {
      details = { ...details, ...disabilityDetails[disabilityType][activityId || ""] };
    }
    
    if (!details.benefits) {
      details.benefits = ["Cognitive Development", "Fine Motor Skills", "Attention & Focus", "Memory Enhancement"];
    }
    
    return details;
  };

  const { title, description, totalSteps, tutorName, tutorAvatar, benefits } = getActivityDetails();

  useEffect(() => {
    // Reset states when activity changes
    setProgress(0);
    setCurrentStep(0);
    setIsComplete(false);
  }, [ageGroup, activityId]);

  useEffect(() => {
    // Listen for fullscreen changes
    const handleFullScreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  // Get disability-specific styles
  const getDisabilityStyles = () => {
    switch (disabilityType) {
      case 'dyslexia':
        return {
          backgroundColor: 'bg-soft-pink/10',
          textColor: 'text-soft-pink',
          borderColor: 'border-soft-pink',
          icon: <BookOpen className="h-5 w-5 text-soft-pink" />
        };
      case 'adhd':
        return {
          backgroundColor: 'bg-soft-blue/10',
          textColor: 'text-soft-blue',
          borderColor: 'border-soft-blue',
          icon: <Star className="h-5 w-5 text-soft-blue" />
        };
      case 'asd':
        return {
          backgroundColor: 'bg-soft-purple/10',
          textColor: 'text-soft-purple',
          borderColor: 'border-soft-purple',
          icon: <GraduationCap className="h-5 w-5 text-soft-purple" />
        };
      default:
        return {
          backgroundColor: 'bg-primary/10',
          textColor: 'text-primary',
          borderColor: 'border-primary',
          icon: <BookText className="h-5 w-5 text-primary" />
        };
    }
  };

  const disabilityStyles = getDisabilityStyles();

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        {!isFullscreen && (
          <Button 
            variant="ghost" 
            className="mb-6 pl-0" 
            onClick={goToMoreActivities}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Learning Center
          </Button>
        )}
        
        {!isFullscreen && (
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        )}
        
        <div id="learning-content" className={`grid grid-cols-1 lg:grid-cols-12 gap-8 ${isFullscreen ? 'p-4 min-h-screen' : ''}`}>
          <div className={`${isFullscreen ? 'col-span-12' : 'lg:col-span-9'}`}>
            <Card className={`overflow-hidden mb-6 ${isFullscreen ? 'min-h-[calc(100vh-80px)]' : ''}`}>
              <CardContent className="p-0">
                <div className="p-4 bg-muted/30 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`bg-primary text-white text-xs px-3 py-1 rounded-full`}>
                      {ageGroup} Years
                    </div>
                    <div className={`text-xs px-3 py-1 rounded-full ${disabilityStyles.backgroundColor} ${disabilityStyles.textColor}`}>
                      {disabilityType.charAt(0).toUpperCase() + disabilityType.slice(1)} Support
                    </div>
                    {!isFullscreen && (
                      <div className="text-sm text-muted-foreground">
                        Step {currentStep + 1} of {totalSteps}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <FullScreenToggle 
                      containerId="learning-content"
                      onFullscreenChange={handleFullscreenChange} 
                    />
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                </div>
                
                <div className={`p-6 ${isFullscreen ? 'min-h-[calc(100vh-160px)]' : 'min-h-[400px]'}`}>
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
            
            {isComplete && !isFullscreen && (
              <div className="p-6 border rounded-lg bg-muted/20 text-center animate-fade-in">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold mb-2">Excellent Work!</h3>
                <p className="text-muted-foreground mb-4">
                  You've successfully completed this activity. Would you like to try another one?
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <Button variant="outline" onClick={goToMoreActivities}>
                    <Grid3X3 className="mr-2 h-4 w-4" />
                    More Activities
                  </Button>
                  <Button onClick={() => {
                    setIsComplete(false);
                    setProgress(0);
                    setCurrentStep(0);
                  }}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {!isFullscreen && (
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
                  {Array.isArray(benefits) && benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        index % 4 === 0 ? "bg-soft-blue" :
                        index % 4 === 1 ? "bg-soft-pink" :
                        index % 4 === 2 ? "bg-soft-peach" : "bg-soft-purple"
                      }`}></div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className={`rounded-lg p-5 border mb-6 ${disabilityStyles.backgroundColor} ${disabilityStyles.borderColor}`}>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  {disabilityType.charAt(0).toUpperCase() + disabilityType.slice(1)} Support
                </h3>
                <p className="text-sm">
                  {disabilityType === 'dyslexia' && 
                    "These activities provide visual cues and multisensory approaches to help with letter recognition and reading fundamentals."}
                  {disabilityType === 'adhd' && 
                    "Activities feature short, engaging segments with clear rewards to maintain focus and build attention skills."}
                  {disabilityType === 'asd' && 
                    "Clear structure, visual supports, and predictable patterns help make learning accessible and reduce anxiety."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default LearningActivity;

// Import required icons
import { BookOpen, BookText, GraduationCap } from 'lucide-react';
