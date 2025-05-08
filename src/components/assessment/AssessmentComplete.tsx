
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, Home, RotateCcw, FileText, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AssessmentCompleteProps {
  responses: Record<string, any>;
  assessmentType: 'video' | 'quiz';
  onReset: () => void;
}

const AssessmentComplete: React.FC<AssessmentCompleteProps> = ({ 
  responses, 
  assessmentType,
  onReset 
}) => {
  const navigate = useNavigate();
  
  const generateSampleScore = () => {
    // In a real app, this would be a calculated score based on responses
    return Math.floor(Math.random() * 80) + 20; // Random score between 20-100
  };
  
  const downloadReport = () => {
    console.log('Downloading report with responses:', responses);
    
    // In a real app, you would generate a PDF or similar report
    alert('In a real application, this would generate and download a detailed assessment report.');
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        {assessmentType === 'video' ? (
          <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center">
            <Video className="h-7 w-7 text-primary" />
          </div>
        ) : (
          <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center">
            <FileText className="h-7 w-7 text-primary" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">Assessment Complete</h1>
          <p className="text-muted-foreground">
            Thank you for completing the {assessmentType === 'video' ? 'video-based' : 'questionnaire'} assessment.
          </p>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Results Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['Behavioral', 'Social', 'Cognitive', 'Adaptive'].map((domain) => {
              const score = generateSampleScore();
              const getColor = (score: number) => {
                if (score < 40) return 'bg-red-100 text-red-700';
                if (score < 70) return 'bg-yellow-100 text-yellow-700';
                return 'bg-green-100 text-green-700';
              };
              
              return (
                <div key={domain} className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">{domain}</h3>
                  <div className={`text-2xl font-bold py-1 px-2 rounded-md inline-block ${getColor(score)}`}>
                    {score}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="font-medium mb-2">What do these scores mean?</p>
            <p className="text-sm text-muted-foreground mb-3">
              These preliminary scores provide an initial indication of your child's development
              in key areas. Scores are not diagnostic but can help identify areas that may benefit
              from additional support or professional evaluation.
            </p>
            <p className="text-sm text-muted-foreground">
              Scores below 40 may suggest challenges in that domain, scores between 40-70 indicate
              typical development with some areas to monitor, and scores above 70 suggest
              strengths in that domain.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm font-medium">Next Steps</p>
            <ul className="list-disc pl-5 text-sm space-y-2 text-muted-foreground">
              <li>Download the detailed assessment report</li>
              <li>Review the personalized recommendations</li>
              <li>Consider scheduling a consultation with a specialist</li>
              <li>Explore resources tailored to your child's needs</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="gap-2" onClick={onReset}>
            <RotateCcw className="h-4 w-4" /> Start Over
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => navigate('/')}>
            <Home className="h-4 w-4" /> Return to Home
          </Button>
        </div>
        <Button onClick={downloadReport} className="gap-2">
          <FileDown className="h-4 w-4" /> Download Full Report
        </Button>
      </div>
      
      <div className="mt-8 border-t pt-6">
        <p className="text-sm text-muted-foreground">
          <strong>Important:</strong> This assessment is designed as a screening tool and not a diagnostic
          instrument. Results should be discussed with qualified healthcare professionals.
        </p>
      </div>
    </div>
  );
};

export default AssessmentComplete;
