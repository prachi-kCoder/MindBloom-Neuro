
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Brain, Trophy } from 'lucide-react';

interface MemoryMazeGameProps {
  onProgress: (progress: number) => void;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  ageGroup: string;
  disabilityType?: string;
}

interface Cell {
  x: number;
  y: number;
  isPath: boolean;
  isStart: boolean;
  isEnd: boolean;
  isVisited: boolean;
  isCurrentPosition: boolean;
  isSequencePart: boolean;
  hasTreasure: boolean;
}

type Direction = 'up' | 'down' | 'left' | 'right';

interface DirectionStep {
  direction: Direction;
  icon: React.ReactNode;
}

const MemoryMazeGame: React.FC<MemoryMazeGameProps> = ({
  onProgress,
  currentStep,
  setCurrentStep,
  ageGroup,
  disabilityType = "dyslexia"
}) => {
  const { toast } = useToast();
  const [level, setLevel] = useState(1);
  const [mazeSize, setMazeSize] = useState({ rows: 5, cols: 5 });
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [displaySequence, setDisplaySequence] = useState<DirectionStep[]>([]);
  const [userSequence, setUserSequence] = useState<DirectionStep[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [showingStep, setShowingStep] = useState(-1);
  const [score, setScore] = useState(0);
  const [gemsCollected, setGemsCollected] = useState(0);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [endPosition, setEndPosition] = useState({ x: 4, y: 4 });
  const [hasWon, setHasWon] = useState(false);
  const [hasLost, setHasLost] = useState(false);
  const [sequenceLength, setSequenceLength] = useState(3);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize the maze
  useEffect(() => {
    generateMaze();
  }, [level]);

  // Adjust game difficulty based on age group
  useEffect(() => {
    if (ageGroup === '8-10') {
      setSequenceLength(3);
    } else if (ageGroup === '10-12') {
      setSequenceLength(4);
    }
    
    // Update progress
    onProgress((level - 1) * 20); // 5 levels = 100% progress
  }, [ageGroup, level, onProgress]);

  const generateMaze = () => {
    // Initialize an empty maze
    const rows = mazeSize.rows;
    const cols = mazeSize.cols;
    const newMaze: Cell[][] = [];
    
    // Create a blank maze grid
    for (let y = 0; y < rows; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < cols; x++) {
        row.push({
          x,
          y,
          isPath: true, // All cells are pathways in this simple maze
          isStart: false,
          isEnd: false,
          isVisited: false,
          isCurrentPosition: false,
          isSequencePart: false,
          hasTreasure: false
        });
      }
      newMaze.push(row);
    }
    
    // Set start and end positions
    const start = { x: 0, y: 0 };
    const end = { x: cols - 1, y: rows - 1 };
    
    newMaze[start.y][start.x].isStart = true;
    newMaze[end.y][end.x].isEnd = true;
    
    // Place treasures/gems
    const treasuresCount = Math.min(level + 2, 5);
    let treasuresPlaced = 0;
    
    while (treasuresPlaced < treasuresCount) {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);
      
      // Don't place treasures at start or end
      if ((x === start.x && y === start.y) || (x === end.x && y === end.y)) {
        continue;
      }
      
      if (!newMaze[y][x].hasTreasure) {
        newMaze[y][x].hasTreasure = true;
        treasuresPlaced++;
      }
    }
    
    setMaze(newMaze);
    setStartPosition(start);
    setEndPosition(end);
    setCurrentPosition(start);
    
    // Generate a random sequence of directions
    generateSequence(level);
  };

  const generateSequence = (lvl: number) => {
    const directions: Direction[] = ['up', 'down', 'left', 'right'];
    const newSequence: DirectionStep[] = [];
    const sequenceToGenerate = sequenceLength + Math.min(lvl - 1, 2);
    
    for (let i = 0; i < sequenceToGenerate; i++) {
      const randomIndex = Math.floor(Math.random() * directions.length);
      const direction = directions[randomIndex];
      
      newSequence.push({
        direction,
        icon: getDirectionIcon(direction)
      });
    }
    
    setDisplaySequence(newSequence);
    setUserSequence([]);
  };

  const getDirectionIcon = (direction: Direction) => {
    switch (direction) {
      case 'up': return <ArrowUp className="h-6 w-6" />;
      case 'down': return <ArrowDown className="h-6 w-6" />;
      case 'left': return <ArrowLeft className="h-6 w-6" />;
      case 'right': return <ArrowRight className="h-6 w-6" />;
    }
  };

  const startGame = () => {
    setIsPlaying(false);
    setIsWatching(true);
    setShowingStep(-1);
    
    // Reset the maze state
    setMaze(prev => {
      const newMaze = [...prev];
      for (let y = 0; y < mazeSize.rows; y++) {
        for (let x = 0; x < mazeSize.cols; x++) {
          newMaze[y][x] = {
            ...newMaze[y][x],
            isVisited: false,
            isCurrentPosition: false,
            isSequencePart: false
          };
        }
      }
      newMaze[startPosition.y][startPosition.x].isCurrentPosition = true;
      return newMaze;
    });
    
    setCurrentPosition(startPosition);
    
    // Start displaying the sequence
    let step = 0;
    
    const interval = setInterval(() => {
      if (step < displaySequence.length) {
        setShowingStep(step);
        step++;
      } else {
        clearInterval(interval);
        setIsWatching(false);
        setIsPlaying(true);
        setShowingStep(-1);
      }
    }, 1000);
    
    timerRef.current = interval;
  };

  const handleDirectionClick = (direction: Direction) => {
    if (!isPlaying || hasWon || hasLost) return;
    
    // Add the chosen direction to user sequence
    const newUserInput = {
      direction,
      icon: getDirectionIcon(direction)
    };
    
    const newUserSequence = [...userSequence, newUserInput];
    setUserSequence(newUserSequence);
    
    // Check if the input is correct
    if (newUserSequence.length <= displaySequence.length) {
      const isCorrect = newUserSequence[newUserSequence.length - 1].direction === 
        displaySequence[newUserSequence.length - 1].direction;
      
      if (!isCorrect) {
        // Wrong sequence
        handleLoss();
        return;
      }
      
      // Move the player in the maze
      movePlayer(direction);
      
      // Check if the sequence is complete
      if (newUserSequence.length === displaySequence.length) {
        // Check if reached the end
        if (currentPosition.x === endPosition.x && currentPosition.y === endPosition.y) {
          handleWin();
        } else {
          // Sequence correct but not at the end yet
          toast({
            title: "Good sequence!",
            description: "Keep going to reach the treasure!",
            variant: "default",
          });
        }
      }
    }
  };

  const movePlayer = (direction: Direction) => {
    const { x, y } = currentPosition;
    let newX = x;
    let newY = y;
    
    // Calculate new position
    switch (direction) {
      case 'up':
        newY = Math.max(0, y - 1);
        break;
      case 'down':
        newY = Math.min(mazeSize.rows - 1, y + 1);
        break;
      case 'left':
        newX = Math.max(0, x - 1);
        break;
      case 'right':
        newX = Math.min(mazeSize.cols - 1, x + 1);
        break;
    }
    
    // Update maze and player position
    setMaze(prev => {
      const newMaze = [...prev];
      
      // Clear current position
      newMaze[y][x].isCurrentPosition = false;
      
      // Set new position
      newMaze[newY][newX].isCurrentPosition = true;
      newMaze[newY][newX].isVisited = true;
      
      // Check if the new position has a treasure
      if (newMaze[newY][newX].hasTreasure) {
        newMaze[newY][newX].hasTreasure = false; // Collect the treasure
        setGemsCollected(prev => prev + 1);
        setScore(prev => prev + 10);
        
        toast({
          title: "Gem collected!",
          description: "You found a gem! +10 points",
          variant: "default",
        });
      }
      
      return newMaze;
    });
    
    setCurrentPosition({ x: newX, y: newY });
  };

  const handleWin = () => {
    setHasWon(true);
    setIsPlaying(false);
    
    // Add bonus points for level completion
    const levelBonus = level * 20;
    setScore(prev => prev + levelBonus);
    
    toast({
      title: "Level Complete!",
      description: `Great job! You've completed level ${level}. +${levelBonus} points!`,
      variant: "default",
    });
    
    // Update progress
    onProgress(Math.min((level) * 20, 100));
    
    // Proceed to next level after a delay
    setTimeout(() => {
      if (level < 5) {
        setLevel(prev => prev + 1);
        setHasWon(false);
      } else {
        // Game complete
        toast({
          title: "Congratulations!",
          description: "You've mastered the Memory Maze game!",
          variant: "default",
        });
      }
    }, 2000);
  };

  const handleLoss = () => {
    setHasLost(true);
    setIsPlaying(false);
    
    toast({
      title: "Oops!",
      description: "That's not the right sequence. Try again!",
      variant: "default",
    });
    
    // Allow retry after a delay
    setTimeout(() => {
      setHasLost(false);
      setUserSequence([]);
      setCurrentPosition(startPosition);
      
      // Reset the maze
      setMaze(prev => {
        const newMaze = [...prev];
        for (let y = 0; y < mazeSize.rows; y++) {
          for (let x = 0; x < mazeSize.cols; x++) {
            newMaze[y][x] = {
              ...newMaze[y][x],
              isVisited: false,
              isCurrentPosition: false
            };
          }
        }
        newMaze[startPosition.y][startPosition.x].isCurrentPosition = true;
        return newMaze;
      });
    }, 2000);
  };

  // Clean up timers
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold mb-2">Memory Maze</h3>
          <p className="text-muted-foreground">
            Remember the sequence and navigate the maze
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <div className="bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-medium">
            Level: {level}/5
          </div>
          <div className="bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-medium">
            Score: {score}
          </div>
          <div className="bg-yellow-100 px-3 py-1 rounded-full text-amber-600 text-sm font-medium flex items-center gap-1">
            <Trophy className="h-4 w-4" /> {gemsCollected} Gems
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        {/* Memory Sequence Display */}
        <div className="bg-muted/20 p-4 rounded-lg mb-4">
          <h4 className="text-lg font-medium mb-2 flex items-center gap-2">
            <Brain className="h-5 w-5" /> Memory Sequence
          </h4>
          <div className="flex justify-center gap-2 mb-4">
            {displaySequence.map((step, index) => (
              <div
                key={`sequence-${index}`}
                className={`w-12 h-12 flex items-center justify-center rounded-md border-2 ${
                  isWatching && showingStep === index
                    ? 'bg-primary text-primary-foreground border-primary'
                    : isWatching
                    ? 'bg-muted border-muted-foreground'
                    : 'bg-muted/50 border-muted'
                } transition-all duration-200`}
              >
                {isWatching && showingStep >= index ? step.icon : null}
              </div>
            ))}
          </div>
          
          {/* User Input Sequence */}
          <div className="flex justify-center gap-2">
            {displaySequence.map((_, index) => (
              <div
                key={`user-${index}`}
                className={`w-12 h-12 flex items-center justify-center rounded-md border-2 ${
                  userSequence[index]
                    ? 'bg-green-100 border-green-400'
                    : 'bg-white/50 border-gray-200'
                } transition-all duration-200`}
              >
                {userSequence[index]?.icon}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Maze Grid */}
      <div className="flex justify-center mb-8">
        <div className="grid grid-cols-5 gap-1 bg-muted/30 p-2 rounded-lg">
          {maze.map((row, y) => (
            <React.Fragment key={`row-${y}`}>
              {row.map((cell, x) => (
                <div
                  key={`cell-${x}-${y}`}
                  className={`w-12 h-12 flex items-center justify-center rounded-md ${
                    cell.isStart 
                      ? 'bg-blue-100 border-2 border-blue-400' 
                      : cell.isEnd 
                      ? 'bg-green-100 border-2 border-green-400'
                      : cell.isCurrentPosition 
                      ? 'bg-yellow-100 border-2 border-yellow-400'
                      : cell.isVisited 
                      ? 'bg-blue-50'
                      : 'bg-white'
                  } transition-all duration-200`}
                >
                  {cell.hasTreasure && (
                    <div className="w-6 h-6 bg-amber-200 rounded-full border-2 border-amber-400 flex items-center justify-center text-amber-600">
                      💎
                    </div>
                  )}
                  {cell.isStart && !cell.isCurrentPosition && (
                    <div className="text-xs font-medium text-blue-500">Start</div>
                  )}
                  {cell.isEnd && (
                    <div className="text-xs font-medium text-green-500">End</div>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex flex-col items-center gap-4">
        <div className="grid grid-cols-3 gap-2">
          <div></div>
          <Button 
            variant="outline"
            onClick={() => handleDirectionClick('up')}
            disabled={!isPlaying || hasWon || hasLost}
            className="aspect-square"
          >
            <ArrowUp className="h-6 w-6" />
          </Button>
          <div></div>
          
          <Button 
            variant="outline"
            onClick={() => handleDirectionClick('left')}
            disabled={!isPlaying || hasWon || hasLost}
            className="aspect-square"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          
          <div className="aspect-square bg-muted/20 rounded-md flex items-center justify-center">
            {isPlaying ? (
              <Brain className="h-6 w-6 text-primary" />
            ) : (
              hasWon ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : hasLost ? (
                <div className="text-red-500">✕</div>
              ) : (
                <div></div>
              )
            )}
          </div>
          
          <Button 
            variant="outline"
            onClick={() => handleDirectionClick('right')}
            disabled={!isPlaying || hasWon || hasLost}
            className="aspect-square"
          >
            <ArrowRight className="h-6 w-6" />
          </Button>
          
          <div></div>
          <Button 
            variant="outline"
            onClick={() => handleDirectionClick('down')}
            disabled={!isPlaying || hasWon || hasLost}
            className="aspect-square"
          >
            <ArrowDown className="h-6 w-6" />
          </Button>
          <div></div>
        </div>
        
        <div className="mt-4">
          <Button
            onClick={startGame}
            disabled={isPlaying || isWatching || (level > 5)}
            className="w-full"
          >
            {hasWon && level < 5 ? 'Next Level' : hasWon ? 'Complete!' : 'Start Game'}
          </Button>
        </div>
      </div>
      
      {/* Instructions */}
      <Card className="bg-muted/10 mt-6">
        <div className="p-4">
          <h4 className="font-medium mb-2">How to Play:</h4>
          <ol className="list-decimal list-inside text-sm text-muted-foreground">
            <li>Watch the sequence of directions carefully</li>
            <li>Repeat the sequence using the arrow buttons</li>
            <li>Navigate to the end position and collect gems</li>
            <li>Complete all 5 levels to master the game</li>
          </ol>
        </div>
      </Card>
    </div>
  );
};

export default MemoryMazeGame;
