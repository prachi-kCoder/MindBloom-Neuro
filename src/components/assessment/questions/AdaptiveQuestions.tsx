
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText } from 'lucide-react';

interface AdaptiveQuestionsProps {
  childAge: number;
  initialResponses: Record<string, any>;
  onComplete: (responses: Record<string, any>) => void;
}

const AdaptiveQuestions: React.FC<AdaptiveQuestionsProps> = ({ childAge, initialResponses, onComplete }) => {
  const [responses, setResponses] = useState<Record<string, any>>(initialResponses || {});

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const handleCheckboxChange = (questionId: string, checkboxId: string, checked: boolean) => {
    setResponses(prev => {
      const currentChecked = prev[questionId] || [];
      
      if (checked) {
        return {
          ...prev,
          [questionId]: [...currentChecked, checkboxId]
        };
      } else {
        return {
          ...prev,
          [questionId]: currentChecked.filter((id: string) => id !== checkboxId)
        };
      }
    });
  };

  const handleSubmit = () => {
    onComplete(responses);
  };

  // Check if required questions are answered
  const requiredQuestions = [
    'dressing_independence',
    'sensory_sensitivity',
  ];
  
  const allQuestionsAnswered = requiredQuestions.every(q => 
    responses[q] !== undefined && responses[q] !== ''
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="text-primary h-6 w-6" />
        <h2 className="text-2xl font-bold">Adaptive Functioning</h2>
      </div>
      
      <p className="text-muted-foreground mb-6">
        These questions help us understand your child's ability to perform everyday tasks and
        adapt to different environments.
      </p>
      
      {/* Daily living skills checklist */}
      <div className="border rounded-lg p-4 bg-card/50">
        <Label className="text-lg font-medium mb-3 block">
          Which of these daily living skills can your child perform independently? (Select all that apply)
        </Label>
        <div className="space-y-2 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="skill-dressing" 
              checked={responses.daily_skills?.includes('dressing')}
              onCheckedChange={(checked) => handleCheckboxChange('daily_skills', 'dressing', !!checked)}
            />
            <Label htmlFor="skill-dressing">Gets dressed without assistance</Label>
          </div>
          
          {childAge >= 8 && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="skill-shoes" 
                checked={responses.daily_skills?.includes('tie_shoes')}
                onCheckedChange={(checked) => handleCheckboxChange('daily_skills', 'tie_shoes', !!checked)}
              />
              <Label htmlFor="skill-shoes">Ties shoes independently</Label>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="skill-utensils" 
              checked={responses.daily_skills?.includes('utensils')}
              onCheckedChange={(checked) => handleCheckboxChange('daily_skills', 'utensils', !!checked)}
            />
            <Label htmlFor="skill-utensils">Uses utensils appropriately</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="skill-hygiene" 
              checked={responses.daily_skills?.includes('hygiene')}
              onCheckedChange={(checked) => handleCheckboxChange('daily_skills', 'hygiene', !!checked)}
            />
            <Label htmlFor="skill-hygiene">Manages basic hygiene (handwashing, teeth brushing)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="skill-instructions" 
              checked={responses.daily_skills?.includes('instructions')}
              onCheckedChange={(checked) => handleCheckboxChange('daily_skills', 'instructions', !!checked)}
            />
            <Label htmlFor="skill-instructions">Follows 3-step instructions</Label>
          </div>
          
          {childAge >= 6 && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="skill-time" 
                checked={responses.daily_skills?.includes('time')}
                onCheckedChange={(checked) => handleCheckboxChange('daily_skills', 'time', !!checked)}
              />
              <Label htmlFor="skill-time">Understands concept of time (clock reading)</Label>
            </div>
          )}
          
          {childAge >= 7 && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="skill-money" 
                checked={responses.daily_skills?.includes('money')}
                onCheckedChange={(checked) => handleCheckboxChange('daily_skills', 'money', !!checked)}
              />
              <Label htmlFor="skill-money">Understands basic money concepts</Label>
            </div>
          )}
          
          {childAge >= 10 && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="skill-chores" 
                checked={responses.daily_skills?.includes('chores')}
                onCheckedChange={(checked) => handleCheckboxChange('daily_skills', 'chores', !!checked)}
              />
              <Label htmlFor="skill-chores">Completes simple chores independently</Label>
            </div>
          )}
        </div>
      </div>
      
      {/* Dressing independence */}
      <div className="border rounded-lg p-4 bg-card/50">
        <fieldset>
          <legend className="text-lg font-medium mb-3">
            How much assistance does your child need with dressing?
          </legend>
          <RadioGroup 
            value={responses.dressing_independence || ''} 
            onValueChange={(value) => handleResponseChange('dressing_independence', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="independent" id="dress-independent" />
              <Label htmlFor="dress-independent">Completely independent</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="minimal" id="dress-minimal" />
              <Label htmlFor="dress-minimal">Minimal help (e.g., with buttons or zippers only)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="dress-moderate" />
              <Label htmlFor="dress-moderate">Moderate help (can put on some clothes independently)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="substantial" id="dress-substantial" />
              <Label htmlFor="dress-substantial">Substantial help (needs assistance with most clothing)</Label>
            </div>
          </RadioGroup>
        </fieldset>
      </div>
      
      {/* Sensory sensitivities */}
      <div className="border rounded-lg p-4 bg-card/50">
        <fieldset>
          <legend className="text-lg font-medium mb-3">
            Does your child show sensory sensitivities to any of the following? (Select all that apply)
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sensory-clothing" 
                checked={responses.sensory_sensitivity?.includes('clothing')}
                onCheckedChange={(checked) => handleCheckboxChange('sensory_sensitivity', 'clothing', !!checked)}
              />
              <Label htmlFor="sensory-clothing">Clothing textures or tags</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sensory-sound" 
                checked={responses.sensory_sensitivity?.includes('sound')}
                onCheckedChange={(checked) => handleCheckboxChange('sensory_sensitivity', 'sound', !!checked)}
              />
              <Label htmlFor="sensory-sound">Loud sounds</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sensory-light" 
                checked={responses.sensory_sensitivity?.includes('light')}
                onCheckedChange={(checked) => handleCheckboxChange('sensory_sensitivity', 'light', !!checked)}
              />
              <Label htmlFor="sensory-light">Bright lights</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sensory-food" 
                checked={responses.sensory_sensitivity?.includes('food')}
                onCheckedChange={(checked) => handleCheckboxChange('sensory_sensitivity', 'food', !!checked)}
              />
              <Label htmlFor="sensory-food">Food textures or flavors</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sensory-touch" 
                checked={responses.sensory_sensitivity?.includes('touch')}
                onCheckedChange={(checked) => handleCheckboxChange('sensory_sensitivity', 'touch', !!checked)}
              />
              <Label htmlFor="sensory-touch">Physical touch</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sensory-none" 
                checked={responses.sensory_sensitivity?.includes('none')}
                onCheckedChange={(checked) => handleCheckboxChange('sensory_sensitivity', 'none', !!checked)}
              />
              <Label htmlFor="sensory-none">No significant sensitivities</Label>
            </div>
          </div>
        </fieldset>
      </div>
      
      {/* Additional concerns */}
      <div className="border rounded-lg p-4 bg-card/50">
        <fieldset>
          <legend className="text-lg font-medium mb-3">
            Are you concerned about your child's ability to adapt to changes in routine?
          </legend>
          <RadioGroup 
            value={responses.routine_changes || ''} 
            onValueChange={(value) => handleResponseChange('routine_changes', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="not_concerned" id="routine-not-concerned" />
              <Label htmlFor="routine-not-concerned">Not concerned - adapts well to changes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="somewhat_concerned" id="routine-somewhat-concerned" />
              <Label htmlFor="routine-somewhat-concerned">Somewhat concerned - mild difficulty with changes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="very_concerned" id="routine-very-concerned" />
              <Label htmlFor="routine-very-concerned">Very concerned - becomes significantly upset with changes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="extremely_concerned" id="routine-extremely-concerned" />
              <Label htmlFor="routine-extremely-concerned">Extremely concerned - major distress with any change</Label>
            </div>
          </RadioGroup>
        </fieldset>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSubmit} 
          disabled={!allQuestionsAnswered}
        >
          Complete Assessment
        </Button>
      </div>
      
      {!allQuestionsAnswered && (
        <p className="text-sm text-amber-500">
          Please answer all required questions before proceeding.
        </p>
      )}
    </div>
  );
};

export default AdaptiveQuestions;
