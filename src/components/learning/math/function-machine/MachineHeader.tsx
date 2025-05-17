
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Star } from 'lucide-react';

interface MachineHeaderProps {
  level: number;
  score: number;
  useDyslexicFont: boolean;
  mode: 'guessRule' | 'findInput';
  targetOutput: number | null;
  onSpeakInstructions: () => void;
}

const MachineHeader: React.FC<MachineHeaderProps> = ({
  level,
  score,
  useDyslexicFont,
  mode,
  targetOutput,
  onSpeakInstructions
}) => {
  return (
    <div className="w-full bg-gradient-to-r from-soft-blue/30 to-soft-purple/30 rounded-lg p-6 mb-6">
      <h1 className={`text-2xl md:text-3xl font-bold text-center mb-2 text-primary ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
        Function Machine Lab
      </h1>
      
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium text-muted-foreground">
          Level {level}/5
        </div>
        <div className="flex items-center gap-2">
          {[...Array(score)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onSpeakInstructions}
        >
          <Volume2 className="h-5 w-5" />
        </Button>
      </div>
      
      <div className={`text-center mb-4 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
        <p className="text-lg">
          {mode === 'guessRule' ? 'What is the function rule?' : `Find an input that gives output: ${targetOutput}`}
        </p>
      </div>
    </div>
  );
};

export default MachineHeader;
