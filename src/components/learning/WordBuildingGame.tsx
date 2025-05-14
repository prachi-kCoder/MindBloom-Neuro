
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Shuffle } from 'lucide-react';

interface WordBuildingGameProps {
  onProgress: (progress: number) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  ageGroup: string;
  disabilityType?: string;
}

interface LetterTile {
  id: string;
  letter: string;
  position: {
    x: number;
    y: number;
  } | null;
  isPlaced: boolean;
}

interface WordChallenge {
  word: string;
  image: string;
  hint: string;
  level: number; // 1: easy, 2: medium, 3: hard
}

const WORD_CHALLENGES: WordChallenge[] = [
  { word: "CAT", image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1", hint: "A furry pet that says 'meow'", level: 1 },
  { word: "DOG", image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1", hint: "Man's best friend", level: 1 },
  { word: "SUN", image: "https://images.unsplash.com/photo-1505628346881-b72b27e84530", hint: "It gives us light during the day", level: 1 },
  { word: "BALL", image: "https://images.unsplash.com/photo-1614632537190-23e4146777db", hint: "A round toy you can throw and catch", level: 1 },
  { word: "FISH", image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00", hint: "It swims in water", level: 1 },
  { word: "BIRD", image: "https://images.unsplash.com/photo-1444464666168-49d633b86797", hint: "It has wings and can fly", level: 2 },
  { word: "CAKE", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587", hint: "A sweet dessert for birthdays", level: 2 },
  { word: "BOOK", image: "https://images.unsplash.com/photo-1589998059171-988d887df646", hint: "You read stories in it", level: 2 },
  { word: "TREE", image: "https://images.unsplash.com/photo-1501261379837-c3b516c6be5f", hint: "It has leaves and grows tall", level: 2 },
  { word: "HOUSE", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994", hint: "People live inside it", level: 3 },
  { word: "APPLE", image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9", hint: "A red or green fruit", level: 3 },
  { word: "SMILE", image: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b", hint: "Your face does this when you're happy", level: 3 }
];

const WordBuildingGame: React.FC<WordBuildingGameProps> = ({
  onProgress,
  currentStep,
  setCurrentStep,
  ageGroup,
  disabilityType
}) => {
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const [currentChallenge, setCurrentChallenge] = useState<WordChallenge | null>(null);
  const [letterTiles, setLetterTiles] = useState<LetterTile[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [tutorMessage, setTutorMessage] = useState("Let's build some words by dragging the letters to the right spot!");
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { toast } = useToast();
  
  // Filter challenges by age group difficulty
  const getAgeAppropriateWords = () => {
    if (ageGroup === '0-3') {
      return WORD_CHALLENGES.filter(w => w.level === 1 && w.word.length <= 3);
    } else if (ageGroup === '3-4') {
      return WORD_CHALLENGES.filter(w => w.level <= 2 && w.word.length <= 4);
    } else if (ageGroup === '4-5') {
      return WORD_CHALLENGES.filter(w => w.level <= 3);
    } else {
      return WORD_CHALLENGES;
    }
  };
  
  // Initialize game with appropriate challenges
  useEffect(() => {
    const appropriateWords = getAgeAppropriateWords();
    
    if (appropriateWords.length > 0) {
      if (challengeIndex >= appropriateWords.length) {
        setChallengeIndex(0);
      }
      const challenge = appropriateWords[challengeIndex];
      setCurrentChallenge(challenge);
      
      // Create letter tiles
      createLetterTiles(challenge.word);
      
      // Reset state
      setIsCorrect(false);
      setShowHint(false);
    }
    
    // Update progress
    const progress = (correctWords / Math.min(5, getAgeAppropriateWords().length)) * 100;
    onProgress(Math.min(progress, 100));
  }, [challengeIndex, ageGroup, correctWords]);
  
  // Create letter tiles for current word
  const createLetterTiles = (word: string) => {
    // Create array with letter tiles
    const letters = word.split('');
    
    // Shuffle letters for challenge (Fisher-Yates shuffle)
    const shuffledLetters = [...letters];
    for (let i = shuffledLetters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledLetters[i], shuffledLetters[j]] = [shuffledLetters[j], shuffledLetters[i]];
    }
    
    // Create tile objects
    const tiles: LetterTile[] = shuffledLetters.map((letter, index) => ({
      id: `tile-${index}`,
      letter,
      position: null,
      isPlaced: false
    }));
    
    setLetterTiles(tiles);
    setTutorMessage(`Can you build the word for this picture? Drag the letters to the boxes!`);
  };
  
  // Check if the word is correct
  const checkWord = () => {
    if (!currentChallenge) return;
    
    // Check if all tiles are placed
    const allPlaced = letterTiles.every(tile => tile.isPlaced);
    
    if (!allPlaced) {
      toast({
        title: "Not all letters are placed",
        description: "Place all the letters in the boxes first!",
        variant: "default"
      });
      return;
    }
    
    // Sort tiles by their position to reconstruct the word
    const sortedTiles = [...letterTiles]
      .filter(tile => tile.isPlaced)
      .sort((a, b) => {
        if (!a.position || !b.position) return 0;
        return a.position.x - b.position.x;
      });
    
    const formedWord = sortedTiles.map(tile => tile.letter).join('');
    
    // Check if the formed word matches the challenge
    if (formedWord === currentChallenge.word) {
      setIsCorrect(true);
      setCorrectWords(prev => prev + 1);
      
      toast({
        title: "Correct! 🎉",
        description: `Well done! You built the word "${currentChallenge.word}" correctly!`,
        variant: "success"
      });
      
      setTutorMessage(`Great job! You built the word "${currentChallenge.word}" correctly!`);
      
      // Update progress
      const progress = (correctWords + 1) / Math.min(5, getAgeAppropriateWords().length) * 100;
      onProgress(Math.min(progress, 100));
      
      // Check if all challenges are completed
      if (correctWords + 1 >= Math.min(5, getAgeAppropriateWords().length)) {
        setIsCompleted(true);
      }
      
    } else {
      toast({
        title: "Not quite right",
        description: "That's not the right word. Try again!",
        variant: "default"
      });
      
      // Provide a hint
      setShowHint(true);
      setTutorMessage(`Not quite right. Remember: ${currentChallenge.hint}. Try again!`);
    }
  };
  
  // Handle next challenge
  const handleNextChallenge = () => {
    setChallengeIndex(prev => prev + 1);
  };
  
  // Reset current challenge
  const resetChallenge = () => {
    if (!currentChallenge) return;
    createLetterTiles(currentChallenge.word);
    setShowHint(false);
    setIsCorrect(false);
  };
  
  // Handle letter drag end
  const handleDragEnd = (result: { destination: any; source: any; draggableId: string; }) => {
    if (!result.destination) return;
    
    // Get the tile being dragged
    const tileId = result.draggableId;
    const tile = letterTiles.find(t => t.id === tileId);
    
    if (!tile) return;
    
    // Get drop area position
    const targetIndex = result.destination.index;
    const dropArea = result.destination.droppableId;
    
    if (dropArea === 'letter-slots' && targetIndex !== undefined) {
      // Update tile position based on target
      const newTiles = letterTiles.map(t => {
        if (t.id === tile.id) {
          return {
            ...t,
            position: { 
              x: targetIndex,
              y: 0
            },
            isPlaced: true
          };
        }
        return t;
      });
      
      setLetterTiles(newTiles);
    } else if (dropArea === 'letter-bank') {
      // Move back to letter bank
      const newTiles = letterTiles.map(t => {
        if (t.id === tile.id) {
          return {
            ...t,
            position: null,
            isPlaced: false
          };
        }
        return t;
      });
      
      setLetterTiles(newTiles);
    }
  };
  
  if (!currentChallenge) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="flex flex-col gap-6">
      {/* Tutor message bubble */}
      <div className="bg-muted/30 p-4 rounded-lg border relative">
        <div className="absolute left-4 -top-3 w-6 h-6 bg-soft-purple rounded-full flex items-center justify-center">
          📝
        </div>
        <p className="pl-6 text-sm">{tutorMessage}</p>
      </div>
      
      {/* Word image */}
      <div className="flex justify-center">
        <div className="relative w-40 h-40 rounded-lg overflow-hidden shadow-md">
          <img 
            src={currentChallenge.image} 
            alt="Word to build"
            className="w-full h-full object-cover"
          />
          {showHint && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-3">
              <p className="text-white text-center font-medium">{currentChallenge.hint}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Letter placement slots */}
      <div 
        ref={dropAreaRef}
        className="flex justify-center my-4"
      >
        <div className="flex gap-2">
          {Array.from({ length: currentChallenge.word.length }).map((_, index) => {
            const placedTile = letterTiles.find(
              tile => tile.isPlaced && tile.position?.x === index
            );
            
            return (
              <div 
                key={`slot-${index}`}
                className={`
                  w-14 h-14 border-2 rounded-md flex items-center justify-center 
                  ${placedTile ? 'border-primary bg-primary/10' : 'border-dashed border-gray-300'}
                `}
                data-position={index}
              >
                {placedTile && (
                  <motion.div 
                    className="w-12 h-12 bg-primary rounded-md flex items-center justify-center text-white font-bold text-2xl"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                  >
                    {placedTile.letter}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Letter tiles bank */}
      <div className="flex justify-center my-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {letterTiles.filter(tile => !tile.isPlaced).map((tile) => (
            <motion.div
              key={tile.id}
              className="w-12 h-12 bg-primary rounded-md flex items-center justify-center text-white font-bold text-2xl cursor-grab"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", tile.id);
              }}
            >
              {tile.letter}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Game controls */}
      <div className="flex justify-center gap-3 mt-2">
        {!isCorrect ? (
          <>
            <Button 
              variant="outline" 
              onClick={resetChallenge}
              className="flex items-center gap-1"
            >
              <Shuffle className="h-4 w-4" />
              Reset
            </Button>
            
            <Button 
              onClick={checkWord}
            >
              Check Word
            </Button>
            
            <Button 
              variant="ghost"
              onClick={() => setShowHint(true)}
              disabled={showHint}
            >
              Hint
            </Button>
          </>
        ) : (
          <Button
            onClick={handleNextChallenge}
            variant="default"
          >
            Next Word
          </Button>
        )}
      </div>
      
      {/* Parent tip */}
      <div className="flex justify-center mt-4">
        <div className="text-center">
          <p className="text-sm bg-soft-peach/30 p-3 rounded">
            <strong>Parent tip:</strong> Sound out each letter with your child to help them build phonemic awareness!
          </p>
        </div>
      </div>
    </div>
  );
};

export default WordBuildingGame;
