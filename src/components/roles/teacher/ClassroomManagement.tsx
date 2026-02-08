import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface StudentSummary {
  student_id: string;
  totalProgress: number;
  contentCount: number;
  completed: number;
  lastAccessed: string;
}

export function ClassroomManagement() {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      const { data } = await supabase.from('student_progress').select('*');
      if (!data) { setIsLoading(false); return; }

      const grouped: Record<string, StudentSummary> = {};
      data.forEach(p => {
        if (!grouped[p.student_id]) {
          grouped[p.student_id] = { student_id: p.student_id, totalProgress: 0, contentCount: 0, completed: 0, lastAccessed: p.last_accessed_at || p.created_at };
        }
        const s = grouped[p.student_id];
        s.totalProgress += p.progress_percentage || 0;
        s.contentCount += 1;
        if (p.completed) s.completed += 1;
        if (p.last_accessed_at && p.last_accessed_at > s.lastAccessed) s.lastAccessed = p.last_accessed_at;
      });

      setStudents(Object.values(grouped));
      setIsLoading(false);
    })();
  }, [user?.id]);

  const getEngagementLevel = (avg: number) => {
    if (avg >= 70) return { label: 'High', variant: 'default' as const, icon: CheckCircle2 };
    if (avg >= 40) return { label: 'Medium', variant: 'secondary' as const, icon: Clock };
    return { label: 'Low', variant: 'destructive' as const, icon: AlertTriangle };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Classroom Management</h1>
        <p className="text-muted-foreground">Monitor student engagement and identify learners who need support</p>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading students...</div>
      ) : students.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No student activity yet</h3>
            <p className="text-muted-foreground">Student engagement data will appear here once learners begin using your content.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {students.map(s => {
            const avg = s.contentCount > 0 ? Math.round(s.totalProgress / s.contentCount) : 0;
            const eng = getEngagementLevel(avg);
            return (
              <Card key={s.student_id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">Learner {s.student_id.slice(0, 8)}</p>
                      <Badge variant={eng.variant}>
                        <eng.icon className="h-3 w-3 mr-1" />
                        {eng.label} Engagement
                      </Badge>
                    </div>
                    <Progress value={avg} className="h-2 w-48" />
                    <p className="text-xs text-muted-foreground">
                      {s.completed}/{s.contentCount} lessons completed · Last active {new Date(s.lastAccessed).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{avg}%</p>
                    <p className="text-xs text-muted-foreground">Average</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
