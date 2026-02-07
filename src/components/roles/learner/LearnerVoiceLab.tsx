import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, Headphones, Play, Pause, SkipBack, SkipForward, Save, Loader2, Eye } from 'lucide-react';
import useDyslexiaFont from '@/hooks/useDyslexiaFont';
import { speak, stopSpeaking } from '@/utils/textToSpeech';
import { AudioRecorder } from '@/components/learning/AudioRecorder';
import { WhisperTranscription } from '@/components/learning/WhisperTranscription';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const LANGUAGE_OPTIONS = [
  { value: 'en-US', label: '🇺🇸 English (US)' },
  { value: 'en-GB', label: '🇬🇧 English (UK)' },
  { value: 'es-ES', label: '🇪🇸 Spanish' },
  { value: 'fr-FR', label: '🇫🇷 French' },
  { value: 'de-DE', label: '🇩🇪 German' },
  { value: 'hi-IN', label: '🇮🇳 Hindi' },
  { value: 'zh-CN', label: '🇨🇳 Chinese' },
  { value: 'ja-JP', label: '🇯🇵 Japanese' },
  { value: 'ar-SA', label: '🇸🇦 Arabic' },
];

export function LearnerVoiceLab() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textDisplayRef = useRef<HTMLDivElement>(null);
  const { useDyslexicFont } = useDyslexiaFont(false);

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processedText, setProcessedText] = useState('');
  const [materialTitle, setMaterialTitle] = useState('');
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [savedMaterials, setSavedMaterials] = useState<any[]>([]);
  const [currentMaterialId, setCurrentMaterialId] = useState<string | null>(null);

  const [rate, setRate] = useState(0.9);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [language, setLanguage] = useState('en-US');
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [activeTab, setActiveTab] = useState('upload');

  useEffect(() => {
    if (user?.id) loadSavedMaterials();
  }, [user?.id]);

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
      const s = processedText.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0).map(s => s.trim());
      setSentences(s);
      setCurrentSentence(0);
    }
  }, [processedText]);

  useEffect(() => () => stopSpeaking(), []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      setFile(f);
      setFileName(f.name);
      setFileType(f.type);
      setMaterialTitle(f.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const processFile = async () => {
    if (!file) return;
    setIsLoading(true);
    try {
      let extractedText = '';
      if (fileType.includes('text') || fileType.includes('txt')) {
        const reader = new FileReader();
        extractedText = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsText(file);
        });
      } else {
        toast.info('PDF/DOCX parsing coming soon! Showing sample content.');
        extractedText = `📚 ${materialTitle || fileName}\n\nThis is a preview of your uploaded ${fileName}. Use the text-to-speech features below to listen to the content.\n\n💡 Try out the audio controls to customize your learning experience!`;
      }
      setProcessedText(extractedText);
      setActiveTab('learn');
      toast.success('Material processed successfully!');
    } catch (error) {
      toast.error('Failed to process file');
    } finally {
      setIsLoading(false);
    }
  };

  const saveMaterial = async () => {
    if (!user) { toast.error('Please log in to save materials'); return; }
    if (!materialTitle || !processedText) { toast.error('Please provide a title and content'); return; }
    try {
      const { data, error } = await supabase
        .from('learning_materials')
        .insert({ user_id: user.id, title: materialTitle, content: processedText, file_type: fileType })
        .select().single();
      if (error) throw error;
      setCurrentMaterialId(data.id);
      loadSavedMaterials();
      toast.success('Material saved!');
    } catch (error) {
      toast.error('Failed to save material');
    }
  };

  const loadMaterial = (material: any) => {
    setProcessedText(material.content);
    setMaterialTitle(material.title);
    setCurrentMaterialId(material.id);
    setActiveTab('learn');
  };

  const highlightCurrentSentence = () => {
    if (!textDisplayRef.current || sentences.length === 0) return;
    textDisplayRef.current.innerHTML = sentences.map((s, i) => {
      const cls = i === currentSentence ? 'bg-yellow-200 dark:bg-yellow-900/50 px-1 rounded transition-colors duration-300' : 'px-1';
      return `<span class="${cls}">${s}</span>`;
    }).join(' ');
  };

  const speakCurrentSentence = () => {
    if (sentences.length === 0) return;
    speak(sentences[currentSentence], {
      rate, pitch, volume, lang: language,
      onStart: () => { setIsPlaying(true); highlightCurrentSentence(); },
      onEnd: () => {
        if (isAutoPlay && currentSentence < sentences.length - 1) {
          setTimeout(() => setCurrentSentence(prev => prev + 1), 500);
        } else {
          setIsPlaying(false);
        }
      }
    });
  };

  const handlePlayPause = () => {
    if (isPlaying) { stopSpeaking(); setIsPlaying(false); } else { speakCurrentSentence(); }
  };

  useEffect(() => {
    highlightCurrentSentence();
    if (isPlaying && isAutoPlay) speakCurrentSentence();
  }, [currentSentence, sentences]);

  const handleAudioRecorded = async (blob: Blob, duration: number) => {
    if (!user) { toast.error('Please log in'); return; }
    if (!currentMaterialId) { toast.error('Please save the material first'); return; }
    try {
      const fn = `${user.id}/${Date.now()}.webm`;
      const { error: uploadError } = await supabase.storage.from('audio-assessments').upload(fn, blob);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('audio-assessments').getPublicUrl(fn);
      const { error: insertError } = await supabase.from('audio_assessments').insert({
        user_id: user.id, material_id: currentMaterialId, audio_url: publicUrl, duration_seconds: duration
      });
      if (insertError) throw insertError;
      toast.success('Audio assessment submitted!');
    } catch (error) {
      toast.error('Failed to submit audio assessment');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold mb-1 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>Voice-to-Text Lab</h2>
        <p className="text-muted-foreground">Upload materials, listen with TTS, and record audio assessments</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="learn">Read & Listen</TabsTrigger>
          <TabsTrigger value="audio">Audio Lab</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle>Upload Material</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Material Title" value={materialTitle} onChange={e => setMaterialTitle(e.target.value)} />
              <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors" onClick={() => fileInputRef.current?.click()}>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt,.text" />
                <Upload className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">Drop your file here or click to browse</h3>
                <p className="text-sm text-muted-foreground">Supports PDF, Word, and text files</p>
              </div>
              {file && (
                <div className="bg-muted/20 p-4 rounded-lg flex items-center gap-4">
                  <FileText className="h-10 w-10 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{fileName}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <Button onClick={processFile} disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : 'Process & Learn'}
                  </Button>
                </div>
              )}
              {savedMaterials.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Saved Materials</h3>
                  <div className="space-y-2">
                    {savedMaterials.map(m => (
                      <Card key={m.id} className="cursor-pointer hover:bg-muted/50" onClick={() => loadMaterial(m)}>
                        <CardContent className="p-3">
                          <h4 className="font-medium">{m.title}</h4>
                          <p className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learn" className="space-y-4 mt-4">
          {!processedText ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Eye className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-3">Ready to Learn?</h3>
                <Button onClick={() => setActiveTab('upload')}>Upload Your First Document</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Headphones className="h-5 w-5 text-primary" />Audio Controls
                    </CardTitle>
                    <Button onClick={saveMaterial} variant="outline" size="sm"><Save className="h-4 w-4 mr-2" />Save</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => { stopSpeaking(); setIsPlaying(false); setCurrentSentence(Math.max(0, currentSentence - 1)); }} disabled={currentSentence === 0}>
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button size="lg" className="rounded-full h-12 w-12" onClick={handlePlayPause}>
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => { stopSpeaking(); setIsPlaying(false); setCurrentSentence(Math.min(sentences.length - 1, currentSentence + 1)); }} disabled={currentSentence >= sentences.length - 1}>
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                  {sentences.length > 0 && (
                    <Progress value={((currentSentence + 1) / sentences.length) * 100} className="h-2" />
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Speed: {rate}x</label>
                      <Slider value={[rate]} onValueChange={v => setRate(v[0])} min={0.5} max={2} step={0.1} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Pitch: {pitch}</label>
                      <Slider value={[pitch]} onValueChange={v => setPitch(v[0])} min={0.5} max={2} step={0.1} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Language</label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {LANGUAGE_OPTIONS.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div ref={textDisplayRef} className={`prose prose-sm max-w-none leading-relaxed ${useDyslexicFont ? 'font-dyslexic' : ''}`} />
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="audio" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle>Record & Transcribe</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <AudioRecorder onAudioRecorded={handleAudioRecorded} />
              <WhisperTranscription audioBlob={null} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
