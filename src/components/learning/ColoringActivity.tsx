
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ColoringActivityProps {
  onProgress: (progress: number) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  ageGroup: string;
}

// Enhanced coloring templates with educational information
const COLORING_TEMPLATES = [
  {
    id: 'apple',
    name: 'Apple',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0yNTAgMTAwYzAtMzMuMzMzIDI1LTU4LjMzMyA3NS03NWwxMCAyMGMtNDEuNjY3IDEwLTYzLjMzMyAzMC02NSA2MHY0MGMzNi42NjctMzMuMzMzIDc4LjMzMy01MCAxMjUtNTAgNTAgMCA5MS42NjcgMjUgMTI1IDc1IDE2LjY2NyA0MS42NjcgMTYuNjY3IDgzLjMzMyAwIDEyNS04LjMzMyAxNi42NjctMzAgMzUuMTY3LTY1IDU1LjVzLTYyLjUgMzAuNS03NS4yIDMwLjVjLTguMiAwLTI5LjgtNy4xNjctNjQuOC0yMS41UzI2MCAzMzUgMjYwIDMzNXMtNDAuMzMzIDE0LjE2Ny03NS4zMzMgMjguNVMxMzMuMzMzIDM4NSAxMjUgMzg1Yy0xMi41IDAtNDAuMjMzLTEwLjE2Ny03NS43LTMwLjVTMjUgMzE2LjY2NyAxNiAzMDBjLTE2LjY2Ny00MS42NjctMTYuNjY3LTgzLjMzMyAwLTEyNSAzMy4zMzMtNTAgNzUtNzUgMTI1LTc1IDQ2LjY2NyAwIDg4LjMzMyAxNi42NjcgMTI1IDUwdi00MGMtMS44MzMtMzAtMjMuNS01MC02NS02MGwxMC0yMGM1MCAxNi42NjcgNzUgNDEuNjY3IDc1IDc1djYxbC0xMCAxMGEyMTYuNjI3IDIxNi42MjcgMCAwMC01MCAxNGMtMTYuNjY3IDYuNjY3LTMzLjMzMyAxNy41LTUwIDMyLjVTMTgzLjMzMyAzNTAgMTc1IDM1MGMtOC4zMzMgMC0yNS0xMC44MzMtNTAtMzIuNXMtMzMuMzMzLTI1LjgzMy01MC0zMi41YTE4MCAxODAgMCAwMC01MC0xNGwtMTAtMTB2LTYxWiIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==',
    labelPosition: { x: 250, y: 50 },
    funFact: "Apples are a great source of fiber and vitamin C!",
    suggestedColors: ['#FF5555', '#FF0000', '#8B0000', '#006400', '#228B22']
  },
  {
    id: 'butterfly',
    name: 'Butterfly',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0yNTAgMTAwYzMzLjMzMy0zMy4zMzMgNzAtNDUgMTEwLTM1IDQwIDEwIDYwIDM3LjUgNjAgODIuNSAwIDQ1LTE4LjMzMyA4MC44MzMtNTUgMTA3LjVzLTczLjMzMyAzNS44MzMtMTEwIDMyLjVjMzYuNjY3IDMuMzMzIDczLjMzMyA1LjgzMyAxMTAgMzIuNXM1NSA2Mi41IDU1IDEwNy41YzAgNDUtMjAgNzIuNS02MCA4Mi41LTQwIDEwLTc2LjY2Ny0xLjY2Ny0xMTAtMzUtMzMuMzMzIDMzLjMzMy03MCA0NS0xMTAgMzUtNDAtMTAtNjAtMzcuNS02MC04Mi41IDAtNDUgMTguMzMzLTgwLjgzMyA1NS0xMDcuNXM3My4zMzMtMjkuMTY3IDExMC0zMi41Yy0zNi42NjctMy4zMzMtNzMuMzMzLTUuODMzLTExMC0zMi41Uzk1IDE5Mi41IDk1IDE0Ny41YzAtNDUgMjAtNzIuNSA2MC04Mi41IDQwLTEwIDc2LjY2NyAxLjY2NyAxMTAgMzVaIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KICAgIDxjaXJjbGUgY3g9IjI1MCIgY3k9IjI1MCIgcj0iMTAiIGZpbGw9ImJsYWNrIi8+CiAgICA8cGF0aCBkPSJNMjUwIDIyMGMwIDAgMjAtMzAgNDAtMzAgTTI1MCAyMjBjMCAwLTIwLTMwLTQwLTMwIE0yNTAgMjgwYzAgMCAyMCAzMCA0MCAzMCBNMjUwIDI4MGMwIDAtMjAgMzAtNDAgMzAgTTI1MCAyMjBMMjUwIDI4MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==',
    labelPosition: { x: 250, y: 50 },
    funFact: "Butterflies taste with their feet and can see colors!",
    suggestedColors: ['#5555FF', '#FFAA55', '#FFFF55', '#FF55AA', '#AA55AA']
  },
  {
    id: 'flower',
    name: 'Flower',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxjaXJjbGUgY3g9IjI1MCIgY3k9IjI1MCIgcj0iNTAiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgogICAgPGNpcmNsZSBjeD0iMjUwIiBjeT0iMTUwIiByPSI0MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CiAgICA8Y2lyY2xlIGN4PSIyNTAiIGN5PSIzNTAiIHI9IjQwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KICAgIDxjaXJjbGUgY3g9IjE1MCIgY3k9IjI1MCIgcj0iNDAiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgogICAgPGNpcmNsZSBjeD0iMzUwIiBjeT0iMjUwIiByPSI0MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CiAgICA8cGF0aCBkPSJNMjUwIDMwMFYzODAiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIgLz4KPC9zdmc+',
    labelPosition: { x: 250, y: 50 },
    funFact: "Flowers help plants make seeds and attract bees for pollination!",
    suggestedColors: ['#FF55AA', '#FFFF55', '#55AA55', '#FFAA55', '#AA55AA']
  },
  {
    id: 'house',
    name: 'House',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0xMDAgMjUwdjE1MGgzMDB2LTE1MHoiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgogICAgPHBhdGggZD0iTTUwIDI1MGwxNTAgLTEwMCBoMTAwIGwxNTAgMTAweiIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CiAgICA8cmVjdCB4PSIyMDAiIHk9IjMwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgogICAgPHJlY3QgeD0iMjI1IiB5PSIzMjUiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==',
    labelPosition: { x: 250, y: 50 },
    funFact: "Houses keep us safe, warm and dry!",
    suggestedColors: ['#A52A2A', '#FFA07A', '#D2B48C', '#1E90FF', '#228B22']
  },
  {
    id: 'fish',
    name: 'Fish',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0xMzAgMjUwYzAtMzMuMzMzIDUwLTEwOC4zMzMgMTUwLTEyNSA4My4zMzMgMCAxNTAgNDEuNjY3IDIwMCAxMjVzLTExNi42NjcgMTI1LTIwMCAxMjVjLTEwMC0xNi42NjctMTUwLTkxLjY2Ny0xNTAtMTI1eiIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CiAgICA8Y2lyY2xlIGN4PSIxODAiIGN5PSIyMjAiIHI9IjE1IiBmaWxsPSJibGFjayIvPgogICAgPHBhdGggZD0iTTEyMCAyNTBsLTcwIDUwIE0xMjAgMjUwbC03MC01MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiAvPgo8L3N2Zz4=',
    labelPosition: { x: 250, y: 50 },
    funFact: "Fish live underwater and breathe through gills!",
    suggestedColors: ['#5555FF', '#00FFFF', '#FF5555', '#FFFF55', '#FF55AA']
  }
];

const COLORS = [
  { name: 'Red', value: '#FF5555' },
  { name: 'Blue', value: '#5555FF' },
  { name: 'Green', value: '#55AA55' },
  { name: 'Yellow', value: '#FFFF55' },
  { name: 'Purple', value: '#AA55AA' },
  { name: 'Orange', value: '#FFAA55' },
  { name: 'Pink', value: '#FF55AA' },
  { name: 'Brown', value: '#A52A2A' },
  { name: 'Black', value: '#000000' },
  { name: 'Light Blue', value: '#00FFFF' },
];

const ColoringActivity: React.FC<ColoringActivityProps> = ({ 
  onProgress, 
  currentStep, 
  setCurrentStep,
  ageGroup 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [currentTemplate, setCurrentTemplate] = useState(COLORING_TEMPLATES[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tutorMessage, setTutorMessage] = useState("Let's color a picture! Choose a color and start coloring!");
  const [showColorHelp, setShowColorHelp] = useState(false);
  const [colorCompletionCount, setColorCompletionCount] = useState<{[key: string]: number}>({});
  const [coloredPixels, setColoredPixels] = useState(0);
  const [totalPixels, setTotalPixels] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the template
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Set the initial total pixels (this is an approximation)
      // In a real implementation, you'd count the actual drawable pixels
      setTotalPixels(canvas.width * canvas.height / 3);
      setColoredPixels(0);
      setColorCompletionCount({});
    };
    img.src = currentTemplate.image;
    
    // Calculate progress based on steps
    const steps = [0, 25, 50, 75, 100];
    onProgress(steps[currentStep % steps.length]);
    
    // Update tutor message with fun fact
    setTutorMessage(`Let's color a ${currentTemplate.name}! ${currentTemplate.funFact}`);
  }, [currentTemplate, currentStep, onProgress]);
  
  const handleTemplateChange = (value: string) => {
    const template = COLORING_TEMPLATES.find(t => t.id === value);
    if (template) {
      setCurrentTemplate(template);
      setTutorMessage(`Let's color a ${template.name}! ${template.funFact}`);
      
      // Reset coloring progress
      setColoredPixels(0);
      setColorCompletionCount({});
    }
  };
  
  const handleColorChange = (value: string) => {
    setSelectedColor(value);
    const colorName = COLORS.find(c => c.value === value)?.name || "this color";
    setTutorMessage(`Great! Let's use ${colorName} to color the ${currentTemplate.name}.`);
  };
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
    
    // Update progress after each drawing session
    if (totalPixels > 0) {
      const progress = Math.min((coloredPixels / totalPixels) * 100, 100);
      onProgress(progress);
      
      // If more than 60% colored, show encouraging message
      if (progress > 60 && progress < 99) {
        setTutorMessage("You're doing great with your coloring! Keep going!");
      } else if (progress >= 99) {
        setTutorMessage("Wonderful job! You've finished coloring. Try another picture if you'd like!");
      }
    }
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      // Touch event
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    // Scale coordinates to canvas size
    x = (x / rect.width) * canvas.width;
    y = (y / rect.height) * canvas.height;
    
    ctx.fillStyle = selectedColor;
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // Track colored pixels (approximate)
    setColoredPixels(prev => prev + 10);
    
    // Track colors used (for educational feedback)
    const colorName = COLORS.find(c => c.value === selectedColor)?.name || "Color";
    setColorCompletionCount(prev => ({
      ...prev,
      [colorName]: (prev[colorName] || 0) + 1
    }));
  };
  
  const showSuggestedColors = () => {
    setShowColorHelp(!showColorHelp);
    if (!showColorHelp) {
      setTutorMessage(`Here are some colors that might look nice for the ${currentTemplate.name}!`);
    } else {
      setTutorMessage(`Let's color a ${currentTemplate.name}! ${currentTemplate.funFact}`);
    }
  };
  
  return (
    <div className="flex flex-col gap-6">
      {/* Tutor message bubble */}
      <div className="bg-muted/30 p-4 rounded-lg border relative">
        <div className="absolute left-4 -top-3 w-6 h-6 bg-soft-blue rounded-full flex items-center justify-center">
          🎨
        </div>
        <p className="pl-6 text-sm">{tutorMessage}</p>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="w-full sm:w-auto">
          <p className="text-sm mb-1">Choose a picture:</p>
          <Select onValueChange={handleTemplateChange} defaultValue={currentTemplate.id}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {COLORING_TEMPLATES.map(template => (
                <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm">Choose a color:</p>
            <Button 
              variant="ghost"
              size="sm"
              onClick={showSuggestedColors}
              className="text-xs h-7 px-2"
            >
              {showColorHelp ? "Hide" : "Suggest colors"}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {COLORS.map(color => (
              <button
                key={color.name}
                className={`w-8 h-8 rounded-full border-2 ${selectedColor === color.value ? 'border-black' : 'border-transparent'}`}
                style={{ backgroundColor: color.value }}
                onClick={() => handleColorChange(color.value)}
                title={color.name}
              />
            ))}
          </div>
          
          {/* Suggested colors for current template */}
          {showColorHelp && (
            <div className="mt-2 p-2 bg-muted/20 rounded-md">
              <p className="text-xs mb-1">Suggested for {currentTemplate.name}:</p>
              <div className="flex flex-wrap gap-2">
                {currentTemplate.suggestedColors.map((color, index) => (
                  <button
                    key={index}
                    className={`w-6 h-6 rounded-full border border-gray-300 ${selectedColor === color ? 'ring-2 ring-black' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="relative border rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="w-full touch-none bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        
        {/* Image label */}
        <div 
          className="absolute text-xl font-bold" 
          style={{ 
            top: `${currentTemplate.labelPosition.y}px`, 
            left: `${currentTemplate.labelPosition.x}px`, 
            transform: 'translate(-50%, 0)' 
          }}
        >
          {currentTemplate.name}
        </div>
      </div>
      
      {/* Color recognition feedback */}
      {Object.keys(colorCompletionCount).length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium mb-1">Colors you've used:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(colorCompletionCount)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([colorName, count]) => (
                <div 
                  key={colorName}
                  className="px-2 py-1 rounded-full text-xs font-medium bg-muted/30"
                >
                  {colorName}
                </div>
              ))
            }
          </div>
        </div>
      )}
      
      <div className="flex justify-center mt-4">
        <div className="text-center">
          {ageGroup === '0-3' && (
            <p className="text-sm bg-soft-peach/30 p-3 rounded">
              <strong>Parent tip:</strong> Ask your child to name the colors they're using and the object they're coloring!
            </p>
          )}
          {ageGroup === '3-4' && (
            <p className="text-sm bg-soft-peach/30 p-3 rounded">
              <strong>Parent tip:</strong> Ask questions like "What color is an apple in real life?" to help reinforce color recognition.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColoringActivity;
