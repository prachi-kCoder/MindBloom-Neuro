
import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { speak, stopSpeaking } from '@/utils/textToSpeech';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Star, Volume2 } from 'lucide-react';

interface Word {
  id: number;
  text: string;
  type: 'synonym' | 'antonym';
  matches: string[];
  image?: string;
}

// Word lists organized by difficulty level
const wordSets = [
  // Level 1 - Happy Theme
  [
    { id: 1, text: "Happy", type: "synonym", matches: ["Glad", "Joyful", "Cheerful"] },
    { id: 2, text: "Happy", type: "antonym", matches: ["Sad", "Upset", "Miserable"] }
  ],
  // Level 2 - Size Theme
  [
    { id: 3, text: "Big", type: "synonym", matches: ["Huge", "Large", "Giant"] },
    { id: 4, text: "Big", type: "antonym", matches: ["Small", "Tiny", "Little"] }
  ],
  // Level 3 - Speed Theme
  [
    { id: 5, text: "Fast", type: "synonym", matches: ["Quick", "Speedy", "Rapid"] },
    { id: 6, text: "Fast", type: "antonym", matches: ["Slow", "Sluggish", "Crawling"] }
  ],
  // Level 4 - Intelligence Theme
  [
    { id: 7, text: "Smart", type: "synonym", matches: ["Clever", "Bright", "Intelligent"] },
    { id: 8, text: "Smart", type: "antonym", matches: ["Foolish", "Silly", "Dumb"] }
  ],
  // Level 5 - Temperature Theme
  [
    { id: 9, text: "Hot", type: "synonym", matches: ["Warm", "Boiling", "Fiery"] },
    { id: 10, text: "Hot", type: "antonym", matches: ["Cold", "Freezing", "Cool"] }
  ],
];

interface WordMatchSafariProps {
  onProgress: (newProgress: number) => void;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  ageGroup: string;
  disabilityType?: string;
}

const WordMatchSafari: React.FC<WordMatchSafariProps> = ({ 
  onProgress, 
  currentStep, 
  setCurrentStep,
  ageGroup,
  disabilityType
}) => {
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [wordSet, setWordSet] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [draggedWord, setDraggedWord] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [useDyslexicFont, setUseDyslexicFont] = useState(disabilityType === 'dyslexia');
  
  const { toast } = useToast();
  const controls = useAnimation();
  const dragControls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Initialize the game
  useEffect(() => {
    if (level < wordSets.length) {
      const currentLevelWords = wordSets[level];
      setWordSet(currentLevelWords);
      
      // Select a word for this round (alternate between synonyms and antonyms)
      const wordIndex = level % 2;
      const word = currentLevelWords[wordIndex];
      setCurrentWord(word);
      
      // Create options with correct matches and distractors
      const allOptions = [...word.matches];
      
      // Add distractors from other levels
      const distractors = wordSets
        .flatMap(set => set
          .filter(w => w.id !== word.id && w.type !== word.type)
          .flatMap(w => w.matches)
        )
        .slice(0, 3);
      
      allOptions.push(...distractors);
      
      // Shuffle options
      setOptions(allOptions.sort(() => Math.random() - 0.5).slice(0, 4));
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setGameComplete(true);
      onProgress(100);
    }
  }, [level]);
  
  // Start the game
  const handleStartGame = () => {
    speak("Welcome to Word Match Safari! Match words with their synonyms or antonyms.");
    setGameStarted(true);
    onProgress(10);
  };
  
  // Handle word selection
  const handleOptionSelect = (option: string) => {
    if (isCorrect !== null) return; // Already answered
    
    setSelectedOption(option);
    
    if (currentWord && currentWord.matches.includes(option)) {
      setIsCorrect(true);
      speak("Correct! Great job!", { pitch: 1.2 });
      toast({
        title: "Correct! 🎉",
        description: `"${option}" is ${currentWord.type === 'synonym' ? 'similar to' : 'opposite of'} "${currentWord.text}"`,
      });
      
      setTimeout(() => {
        setScore(score + 1);
        nextWord();
      }, 1500);
    } else {
      setIsCorrect(false);
      speak("Not quite. Try again!", { pitch: 0.9 });
      toast({
        title: "Not quite right",
        description: "Try again!",
        variant: "destructive",
      });
      
      // Reset after a delay
      setTimeout(() => {
        setSelectedOption(null);
        setIsCorrect(null);
      }, 1500);
    }
  };
  
  // Handle drag start
  const handleDragStart = (option: string) => {
    speak(option);
    setDraggedWord(option);
  };
  
  // Handle drag end
  const handleDragEnd = (event: any, option: string) => {
    if (!containerRef.current || !currentWord) return;
    
    // Get the container's position
    const container = containerRef.current.getBoundingClientRect();
    
    // Check if dropped in the target area
    const targetAreas = document.querySelectorAll('.target-area');
    let droppedOnTarget = false;
    
    targetAreas.forEach(targetEl => {
      const target = targetEl.getBoundingClientRect();
      
      if (
        event.clientX >= target.left &&
        event.clientX <= target.right &&
        event.clientY >= target.top &&
        event.clientY <= target.bottom
      ) {
        const targetType = targetEl.getAttribute('data-type');
        droppedOnTarget = true;
        
        // Check if correct match
        const isMatch = 
          (targetType === 'synonym' && currentWord.type === 'synonym' && currentWord.matches.includes(option)) ||
          (targetType === 'antonym' && currentWord.type === 'antonym' && currentWord.matches.includes(option));
        
        handleOptionSelect(option);
      }
    });
    
    // If not dropped on target, animate back to original position
    if (!droppedOnTarget) {
      dragControls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 300 } });
    }
    
    setDraggedWord(null);
  };

  // Move to next word
  const nextWord = () => {
    if (level < wordSets.length - 1) {
      setLevel(level + 1);
      onProgress(((level + 1) / wordSets.length) * 100);
    } else {
      setGameComplete(true);
      onProgress(100);
      speak("Congratulations! You've completed Word Match Safari!");
    }
  };
  
  // Handle speaking the current word
  const speakWord = (text: string) => {
    speak(text);
  };

  // Reset game state for replay
  const resetGame = () => {
    setLevel(0);
    setScore(0);
    setGameComplete(false);
    setSelectedOption(null);
    setIsCorrect(null);
    onProgress(0);
  };
  
  // Game intro screen
  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <h2 className={`text-3xl font-bold mb-6 text-center ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
          Word Match Safari
        </h2>
        <div className="mb-8 text-center max-w-lg">
          <p className={`text-lg mb-4 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
            Welcome to the jungle! Help the monkeys find the right word matches.
            Drag the word to the correct monkey - Synonyms (similar words) or Antonyms (opposite words).
          </p>
          <div className="flex gap-4 justify-center mb-6">
            <div className="text-center">
              <div className="h-10 w-20 rounded-md bg-green-100 border-2 border-green-500 flex items-center justify-center mb-2">
                <span className={`${useDyslexicFont ? 'font-dyslexic' : ''}`}>Happy</span>
              </div>
              <span className={`text-sm text-green-600 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>Synonyms</span>
            </div>
            
            <div className="text-center">
              <div className="h-10 w-20 rounded-md bg-red-100 border-2 border-red-500 flex items-center justify-center mb-2">
                <span className={`${useDyslexicFont ? 'font-dyslexic' : ''}`}>Sad</span>
              </div>
              <span className={`text-sm text-red-600 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>Antonyms</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <Button 
            onClick={() => setUseDyslexicFont(!useDyslexicFont)}
            variant="outline"
          >
            {useDyslexicFont ? 'Use Standard Font' : 'Use Dyslexia-Friendly Font'}
          </Button>
          
          <Button onClick={handleStartGame} className="px-8 py-6 text-lg">
            Start Game
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
          Congratulations!
        </h2>
        <div className="flex items-center justify-center mb-8">
          {[...Array(Math.min(5, score))].map((_, i) => (
            <Star key={i} className="w-12 h-12 text-yellow-400 fill-yellow-400" />
          ))}
        </div>
        <p className={`text-xl mb-8 text-center ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
          You've completed the Word Match Safari with {score} correct matches!
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
          <h3 className={`text-lg font-semibold ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
            Level {level + 1} of {wordSets.length}
          </h3>
          <div className="flex items-center">
            <span className={`text-sm mr-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>Score:</span>
            <div className="flex">
              {[...Array(score)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
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
      
      {/* Game content */}
      <div className="flex flex-col items-center flex-1" ref={containerRef}>
        {/* Current word to match */}
        {currentWord && (
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-1">
              <Button variant="ghost" size="sm" onClick={() => speakWord(currentWord.text)}>
                <Volume2 className="h-4 w-4 mr-1" />
                <span className={`${useDyslexicFont ? 'font-dyslexic' : ''}`}>Listen</span>
              </Button>
            </div>
            <p className="text-sm mb-2">Find a {currentWord.type === 'synonym' ? 'word similar to' : 'word opposite of'}:</p>
            <div 
              className={`text-3xl font-bold p-4 rounded-lg inline-block
                ${currentWord.type === 'synonym' ? 'bg-green-100 text-green-800 border-2 border-green-500' : 'bg-red-100 text-red-800 border-2 border-red-500'}
                ${useDyslexicFont ? 'font-dyslexic' : ''}
              `}
            >
              {currentWord.text}
            </div>
          </div>
        )}
        
        {/* Target areas */}
        <div className="w-full flex justify-around mb-12">
          <div 
            className={`target-area flex-1 p-4 rounded-lg bg-green-50 border-2 border-green-200 flex flex-col items-center ${
              isCorrect !== null && currentWord?.type === 'synonym' ? 
                (isCorrect ? 'border-green-500 bg-green-100' : 'border-red-300 bg-red-50') : ''
            }`}
            data-type="synonym"
          >
            <div className="mb-2 w-16 h-16 rounded-full bg-green-200 flex items-center justify-center">
              <span className="text-2xl">🐵</span>
            </div>
            <p className={`text-lg font-medium text-green-700 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
              Synonyms
            </p>
            <p className={`text-xs text-green-600 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
              (similar words)
            </p>
          </div>
          
          <div className="w-8"></div>
          
          <div 
            className={`target-area flex-1 p-4 rounded-lg bg-red-50 border-2 border-red-200 flex flex-col items-center ${
              isCorrect !== null && currentWord?.type === 'antonym' ? 
                (isCorrect ? 'border-green-500 bg-green-100' : 'border-red-300 bg-red-50') : ''
            }`}
            data-type="antonym"
          >
            <div className="mb-2 w-16 h-16 rounded-full bg-red-200 flex items-center justify-center">
              <span className="text-2xl">🐵</span>
            </div>
            <p className={`text-lg font-medium text-red-700 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
              Antonyms
            </p>
            <p className={`text-xs text-red-600 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
              (opposite words)
            </p>
          </div>
        </div>
        
        {/* Word options */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          {options.map((option, index) => (
            <motion.div
              key={index}
              drag
              dragControls={dragControls}
              onDragStart={() => handleDragStart(option)}
              onDragEnd={(e) => handleDragEnd(e, option)}
              whileDrag={{ scale: 1.05, zIndex: 10 }}
              whileTap={{ scale: 0.95 }}
              animate={option === selectedOption ? { scale: isCorrect ? 1.05 : 0.95 } : { scale: 1 }}
              className={`
                p-4 rounded-lg border-2 cursor-pointer text-center
                ${selectedOption === option ? 
                  (isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500') : 
                  'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'}
              `}
              onClick={() => speakWord(option)}
            >
              <div className="flex justify-end mb-1">
                <Volume2 className="h-3 w-3 text-gray-400" />
              </div>
              <span className={`text-xl ${useDyslexicFont ? 'font-dyslexic' : ''}`}>{option}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordMatchSafari;
