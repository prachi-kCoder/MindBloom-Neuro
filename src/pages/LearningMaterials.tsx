import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, FileText, Upload, Eye, Headphones, Volume2, VolumeX, Calculator, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import useDyslexiaFont from '@/hooks/useDyslexiaFont';
import { speak, stopSpeaking, isSpeaking } from '@/utils/textToSpeech';
import MathGames from '@/components/learning/math/MathGames';

const LearningMaterials = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textDisplayRef = useRef<HTMLDivElement>(null);
  
  // Get state from location if available
  const ageGroup = location.state?.ageGroup || "";
  const disabilityType = location.state?.disabilityType || "dyslexia";
  
  // State for dyslexia font
  const { useDyslexicFont, setUseDyslexicFont } = useDyslexiaFont(
    disabilityType === 'dyslexia'
  );
  
  // States for file handling
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [processedText, setProcessedText] = useState<string>("");
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  // Speech settings
  const [rate, setRate] = useState(0.9);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  
  // Tab state
  const [activeTab, setActiveTab] = useState("upload");
  
  // Effect to split text into sentences when text changes
  useEffect(() => {
    if (processedText) {
      // Split by sentences, keeping punctuation
      const newSentences = processedText
        .split(/(?<=[.!?])\s+/)
        .filter(sentence => sentence.trim().length > 0)
        .map(sentence => sentence.trim());
      
      setSentences(newSentences);
      setCurrentSentence(0);
      setCurrentWordIndex(0);
    }
  }, [processedText]);
  
  // Effect to handle speech stopping when component unmounts
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setFileType(selectedFile.type);
    }
  };
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const processFile = async () => {
    if (!file) return;
    
    setIsLoading(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let extractedText = "";
      
      if (fileType.includes("text") || fileType.includes("txt")) {
        // For text files, read the actual content
        const reader = new FileReader();
        extractedText = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsText(file);
        });
      } else {
        // For other file types, use sample based on age group
        extractedText = getSampleText();
      }
      
      setProcessedText(extractedText);
      setActiveTab("learn");
      
    } catch (error) {
      console.error("Error processing file:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getSampleText = () => {
    if (ageGroup === "8-10" || ageGroup === "10-12") {
      return `The Water Cycle Adventure

Water is always moving in a continuous cycle around our planet. This amazing process is called the water cycle, and it's happening all around us every single day.

First, the sun heats up water from oceans, lakes, and rivers. When water gets warm enough, it turns into invisible water vapor and rises into the air. This process is called evaporation.

As the water vapor rises higher into the sky, it gets cooler. When it cools down enough, it turns back into tiny water droplets. This is called condensation. These tiny droplets stick together to form clouds.

When the clouds get heavy with water droplets, they can't hold anymore water. The droplets fall back to Earth as rain, snow, or hail. This is called precipitation.

The water that falls to Earth flows into rivers and streams, which carry it back to the oceans. Then the whole cycle starts again! The water cycle is very important because it provides fresh water for all plants, animals, and people on Earth.`;
    } else {
      return `My Pet Dog Max

I have a wonderful pet dog named Max. Max is a golden retriever with soft, fluffy fur that shines in the sunlight.

Every morning, Max wakes me up by licking my face. He is always happy to see me and wags his tail so fast that his whole body wiggles.

Max loves to play fetch in the backyard. I throw a red ball, and he runs as fast as he can to catch it. Then he brings it back to me with his tail wagging.

When I'm sad, Max always knows. He puts his head on my lap and looks at me with his big brown eyes. This always makes me feel better.

At night, Max sleeps on a soft bed next to mine. He makes quiet snoring sounds that help me fall asleep.

Max is not just my pet, he is my best friend. I love him very much, and I know he loves me too.`;
    }
  };
  
  const highlightCurrentSentence = () => {
    if (!textDisplayRef.current || sentences.length === 0) return;
    
    const container = textDisplayRef.current;
    const allSentences = sentences.map((sentence, index) => {
      const isActive = index === currentSentence;
      const className = isActive 
        ? 'bg-yellow-200 dark:bg-yellow-900/50 px-1 rounded transition-colors duration-300' 
        : 'px-1';
      
      return `<span class="${className}" data-sentence="${index}">${sentence}</span>`;
    }).join(' ');
    
    container.innerHTML = allSentences;
  };
  
  const speakCurrentSentence = () => {
    if (sentences.length === 0) return;
    
    const currentText = sentences[currentSentence];
    const words = currentText.split(' ');
    
    speak(currentText, {
      rate,
      pitch,
      volume,
      onStart: () => {
        setIsPlaying(true);
        highlightCurrentSentence();
      },
      onEnd: () => {
        setIsPlaying(false);
        // Auto-advance to next sentence
        if (currentSentence < sentences.length - 1) {
          setTimeout(() => {
            setCurrentSentence(prev => prev + 1);
          }, 500);
        }
      },
      onError: (e) => {
        console.error("Speech synthesis error:", e);
        setIsPlaying(false);
      }
    });
  };
  
  const handlePlayPause = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      speakCurrentSentence();
    }
  };
  
  const handleNextSentence = () => {
    if (currentSentence < sentences.length - 1) {
      stopSpeaking();
      setIsPlaying(false);
      setCurrentSentence(currentSentence + 1);
    }
  };
  
  const handlePreviousSentence = () => {
    if (currentSentence > 0) {
      stopSpeaking();
      setIsPlaying(false);
      setCurrentSentence(currentSentence - 1);
    }
  };
  
  const handleSentenceClick = (sentenceIndex: number) => {
    stopSpeaking();
    setIsPlaying(false);
    setCurrentSentence(sentenceIndex);
  };
  
  // Update highlighting when current sentence changes
  useEffect(() => {
    highlightCurrentSentence();
  }, [currentSentence, sentences]);
  
  const goBack = () => {
    stopSpeaking();
    navigate(-1);
  };
  
  const toggleDyslexicFont = () => {
    setUseDyslexicFont(!useDyslexicFont);
  };
  
  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 pl-0" 
          onClick={goBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Learning Center
        </Button>
        
        <div className="mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
            Learning Materials
          </h1>
          <p className={`text-lg text-muted-foreground mb-4 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
            Upload educational content and learn with interactive audio and visual support
          </p>
          
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={toggleDyslexicFont} className="whitespace-nowrap">
              {useDyslexicFont ? 'Standard Font' : 'Dyslexia-Friendly Font'}
            </Button>
            
            {processedText && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">{sentences.length}</span> sentences • 
                <span className="font-medium"> Sentence {currentSentence + 1}</span> of {sentences.length}
              </div>
            )}
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-3 w-full max-w-md mb-8">
            <TabsTrigger value="upload" className={useDyslexicFont ? 'font-dyslexic' : ''}>
              Upload Material
            </TabsTrigger>
            <TabsTrigger value="learn" className={useDyslexicFont ? 'font-dyslexic' : ''}>
              Learn & Listen
            </TabsTrigger>
            <TabsTrigger value="math" className={useDyslexicFont ? 'font-dyslexic' : ''}>
              Math Games
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className={`${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                  Upload Educational Material
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                    onClick={handleUploadClick}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt,.text"
                    />
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Upload className="h-16 w-16 text-primary" />
                      <div>
                        <h3 className={`text-xl font-medium mb-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                          Drop your file here or click to browse
                        </h3>
                        <p className={`text-sm text-muted-foreground ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                          Supports PDF, Word documents, and text files
                        </p>
                        <p className={`text-xs text-muted-foreground mt-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                          Maximum file size: 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {file && (
                    <div className="bg-muted/20 p-6 rounded-lg flex flex-col md:flex-row gap-4 items-center justify-between border-l-4 border-l-primary">
                      <div className="flex items-center gap-4">
                        <FileText className="h-12 w-12 text-primary" />
                        <div>
                          <p className={`font-medium text-lg ${useDyslexicFont ? 'font-dyslexic' : ''}`}>{fileName}</p>
                          <p className={`text-sm text-muted-foreground ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                            {(file.size / 1024).toFixed(1)} KB • {fileType}
                          </p>
                        </div>
                      </div>
                      <Button onClick={processFile} disabled={isLoading} size="lg">
                        {isLoading ? 'Processing...' : 'Process & Learn'}
                      </Button>
                    </div>
                  )}
                  
                  {isLoading && (
                    <div className="space-y-4">
                      <p className={`text-sm text-center ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                        Processing your document for interactive learning...
                      </p>
                      <Progress value={65} className="h-3" />
                      <div className="text-xs text-center text-muted-foreground">
                        Extracting text • Preparing audio • Optimizing for accessibility
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="learn" className="space-y-6">
            {!processedText ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Eye className="h-16 w-16 text-muted-foreground mb-6" />
                  <h3 className={`text-2xl font-medium mb-4 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                    Ready to Learn?
                  </h3>
                  <p className={`text-muted-foreground text-center mb-6 max-w-md ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                    Upload a document to start your interactive learning experience with text-to-speech, highlighting, and comprehension tools.
                  </p>
                  <Button onClick={() => setActiveTab("upload")} size="lg">
                    Upload Your First Document
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Audio Controls */}
                <Card>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                      <Headphones className="h-5 w-5" />
                      Audio Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Playback Controls */}
                      <div className="flex items-center justify-center gap-4">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={handlePreviousSentence}
                          disabled={currentSentence === 0}
                        >
                          <SkipBack className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          size="lg"
                          onClick={handlePlayPause}
                          className="h-16 w-16 rounded-full"
                        >
                          {isPlaying ? (
                            <Pause className="h-6 w-6" />
                          ) : (
                            <Play className="h-6 w-6" />
                          )}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={handleNextSentence}
                          disabled={currentSentence === sentences.length - 1}
                        >
                          <SkipForward className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Progress</span>
                          <span>{Math.round(((currentSentence + 1) / sentences.length) * 100)}%</span>
                        </div>
                        <Progress 
                          value={((currentSentence + 1) / sentences.length) * 100} 
                          className="h-2" 
                        />
                      </div>
                      
                      {/* Audio Settings */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label className={`text-sm font-medium ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                              Reading Speed
                            </label>
                            <span className="text-sm text-muted-foreground">
                              {rate}x
                            </span>
                          </div>
                          <Slider
                            value={[rate]}
                            min={0.5}
                            max={2}
                            step={0.1}
                            onValueChange={(value) => setRate(value[0])}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Slower</span>
                            <span>Faster</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label className={`text-sm font-medium ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                              Voice Pitch
                            </label>
                            <span className="text-sm text-muted-foreground">
                              {pitch.toFixed(1)}
                            </span>
                          </div>
                          <Slider
                            value={[pitch]}
                            min={0.5}
                            max={2}
                            step={0.1}
                            onValueChange={(value) => setPitch(value[0])}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Lower</span>
                            <span>Higher</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label className={`text-sm font-medium ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                              Volume
                            </label>
                            <span className="text-sm text-muted-foreground">
                              {(volume * 100).toFixed(0)}%
                            </span>
                          </div>
                          <Slider
                            value={[volume]}
                            min={0}
                            max={1}
                            step={0.1}
                            onValueChange={(value) => setVolume(value[0])}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Quiet</span>
                            <span>Loud</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Text Content */}
                <Card>
                  <CardHeader>
                    <CardTitle className={`${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                      Interactive Reading
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-200 dark:bg-yellow-900/50 rounded"></div>
                        <span>Currently reading sentence is highlighted</span>
                        <span>•</span>
                        <span>Click any sentence to jump to it</span>
                      </div>
                      
                      <div 
                        ref={textDisplayRef}
                        className={`text-lg leading-relaxed p-6 bg-background border rounded-lg cursor-pointer ${useDyslexicFont ? 'font-dyslexic' : ''}`}
                        onClick={(e) => {
                          const target = e.target as HTMLElement;
                          const sentenceIndex = target.getAttribute('data-sentence');
                          if (sentenceIndex !== null) {
                            handleSentenceClick(parseInt(sentenceIndex));
                          }
                        }}
                        style={{ lineHeight: '2', fontSize: useDyslexicFont ? '1.2rem' : '1.125rem' }}
                      >
                        {sentences.map((sentence, index) => (
                          <span 
                            key={index}
                            className={`px-1 cursor-pointer hover:bg-muted/50 rounded transition-colors ${
                              index === currentSentence ? 'bg-yellow-200 dark:bg-yellow-900/50' : ''
                            }`}
                            data-sentence={index}
                          >
                            {sentence}
                          </span>
                        )).reduce((prev, curr, index) => 
                          index === 0 ? [curr] : [...prev, ' ', curr], [] as React.ReactNode[]
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="math" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  <span className={useDyslexicFont ? 'font-dyslexic' : ''}>
                    Interactive Math Games
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MathGames ageGroup={ageGroup} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default LearningMaterials;
