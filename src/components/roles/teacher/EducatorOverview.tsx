import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, BookOpen, Users, BarChart3, Brain, Lightbulb } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useAIStream } from '@/hooks/useAIStream';
import { Button } from '@/components/ui/button';

export function EducatorOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ content: 0, published: 0, students: 0, avgProgress: 0 });
  const { response: suggestion, isLoading: aiLoading, generate } = useAIStream();

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      const [contentRes, progressRes] = await Promise.all([
        supabase.from('educational_content').select('id, is_published').eq('educator_id', user.id),
        supabase.from('student_progress').select('student_id, progress_percentage'),
      ]);
      const content = contentRes.data || [];
      const progress = progressRes.data || [];
      const students = new Set(progress.map(p => p.student_id)).size;
      const avg = progress.length > 0
        ? Math.round(progress.reduce((a, p) => a + (p.progress_percentage || 0), 0) / progress.length)
        : 0;
      setStats({
        content: content.length,
        published: content.filter(c => c.is_published).length,
        students,
        avgProgress: avg,
      });
    })();
  }, [user?.id]);

  const handleGetSuggestion = () => {
    generate('teaching-suggestion', 
      'Give me a quick tip for engaging a neurodiverse classroom today. Consider students with ADHD, dyslexia, and autism.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Educator Dashboard</h1>
        <p className="text-muted-foreground">Create, manage, and adapt content for neurodiverse learners</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Content', value: stats.content, sub: 'Lessons created', icon: FileText },
          { label: 'Published', value: stats.published, sub: 'Available to students', icon: BookOpen },
          { label: 'Students', value: stats.students, sub: 'Active learners', icon: Users },
          { label: 'Avg Progress', value: `${stats.avgProgress}%`, sub: 'Across all content', icon: BarChart3 },
        ].map(s => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Quick Suggestion */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">AI Teaching Assistant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Get real-time AI suggestions for engaging neurodiverse learners.
          </p>
          <Button onClick={handleGetSuggestion} disabled={aiLoading} size="sm">
            <Lightbulb className="h-4 w-4 mr-2" />
            {aiLoading ? 'Thinking...' : 'Get a Teaching Tip'}
          </Button>
          {suggestion && (
            <div className="p-3 rounded-lg bg-background border text-sm whitespace-pre-wrap">
              {suggestion}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
