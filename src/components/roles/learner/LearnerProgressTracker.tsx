import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Trophy, Clock, Target, BookOpen, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface StudentProgressItem {
  id: string;
  content_id: string;
  progress_percentage: number;
  completed: boolean;
  last_accessed_at: string | null;
  notes: string | null;
}

interface ContentItem {
  id: string;
  title: string;
  content_type: string;
  age_group: string | null;
  difficulty_level: string | null;
}

export function LearnerProgressTracker() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<StudentProgressItem[]>([]);
  const [content, setContent] = useState<Map<string, ContentItem>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [progressRes, contentRes] = await Promise.all([
        supabase.from('student_progress').select('*').eq('student_id', user!.id).order('last_accessed_at', { ascending: false }),
        supabase.from('educational_content').select('id, title, content_type, age_group, difficulty_level').eq('is_published', true),
      ]);

      if (progressRes.error) throw progressRes.error;
      if (contentRes.error) throw contentRes.error;

      setProgress(progressRes.data || []);
      const cMap = new Map<string, ContentItem>();
      (contentRes.data || []).forEach(c => cMap.set(c.id, c));
      setContent(cMap);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const completedCount = progress.filter(p => p.completed).length;
  const inProgressCount = progress.filter(p => !p.completed && (p.progress_percentage ?? 0) > 0).length;
  const avgProgress = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + (p.progress_percentage ?? 0), 0) / progress.length)
    : 0;

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading progress...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Personal Pace Tracker</h2>
        <p className="text-muted-foreground">Track your learning journey and celebrate achievements</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProgress}%</div>
          </CardContent>
        </Card>
      </div>

      {progress.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No progress yet</h3>
            <p className="text-muted-foreground">Start a lesson to begin tracking your progress here!</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your lesson progress at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {progress.map(p => {
              const c = content.get(p.content_id);
              return (
                <div key={p.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                  {p.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                  ) : (
                    <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{c?.title || 'Unknown Lesson'}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {c?.age_group && <Badge variant="outline" className="text-xs">{c.age_group}</Badge>}
                      {c?.difficulty_level && <Badge variant="outline" className="text-xs">{c.difficulty_level}</Badge>}
                      {p.last_accessed_at && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(p.last_accessed_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-24 shrink-0">
                    <div className="text-xs text-right mb-1">{p.progress_percentage ?? 0}%</div>
                    <Progress value={p.progress_percentage ?? 0} className="h-2" />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
