import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, BookOpen, Users, BarChart3, Brain, Lightbulb, TrendingUp, AlertTriangle, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useAIStream } from '@/hooks/useAIStream';
import { useNavigate } from 'react-router-dom';

export function EducatorOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ content: 0, published: 0, students: 0, avgProgress: 0, completionRate: 0, atRisk: 0 });
  const [recentContent, setRecentContent] = useState<any[]>([]);
  const [lowEngagement, setLowEngagement] = useState<any[]>([]);
  const { response: suggestion, isLoading: aiLoading, generate } = useAIStream();

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      const [contentRes, progressRes] = await Promise.all([
        supabase.from('educational_content').select('*').eq('educator_id', user.id).order('created_at', { ascending: false }),
        supabase.from('student_progress').select('*'),
      ]);
      const content = contentRes.data || [];
      const progress = progressRes.data || [];
      const students = new Set(progress.map(p => p.student_id));
      const avg = progress.length > 0
        ? Math.round(progress.reduce((a, p) => a + (p.progress_percentage || 0), 0) / progress.length)
        : 0;
      const completed = progress.filter(p => p.completed).length;
      const completionRate = progress.length > 0 ? Math.round((completed / progress.length) * 100) : 0;

      // Find at-risk students (avg progress < 30%)
      const studentMap: Record<string, { total: number; count: number }> = {};
      progress.forEach(p => {
        if (!studentMap[p.student_id]) studentMap[p.student_id] = { total: 0, count: 0 };
        studentMap[p.student_id].total += p.progress_percentage || 0;
        studentMap[p.student_id].count += 1;
      });
      const atRiskStudents = Object.entries(studentMap).filter(([_, v]) => v.count > 0 && (v.total / v.count) < 30);

      setStats({
        content: content.length,
        published: content.filter(c => c.is_published).length,
        students: students.size,
        avgProgress: avg,
        completionRate,
        atRisk: atRiskStudents.length,
      });
      setRecentContent(content.slice(0, 3));
      setLowEngagement(atRiskStudents.map(([id, v]) => ({ id, avg: Math.round(v.total / v.count) })));
    })();
  }, [user?.id]);

  const handleGetSuggestion = () => {
    generate('teaching-suggestion',
      `I have ${stats.students} students, ${stats.atRisk} are at risk (below 30% progress). Average class progress is ${stats.avgProgress}%. Completion rate is ${stats.completionRate}%. Give me a quick, actionable tip for today's class to boost engagement for neurodiverse learners.`);
  };

  const statCards = [
    { label: 'Total Content', value: stats.content, sub: 'Lessons created', icon: FileText, color: 'text-blue-500' },
    { label: 'Published', value: stats.published, sub: 'Live for students', icon: BookOpen, color: 'text-green-500' },
    { label: 'Students', value: stats.students, sub: 'Active learners', icon: Users, color: 'text-purple-500' },
    { label: 'Avg Progress', value: `${stats.avgProgress}%`, sub: 'Across all content', icon: TrendingUp, color: 'text-orange-500' },
    { label: 'Completion', value: `${stats.completionRate}%`, sub: 'Lessons finished', icon: BarChart3, color: 'text-primary' },
    { label: 'Needs Support', value: stats.atRisk, sub: 'Below 30% progress', icon: AlertTriangle, color: 'text-destructive' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome back 👋</h1>
          <p className="text-muted-foreground">Here's what's happening with your learners today</p>
        </div>
        <Button onClick={() => navigate('/dashboard/lesson-planner')} className="gap-2">
          <Sparkles className="h-4 w-4" /> New AI Lesson
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {statCards.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div className="text-2xl font-bold">{s.value}</div>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI Quick Suggestion */}
        <Card className="lg:col-span-2 border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">AI Teaching Assistant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Get personalized, context-aware tips based on your class data.
            </p>
            <Button onClick={handleGetSuggestion} disabled={aiLoading} size="sm">
              <Lightbulb className="h-4 w-4 mr-2" />
              {aiLoading ? 'Thinking...' : 'Get Today\'s Teaching Tip'}
            </Button>
            {suggestion && (
              <div className="p-3 rounded-lg bg-background border text-sm whitespace-pre-wrap leading-relaxed">
                {suggestion}
              </div>
            )}
          </CardContent>
        </Card>

        {/* At-risk students */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Students Needing Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowEngagement.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No at-risk students 🎉</p>
            ) : (
              <div className="space-y-3">
                {lowEngagement.slice(0, 5).map(s => (
                  <div key={s.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Student {s.id.slice(0, 8)}</p>
                      <Progress value={s.avg} className="h-1.5 mt-1" />
                    </div>
                    <span className="text-sm font-medium text-destructive">{s.avg}%</span>
                  </div>
                ))}
              </div>
            )}
            <Button variant="ghost" size="sm" className="w-full mt-3" onClick={() => navigate('/dashboard/classroom')}>
              View all <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content */}
      {recentContent.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Content</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/content')}>
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {recentContent.map(c => (
                <div key={c.id} className="p-3 rounded-lg border bg-muted/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium truncate">{c.title}</h4>
                    <Badge variant={c.is_published ? 'default' : 'secondary'} className="text-[10px] shrink-0">
                      {c.is_published ? 'Live' : 'Draft'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{c.description || 'No description'}</p>
                  <div className="flex gap-1">
                    {c.age_group && <Badge variant="outline" className="text-[10px]">{c.age_group}</Badge>}
                    <Badge variant="outline" className="text-[10px]">{c.content_type}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-3 md:grid-cols-4">
        {[
          { label: 'AI Lesson Plan', icon: Brain, path: '/dashboard/lesson-planner', desc: 'Generate adaptive plans' },
          { label: 'Classroom', icon: Users, path: '/dashboard/classroom', desc: 'Monitor students' },
          { label: 'Analytics', icon: BarChart3, path: '/dashboard/analytics', desc: 'View progress data' },
          { label: 'Resources', icon: BookOpen, path: '/dashboard/resources', desc: 'Teaching strategies' },
        ].map(q => (
          <Card key={q.label} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate(q.path)}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <q.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{q.label}</p>
                <p className="text-xs text-muted-foreground">{q.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
