
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Book } from 'lucide-react';

interface BehavioralQuestionsProps {
  childAge: number;
  initialResponses: Record<string, any>;
  onComplete: (responses: Record<string, any>) => void;
}

interface Question {
  id: string;
  text: string;
  options: { value: string; label: string }[];
  ageMin?: number;
  ageMax?: number;
}

const BehavioralQuestions: React.FC<BehavioralQuestionsProps> = ({ childAge, initialResponses, onComplete }) => {
  const questions: Question[] = [
    {
      id: 'interrupts',
      text: 'How often does your child interrupt conversations or activities?',
      options: [
        { value: 'never', label: 'Never' },
        { value: 'rarely', label: 'Rarely (once a week or less)' },
        { value: 'sometimes', label: 'Sometimes (a few times a week)' },
        { value: 'often', label: 'Often (once a day)' },
        { value: 'always', label: 'Very often (multiple times a day)' },
      ],
    },
    {
      id: 'calm_down',
      text: 'How long does it typically take for your child to calm down after becoming upset?',
      options: [
        { value: 'under_5min', label: 'Under 5 minutes' },
        { value: '5_to_15min', label: '5-15 minutes' },
        { value: '15_to_30min', label: '15-30 minutes' },
        { value: 'over_30min', label: 'Over 30 minutes' },
      ],
    },
    {
      id: 'transition',
      text: 'How difficult is it for your child to transition between activities?',
      options: [
        { value: 'not_difficult', label: 'Not difficult' },
        { value: 'slightly_difficult', label: 'Slightly difficult' },
        { value: 'moderately_difficult', label: 'Moderately difficult' },
        { value: 'very_difficult', label: 'Very difficult' },
        { value: 'extremely_difficult', label: 'Extremely difficult' },
      ],
    },
    {
      id: 'frustration',
      text: 'How often does your child show frustration when faced with a challenging task?',
      options: [
        { value: 'never', label: 'Never' },
        { value: 'rarely', label: 'Rarely' },
        { value: 'sometimes', label: 'Sometimes' },
        { value: 'often', label: 'Often' },
        { value: 'always', label: 'Always' },
      ],
    },
    {
      id: 'attention',
      text: 'How long can your child typically maintain focus on a non-preferred activity?',
      options: [
        { value: 'less_than_5min', label: 'Less than 5 minutes' },
        { value: '5_to_10min', label: '5-10 minutes' },
        { value: '10_to_20min', label: '10-20 minutes' },
        { value: '20_to_30min', label: '20-30 minutes' },
        { value: 'over_30min', label: 'Over 30 minutes' },
      ],
    },
    {
      id: 'overstimulation',
      text: 'How often does your child become overstimulated in busy environments?',
      options: [
        { value: 'never', label: 'Never' },
        { value: 'rarely', label: 'Rarely' },
        { value: 'sometimes', label: 'Sometimes' },
        { value: 'often', label: 'Often' },
        { value: 'always', label: 'Always' },
      ],
    },
    {
      id: 'impulsivity',
      text: 'How often does your child act without thinking about consequences?',
      options: [
        { value: 'never', label: 'Never' },
        { value: 'rarely', label: 'Rarely' },
        { value: 'sometimes', label: 'Sometimes' },
        { value: 'often', label: 'Often' },
        { value: 'always', label: 'Always' },
      ],
      ageMin: 4,
    },
    {
      id: 'bedtime',
      text: 'How difficult is it for your child to settle at bedtime?',
      options: [
        { value: 'not_difficult', label: 'Not difficult' },
        { value: 'slightly_difficult', label: 'Slightly difficult' },
        { value: 'moderately_difficult', label: 'Moderately difficult' },
        { value: 'very_difficult', label: 'Very difficult' },
        { value: 'extremely_difficult', label: 'Extremely difficult' },
      ],
    },
  ];

  // Filter questions by age appropriateness
  const filteredQuestions = questions.filter(q => 
    (q.ageMin === undefined || childAge >= q.ageMin) && 
    (q.ageMax === undefined || childAge <= q.ageMax)
  );

  const [responses, setResponses] = useState<Record<string, string>>(initialResponses || {});

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    onComplete(responses);
  };

  const allQuestionsAnswered = filteredQuestions.every(q => responses[q.id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Book className="text-primary h-6 w-6" />
        <h2 className="text-2xl font-bold">Behavioral & Emotional Regulation</h2>
      </div>
      
      <p className="text-muted-foreground mb-6">
        These questions help us understand your child's ability to regulate their emotions, 
        manage impulses, and adapt to changing situations.
      </p>
      
      {filteredQuestions.map((question) => (
        <div key={question.id} className="border rounded-lg p-4 bg-card/50">
          <fieldset>
            <legend className="text-lg font-medium mb-3">{question.text}</legend>
            <RadioGroup 
              value={responses[question.id] || ''} 
              onValueChange={(value) => handleResponseChange(question.id, value)}
              className="space-y-2"
            >
              {question.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                  <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </fieldset>
        </div>
      ))}
      
      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSubmit} 
          disabled={!allQuestionsAnswered}
        >
          Next: Social Communication
        </Button>
      </div>
      
      {!allQuestionsAnswered && (
        <p className="text-sm text-amber-500">
          Please answer all questions before proceeding.
        </p>
      )}
    </div>
  );
};

export default BehavioralQuestions;
