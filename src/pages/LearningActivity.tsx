import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Star, Grid3X3 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import useDyslexiaFont from '@/hooks/useDyslexiaFont';

// Import learning components
import AlphabetLearning from '@/components/learning/AlphabetLearning';
import ColoringActivity from '@/components/learning/ColoringActivity';
import FlashcardActivity from '@/components/learning/FlashcardActivity';
import FullScreenToggle from '@/components/learning/FullScreenToggle';
import MemoryMatchGame from '@/components/learning/MemoryMatchGame';
import WordBuildingGame from '@/components/learning/WordBuildingGame';
import MemoryMazeGame from '@/components/learning/MemoryMazeGame';
import LexiconLeagueGame from '@/components/learning/LexiconLeagueGame';
import WordMatchSafari from '@/components/learning/WordMatchSafari';
import SynonymIslandAdventure from '@/components/learning/SynonymIslandAdventure';
import AntonymMountainTrek from '@/components/learning/AntonymMountainTrek';

// Import required icons
import { BookOpen, BookText, GraduationCap } from 'lucide-react';

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
  const { useDyslexicFont, setUseDyslexicFont } = useDyslexiaFont(disabilityType === 'dyslexia');
  
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Activity configuration based on age group and activity ID
  const getActivityComponent = () => {
    // New synonym and antonym games
    if (activityId === 'word-match-safari') {
      return <WordMatchSafari 
        onProgress={handleProgress} 
        currentStep={currentStep} 
        setCurrentStep={setCurrentStep}
        ageGroup={ageGroup || '8-10'}
        disabilityType={disabilityType}
      />;
    } else if (activityId === 'synonym-island') {
      return <SynonymIslandAdventure 
        onProgress={handleProgress} 
        currentStep={currentStep} 
        setCurrentStep={setCurrentStep}
        ageGroup={ageGroup || '8-10'}
        disabilityType={disabilityType}
      />;
    } else if (activityId === 'antonym-mountain') {
      return <AntonymMountainTrek 
        onProgress={handleProgress} 
        currentStep={currentStep} 
        setCurrentStep={setCurrentStep}
        ageGroup={ageGroup || '10-12'}
        disabilityType={disabilityType}
      />;
    }
    
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
    } else if (activityId === 'memory-maze') {
      return <MemoryMazeGame 
        onProgress={handleProgress} 
        currentStep={currentStep} 
        setCurrentStep={setCurrentStep}
        ageGroup={ageGroup || '8-10'}
        disabilityType={disabilityType}
      />;
    } else if (activityId === 'lexicon-league') {
      return <LexiconLeagueGame 
        onProgress={handleProgress} 
        currentStep={currentStep} 
        setCurrentStep={setCurrentStep}
        ageGroup={ageGroup || '10-12'}
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
        tutorName: "Miss Sarah",
        tutorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
      },
      "coloring": {
        title: "Coloring Fun", 
        description: "Color fun pictures and learn about objects",
        totalSteps: 4,
        tutorName: "Mr. James",
        tutorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
      },
      "word-match-safari": {
        title: "Word Match Safari",
        description: "Match words with their synonyms and antonyms",
        totalSteps: 5,
        tutorName: "Dr. Emma",
        tutorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
        benefits: ["Synonym/Antonym Recognition", "Word Relationships", "Visual Processing", "Vocabulary Building"]
      },
      "synonym-island": {
        title: "Synonym Island Adventure",
        description: "Find the right synonyms to discover hidden treasures",
        totalSteps: 8,
        tutorName: "Captain Lisa",
        tutorAvatar: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=200&h=200&fit=crop&crop=face",
        benefits: ["Synonym Recognition", "Context Understanding", "Reading Comprehension", "Vocabulary Expansion"]
      },
      "antonym-mountain": {
        title: "Antonym Mountain Trek",
        description: "Climb the mountain by selecting correct antonyms",
        totalSteps: 10,
        tutorName: "Guide Michael",
        tutorAvatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=face",
        benefits: ["Antonym Recognition", "Opposite Concepts", "Vocabulary Expansion", "Critical Thinking"]
      },
      "memory-match": {
        title: "Memory Match Game",
        description: "Improve memory skills by matching cards",
        totalSteps: 6,
        tutorName: "Ms. Rachel",
        tutorAvatar: "https://images.unsplash.com/photo-1594824388853-5d78f8b1cb9a?w=200&h=200&fit=crop&crop=face",
        benefits: ["Memory Enhancement", "Pattern Recognition", "Concentration", "Visual Processing"]
      },
      "word-building": {
        title: "Word Building Adventure",
        description: "Build words letter by letter",
        totalSteps: 8,
        tutorName: "Teacher Alex",
        tutorAvatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face",
        benefits: ["Spelling Skills", "Letter Recognition", "Phonics", "Vocabulary Building"]
      }
    };
    
    // Special details for disabilities
    const disabilityDetails: {[key: string]: any} = {
      "dyslexia": {
        // ... keep existing code (all dyslexia-related activity details)
        "word-match-safari": {
          title: "Word Match Safari for Dyslexia",
          description: "Multisensory synonym and antonym matching with color cues",
          benefits: ["Word Relationship Understanding", "Visual-Auditory Association", "Reading Reinforcement"]
        },
        "synonym-island": {
          title: "Synonym Island for Dyslexia",
          description: "Context-based synonym practice with visual supports",
          benefits: ["Context Understanding", "Word Recognition", "Reading Confidence"]
        },
        "antonym-mountain": {
          title: "Antonym Mountain for Dyslexia",
          description: "Opposite word practice with visual and auditory supports",
          benefits: ["Concept Understanding", "Word Discrimination", "Reading Comprehension"]
        }
      },
      "adhd": {
        // ... keep existing code (all ADHD-related activity details)
        "word-match-safari": {
          title: "Focused Word Match Safari",
          description: "Quick-paced synonym and antonym matching with movement interaction",
          benefits: ["Attention Training", "Response Control", "Vocabulary Building"]
        },
        "synonym-island": {
          title: "Active Synonym Island",
          description: "Engaging synonym adventure with frequent rewards",
          benefits: ["Sustained Attention", "Task Completion", "Vocabulary Growth"]
        },
        "antonym-mountain": {
          title: "Antonym Mountain Challenge",
          description: "Progressive difficulty antonym identification with clear rewards",
          benefits: ["Focus Building", "Concept Mastery", "Task Persistence"]
        }
      },
      "asd": {
        // ... keep existing code (all ASD-related activity details)
        "word-match-safari": {
          title: "Structured Word Match Safari",
          description: "Predictable synonym and antonym matching with clear visual organization",
          benefits: ["Word Pattern Recognition", "Category Understanding", "Vocabulary Structure"]
        },
        "synonym-island": {
          title: "Systematic Synonym Island",
          description: "Step-by-step synonym adventure with consistent format",
          benefits: ["Pattern Recognition", "Predictable Learning", "Word Relationships"]
        },
        "antonym-mountain": {
          title: "Sequential Antonym Mountain",
          description: "Structured antonym identification with clear progression",
          benefits: ["Concept Organization", "Pattern Understanding", "Vocabulary Building"]
        }
      }
    };
    
    // Get base activity details
    let details = baseDetails[activityId || "alphabet"] || {
      title: "Learning Activity",
      description: "Interactive learning for development",
      totalSteps: 5,
      tutorName: "Teacher Anna",
      tutorAvatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=200&h=200&fit=crop&crop=face"
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

  // Toggle dyslexia-friendly font
  const toggleDyslexicFont = () => {
    setUseDyslexicFont(!useDyslexicFont);
  };

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
            <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>{title}</h1>
            <p className={`text-muted-foreground ${useDyslexicFont ? 'font-dyslexic' : ''}`}>{description}</p>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleDyslexicFont}
                      className="text-xs"
                    >
                      {useDyslexicFont ? 'Standard Font' : 'Dyslexic Font'}
                    </Button>
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
                      <Progress 
                        value={progress} 
                        className="h-2" 
                        indicatorClassName={`bg-gradient-to-r ${
                          disabilityType === 'dyslexia' ? 'from-soft-pink to-primary' :
                          disabilityType === 'adhd' ? 'from-soft-blue to-primary' :
                          'from-soft-purple to-primary'
                        }`} 
                      />
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
                <h3 className={`text-2xl font-bold mb-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>Excellent Work!</h3>
                <p className={`text-muted-foreground mb-4 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
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
                  <h3 className={`font-semibold text-lg ${useDyslexicFont ? 'font-dyslexic' : ''}`}>{tutorName}</h3>
                  <p className={`text-sm text-muted-foreground ${useDyslexicFont ? 'font-dyslexic' : ''}`}>Your Learning Guide</p>
                </div>
                
                <div className={`text-sm space-y-1 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                  <p className="py-2 border-t">
                    I'll guide you through this activity and provide helpful tips along the way!
                  </p>
                  <p className="italic text-muted-foreground">
                    Parents: Stay nearby to assist when needed
                  </p>
                </div>
              </div>
              
              <div className="bg-card rounded-lg p-5 border mb-6">
                <h3 className={`font-semibold mb-3 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>Learning Benefits</h3>
                <ul className={`text-sm space-y-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
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
                <h3 className={`font-semibold mb-3 flex items-center gap-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                  {disabilityType.charAt(0).toUpperCase() + disabilityType.slice(1)} Support
                </h3>
                <p className={`text-sm ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
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
