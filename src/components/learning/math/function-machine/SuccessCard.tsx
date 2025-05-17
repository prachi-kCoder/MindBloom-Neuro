
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { FunctionRule } from './types';

interface SuccessCardProps {
  showSuccess: boolean;
  currentRule: FunctionRule | null;
  mode: 'guessRule' | 'findInput';
  targetOutput: number | null;
  userGuess: string;
  useDyslexicFont: boolean;
}

const SuccessCard: React.FC<SuccessCardProps> = ({
  showSuccess,
  currentRule,
  mode,
  targetOutput,
  userGuess,
  useDyslexicFont
}) => {
  if (!showSuccess) return null;

  return (
    <motion.div 
      className="mt-6 w-full max-w-md"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <Card className="bg-green-100 border-green-400 overflow-hidden">
        <div className="bg-green-500/10 px-4 py-2 border-b border-green-200 flex items-center">
          <BadgeCheck className="h-5 w-5 text-green-500 mr-2" />
          <h3 className={`font-bold ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
            Correct!
          </h3>
        </div>
        <CardContent className="p-4">
          <p className={`text-sm ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
            {mode === 'guessRule' 
              ? `You figured out the rule: ${currentRule?.display}`
              : `Input ${userGuess} gives output ${targetOutput}`}
          </p>
          <div className="flex justify-center mt-3">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0] 
              }}
              transition={{ duration: 1, repeat: 1 }}
            >
              <div className="text-3xl">🎉</div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SuccessCard;
