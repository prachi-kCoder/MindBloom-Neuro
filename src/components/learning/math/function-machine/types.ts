
export interface FunctionRule {
  display: string;
  calculate: (x: number) => number;
  hint?: string;
  animation?: 'add' | 'subtract' | 'multiply' | 'divide' | 'square' | 'root';
}

export interface Example {
  input: number;
  output: number;
}

export interface FunctionMachineProps {
  level?: number;
  onComplete?: (score: number) => void;
}
