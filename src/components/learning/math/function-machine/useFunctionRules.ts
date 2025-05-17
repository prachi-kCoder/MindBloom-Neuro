
import { useState, useEffect } from 'react';
import { FunctionRule } from './types';

export const useFunctionRules = (level: number) => {
  const [functionRules, setFunctionRules] = useState<FunctionRule[]>([]);
  
  useEffect(() => {
    const levelRules: FunctionRule[] = [];
    
    // Level 1: Simple addition and subtraction with clear hints
    if (level >= 1) {
      levelRules.push(
        { 
          display: "x + 2", 
          calculate: (x) => x + 2,
          hint: "The rule adds 2 to any number",
          animation: "add"
        },
        { 
          display: "x + 5", 
          calculate: (x) => x + 5,
          hint: "The rule adds 5 to any number",
          animation: "add"
        },
        { 
          display: "x - 3", 
          calculate: (x) => x - 3,
          hint: "The rule subtracts 3 from any number",
          animation: "subtract"
        }
      );
    }
    
    // Level 2: Multiplication and division with hints
    if (level >= 2) {
      levelRules.push(
        { 
          display: "2x", 
          calculate: (x) => x * 2,
          hint: "The rule multiplies any number by 2",
          animation: "multiply"
        },
        { 
          display: "3x", 
          calculate: (x) => x * 3,
          hint: "The rule multiplies any number by 3",
          animation: "multiply" 
        },
        { 
          display: "x ÷ 2", 
          calculate: (x) => x / 2,
          hint: "The rule divides any number by 2",
          animation: "divide"
        }
      );
    }
    
    // Level 3: Combined operations with hints
    if (level >= 3) {
      levelRules.push(
        { 
          display: "2x + 1", 
          calculate: (x) => x * 2 + 1,
          hint: "The rule multiplies by 2, then adds 1",
          animation: "multiply" 
        },
        { 
          display: "3x - 2", 
          calculate: (x) => x * 3 - 2,
          hint: "The rule multiplies by 3, then subtracts 2",
          animation: "multiply"
        }
      );
    }
    
    // Level 4: More complex operations with hints
    if (level >= 4) {
      levelRules.push(
        { 
          display: "x² + 1", 
          calculate: (x) => x * x + 1,
          hint: "The rule squares the number, then adds 1",
          animation: "square"
        },
        { 
          display: "(x + 1)²", 
          calculate: (x) => (x + 1) * (x + 1),
          hint: "The rule adds 1, then squares the result",
          animation: "square"
        }
      );
    }
    
    // Level 5: Advanced operations with hints
    if (level >= 5) {
      levelRules.push(
        { 
          display: "x² - 3x + 2", 
          calculate: (x) => x * x - 3 * x + 2,
          hint: "The rule squares x, subtracts 3 times x, then adds 2",
          animation: "square"
        },
        { 
          display: "3x - 2", 
          calculate: (x) => 3 * x - 2,
          hint: "The rule multiplies by 3, then subtracts 2",
          animation: "multiply"
        },
        { 
          display: "√x + 1", 
          calculate: (x) => Math.sqrt(Math.abs(x)) + 1,
          hint: "The rule takes the square root, then adds 1",
          animation: "root"
        }
      );
    }
    
    setFunctionRules(levelRules);
  }, [level]);

  return functionRules;
};
