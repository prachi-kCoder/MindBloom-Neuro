
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Brain } from 'lucide-react';

interface CognitiveQuestionsProps {
  childAge: number;
  initialResponses: Record<string, any>;
  onComplete: (responses: Record<string, any>) => void;
}

const CognitiveQuestions: React.FC<CognitiveQuestionsProps> = ({ childAge, initialResponses, onComplete }) => {
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
    'reading_ability', 
    'instructions_follow',
    'memory_sequence',
  ];
  
  const allQuestionsAnswered = requiredQuestions.every(q => 
    responses[q] !== undefined && responses[q] !== ''
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="text-primary h-6 w-6" />
        <h2 className="text-2xl font-bold">Learning & Cognitive Processing</h2>
      </div>
      
      <p className="text-muted-foreground mb-6">
        These questions help us understand how your child processes information, learns new concepts,
        and applies cognitive skills.
      </p>
      
      {/* Reading ability question */}
      <div className="border rounded-lg p-4 bg-card/50">
        <fieldset>
          <legend className="text-lg font-medium mb-3">
            How would you describe your child's reading ability compared to peers?
          </legend>
          <RadioGroup 
            value={responses.reading_ability || ''} 
            onValueChange={(value) => handleResponseChange('reading_ability', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="advanced" id="reading-advanced" />
              <Label htmlFor="reading-advanced">Advanced - reads above grade level</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="on_track" id="reading-on-track" />
              <Label htmlFor="reading-on-track">On track - reads at grade level</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="some_difficulty" id="reading-some-difficulty" />
              <Label htmlFor="reading-some-difficulty">Some difficulty - slightly behind grade level</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="significant_difficulty" id="reading-significant-difficulty" />
              <Label htmlFor="reading-significant-difficulty">Significant difficulty - well behind grade level</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="not_yet_reading" id="not-yet-reading" />
              <Label htmlFor="not-yet-reading">Not yet reading (appropriate for younger children)</Label>
            </div>
          </RadioGroup>
        </fieldset>
      </div>
      
      {/* Instructions following question */}
      <div className="border rounded-lg p-4 bg-card/50">
        <fieldset>
          <legend className="text-lg font-medium mb-3">
            How many steps of instructions can your child reliably follow?
          </legend>
          <RadioGroup 
            value={responses.instructions_follow || ''} 
            onValueChange={(value) => handleResponseChange('instructions_follow', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1_step" id="instructions-1-step" />
              <Label htmlFor="instructions-1-step">1 step (e.g., "Put your shoes on.")</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2_step" id="instructions-2-step" />
              <Label htmlFor="instructions-2-step">2 steps (e.g., "Put your shoes on and get your backpack.")</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3_step" id="instructions-3-step" />
              <Label htmlFor="instructions-3-step">3 steps (e.g., "Put your shoes on, get your backpack, and wait by the door.")</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="multi_step" id="instructions-multi-step" />
              <Label htmlFor="instructions-multi-step">Multiple steps (can follow complex, multi-part instructions)</Label>
            </div>
          </RadioGroup>
        </fieldset>
      </div>
      
      {/* Memory sequence question */}
      <div className="border rounded-lg p-4 bg-card/50">
        <fieldset>
          <legend className="text-lg font-medium mb-3">
            How well can your child remember and repeat back a sequence of numbers?
          </legend>
          <RadioGroup 
            value={responses.memory_sequence || ''} 
            onValueChange={(value) => handleResponseChange('memory_sequence', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2_3_digits" id="memory-2-3-digits" />
              <Label htmlFor="memory-2-3-digits">Can repeat 2-3 digits (e.g., "5, 8")</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4_5_digits" id="memory-4-5-digits" />
              <Label htmlFor="memory-4-5-digits">Can repeat 4-5 digits (e.g., "3, 7, 2, 9")</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="6_plus_digits" id="memory-6-plus-digits" />
              <Label htmlFor="memory-6-plus-digits">Can repeat 6+ digits (e.g., "5, 8, 3, 1, 9, 4")</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="struggles" id="memory-struggles" />
              <Label htmlFor="memory-struggles">Struggles with remembering sequences</Label>
            </div>
          </RadioGroup>
        </fieldset>
      </div>
      
      {/* Learning preferences */}
      <div className="border rounded-lg p-4 bg-card/50">
        <Label className="text-lg font-medium mb-3 block">
          How does your child learn best? (Select all that apply)
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="learning-visual" 
              checked={responses.learning_preferences?.includes('visual')}
              onCheckedChange={(checked) => handleCheckboxChange('learning_preferences', 'visual', !!checked)}
            />
            <Label htmlFor="learning-visual">Visual (pictures, videos)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="learning-auditory" 
              checked={responses.learning_preferences?.includes('auditory')}
              onCheckedChange={(checked) => handleCheckboxChange('learning_preferences', 'auditory', !!checked)}
            />
            <Label htmlFor="learning-auditory">Auditory (listening, music)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="learning-kinesthetic" 
              checked={responses.learning_preferences?.includes('kinesthetic')}
              onCheckedChange={(checked) => handleCheckboxChange('learning_preferences', 'kinesthetic', !!checked)}
            />
            <Label htmlFor="learning-kinesthetic">Kinesthetic (hands-on, movement)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="learning-reading" 
              checked={responses.learning_preferences?.includes('reading')}
              onCheckedChange={(checked) => handleCheckboxChange('learning_preferences', 'reading', !!checked)}
            />
            <Label htmlFor="learning-reading">Reading/writing</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="learning-social" 
              checked={responses.learning_preferences?.includes('social')}
              onCheckedChange={(checked) => handleCheckboxChange('learning_preferences', 'social', !!checked)}
            />
            <Label htmlFor="learning-social">Social (learning with others)</Label>
          </div>
        </div>
      </div>
      
      {childAge >= 7 && (
        <div className="border rounded-lg p-4 bg-card/50">
          <fieldset>
            <legend className="text-lg font-medium mb-3">
              Does your child have difficulty with any of these specific academic areas? (Select all that apply)
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="difficulty-reading" 
                  checked={responses.academic_difficulties?.includes('reading')}
                  onCheckedChange={(checked) => handleCheckboxChange('academic_difficulties', 'reading', !!checked)}
                />
                <Label htmlFor="difficulty-reading">Reading fluency</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="difficulty-spelling" 
                  checked={responses.academic_difficulties?.includes('spelling')}
                  onCheckedChange={(checked) => handleCheckboxChange('academic_difficulties', 'spelling', !!checked)}
                />
                <Label htmlFor="difficulty-spelling">Spelling</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="difficulty-writing" 
                  checked={responses.academic_difficulties?.includes('writing')}
                  onCheckedChange={(checked) => handleCheckboxChange('academic_difficulties', 'writing', !!checked)}
                />
                <Label htmlFor="difficulty-writing">Writing (composition)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="difficulty-handwriting" 
                  checked={responses.academic_difficulties?.includes('handwriting')}
                  onCheckedChange={(checked) => handleCheckboxChange('academic_difficulties', 'handwriting', !!checked)}
                />
                <Label htmlFor="difficulty-handwriting">Handwriting (fine motor)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="difficulty-math" 
                  checked={responses.academic_difficulties?.includes('math')}
                  onCheckedChange={(checked) => handleCheckboxChange('academic_difficulties', 'math', !!checked)}
                />
                <Label htmlFor="difficulty-math">Math concepts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="difficulty-attention" 
                  checked={responses.academic_difficulties?.includes('attention')}
                  onCheckedChange={(checked) => handleCheckboxChange('academic_difficulties', 'attention', !!checked)}
                />
                <Label htmlFor="difficulty-attention">Sustaining attention</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="difficulty-organization" 
                  checked={responses.academic_difficulties?.includes('organization')}
                  onCheckedChange={(checked) => handleCheckboxChange('academic_difficulties', 'organization', !!checked)}
                />
                <Label htmlFor="difficulty-organization">Organization</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="difficulty-none" 
                  checked={responses.academic_difficulties?.includes('none')}
                  onCheckedChange={(checked) => handleCheckboxChange('academic_difficulties', 'none', !!checked)}
                />
                <Label htmlFor="difficulty-none">No significant difficulties</Label>
              </div>
            </div>
          </fieldset>
        </div>
      )}
      
      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSubmit} 
          disabled={!allQuestionsAnswered}
        >
          Next: Adaptive Functioning
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

export default CognitiveQuestions;
