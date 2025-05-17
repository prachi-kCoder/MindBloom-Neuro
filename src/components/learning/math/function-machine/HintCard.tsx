
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { FunctionRule, Example } from './types';

interface HintCardProps {
  showHint: boolean;
  showSuccess: boolean;
  currentRule: FunctionRule | null;
  examples: Example[];
  mode: 'guessRule' | 'findInput';
  useDyslexicFont: boolean;
  targetOutput: number | null;
}

const HintCard: React.FC<HintCardProps> = ({
  showHint,
  showSuccess,
  currentRule,
  examples,
  mode,
  useDyslexicFont,
  targetOutput
}) => {
  // Function to generate a hint based on the examples
  const generateHint = () => {
    if (!currentRule || examples.length < 2) return "Try more inputs to see the pattern.";
    
    const ex1 = examples[0];
    
    if (currentRule.display.includes('+')) {
      return `Notice that the output is always greater than the input by a specific amount.`;
    } else if (currentRule.display.includes('-')) {
      return `Notice that the output is always less than the input by a specific amount.`;
    } else if (currentRule.display.includes('x') && !currentRule.display.includes('+') && !currentRule.display.includes('-')) {
      return `Think about multiplication or division. What happens when we multiply or divide the input?`;
    } else if (currentRule.display.includes('²')) {
      return `Look carefully at how quickly the output grows as the input increases. Think about powers or squares.`;
    } else if (currentRule.display.includes('√')) {
      return `The output grows more slowly than the input. Think about roots or square roots.`;
    }
    
    return currentRule.hint || "Look for patterns in how the input changes to become the output.";
  };

  if (!showHint || showSuccess) return null;

  return (
    <motion.div 
      className="mt-6 w-full max-w-md"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start">
            <Lightbulb className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className={`font-medium mb-1 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                Hint
              </h4>
              <p className={`text-sm text-muted-foreground ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                {currentRule?.hint || generateHint()}
              </p>
              {mode === 'findInput' && targetOutput !== null && (
                <p className="text-sm mt-2">
                  We need to find an input that gives output: <strong>{targetOutput}</strong>
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HintCard;
