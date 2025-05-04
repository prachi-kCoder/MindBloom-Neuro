
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Brain, BookOpen, Users, FileText } from 'lucide-react';

interface AssessmentCompleteProps {
  responses: Record<string, any>;
  onReset: () => void;
}

const AssessmentComplete: React.FC<AssessmentCompleteProps> = ({ responses, onReset }) => {
  // Generate domain scores (this would be more sophisticated in a real app)
  const domainScores = [
    { name: 'Behavioral', score: calculateDomainScore(responses.behavioral), fill: '#E5DEFF' },
    { name: 'Social', score: calculateDomainScore(responses.social), fill: '#D3E4FD' },
    { name: 'Cognitive', score: calculateDomainScore(responses.cognitive), fill: '#FDE1D3' },
    { name: 'Adaptive', score: calculateDomainScore(responses.adaptive), fill: '#FFDEE2' }
  ];

  // Get recommendations based on scores
  const recommendations = generateRecommendations(domainScores);

  function calculateDomainScore(domainResponses: Record<string, any>) {
    // In a real app, this would be a more sophisticated algorithm
    // For now, just return a random score between 30-100
    return Math.floor(Math.random() * 70) + 30;
  }

  function generateRecommendations(scores: { name: string, score: number }[]) {
    const lowestDomain = scores.reduce((prev, current) => 
      prev.score < current.score ? prev : current
    );
    
    const recommendations = [
      {
        domain: "General",
        icon: <BookOpen className="h-5 w-5 text-primary" />,
        title: "Personalized Learning Resources",
        text: "Based on your child's assessment results, we recommend exploring our customized learning materials tailored to their specific needs."
      },
      {
        domain: lowestDomain.name,
        icon: getDomainIcon(lowestDomain.name),
        title: `${lowestDomain.name} Development Focus`,
        text: `We've identified ${lowestDomain.name.toLowerCase()} skills as an area where your child might benefit from additional support. Our resources section contains targeted activities.`
      },
      {
        domain: "Professional",
        icon: <Users className="h-5 w-5 text-primary" />,
        title: "Professional Consultation",
        text: "Consider scheduling a consultation with a specialist to discuss these results and develop a personalized support plan."
      }
    ];
    
    return recommendations;
  }

  function getDomainIcon(domain: string) {
    switch(domain) {
      case 'Behavioral': 
        return <Brain className="h-5 w-5 text-primary" />;
      case 'Social': 
        return <Users className="h-5 w-5 text-primary" />;
      case 'Cognitive': 
        return <Brain className="h-5 w-5 text-primary" />;
      case 'Adaptive': 
        return <FileText className="h-5 w-5 text-primary" />;
      default: 
        return <BookOpen className="h-5 w-5 text-primary" />;
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Assessment Complete</h1>
        <p className="text-muted-foreground">
          Thank you for completing the assessment. Here's a summary of your results.
        </p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Domain Scores</CardTitle>
          <CardDescription>
            These scores represent your child's developmental profile across key domains.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ChartContainer config={{}} className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={domainScores}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <ChartTooltip 
                    content={<ChartTooltipContent />} 
                    cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="score" label={{ position: 'top' }}>
                    {domainScores.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {recommendations.map((rec, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {rec.icon}
                  <span className="text-sm font-medium text-muted-foreground">{rec.domain}</span>
                </div>
                <CardTitle className="text-lg">{rec.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{rec.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <Button onClick={onReset} variant="outline">
          Take Assessment Again
        </Button>
        
        <div className="flex gap-4">
          <Button asChild variant="secondary">
            <Link to="/resources">View Resources</Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard">View Full Results</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentComplete;
