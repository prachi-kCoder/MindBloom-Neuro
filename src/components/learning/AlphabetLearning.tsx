
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, RefreshCw, ChevronLeft, ChevronRight,
  Star, Settings, Lock, Info, Palette
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { speak, stopSpeaking } from '@/utils/textToSpeech';

interface AlphabetLearningProps {
  onProgress: (progress: number) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  ageGroup: string;
  disabilityType?: string;
}

// Enhanced alphabet cards with better visual differentiation
const ALPHABET_CARDS = [
  { 
    letter: 'A', 
    lowercase: 'a',
    word: 'Apple', 
    phoneticSound: 'æ',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#FFD6D6', // Red for vowel
    isVowel: true,
    hint: 'Starts like "aaa" in apple'
  },
  { 
    letter: 'B', 
    lowercase: 'b',
    word: 'Ball', 
    phoneticSound: 'b',
    image: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#D6EEFF', // Blue for consonant
    isVowel: false,
    directionHint: 'left',
    hint: 'The bump is on the left side'
  },
  { 
    letter: 'C', 
    lowercase: 'c',
    word: 'Cat', 
    phoneticSound: 'k',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#D6EEFF', // Blue for consonant
    isVowel: false,
    hint: 'Curves like the letter C'
  },
  { 
    letter: 'D', 
    lowercase: 'd',
    word: 'Dog', 
    phoneticSound: 'd',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#D6EEFF', // Blue for consonant
    isVowel: false,
    directionHint: 'right',
    hint: 'The bump is on the right side'
  },
  { 
    letter: 'E', 
    lowercase: 'e',
    word: 'Elephant', 
    phoneticSound: 'ɛ',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#FFD6D6', // Red for vowel
    isVowel: true,
    hint: 'Sounds like "eh" in elephant'
  },
  { 
    letter: 'F', 
    lowercase: 'f',
    word: 'Fish', 
    phoneticSound: 'f',
    image: 'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#D6EEFF', // Blue for consonant
    isVowel: false,
    hint: 'Has two lines going to the right'
  },
  { 
    letter: 'G', 
    lowercase: 'g',
    word: 'Goat', 
    phoneticSound: 'g',
    image: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#D6EEFF', // Blue for consonant
    isVowel: false,
    hint: 'Looks like a circle with a hook'
  },
  { 
    letter: 'H', 
    lowercase: 'h',
    word: 'Hat', 
    phoneticSound: 'h',
    image: 'https://images.unsplash.com/photo-1561683289-3a9d8f5e8a8c?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#D6EEFF', // Blue for consonant
    isVowel: false,
    hint: 'Has two tall sticks with a bridge'
  },
  { 
    letter: 'I', 
    lowercase: 'i',
    word: 'Igloo', 
    phoneticSound: 'ɪ',
    image: 'https://images.unsplash.com/photo-1548278651-843b1d7431a9?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#FFD6D6', // Red for vowel
    isVowel: true,
    hint: 'Sounds like "ih" in igloo'
  },
  { 
    letter: 'J', 
    lowercase: 'j',
    word: 'Jelly', 
    phoneticSound: 'ʤ',
    image: 'https://images.unsplash.com/photo-1519492164853-9939c37a5780?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#D6EEFF', // Blue for consonant
    isVowel: false,
    hint: 'Looks like a hook going down'
  },
];

// These letters often confuse children with dyslexia
const CONFUSABLE_PAIRS = [
  {
    letters: ['b', 'd'],
    words: ['ball', 'dog'],
    images: [
      'https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=300&h=200&q=80',
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&h=200&q=80'
    ],
    hint: 'b has the bump on the left, d has the bump on the right',
    directions: ['left', 'right']
  },
  {
    letters: ['p', 'q'],
    words: ['pen', 'queen'],
    images: [
      'https://images.unsplash.com/photo-1583069670960-32a5fa8f3389?auto=format&fit=crop&w=300&h=200&q=80',
      'https://images.unsplash.com/photo-1578950435899-d3c33a8450a8?auto=format&fit=crop&w=300&h=200&q=80'
    ],
    hint: 'p has the stick going down, q has the stick going down with a curl',
    directions: ['down', 'down-right']
  },
  {
    letters: ['m', 'w'],
    words: ['moon', 'water'],
    images: [
      'https://images.unsplash.com/photo-1532013393532-69579b591184?auto=format&fit=crop&w=300&h=200&q=80',
      'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?auto=format&fit=crop&w=300&h=200&q=80'
    ],
    hint: 'm is like mountains pointing up, w is like mountains pointing down',
    directions: ['up', 'down']
  }
];

// Stroke order animations for common letters
const STROKE_ORDER_GIFS = {
  'A': 'https://www.animation.com/A_stroke.gif', // Placeholder URLs
  'B': 'https://www.animation.com/B_stroke.gif',
  'a': 'https://www.animation.com/a_stroke.gif',
  'b': 'https://www.animation.com/b_stroke.gif',
};

const AlphabetLearning: React.FC<AlphabetLearningProps> = ({ 
  onProgress, 
  currentStep, 
  setCurrentStep,
  ageGroup,
  disabilityType = 'dyslexia'
}) => {
  // State management
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showBothCases, setShowBothCases] = useState(true);
  const [showLetterAnimation, setShowLetterAnimation] = useState(false);
  const [showStrokeOrder, setShowStrokeOrder] = useState(false);
  const [tutorMessage, setTutorMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showComparison, setShowComparison] = useState(currentStep === 2);
  const [activeComparisonIndex, setActiveComparisonIndex] = useState(0);
  const [starsCollected, setStarsCollected] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isParentMode, setIsParentMode] = useState(false);
  const [disabledLetters, setDisabledLetters] = useState<string[]>([]);
  const [useFemaleVoice, setUseFemaleVoice] = useState(true);
  const [letterStreak, setLetterStreak] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const parentModeLongPressRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const currentCard = ALPHABET_CARDS[currentCardIndex];
  
  // Filter out disabled letters if in parent mode
  const filteredCards = ALPHABET_CARDS.filter(card => !disabledLetters.includes(card.letter));

  useEffect(() => {
    // Set up tutor messages based on the current step
    const messages = [
      "Let's learn our letters! Tap a letter to hear its sound.",
      "Great! Can you match the letters with the pictures?",
      "Let's look at letters that look alike. Can you see the difference?",
      "Excellent! Try tracing the letters in the air with your finger!",
      "Fantastic job! You're learning so quickly!"
    ];
    
    setTutorMessage(messages[currentStep % messages.length]);
    
    // Show comparison view for confusable letters on step 2
    setShowComparison(currentStep === 2);
    
    // Calculate progress
    const progress = ((currentStep + 1) / 5) * 100;
    onProgress(progress);
    
    // Reset states on step change
    setShowLetterAnimation(false);
    setShowStrokeOrder(false);
  }, [currentStep, onProgress]);

  // Handle card taps
  const handleCardTap = (card: typeof ALPHABET_CARDS[0]) => {
    setShowLetterAnimation(true);
    setShowHint(false);
    setShowStrokeOrder(false);
    
    // Speak the letter and its sound
    const letterText = `Big ${card.letter}, little ${card.lowercase}, ${card.phoneticSound} like ${card.word}`;
    speak(letterText, {
      rate: 0.8, 
      pitch: useFemaleVoice ? 1.2 : 0.9,
      onEnd: () => {
        // Update streak and potentially add stars
        const newStreak = letterStreak + 1;
        setLetterStreak(newStreak);
        
        if (newStreak % 5 === 0) {
          const newStars = starsCollected + 1;
          setStarsCollected(newStars);
          setShowConfetti(true);
          
          // Play star collection sound
          speak("You earned a star! Great job!", {
            rate: 1.0,
            pitch: 1.3
          });
          
          setTimeout(() => setShowConfetti(false), 2000);
        }
      }
    });
  };

  // Handle stroke order long press
  const handleLetterLongPressStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      if (currentCard && STROKE_ORDER_GIFS[currentCard.letter as keyof typeof STROKE_ORDER_GIFS]) {
        setShowStrokeOrder(true);
        speak("Let's see how to write this letter!", {
          rate: 0.9,
          pitch: useFemaleVoice ? 1.2 : 0.9
        });
      }
    }, 800);
  };

  const handleLetterLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  // Navigation between cards
  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowLetterAnimation(false);
      setShowStrokeOrder(false);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowLetterAnimation(false);
      setShowStrokeOrder(false);
    }
  };

  // Comparison navigation
  const handleNextComparison = () => {
    setActiveComparisonIndex((prev) => 
      prev < CONFUSABLE_PAIRS.length - 1 ? prev + 1 : 0
    );
  };

  // Show hint
  const handleShowHint = () => {
    if (currentCard) {
      setShowHint(true);
      speak(currentCard.hint, {
        rate: 0.9,
        pitch: useFemaleVoice ? 1.2 : 0.9
      });
    }
  };

  // Parent mode toggle
  const handleParentCornerPress = () => {
    parentModeLongPressRef.current = setTimeout(() => {
      setIsParentMode(!isParentMode);
      toast({
        title: isParentMode ? "Exited Parent Mode" : "Entered Parent Mode",
        description: isParentMode ? "Returning to child view" : "You can now configure settings",
      });
    }, 3000);
  };

  const handleParentCornerRelease = () => {
    if (parentModeLongPressRef.current) {
      clearTimeout(parentModeLongPressRef.current);
      parentModeLongPressRef.current = null;
    }
  };

  // Toggle letter enabled/disabled in parent mode
  const toggleLetterEnabled = (letter: string) => {
    if (disabledLetters.includes(letter)) {
      setDisabledLetters(disabledLetters.filter(l => l !== letter));
    } else {
      setDisabledLetters([...disabledLetters, letter]);
    }
  };

  // Toggle voice gender
  const toggleVoiceGender = () => {
    setUseFemaleVoice(!useFemaleVoice);
    speak(useFemaleVoice ? "Switched to male voice" : "Switched to female voice", {
      pitch: useFemaleVoice ? 0.9 : 1.2,
      rate: 0.9
    });
  };

  // Clean up ongoing speech when component unmounts
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
      if (parentModeLongPressRef.current) clearTimeout(parentModeLongPressRef.current);
    };
  }, []);

  // Scroll to top of card container when switching to comparison mode
  useEffect(() => {
    if (showComparison && cardContainerRef.current) {
      cardContainerRef.current.scrollTop = 0;
    }
  }, [showComparison]);

  return (
    <div className="flex flex-col gap-6" ref={cardContainerRef}>
      {/* Parent Mode Corner - Long press to activate */}
      <div 
        className="absolute top-0 right-0 w-10 h-10 cursor-pointer"
        onTouchStart={handleParentCornerPress}
        onTouchEnd={handleParentCornerRelease}
        onMouseDown={handleParentCornerPress}
        onMouseUp={handleParentCornerRelease}
        onMouseLeave={handleParentCornerRelease}
      >
        {isParentMode && (
          <div className="absolute top-2 right-2">
            <Settings className="h-6 w-6 text-primary" />
          </div>
        )}
      </div>
      
      {/* Stars Display */}
      <div className="absolute top-2 left-2 flex items-center bg-muted/30 px-3 py-1 rounded-full">
        <div className="flex">
          {[...Array(starsCollected)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          ))}
          {starsCollected === 0 && (
            <span className="text-sm text-muted-foreground">Collect stars!</span>
          )}
        </div>
      </div>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Simplified confetti animation */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: 0, 
                  x: 0,
                  opacity: 1 
                }}
                animate={{ 
                  y: Math.random() * 500 - 250, 
                  x: Math.random() * 500 - 250,
                  opacity: 0
                }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute w-2 h-2 rounded-full"
                style={{ 
                  backgroundColor: ['#FFD700', '#FF6B6B', '#4CAF50', '#2196F3'][Math.floor(Math.random() * 4)],
                  top: '50%',
                  left: '50%'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tutor avatar and message bubble */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary">
          <img 
            src="https://images.unsplash.com/photo-1583795128727-6ec3642408f8?auto=format&fit=crop&w=300&h=300&q=80" 
            alt="Teacher" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="bg-muted/30 p-4 rounded-lg border relative flex-1">
          <p className="text-sm">{tutorMessage}</p>
        </div>
      </div>
      
      {/* Settings Panel (visible only in parent mode) */}
      {isParentMode && (
        <div className="bg-muted/20 p-4 rounded-lg border mb-4 animate-fade-in">
          <h3 className="font-semibold mb-3">Parent Settings</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Voice Preference</h4>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleVoiceGender}
                className="w-full"
              >
                {useFemaleVoice ? "Female Voice (Current)" : "Male Voice (Current)"}
              </Button>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Letter Management</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Toggle letters on/off if your child struggles with certain ones:
              </p>
              <div className="flex flex-wrap gap-2">
                {ALPHABET_CARDS.map((card) => (
                  <Button
                    key={card.letter}
                    variant={disabledLetters.includes(card.letter) ? "ghost" : "outline"}
                    size="sm"
                    className={disabledLetters.includes(card.letter) ? "opacity-50" : ""}
                    onClick={() => toggleLetterEnabled(card.letter)}
                  >
                    {card.letter}
                    {disabledLetters.includes(card.letter) && (
                      <Lock className="h-3 w-3 ml-1" />
                    )}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <h4 className="text-sm font-medium mb-1">Usage Statistics</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Time spent: 15 minutes</p>
                <p>Most repeated letter: B (5 times)</p>
                <p>Letters mastered: A, C, E, I</p>
              </div>
            </div>
            
            <Button
              onClick={() => setIsParentMode(false)}
              className="w-full mt-2"
            >
              Exit Parent Mode
            </Button>
          </div>
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="flex justify-center min-h-[180px]">
        <AnimatePresence mode="wait">
          {showLetterAnimation && currentCard && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="text-center"
              onTouchStart={handleLetterLongPressStart}
              onTouchEnd={handleLetterLongPressEnd}
              onMouseDown={handleLetterLongPressStart}
              onMouseUp={handleLetterLongPressEnd}
              onMouseLeave={handleLetterLongPressEnd}
            >
              {/* Upper and lowercase display */}
              <div className="flex justify-center gap-8 mb-4">
                <div>
                  <div 
                    className="text-9xl font-bold mb-2 relative" 
                    style={{ color: currentCard.color }}
                  >
                    {currentCard.letter}
                    {/* Direction hint for confusable letters */}
                    {currentCard.directionHint && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                        <motion.div
                          animate={{ x: currentCard.directionHint === 'left' ? -10 : 10, opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="text-2xl opacity-70"
                        >
                          {currentCard.directionHint === 'left' ? '←' : '→'}
                        </motion.div>
                      </div>
                    )}
                  </div>
                  <p className="text-lg">Uppercase</p>
                </div>
                
                {showBothCases && (
                  <div>
                    <div 
                      className="text-9xl font-bold mb-2 relative" 
                      style={{ color: currentCard.color }}
                    >
                      {currentCard.lowercase}
                      {/* Direction hint for lowercase confusable letters */}
                      {currentCard.directionHint && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                          <motion.div
                            animate={{ x: currentCard.directionHint === 'left' ? -10 : 10, opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="text-2xl opacity-70"
                          >
                            {currentCard.directionHint === 'left' ? '←' : '→'}
                          </motion.div>
                        </div>
                      )}
                    </div>
                    <p className="text-lg">Lowercase</p>
                  </div>
                )}
              </div>
              
              <p className="text-2xl mb-3">{currentCard.word}</p>
              
              {/* Letter image */}
              <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden mb-4">
                <img 
                  src={currentCard.image} 
                  alt={currentCard.word} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Stroke order animation */}
              {showStrokeOrder && STROKE_ORDER_GIFS[currentCard.letter as keyof typeof STROKE_ORDER_GIFS] && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="my-4"
                >
                  <p className="text-sm mb-2">Watch how to write it:</p>
                  <img 
                    src={STROKE_ORDER_GIFS[currentCard.letter as keyof typeof STROKE_ORDER_GIFS]} 
                    alt={`How to write ${currentCard.letter}`}
                    className="w-40 h-40 mx-auto"
                  />
                </motion.div>
              )}
              
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-2 bg-muted/50 rounded-lg text-sm"
                >
                  {currentCard.hint}
                </motion.div>
              )}
              
              <motion.div 
                className="mt-4 flex flex-wrap justify-center gap-2"
              >
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleShowHint}
                >
                  <Info className="h-4 w-4 mr-1" /> Hint
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    handleCardTap(currentCard);
                  }}
                >
                  <Volume2 className="h-4 w-4 mr-1" /> Hear it again
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowLetterAnimation(false)}
                >
                  <RefreshCw className="h-4 w-4 mr-1" /> See all letters
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Letter comparison view for confusable letters */}
      {showComparison && (
        <div className="mb-4">
          <h3 className="font-semibold mb-3 text-center">Letters that look alike</h3>
          <div className="bg-muted/20 rounded-lg p-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-4">
              {CONFUSABLE_PAIRS[activeComparisonIndex].letters.map((letter, idx) => (
                <div 
                  key={letter} 
                  className="flex flex-col items-center"
                >
                  <div className="text-7xl font-bold mb-2 relative" style={{ 
                    color: idx === 0 ? '#D6EEFF' : '#FFF2D6',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {letter}
                    {/* Direction arrows */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                      <motion.div
                        animate={{ 
                          x: CONFUSABLE_PAIRS[activeComparisonIndex].directions[idx] === 'left' ? -10 : 
                             CONFUSABLE_PAIRS[activeComparisonIndex].directions[idx] === 'right' ? 10 : 0,
                          y: CONFUSABLE_PAIRS[activeComparisonIndex].directions[idx] === 'down' ? 10 : 
                             CONFUSABLE_PAIRS[activeComparisonIndex].directions[idx] === 'up' ? -10 : 0,
                          opacity: [0.3, 1, 0.3]
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-2xl opacity-70"
                      >
                        {CONFUSABLE_PAIRS[activeComparisonIndex].directions[idx] === 'left' && '←'}
                        {CONFUSABLE_PAIRS[activeComparisonIndex].directions[idx] === 'right' && '→'}
                        {CONFUSABLE_PAIRS[activeComparisonIndex].directions[idx] === 'down' && '↓'}
                        {CONFUSABLE_PAIRS[activeComparisonIndex].directions[idx] === 'up' && '↑'}
                        {CONFUSABLE_PAIRS[activeComparisonIndex].directions[idx] === 'down-right' && '↘'}
                      </motion.div>
                    </div>
                  </div>
                  <div className="text-lg mb-2">{CONFUSABLE_PAIRS[activeComparisonIndex].words[idx]}</div>
                  <div className="rounded-lg overflow-hidden w-32 h-32">
                    <img 
                      src={CONFUSABLE_PAIRS[activeComparisonIndex].images[idx]} 
                      alt={CONFUSABLE_PAIRS[activeComparisonIndex].words[idx]} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-muted/30 p-3 rounded-lg text-sm text-center">
              <Info className="inline-block h-4 w-4 mr-1" />
              <span>{CONFUSABLE_PAIRS[activeComparisonIndex].hint}</span>
            </div>
            
            <div className="flex justify-center mt-4">
              <Button onClick={handleNextComparison}>
                See next comparison
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main letter grid */}
      {!showComparison && !showLetterAnimation && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredCards.map((card) => (
            <motion.div
              key={card.letter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
              onClick={() => handleCardTap(card)}
            >
              <div 
                className={`rounded-lg p-4 flex flex-col items-center transition-all hover:shadow-md ${
                  card.isVowel ? 'border-2 border-soft-pink' : ''
                }`}
                style={{ backgroundColor: card.color }}
              >
                <div className="text-5xl font-bold mb-2 relative">
                  {card.letter}
                  
                  {/* Direction hint for confusable letters */}
                  {card.directionHint && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                      <div className="text-lg opacity-70">
                        {card.directionHint === 'left' ? '←' : '→'}
                      </div>
                    </div>
                  )}
                </div>
                <div className="rounded overflow-hidden mb-2">
                  <img 
                    src={card.image} 
                    alt={card.word} 
                    className="w-full h-24 object-cover"
                  />
                </div>
                <div className="text-center font-medium">{card.word}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Current letter navigation */}
      {showLetterAnimation && (
        <div className="flex justify-center gap-4 mt-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handlePrevCard}
            disabled={currentCardIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm text-muted-foreground flex items-center">
            Letter {currentCardIndex + 1} of {filteredCards.length}
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleNextCard}
            disabled={currentCardIndex === filteredCards.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex justify-center mt-4">
        <div className="text-center max-w-md">
          <p className="text-sm text-muted-foreground mb-3">
            Click on the letters to hear how they sound! Learning letters is fun!
          </p>
          
          {ageGroup === '0-3' && (
            <p className="text-sm bg-soft-peach/30 p-3 rounded">
              <strong>Parent tip:</strong> Point to objects around the house that start with these letters!
            </p>
          )}
          
          {disabilityType === 'dyslexia' && (
            <p className="text-sm bg-soft-purple/30 p-3 rounded mt-2">
              <strong>Dyslexia tip:</strong> Use multisensory approaches - trace the letters with fingers while saying the sound.
            </p>
          )}
          
          <div className="flex justify-center mt-4">
            {!showLetterAnimation && !showComparison && (
              <div className="flex gap-2">
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowComparison(!showComparison)}
                >
                  {showComparison ? "Show All Letters" : "Compare Similar Letters"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlphabetLearning;
