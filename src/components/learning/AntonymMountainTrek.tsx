
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { speak, stopSpeaking } from '@/utils/textToSpeech';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Map, Star, Volume2 } from 'lucide-react';

// Define the challenge structure
interface Challenge {
  id: number;
  word: string;
  options: string[];
  correctAnswer: string;
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Game levels with increasing difficulty
const challenges: Challenge[] = [
  // Easy challenges
  {
    id: 1,
    word: "Hot",
    options: ["Cold", "Warm", "Boiling", "Cool"],
    correctAnswer: "Cold",
    hint: "Think about the opposite temperature",
    difficulty: 'easy'
  },
  {
    id: 2,
    word: "Big",
    options: ["Huge", "Small", "Large", "Medium"],
    correctAnswer: "Small",
    hint: "Think about opposite sizes",
    difficulty: 'easy'
  },
  {
    id: 3,
    word: "Fast",
    options: ["Quick", "Slow", "Rapid", "Swift"],
    correctAnswer: "Slow",
    hint: "Think about speed",
    difficulty: 'easy'
  },
  // Medium challenges
  {
    id: 4,
    word: "Ancient",
    options: ["Old", "Modern", "Historic", "Antique"],
    correctAnswer: "Modern",
    hint: "Think about time periods",
    difficulty: 'medium'
  },
  {
    id: 5,
    word: "Generous",
    options: ["Kind", "Selfish", "Giving", "Charitable"],
    correctAnswer: "Selfish",
    hint: "Think about how someone shares",
    difficulty: 'medium'
  },
  {
    id: 6,
    word: "Brave",
    options: ["Courageous", "Bold", "Fearful", "Strong"],
    correctAnswer: "Fearful",
    hint: "Think about facing dangers",
    difficulty: 'medium'
  },
  // Hard challenges
  {
    id: 7,
    word: "Transparent",
    options: ["Clear", "Opaque", "See-through", "Crystalline"],
    correctAnswer: "Opaque",
    hint: "Can you see through it?",
    difficulty: 'hard'
  },
  {
    id: 8,
    word: "Abundant",
    options: ["Plentiful", "Scarce", "Rich", "Numerous"],
    correctAnswer: "Scarce",
    hint: "Think about quantity or availability",
    difficulty: 'hard'
  },
  {
    id: 9,
    word: "Expand",
    options: ["Grow", "Contract", "Stretch", "Enlarge"],
    correctAnswer: "Contract",
    hint: "Think about size changing",
    difficulty: 'hard'
  },
  {
    id: 10,
    word: "Fresh",
    options: ["New", "Stale", "Recent", "Crisp"],
    correctAnswer: "Stale",
    hint: "Think about food quality",
    difficulty: 'hard'
  }
];

interface AntonymMountainTrekProps {
  onProgress: (newProgress: number) => void;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  ageGroup: string;
  disabilityType?: string;
}

const AntonymMountainTrek: React.FC<AntonymMountainTrekProps> = ({
  onProgress,
  currentStep,
  setCurrentStep,
  ageGroup,
  disabilityType
}) => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [climbHeight, setClimbHeight] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [useDyslexicFont, setUseDyslexicFont] = useState(disabilityType === 'dyslexia');
  
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Current challenge
  const currentChallenge = challengeIndex < challenges.length
    ? challenges[challengeIndex]
    : null;
  
  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      stopSpeaking();
    };
  }, []);
  
  // Update progress based on challenge index
  useEffect(() => {
    if (gameStarted && !gameComplete) {
      const progress = Math.floor(((challengeIndex) / challenges.length) * 100);
      onProgress(progress);
      
      // Update climb height (visual representation of progress)
      setClimbHeight(progress);
    }
  }, [challengeIndex, gameStarted, gameComplete]);
  
  // Start the game
  const handleStartGame = () => {
    setGameStarted(true);
    speak("Welcome to Antonym Mountain Trek! Choose the opposite word to climb higher up the mountain!");
    onProgress(5);
  };
  
  // Handle option selection
  const handleOptionSelect = (option: string) => {
    if (isCorrect !== null || !currentChallenge) return; // Already answered
    
    setSelectedOption(option);
    
    if (option === currentChallenge.correctAnswer) {
      setIsCorrect(true);
      setScore(score + 1);
      setConsecutiveCorrect(consecutiveCorrect + 1);
      
      // Special celebration for consecutive correct answers
      if ((consecutiveCorrect + 1) % 3 === 0) {
        speak("Amazing! You're climbing so fast!", { pitch: 1.3, rate: 1.1 });
        toast({
          title: "Great climbing streak! 🏔️",
          description: "You're on fire! Keep going!",
        });
      } else {
        speak("Correct! Keep climbing!", { pitch: 1.2 });
        toast({
          title: "Correct! 🧗‍♂️",
          description: `"${option}" is the antonym of "${currentChallenge.word}"`,
        });
      }
      
      // Move to next challenge after delay
      setTimeout(() => {
        nextChallenge();
      }, 1500);
    } else {
      setIsCorrect(false);
      setConsecutiveCorrect(0); // Reset consecutive streak
      
      speak("Not quite right. You slipped a little!", { pitch: 0.9 });
      toast({
        title: "Careful! Slippery slope!",
        description: "Try again or use a hint!",
        variant: "destructive",
      });
      
      // Reset after delay, but don't move backward
      setTimeout(() => {
        setSelectedOption(null);
        setIsCorrect(null);
      }, 1500);
    }
  };
  
  // Move to next challenge
  const nextChallenge = () => {
    if (!currentChallenge) return;
    
    // Check if we have more challenges
    if (challengeIndex < challenges.length - 1) {
      setChallengeIndex(challengeIndex + 1);
    } else {
      // Game complete
      setGameComplete(true);
      onProgress(100);
      speak("Congratulations! You've reached the top of Antonym Mountain!");
    }
    
    // Reset state for next challenge
    setSelectedOption(null);
    setIsCorrect(null);
    setShowHint(false);
  };

  // Handle speaking the word
  const speakWord = (text: string) => {
    speak(text);
  };
  
  // Toggle hint
  const toggleHint = () => {
    if (!showHint && currentChallenge?.hint) {
      setShowHint(true);
      speak(currentChallenge.hint);
    } else {
      setShowHint(false);
    }
  };

  // Reset game
  const resetGame = () => {
    setChallengeIndex(0);
    setScore(0);
    setClimbHeight(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowHint(false);
    setConsecutiveCorrect(0);
    setGameComplete(false);
    onProgress(0);
  };
  
  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };
  
  // Game intro screen
  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <h2 className={`text-3xl font-bold mb-6 text-center ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
          Antonym Mountain Trek
        </h2>
        <div className="mb-8 text-center max-w-lg">
          <div className="text-5xl mb-4">🏔️</div>
          <p className={`text-lg mb-4 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
            Challenge yourself to climb Antonym Mountain! Choose the correct opposite word (antonym) 
            for each challenge to climb higher. Be careful not to slip!
          </p>
          <p className={`text-sm mb-4 text-muted-foreground ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
            The mountain gets steeper as you climb - early challenges are easier, and they get harder as you go!
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <Button 
            onClick={() => setUseDyslexicFont(!useDyslexicFont)}
            variant="outline"
          >
            {useDyslexicFont ? 'Use Standard Font' : 'Use Dyslexia-Friendly Font'}
          </Button>
          
          <Button onClick={handleStartGame} className="px-8 py-6 text-lg">
            Start Climbing
          </Button>
        </div>
      </div>
    );
  }
  
  // Game completion screen
  if (gameComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <h2 className={`text-3xl font-bold mb-6 text-center ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
          Summit Reached!
        </h2>
        <div className="text-6xl mb-6">🏔️</div>
        <div className="flex items-center justify-center mb-6">
          {[...Array(Math.min(5, Math.ceil(score / 2)))].map((_, i) => (
            <Star key={i} className="h-8 w-8 text-yellow-400 fill-yellow-400" />
          ))}
        </div>
        <p className={`text-xl mb-8 text-center ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
          You reached the top of Antonym Mountain with {score} out of {challenges.length} correct answers!
        </p>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={resetGame}
            className="px-6 py-2"
          >
            Climb Again
          </Button>
          <Button 
            onClick={() => {
              setCurrentStep(currentStep + 1);
            }}
            className="px-6 py-2"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Game header */}
      <div className="flex justify-between items-center mb-4 py-2 px-4 rounded-lg bg-muted/20">
        <div>
          <div className="flex items-center">
            <Map className="h-4 w-4 mr-1 text-primary" />
            <h3 className={`text-lg font-semibold ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
              Challenge {challengeIndex + 1} of {challenges.length}
            </h3>
          </div>
          <div className="flex items-center">
            <span className={`text-sm mr-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>Height:</span>
            <Progress 
              value={climbHeight} 
              className="h-2 w-20" 
              indicatorClassName="bg-gradient-to-r from-green-400 to-blue-500" 
            />
          </div>
        </div>
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setUseDyslexicFont(!useDyslexicFont)}
          >
            {useDyslexicFont ? 'Standard Font' : 'Dyslexic Font'}
          </Button>
        </div>
      </div>
      
      {/* Mountain climbing visualization */}
      <div className="relative h-28 mb-6 bg-gradient-to-t from-green-200 to-sky-200 rounded-lg overflow-hidden">
        <div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-200 to-amber-50 transition-all duration-500" 
          style={{ height: `${100 - climbHeight}%` }}
        ></div>
        
        {/* Climber character */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-500"
          style={{ bottom: `${climbHeight}%` }}
        >
          <div className="text-2xl">🧗‍♂️</div>
        </div>
        
        {/* Mountain peak */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
          <div className="text-2xl">🏔️</div>
        </div>
      </div>
      
      {/* Challenge content */}
      {currentChallenge && (
        <div className="flex flex-col items-center flex-1 max-w-2xl mx-auto">
          {/* Word to find antonym for */}
          <Card className="w-full mb-6 p-6">
            <div className="flex justify-between items-center mb-4">
              <div className={`px-3 py-1 rounded-full text-sm border ${getDifficultyColor(currentChallenge.difficulty)}`}>
                {currentChallenge.difficulty.charAt(0).toUpperCase() + currentChallenge.difficulty.slice(1)}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => speakWord(currentChallenge.word)}
              >
                <Volume2 className="h-4 w-4 mr-1" />
                <span className={useDyslexicFont ? 'font-dyslexic' : ''}>Listen</span>
              </Button>
            </div>
            
            <div className="text-center mb-4">
              <p className={`text-sm mb-1 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>Find the opposite (antonym) of:</p>
              <h3 className={`text-3xl font-bold text-red-600 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                {currentChallenge.word}
              </h3>
            </div>
            
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleHint}
                className="text-sm"
              >
                {showHint ? 'Hide Hint' : 'Need a Hint?'}
              </Button>
            </div>
            
            {showHint && currentChallenge.hint && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-center"
              >
                <p className={`text-sm text-amber-800 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                  {currentChallenge.hint}
                </p>
              </motion.div>
            )}
          </Card>
          
          {/* Word options */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {currentChallenge.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  p-5 rounded-lg border-2 text-center transition-colors
                  ${selectedOption === option
                    ? isCorrect
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : 'bg-red-100 border-red-500 text-red-800'
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }
                `}
                onClick={() => {
                  speak(option);
                  handleOptionSelect(option);
                }}
              >
                <span className={`text-xl ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                  {option}
                </span>
              </motion.button>
            ))}
          </div>
          
          {/* Consecutive correct indicator */}
          {consecutiveCorrect > 0 && (
            <div className="mt-6 text-center">
              <p className={`text-sm text-primary ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                Climbing streak: {consecutiveCorrect} in a row!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AntonymMountainTrek;
