
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Star, GraduationCap, BookOpen } from 'lucide-react';

interface WordBuildingGameProps {
  onProgress: (progress: number) => void;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  ageGroup: string;
  disabilityType?: string;
}

interface Letter {
  id: string;
  letter: string;
  isDragging: boolean;
  correctIndex?: number;
}

interface Word {
  original: string;
  letters: Letter[];
  hint: string;
  imageUrl?: string;
  description?: string;
  category?: string;
}

const WordBuildingGame: React.FC<WordBuildingGameProps> = ({
  onProgress,
  currentStep,
  setCurrentStep,
  ageGroup,
  disabilityType = "dyslexia"
}) => {
  const { toast } = useToast();
  const [words, setWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [placeholders, setPlaceholders] = useState<(string | null)[]>([]);
  const [correctLetters, setCorrectLetters] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [draggedLetterId, setDraggedLetterId] = useState<string | null>(null);
  const placeholderRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Set up appropriate words based on age group and disability
  useEffect(() => {
    let wordList: Word[] = [];
    
    if (ageGroup === '4-5' || ageGroup === '5-6') {
      wordList = [
        {
          original: 'CAT',
          letters: [
            { id: 'c1', letter: 'C', isDragging: false, correctIndex: 0 },
            { id: 'a1', letter: 'A', isDragging: false, correctIndex: 1 },
            { id: 't1', letter: 'T', isDragging: false, correctIndex: 2 }
          ],
          hint: "A furry pet that says 'meow'",
          imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          category: 'animals'
        },
        {
          original: 'DOG',
          letters: [
            { id: 'd1', letter: 'D', isDragging: false, correctIndex: 0 },
            { id: 'o1', letter: 'O', isDragging: false, correctIndex: 1 },
            { id: 'g1', letter: 'G', isDragging: false, correctIndex: 2 }
          ],
          hint: "A friendly animal that barks",
          imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          category: 'animals'
        },
        {
          original: 'SUN',
          letters: [
            { id: 's1', letter: 'S', isDragging: false, correctIndex: 0 },
            { id: 'u1', letter: 'U', isDragging: false, correctIndex: 1 },
            { id: 'n1', letter: 'N', isDragging: false, correctIndex: 2 }
          ],
          hint: "It's bright and in the sky during the day",
          imageUrl: 'https://images.unsplash.com/photo-1553603227-5a2716e3df98?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          category: 'nature'
        },
        {
          original: 'HAT',
          letters: [
            { id: 'h1', letter: 'H', isDragging: false, correctIndex: 0 },
            { id: 'a2', letter: 'A', isDragging: false, correctIndex: 1 },
            { id: 't2', letter: 'T', isDragging: false, correctIndex: 2 }
          ],
          hint: "You wear it on your head",
          imageUrl: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          category: 'clothing'
        }
      ];
    } else if (ageGroup === '6-8') {
      wordList = [
        {
          original: 'BOOK',
          letters: [
            { id: 'b1', letter: 'B', isDragging: false, correctIndex: 0 },
            { id: 'o2', letter: 'O', isDragging: false, correctIndex: 1 },
            { id: 'o3', letter: 'O', isDragging: false, correctIndex: 2 },
            { id: 'k1', letter: 'K', isDragging: false, correctIndex: 3 }
          ],
          hint: "You read it",
          category: 'school'
        },
        {
          original: 'STAR',
          letters: [
            { id: 's2', letter: 'S', isDragging: false, correctIndex: 0 },
            { id: 't3', letter: 'T', isDragging: false, correctIndex: 1 },
            { id: 'a3', letter: 'A', isDragging: false, correctIndex: 2 },
            { id: 'r1', letter: 'R', isDragging: false, correctIndex: 3 }
          ],
          hint: "It twinkles in the night sky",
          category: 'space'
        }
      ];
    } else if (ageGroup === '8-10' || ageGroup === '10-12') {
      wordList = [
        {
          original: 'PLANET',
          letters: [
            { id: 'p1', letter: 'P', isDragging: false, correctIndex: 0 },
            { id: 'l1', letter: 'L', isDragging: false, correctIndex: 1 },
            { id: 'a4', letter: 'A', isDragging: false, correctIndex: 2 },
            { id: 'n2', letter: 'N', isDragging: false, correctIndex: 3 },
            { id: 'e1', letter: 'E', isDragging: false, correctIndex: 4 },
            { id: 't4', letter: 'T', isDragging: false, correctIndex: 5 }
          ],
          hint: "Earth is an example",
          category: 'science'
        },
        {
          original: 'SYSTEM',
          letters: [
            { id: 's3', letter: 'S', isDragging: false, correctIndex: 0 },
            { id: 'y1', letter: 'Y', isDragging: false, correctIndex: 1 },
            { id: 's4', letter: 'S', isDragging: false, correctIndex: 2 },
            { id: 't5', letter: 'T', isDragging: false, correctIndex: 3 },
            { id: 'e2', letter: 'E', isDragging: false, correctIndex: 4 },
            { id: 'm1', letter: 'M', isDragging: false, correctIndex: 5 }
          ],
          hint: "An organized set of connected things",
          category: 'science'
        }
      ];
    }
    
    // Shuffle the letters within each word
    const shuffledWords = wordList.map(word => {
      // Create a copy of the letters array
      const shuffled = [...word.letters].sort(() => Math.random() - 0.5);
      return { ...word, letters: shuffled };
    });
    
    setWords(shuffledWords);
    resetPlaceholders(shuffledWords[0]);
  }, [ageGroup]);

  useEffect(() => {
    if (words.length > 0) {
      resetPlaceholders(words[currentWordIndex]);
    }
  }, [currentWordIndex]);

  useEffect(() => {
    // Update progress based on completed words
    if (words.length > 0) {
      const progressPercentage = (currentWordIndex / words.length) * 100;
      onProgress(progressPercentage);
    }
  }, [currentWordIndex, words.length, onProgress]);

  const resetPlaceholders = (word: Word) => {
    setPlaceholders(Array(word.original.length).fill(null));
    setCorrectLetters(0);
    setShowHint(false);
    setHintUsed(false);
    placeholderRefs.current = Array(word.original.length).fill(null);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, letterId: string) => {
    setDraggedLetterId(letterId);
    // Add a ghost image effect (optional)
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', letterId);
      e.dataTransfer.effectAllowed = 'move';
    }
    
    // Update the letter's isDragging state
    setWords(prevWords => {
      return prevWords.map((word, idx) => {
        if (idx === currentWordIndex) {
          return {
            ...word,
            letters: word.letters.map(letter => {
              if (letter.id === letterId) {
                return { ...letter, isDragging: true };
              }
              return letter;
            })
          };
        }
        return word;
      });
    });
  };

  const handleDragEnd = () => {
    setDraggedLetterId(null);
    
    // Reset all letters' isDragging state
    setWords(prevWords => {
      return prevWords.map((word, idx) => {
        if (idx === currentWordIndex) {
          return {
            ...word,
            letters: word.letters.map(letter => {
              return { ...letter, isDragging: false };
            })
          };
        }
        return word;
      });
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-primary/20');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('bg-primary/20');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, placeholderIndex: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-primary/20');
    
    if (draggedLetterId && placeholders[placeholderIndex] === null) {
      const currentWord = words[currentWordIndex];
      const draggedLetter = currentWord.letters.find(letter => letter.id === draggedLetterId);
      
      if (draggedLetter) {
        // Check if the letter is placed in the correct position
        const isCorrectPosition = draggedLetter.correctIndex === placeholderIndex;
        
        // Update the placeholders
        const newPlaceholders = [...placeholders];
        newPlaceholders[placeholderIndex] = draggedLetterId;
        setPlaceholders(newPlaceholders);
        
        // Update letter availability
        setWords(prevWords => {
          return prevWords.map((word, idx) => {
            if (idx === currentWordIndex) {
              return {
                ...word,
                letters: word.letters.filter(letter => letter.id !== draggedLetterId)
              };
            }
            return word;
          });
        });
        
        // Check if the letter is placed correctly
        if (isCorrectPosition) {
          const newCorrectLetters = correctLetters + 1;
          setCorrectLetters(newCorrectLetters);
          
          // Visual feedback for correct placement
          if (placeholderRefs.current[placeholderIndex]) {
            placeholderRefs.current[placeholderIndex]?.classList.add('bg-green-100', 'border-green-400');
          }
          
          // Check if the word is complete
          if (newCorrectLetters === currentWord.original.length) {
            handleWordComplete();
          }
        } else {
          // Visual feedback for incorrect placement
          if (placeholderRefs.current[placeholderIndex]) {
            placeholderRefs.current[placeholderIndex]?.classList.add('bg-red-100', 'border-red-400');
            
            // Reset the placeholder after a delay
            setTimeout(() => {
              returnLetterToPool(draggedLetterId, placeholderIndex);
            }, 1000);
          }
        }
      }
    }
  };

  // This function handles mouse or touch events for dragging
  const handleTouchStart = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent, letterId: string) => {
    setDraggedLetterId(letterId);
    
    // Update the letter's isDragging state
    setWords(prevWords => {
      return prevWords.map((word, idx) => {
        if (idx === currentWordIndex) {
          return {
            ...word,
            letters: word.letters.map(letter => {
              if (letter.id === letterId) {
                return { ...letter, isDragging: true };
              }
              return letter;
            })
          };
        }
        return word;
      });
    });
  };

  const returnLetterToPool = (letterId: string, placeholderIndex: number) => {
    // Get the original letter from the current word
    const currentWord = words[currentWordIndex];
    const originalLetterIndex = currentWord.original.split('').findIndex(
      (_, index) => index === currentWord.letters.find(l => l.id === letterId)?.correctIndex
    );
    
    if (originalLetterIndex !== -1) {
      const originalLetter = {
        id: letterId,
        letter: currentWord.original[originalLetterIndex],
        isDragging: false,
        correctIndex: originalLetterIndex
      };
      
      // Add the letter back to the word
      setWords(prevWords => {
        return prevWords.map((word, idx) => {
          if (idx === currentWordIndex) {
            return {
              ...word,
              letters: [...word.letters, originalLetter]
            };
          }
          return word;
        });
      });
      
      // Clear the placeholder
      const newPlaceholders = [...placeholders];
      newPlaceholders[placeholderIndex] = null;
      setPlaceholders(newPlaceholders);
      
      // Reset the placeholder styling
      if (placeholderRefs.current[placeholderIndex]) {
        placeholderRefs.current[placeholderIndex]?.classList.remove(
          'bg-green-100', 'border-green-400', 'bg-red-100', 'border-red-400'
        );
      }
    }
  };

  const handleWordComplete = () => {
    // Increase score based on hint usage
    const wordScore = hintUsed ? 5 : 10;
    setScore(prevScore => prevScore + wordScore);
    
    // Show success message
    setShowSuccess(true);
    
    toast({
      title: "Great job!",
      description: `You built the word "${words[currentWordIndex].original}"`,
      variant: "default",
    });
    
    // Move to the next word after a delay
    setTimeout(() => {
      setShowSuccess(false);
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(prevIndex => prevIndex + 1);
      } else {
        // All words completed
        onProgress(100);
        toast({
          title: "Amazing!",
          description: "You've completed all the words!",
          variant: "default",
        });
      }
    }, 2000);
  };

  const handleShowHint = () => {
    setShowHint(true);
    setHintUsed(true);
  };

  const handleReset = () => {
    resetPlaceholders(words[currentWordIndex]);
    
    // Return all letters to the pool
    setWords(prevWords => {
      return prevWords.map((word, idx) => {
        if (idx === currentWordIndex) {
          const originalLetters = word.original.split('').map((letter, index) => ({
            id: `${letter.toLowerCase()}${index + 1}`,
            letter,
            isDragging: false,
            correctIndex: index
          }));
          
          // Shuffle the letters
          return {
            ...word,
            letters: [...originalLetters].sort(() => Math.random() - 0.5)
          };
        }
        return word;
      });
    });
  };

  if (words.length === 0) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const currentWord = words[currentWordIndex];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold mb-2">Word Building</h3>
          <p className="text-muted-foreground">
            Drag and drop the letters to form the correct word
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-medium">
            Score: {score}
          </div>
          <div className="bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-medium">
            Word {currentWordIndex + 1} of {words.length}
          </div>
        </div>
      </div>
      
      {currentWord.imageUrl && (
        <div className="flex justify-center mb-6">
          <img 
            src={currentWord.imageUrl} 
            alt={`Image for ${currentWord.original}`} 
            className="h-40 object-cover rounded-lg shadow-md"
          />
        </div>
      )}
      
      <div className="flex justify-center mb-8">
        <div className="flex gap-2">
          {placeholders.map((letterId, index) => (
            <div
              key={`placeholder-${index}`}
              ref={el => placeholderRefs.current[index] = el}
              className={`w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-2xl font-bold transition-all ${
                showSuccess ? 'bg-green-100 border-green-400' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
            >
              {letterId && (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 rounded text-primary">
                  {currentWord.letters.find(l => l.id === letterId)?.letter || ''}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {currentWord.letters.map((letter) => (
          <div
            key={letter.id}
            draggable
            onDragStart={(e) => handleDragStart(e, letter.id)}
            onDragEnd={handleDragEnd}
            onTouchStart={(e) => handleTouchStart(e, letter.id)}
            className={`w-10 h-10 flex items-center justify-center bg-white border-2 border-primary/30 rounded-md shadow-sm text-xl font-bold cursor-grab select-none transition-transform ${
              letter.isDragging ? 'opacity-50' : 'hover:scale-110'
            }`}
          >
            {letter.letter}
          </div>
        ))}
      </div>
      
      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="outline" onClick={handleShowHint} disabled={showHint}>
          {showHint ? 'Hint shown' : 'Show Hint'}
        </Button>
      </div>
      
      {showHint && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-center text-sm">
            <span className="font-semibold">Hint:</span> {currentWord.hint}
          </p>
        </div>
      )}
      
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg animate-scale-in text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Great Job!</h3>
            <p>You built the word correctly!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordBuildingGame;

