
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Users, Video, Eye } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface SocialQuestionsProps {
  childAge: number;
  initialResponses: Record<string, any>;
  onComplete: (responses: Record<string, any>) => void;
}

const SocialQuestions: React.FC<SocialQuestionsProps> = ({ childAge, initialResponses, onComplete }) => {
  const [responses, setResponses] = useState<Record<string, any>>(initialResponses || {});
  const [isAllAnswered, setIsAllAnswered] = useState(false);

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    onComplete(responses);
  };

  // Check if required questions are answered
  const requiredQuestions = [
    'eye_contact', 
    'name_response', 
    'peer_interaction', 
    'conversation_turn_taking',
    'social_interest'
  ];
  
  // Add age-specific required questions
  if (childAge >= 6) {
    requiredQuestions.push('social_cues');
  }

  useEffect(() => {
    const allAnswered = requiredQuestions.every(q => 
      responses[q] !== undefined && responses[q] !== ''
    );
    setIsAllAnswered(allAnswered);
  }, [responses]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="text-primary h-6 w-6" />
        <h2 className="text-2xl font-bold">Social Communication Patterns</h2>
      </div>
      
      <p className="text-muted-foreground mb-6">
        These questions help us understand how your child communicates with others and 
        navigates social situations.
      </p>

      {/* Video Analysis Option */}
      <div className="border rounded-lg p-4 bg-primary/5 mb-6">
        <div className="flex items-center gap-2">
          <Video className="text-primary h-5 w-5" />
          <h3 className="text-lg font-medium">Enhanced Video Analysis (Optional)</h3>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Our advanced AI can analyze social communication patterns through short video clips.
          This helps measure gaze patterns, name response, and social engagement more accurately.
        </p>
        <div className="mt-4 flex items-center space-x-2">
          <Checkbox id="enable-video" />
          <Label htmlFor="enable-video">Enable video analysis for more accurate assessment</Label>
        </div>
      </div>
      
      {/* Eye contact question */}
      <div className="border rounded-lg p-4 bg-card/50">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="text-primary h-5 w-5" />
          <Label className="text-lg font-medium">
            How well does your child maintain eye contact during conversations?
          </Label>
        </div>
        <div className="mt-6 mb-2">
          <Slider
            defaultValue={[responses.eye_contact || 3]}
            max={5}
            min={1}
            step={1}
            onValueChange={(value) => handleResponseChange('eye_contact', value[0])}
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Rarely makes eye contact</span>
          <span>Average eye contact</span>
          <span>Strong, consistent eye contact</span>
        </div>
      </div>
      
      {/* Name response question */}
      <div className="border rounded-lg p-4 bg-card/50">
        <fieldset>
          <legend className="text-lg font-medium mb-3">
            How quickly does your child respond when their name is called?
          </legend>
          <RadioGroup 
            value={responses.name_response || ''} 
            onValueChange={(value) => handleResponseChange('name_response', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="immediate" id="name-immediate" />
              <Label htmlFor="name-immediate">Immediate response (first call)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="delayed" id="name-delayed" />
              <Label htmlFor="name-delayed">Delayed response (after 2-3 calls)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inconsistent" id="name-inconsistent" />
              <Label htmlFor="name-inconsistent">Inconsistent (sometimes responds, sometimes doesn't)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rarely" id="name-rarely" />
              <Label htmlFor="name-rarely">Rarely responds to name being called</Label>
            </div>
          </RadioGroup>
        </fieldset>
      </div>
      
      {/* Peer interaction question */}
      <div className="border rounded-lg p-4 bg-card/50">
        <Label className="text-lg font-medium mb-3 block">
          How many peer interactions (playdates, playground interactions, etc.) does your child 
          have in an average week?
        </Label>
        <Input
          type="number"
          min={0}
          max={30}
          value={responses.peer_interaction || ''}
          onChange={(e) => handleResponseChange('peer_interaction', e.target.value)}
          className="w-full max-w-xs"
        />
      </div>
      
      {/* Turn taking question */}
      <div className="border rounded-lg p-4 bg-card/50">
        <fieldset>
          <legend className="text-lg font-medium mb-3">
            How well does your child take turns in conversations?
          </legend>
          <RadioGroup 
            value={responses.conversation_turn_taking || ''} 
            onValueChange={(value) => handleResponseChange('conversation_turn_taking', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="very_well" id="turns-very-well" />
              <Label htmlFor="turns-very-well">Very well - natural back and forth</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="somewhat" id="turns-somewhat" />
              <Label htmlFor="turns-somewhat">Somewhat well - occasional prompting needed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="difficulty" id="turns-difficulty" />
              <Label htmlFor="turns-difficulty">With difficulty - often interrupts or monologues</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="very_difficult" id="turns-very-difficult" />
              <Label htmlFor="turns-very-difficult">Very difficult - rarely engages in back and forth</Label>
            </div>
          </RadioGroup>
        </fieldset>
      </div>
      
      {/* Social interest question */}
      <div className="border rounded-lg p-4 bg-card/50">
        <Label className="text-lg font-medium mb-3 block">
          Rate your child's interest in socializing with peers:
        </Label>
        <div className="mt-6 mb-2">
          <Slider
            defaultValue={[responses.social_interest || 3]}
            max={5}
            min={1}
            step={1}
            onValueChange={(value) => handleResponseChange('social_interest', value[0])}
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Prefers to be alone</span>
          <span>Moderately interested</span>
          <span>Very socially motivated</span>
        </div>
      </div>
      
      {/* Age-specific questions */}
      {childAge >= 6 && (
        <div className="border rounded-lg p-4 bg-card/50">
          <fieldset>
            <legend className="text-lg font-medium mb-3">
              How does your child respond to social cues like facial expressions and tone of voice?
            </legend>
            <RadioGroup 
              value={responses.social_cues || ''} 
              onValueChange={(value) => handleResponseChange('social_cues', value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="accurately" id="cues-accurately" />
                <Label htmlFor="cues-accurately">Accurately interprets most social cues</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sometimes" id="cues-sometimes" />
                <Label htmlFor="cues-sometimes">Sometimes misinterprets subtle cues</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="often_misses" id="cues-often-misses" />
                <Label htmlFor="cues-often-misses">Often misses or misinterprets social cues</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rarely_notices" id="cues-rarely-notices" />
                <Label htmlFor="cues-rarely-notices">Rarely notices social cues</Label>
              </div>
            </RadioGroup>
          </fieldset>
        </div>
      )}
      
      {/* DSM-5 Aligned Question */}
      <div className="border rounded-lg p-4 bg-card/50">
        <fieldset>
          <legend className="text-lg font-medium mb-3">
            How often does your child initiate shared play with others?
          </legend>
          <RadioGroup 
            value={responses.shared_play_initiation || ''} 
            onValueChange={(value) => handleResponseChange('shared_play_initiation', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="frequently" id="play-frequently" />
              <Label htmlFor="play-frequently">Frequently (multiple times a day)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="occasionally" id="play-occasionally" />
              <Label htmlFor="play-occasionally">Occasionally (a few times a week)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rarely" id="play-rarely" />
              <Label htmlFor="play-rarely">Rarely (once a week or less)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="never" id="play-never" />
              <Label htmlFor="play-never">Never initiates shared play</Label>
            </div>
          </RadioGroup>
        </fieldset>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSubmit} 
          disabled={!isAllAnswered}
        >
          Next: Cognitive Processing
        </Button>
      </div>
      
      {!isAllAnswered && (
        <p className="text-sm text-amber-500">
          Please answer all required questions before proceeding.
        </p>
      )}
    </div>
  );
};

export default SocialQuestions;
