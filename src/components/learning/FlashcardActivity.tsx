
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface FlashcardActivityProps {
  onProgress: (progress: number) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  ageGroup: string;
  activityType: string;
}

// Generate flashcards based on age group and activity type
const getFlashcards = (ageGroup: string, activityType: string) => {
  // Alphabet flashcards - commonly confused letters
  if (activityType === 'alphabet' || activityType === 'phonics') {
    return [
      { id: 1, front: 'B', back: 'Ball', image: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=300&h=200&q=80' },
      { id: 2, front: 'D', back: 'Dog', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&h=200&q=80' },
      { id: 3, front: 'P', back: 'Pencil', image: 'https://images.unsplash.com/photo-1582120030057-4b5342fb2221?auto=format&fit=crop&w=300&h=200&q=80' },
      { id: 4, front: 'Q', back: 'Queen', image: 'https://images.unsplash.com/photo-1578950435899-d3c33a8450a8?auto=format&fit=crop&w=300&h=200&q=80' },
      { id: 5, front: 'M', back: 'Mouse', image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=300&h=200&q=80' }
    ];
  }
  
  // Number flashcards
  if (activityType === 'counting' || activityType === 'math') {
    return [
      { id: 1, front: '1', back: 'One', image: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&w=300&h=200&q=80' },
      { id: 2, front: '2', back: 'Two', image: 'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?auto=format&fit=crop&w=300&h=200&q=80' },
      { id: 3, front: '3', back: 'Three', image: 'https://images.unsplash.com/photo-1562776903-c77ffc5e4f26?auto=format&fit=crop&w=300&h=200&q=80' },
      { id: 4, front: '4', back: 'Four', image: 'https://images.unsplash.com/photo-1659014804845-2addb720cdfb?auto=format&fit=crop&w=300&h=200&q=80' },
      { id: 5, front: '5', back: 'Five', image: 'https://images.unsplash.com/photo-1628260412297-a3377e45006f?auto=format&fit=crop&w=300&h=200&q=80' }
    ];
  }
  
  // Shape flashcards
  if (activityType === 'shapes') {
    return [
      { id: 1, front: 'Circle', back: 'Round like a ball', image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjgwIiBmaWxsPSIjRkY1NTU1IiAvPjwvc3ZnPg==' },
      { id: 2, front: 'Square', back: 'Has 4 equal sides', image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI3MCIgeT0iMjAiIHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjNTU1NUZGIiAvPjwvc3ZnPg==' },
      { id: 3, front: 'Triangle', back: 'Has 3 sides', image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cG9seWdvbiBwb2ludHM9IjE1MCwyMCAyNzAsMTgwIDMwLDE4MCIgZmlsbD0iIzU1QUE1NSIgLz48L3N2Zz4=' },
      { id: 4, front: 'Rectangle', back: 'Has 4 sides, 2 long and 2 short', image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI1MCIgeT0iNTAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkZGRjU1IiAvPjwvc3ZnPg==' },
      { id: 5, front: 'Star', back: 'Shines bright at night', image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cG9seWdvbiBwb2ludHM9IjE1MCwyNSAxNzksMTE1IDI3NSwxMTUgMTk3LDE3MCAyMjMsMjYwIDE1MCwyMDAgNzcsMjYwIDEwMywxNzAgMjUsMTE1IDEyMSwxMTUiIGZpbGw9IiNBQTU1QUEiIC8+PC9zdmc+' }
    ];
  }

  // Color flashcards (default)
  return [
    { id: 1, front: 'Red', back: 'Color of apples and strawberries', image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0ZGNTU1NSIgLz48L3N2Zz4=' },
    { id: 2, front: 'Blue', back: 'Color of the sky and ocean', image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzU1NTVGRiIgLz48L3N2Zz4=' },
    { id: 3, front: 'Green', back: 'Color of grass and leaves', image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzU1QUE1NSIgLz48L3N2Zz4=' },
    { id: 4, front: 'Yellow', back: 'Color of the sun and bananas', image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0ZGRkY1NSIgLz48L3N2Zz4=' },
    { id: 5, front: 'Purple', back: 'Color of grapes and eggplants', image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0FBNTVBQT4iIC8+PC9zdmc+' }
  ];
};

const FlashcardActivity: React.FC<FlashcardActivityProps> = ({ 
  onProgress, 
  currentStep, 
  setCurrentStep,
  ageGroup,
  activityType
}) => {
  const [flashcards, setFlashcards] = useState<Array<{
    id: number;
    front: string;
    back: string;
    image: string;
    flipped?: boolean;
  }>>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [tutorMessage, setTutorMessage] = useState("");
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    const cards = getFlashcards(ageGroup, activityType);
    setFlashcards(cards);
    
    // Set up tutor messages based on age group
    const messages = ageGroup === '0-3' 
      ? [
          "Let's look at some fun cards! Tap to see what's on the other side.",
          "Great job! Can you say the word out loud?",
          "You're doing amazing! Let's see another card."
        ]
      : [
          "Let's learn with flashcards. Click on the card to flip it over.",
          "Excellent! Try to remember what you see.",
          "You're doing great! Keep going to learn more!"
        ];
    
    setTutorMessage(messages[currentStep % messages.length]);
    
    // Calculate progress based on cards seen
    const progressPercent = (completed.length / cards.length) * 100;
    onProgress(progressPercent);
  }, [ageGroup, activityType, currentStep, onProgress, completed.length]);

  const handleCardClick = () => {
    setFlipped(!flipped);
  };

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setFlipped(false);
      
      // Mark current card as completed
      if (!completed.includes(flashcards[currentCardIndex].id)) {
        setCompleted([...completed, flashcards[currentCardIndex].id]);
      }
      
      // Small delay for animation
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex + 1);
      }, 300);
    } else {
      // All cards completed
      if (!completed.includes(flashcards[currentCardIndex].id)) {
        setCompleted([...completed, flashcards[currentCardIndex].id]);
      }
      
      // Reset to beginning
      setFlipped(false);
      setTimeout(() => {
        setCurrentCardIndex(0);
        onProgress(100);
      }, 300);
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setFlipped(false);
      
      // Small delay for animation
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex - 1);
      }, 300);
    }
  };

  if (flashcards.length === 0) {
    return <div>Loading flashcards...</div>;
  }

  const currentCard = flashcards[currentCardIndex];

  return (
    <div className="flex flex-col gap-6">
      {/* Tutor message bubble */}
      <div className="bg-muted/30 p-4 rounded-lg border relative">
        <div className="absolute left-4 -top-3 w-6 h-6 bg-soft-purple rounded-full flex items-center justify-center">
          👩‍🏫
        </div>
        <p className="pl-6 text-sm">{tutorMessage}</p>
      </div>
      
      <div className="flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`card-${currentCardIndex}-${flipped ? 'back' : 'front'}`}
            initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full sm:w-80 cursor-pointer"
            onClick={handleCardClick}
          >
            <Card className="h-72 flex flex-col items-center justify-center shadow-lg">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full w-full">
                {!flipped ? (
                  <div className="text-center">
                    <div className="text-5xl sm:text-6xl font-bold mb-4">{currentCard.front}</div>
                    <p className="text-sm text-muted-foreground">Click to flip</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mb-4 h-32 flex items-center justify-center">
                      <img 
                        src={currentCard.image} 
                        alt={currentCard.back}
                        className="max-h-32 max-w-full object-contain"
                      />
                    </div>
                    <div className="text-xl font-medium mb-2">{currentCard.back}</div>
                    <p className="text-sm text-muted-foreground">Click to flip back</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={handlePreviousCard}
          disabled={currentCardIndex === 0}
        >
          Previous
        </Button>
        
        <div className="text-sm text-muted-foreground">
          {currentCardIndex + 1} of {flashcards.length}
        </div>
        
        <Button onClick={handleNextCard}>
          Next
        </Button>
      </div>
      
      <div className="flex justify-center mt-4">
        <div className="text-center">
          {ageGroup === '0-3' && (
            <p className="text-sm bg-soft-peach/30 p-3 rounded">
              <strong>Parent tip:</strong> Have your child repeat the words out loud and point to related objects around the room!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardActivity;
