
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { speak, stopSpeaking } from '@/utils/textToSpeech';
import { Circle, Save, Download, Paintbrush, Eraser } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    suggestedColors: ['#FF5555', '#FF0000', '#8B0000', '#006400', '#228B22'],
    parentPrompt: "Ask your child: Can you find something else that's red like an apple?"
  },
  {
    id: 'butterfly',
    name: 'Butterfly',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0yNTAgMTAwYzMzLjMzMy0zMy4zMzMgNzAtNDUgMTEwLTM1IDQwIDEwIDYwIDM3LjUgNjAgODIuNSAwIDQ1LTE4LjMzMyA4MC44MzMtNTUgMTA3LjVzLTczLjMzMyAzNS44MzMtMTEwIDMyLjVjMzYuNjY3IDMuMzMzIDczLjMzMyA1LjgzMyAxMTAgMzIuNXM1NSA2Mi41IDU1IDEwNy41YzAgNDUtMjAgNzIuNS02MCA4Mi41LTQwIDEwLTc2LjY2Ny0xLjY2Ny0xMTAtMzUtMzMuMzMzIDMzLjMzMy03MCA0NS0xMTAgMzUtNDAtMTAtNjAtMzcuNS02MC04Mi41IDAtNDUgMTguMzMzLTgwLjgzMyA1NS0xMDcuNXM3My4zMzMtMjkuMTY3IDExMC0zMi41Yy0zNi42NjctMy4zMzMtNzMuMzMzLTUuODMzLTExMC0zMi41Uzk1IDE5Mi41IDk1IDE0Ny41YzAtNDUgMjAtNzIuNSA2MC04Mi41IDQwLTEwIDc2LjY2NyAxLjY2NyAxMTAgMzVaIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KICAgIDxjaXJjbGUgY3g9IjI1MCIgY3k9IjI1MCIgcj0iMTAiIGZpbGw9ImJsYWNrIi8+CiAgICA8cGF0aCBkPSJNMjUwIDIyMGMwIDAgMjAtMzAgNDAtMzAgTTI1MCAyMjBjMCAwLTIwLTMwLTQwLTMwIE0yNTAgMjgwYzAgMCAyMCAzMCA0MCAzMCBNMjUwIDI4MGMwIDAtMjAgMzAtNDAgMzAgTTI1MCAyMjBMMjUwIDI4MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==',
    labelPosition: { x: 250, y: 50 },
    funFact: "Butterflies taste with their feet and can see colors!",
    suggestedColors: ['#5555FF', '#FFAA55', '#FFFF55', '#FF55AA', '#AA55AA'],
    parentPrompt: "Ask your child: What colors do you see on butterflies outside?"
  },
  {
    id: 'flower',
    name: 'Flower',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxjaXJjbGUgY3g9IjI1MCIgY3k9IjI1MCIgcj0iNTAiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgogICAgPGNpcmNsZSBjeD0iMjUwIiBjeT0iMTUwIiByPSI0MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CiAgICA8Y2lyY2xlIGN4PSIyNTAiIGN5PSIzNTAiIHI9IjQwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KICAgIDxjaXJjbGUgY3g9IjE1MCIgY3k9IjI1MCIgcj0iNDAiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgogICAgPGNpcmNsZSBjeD0iMzUwIiBjeT0iMjUwIiByPSI0MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CiAgICA8cGF0aCBkPSJNMjUwIDMwMFYzODAiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIgLz4KPC9zdmc+',
    labelPosition: { x: 250, y: 50 },
    funFact: "Flowers help plants make seeds and attract bees for pollination!",
    suggestedColors: ['#FF55AA', '#FFFF55', '#55AA55', '#FFAA55', '#AA55AA'],
    parentPrompt: "Ask your child: What sounds do different animals make?"
  },
  {
    id: 'house',
    name: 'House',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0xMDAgMjUwdjE1MGgzMDB2LTE1MHoiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgogICAgPHBhdGggZD0iTTUwIDI1MGwxNTAgLTEwMCBoMTAwIGwxNTAgMTAweiIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CiAgICA8cmVjdCB4PSIyMDAiIHk9IjMwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgogICAgPHJlY3QgeD0iMjI1IiB5PSIzMjUiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==',
    labelPosition: { x: 250, y: 50 },
    funFact: "Houses keep us safe, warm and dry!",
    suggestedColors: ['#A52A2A', '#FFA07A', '#D2B48C', '#1E90FF', '#228B22'],
    parentPrompt: "Ask your child: What colors are the houses in your neighborhood?"
  },
  {
    id: 'fish',
    name: 'Fish',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0xMzAgMjUwYzAtMzMuMzMzIDUwLTEwOC4zMzMgMTUwLTEyNSA4My4zMzMgMCAxNTAgNDEuNjY3IDIwMCAxMjVzLTExNi42NjcgMTI1LTIwMCAxMjVjLTEwMC0xNi42NjctMTUwLTkxLjY2Ny0xNTAtMTI1eiIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CiAgICA8Y2lyY2xlIGN4PSIxODAiIGN5PSIyMjAiIHI9IjE1IiBmaWxsPSJibGFjayIvPgogICAgPHBhdGggZD0iTTEyMCAyNTBsLTcwIDUwIE0xMjAgMjUwbC03MC01MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiAvPgo8L3N2Zz4=',
    labelPosition: { x: 250, y: 50 },
    funFact: "Fish live underwater and breathe through gills!",
    suggestedColors: ['#5555FF', '#00FFFF', '#FF5555', '#FFFF55', '#FF55AA'],
    parentPrompt: "Ask your child: What colors can fish be?"
  }
];

// Limited palette for young children to prevent overload
const COLORS = [
  { name: 'Red', value: '#FF5555' },
  { name: 'Blue', value: '#5555FF' },
  { name: 'Green', value: '#55AA55' },
  { name: 'Yellow', value: '#FFFF55' },
  { name: 'Purple', value: '#AA55AA' },
  { name: 'Orange', value: '#FFAA55' },
  { name: 'Pink', value: '#FF55AA' },
  { name: 'Brown', value: '#A52A2A' },
];

type ToolType = 'brush' | 'fill' | 'eraser';

const ColoringActivity: React.FC<ColoringActivityProps> = ({ 
  onProgress, 
  currentStep, 
  setCurrentStep,
  ageGroup 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [currentTemplate, setCurrentTemplate] = useState(COLORING_TEMPLATES[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tutorMessage, setTutorMessage] = useState("Let's color a picture! Choose a color and start coloring!");
  const [showColorHelp, setShowColorHelp] = useState(false);
  const [colorCompletionCount, setColorCompletionCount] = useState<{[key: string]: number}>({});
  const [coloredPixels, setColoredPixels] = useState(0);
  const [totalPixels, setTotalPixels] = useState(0);
  const [activeTool, setActiveTool] = useState<ToolType>('brush');
  const [brushSize, setBrushSize] = useState(10);
  const [outlineGlowMode, setOutlineGlowMode] = useState(true);
  const [lastPosition, setLastPosition] = useState<{x: number, y: number} | null>(null);
  const [showParentTip, setShowParentTip] = useState(false);
  const { toast } = useToast();
  
  // Store outline data for bucket fill validation
  const outlineDataRef = useRef<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Create offscreen canvas for outline detection
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    offscreenCanvasRef.current = offscreenCanvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the template
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Store outline data for bucket fill validation
      const offscreenCtx = offscreenCanvas.getContext('2d');
      if (offscreenCtx) {
        offscreenCtx.drawImage(img, 0, 0, canvas.width, canvas.height);
        outlineDataRef.current = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height);
      }
      
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
    
    // Announce the template with speech
    speak(`Let's color a ${currentTemplate.name}! ${currentTemplate.funFact}`);
    
  }, [currentTemplate, currentStep, onProgress]);
  
  const handleTemplateChange = (value: string) => {
    const template = COLORING_TEMPLATES.find(t => t.id === value);
    if (template) {
      setCurrentTemplate(template);
      setTutorMessage(`Let's color a ${template.name}! ${template.funFact}`);
      speak(`Let's color a ${template.name}! ${template.funFact}`);
      
      // Reset coloring progress
      setColoredPixels(0);
      setColorCompletionCount({});
      setShowParentTip(false);
    }
  };
  
  const handleColorChange = (value: string) => {
    setSelectedColor(value);
    const colorName = COLORS.find(c => c.value === value)?.name || "this color";
    setTutorMessage(`Great! Let's use ${colorName} to color the ${currentTemplate.name}.`);
    
    // Announce the color with speech
    speak(colorName);
  };
  
  const handleToolChange = (tool: ToolType) => {
    setActiveTool(tool);
    
    if (tool === 'brush') {
      speak("Use the brush to color small areas");
      setTutorMessage("Use the brush to color small areas");
    } else if (tool === 'fill') {
      speak("Tap inside an area to fill it with color!");
      setTutorMessage("Tap inside an area to fill it with color!");
    } else if (tool === 'eraser') {
      speak("Use the eraser to fix mistakes");
      setTutorMessage("Use the eraser to fix mistakes");
    }
  };
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
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
    
    if (activeTool === 'fill') {
      // Handle bucket fill tool
      bucketFill(Math.floor(x), Math.floor(y));
    } else {
      // For brush or eraser
      setIsDrawing(true);
      setLastPosition({ x, y });
      draw(e);
    }
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPosition(null);
    
    // Update progress after each drawing session
    if (totalPixels > 0) {
      const progress = Math.min((coloredPixels / totalPixels) * 100, 100);
      onProgress(progress);
      
      // If more than 60% colored, show encouraging message
      if (progress > 60 && progress < 99) {
        setTutorMessage("You're doing great with your coloring! Keep going!");
      } else if (progress >= 99) {
        setTutorMessage("Wonderful job! You've finished coloring. Try another picture if you'd like!");
        speak("Wonderful job! You've finished coloring.");
        setShowParentTip(true);
      }
    }
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if (activeTool !== 'brush' && activeTool !== 'eraser') return;
    
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
    
    // Set drawing styles based on selected tool
    if (activeTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize + 5; // Slightly larger eraser
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = selectedColor;
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize;
    }
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Use last position for smoother lines
    if (lastPosition) {
      ctx.beginPath();
      ctx.moveTo(lastPosition.x, lastPosition.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      // Draw circle at the end point for smoother connection
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Check if coloring outside lines in outline glow mode
      if (outlineGlowMode && activeTool === 'brush') {
        checkOutlineCrossing(lastPosition.x, lastPosition.y, x, y);
      }
      
      // Track colored pixels (approximate)
      const pixelsAdded = Math.max(5, Math.floor(Math.sqrt(
        Math.pow(x - lastPosition.x, 2) + Math.pow(y - lastPosition.y, 2)
      ) * brushSize));
      
      setColoredPixels(prev => prev + pixelsAdded);
      
      // Track colors used
      if (activeTool === 'brush') {
        const colorName = COLORS.find(c => c.value === selectedColor)?.name || "Color";
        setColorCompletionCount(prev => ({
          ...prev,
          [colorName]: (prev[colorName] || 0) + pixelsAdded
        }));
      }
    }
    
    setLastPosition({ x, y });
  };
  
  // Bucket fill implementation
  const bucketFill = (startX: number, startY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get image data to work with pixels
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Get the color to fill with
    const fillColor = hexToRgb(selectedColor);
    if (!fillColor) return;
    
    // Get the color of the clicked pixel
    const targetColor = {
      r: data[(startY * canvas.width + startX) * 4],
      g: data[(startY * canvas.width + startX) * 4 + 1],
      b: data[(startY * canvas.width + startX) * 4 + 2],
      a: data[(startY * canvas.width + startX) * 4 + 3]
    };
    
    // If we're filling with the same color, no need to continue
    if (colorsMatch(targetColor, fillColor)) return;
    
    // Check if we're trying to fill an outline
    if (outlineGlowMode && outlineDataRef.current) {
      const outlineData = outlineDataRef.current.data;
      const index = (startY * canvas.width + startX) * 4;
      // If the pixel is black (part of the outline), show warning
      if (outlineData[index] < 50 && outlineData[index + 1] < 50 && outlineData[index + 2] < 50) {
        showOutlineWarning();
        return;
      }
    }
    
    // Create a queue for flood fill algorithm
    const queue: [number, number][] = [];
    queue.push([startX, startY]);
    
    // Count filled pixels
    let pixelsFilled = 0;
    
    // Perform flood fill
    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      const currentIndex = (y * canvas.width + x) * 4;
      
      // Check if this pixel matches target color
      if (
        x >= 0 && x < canvas.width &&
        y >= 0 && y < canvas.height &&
        data[currentIndex] === targetColor.r &&
        data[currentIndex + 1] === targetColor.g &&
        data[currentIndex + 2] === targetColor.b &&
        data[currentIndex + 3] === targetColor.a
      ) {
        // Fill the pixel
        data[currentIndex] = fillColor.r;
        data[currentIndex + 1] = fillColor.g;
        data[currentIndex + 2] = fillColor.b;
        data[currentIndex + 3] = 255;
        
        pixelsFilled++;
        
        // Add surrounding pixels to the queue
        queue.push([x + 1, y]);
        queue.push([x - 1, y]);
        queue.push([x, y + 1]);
        queue.push([x, y - 1]);
        
        // Limit queue size for performance
        if (queue.length > 10000) {
          break;
        }
      }
    }
    
    // Update canvas with the filled area
    ctx.putImageData(imageData, 0, 0);
    
    // Track colored pixels and colors used
    setColoredPixels(prev => prev + pixelsFilled);
    const colorName = COLORS.find(c => c.value === selectedColor)?.name || "Color";
    setColorCompletionCount(prev => ({
      ...prev,
      [colorName]: (prev[colorName] || 0) + pixelsFilled
    }));
    
    // Say color name
    speak(colorName);
  };
  
  // Check if coloring crosses an outline
  const checkOutlineCrossing = (x1: number, y1: number, x2: number, y2: number) => {
    if (!outlineDataRef.current) return;
    
    const outlineData = outlineDataRef.current.data;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Sample points along the line
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const steps = Math.max(5, Math.ceil(distance));
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = Math.floor(x1 + (x2 - x1) * t);
      const y = Math.floor(y1 + (y2 - y1) * t);
      
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
      
      const index = (y * canvas.width + x) * 4;
      
      // Check if we hit an outline (black pixel)
      if (outlineData[index] < 50 && outlineData[index + 1] < 50 && outlineData[index + 2] < 50) {
        showOutlineWarning();
        return;
      }
    }
  };
  
  // Show warning when coloring outside lines
  const showOutlineWarning = () => {
    setTutorMessage("Let's try to color inside the lines!");
    speak("Let's try to color inside the lines!");
    
    // Add temporary glow effect to outline
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Save current state
    ctx.save();
    
    // Add red glow to outline
    ctx.shadowColor = 'red';
    ctx.shadowBlur = 10;
    
    // Redraw the template outline
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Remove glow after a short time
      setTimeout(() => {
        ctx.restore();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }, 1000);
    };
    img.src = currentTemplate.image;
  };
  
  const showSuggestedColors = () => {
    setShowColorHelp(!showColorHelp);
    if (!showColorHelp) {
      setTutorMessage(`Here are some colors that might look nice for the ${currentTemplate.name}!`);
      speak(`Here are some colors that might look nice for the ${currentTemplate.name}!`);
    } else {
      setTutorMessage(`Let's color a ${currentTemplate.name}! ${currentTemplate.funFact}`);
    }
  };
  
  // Save the current artwork to PNG and localStorage
  const saveArtwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    try {
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/png');
      
      // Try to store in localStorage (with error handling for quota exceeded)
      try {
        localStorage.setItem(`coloring_${currentTemplate.id}`, dataUrl);
        setTutorMessage("Your artwork has been saved! You can see it later.");
        speak("Your artwork has been saved!");
        toast({
          title: "Artwork saved!",
          description: "Your masterpiece has been saved.",
        });
        setShowParentTip(true);
      } catch (e) {
        console.error("Error saving to localStorage:", e);
        // Continue with download as fallback
      }
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${currentTemplate.name}_coloring.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Error saving artwork:", e);
      setTutorMessage("There was a problem saving your artwork.");
    }
  };
  
  // Helper function for bucket fill to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: 255
    } : null;
  };
  
  // Helper function to compare colors
  const colorsMatch = (color1: {r: number, g: number, b: number, a: number}, color2: {r: number, g: number, b: number, a: number}) => {
    return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b;
  };

  // Set brush size based on age group and device
  useEffect(() => {
    if (ageGroup === '0-3') {
      setBrushSize(15); // Larger for toddlers
    } else if (ageGroup === '3-4') {
      setBrushSize(12); 
    } else {
      setBrushSize(10);
    }
    
    // Detect mobile and set larger brush size
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      setBrushSize(prev => prev + 5);
    }
  }, [ageGroup]);
  
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
        {/* Template selection */}
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
        
        {/* Color selection */}
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
              <TooltipProvider key={color.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`w-8 h-8 rounded-full border-2 ${selectedColor === color.value ? 'border-black' : 'border-transparent'}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => handleColorChange(color.value)}
                      aria-label={color.name}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {color.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
      
      {/* Drawing tools */}
      <div className="flex flex-wrap gap-2 mb-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className={`p-2 rounded border ${activeTool === 'brush' ? 'bg-muted border-black' : 'bg-white'} cursor-pointer`}
                onClick={() => handleToolChange('brush')}
              >
                <Paintbrush size={20} />
              </div>
            </TooltipTrigger>
            <TooltipContent>Brush</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`p-2 rounded border ${activeTool === 'fill' ? 'bg-muted border-black' : 'bg-white'} cursor-pointer`}
                onClick={() => handleToolChange('fill')}
              >
                <Circle size={20} />
              </div>
            </TooltipTrigger>
            <TooltipContent>Fill</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`p-2 rounded border ${activeTool === 'eraser' ? 'bg-muted border-black' : 'bg-white'} cursor-pointer`}
                onClick={() => handleToolChange('eraser')}
              >
                <Eraser size={20} />
              </div>
            </TooltipTrigger>
            <TooltipContent>Eraser</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Brush size slider for older children */}
        {(ageGroup === '4-5' || ageGroup === '5-7' || ageGroup === '7-9' || ageGroup === '10-12') && (
          <div className="flex items-center gap-1 ml-2">
            <div className="h-3 w-3 rounded-full bg-current" />
            <input
              type="range"
              min="5"
              max="25"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-20"
            />
            <div className="h-5 w-5 rounded-full bg-current" />
          </div>
        )}
        
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="outline-glow" className="text-sm">Outline Help:</Label>
            <Switch
              id="outline-glow"
              checked={outlineGlowMode}
              onCheckedChange={setOutlineGlowMode}
            />
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={saveArtwork}
                >
                  <Download size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save your artwork</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Canvas */}
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
        <div className="text-center w-full max-w-md">
          {/* Parent tips section */}
          {showParentTip ? (
            <div className="text-sm bg-soft-peach/30 p-3 rounded animate-fade-in">
              <strong>Parent tip:</strong> {currentTemplate.parentPrompt}
            </div>
          ) : (
            <div className="text-sm bg-soft-peach/30 p-3 rounded">
              <strong>Parent tip:</strong> Ask your child to name the colors they're using and the object they're coloring!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColoringActivity;
