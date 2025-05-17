import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, FileText, Upload, Eye, Headphones, Volume2, VolumeX, Calculator } from 'lucide-react';
import useDyslexiaFont from '@/hooks/useDyslexiaFont';
import { speak, stopSpeaking, isSpeaking } from '@/utils/textToSpeech';
import MathGames from '@/components/learning/math/MathGames';

const LearningMaterials = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  const [segments, setSegments] = useState<string[]>([]);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Speech settings
  const [rate, setRate] = useState(0.9);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  
  // Questions and answers
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", ""],
    correctAnswer: 0
  });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  // Tab state
  const [activeTab, setActiveTab] = useState("upload");
  
  // Effect to split text into segments when text changes
  useEffect(() => {
    if (processedText) {
      // Split by paragraphs or sentences
      const newSegments = processedText
        .split(/\n\n|\.\s+/)
        .filter(segment => segment.trim().length > 10)
        .map(segment => segment.trim());
      
      setSegments(newSegments);
      setCurrentSegment(0);
      
      // Generate a simple question for the first segment
      if (newSegments.length > 0) {
        generateSimpleQuestion(newSegments[0]);
      }
    }
  }, [processedText]);
  
  // Effect to handle speech stopping when component unmounts
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);
  
  // Effect to update isPlaying state based on speech status
  useEffect(() => {
    const checkSpeechStatus = setInterval(() => {
      setIsPlaying(isSpeaking());
    }, 500);
    
    return () => {
      clearInterval(checkSpeechStatus);
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
      // For now, we'll simulate file processing
      // In a real app, this would send the file to a server or use a library
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For PDFs and DOCs, we'd extract text here
      // For this demo, we'll use sample text based on file extension
      let extractedText = "";
      
      if (fileType.includes("pdf")) {
        extractedText = getSamplePdfText();
      } else if (fileType.includes("doc") || fileType.includes("word")) {
        extractedText = getSampleDocText();
      } else if (fileType.includes("text") || fileType.includes("txt")) {
        // For text files, we can actually read the content
        const reader = new FileReader();
        extractedText = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsText(file);
        });
      } else {
        // For other file types, use generic sample
        extractedText = getSampleGenericText();
      }
      
      setProcessedText(extractedText);
      setActiveTab("learn");
      
    } catch (error) {
      console.error("Error processing file:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getSamplePdfText = () => {
    if (ageGroup === "8-10" || ageGroup === "10-12") {
      return `Reading Comprehension: The Water Cycle

Water is always moving in a continuous cycle. This is called the water cycle. The sun heats up water from oceans, lakes, and rivers. The water turns into water vapor. This is called evaporation.

The water vapor rises into the air where it's cooler. It turns back into tiny water droplets. This is called condensation. These water droplets form clouds.

When the clouds get heavy with water, the droplets fall back to Earth as rain, snow, or hail. This is called precipitation. The water flows into rivers, lakes, and oceans, and the cycle starts again.

The water cycle is important because it provides fresh water for plants, animals, and people. Without the water cycle, we wouldn't have clean water to drink.`;
    } else {
      return `Animals and Their Homes

Animals live in different kinds of homes. Birds live in nests. They make nests with sticks and leaves.

Rabbits live in burrows. Burrows are holes in the ground. Rabbits hide from danger in their burrows.

Fish live in water. They swim in oceans, lakes, and rivers. Water is their home.

Bees live in hives. They make honey in their hives. Bees work together to build their home.

Every animal has a special home that keeps it safe.`;
    }
  };
  
  const getSampleDocText = () => {
    if (ageGroup === "8-10" || ageGroup === "10-12") {
      return `The Solar System

Our solar system has eight planets that orbit around the Sun. The Sun is a star at the center of our solar system. It gives us light and heat.

The planets in order from the Sun are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Earth is the third planet from the Sun and the only planet known to have life.

Mercury is the smallest planet and also the closest to the Sun. Jupiter is the largest planet. It has a big red spot that is actually a giant storm.

Mars is known as the Red Planet because of its reddish color. Scientists think Mars might have had water on its surface long ago.

The solar system also has dwarf planets, moons, asteroids, and comets. Pluto used to be called the ninth planet, but now it's classified as a dwarf planet.`;
    } else {
      return `Colors All Around Us

Colors are everywhere! The sky is blue. Grass is green. Apples can be red or green. Bananas are yellow.

Colors make our world beautiful. We can mix colors to make new ones. If you mix red and yellow, you get orange. If you mix blue and yellow, you get green.

Colors can make us feel different emotions. Red can make us feel excited. Blue can make us feel calm. Yellow can make us feel happy.

What is your favorite color? Look around and see all the colors in your world!`;
    }
  };
  
  const getSampleGenericText = () => {
    return `Welcome to Learning Materials!

This is a sample text for demonstration purposes. In a real application, we would extract the actual content from your uploaded document.

For now, let's imagine this is educational content that has been extracted from your file.

You can use the controls below to:
- Listen to the text being read aloud
- Adjust the reading speed, pitch, and volume
- Move between different sections of text
- Answer questions about what you've learned

This interactive approach helps children with dyslexia, ADHD, and ASD better understand educational content through multiple sensory channels.`;
  };
  
  const generateSimpleQuestion = (text: string) => {
    // In a real app, this would use a more sophisticated algorithm or API
    // For now, we'll generate simple questions based on the text
    
    const questions = [
      {
        question: "What is the main topic of this text?",
        options: [
          text.split(" ").slice(0, 2).join(" "),
          text.split(" ").slice(2, 4).join(" "),
          "None of the above"
        ],
        correctAnswer: 0
      },
      {
        question: "Which word appears in the text?",
        options: [
          text.split(" ")[Math.floor(Math.random() * text.split(" ").length)],
          "Dinosaur",
          "Spaceship"
        ],
        correctAnswer: 0
      },
      {
        question: "What is this text about?",
        options: [
          text.substring(0, 20) + "...",
          "Sports and games",
          "Food recipes"
        ],
        correctAnswer: 0
      }
    ];
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQuestion);
  };
  
  const handlePlaySegment = () => {
    if (segments.length === 0) return;
    
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
      return;
    }
    
    const currentText = segments[currentSegment];
    
    speak(currentText, {
      rate,
      pitch,
      volume,
      onStart: () => setIsPlaying(true),
      onEnd: () => {
        setIsPlaying(false);
        setShowQuestion(true);
      },
      onError: (e) => {
        console.error("Speech synthesis error:", e);
        setIsPlaying(false);
      }
    });
  };
  
  const handleNextSegment = () => {
    if (currentSegment < segments.length - 1) {
      stopSpeaking();
      setIsPlaying(false);
      setCurrentSegment(currentSegment + 1);
      setShowQuestion(false);
      setShowResult(false);
      setSelectedAnswer(null);
      generateSimpleQuestion(segments[currentSegment + 1]);
    }
  };
  
  const handlePreviousSegment = () => {
    if (currentSegment > 0) {
      stopSpeaking();
      setIsPlaying(false);
      setCurrentSegment(currentSegment - 1);
      setShowQuestion(false);
      setShowResult(false);
      setSelectedAnswer(null);
      generateSimpleQuestion(segments[currentSegment - 1]);
    }
  };
  
  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };
  
  const handleAnswerSubmit = () => {
    if (selectedAnswer !== null) {
      setShowResult(true);
      
      // If answer is correct, allow moving to next segment
      if (selectedAnswer === currentQuestion.correctAnswer) {
        setTimeout(() => {
          if (currentSegment < segments.length - 1) {
            handleNextSegment();
          } else {
            setShowQuestion(false);
          }
        }, 2000);
      } else {
        // If answer is wrong, replay segment after showing result
        setTimeout(() => {
          setShowResult(false);
          setSelectedAnswer(null);
          setShowQuestion(false);
          handlePlaySegment();
        }, 3000);
      }
    }
  };
  
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
            Upload educational content and learn with audio and visual support
          </p>
          
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={toggleDyslexicFont} className="whitespace-nowrap">
              {useDyslexicFont ? 'Standard Font' : 'Dyslexia-Friendly Font'}
            </Button>
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
                  <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
                    onClick={handleUploadClick}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt,.text"
                    />
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Upload className="h-12 w-12 text-muted-foreground" />
                      <h3 className={`text-xl font-medium ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                        Click to upload a file
                      </h3>
                      <p className={`text-sm text-muted-foreground ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                        Upload PDF, Word, or Text files
                      </p>
                    </div>
                  </div>
                  
                  {file && (
                    <div className="bg-muted/30 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-10 w-10 text-primary" />
                        <div>
                          <p className={`font-medium ${useDyslexicFont ? 'font-dyslexic' : ''}`}>{fileName}</p>
                          <p className={`text-sm text-muted-foreground ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button onClick={processFile} disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Process File'}
                      </Button>
                    </div>
                  )}
                  
                  {isLoading && (
                    <div className="space-y-2">
                      <p className={`text-sm text-muted-foreground ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                        Processing file...
                      </p>
                      <Progress value={65} className="h-2" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="learn" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className={`${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                  Interactive Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!processedText ? (
                  <div className="text-center p-8">
                    <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className={`text-xl font-medium mb-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                      No material to display
                    </h3>
                    <p className={`text-sm text-muted-foreground mb-6 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                      Upload and process a file to start interactive learning
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const uploadTabTrigger = document.querySelector('[data-state="inactive"][data-value="upload"]') as HTMLButtonElement;
                        if (uploadTabTrigger) {
                          uploadTabTrigger.click();
                        }
                      }}
                    >
                      Go to Upload
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Audio controls */}
                    <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                          Audio Settings
                        </h3>
                        <div>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={handlePlaySegment}
                            className="mr-2"
                          >
                            {isPlaying ? (
                              <VolumeX className="h-4 w-4" />
                            ) : (
                              <Volume2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label className={`text-sm ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                              Speed
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
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label className={`text-sm ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                              Pitch
                            </label>
                            <span className="text-sm text-muted-foreground">
                              {pitch}
                            </span>
                          </div>
                          <Slider
                            value={[pitch]}
                            min={0.5}
                            max={2}
                            step={0.1}
                            onValueChange={(value) => setPitch(value[0])}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label className={`text-sm ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
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
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Content display */}
                    <div className="bg-card border rounded-lg p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className={`font-medium ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                          Section {currentSegment + 1} of {segments.length}
                        </h3>
                        <div className="text-sm text-muted-foreground">
                          <Headphones className="inline-block h-4 w-4 mr-1" />
                          Click the audio button to listen
                        </div>
                      </div>
                      
                      <div className={`text-lg mb-6 p-4 bg-background rounded-lg leading-relaxed ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                        {segments[currentSegment]}
                      </div>
                      
                      <div className="flex justify-between">
                        <Button 
                          variant="outline" 
                          onClick={handlePreviousSegment}
                          disabled={currentSegment === 0}
                        >
                          Previous Section
                        </Button>
                        <Button 
                          onClick={handleNextSegment}
                          disabled={currentSegment === segments.length - 1}
                        >
                          Next Section
                        </Button>
                      </div>
                    </div>
                    
                    {/* Questions section */}
                    {showQuestion && (
                      <div className="bg-muted/20 border-2 border-primary/20 rounded-lg p-6 animate-fade-in">
                        <h3 className={`text-xl font-medium mb-4 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                          Quick Check!
                        </h3>
                        
                        <p className={`mb-6 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                          {currentQuestion.question}
                        </p>
                        
                        <div className="space-y-3 mb-6">
                          {currentQuestion.options.map((option, index) => (
                            <div 
                              key={index} 
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                selectedAnswer === index 
                                  ? 'bg-primary/20 border-primary/50' 
                                  : 'hover:bg-muted/50'
                              } ${
                                showResult && index === currentQuestion.correctAnswer
                                  ? 'bg-green-100 border-green-500'
                                  : ''
                              } ${
                                showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer
                                  ? 'bg-red-100 border-red-500'
                                  : ''
                              }`}
                              onClick={() => !showResult && handleAnswerSelect(index)}
                            >
                              <p className={useDyslexicFont ? 'font-dyslexic' : ''}>
                                {option}
                              </p>
                            </div>
                          ))}
                        </div>
                        
                        {!showResult ? (
                          <Button 
                            onClick={handleAnswerSubmit}
                            disabled={selectedAnswer === null}
                          >
                            Submit Answer
                          </Button>
                        ) : (
                          <div className={`p-4 rounded-lg ${
                            selectedAnswer === currentQuestion.correctAnswer
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            <p className={`font-medium ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                              {selectedAnswer === currentQuestion.correctAnswer
                                ? 'Correct! Well done!'
                                : 'Not quite right. Let\'s review this section again.'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
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
