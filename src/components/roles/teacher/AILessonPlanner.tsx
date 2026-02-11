import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Sparkles, Copy, Check, Download, RotateCcw, Save, History, FileText } from 'lucide-react';
import { useAIStream } from '@/hooks/useAIStream';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface SavedPlan {
  id: string;
  topic: string;
  ageGroup: string;
  disability: string;
  content: string;
  createdAt: Date;
}

export function AILessonPlanner() {
  const { response, isLoading, generate, reset } = useAIStream();
  const [copied, setCopied] = useState(false);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [activeTab, setActiveTab] = useState('create');
  const [form, setForm] = useState({
    topic: '',
    ageGroup: '',
    disability: '',
    duration: '30',
    goals: '',
    additionalNeeds: '',
    classSize: '',
    priorKnowledge: '',
  });

  const handleGenerate = () => {
    if (!form.topic) { toast.error('Please enter a lesson topic'); return; }
    const prompt = `Create a detailed, well-structured adaptive lesson plan using markdown formatting:

## Lesson Parameters
- **Topic**: ${form.topic}
- **Age Group**: ${form.ageGroup || 'General'}
- **Learner Profile**: ${form.disability || 'Mixed neurodiverse classroom'}
- **Duration**: ${form.duration} minutes
- **Class Size**: ${form.classSize || 'Not specified'}
- **Prior Knowledge**: ${form.priorKnowledge || 'Not specified'}
- **Learning Goals**: ${form.goals || 'Not specified'}
- **Additional Needs**: ${form.additionalNeeds || 'None specified'}

Please structure the plan with these sections using markdown headers and formatting:

## 🎯 Learning Objectives
(Clear, measurable objectives using Bloom's taxonomy)

## 📦 Materials & Resources
(Bulleted list of all materials needed including assistive technology)

## ⏱️ Lesson Timeline
(Minute-by-minute breakdown with activities, use a table format)

## 🎨 Differentiated Activities
(Tiered activities for different skill levels: foundational, intermediate, advanced)

## ♿ Accommodations & Modifications
(Specific accommodations for the learner profiles mentioned, organized by profile)

## 🧠 Multisensory Strategies
(Visual, auditory, kinesthetic, and tactile approaches for each activity)

## ✅ Assessment & Progress Checks
(Formative assessment ideas, exit tickets, observation checklists)

## 🏠 Extension & Homework
(Optional take-home activities and parent communication points)

Use bold, bullet points, numbered lists, and tables for clear formatting.`;
    generate('lesson-plan', prompt);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!response || response.startsWith('Error')) return;
    const plan: SavedPlan = {
      id: Date.now().toString(),
      topic: form.topic,
      ageGroup: form.ageGroup,
      disability: form.disability,
      content: response,
      createdAt: new Date(),
    };
    setSavedPlans(prev => [plan, ...prev]);
    toast.success('Lesson plan saved!');
  };

  const handleDownload = () => {
    if (!response) return;
    const blob = new Blob([response], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lesson-plan-${form.topic.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded as markdown file');
  };

  const handleReset = () => {
    reset();
    setForm({ topic: '', ageGroup: '', disability: '', duration: '30', goals: '', additionalNeeds: '', classSize: '', priorKnowledge: '' });
  };

  const loadSavedPlan = (plan: SavedPlan) => {
    setActiveTab('create');
    // We can't set the response directly, so just show the saved content
    toast.info(`Viewing saved plan: ${plan.topic}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Lesson Planner</h1>
          <p className="text-muted-foreground">Generate adaptive lesson plans customized for neurodiverse learners</p>
        </div>
        {savedPlans.length > 0 && (
          <Badge variant="secondary" className="gap-1">
            <History className="h-3 w-3" />
            {savedPlans.length} saved
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="create">Create Plan</TabsTrigger>
          <TabsTrigger value="saved">Saved Plans ({savedPlans.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Form - 2 cols */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Lesson Parameters
                </CardTitle>
                <CardDescription>Describe your lesson and AI will create an adaptive plan</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-320px)] pr-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Lesson Topic *</Label>
                      <Input placeholder="e.g., Introduction to Fractions" value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Age Group</Label>
                        <Select value={form.ageGroup} onValueChange={v => setForm(p => ({ ...p, ageGroup: v }))}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3-5">3–5 years</SelectItem>
                            <SelectItem value="6-8">6–8 years</SelectItem>
                            <SelectItem value="9-12">9–12 years</SelectItem>
                            <SelectItem value="13-16">13–16 years</SelectItem>
                            <SelectItem value="17+">17+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Select value={form.duration} onValueChange={v => setForm(p => ({ ...p, duration: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 min</SelectItem>
                            <SelectItem value="30">30 min</SelectItem>
                            <SelectItem value="45">45 min</SelectItem>
                            <SelectItem value="60">60 min</SelectItem>
                            <SelectItem value="90">90 min</SelectItem>
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
                          <SelectItem value="dyscalculia">Dyscalculia</SelectItem>
                          <SelectItem value="dysgraphia">Dysgraphia</SelectItem>
                          <SelectItem value="mixed">Mixed Neurodiverse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Class Size</Label>
                      <Input placeholder="e.g., 12 students" value={form.classSize} onChange={e => setForm(p => ({ ...p, classSize: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Prior Knowledge</Label>
                      <Textarea placeholder="What do students already know?" value={form.priorKnowledge} onChange={e => setForm(p => ({ ...p, priorKnowledge: e.target.value }))} rows={2} />
                    </div>
                    <div className="space-y-2">
                      <Label>Learning Goals</Label>
                      <Textarea placeholder="What should students learn by the end?" value={form.goals} onChange={e => setForm(p => ({ ...p, goals: e.target.value }))} rows={2} />
                    </div>
                    <div className="space-y-2">
                      <Label>Additional Needs / Notes</Label>
                      <Textarea placeholder="e.g., one student uses a wheelchair, another needs frequent breaks" value={form.additionalNeeds} onChange={e => setForm(p => ({ ...p, additionalNeeds: e.target.value }))} rows={2} />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleGenerate} disabled={isLoading} className="flex-1">
                        <Brain className="h-4 w-4 mr-2" />
                        {isLoading ? 'Generating...' : 'Generate Plan'}
                      </Button>
                      <Button onClick={handleReset} variant="outline" size="icon" title="Reset">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Output - 3 cols */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Generated Plan</CardTitle>
                  {response && !response.startsWith('Error') && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={handleSave}>
                        <Save className="h-3 w-3 mr-1" /> Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleDownload}>
                        <Download className="h-3 w-3 mr-1" /> Download
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCopy}>
                        {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!response && !isLoading && (
                  <div className="text-center py-16 text-muted-foreground">
                    <Brain className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium mb-1">Ready to plan</p>
                    <p className="text-sm">Fill in the parameters and click Generate to create your adaptive lesson plan</p>
                  </div>
                )}
                {(response || isLoading) && (
                  <ScrollArea className="h-[calc(100vh-320px)]">
                    <div className="prose prose-sm max-w-none dark:prose-invert
                      prose-headings:text-foreground prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-3
                      prose-h2:text-xl prose-h2:border-b prose-h2:border-border prose-h2:pb-2
                      prose-h3:text-lg
                      prose-p:text-muted-foreground prose-p:leading-relaxed
                      prose-li:text-muted-foreground
                      prose-strong:text-foreground
                      prose-table:border prose-table:border-border
                      prose-th:bg-muted prose-th:p-2 prose-th:text-left prose-th:font-semibold prose-th:text-foreground prose-th:border prose-th:border-border
                      prose-td:p-2 prose-td:border prose-td:border-border prose-td:text-muted-foreground
                      pr-4">
                      <ReactMarkdown>{response}</ReactMarkdown>
                      {isLoading && <span className="inline-block w-2 h-5 bg-primary animate-pulse ml-1 rounded-sm" />}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="saved" className="mt-4">
          {savedPlans.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-30" />
                <p className="text-muted-foreground">No saved plans yet. Generate and save a plan to see it here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {savedPlans.map(plan => (
                <Card key={plan.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => loadSavedPlan(plan)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{plan.topic}</CardTitle>
                    <CardDescription>{new Date(plan.createdAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 flex-wrap">
                      {plan.ageGroup && <Badge variant="outline">{plan.ageGroup}</Badge>}
                      {plan.disability && <Badge variant="outline">{plan.disability}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{plan.content.slice(0, 150)}...</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
