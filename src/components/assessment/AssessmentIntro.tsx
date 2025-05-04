
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, FileText, Users } from 'lucide-react';

interface AssessmentIntroProps {
  onStart: (age: number) => void;
}

const AssessmentIntro: React.FC<AssessmentIntroProps> = ({ onStart }) => {
  const [childAge, setChildAge] = useState<number>(5);
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    if (!childAge || childAge < 2 || childAge > 18) {
      setError('Please enter a valid age between 2 and 18');
      return;
    }
    
    onStart(childAge);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Behavioral Assessment</h1>
      <p className="text-muted-foreground mb-8">
        This comprehensive assessment helps identify patterns in children with 
        neurodevelopmental differences and provides personalized insights.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader className="pb-2">
            <div className="w-12 h-12 rounded-full bg-soft-purple/50 flex items-center justify-center mb-2">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Behavioral & Emotional</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Evaluates self-regulation abilities, emotional responses, and behavioral patterns.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="w-12 h-12 rounded-full bg-soft-blue/50 flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Social Communication</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Assesses social interaction skills, communication patterns, and peer relationships.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="w-12 h-12 rounded-full bg-soft-peach/50 flex items-center justify-center mb-2">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Learning & Functioning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Examines cognitive processing, learning patterns, and daily living skills.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Begin Assessment</CardTitle>
          <CardDescription>
            Please provide your child's information to personalize the assessment questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="childName">Child's First Name (Optional)</Label>
              <Input 
                id="childName" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter child's first name" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="childAge">Child's Age (Required)</Label>
              <Input 
                id="childAge" 
                type="number" 
                min={2} 
                max={18} 
                value={childAge || ''} 
                onChange={(e) => setChildAge(parseInt(e.target.value) || 0)} 
                placeholder="Enter child's age (2-18)" 
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleStart} className="w-full md:w-auto">
            Start Assessment
          </Button>
        </CardFooter>
      </Card>
      
      <div className="text-sm text-muted-foreground">
        <p className="mb-2"><strong>Note:</strong> This assessment takes approximately 15-20 minutes to complete.</p>
        <p>All information provided is private and used only to personalize your assessment results and recommendations.</p>
      </div>
    </div>
  );
};

export default AssessmentIntro;
