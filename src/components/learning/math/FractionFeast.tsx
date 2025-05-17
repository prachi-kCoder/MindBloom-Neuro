
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { speak, stopSpeaking } from '@/utils/textToSpeech';
import useDyslexiaFont from '@/hooks/useDyslexiaFont';
import { Slider } from '@/components/ui/slider';
import { Volume2, ArrowRight, RefreshCw, Star } from 'lucide-react';

interface FractionFeastProps {
  level?: number;
  onComplete?: (score: number) => void;
}

const FractionFeast: React.FC<FractionFeastProps> = ({ 
  level = 1, 
  onComplete 
}) => {
  const { useDyslexicFont } = useDyslexiaFont();
  const [currentLevel, setCurrentLevel] = useState(level);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [slices, setSlices] = useState(2);
  const [selectedSlices, setSelectedSlices] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [targetFraction, setTargetFraction] = useState({ numerator: 1, denominator: 2 });

  useEffect(() => {
    // Set level-appropriate challenges
    if (currentLevel === 1) {
      setSlices(2);
      setTargetFraction({ numerator: 1, denominator: 2 });
    } else if (currentLevel === 2) {
      setSlices(4);
      setTargetFraction({ numerator: 1, denominator: 4 });
    } else if (currentLevel === 3) {
      setSlices(3);
      setTargetFraction({ numerator: 1, denominator: 3 });
    } else if (currentLevel === 4) {
      setSlices(4);
      setTargetFraction({ numerator: 3, denominator: 4 });
    } else {
      setSlices(6);
      setTargetFraction({ numerator: 2, denominator: 6 });
    }

    setSelectedSlices([]);
    setShowSuccess(false);
    
    // Introduce the level with voice
    const intro = `Level ${currentLevel}: Select ${targetFraction.numerator} out of ${targetFraction.denominator} equal parts of the pizza`;
    speak(intro);

    return () => {
      stopSpeaking();
    };
  }, [currentLevel]);

  const handleSliceClick = (index: number) => {
    if (selectedSlices.includes(index)) {
      setSelectedSlices(selectedSlices.filter(i => i !== index));
    } else {
      if (selectedSlices.length < targetFraction.numerator) {
        setSelectedSlices([...selectedSlices, index]);
      }
    }
  };

  const checkAnswer = () => {
    setAttempts(attempts + 1);
    
    if (selectedSlices.length === targetFraction.numerator) {
      speak(`Great job! You selected ${targetFraction.numerator} out of ${targetFraction.denominator} slices correctly!`);
      setScore(score + 1);
      setShowSuccess(true);
      toast.success("That's correct! Well done!");
      
      setTimeout(() => {
        if (currentLevel < 5) {
          setCurrentLevel(currentLevel + 1);
        } else {
          if (onComplete) {
            onComplete(score + 1);
          }
        }
      }, 2000);
    } else {
      speak(`Try again. You need to select ${targetFraction.numerator} slices.`);
      toast.error("Not quite right. Try again!");
    }
  };

  const resetLevel = () => {
    setSelectedSlices([]);
    setShowSuccess(false);
  };

  const speakInstructions = () => {
    speak(`Select ${targetFraction.numerator} out of ${targetFraction.denominator} equal parts of the pizza`);
  };

  return (
    <div className="flex flex-col items-center p-4 max-w-4xl mx-auto">
      <div className="w-full bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 mb-6">
        <h1 className={`text-2xl md:text-3xl font-bold text-center mb-2 text-primary ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
          Fraction Feast
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
        
        <div className={`text-center mb-6 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
          <p className="text-lg">
            Select <span className="font-bold text-primary">{targetFraction.numerator}</span> out of 
            <span className="font-bold text-primary"> {targetFraction.denominator}</span> equal parts
          </p>
        </div>
      </div>

      <div className="relative w-64 h-64 md:w-80 md:h-80 mb-6">
        <div className="pizza-container w-full h-full rounded-full bg-yellow-100 border-4 border-yellow-500 relative overflow-hidden">
          {/* Pizza slices */}
          {[...Array(slices)].map((_, index) => {
            const rotation = (index * 360) / slices;
            const isSelected = selectedSlices.includes(index);
            
            return (
              <div 
                key={index}
                className={`absolute w-full h-full origin-bottom-center cursor-pointer
                           transition-colors duration-200 flex items-center justify-center
                           ${isSelected ? 'bg-red-400' : 'hover:bg-yellow-200'}`}
                style={{
                  clipPath: `polygon(50% 50%, ${50 - 50 * Math.cos(2 * Math.PI * index / slices)}% ${50 - 50 * Math.sin(2 * Math.PI * index / slices)}%, ${50 - 50 * Math.cos(2 * Math.PI * (index + 1) / slices)}% ${50 - 50 * Math.sin(2 * Math.PI * (index + 1) / slices)}%)`,
                  transform: `rotate(${rotation}deg)`,
                }}
                onClick={() => !showSuccess && handleSliceClick(index)}
              >
                {/* Pepperoni decorations */}
                <div className="w-4 h-4 rounded-full bg-red-600 absolute" 
                     style={{ top: '30%', left: '60%' }}></div>
                <div className="w-3 h-3 rounded-full bg-red-600 absolute" 
                     style={{ top: '50%', left: '70%' }}></div>
              </div>
            );
          })}
          
          {/* Success animation */}
          {showSuccess && (
            <div className="absolute inset-0 flex items-center justify-center animate-scale-in">
              <div className="bg-green-500/70 rounded-full w-full h-full flex items-center justify-center">
                <span className={`text-4xl font-bold text-white ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                  Correct!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
        <Button 
          onClick={resetLevel} 
          variant="outline" 
          disabled={selectedSlices.length === 0 || showSuccess}
          className="flex-1"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button 
          onClick={checkAnswer} 
          className="flex-1"
          disabled={selectedSlices.length === 0 || showSuccess}
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          Check Answer
        </Button>
      </div>
      
      <div className="mt-6 text-center">
        <div className={`text-xl font-medium mb-1 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
          Your fraction: {selectedSlices.length}/{slices}
        </div>
        <div className={`text-sm text-muted-foreground ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
          Target: {targetFraction.numerator}/{targetFraction.denominator}
        </div>
      </div>
    </div>
  );
};

export default FractionFeast;
