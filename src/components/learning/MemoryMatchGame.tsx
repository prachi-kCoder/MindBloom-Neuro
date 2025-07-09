import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Shuffle, RefreshCw } from 'lucide-react';
import { speak } from '@/utils/textToSpeech';

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
  soundUrl?: string;
  isHinted?: boolean;
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
  const [cardSet, setCardSet] = useState<'animals' | 'fruits' | 'letters' | 'shapes'>('animals');
  const [consecutiveFailures, setConsecutiveFailures] = useState<number>(0);
  const [gameComplete, setGameComplete] = useState<boolean>(false);
  const [accuracyCounter, setAccuracyCounter] = useState<{success: number, attempts: number}>({ success: 0, attempts: 0 });
  const [successStreak, setSuccessStreak] = useState<number>(0);
  const { toast } = useToast();
  
  // Set difficulty based on age group
  function getDefaultDifficulty() {
    if (ageGroup === '0-3') return 4;  // 2 pairs
    if (ageGroup === '3-4') return 6;  // 3 pairs
    if (ageGroup === '4-5') return 8;  // 4 pairs
    if (ageGroup === '5-7') return 12; // 6 pairs
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
    ],
    letters: [
      { id: 1, imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAwIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyI+QTwvdGV4dD48L3N2Zz4=", name: "A", description: "The first letter of the alphabet" },
      { id: 2, imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAwIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyI+QjwvdGV4dD48L3N2Zz4=", name: "B", description: "The second letter of the alphabet" },
      { id: 3, imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAwIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyI+QzwvdGV4dD48L3N2Zz4=", name: "C", description: "The third letter of the alphabet" },
      { id: 4, imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAwIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyI+RDwvdGV4dD48L3N2Zz4=", name: "D", description: "The fourth letter of the alphabet" },
      { id: 5, imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAwIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyI+RTwvdGV4dD48L3N2Zz4=", name: "E", description: "The fifth letter of the alphabet" },
      { id: 6, imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAwIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyI+RjwvdGV4dD48L3N2Zz4=", name: "F", description: "The sixth letter of the alphabet" },
      { id: 7, imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAwIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyI+RzwvdGV4dD48L3N2Zz4=", name: "G", description: "The seventh letter of the alphabet" },
      { id: 8, imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAwIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyI+SDwvdGV4dD48L3N2Zz4=", name: "H", description: "The eighth letter of the alphabet" }
    ],
    shapes: [
      { id: 1, imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeD0iMjUiIHk9IjI1IiBmaWxsPSIjRkY1NzU3IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNSIvPjwvc3ZnPg==", name: "Square", description: "A shape with four equal sides and four right angles" },
      { id: 2, imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9Ijc1IiBmaWxsPSIjNTdBRkZGIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNSIvPjwvc3ZnPg==", name: "Circle", description: "A round shape with all points at equal distance from the center" },
      { id: 3, imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cG9seWdvbiBwb2ludHM9IjEwMCwyNSAxNzUsMTc1IDI1LDE3NSIgZmlsbD0iIzU3RkY3MCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjUiLz48L3N2Zz4=", name: "Triangle", description: "A shape with three sides and three angles" },
      { id: 4, imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cG9seWdvbiBwb2ludHM9IjEwMCwyNSAxNzUsMTAwIDEwMCwxNzUgMjUsMTAwIiBmaWxsPSIjRkZENTU3IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNSIvPjwvc3ZnPg==", name: "Diamond", description: "A shape with four equal sides but no right angles" },
      { id: 5, imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9Ijc1IiB4PSIyNSIgeT0iNjMiIGZpbGw9IiNGRjU3REYiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSI1Ii8+PC9zdmc+", name: "Rectangle", description: "A shape with four sides and four right angles" },
      { id: 6, imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cG9seWdvbiBwb2ludHM9IjEwMCwyNSAxNzIsMTAwIDE0MCwxNzUgNjAsMTc1IDI4LDEwMCIgZmlsbD0iIzlCNTdGRiIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjUiLz48L3N2Zz4=", name: "Pentagon", description: "A shape with five sides and five angles" },
      { id: 7, imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cG9seWdvbiBwb2ludHM9IjEwMCwyNSAxNjYsNTAgMTkzLDExMCAxNzAsMTc1IDEwMCwxOTAgMzAsMTc1IDcsMTEwIDM0LDUwIiBmaWxsPSIjNTdGRkVGIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNSIvPjwvc3ZnPg==", name: "Octagon", description: "A shape with eight sides and eight angles" },
      { id: 8, imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cG9seWdvbiBwb2ludHM9IjEwMCwyNSAxMzUsMTAwIDE4MCwxMTAgMTU1LDE3MCAxMDAsMTkwIDQ1LDE3MCAyMCwxMTAgNjUsMTAwIiBmaWxsPSIjRkZBNTU3IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNSIvPjwvc3ZnPg==", name: "Star", description: "A shape with points radiating from the center" }
    ]
  };

  // Choose a random card set when initializing
  useEffect(() => {
    const sets = ['animals', 'fruits', 'letters', 'shapes'] as const;
    const randomSet = sets[Math.floor(Math.random() * sets.length)];
    setCardSet(randomSet);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [difficulty, cardSet]);
  
  const initializeGame = () => {
    // Select cards from the chosen set
    const selectedSet = cardSets[cardSet];
    
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
    setConsecutiveFailures(0);
    setGameComplete(false);
    setAccuracyCounter({ success: 0, attempts: 0 });
    setSuccessStreak(0);
    setTutorMessage(`Let's play a memory matching game with ${cardSet}! Find the matching pairs.`);
    speak(`Let's play a memory matching game with ${cardSet}! Find the matching pairs.`);
    
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
      speak(`Let's find matching pairs!`);
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
    
    // Announce the card name
    const clickedCard = cards.find(card => card.id === id);
    if (clickedCard) {
      speak(clickedCard.name);
    }
    
    // If we have 2 flipped cards, check for a match
    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);
      
      // Update attempts counter
      setAccuracyCounter(prev => ({ ...prev, attempts: prev.attempts + 1 }));
      
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
          
          // Reset consecutive failures and update success counters
          setConsecutiveFailures(0);
          setAccuracyCounter(prev => ({ ...prev, success: prev.success + 1 }));
          setSuccessStreak(prev => prev + 1);
          
          // Give audio feedback
          speak(`That's a match! ${firstCard.name}!`);
          
          // Show educational info about the match
          setCurrentMatchInfo(firstCard);
          setShowMatchInfo(true);
          
          // Update progress
          const totalPairs = difficulty / 2;
          onProgress((newMatchedPairs / totalPairs) * 100);
          
          // Check if game is completed
          if (newMatchedPairs === totalPairs) {
            setGameComplete(true);
            
            // Calculate stars based on accuracy
            const accuracy = accuracyCounter.success / accuracyCounter.attempts;
            let stars = 1;
            if (accuracy > 0.7) stars = 2;
            if (accuracy > 0.9) stars = 3;
            
            // Announce success with stars
            speak(`Great job! You found all the matching pairs! You earned ${stars} stars!`);
            
            toast({
              title: "Great job! 🎉",
              description: `You've found all the matching pairs! ${stars} Stars!`,
            });
            
            setTutorMessage(`Amazing work! You've matched all the pairs. You earned ${stars} stars!`);
            
            // Auto-advance difficulty if accuracy is high enough
            if (accuracy > 0.8 && successStreak >= 2 && difficulty < 16) {
              setTimeout(() => {
                const newDifficulty = Math.min(16, difficulty + 4);
                setDifficulty(newDifficulty);
                speak(`You're doing great! Let's try a harder level!`);
              }, 3000);
            }
          }
        }, 800); // Slightly longer delay for children to process
      } else {
        // Not a match, flip back after a delay
        setConsecutiveFailures(prev => prev + 1);
        
        // Longer delay for very young children
        const flipBackDelay = ageGroup === '0-3' ? 1500 : 1200;
        
        setTimeout(() => {
          setCards(cards.map(card => 
            newFlippedCards.includes(card.id) 
              ? { ...card, flipped: false } 
              : card
          ));
          setFlippedCards([]);
          setIsChecking(false);
          
          // If too many consecutive failures, provide hint
          if (consecutiveFailures >= 3) {
            provideHint();
          }
        }, flipBackDelay);
      }
    }
  };
  
  // Provide a hint after multiple failures
  const provideHint = () => {
    // Find two matching cards that aren't already matched
    const unmatched = cards.filter(card => !card.matched);
    const names = [...new Set(unmatched.map(card => card.name))];
    
    if (names.length > 0) {
      // Choose a random pair to hint
      const nameToHint = names[Math.floor(Math.random() * names.length)];
      const pairToHint = unmatched.filter(card => card.name === nameToHint);
      
      if (pairToHint.length === 2) {
        // Temporarily highlight the pair
        const hintedCards = cards.map(card => 
          pairToHint.some(hintCard => hintCard.id === card.id)
            ? { ...card, isHinted: true }
            : card
        );
        
        setCards(hintedCards);
        speak(`Try to find the matching ${nameToHint}s`);
        
        // Remove hint after a few seconds
        setTimeout(() => {
          setCards(cards => cards.map(card => ({ ...card, isHinted: false })));
        }, 2000);
        
        // Reset the failure counter
        setConsecutiveFailures(0);
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
  
  // Switch to a different category
  const changeCardSet = () => {
    const sets = ['animals', 'fruits', 'letters', 'shapes'] as const;
    const currentIndex = sets.indexOf(cardSet);
    const nextIndex = (currentIndex + 1) % sets.length;
    setCardSet(sets[nextIndex]);
    speak(`Now we'll match ${sets[nextIndex]}!`);
  };

  // Determine grid size based on difficulty
  const getGridClass = () => {
    switch (difficulty) {
      case 4: return 'grid-cols-2 sm:grid-cols-2'; // 2x2
      case 6: return 'grid-cols-2 sm:grid-cols-3'; // 3x2
      case 8: return 'grid-cols-2 sm:grid-cols-4'; // 4x2
      case 12: return 'grid-cols-3 sm:grid-cols-4'; // 4x3
      case 16: return 'grid-cols-4'; // 4x4
      default: return 'grid-cols-4';
    }
  };

  // Calculate card size based on difficulty and screen size
  const getCardSize = () => {
    // Base sizes that ensure minimum size requirements are met
    const sizes = {
      4: 'min-h-[150px]',
      6: 'min-h-[140px]',
      8: 'min-h-[130px]',
      12: 'min-h-[120px]',
      16: 'min-h-[110px]',
    };
    
    return sizes[difficulty as keyof typeof sizes] || 'min-h-[120px]';
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
      
      {/* Game controls and score */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <p className="text-sm font-medium mb-1">
            Pairs found: {matchedPairs} / {difficulty / 2}
          </p>
          
          {/* Star display */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => {
              // Calculate if this star should be filled based on progress
              const starThreshold = (i + 1) * (difficulty / 2) / 3;
              return (
                <div 
                  key={i} 
                  className={`text-lg ${matchedPairs >= starThreshold ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </div>
              );
            })}
          </div>
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
            onClick={changeCardSet}
            className="flex items-center gap-1"
          >
            <Shuffle className="h-4 w-4" />
            Change Cards
          </Button>
        </div>
      </div>
      
      {/* Card grid */}
      <div 
        className={`grid gap-3 mx-auto w-full ${getGridClass()}`}
      >
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className={`aspect-square cursor-pointer perspective-500 ${getCardSize()}`}
            onClick={() => handleCardClick(card.id)}
            whileHover={{ scale: card.flipped || card.matched ? 1 : 1.05 }}
            animate={{ 
              scale: card.matched ? [1, 1.1, 1] : 1,
              boxShadow: card.isHinted ? '0 0 0 4px rgba(255, 215, 0, 0.7)' : 'none'
            }}
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
                  <CardContent className="p-2 h-full flex flex-col items-center justify-center">
                    <img 
                      src={card.imageUrl} 
                      alt={card.name}
                      className="w-full h-4/5 object-contain rounded"
                    />
                    <div className="mt-2 text-center font-semibold text-sm">
                      {card.name}
                    </div>
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
      
      {/* Game completion popup */}
      <AnimatePresence>
        {gameComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-green-50 border-2 border-green-200 p-4 rounded-lg text-center"
          >
            <h3 className="text-xl font-bold mb-2">
              🎉 Amazing Job! 🎉
            </h3>
            <p className="mb-3">
              You found all the pairs! Your memory is fantastic!
            </p>
            <div className="flex justify-center gap-3">
              <Button
                onClick={() => { setGameComplete(false); handleRestart(); }}
                variant="outline"
              >
                Play Again
              </Button>
              <Button
                onClick={() => {
                  setGameComplete(false);
                  changeCardSet();
                }}
              >
                Try Different Cards
              </Button>
            </div>
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
