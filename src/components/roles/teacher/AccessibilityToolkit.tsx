import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX, Type, Eye, Mic, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import { speak, stopSpeaking } from '@/utils/textToSpeech';

export function AccessibilityToolkit() {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog. This is a sample text to test accessibility features.');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState([1]);
  const [speechPitch, setSpeechPitch] = useState([1]);
  const [useDyslexiaFont, setUseDyslexiaFont] = useState(false);
  const [fontSize, setFontSize] = useState([16]);
  const [lineSpacing, setLineSpacing] = useState([1.5]);
  const [readingLevel, setReadingLevel] = useState('standard');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleSpeak = () => {
    if (isSpeaking) { stopSpeaking(); setIsSpeaking(false); return; }
    setIsSpeaking(true);
    speak(text, { rate: speechRate[0], pitch: speechPitch[0], onEnd: () => setIsSpeaking(false) });
  };

  const handleSpeechToText = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    if (isListening) { recognition.stop(); setIsListening(false); return; }
    
    recognition.onresult = (event: any) => {
      let t = '';
      for (let i = 0; i < event.results.length; i++) t += event.results[i][0].transcript;
      setTranscript(t);
    };
    recognition.onerror = () => { setIsListening(false); toast.error('Speech recognition error'); };
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  };

  const previewStyle: React.CSSProperties = {
    fontFamily: useDyslexiaFont ? 'OpenDyslexic, Comic Sans MS, sans-serif' : 'inherit',
    fontSize: `${fontSize[0]}px`,
    lineHeight: lineSpacing[0],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Accessibility Toolkit</h1>
        <p className="text-muted-foreground">Built-in tools for making content accessible to all learners</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Text-to-Speech */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" /> Text-to-Speech
            </CardTitle>
            <CardDescription>Read content aloud with adjustable speed and pitch</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={text} onChange={e => setText(e.target.value)} rows={4} placeholder="Enter text to read aloud..." />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Speed: {speechRate[0]}x</Label>
                <Slider value={speechRate} onValueChange={setSpeechRate} min={0.5} max={2} step={0.1} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Pitch: {speechPitch[0]}</Label>
                <Slider value={speechPitch} onValueChange={setSpeechPitch} min={0.5} max={2} step={0.1} />
              </div>
            </div>
            <Button onClick={handleSpeak} className="w-full">
              {isSpeaking ? <><VolumeX className="h-4 w-4 mr-2" /> Stop</> : <><Volume2 className="h-4 w-4 mr-2" /> Read Aloud</>}
            </Button>
          </CardContent>
        </Card>

        {/* Speech-to-Text */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" /> Speech-to-Text
            </CardTitle>
            <CardDescription>Convert spoken words to text for dictation and notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleSpeechToText} variant={isListening ? 'destructive' : 'default'} className="w-full">
              {isListening ? <><StopCircle className="h-4 w-4 mr-2" /> Stop Listening</> : <><Mic className="h-4 w-4 mr-2" /> Start Dictation</>}
            </Button>
            {isListening && <p className="text-xs text-center text-primary animate-pulse">Listening...</p>}
            {transcript && (
              <div className="p-3 border rounded-lg bg-muted/50 text-sm">{transcript}</div>
            )}
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" /> Display & Reading Settings
            </CardTitle>
            <CardDescription>Customize how content appears for learners</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-xs">Font Size: {fontSize[0]}px</Label>
                <Slider value={fontSize} onValueChange={setFontSize} min={12} max={32} step={1} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Line Spacing: {lineSpacing[0]}</Label>
                <Slider value={lineSpacing} onValueChange={setLineSpacing} min={1} max={3} step={0.1} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Reading Level</Label>
                <Select value={readingLevel} onValueChange={setReadingLevel}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simplified</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={useDyslexiaFont} onCheckedChange={setUseDyslexiaFont} />
              <Label>Use Dyslexia-Friendly Font (OpenDyslexic)</Label>
            </div>

            <div className="p-4 border rounded-lg" style={previewStyle}>
              <p className="font-medium mb-2">Preview:</p>
              <p>{text}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
