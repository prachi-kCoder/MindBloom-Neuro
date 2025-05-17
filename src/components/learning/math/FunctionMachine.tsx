import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { speak, stopSpeaking } from '@/utils/textToSpeech';
import useDyslexiaFont from '@/hooks/useDyslexiaFont';
import { toast } from 'sonner';
import { Volume2, ChevronRight, Lightbulb, Star, Divide, Plus, Minus, Equal } from 'lucide-react';

interface FunctionMachineProps {
  level?: number;
  onComplete?: (score: number) => void;
}

interface FunctionRule {
  display: string;
  calculate: (x: number) => number;
}

const FunctionMachine: React.FC<FunctionMachineProps> = ({ 
  level = 1, 
  onComplete 
}) => {
  const { useDyslexicFont } = useDyslexiaFont();
  const [currentLevel, setCurrentLevel] = useState(level);
  const [score, setScore] = useState(0);
  const [functionRules, setFunctionRules] = useState<FunctionRule[]>([]);
  const [currentRule, setCurrentRule] = useState<FunctionRule | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState<number | null>(null);
  const [userGuess, setUserGuess] = useState("");
  const [examples, setExamples] = useState<{input: number, output: number}[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [mode, setMode] = useState<'guessRule' | 'findInput'>('guessRule');
  const [targetOutput, setTargetOutput] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Initialize function rules based on level
  useEffect(() => {
    const levelRules: FunctionRule[] = [];
    
    // Level 1: Simple addition and subtraction
    if (currentLevel >= 1) {
      levelRules.push(
        { display: "x + 2", calculate: (x) => x + 2 },
        { display: "x + 5", calculate: (x) => x + 5 },
        { display: "x - 3", calculate: (x) => x - 3 }
      );
    }
    
    // Level 2: Multiplication and division
    if (currentLevel >= 2) {
      levelRules.push(
        { display: "2x", calculate: (x) => x * 2 },
        { display: "3x", calculate: (x) => x * 3 },
        { display: "x ÷ 2", calculate: (x) => x / 2 }
      );
    }
    
    // Level 3: Combined operations
    if (currentLevel >= 3) {
      levelRules.push(
        { display: "2x + 1", calculate: (x) => x * 2 + 1 },
        { display: "3x - 2", calculate: (x) => x * 3 - 2 }
      );
    }
    
    // Level 4: More complex operations
    if (currentLevel >= 4) {
      levelRules.push(
        { display: "x² + 1", calculate: (x) => x * x + 1 },
        { display: "(x + 1)²", calculate: (x) => (x + 1) * (x + 1) }
      );
    }
    
    // Level 5: Advanced operations
    if (currentLevel >= 5) {
      levelRules.push(
        { display: "x² - 3x + 2", calculate: (x) => x * x - 3 * x + 2 },
        { display: "3x - 2", calculate: (x) => 3 * x - 2 },
        { display: "√x + 1", calculate: (x) => Math.sqrt(Math.abs(x)) + 1 }
      );
    }
    
    setFunctionRules(levelRules);
    
    // Select random rule from available rules
    const randomRule = levelRules[Math.floor(Math.random() * levelRules.length)];
    setCurrentRule(randomRule);
    
    // Reset state
    setInputValue("");
    setOutputValue(null);
    setUserGuess("");
    setExamples([]);
    setShowHint(false);
    setMode(currentLevel < 3 ? 'guessRule' : (Math.random() > 0.5 ? 'guessRule' : 'findInput'));
    setAttempts(0);
    setShowSuccess(false);
    
    // Generate 3 example input-output pairs for the current rule
    const newExamples = [];
    for (let i = 0; i < 3; i++) {
      const input = Math.floor(Math.random() * 10) + 1;
      const output = randomRule.calculate(input);
      newExamples.push({ input, output });
    }
    setExamples(newExamples);
    
    // Generate target output for findInput mode
    if (currentLevel >= 3) {
      // Pick a reasonable target that will have an integer input
      let target: number;
      let input: number;
      
      // Try to find a target with a nice round number input
      if (randomRule.display.includes("x²")) {
        input = Math.floor(Math.random() * 4) + 1;
        target = randomRule.calculate(input);
      } else if (randomRule.display.includes("√x")) {
        input = Math.floor(Math.random() * 9) + 1;
        input = input * input; // Make sure it's a perfect square
        target = randomRule.calculate(input);
      } else {
        target = Math.floor(Math.random() * 20) + 5;
        // Try to reverse the function to find the input
        if (randomRule.display === "x + 2") input = target - 2;
        else if (randomRule.display === "x + 5") input = target - 5;
        else if (randomRule.display === "x - 3") input = target + 3;
        else if (randomRule.display === "2x") input = target / 2;
        else if (randomRule.display === "3x") input = target / 3;
        else if (randomRule.display === "x ÷ 2") input = target * 2;
        else if (randomRule.display === "2x + 1") input = (target - 1) / 2;
        else if (randomRule.display === "3x - 2") input = (target + 2) / 3;
        else input = Math.floor(Math.random() * 10) + 1;
      }
      
      setTargetOutput(target);
    }
    
    // Introduce the level with voice
    const intro = `Level ${currentLevel}: ${mode === 'guessRule' ? 
      'Figure out the function rule based on inputs and outputs' : 
      'Find the input that gives the target output'}`;
    speak(intro);
    
    return () => {
      stopSpeaking();
    };
  }, [currentLevel]);
  
  const calculateOutput = () => {
    if (!currentRule || inputValue === "") return;
    
    const input = parseFloat(inputValue);
    if (isNaN(input)) {
      toast.error("Please enter a valid number");
      return;
    }
    
    const output = currentRule.calculate(input);
    setOutputValue(output);
    speak(`Input: ${input}, Output: ${output.toFixed(2)}`);
  };
  
  const checkAnswer = () => {
    setAttempts(attempts + 1);
    
    if (mode === 'guessRule') {
      if (!currentRule || userGuess === "") return;
      
      if (userGuess.trim().toLowerCase() === currentRule.display.toLowerCase()) {
        handleCorrectAnswer();
      } else {
        speak("Not quite right. Try again!");
        toast.error("That's not the correct rule. Try again!");
        setShowHint(true);
      }
    } else {
      // Find input mode
      if (userGuess === "" || !currentRule || targetOutput === null) return;
      
      const userInput = parseFloat(userGuess);
      if (isNaN(userInput)) {
        toast.error("Please enter a valid number");
        return;
      }
      
      const calculatedOutput = currentRule.calculate(userInput);
      const isCorrect = Math.abs(calculatedOutput - targetOutput) < 0.1; // Allow for floating point error
      
      if (isCorrect) {
        handleCorrectAnswer();
      } else {
        speak(`Not quite right. Your input ${userInput} gives output ${calculatedOutput.toFixed(2)}, but we need ${targetOutput}`);
        toast.error("That's not the correct input. Try again!");
        setShowHint(true);
      }
    }
  };
  
  const handleCorrectAnswer = () => {
    speak("That's correct! Great job figuring out the function rule!");
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
  };
  
  const speakInstructions = () => {
    if (mode === 'guessRule') {
      speak("Look at the input-output examples and try to figure out the function rule. For example, if input 1 gives output 3, and input 2 gives output 5, the rule might be 'x + 2'.");
    } else {
      speak(`Find the input value that gives an output of ${targetOutput}. Try different inputs to see what happens.`);
    }
  };
  
  return (
    <div className="flex flex-col items-center p-4 max-w-4xl mx-auto">
      <div className="w-full bg-gradient-to-r from-blue-100 to-teal-100 rounded-lg p-6 mb-6">
        <h1 className={`text-2xl md:text-3xl font-bold text-center mb-2 text-primary ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
          Function Machine Lab
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
            {mode === 'guessRule' ? 'What is the function rule?' : `Find an input that gives output: ${targetOutput}`}
          </p>
        </div>
      </div>

      {/* Function Machine */}
      <div className="w-full max-w-lg mb-6">
        <div className="relative flex flex-col items-center bg-gray-100 rounded-lg p-4 pb-8">
          {/* Machine graphic */}
          <div className="relative w-full h-32 md:h-40 bg-gradient-to-b from-blue-500 to-purple-600 rounded-lg mb-8 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gray-800 w-3/4 h-1/2 rounded-lg flex flex-col items-center justify-center p-4">
                <div className="text-white font-mono text-lg md:text-2xl">
                  {showHint && mode === 'guessRule' ? currentRule?.display : "f(x) = ?"}
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {[Plus, Minus, Divide, Equal].map((Icon, i) => (
                    <Icon key={i} className="h-5 w-5 text-gray-400" />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-2 left-4 w-4 h-4 rounded-full bg-red-500"></div>
            <div className="absolute top-2 left-12 w-4 h-4 rounded-full bg-yellow-500"></div>
            <div className="absolute top-2 left-20 w-4 h-4 rounded-full bg-green-500"></div>
            
            {/* Pipes */}
            <div className="absolute top-0 left-1/4 w-4 h-8 bg-gray-700"></div>
            <div className="absolute bottom-0 right-1/4 w-4 h-8 bg-gray-700"></div>
          </div>
          
          {/* Input section */}
          <div className="flex items-center mb-6 w-full max-w-md">
            <div className="mr-4">
              <label className={`block text-sm font-medium mb-1 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                Input
              </label>
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-24"
                placeholder="x"
                disabled={mode === 'findInput' && showSuccess}
              />
            </div>
            <div className="flex-shrink-0">
              <Button 
                onClick={calculateOutput} 
                size="icon"
                variant="outline"
                disabled={inputValue === "" || showSuccess}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="ml-4">
              <label className={`block text-sm font-medium mb-1 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                Output
              </label>
              <Input
                type="text"
                value={outputValue !== null ? outputValue.toString() : ""}
                readOnly
                className="w-24 bg-muted"
                placeholder="f(x)"
              />
            </div>
          </div>
          
          {/* Examples */}
          <div className="mb-6 w-full">
            <h3 className={`text-sm font-medium mb-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
              Examples:
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {examples.map((ex, index) => (
                <Card key={index} className="bg-white">
                  <CardContent className="p-3 text-center">
                    <div className="text-xs text-muted-foreground">Input</div>
                    <div className="font-medium">{ex.input}</div>
                    <div className="text-xs text-muted-foreground mt-1">Output</div>
                    <div className="font-medium">{ex.output}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Answer input */}
          <div className="w-full max-w-md">
            <label className={`block text-sm font-medium mb-1 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
              {mode === 'guessRule' ? 'What is the function rule? (e.g., x + 2)' : 'What input gives the target output?'}
            </label>
            <div className="flex">
              <Input
                type="text"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                className="flex-1 mr-2"
                placeholder={mode === 'guessRule' ? "e.g., x + 2" : "Enter a number"}
                disabled={showSuccess}
              />
              <Button 
                onClick={checkAnswer}
                disabled={userGuess === "" || showSuccess}
              >
                Check
              </Button>
            </div>
          </div>
          
          {/* Hint button */}
          {!showHint && attempts > 1 && (
            <div className="mt-4 w-full max-w-md">
              <Button 
                variant="ghost" 
                onClick={() => setShowHint(true)}
                className="flex items-center"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                <span className={useDyslexicFont ? 'font-dyslexic' : ''}>Need a hint?</span>
              </Button>
            </div>
          )}
          
          {/* Success message */}
          {showSuccess && (
            <div className="mt-6 animate-fade-in w-full max-w-md">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <h3 className={`font-bold mb-1 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                  Correct!
                </h3>
                <p className={`text-sm ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                  {mode === 'guessRule' 
                    ? `You figured out the rule: ${currentRule?.display}`
                    : `Input ${userGuess} gives output ${targetOutput}`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Help section */}
      <div className="text-center mt-2 mb-6 w-full max-w-md">
        <div className={`text-lg font-medium mb-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
          How to Play:
        </div>
        <ul className={`text-sm text-muted-foreground text-left list-disc pl-5 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
          {mode === 'guessRule' ? (
            <>
              <li>Study the example inputs and outputs.</li>
              <li>Try your own inputs to see what happens.</li>
              <li>Figure out the rule and type it using "x" (e.g., x + 2, 2x, x² + 1).</li>
            </>
          ) : (
            <>
              <li>The function uses a hidden rule.</li>
              <li>Try different inputs to see what outputs they give.</li>
              <li>Find the input that gives the target output of {targetOutput}.</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default FunctionMachine;
