import React, { useState, useEffect } from 'react';
import { pipeline } from '@huggingface/transformers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, FileAudio } from 'lucide-react';
import { toast } from 'sonner';

interface WhisperTranscriptionProps {
  audioBlob: Blob | null;
  onTranscriptionComplete?: (text: string) => void;
}

export const WhisperTranscription: React.FC<WhisperTranscriptionProps> = ({ 
  audioBlob, 
  onTranscriptionComplete 
}) => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [progress, setProgress] = useState(0);
  const [model, setModel] = useState<any>(null);

  useEffect(() => {
    // Initialize model on component mount
    const loadModel = async () => {
      try {
        setProgress(10);
        const transcriber = await pipeline(
          'automatic-speech-recognition',
          'onnx-community/whisper-tiny.en',
          { device: 'webgpu' }
        );
        setModel(transcriber);
        setProgress(100);
      } catch (error) {
        console.error('Error loading Whisper model:', error);
        toast.error('Could not load speech recognition model');
      }
    };
    
    loadModel();
  }, []);

  const transcribeAudio = async () => {
    if (!audioBlob || !model) {
      toast.error('No audio or model not loaded');
      return;
    }

    setIsTranscribing(true);
    setProgress(0);

    try {
      // Convert blob to ArrayBuffer
      const arrayBuffer = await audioBlob.arrayBuffer();
      
      setProgress(30);
      
      // Transcribe
      const result = await model(arrayBuffer);
      
      setProgress(90);
      
      const text = result.text || '';
      setTranscription(text);
      
      if (onTranscriptionComplete) {
        onTranscriptionComplete(text);
      }
      
      setProgress(100);
      toast.success('Transcription complete!');
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast.error('Failed to transcribe audio');
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileAudio className="h-5 w-5" />
          Speech-to-Text Transcription
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!model && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Loading speech recognition model...</p>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          {model && audioBlob && !transcription && (
            <Button 
              onClick={transcribeAudio} 
              disabled={isTranscribing}
              className="w-full"
            >
              {isTranscribing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transcribing...
                </>
              ) : (
                'Transcribe Audio'
              )}
            </Button>
          )}
          
          {isTranscribing && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Processing audio...</p>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          {transcription && (
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Transcription:</h4>
              <p className="text-sm leading-relaxed">{transcription}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
