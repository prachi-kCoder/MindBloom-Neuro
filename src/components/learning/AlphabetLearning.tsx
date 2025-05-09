
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Volume2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AlphabetLearningProps {
  onProgress: (progress: number) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  ageGroup: string;
  disabilityType?: string;
}

// Enhanced alphabet cards with better visual differentiation for dyslexia
const ALPHABET_CARDS = [
  { 
    letter: 'A', 
    word: 'Apple', 
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#FFD6D6',
    sound: '/sounds/a.mp3',
    hint: 'Starts like "aaa" in apple'
  },
  { 
    letter: 'B', 
    word: 'Ball', 
    image: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#D6EEFF',
    sound: '/sounds/b.mp3',
    hint: 'The bump is on the left side'
  },
  { 
    letter: 'D', 
    word: 'Dog', 
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#FFF2D6',
    sound: '/sounds/d.mp3',
    hint: 'The bump is on the right side'
  },
  { 
    letter: 'P', 
    word: 'Pear', 
    image: 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#E5FFD6',
    sound: '/sounds/p.mp3',
    hint: 'The circle is at the top'
  },
  { 
    letter: 'Q', 
    word: 'Queen', 
    image: 'https://images.unsplash.com/photo-1578950435899-d3c33a8450a8?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#D6FFFD',
    sound: '/sounds/q.mp3',
    hint: 'The circle is at the top with a tail'
  },
  { 
    letter: 'M', 
    word: 'Moon', 
    image: 'https://images.unsplash.com/photo-1532013393532-69579b591184?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#E0D6FF',
    sound: '/sounds/m.mp3',
    hint: 'Looks like mountains'
  },
  { 
    letter: 'W', 
    word: 'Water', 
    image: 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#D6E0FF',
    sound: '/sounds/w.mp3',
    hint: 'Looks like waves'
  },
  { 
    letter: 'N', 
    word: 'Nest', 
    image: 'https://images.unsplash.com/photo-1553531384-cc64c5f7f0b8?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#FFE0D6',
    sound: '/sounds/n.mp3',
    hint: 'Like M but with one mountain'
  }
];

// Special cards for dyslexia - focusing on commonly confused letters
const DYSLEXIA_CARDS = [
  { 
    letter: 'b', 
    word: 'ball', 
    image: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#D6EEFF',
    sound: '/sounds/b.mp3',
    hint: 'Stick first, then ball'
  },
  { 
    letter: 'd', 
    word: 'dog', 
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#FFF2D6',
    sound: '/sounds/d.mp3',
    hint: 'Ball first, then stick'
  },
  { 
    letter: 'p', 
    word: 'pear', 
    image: 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#E5FFD6',
    sound: '/sounds/p.mp3',
    hint: 'Stick hanging down, ball at top'
  },
  { 
    letter: 'q', 
    word: 'queen', 
    image: 'https://images.unsplash.com/photo-1578950435899-d3c33a8450a8?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#D6FFFD',
    sound: '/sounds/q.mp3',
    hint: 'Ball first, then stick with tail'
  },
];

// Comparison cards showing similar letters side-by-side
const COMPARISON_CARDS = [
  {
    letters: ['b', 'd'],
    words: ['ball', 'dog'],
    images: [
      'https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=300&h=200&q=80',
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&h=200&q=80'
    ],
    hint: 'b has the stick on the left, d has the stick on the right'
  },
  {
    letters: ['p', 'q'],
    words: ['pear', 'queen'],
    images: [
      'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?auto=format&fit=crop&w=300&h=200&q=80',
      'https://images.unsplash.com/photo-1578950435899-d3c33a8450a8?auto=format&fit=crop&w=300&h=200&q=80'
    ],
    hint: 'p has the stick going down, q has the stick going down with a tail'
  },
  {
    letters: ['m', 'w'],
    words: ['moon', 'water'],
    images: [
      'https://images.unsplash.com/photo-1532013393532-69579b591184?auto=format&fit=crop&w=300&h=200&q=80',
      'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?auto=format&fit=crop&w=300&h=200&q=80'
    ],
    hint: 'm is like mountains going up, w is like mountains upside down'
  }
];

const AlphabetLearning: React.FC<AlphabetLearningProps> = ({ 
  onProgress, 
  currentStep, 
  setCurrentStep,
  ageGroup,
  disabilityType = 'dyslexia'
}) => {
  const [selectedCard, setSelectedCard] = useState<typeof ALPHABET_CARDS[0] | null>(null);
  const [showLetterAnimation, setShowLetterAnimation] = useState(false);
  const [tutorMessage, setTutorMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showComparison, setShowComparison] = useState(currentStep === 2);
  const [activeComparisonIndex, setActiveComparisonIndex] = useState(0);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Select the appropriate card set based on age and disability
  const getCardSet = () => {
    if (disabilityType === 'dyslexia') {
      if (ageGroup === '0-3' || ageGroup === '3-4') {
        return DYSLEXIA_CARDS;
      }
      return [...DYSLEXIA_CARDS, ...ALPHABET_CARDS.slice(4)];
    }
    return ALPHABET_CARDS;
  };

  const cardSet = getCardSet();

  useEffect(() => {
    // Set up tutor messages based on the current step and disability
    const dyslexiaMessages = [
      "Let's learn to tell similar letters apart! Can you see the letters?",
      "Great! Now let's match the letters with pictures",
      "Let's look at letters that look alike. Can you see the difference?",
      "Excellent! Now try to trace the letter in the air with your finger!",
      "Fantastic job! You're learning to spot the differences!"
    ];
    
    const generalMessages = [
      "Let's learn the alphabet! Can you see the letters?",
      "Great! Now let's match the letters with pictures",
      "Let's practice identifying different letters",
      "Perfect! Let's try to draw the letter in the air!",
      "Fantastic job! You're learning so quickly!"
    ];
    
    if (disabilityType === 'dyslexia') {
      setTutorMessage(dyslexiaMessages[currentStep % dyslexiaMessages.length]);
      setShowComparison(currentStep === 2);
    } else {
      setTutorMessage(generalMessages[currentStep % generalMessages.length]);
      setShowComparison(false);
    }
    
    // Calculate progress
    const progress = ((currentStep + 1) / 5) * 100;
    onProgress(progress);
  }, [currentStep, onProgress, disabilityType]);

  const handleCardClick = (card: typeof ALPHABET_CARDS[0]) => {
    setSelectedCard(card);
    setShowLetterAnimation(true);
    setShowHint(false);
    
    // Simulate playing the sound
    console.log(`Playing sound for letter ${card.letter}`);
    
    // Auto advance after animation
    setTimeout(() => {
      setShowLetterAnimation(false);
    }, 2000);
  };

  const handleNextComparison = () => {
    setActiveComparisonIndex((prev) => 
      prev < COMPARISON_CARDS.length - 1 ? prev + 1 : 0
    );
  };

  const handleShowHint = () => {
    if (selectedCard) {
      setShowHint(true);
      toast({
        title: `Hint for letter ${selectedCard.letter}`,
        description: selectedCard.hint,
        duration: 5000,
      });
    }
  };

  // Scroll to top of card container when switching to comparison mode
  useEffect(() => {
    if (showComparison && cardContainerRef.current) {
      cardContainerRef.current.scrollTop = 0;
    }
  }, [showComparison]);

  return (
    <div className="flex flex-col gap-6" ref={cardContainerRef}>
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
      
      <div className="flex justify-center min-h-[180px]">
        <AnimatePresence mode="wait">
          {showLetterAnimation && selectedCard && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="text-center"
            >
              <div 
                className="text-9xl font-bold mb-2" 
                style={{ color: selectedCard.color }}
              >
                {selectedCard.letter}
              </div>
              <p className="text-2xl">{selectedCard.word}</p>
              
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 p-2 bg-muted/50 rounded-lg text-sm"
                >
                  {selectedCard.hint}
                </motion.div>
              )}
              
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="mt-3"
              >
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleShowHint}
                  className="mr-2"
                >
                  <Volume2 className="h-4 w-4 mr-1" /> Hear it
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowLetterAnimation(false)}
                >
                  <RefreshCw className="h-4 w-4 mr-1" /> Try another
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Letter comparison view for dyslexia */}
      {showComparison ? (
        <div className="mb-4">
          <h3 className="font-semibold mb-3 text-center">Letters that look alike</h3>
          <div className="bg-muted/20 rounded-lg p-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-4">
              {COMPARISON_CARDS[activeComparisonIndex].letters.map((letter, idx) => (
                <div 
                  key={letter} 
                  className="flex flex-col items-center"
                >
                  <div className="text-7xl font-bold mb-2" style={{ 
                    color: idx === 0 ? '#D6EEFF' : '#FFF2D6',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {letter}
                  </div>
                  <div className="text-lg mb-2">{COMPARISON_CARDS[activeComparisonIndex].words[idx]}</div>
                  <div className="rounded-lg overflow-hidden w-32 h-32">
                    <img 
                      src={COMPARISON_CARDS[activeComparisonIndex].images[idx]} 
                      alt={COMPARISON_CARDS[activeComparisonIndex].words[idx]} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-muted/30 p-3 rounded-lg text-sm text-center">
              <BookOpen className="inline-block h-4 w-4 mr-1" />
              <span>{COMPARISON_CARDS[activeComparisonIndex].hint}</span>
            </div>
            
            <div className="flex justify-center mt-4">
              <Button onClick={handleNextComparison}>
                See next comparison
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Regular alphabet cards grid
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {cardSet.map((card) => (
            <motion.div
              key={card.letter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
              onClick={() => handleCardClick(card)}
            >
              <div 
                className="rounded-lg p-4 flex flex-col items-center transition-all hover:shadow-md"
                style={{ backgroundColor: card.color }}
              >
                <div className="text-5xl font-bold mb-2">{card.letter}</div>
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

      <div className="flex justify-center mt-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Proper pronunciation is key for development. Click on the letters to hear them!
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
        </div>
      </div>
    </div>
  );
};

export default AlphabetLearning;
