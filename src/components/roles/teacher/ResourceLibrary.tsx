import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, FileText, Lightbulb, Users, ExternalLink } from 'lucide-react';
import { useAIStream } from '@/hooks/useAIStream';

const strategies = [
  { title: 'Chunking Tasks for ADHD', category: 'ADHD', description: 'Break assignments into 5-10 minute segments with clear checkpoints. Use visual timers and reward completion of each chunk.', tags: ['ADHD', 'Executive Function'] },
  { title: 'Multisensory Reading for Dyslexia', category: 'Dyslexia', description: 'Combine visual letter cards with tactile tracing (sandpaper letters) and auditory phoneme drills. Use color-coded syllables.', tags: ['Dyslexia', 'Reading'] },
  { title: 'Visual Schedules for ASD', category: 'ASD', description: 'Create picture-based daily schedules. Use "first-then" boards for transitions. Provide 5-minute warnings before activity changes.', tags: ['Autism', 'Routine'] },
  { title: 'Movement Breaks Protocol', category: 'General', description: 'Schedule 2-3 minute movement breaks every 15-20 minutes. Options: stretching, jumping jacks, yoga poses, or desk exercises.', tags: ['ADHD', 'Sensory'] },
  { title: 'Structured Peer Learning', category: 'Social', description: 'Pair learners with complementary strengths. Provide conversation scripts and role cards. Use timers to structure turn-taking.', tags: ['Social Skills', 'Collaboration'] },
  { title: 'Sensory-Friendly Environment', category: 'General', description: 'Reduce fluorescent lighting, provide noise-canceling headphones, create a calm-down corner with weighted blankets and fidget tools.', tags: ['Sensory', 'Environment'] },
];

const templates = [
  { title: 'IEP Goal Tracking Template', description: 'Track individualized education program goals with measurable outcomes.', type: 'Template' },
  { title: 'Behavior Observation Log', description: 'Structured form for recording antecedent-behavior-consequence patterns.', type: 'Template' },
  { title: 'Differentiated Lesson Framework', description: 'Three-tier lesson structure with scaffolded activities for diverse learners.', type: 'Template' },
  { title: 'Parent Communication Log', description: 'Weekly update template for sharing learner progress with families.', type: 'Template' },
];

export function ResourceLibrary() {
  const { response, isLoading, generate } = useAIStream();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleGetRecommendation = (category: string) => {
    setActiveCategory(category);
    generate('resource-recommendation', `Give me 5 practical teaching strategies for ${category} learners in an inclusive classroom. Focus on evidence-based approaches.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Resource Library</h1>
        <p className="text-muted-foreground">Curated strategies, templates, and AI-powered recommendations for inclusive education</p>
      </div>

      <Tabs defaultValue="strategies">
        <TabsList>
          <TabsTrigger value="strategies">Teaching Strategies</TabsTrigger>
          <TabsTrigger value="templates">Lesson Templates</TabsTrigger>
          <TabsTrigger value="ai-recommendations">AI Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="strategies" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {strategies.map(s => (
              <Card key={s.title}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{s.title}</CardTitle>
                  <div className="flex gap-1 flex-wrap">
                    {s.tags.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {templates.map(t => (
              <Card key={t.title}>
                <CardContent className="flex items-center gap-4 p-4">
                  <FileText className="h-8 w-8 text-primary shrink-0" />
                  <div>
                    <h3 className="font-medium">{t.title}</h3>
                    <p className="text-sm text-muted-foreground">{t.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-recommendations" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {['ADHD', 'Dyslexia', 'Autism', 'Executive Function', 'Sensory Processing'].map(cat => (
              <Button key={cat} size="sm" variant={activeCategory === cat ? 'default' : 'outline'} onClick={() => handleGetRecommendation(cat)} disabled={isLoading}>
                {cat}
              </Button>
            ))}
          </div>
          {(response || isLoading) && (
            <Card>
              <CardContent className="p-4">
                <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap text-sm">
                  {response}
                  {isLoading && <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />}
                </div>
              </CardContent>
            </Card>
          )}
          {!response && !isLoading && (
            <Card>
              <CardContent className="text-center py-12">
                <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-30" />
                <p className="text-muted-foreground">Select a category above to get AI-powered recommendations</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
