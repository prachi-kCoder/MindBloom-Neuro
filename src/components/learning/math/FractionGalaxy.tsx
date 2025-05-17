
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { speak, stopSpeaking } from '@/utils/textToSpeech';
import useDyslexiaFont from '@/hooks/useDyslexiaFont';
import { toast } from 'sonner';
import { Volume2, Star, Rocket } from 'lucide-react';

interface FractionPod {
  id: number;
  fraction: {
    numerator: number;
    denominator: number;
  };
  position: {
    x: number;
    y: number;
  };
  matched: boolean;
  equivalent: boolean;
}

interface FractionGalaxyProps {
  level?: number;
  onComplete?: (score: number) => void;
}

const FractionGalaxy: React.FC<FractionGalaxyProps> = ({ 
  level = 1, 
  onComplete 
}) => {
  const { useDyslexicFont } = useDyslexiaFont();
  const [currentLevel, setCurrentLevel] = useState(level);
  const [score, setScore] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [pods, setPods] = useState<FractionPod[]>([]);
  const [targetFraction, setTargetFraction] = useState({ numerator: 1, denominator: 2 });
  const [gameActive, setGameActive] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  
  // Generate equivalent fractions for a given level
  const generateEquivalentFractions = (level: number) => {
    let baseFractions = [];
    
    switch(level) {
      case 1:
        baseFractions = [
          { numerator: 1, denominator: 2 },
          { numerator: 2, denominator: 4 },
          { numerator: 3, denominator: 6 }
        ];
        setTargetFraction({ numerator: 1, denominator: 2 });
        break;
      case 2:
        baseFractions = [
          { numerator: 1, denominator: 4 },
          { numerator: 2, denominator: 8 },
          { numerator: 3, denominator: 12 }
        ];
        setTargetFraction({ numerator: 1, denominator: 4 });
        break;
      case 3:
        baseFractions = [
          { numerator: 2, denominator: 3 },
          { numerator: 4, denominator: 6 },
          { numerator: 8, denominator: 12 }
        ];
        setTargetFraction({ numerator: 2, denominator: 3 });
        break;
      case 4:
        baseFractions = [
          { numerator: 3, denominator: 4 },
          { numerator: 6, denominator: 8 },
          { numerator: 9, denominator: 12 }
        ];
        setTargetFraction({ numerator: 3, denominator: 4 });
        break;
      default:
        baseFractions = [
          { numerator: 5, denominator: 6 },
          { numerator: 10, denominator: 12 },
          { numerator: 15, denominator: 18 }
        ];
        setTargetFraction({ numerator: 5, denominator: 6 });
    }
    
    // Add some non-equivalent fractions
    const nonEquivalentFractions = [
      { numerator: 1, denominator: 3 },
      { numerator: 3, denominator: 5 },
      { numerator: 2, denominator: 5 },
      { numerator: 4, denominator: 7 }
    ];
    
    // Generate pods
    const newPods: FractionPod[] = [];
    
    // Add equivalent fraction pods
    baseFractions.forEach((fraction, index) => {
      newPods.push({
        id: index,
        fraction,
        position: {
          x: Math.random() * 80 + 10, // 10% to 90% of width
          y: Math.random() * 60 + 10  // 10% to 70% of height
        },
        matched: false,
        equivalent: true
      });
    });
    
    // Add non-equivalent fraction pods
    for (let i = 0; i < 2 + currentLevel; i++) {
      const nonEqFraction = nonEquivalentFractions[Math.floor(Math.random() * nonEquivalentFractions.length)];
      newPods.push({
        id: baseFractions.length + i,
        fraction: nonEqFraction,
        position: {
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 10
        },
        matched: false,
        equivalent: false
      });
    }
    
    return newPods;
  };
  
  // Initialize game
  useEffect(() => {
    const newPods = generateEquivalentFractions(currentLevel);
    setPods(newPods);
    setFuel(100);
    setGameActive(true);
    setShowSuccess(false);
    
    // Introduce the level with voice
    const intro = `Level ${currentLevel}: Collect pods with fractions equivalent to ${targetFraction.numerator}/${targetFraction.denominator}`;
    speak(intro);
    
    return () => {
      stopSpeaking();
    };
  }, [currentLevel]);
  
  // Fuel depletion over time
  useEffect(() => {
    if (!gameActive) return;
    
    const fuelInterval = setInterval(() => {
      setFuel(prevFuel => {
        const newFuel = prevFuel - 0.5;
        if (newFuel <= 0) {
          clearInterval(fuelInterval);
          setGameActive(false);
          speak("Oh no! You've run out of fuel. Try again!");
          toast.error("Out of fuel! Try again.");
          return 0;
        }
        return newFuel;
      });
    }, 1000);
    
    return () => {
      clearInterval(fuelInterval);
    };
  }, [gameActive]);
  
  // Check if all equivalent fractions are collected
  useEffect(() => {
    if (!gameActive) return;
    
    const allEquivalentMatched = pods.every(pod => !pod.equivalent || pod.matched);
    if (allEquivalentMatched && pods.some(pod => pod.equivalent)) {
      setGameActive(false);
      setShowSuccess(true);
      setScore(prevScore => prevScore + 1);
      speak("Great job! You found all the equivalent fractions!");
      toast.success("Level complete!");
      
      setTimeout(() => {
        if (currentLevel < 5) {
          setCurrentLevel(currentLevel + 1);
        } else {
          if (onComplete) {
            onComplete(score + 1);
          }
        }
      }, 2000);
    }
  }, [pods, gameActive, currentLevel, score, onComplete]);
  
  const handlePodClick = (id: number) => {
    if (!gameActive) return;
    
    setPods(prevPods => {
      const newPods = [...prevPods];
      const clickedPod = newPods.find(pod => pod.id === id);
      
      if (clickedPod) {
        // Check if fraction is equivalent to target
        const isEquivalent = 
          clickedPod.fraction.numerator * targetFraction.denominator === 
          clickedPod.fraction.denominator * targetFraction.numerator;
        
        if (isEquivalent) {
          clickedPod.matched = true;
          speak(`Correct! ${clickedPod.fraction.numerator}/${clickedPod.fraction.denominator} equals ${targetFraction.numerator}/${targetFraction.denominator}`);
          setFuel(prevFuel => Math.min(100, prevFuel + 10));
          toast.success("Correct! +10 fuel");
        } else {
          speak("Not equivalent! Keep searching!");
          setFuel(prevFuel => Math.max(0, prevFuel - 10));
          toast.error("Not equivalent! -10 fuel");
        }
      }
      
      return newPods;
    });
  };
  
  const resetLevel = () => {
    const newPods = generateEquivalentFractions(currentLevel);
    setPods(newPods);
    setFuel(100);
    setGameActive(true);
    setShowSuccess(false);
  };
  
  const speakInstructions = () => {
    speak(`Find all the fractions equivalent to ${targetFraction.numerator}/${targetFraction.denominator}. Click on fuel pods that match.`);
  };
  
  return (
    <div className="flex flex-col items-center p-4 max-w-4xl mx-auto">
      <div className="w-full bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-6 mb-6">
        <h1 className={`text-2xl md:text-3xl font-bold text-center mb-2 text-primary ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
          Fraction Galaxy Mission
        </h1>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium text-muted-foreground">
            Level {currentLevel}/5
          </div>
          <div className="flex items-center gap-2">
            {[...Array(score)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={speakInstructions}
          >
            <Volume2 className="h-5 w-5" />
          </Button>
        </div>
        
        <div className={`text-center mb-4 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
          <p className="text-lg">
            Find fractions equivalent to <span className="font-bold text-primary">{targetFraction.numerator}/{targetFraction.denominator}</span>
          </p>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Fuel</span>
            <span className="text-sm font-medium">{Math.round(fuel)}%</span>
          </div>
          <Progress value={fuel} className="h-2" />
        </div>
      </div>
      
      <div 
        ref={gameAreaRef}
        className="relative w-full h-96 bg-gray-900 rounded-lg p-4 mb-6 overflow-hidden"
        style={{ 
          backgroundImage: "radial-gradient(circle, rgba(25,25,112,1) 0%, rgba(9,9,121,1) 35%, rgba(0,0,0,1) 100%)",
          boxShadow: "inset 0 0 50px rgba(255,255,255,0.1)"
        }}
      >
        {/* Stars background */}
        {[...Array(50)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${Math.random() * 4 + 2}s infinite alternate`
            }}
          ></div>
        ))}
        
        {/* Rocket/Player */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <div className="relative">
            <Rocket size={48} className="text-red-500" />
            {/* Rocket flame animation */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-orange-500 animate-pulse rounded-b-lg"></div>
          </div>
        </div>
        
        {/* Fraction Pods */}
        {pods.map(pod => (
          <button
            key={pod.id}
            className={`absolute rounded-full transform transition-all duration-300 
                       ${pod.matched ? 'scale-0 opacity-0' : 'hover:scale-110'}`}
            style={{
              top: `${pod.position.y}%`,
              left: `${pod.position.x}%`,
              width: '64px',
              height: '64px',
              transform: `translate(-50%, -50%) ${pod.matched ? 'scale(0)' : 'scale(1)'}`,
              backgroundColor: pod.matched ? 'transparent' : 'rgba(75, 85, 255, 0.8)',
              border: '2px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 0 10px rgba(100, 200, 255, 0.6)',
              transition: 'all 0.5s ease-in-out'
            }}
            onClick={() => handlePodClick(pod.id)}
            disabled={pod.matched || !gameActive}
          >
            <div className={`text-white font-bold ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
              {pod.fraction.numerator}/{pod.fraction.denominator}
            </div>
          </button>
        ))}
        
        {/* Success overlay */}
        {showSuccess && (
          <div className="absolute inset-0 bg-green-500/40 flex items-center justify-center animate-fade-in z-20">
            <div className="bg-white/90 rounded-lg p-6 text-center">
              <h3 className={`text-2xl font-bold mb-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                Level Complete!
              </h3>
              <p className={`${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                You found all equivalent fractions!
              </p>
            </div>
          </div>
        )}
        
        {/* Game over overlay */}
        {!gameActive && !showSuccess && (
          <div className="absolute inset-0 bg-red-500/40 flex items-center justify-center animate-fade-in z-20">
            <div className="bg-white/90 rounded-lg p-6 text-center">
              <h3 className={`text-2xl font-bold mb-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                Out of Fuel!
              </h3>
              <p className={`mb-4 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                Your spaceship ran out of fuel.
              </p>
              <Button onClick={resetLevel}>
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="text-center mt-2 mb-6">
        <div className={`text-lg font-medium mb-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
          How to Play:
        </div>
        <ul className={`text-sm text-muted-foreground text-left list-disc pl-5 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
          <li>Click on pods with fractions equal to {targetFraction.numerator}/{targetFraction.denominator}</li>
          <li>Correct pods give you +10 fuel</li>
          <li>Wrong pods cost you -10 fuel</li>
          <li>Find all equivalent fractions before fuel runs out</li>
        </ul>
      </div>
    </div>
  );
};

export default FractionGalaxy;
