
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Shuffle, RefreshCw } from 'lucide-react';

interface MemoryMatchGameProps {
  onProgress: (progress: number) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  ageGroup: string;
  disabilityType?: string;
}

interface CardItem {
  id: number;
  imageUrl: string;
  flipped: boolean;
  matched: boolean;
  name: string;
  description: string;
}

const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ 
  onProgress, 
  currentStep, 
  setCurrentStep,
  ageGroup,
  disabilityType 
}) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [showMatchInfo, setShowMatchInfo] = useState<boolean>(false);
  const [currentMatchInfo, setCurrentMatchInfo] = useState<CardItem | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<number>(getDefaultDifficulty());
  const [tutorMessage, setTutorMessage] = useState<string>("Let's play a memory matching game! Flip cards to find matching pairs.");
  const { toast } = useToast();
  
  // Set difficulty based on age group
  function getDefaultDifficulty() {
    if (ageGroup === '0-3') return 6;  // 3 pairs
    if (ageGroup === '3-4') return 8;  // 4 pairs
    if (ageGroup === '4-5') return 12; // 6 pairs
    return 16; // 8 pairs for older kids
  }

  // Card sets based on categories
  const cardSets = {
    animals: [
      { id: 1, imageUrl: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1", name: "Cat", description: "A small furry pet with whiskers" },
      { id: 2, imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1", name: "Dog", description: "A loyal animal that barks" },
      { id: 3, imageUrl: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2", name: "Horse", description: "A large animal that can be ridden" },
      { id: 4, imageUrl: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca", name: "Mouse", description: "A tiny animal with a long tail" },
      { id: 5, imageUrl: "https://images.unsplash.com/photo-1484557985045-edf25e08da73", name: "Elephant", description: "A large animal with a trunk" },
      { id: 6, imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d", name: "Lion", description: "The king of the jungle with a mane" },
      { id: 7, imageUrl: "https://images.unsplash.com/photo-1591824438708-ce405f36ba3d", name: "Giraffe", description: "An animal with a very long neck" },
      { id: 8, imageUrl: "https://images.unsplash.com/photo-1568265112889-c9d3fc50a281", name: "Penguin", description: "A bird that swims and lives in cold places" }
    ],
    fruits: [
      { id: 1, imageUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9", name: "Apple", description: "A round fruit that grows on trees" },
      { id: 2, imageUrl: "https://images.unsplash.com/photo-1528825871115-3581a5387919", name: "Banana", description: "A yellow curved fruit" },
      { id: 3, imageUrl: "https://images.unsplash.com/photo-1587815073078-f636169821e3", name: "Orange", description: "A round citrus fruit with segments" },
      { id: 4, imageUrl: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25", name: "Strawberry", description: "A small sweet red fruit with seeds on the outside" },
      { id: 5, imageUrl: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25", name: "Grapes", description: "Small round fruits that grow in clusters" },
      { id: 6, imageUrl: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba", name: "Pineapple", description: "A tropical fruit with a spiky exterior" },
      { id: 7, imageUrl: "https://images.unsplash.com/photo-1602532305019-3beebe70f3f5", name: "Watermelon", description: "A large fruit with red flesh and black seeds" },
      { id: 8, imageUrl: "https://images.unsplash.com/photo-1557800636-894a64c1696f", name: "Kiwi", description: "A small brown fruit with green flesh" }
    ]
  };

  useEffect(() => {
    initializeGame();
  }, [difficulty]);
  
  const initializeGame = () => {
    // Select a random card set
    const cardSetKeys = Object.keys(cardSets) as Array<keyof typeof cardSets>;
    const selectedSet = cardSets[cardSetKeys[Math.floor(Math.random() * cardSetKeys.length)]];
    
    // Take only the number of cards needed based on difficulty
    const pairsNeeded = difficulty / 2;
    const selectedCards = selectedSet.slice(0, pairsNeeded);
    
    // Create pairs and shuffle
    let cardPairs = [...selectedCards, ...selectedCards].map((card, index) => ({
      ...card,
      id: index,
      flipped: false,
      matched: false
    }));
    
    // Shuffle cards
    cardPairs = shuffleCards(cardPairs);
    setCards(cardPairs);
    setFlippedCards([]);
    setMatchedPairs(0);
    setGameStarted(false);
    setTutorMessage("Let's play a memory matching game! Flip cards to find matching pairs.");
    
    // Calculate initial progress
    onProgress(0);
  };
  
  const shuffleCards = (cardsArray: CardItem[]) => {
    const shuffled = [...cardsArray];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  const handleCardClick = (id: number) => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    // Prevent flipping if already checking a pair or card is already flipped/matched
    if (
      isChecking || 
      flippedCards.includes(id) ||
      cards.find(card => card.id === id)?.matched
    ) {
      return;
    }
    
    // Flip the card
    const newCards = cards.map(card => 
      card.id === id ? { ...card, flipped: true } : card
    );
    setCards(newCards);
    
    // Add to flipped cards
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    
    // If we have 2 flipped cards, check for a match
    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);
      
      if (firstCard && secondCard && firstCard.name === secondCard.name) {
        // It's a match!
        setTimeout(() => {
          const updatedCards = cards.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, matched: true } 
              : card
          );
          setCards(updatedCards);
          setFlippedCards([]);
          setIsChecking(false);
          
          // Update matched pairs count
          const newMatchedPairs = matchedPairs + 1;
          setMatchedPairs(newMatchedPairs);
          
          // Show educational info about the match
          setCurrentMatchInfo(firstCard);
          setShowMatchInfo(true);
          
          // Update progress
          const totalPairs = difficulty / 2;
          onProgress((newMatchedPairs / totalPairs) * 100);
          
          // Check if game is completed
          if (newMatchedPairs === totalPairs) {
            toast({
              title: "Great job! 🎉",
              description: "You've found all the matching pairs!",
            });
            setTutorMessage("Amazing work! You've matched all the pairs. Want to play again?");
          }
        }, 500);
      } else {
        // Not a match, flip back
        setTimeout(() => {
          setCards(cards.map(card => 
            newFlippedCards.includes(card.id) 
              ? { ...card, flipped: false } 
              : card
          ));
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };
  
  const closeMatchInfo = () => {
    setShowMatchInfo(false);
    setCurrentMatchInfo(null);
  };
  
  const handleRestart = () => {
    initializeGame();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tutor message bubble */}
      <div className="bg-muted/30 p-4 rounded-lg border relative">
        <div className="absolute left-4 -top-3 w-6 h-6 bg-soft-blue rounded-full flex items-center justify-center">
          🧩
        </div>
        <p className="pl-6 text-sm">{tutorMessage}</p>
      </div>
      
      {/* Game controls */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">
            Pairs found: {matchedPairs} / {difficulty / 2}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestart}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Restart
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDifficulty(getDefaultDifficulty());
              initializeGame();
            }}
            className="flex items-center gap-1"
          >
            <Shuffle className="h-4 w-4" />
            New Game
          </Button>
        </div>
      </div>
      
      {/* Card grid */}
      <div 
        className={`grid gap-3 mx-auto w-full ${
          difficulty <= 8 ? 'grid-cols-2 sm:grid-cols-4' :
          difficulty <= 12 ? 'grid-cols-3 sm:grid-cols-4' :
          'grid-cols-4'
        }`}
      >
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className="aspect-square cursor-pointer perspective-500"
            onClick={() => handleCardClick(card.id)}
            whileHover={{ scale: card.flipped || card.matched ? 1 : 1.05 }}
            animate={{ scale: card.matched ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className={`w-full h-full transition-transform duration-500 transform-style-3d ${
                card.flipped || card.matched ? 'rotate-y-180' : ''
              }`}
            >
              {/* Back of card */}
              <div className={`absolute w-full h-full backface-hidden ${
                card.matched ? 'opacity-0' : ''
              }`}>
                <div className="w-full h-full bg-blue-600 rounded-lg shadow-md flex items-center justify-center text-4xl font-bold text-white">
                  ?
                </div>
              </div>
              
              {/* Front of card */}
              <div className="absolute w-full h-full backface-hidden rotate-y-180">
                <Card className="w-full h-full overflow-hidden">
                  <CardContent className="p-2 h-full flex items-center justify-center">
                    <img 
                      src={card.imageUrl} 
                      alt={card.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Educational popup when match is found */}
      <AnimatePresence>
        {showMatchInfo && currentMatchInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
            onClick={closeMatchInfo}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-bold mb-2">Great match!</h3>
                <div className="w-32 h-32 mb-4">
                  <img 
                    src={currentMatchInfo.imageUrl} 
                    alt={currentMatchInfo.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <h4 className="text-xl font-medium mb-2">{currentMatchInfo.name}</h4>
                <p className="text-center mb-4">{currentMatchInfo.description}</p>
                <Button onClick={closeMatchInfo}>Continue Playing</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Parent tip */}
      <div className="flex justify-center mt-4">
        <div className="text-center">
          <p className="text-sm bg-soft-peach/30 p-3 rounded">
            <strong>Parent tip:</strong> Ask your child to name the objects they match and discuss their characteristics!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemoryMatchGame;
