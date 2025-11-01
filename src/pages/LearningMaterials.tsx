import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, FileText, Upload, Eye, Headphones, Play, Pause, SkipBack, SkipForward, Save, Loader2 } from 'lucide-react';
import useDyslexiaFont from '@/hooks/useDyslexiaFont';
import { speak, stopSpeaking } from '@/utils/textToSpeech';
import { AudioRecorder } from '@/components/learning/AudioRecorder';
import { WhisperTranscription } from '@/components/learning/WhisperTranscription';
import MathGames from '@/components/learning/math/MathGames';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const LearningMaterials = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textDisplayRef = useRef<HTMLDivElement>(null);
  
  const ageGroup = location.state?.ageGroup || "";
  const disabilityType = location.state?.disabilityType || "dyslexia";
  
  const { useDyslexicFont, setUseDyslexicFont } = useDyslexiaFont(
    disabilityType === 'dyslexia'
  );
  
  // States
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [processedText, setProcessedText] = useState<string>("");
  const [materialTitle, setMaterialTitle] = useState("");
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [savedMaterials, setSavedMaterials] = useState<any[]>([]);
  const [currentMaterialId, setCurrentMaterialId] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [user, setUser] = useState<any>(null);
  
  // Speech settings
  const [rate, setRate] = useState(0.9);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  
  const [activeTab, setActiveTab] = useState("upload");

  // Check auth and load materials
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadSavedMaterials();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadSavedMaterials();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadSavedMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_materials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSavedMaterials(data || []);
    } catch (error) {
      console.error('Error loading materials:', error);
    }
  };

  useEffect(() => {
    if (processedText) {
      const newSentences = processedText
        .split(/(?<=[.!?])\s+/)
        .filter(sentence => sentence.trim().length > 0)
        .map(sentence => sentence.trim());
      
      setSentences(newSentences);
      setCurrentSentence(0);
    }
  }, [processedText]);
  
  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setFileType(selectedFile.type);
      setMaterialTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const processFile = async () => {
    if (!file) return;
    
    setIsLoading(true);
    
    try {
      let extractedText = "";
      
      if (fileType.includes("text") || fileType.includes("txt")) {
        const reader = new FileReader();
        extractedText = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsText(file);
        });
      } else {
        extractedText = `Processing ${fileName}...\n\nThis is extracted content from your uploaded file. The content will be read aloud with text-to-speech support.\n\nYou can upload text files (.txt) for actual content extraction, or use this sample text to test the learning features.`;
      }
      
      setProcessedText(extractedText);
      setActiveTab("learn");
      toast.success('Material processed successfully!');
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error('Failed to process file');
    } finally {
      setIsLoading(false);
    }
  };

  const saveMaterial = async () => {
    if (!user) {
      toast.error('Please log in to save materials');
      return;
    }

    if (!materialTitle || !processedText) {
      toast.error('Please provide a title and content');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('learning_materials')
        .insert({
          user_id: user.id,
          title: materialTitle,
          content: processedText,
          file_type: fileType,
          age_group: ageGroup,
          disability_type: disabilityType
        })
        .select()
        .single();

      if (error) throw error;
      
      setCurrentMaterialId(data.id);
      loadSavedMaterials();
      toast.success('Material saved successfully!');
    } catch (error) {
      console.error('Error saving material:', error);
      toast.error('Failed to save material');
    }
  };

  const loadMaterial = (material: any) => {
    setProcessedText(material.content);
    setMaterialTitle(material.title);
    setCurrentMaterialId(material.id);
    setActiveTab("learn");
    toast.success('Material loaded');
  };

  const handleAudioRecorded = async (blob: Blob, duration: number) => {
    if (!user) {
      toast.error('Please log in to submit audio assessments');
      return;
    }

    if (!currentMaterialId) {
      toast.error('Please save the material first');
      return;
    }

    try {
      // Upload audio to storage
      const fileName = `${user.id}/${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio-assessments')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio-assessments')
        .getPublicUrl(fileName);

      // Save assessment record
      const { error: insertError } = await supabase
        .from('audio_assessments')
        .insert({
          user_id: user.id,
          material_id: currentMaterialId,
          audio_url: publicUrl,
          duration_seconds: duration
        });

      if (insertError) throw insertError;

      setAudioBlob(blob);
      toast.success('Audio assessment submitted!');
    } catch (error) {
      console.error('Error submitting audio:', error);
      toast.error('Failed to submit audio assessment');
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
        if (currentSentence < sentences.length - 1) {
          setTimeout(() => {
            setCurrentSentence(prev => prev + 1);
          }, 500);
        }
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

  useEffect(() => {
    highlightCurrentSentence();
  }, [currentSentence, sentences]);

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 pl-0" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Learning Center
        </Button>
        
        <div className="mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
            Learning Materials
          </h1>
          <p className={`text-lg text-muted-foreground mb-4 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
            Upload content, learn with TTS, and submit audio assessments
          </p>
          
          <Button variant="outline" onClick={() => setUseDyslexicFont(!useDyslexicFont)}>
            {useDyslexicFont ? 'Standard Font' : 'Dyslexia-Friendly Font'}
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-8">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="learn">Learn</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="math">Math</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Educational Material</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Material Title"
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                />
                
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
                  <Upload className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">Drop your file here or click to browse</h3>
                  <p className="text-sm text-muted-foreground">Supports PDF, Word documents, and text files</p>
                </div>
                
                {file && (
                  <div className="bg-muted/20 p-6 rounded-lg">
                    <div className="flex items-center gap-4">
                      <FileText className="h-12 w-12 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-lg">{fileName}</p>
                        <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <Button onClick={processFile} disabled={isLoading}>
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : 'Process & Learn'}
                      </Button>
                    </div>
                  </div>
                )}

                {savedMaterials.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Your Saved Materials</h3>
                    <div className="space-y-2">
                      {savedMaterials.map((material) => (
                        <Card key={material.id} className="cursor-pointer hover:bg-muted/50" onClick={() => loadMaterial(material)}>
                          <CardContent className="p-4">
                            <h4 className="font-medium">{material.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(material.created_at).toLocaleDateString()}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="learn" className="space-y-6">
            {!processedText ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Eye className="h-16 w-16 text-muted-foreground mb-6" />
                  <h3 className="text-2xl font-medium mb-4">Ready to Learn?</h3>
                  <Button onClick={() => setActiveTab("upload")} size="lg">
                    Upload Your First Document
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Headphones className="h-5 w-5" />
                        Audio Controls
                      </CardTitle>
                      <Button onClick={saveMaterial} variant="outline" size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save Material
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
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
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
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
                    
                    <Progress value={((currentSentence + 1) / sentences.length) * 100} className="h-2" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Speed: {rate}x</label>
                        <Slider value={[rate]} onValueChange={([v]) => setRate(v)} min={0.5} max={2} step={0.1} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Pitch: {pitch}</label>
                        <Slider value={[pitch]} onValueChange={([v]) => setPitch(v)} min={0.5} max={2} step={0.1} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Volume: {Math.round(volume * 100)}%</label>
                        <Slider value={[volume]} onValueChange={([v]) => setVolume(v)} min={0} max={1} step={0.1} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      ref={textDisplayRef}
                      className={`text-lg leading-relaxed ${useDyslexicFont ? 'font-dyslexic' : ''}`}
                      style={{ lineHeight: '2.2' }}
                    />
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="audio" className="space-y-6">
            <AudioRecorder 
              onAudioRecorded={handleAudioRecorded}
              disabled={!currentMaterialId}
            />
            
            {audioBlob && (
              <WhisperTranscription 
                audioBlob={audioBlob}
                onTranscriptionComplete={(text) => {
                  console.log('Transcription:', text);
                }}
              />
            )}
          </TabsContent>
          
          <TabsContent value="math">
            <MathGames />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default LearningMaterials;
