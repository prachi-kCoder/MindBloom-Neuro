
// Import only what's needed for this component
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { speak, stopSpeaking } from '@/utils/textToSpeech';

// Define the types for the component props
interface WordMatchSafariProps {
  onProgress: (progress: number) => void;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  ageGroup: string;
  disabilityType?: string;
}

// Define the Word type
interface Word {
  id: number;
  text: string;
  type: "synonym" | "antonym";
  matches: string[];
}

const wordSets: { [key: string]: Word[] } = {
  "8-10": [
    { id: 1, text: "happy", type: "synonym", matches: ["glad", "cheerful", "joyful"] },
    { id: 2, text: "big", type: "synonym", matches: ["huge", "large", "giant"] },
    { id: 3, text: "fast", type: "synonym", matches: ["quick", "speedy", "rapid"] },
    { id: 4, text: "smart", type: "synonym", matches: ["clever", "bright", "intelligent"] },
    { id: 5, text: "hot", type: "antonym", matches: ["cold", "freezing", "cool"] },
    { id: 6, text: "loud", type: "antonym", matches: ["quiet", "soft", "silent"] },
    { id: 7, text: "brave", type: "antonym", matches: ["cowardly", "timid", "scared"] },
    { id: 8, text: "light", type: "antonym", matches: ["dark", "dim", "shadowy"] },
  ],
  "10-12": [
    { id: 1, text: "abundant", type: "synonym", matches: ["plentiful", "copious", "ample"] },
    { id: 2, text: "peculiar", type: "synonym", matches: ["strange", "odd", "unusual"] },
    { id: 3, text: "diligent", type: "synonym", matches: ["hardworking", "industrious", "persistent"] },
    { id: 4, text: "intelligent", type: "synonym", matches: ["smart", "bright", "clever"] },
    { id: 5, text: "include", type: "antonym", matches: ["exclude", "omit", "reject"] },
    { id: 6, text: "permanent", type: "antonym", matches: ["temporary", "brief", "fleeting"] },
    { id: 7, text: "encourage", type: "antonym", matches: ["discourage", "dissuade", "deter"] },
    { id: 8, text: "ancient", type: "antonym", matches: ["modern", "recent", "new"] },
  ]
};

const WordMatchSafari: React.FC<WordMatchSafariProps> = ({ 
  onProgress, 
  currentStep, 
  setCurrentStep,
  ageGroup,
  disabilityType = "dyslexia"
}) => {
  // Define states for the game
  const [words, setWords] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word>({ id: 0, text: "", type: "synonym", matches: [] });
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions] = useState(8); // Total number of questions
  const [gameComplete, setGameComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  
  // Initialize the game
  useEffect(() => {
    const selectedWordSet = wordSets[ageGroup] || wordSets["8-10"];
    setWords(selectedWordSet);
    
    if (selectedWordSet.length > 0) {
      const firstWord = selectedWordSet[0];
      setCurrentWord(firstWord);
      generateOptions(firstWord);
    }
  }, [ageGroup]);
  
  // Generate options for the current word
  const generateOptions = (word: Word) => {
    // Get one correct option from matches
    const correctOption = word.matches[Math.floor(Math.random() * word.matches.length)];
    
    // Get incorrect options from other words
    let incorrectOptions: string[] = [];
    const otherWords = wordSets[ageGroup].filter(w => w.id !== word.id);
    
    // Try to get options of the same type (synonym/antonym) for coherence
    const sameTypeWords = otherWords.filter(w => w.type === word.type);
    
    // Get 3 incorrect options
    for (let i = 0; i < 3; i++) {
      const randomWordPool = sameTypeWords.length >= 3 ? sameTypeWords : otherWords;
      const randomWord = randomWordPool[Math.floor(Math.random() * randomWordPool.length)];
      const randomMatch = randomWord.matches[Math.floor(Math.random() * randomWord.matches.length)];
      
      // Ensure no duplicates
      if (!incorrectOptions.includes(randomMatch) && randomMatch !== correctOption) {
        incorrectOptions.push(randomMatch);
      } else {
        // If duplicate, try again with a different approach
        const backupOptions = ["amazing", "terrible", "awesome", "awful", "excellent", "poor", "wonderful", "horrible"];
        const backupOption = backupOptions[Math.floor(Math.random() * backupOptions.length)];
        if (!incorrectOptions.includes(backupOption) && backupOption !== correctOption) {
          incorrectOptions.push(backupOption);
        }
      }
    }
    
    // Make sure we have 3 incorrect options
    incorrectOptions = incorrectOptions.slice(0, 3);
    
    // Combine and shuffle options
    const allOptions = [correctOption, ...incorrectOptions];
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }
    
    setOptions(allOptions);
  };
  
  // Check if the selected option is correct
  const checkAnswer = (option: string) => {
    setSelectedOption(option);
    
    // Stop any ongoing speech
    stopSpeaking();
    
    const isMatch = currentWord.matches.includes(option);
    setIsCorrect(isMatch);
    
    if (isMatch) {
      setScore(score + 1);
      speak(`Correct! ${currentWord.text} and ${option} are ${currentWord.type === "synonym" ? "synonyms" : "antonyms"}.`);
    } else {
      speak(`Not quite. Let's try another one.`);
    }
    
    // Calculate progress
    const questionNumber = words.findIndex(w => w.id === currentWord.id) + 1;
    const progressValue = (questionNumber / totalQuestions) * 100;
    onProgress(progressValue);
    
    // Move to next question after a delay
    setTimeout(() => {
      const currentIndex = words.findIndex(w => w.id === currentWord.id);
      
      if (currentIndex < words.length - 1) {
        const nextWord = words[currentIndex + 1];
        setCurrentWord(nextWord);
        generateOptions(nextWord);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        // Game complete
        setGameComplete(true);
        onProgress(100);
      }
    }, 2000);
  };
  
  // Start the game
  const startGame = () => {
    setGameStarted(true);
    setShowInstructions(false);
    
    // Explain first question
    const wordType = currentWord.type === "synonym" ? "means the same as" : "means the opposite of";
    speak(`Find a word that ${wordType} ${currentWord.text}`);
  };
  
  // Read the word aloud
  const readWord = (word: string) => {
    stopSpeaking();
    speak(word);
  };
  
  return (
    <div className="flex flex-col items-center">
      {showInstructions && !gameStarted ? (
        <div className="text-center max-w-md mx-auto">
          <div className="text-6xl mb-4">🦁</div>
          <h2 className="text-2xl font-bold mb-4">Word Match Safari</h2>
          <p className="mb-6">
            Help our safari explorer match words with their 
            {ageGroup === "8-10" ? " similar and opposite meanings!" : " synonyms and antonyms!"}
          </p>
          <div className="bg-muted/30 p-4 rounded-lg mb-6">
            <p className="font-medium mb-2">How to Play:</p>
            <ol className="text-left text-sm space-y-2">
              <li>1. You'll see a word at the top of the screen</li>
              <li>2. Pick a word with a {ageGroup === "8-10" ? "similar or opposite" : "synonymous or antonymous"} meaning</li>
              <li>3. Synonyms are in <span className="text-green-600 font-medium">green</span></li>
              <li>4. Antonyms are in <span className="text-red-600 font-medium">red</span></li>
              <li>5. Click any word to hear it spoken</li>
            </ol>
          </div>
          <Button onClick={startGame}>Start Safari Adventure</Button>
        </div>
      ) : gameComplete ? (
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold mb-4">Safari Complete!</h2>
          <p className="text-lg mb-6">
            You scored {score} out of {totalQuestions}!
          </p>
          <Button 
            onClick={() => {
              setGameStarted(false);
              setShowInstructions(true);
              setGameComplete(false);
              setScore(0);
              setCurrentStep(0);
              onProgress(0);
              
              // Reset to first word
              if (words.length > 0) {
                const firstWord = words[0];
                setCurrentWord(firstWord);
                generateOptions(firstWord);
                setSelectedOption(null);
                setIsCorrect(null);
              }
            }}
          >
            Play Again
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground mb-1">
              Question {words.findIndex(w => w.id === currentWord.id) + 1} of {totalQuestions}
            </p>
            <Progress value={(words.findIndex(w => w.id === currentWord.id) + 1) / totalQuestions * 100} className="h-2" />
          </div>
          
          <div className="flex justify-center mb-6">
            <Card 
              className={`w-full p-6 text-center cursor-pointer ${
                currentWord.type === "synonym" 
                  ? "border-green-200 bg-green-50/50" 
                  : "border-red-200 bg-red-50/50"
              }`}
              onClick={() => readWord(currentWord.text)}
            >
              <div className="mb-2 text-sm font-medium">
                Find a {currentWord.type === "synonym" ? "synonym" : "antonym"} for:
              </div>
              <div className="text-3xl font-bold">
                {currentWord.text}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                (Click to hear the word)
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {options.map((option, index) => (
              <motion.button
                key={index}
                className={`p-4 rounded-lg text-center border-2 transition-colors ${
                  selectedOption === option
                    ? isCorrect 
                      ? "border-green-500 bg-green-100" 
                      : "border-red-500 bg-red-100"
                    : "border-muted hover:border-primary/30 hover:bg-muted/20"
                }`}
                onClick={() => !selectedOption && checkAnswer(option)}
                whileHover={{ scale: selectedOption ? 1 : 1.05 }}
                whileTap={{ scale: selectedOption ? 1 : 0.95 }}
              >
                <div 
                  className="text-lg font-medium"
                  onClick={(e) => {
                    if (!selectedOption) {
                      e.stopPropagation();
                      readWord(option);
                    }
                  }}
                >
                  {option}
                </div>
              </motion.button>
            ))}
          </div>
          
          {selectedOption && (
            <div className={`mt-6 p-3 rounded-lg text-center ${
              isCorrect 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}>
              <p className="font-medium">
                {isCorrect 
                  ? `Correct! "${currentWord.text}" and "${selectedOption}" are ${currentWord.type === "synonym" ? "synonyms" : "antonyms"}.` 
                  : `Try again! "${selectedOption}" is not a ${currentWord.type} for "${currentWord.text}".`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WordMatchSafari;
