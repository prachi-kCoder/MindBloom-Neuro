import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Copy, Check } from 'lucide-react';
import { useAIStream } from '@/hooks/useAIStream';
import { toast } from 'sonner';

export function AILessonPlanner() {
  const { response, isLoading, generate, reset } = useAIStream();
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    topic: '',
    ageGroup: '',
    disability: '',
    duration: '30',
    goals: '',
  });

  const handleGenerate = () => {
    if (!form.topic) { toast.error('Please enter a lesson topic'); return; }
    const prompt = `Create an adaptive lesson plan:
- Topic: ${form.topic}
- Age Group: ${form.ageGroup || 'General'}
- Learner Profile: ${form.disability || 'Mixed neurodiverse classroom'}
- Duration: ${form.duration} minutes
- Learning Goals: ${form.goals || 'Not specified'}

Include specific accommodations for the learner profiles mentioned. Add multisensory activities and differentiated instructions.`;
    generate('lesson-plan', prompt);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Lesson Planner</h1>
        <p className="text-muted-foreground">Generate adaptive lesson plans customized for neurodiverse learners</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Lesson Parameters
            </CardTitle>
            <CardDescription>Describe your lesson and AI will create an adaptive plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Lesson Topic *</Label>
              <Input placeholder="e.g., Introduction to Fractions" value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Age Group</Label>
                <Select value={form.ageGroup} onValueChange={v => setForm(p => ({ ...p, ageGroup: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="6-8">6-8 years</SelectItem>
                    <SelectItem value="9-12">9-12 years</SelectItem>
                    <SelectItem value="13+">13+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration (min)</Label>
                <Select value={form.duration} onValueChange={v => setForm(p => ({ ...p, duration: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="45">45 min</SelectItem>
                    <SelectItem value="60">60 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Learner Profile</Label>
              <Select value={form.disability} onValueChange={v => setForm(p => ({ ...p, disability: v }))}>
                <SelectTrigger><SelectValue placeholder="Select focus" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="adhd">ADHD</SelectItem>
                  <SelectItem value="dyslexia">Dyslexia</SelectItem>
                  <SelectItem value="autism">Autism Spectrum</SelectItem>
                  <SelectItem value="mixed">Mixed Neurodiverse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Learning Goals</Label>
              <Textarea placeholder="What should students learn by the end?" value={form.goals} onChange={e => setForm(p => ({ ...p, goals: e.target.value }))} rows={3} />
            </div>
            <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
              <Brain className="h-4 w-4 mr-2" />
              {isLoading ? 'Generating Plan...' : 'Generate Lesson Plan'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Plan</CardTitle>
              {response && !response.startsWith('Error') && (
                <Button size="sm" variant="outline" onClick={handleCopy}>
                  {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!response && !isLoading && (
              <div className="text-center py-12 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>Your AI-generated lesson plan will appear here</p>
              </div>
            )}
            {(response || isLoading) && (
              <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap text-sm">
                {response}
                {isLoading && <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
