
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { speak, stopSpeaking, isSpeaking } from '@/utils/textToSpeech';
import useDyslexiaFont from '@/hooks/useDyslexiaFont';
import { toast } from 'sonner';
import { Volume2, ChevronRight, Lightbulb, Star, Divide, Plus, Minus, Equal, PlusCircle, MinusCircle, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FunctionMachineProps {
  level?: number;
  onComplete?: (score: number) => void;
}

interface FunctionRule {
  display: string;
  calculate: (x: number) => number;
  hint?: string;
  animation?: 'add' | 'subtract' | 'multiply' | 'divide' | 'square' | 'root';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [machineState, setMachineState] = useState<'idle' | 'processing' | 'success' | 'hint'>('idle');
  const [quickInputs, setQuickInputs] = useState<number[]>([1, 2, 5, 10]);
  const [suggestionInputs, setSuggestionInputs] = useState<number[]>([]);
  
  const machineRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize function rules based on level
  useEffect(() => {
    const levelRules: FunctionRule[] = [];
    
    // Level 1: Simple addition and subtraction with clear hints
    if (currentLevel >= 1) {
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
    if (currentLevel >= 2) {
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
    if (currentLevel >= 3) {
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
    if (currentLevel >= 4) {
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
    if (currentLevel >= 5) {
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
    setIsProcessing(false);
    setMachineState('idle');
    
    // Generate 3 example input-output pairs for the current rule
    const newExamples = [];
    const usedInputs = new Set();
    
    for (let i = 0; i < 3; i++) {
      let input;
      // Make sure we don't use the same input twice
      do {
        input = Math.floor(Math.random() * 10) + 1;
      } while (usedInputs.has(input));
      
      usedInputs.add(input);
      const output = randomRule.calculate(input);
      newExamples.push({ input, output });
    }
    setExamples(newExamples);
    
    // Generate suggestion inputs that would help identify the pattern
    const suggestedInputs = [];
    while (suggestedInputs.length < 4) {
      const suggestion = Math.floor(Math.random() * 12) + 1;
      if (!usedInputs.has(suggestion) && !suggestedInputs.includes(suggestion)) {
        suggestedInputs.push(suggestion);
      }
    }
    setSuggestionInputs(suggestedInputs);
    
    // Generate target output for findInput mode
    if (currentLevel >= 3 && mode === 'findInput') {
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
      'Figure out the function rule by testing different inputs' : 
      'Find the input that gives the target output'}`;
    speak(intro);
    
    return () => {
      stopSpeaking();
    };
  }, [currentLevel, mode]);
  
  // Play calculation sound effect
  const playCalculationSound = (animation: string = 'processing') => {
    // Use different sounds based on the animation type
    let soundEffect = '/sounds/machine-calculation.mp3'; // Default sound
    
    switch (animation) {
      case 'add':
        soundEffect = '/sounds/add.mp3';
        break;
      case 'subtract':
        soundEffect = '/sounds/subtract.mp3';
        break;
      case 'multiply':
        soundEffect = '/sounds/multiply.mp3';
        break;
      case 'divide':
        soundEffect = '/sounds/divide.mp3';
        break;
      case 'success':
        soundEffect = '/sounds/success.mp3';
        break;
      default:
        soundEffect = '/sounds/machine-calculation.mp3';
    }
    
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio(soundEffect);
    } else {
      audioRef.current.src = soundEffect;
    }
    
    audioRef.current.play().catch(e => console.log("Audio playback failed", e));
  };
  
  const calculateOutput = () => {
    if (!currentRule || inputValue === "") return;
    
    const input = parseFloat(inputValue);
    if (isNaN(input)) {
      toast.error("Please enter a valid number");
      return;
    }
    
    // Animate the calculation
    setIsProcessing(true);
    setMachineState('processing');
    
    // Play sound effect based on the function rule
    playCalculationSound(currentRule.animation || 'processing');
    
    // Add machine shake animation by adding and removing a class
    if (machineRef.current) {
      machineRef.current.classList.add('shake-animation');
      setTimeout(() => {
        if (machineRef.current) {
          machineRef.current.classList.remove('shake-animation');
        }
      }, 500);
    }
    
    // Simulate processing time for animation
    setTimeout(() => {
      const output = currentRule.calculate(input);
      setOutputValue(output);
      setIsProcessing(false);
      setMachineState('idle');
      
      // Speak the result
      speak({
        text: `Input: ${input}, Output: ${output.toFixed(2)}`,
        pitch: 1.2,
        rate: 1.0
      });
    }, 800);
  };
  
  const checkAnswer = () => {
    setAttempts(attempts + 1);
    
    if (mode === 'guessRule') {
      if (!currentRule || userGuess === "") return;
      
      if (userGuess.trim().toLowerCase() === currentRule.display.toLowerCase()) {
        handleCorrectAnswer();
      } else {
        speak({
          text: "Not quite right. Try again! Watch what happens with different inputs.",
          pitch: 1.1
        });
        toast("Let's try some more inputs to figure this out", {
          description: "The pattern is there! You're getting closer.",
          icon: "🔍"
        });
        setShowHint(true);
        setMachineState('hint');
      }
    } else {
      // Find input mode
      if (userGuess === "" || !currentRule || targetOutput === null) return;
      
      const userInput = parseFloat(userGuess);
      if (isNaN(userInput)) {
        toast("Let's use a valid number for our input", {
          description: "We need a number that will give us the target output",
          icon: "🔢"
        });
        return;
      }
      
      const calculatedOutput = currentRule.calculate(userInput);
      const isCorrect = Math.abs(calculatedOutput - targetOutput) < 0.1; // Allow for floating point error
      
      if (isCorrect) {
        handleCorrectAnswer();
      } else {
        speak({
          text: `Your input ${userInput} gives output ${calculatedOutput.toFixed(2)}, but we need ${targetOutput}. Let's try a different input!`,
          pitch: 1.1
        });
        toast("Not the right input, but that's okay!", {
          description: `Input ${userInput} gives output ${calculatedOutput.toFixed(2)}`,
          icon: "🔄"
        });
        setShowHint(true);
      }
    }
  };
  
  const handleCorrectAnswer = () => {
    setMachineState('success');
    playCalculationSound('success');
    
    speak({
      text: "That's correct! Great job figuring out the function rule!",
      pitch: 1.3,
      rate: 1.1
    });
    setScore(score + 1);
    setShowSuccess(true);
    toast.success("That's correct! Well done!", {
      icon: "🎉"
    });
    
    setTimeout(() => {
      if (currentLevel < 5) {
        setCurrentLevel(currentLevel + 1);
      } else {
        if (onComplete) {
          onComplete(score + 1);
        }
      }
    }, 3000);
  };
  
  const speakInstructions = () => {
    if (mode === 'guessRule') {
      speak({
        text: "Look at the input-output examples and try to figure out the function rule. For example, if input 1 gives output 3, and input 2 gives output 5, the rule might be 'x + 2'. Try different inputs to see the pattern.",
        rate: 0.9,
        pitch: 1.1
      });
    } else {
      speak({
        text: `Find the input value that gives an output of ${targetOutput}. Try different inputs to see what happens.`,
        rate: 0.9,
        pitch: 1.1
      });
    }
  };
  
  const useQuickInput = (input: number) => {
    setInputValue(input.toString());
    // Auto-calculate after a short delay
    setTimeout(() => {
      setInputValue(input.toString());
      calculateOutput();
    }, 200);
  };
  
  // Helper to get the appropriate icon for the current rule
  const getRuleIcon = () => {
    if (!currentRule) return <Equal className="h-5 w-5" />;
    
    if (currentRule.display.includes('+')) return <Plus className="h-5 w-5" />;
    if (currentRule.display.includes('-')) return <Minus className="h-5 w-5" />;
    if (currentRule.display.includes('÷') || currentRule.display.includes('/')) return <Divide className="h-5 w-5" />;
    return <Equal className="h-5 w-5" />;
  };
  
  // Function to generate a hint based on the examples
  const generateHint = () => {
    if (!currentRule || examples.length < 2) return "Try more inputs to see the pattern.";
    
    const ex1 = examples[0];
    const ex2 = examples[1];
    
    if (currentRule.display.includes('+')) {
      const diff = ex1.output - ex1.input;
      return `Notice that the output is always greater than the input by a specific amount.`;
    } else if (currentRule.display.includes('-')) {
      const diff = ex1.input - ex1.output;
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
  
  return (
    <div className="flex flex-col items-center p-4 max-w-4xl mx-auto">
      <div className="w-full bg-gradient-to-r from-soft-blue/30 to-soft-purple/30 rounded-lg p-6 mb-6">
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
        <div 
          ref={machineRef} 
          className="relative flex flex-col items-center bg-gray-100 rounded-lg p-4 pb-8 transition-all duration-300"
        >
          {/* Machine graphic */}
          <motion.div 
            className={`relative w-full h-36 md:h-48 bg-gradient-to-b from-soft-blue to-soft-purple rounded-lg mb-8 overflow-hidden transition-all duration-300 ${
              machineState === 'processing' ? 'shadow-lg shadow-soft-purple/30' : ''
            } ${
              machineState === 'success' ? 'shadow-lg shadow-green-400/50' : ''
            } ${
              machineState === 'hint' ? 'shadow-lg shadow-amber-400/50' : ''
            }`}
            animate={{
              scale: machineState === 'processing' ? [1, 1.02, 1] : 1,
              rotate: machineState === 'processing' ? [0, 0.5, -0.5, 0] : 0,
            }}
            transition={{ 
              duration: 0.5, 
              repeat: machineState === 'processing' ? Infinity : 0,
              repeatType: 'reverse'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gray-800 w-3/4 h-3/5 rounded-lg flex flex-col items-center justify-center p-4">
                <div className="text-white font-mono text-lg md:text-2xl flex items-center gap-2">
                  {machineState === 'processing' ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      {getRuleIcon()}
                    </motion.div>
                  ) : (
                    getRuleIcon()
                  )}
                  <div>
                    {(showHint && mode === 'guessRule') || machineState === 'success' ? currentRule?.display : "f(x) = ?"}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <AnimatePresence>
                    {machineState === 'processing' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                      >
                        <div className="text-gray-400 text-xs">Processing...</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-2 left-4 w-4 h-4 rounded-full bg-red-500"></div>
            <div className="absolute top-2 left-12 w-4 h-4 rounded-full bg-yellow-500"></div>
            <div className="absolute top-2 left-20 w-4 h-4 rounded-full bg-green-500"></div>
            
            {/* Animated lights */}
            <motion.div 
              className="absolute top-4 right-8 w-3 h-3 rounded-full bg-blue-500 opacity-75"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            ></motion.div>
            <motion.div 
              className="absolute top-8 right-4 w-2 h-2 rounded-full bg-pink-500 opacity-75"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.5 }}
            ></motion.div>
            
            {/* Input/Output pipes */}
            <div className="absolute top-0 left-1/4 w-4 h-8 bg-gray-700 rounded-b-lg"></div>
            <motion.div 
              className="absolute top-0 left-1/4 w-4 h-3 bg-soft-blue"
              animate={{ y: isProcessing ? [0, 8, 16, 24] : 0 }}
              transition={{ duration: 0.5, ease: "easeIn" }}
            ></motion.div>
            
            <div className="absolute bottom-0 right-1/4 w-4 h-8 bg-gray-700 rounded-t-lg"></div>
            <AnimatePresence>
              {outputValue !== null && (
                <motion.div 
                  className="absolute bottom-0 right-1/4 w-4 h-0 bg-soft-purple"
                  initial={{ height: 0 }}
                  animate={{ height: outputValue !== null ? [0, 3, 8] : 0 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.8 }}
                ></motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
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
                disabled={machineState === 'processing' || showSuccess}
              />
            </div>
            <div className="flex-shrink-0">
              <Button 
                onClick={calculateOutput} 
                size="icon"
                variant={machineState === 'processing' ? "secondary" : "outline"}
                disabled={inputValue === "" || machineState === 'processing' || showSuccess}
                className={machineState === 'processing' ? "animate-pulse" : ""}
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
                className={`w-24 ${machineState === 'success' ? 'bg-green-50 border-green-200' : 'bg-muted'}`}
                placeholder="f(x)"
              />
            </div>
          </div>
          
          {/* Quick input buttons */}
          <div className="mb-6 w-full max-w-md">
            <div className={`text-sm font-medium mb-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
              Try these inputs:
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestionInputs.map((num, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => useQuickInput(num)}
                  disabled={machineState === 'processing' || showSuccess}
                  className="px-3 py-1 h-auto min-w-[40px] bg-white"
                >
                  {num}
                </Button>
              ))}
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
                    <motion.div 
                      className="my-1 h-6 flex items-center justify-center"
                      initial={false}
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                    <div className="text-xs text-muted-foreground">Output</div>
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
          
          {/* Hint section */}
          <AnimatePresence>
            {showHint && !showSuccess && (
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
            )}
          </AnimatePresence>
          
          {/* Success message */}
          <AnimatePresence>
            {showSuccess && (
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
            )}
          </AnimatePresence>
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
      
      {/* CSS for machine shake animation */}
      <style jsx>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-1deg); }
          50% { transform: translateX(5px) rotate(1deg); }
          75% { transform: translateX(-3px) rotate(-0.5deg); }
          100% { transform: translateX(0); }
        }
        
        .shake-animation {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default FunctionMachine;
