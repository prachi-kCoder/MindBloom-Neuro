
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { speak, stopSpeaking } from '@/utils/textToSpeech';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, MapPin, Star, Volume2 } from 'lucide-react';

// Define the sentence challenge structure
interface Challenge {
  id: number;
  sentence: string;
  targetWord: string;
  targetWordPosition: number; // Word position in the sentence (for highlighting)
  options: string[];
  correctAnswer: string;
  hint?: string;
}

// Game levels with sentence challenges
const gameLevels: Challenge[][] = [
  // Level 1
  [
    {
      id: 1,
      sentence: "The happy girl smiled all day.",
      targetWord: "happy",
      targetWordPosition: 1,
      options: ["joyful", "careful", "famous", "tired"],
      correctAnswer: "joyful",
      hint: "How does someone feel when they smile all day?"
    },
    {
      id: 2,
      sentence: "The big dog barked loudly.",
      targetWord: "big",
      targetWordPosition: 1,
      options: ["large", "strong", "brown", "scary"],
      correctAnswer: "large",
      hint: "What's another word that describes size?"
    }
  ],
  // Level 2
  [
    {
      id: 3,
      sentence: "She ran fast to catch the bus.",
      targetWord: "fast",
      targetWordPosition: 2,
      options: ["slowly", "quickly", "carefully", "loudly"],
      correctAnswer: "quickly",
      hint: "If you want to catch a bus, how should you run?"
    },
    {
      id: 4,
      sentence: "The smart student answered all questions.",
      targetWord: "smart",
      targetWordPosition: 1,
      options: ["clever", "young", "quiet", "tall"],
      correctAnswer: "clever",
      hint: "What's a word that describes someone who can answer all questions?"
    }
  ],
  // Level 3
  [
    {
      id: 5,
      sentence: "The brave knight fought the dragon.",
      targetWord: "brave",
      targetWordPosition: 1,
      options: ["strong", "courageous", "tall", "angry"],
      correctAnswer: "courageous",
      hint: "What quality would a knight need to fight a dragon?"
    },
    {
      id: 6,
      sentence: "The road was wet after the storm.",
      targetWord: "wet",
      targetWordPosition: 3,
      options: ["damp", "long", "dark", "muddy"],
      correctAnswer: "damp",
      hint: "How would a road feel after rain?"
    }
  ],
  // Level 4
  [
    {
      id: 7,
      sentence: "The old man walked with a cane.",
      targetWord: "old",
      targetWordPosition: 1,
      options: ["elderly", "kind", "tall", "wise"],
      correctAnswer: "elderly",
      hint: "What's another word to describe someone of advanced age?"
    },
    {
      id: 8,
      sentence: "The child was afraid of the dark.",
      targetWord: "afraid",
      targetWordPosition: 3,
      options: ["scared", "tired", "crying", "small"],
      correctAnswer: "scared",
      hint: "How do you feel when you fear something?"
    }
  ]
];

interface SynonymIslandAdventureProps {
  onProgress: (newProgress: number) => void;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  ageGroup: string;
  disabilityType?: string;
}

const SynonymIslandAdventure: React.FC<SynonymIslandAdventureProps> = ({
  onProgress,
  currentStep,
  setCurrentStep,
  ageGroup,
  disabilityType
}) => {
  const [level, setLevel] = useState(0);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [islandPosition, setIslandPosition] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [treasureCollected, setTreasureCollected] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [useDyslexicFont, setUseDyslexicFont] = useState(disabilityType === 'dyslexia');
  
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Current challenge
  const currentChallenge = level < gameLevels.length && challengeIndex < gameLevels[level].length
    ? gameLevels[level][challengeIndex]
    : null;
  
  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      stopSpeaking();
    };
  }, []);
  
  // Update progress based on level and challenge
  useEffect(() => {
    if (gameStarted && !gameComplete) {
      const totalChallenges = gameLevels.flat().length;
      const completedChallenges = level * gameLevels[0].length + challengeIndex;
      const progress = Math.floor((completedChallenges / totalChallenges) * 100);
      onProgress(progress);
    }
  }, [level, challengeIndex, gameStarted, gameComplete]);
  
  // Start the game
  const handleStartGame = () => {
    setGameStarted(true);
    speak("Welcome to Synonym Island Adventure! Help find the treasure by choosing the right synonym in each sentence.");
    onProgress(5);
  };
  
  // Handle option selection
  const handleOptionSelect = (option: string) => {
    if (isCorrect !== null || !currentChallenge) return; // Already answered
    
    setSelectedOption(option);
    
    if (option === currentChallenge.correctAnswer) {
      setIsCorrect(true);
      setScore(score + 1);
      setTreasureCollected(treasureCollected + 1);
      
      speak("Correct! You found a treasure!", { pitch: 1.2 });
      // Play success sound
      playSound('success');
      
      toast({
        title: "Treasure Found! 🎉",
        description: `"${option}" is a perfect synonym for "${currentChallenge.targetWord}"`,
      });
      
      // Move to next challenge after delay
      setTimeout(() => {
        nextChallenge();
      }, 2000);
    } else {
      setIsCorrect(false);
      speak("Not quite right. Try again or use a hint!", { pitch: 0.9 });
      playSound('incorrect');
      
      toast({
        title: "Not the right word",
        description: "Try again or use a hint!",
        variant: "destructive",
      });
      
      // Reset after delay
      setTimeout(() => {
        setSelectedOption(null);
        setIsCorrect(null);
      }, 2000);
    }
  };
  
  // Move to next challenge
  const nextChallenge = () => {
    if (!currentChallenge) return;
    
    // Move island position
    setIslandPosition(islandPosition + 1);
    
    // Check if we have more challenges at this level
    if (challengeIndex < gameLevels[level].length - 1) {
      setChallengeIndex(challengeIndex + 1);
    } else if (level < gameLevels.length - 1) {
      // Move to next level
      setLevel(level + 1);
      setChallengeIndex(0);
    } else {
      // Game complete
      setGameComplete(true);
      onProgress(100);
      speak("Congratulations! You've found all the treasures on Synonym Island!");
    }
    
    // Reset state for next challenge
    setSelectedOption(null);
    setIsCorrect(null);
    setShowHint(false);
  };

  // Play sound effects
  const playSound = (type: 'success' | 'incorrect' | 'hint') => {
    if (!audioRef.current) return;
    
    // These would be actual sound file URLs in a real implementation
    const sounds = {
      success: 'https://example.com/success.mp3',
      incorrect: 'https://example.com/incorrect.mp3',
      hint: 'https://example.com/hint.mp3'
    };
    
    try {
      // For now, we'll just use the Web Speech API instead of actual audio files
      if (type === 'success') {
        speak("Yarr! Treasure found!", { pitch: 1.5, rate: 1.1 });
      } else if (type === 'incorrect') {
        speak("Not quite, matey!", { pitch: 0.8, rate: 0.9 });
      } else if (type === 'hint') {
        speak("Here's a hint for ye!", { pitch: 1.2, rate: 1.0 });
      }
    } catch (e) {
      console.error("Error playing sound:", e);
    }
  };
  
  // Handle speaking the sentence
  const speakSentence = (text: string) => {
    speak(text);
  };
  
  // Toggle hint
  const toggleHint = () => {
    if (!showHint && currentChallenge?.hint) {
      setShowHint(true);
      playSound('hint');
      speak(currentChallenge.hint);
    } else {
      setShowHint(false);
    }
  };

  // Reset game
  const resetGame = () => {
    setLevel(0);
    setChallengeIndex(0);
    setScore(0);
    setIslandPosition(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowHint(false);
    setTreasureCollected(0);
    setGameComplete(false);
    onProgress(0);
  };
  
  // Render sentence with highlighted target word
  const renderSentence = (sentence: string, targetWord: string, targetPosition: number) => {
    const words = sentence.split(' ');
    
    return (
      <div className="flex flex-wrap justify-center gap-x-2">
        {words.map((word, index) => {
          const cleanWord = word.replace(/[.,!?;:]/g, '');
          const punctuation = word.substring(cleanWord.length);
          
          return (
            <span key={index} className="inline-block">
              <span 
                className={`${index === targetPosition ? 'bg-yellow-200 px-1 py-0.5 rounded' : ''} ${useDyslexicFont ? 'font-dyslexic' : ''}`}
              >
                {cleanWord}
              </span>
              {punctuation}
            </span>
          );
        })}
      </div>
    );
  };
  
  // Game intro screen
  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <h2 className={`text-3xl font-bold mb-6 text-center ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
          Synonym Island Adventure
        </h2>
        <div className="mb-8 text-center max-w-lg">
          <div className="text-5xl mb-4">🏝️</div>
          <p className={`text-lg mb-4 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
            Ahoy, Matey! Set sail to Synonym Island and search for hidden word treasures! 
            Replace words in sentences with the best synonym to unlock treasure chests.
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
            Start Adventure
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
          Adventure Complete!
        </h2>
        <div className="text-6xl mb-6">🏆</div>
        <div className="flex items-center justify-center mb-6">
          {[...Array(Math.min(5, treasureCollected))].map((_, i) => (
            <span key={i} className="text-3xl">💎</span>
          ))}
        </div>
        <p className={`text-xl mb-8 text-center ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
          You've found {treasureCollected} treasures on Synonym Island!
        </p>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={resetGame}
            className="px-6 py-2"
          >
            Play Again
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
            <MapPin className="h-4 w-4 mr-1 text-primary" />
            <h3 className={`text-lg font-semibold ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
              Island {level + 1}, Treasure {challengeIndex + 1}
            </h3>
          </div>
          <div className="flex items-center">
            <span className={`text-sm mr-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>Treasures:</span>
            <div className="flex">
              {[...Array(treasureCollected)].map((_, i) => (
                <span key={i} className="text-sm mr-1">💎</span>
              ))}
            </div>
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
      
      {/* Island progression */}
      <div className="relative h-8 mb-6">
        <div className="absolute inset-0 bg-blue-100 rounded-full"></div>
        <div 
          className="absolute left-0 top-0 h-full bg-blue-300 rounded-full transition-all duration-500" 
          style={{ width: `${(islandPosition / gameLevels.flat().length) * 100}%` }}
        ></div>
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-lg">
          🏁
        </div>
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 text-lg transition-all duration-500" 
          style={{ left: `${(islandPosition / gameLevels.flat().length) * 100}%` }}
        >
          🚢
        </div>
      </div>
      
      {/* Challenge content */}
      {currentChallenge && (
        <div className="flex flex-col items-center flex-1 max-w-2xl mx-auto">
          {/* Sentence */}
          <Card className="w-full mb-6 p-6 bg-gradient-to-r from-blue-50 to-teal-50">
            <div className="mb-4 text-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => speakSentence(currentChallenge.sentence)}
                className="mb-2"
              >
                <Volume2 className="h-4 w-4 mr-1" />
                <span className={useDyslexicFont ? 'font-dyslexic' : ''}>Listen</span>
              </Button>
              <div className="text-xl mb-4">
                {renderSentence(
                  currentChallenge.sentence,
                  currentChallenge.targetWord,
                  currentChallenge.targetWordPosition
                )}
              </div>
              <p className={`text-sm text-muted-foreground ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                Find a better word for <span className="font-medium text-primary">{currentChallenge.targetWord}</span>
              </p>
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
          
          {/* Treasure chest */}
          <div className="mb-8 text-center">
            <div className="text-4xl mb-2">
              {isCorrect === true ? '🎁' : '🧰'}
            </div>
            <p className={`text-sm ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
              {isCorrect === true 
                ? 'Treasure found!' 
                : isCorrect === false 
                ? 'Keep trying!' 
                : 'Choose a synonym to unlock the treasure'}
            </p>
          </div>
          
          {/* Word options */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {currentChallenge.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  p-4 rounded-lg border-2 text-center transition-colors
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
                <span className={`text-lg ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                  {option}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SynonymIslandAdventure;
