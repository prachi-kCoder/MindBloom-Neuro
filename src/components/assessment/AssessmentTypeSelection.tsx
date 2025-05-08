
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, FileText, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AssessmentTypeSelectionProps {
  onSelect: (type: 'video' | 'quiz') => void;
}

const AssessmentTypeSelection: React.FC<AssessmentTypeSelectionProps> = ({ onSelect }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Select Assessment Method</h1>
      <p className="text-muted-foreground mb-8">
        Choose the assessment method that works best for you and your child.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="transition-all duration-300 hover:shadow-lg border-2 hover:border-primary/50">
          <CardHeader>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Video className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Video-Based Assessment</CardTitle>
            <CardDescription className="text-base">
              Interactive video activities that observe your child's responses to different stimuli.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <div className="flex items-start gap-2">
              <div className="min-w-5 mt-1">✓</div>
              <p>More engaging for younger children</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="min-w-5 mt-1">✓</div>
              <p>Observes natural behaviors and reactions</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="min-w-5 mt-1">✓</div>
              <p>Followed by the standard questionnaire</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="min-w-5 mt-1">✓</div>
              <p>Takes approximately 25-35 minutes total</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full group" 
              onClick={() => onSelect('video')}
              size="lg"
            >
              Select Video Assessment
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg border-2 hover:border-primary/50">
          <CardHeader>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Questionnaire Assessment</CardTitle>
            <CardDescription className="text-base">
              Comprehensive set of questions about your child's behaviors and abilities.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <div className="flex items-start gap-2">
              <div className="min-w-5 mt-1">✓</div>
              <p>Can be completed at your own pace</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="min-w-5 mt-1">✓</div>
              <p>Covers four key developmental domains</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="min-w-5 mt-1">✓</div>
              <p>More suitable for busy parents or older children</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="min-w-5 mt-1">✓</div>
              <p>Takes approximately 15-20 minutes</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full group" 
              onClick={() => onSelect('quiz')}
              size="lg"
              variant="outline"
            >
              Select Questionnaire Only
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-primary/5 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Why choose an assessment method?</h3>
        <p className="text-muted-foreground">
          Both assessment methods provide valuable insights, but they collect information differently. 
          The video-based assessment adds observational data to the questionnaire responses, which may 
          provide a more complete picture for some children. Choose the option that works best for your 
          situation and your child's comfort level.
        </p>
      </div>
    </div>
  );
};

export default AssessmentTypeSelection;
