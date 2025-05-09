
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface AlphabetLearningProps {
  onProgress: (progress: number) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  ageGroup: string;
}

// Alphabet cards with images that look similar but have different starting letters
// Focus on commonly confused letters like b/d, p/q, etc.
const ALPHABET_CARDS = [
  { 
    letter: 'A', 
    word: 'Apple', 
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#FFD6D6',
    sound: '/sounds/a.mp3'
  },
  { 
    letter: 'B', 
    word: 'Ball', 
    image: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#D6EEFF',
    sound: '/sounds/b.mp3'
  },
  { 
    letter: 'D', 
    word: 'Dog', 
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#FFF2D6',
    sound: '/sounds/d.mp3'
  },
  { 
    letter: 'P', 
    word: 'Pear', 
    image: 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#E5FFD6',
    sound: '/sounds/p.mp3'
  },
  { 
    letter: 'Q', 
    word: 'Queen', 
    image: 'https://images.unsplash.com/photo-1578950435899-d3c33a8450a8?auto=format&fit=crop&w=300&h=200&q=80',
    color: '#D6FFFD',
    sound: '/sounds/q.mp3'
  }
];

const AlphabetLearning: React.FC<AlphabetLearningProps> = ({ 
  onProgress, 
  currentStep, 
  setCurrentStep,
  ageGroup 
}) => {
  const [selectedCard, setSelectedCard] = useState<typeof ALPHABET_CARDS[0] | null>(null);
  const [showLetterAnimation, setShowLetterAnimation] = useState(false);
  const [tutorMessage, setTutorMessage] = useState("");

  useEffect(() => {
    // Set up tutor messages based on the current step
    const messages = [
      "Let's learn the alphabet! Can you see the letters?",
      "Great! Now let's match the letters with pictures",
      "Excellent! Do you see the difference between B and D?",
      "Perfect! Let's try to draw the letter in the air!",
      "Fantastic job! You're learning so quickly!"
    ];
    
    setTutorMessage(messages[currentStep % messages.length]);
    
    // Calculate progress
    const progress = ((currentStep + 1) / 5) * 100;
    onProgress(progress);
  }, [currentStep, onProgress]);

  const handleCardClick = (card: typeof ALPHABET_CARDS[0]) => {
    setSelectedCard(card);
    setShowLetterAnimation(true);
    
    // Simulate playing the sound
    console.log(`Playing sound for letter ${card.letter}`);
    
    // Auto advance after animation
    setTimeout(() => {
      setShowLetterAnimation(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tutor message bubble */}
      <div className="bg-muted/30 p-4 rounded-lg border relative">
        <div className="absolute left-4 -top-3 w-6 h-6 bg-soft-purple rounded-full flex items-center justify-center">
          👨‍🏫
        </div>
        <p className="pl-6 text-sm">{tutorMessage}</p>
      </div>
      
      <div className="flex justify-center">
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!showLetterAnimation && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {ALPHABET_CARDS.map((card) => (
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
        </div>
      </div>
    </div>
  );
};

export default AlphabetLearning;
