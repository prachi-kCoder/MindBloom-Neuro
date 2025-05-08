
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Video, Eye, Users, Brain, Check } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

interface VideoAnalysisProps {
  childAge: number;
  onComplete: (responses: Record<string, any>) => void;
  onSkip: () => void;
}

const VideoAnalysis: React.FC<VideoAnalysisProps> = ({ childAge, onComplete, onSkip }) => {
  const [currentTest, setCurrentTest] = useState<'social' | 'attention' | 'perception'>('social');
  const [videoCompleted, setVideoCompleted] = useState<Record<string, boolean>>({
    social: false,
    attention: false,
    perception: false
  });
  const [responses, setResponses] = useState<Record<string, any>>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Simulate interaction data collection
  const handleInteraction = (testType: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [`${testType}_interaction`]: value,
      [`${testType}_timestamp`]: new Date().toISOString()
    }));
  };
  
  const handleVideoEnd = (testType: 'social' | 'attention' | 'perception') => {
    setVideoCompleted(prev => ({
      ...prev,
      [testType]: true
    }));
    
    // Simulate analysis results
    let analysisScore = Math.floor(Math.random() * 5) + 1;
    
    setResponses(prev => ({
      ...prev,
      [`${testType}_completed`]: true,
      [`${testType}_score`]: analysisScore
    }));
    
    toast({
      title: "Analysis Complete",
      description: `${testType.charAt(0).toUpperCase() + testType.slice(1)} video analysis processed successfully.`
    });
  };
  
  const handleComplete = () => {
    // Check if at least one test was completed
    if (Object.values(videoCompleted).some(Boolean)) {
      onComplete(responses);
    } else {
      toast({
        title: "Incomplete Analysis",
        description: "Please complete at least one video analysis test before proceeding.",
        variant: "destructive"
      });
    }
  };
  
  // Calculate overall progress
  const completedCount = Object.values(videoCompleted).filter(Boolean).length;
  const progress = (completedCount / 3) * 100;
  
  // Social stimulus content
  const renderSocialTest = () => (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        This assessment measures how your child responds to social stimuli like faces, 
        emotions, and social interactions.
      </p>
      
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <video 
          ref={videoRef}
          className="w-full h-full object-contain" 
          controls
          poster="/placeholder.svg"
          onEnded={() => handleVideoEnd('social')}
        >
          <source src="#" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {!videoCompleted.social && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button 
              size="lg"
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.play();
                }
              }}
            >
              Start Social Stimulus Video
            </Button>
          </div>
        )}
      </div>
      
      {videoCompleted.social && (
        <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
          <div className="mb-4 flex items-center gap-2 text-primary">
            <Check className="h-5 w-5" />
            <span className="font-medium">Video Analysis Complete</span>
          </div>
          
          <div>
            <Label className="mb-2 block">
              How interested was your child in the faces shown in the video?
            </Label>
            <div className="pt-4 pb-2">
              <Slider
                defaultValue={[3]}
                max={5}
                min={1}
                step={1}
                onValueChange={(value) => handleInteraction('social_interest', value[0])}
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Not interested</span>
              <span>Very engaged</span>
            </div>
          </div>
          
          <div className="pt-2">
            <Label className="mb-2 block">
              Did your child point at or touch the screen during social scenes?
            </Label>
            <div className="flex gap-4 mt-2">
              <Button 
                variant={responses.social_pointing === 'yes' ? "default" : "outline"}
                onClick={() => handleInteraction('social_pointing', 'yes')}
              >
                Yes
              </Button>
              <Button 
                variant={responses.social_pointing === 'no' ? "default" : "outline"}
                onClick={() => handleInteraction('social_pointing', 'no')}
              >
                No
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  // Attention stimulus content
  const renderAttentionTest = () => (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        This test measures your child's ability to maintain attention and respond 
        to specific visual cues.
      </p>
      
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <video 
          ref={videoRef}
          className="w-full h-full object-contain" 
          controls
          poster="/placeholder.svg"
          onEnded={() => handleVideoEnd('attention')}
        >
          <source src="#" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {!videoCompleted.attention && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button 
              size="lg"
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.play();
                }
              }}
            >
              Start Attention Assessment Video
            </Button>
          </div>
        )}
      </div>
      
      {videoCompleted.attention && (
        <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
          <div className="mb-4 flex items-center gap-2 text-primary">
            <Check className="h-5 w-5" />
            <span className="font-medium">Video Analysis Complete</span>
          </div>
          
          <div>
            <Label className="mb-2 block">
              How many times did your child get distracted during the video?
            </Label>
            <div className="flex gap-4 mt-2">
              {[0, 1, 2, 3, '4+'].map((num) => (
                <Button 
                  key={num}
                  variant={responses.attention_distractions === num ? "default" : "outline"}
                  onClick={() => handleInteraction('attention_distractions', num)}
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="pt-2">
            <Label className="mb-2 block">
              Did your child complete the task shown in the video?
            </Label>
            <div className="flex gap-4 mt-2">
              <Button 
                variant={responses.attention_task_completed === 'yes' ? "default" : "outline"}
                onClick={() => handleInteraction('attention_task_completed', 'yes')}
              >
                Yes, completely
              </Button>
              <Button 
                variant={responses.attention_task_completed === 'partially' ? "default" : "outline"}
                onClick={() => handleInteraction('attention_task_completed', 'partially')}
              >
                Partially
              </Button>
              <Button 
                variant={responses.attention_task_completed === 'no' ? "default" : "outline"}
                onClick={() => handleInteraction('attention_task_completed', 'no')}
              >
                No
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  // Sensory perception test
  const renderPerceptionTest = () => (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        This test evaluates how your child processes sensory information and responds
        to different visual and auditory stimuli.
      </p>
      
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <video 
          ref={videoRef}
          className="w-full h-full object-contain" 
          controls
          poster="/placeholder.svg"
          onEnded={() => handleVideoEnd('perception')}
        >
          <source src="#" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {!videoCompleted.perception && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button 
              size="lg"
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.play();
                }
              }}
            >
              Start Sensory Assessment Video
            </Button>
          </div>
        )}
      </div>
      
      {videoCompleted.perception && (
        <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
          <div className="mb-4 flex items-center gap-2 text-primary">
            <Check className="h-5 w-5" />
            <span className="font-medium">Video Analysis Complete</span>
          </div>
          
          <div>
            <Label className="mb-2 block">
              How did your child react to the changing sounds in the video?
            </Label>
            <div className="flex gap-4 mt-2 flex-wrap">
              <Button 
                variant={responses.sound_reaction === 'calm' ? "default" : "outline"}
                onClick={() => handleInteraction('sound_reaction', 'calm')}
              >
                Remained calm
              </Button>
              <Button 
                variant={responses.sound_reaction === 'interested' ? "default" : "outline"}
                onClick={() => handleInteraction('sound_reaction', 'interested')}
              >
                Showed interest
              </Button>
              <Button 
                variant={responses.sound_reaction === 'distracted' ? "default" : "outline"}
                onClick={() => handleInteraction('sound_reaction', 'distracted')}
              >
                Was distracted
              </Button>
              <Button 
                variant={responses.sound_reaction === 'upset' ? "default" : "outline"}
                onClick={() => handleInteraction('sound_reaction', 'upset')}
              >
                Became upset
              </Button>
            </div>
          </div>
          
          <div className="pt-2">
            <Label className="mb-2 block">
              Did your child cover their ears or eyes at any point?
            </Label>
            <div className="flex gap-4 mt-2">
              <Button 
                variant={responses.sensory_covering === 'yes' ? "default" : "outline"}
                onClick={() => handleInteraction('sensory_covering', 'yes')}
              >
                Yes
              </Button>
              <Button 
                variant={responses.sensory_covering === 'no' ? "default" : "outline"}
                onClick={() => handleInteraction('sensory_covering', 'no')}
              >
                No
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Video className="text-primary h-6 w-6" />
        <h2 className="text-2xl font-bold">Interactive Video Analysis</h2>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Assessment Progress</span>
          <span>{completedCount} of 3 tests completed</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Child Video Assessment</CardTitle>
          <p className="text-sm text-muted-foreground">
            These short interactive videos help us assess your child's social, attention, and sensory processing patterns.
            You'll need to sit with your child during these activities.
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-6 bg-primary/5 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-primary" />
              <p className="font-medium">Instructions</p>
            </div>
            <ol className="list-decimal ml-5 space-y-1 text-sm">
              <li>Have your child sit in front of the screen in a quiet environment</li>
              <li>Select the assessment you want to complete</li>
              <li>Play the video and observe your child's reactions</li>
              <li>Answer the follow-up questions based on your observations</li>
            </ol>
          </div>
          
          <Tabs value={currentTest} onValueChange={(value) => setCurrentTest(value as any)} className="mt-6">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="social" className="flex gap-2 items-center">
                <Eye className="h-4 w-4" />
                <span>Social</span>
                {videoCompleted.social && <span className="ml-1 text-green-500">✓</span>}
              </TabsTrigger>
              <TabsTrigger value="attention" className="flex gap-2 items-center">
                <Brain className="h-4 w-4" />
                <span>Attention</span>
                {videoCompleted.attention && <span className="ml-1 text-green-500">✓</span>}
              </TabsTrigger>
              <TabsTrigger value="perception" className="flex gap-2 items-center">
                <Video className="h-4 w-4" />
                <span>Sensory</span>
                {videoCompleted.perception && <span className="ml-1 text-green-500">✓</span>}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="social">
              {renderSocialTest()}
            </TabsContent>
            
            <TabsContent value="attention">
              {renderAttentionTest()}
            </TabsContent>
            
            <TabsContent value="perception">
              {renderPerceptionTest()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onSkip}>
          Skip Video Assessment
        </Button>
        <Button 
          onClick={handleComplete}
          disabled={completedCount === 0}
          className="gap-2"
        >
          {completedCount > 0 ? (
            <>
              Continue with {completedCount} Completed Test{completedCount > 1 ? 's' : ''}
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            'Complete at least one test'
          )}
        </Button>
      </div>
    </div>
  );
};

export default VideoAnalysis;

// Missing component import
import { ArrowRight } from 'lucide-react';
