import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, AlertTriangle, CheckCircle2, Clock, Search, MessageSquare, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useAIStream } from '@/hooks/useAIStream';
import { toast } from 'sonner';

interface StudentSummary {
  student_id: string;
  totalProgress: number;
  contentCount: number;
  completed: number;
  lastAccessed: string;
  trend: 'up' | 'down' | 'stable';
  contentDetails: { title: string; progress: number; completed: boolean }[];
}

export function ClassroomManagement() {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentSummary | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const { response: aiSuggestion, isLoading: aiLoading, generate: getAISuggestion } = useAIStream();

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      const [progressRes, contentRes] = await Promise.all([
        supabase.from('student_progress').select('*'),
        supabase.from('educational_content').select('id, title').eq('educator_id', user.id),
      ]);
      const progress = progressRes.data || [];
      const contentMap = new Map((contentRes.data || []).map(c => [c.id, c.title]));

      const grouped: Record<string, StudentSummary> = {};
      progress.forEach(p => {
        if (!grouped[p.student_id]) {
          grouped[p.student_id] = {
            student_id: p.student_id,
            totalProgress: 0,
            contentCount: 0,
            completed: 0,
            lastAccessed: p.last_accessed_at || p.created_at,
            trend: 'stable',
            contentDetails: [],
          };
        }
        const s = grouped[p.student_id];
        s.totalProgress += p.progress_percentage || 0;
        s.contentCount += 1;
        if (p.completed) s.completed += 1;
        if (p.last_accessed_at && p.last_accessed_at > s.lastAccessed) s.lastAccessed = p.last_accessed_at;
        s.contentDetails.push({
          title: contentMap.get(p.content_id) || 'Unknown Content',
          progress: p.progress_percentage || 0,
          completed: p.completed || false,
        });
      });

      // Simple trend: if avg > 50 = up, < 30 = down, else stable
      Object.values(grouped).forEach(s => {
        const avg = s.contentCount > 0 ? s.totalProgress / s.contentCount : 0;
        s.trend = avg >= 50 ? 'up' : avg < 30 ? 'down' : 'stable';
      });

      setStudents(Object.values(grouped));
      setIsLoading(false);
    })();
  }, [user?.id]);

  const getEngagementLevel = (avg: number) => {
    if (avg >= 70) return { label: 'High', variant: 'default' as const, icon: CheckCircle2, color: 'text-green-500' };
    if (avg >= 40) return { label: 'Medium', variant: 'secondary' as const, icon: Clock, color: 'text-yellow-500' };
    return { label: 'Low', variant: 'destructive' as const, icon: AlertTriangle, color: 'text-destructive' };
  };

  const getInterventionSuggestion = (student: StudentSummary) => {
    const avg = student.contentCount > 0 ? Math.round(student.totalProgress / student.contentCount) : 0;
    getAISuggestion('teaching-suggestion',
      `A student (ID: ${student.student_id.slice(0, 8)}) has ${avg}% average progress, completed ${student.completed}/${student.contentCount} lessons. Their trend is ${student.trend}. Suggest 3 specific intervention strategies for this neurodiverse learner.`);
  };

  const filteredStudents = students.filter(s => {
    const avg = s.contentCount > 0 ? Math.round(s.totalProgress / s.contentCount) : 0;
    const matchesSearch = s.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterLevel === 'all' ||
      (filterLevel === 'high' && avg >= 70) ||
      (filterLevel === 'medium' && avg >= 40 && avg < 70) ||
      (filterLevel === 'low' && avg < 40);
    return matchesSearch && matchesFilter;
  });

  const totalStudents = students.length;
  const highEngagement = students.filter(s => (s.totalProgress / Math.max(s.contentCount, 1)) >= 70).length;
  const lowEngagement = students.filter(s => (s.totalProgress / Math.max(s.contentCount, 1)) < 30).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Classroom Management</h1>
        <p className="text-muted-foreground">Monitor engagement, track progress, and provide targeted interventions</p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <Users className="h-4 w-4 text-muted-foreground mb-1" />
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Total Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <CheckCircle2 className="h-4 w-4 text-green-500 mb-1" />
            <div className="text-2xl font-bold">{highEngagement}</div>
            <p className="text-xs text-muted-foreground">High Engagement</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <AlertTriangle className="h-4 w-4 text-destructive mb-1" />
            <div className="text-2xl font-bold">{lowEngagement}</div>
            <p className="text-xs text-muted-foreground">Needs Support</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <TrendingUp className="h-4 w-4 text-primary mb-1" />
            <div className="text-2xl font-bold">
              {totalStudents > 0 ? Math.round(students.reduce((a, s) => a + (s.totalProgress / Math.max(s.contentCount, 1)), 0) / totalStudents) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Class Average</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search students..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2">
          {['all', 'high', 'medium', 'low'].map(level => (
            <Button key={level} size="sm" variant={filterLevel === level ? 'default' : 'outline'}
              onClick={() => setFilterLevel(level)} className="capitalize">
              {level === 'all' ? 'All' : `${level} Engagement`}
            </Button>
          ))}
        </div>
      </div>

      {/* Student List */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading students...</div>
      ) : filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No students found</h3>
            <p className="text-muted-foreground">Student engagement data will appear here once learners begin using your content.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filteredStudents.map(s => {
            const avg = s.contentCount > 0 ? Math.round(s.totalProgress / s.contentCount) : 0;
            const eng = getEngagementLevel(avg);
            return (
              <Card key={s.student_id} className="hover:border-primary/30 transition-colors">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">Learner {s.student_id.slice(0, 8)}</p>
                      <Badge variant={eng.variant}>
                        <eng.icon className="h-3 w-3 mr-1" />
                        {eng.label}
                      </Badge>
                      {s.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                      {s.trend === 'down' && <TrendingDown className="h-3 w-3 text-destructive" />}
                    </div>
                    <Progress value={avg} className="h-2 w-64 max-w-full" />
                    <p className="text-xs text-muted-foreground">
                      {s.completed}/{s.contentCount} lessons · Last active {new Date(s.lastAccessed).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold">{avg}%</p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setSelectedStudent(s)}>
                          <Eye className="h-3 w-3 mr-1" /> Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Student {s.student_id.slice(0, 8)} – Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="p-2 rounded border">
                              <p className="text-xl font-bold">{avg}%</p>
                              <p className="text-xs text-muted-foreground">Average</p>
                            </div>
                            <div className="p-2 rounded border">
                              <p className="text-xl font-bold">{s.completed}</p>
                              <p className="text-xs text-muted-foreground">Completed</p>
                            </div>
                            <div className="p-2 rounded border">
                              <p className="text-xl font-bold">{s.contentCount}</p>
                              <p className="text-xs text-muted-foreground">Enrolled</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2 text-sm">Content Progress</h4>
                            <div className="space-y-2">
                              {s.contentDetails.map((cd, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div className="flex-1">
                                    <p className="text-xs font-medium truncate">{cd.title}</p>
                                    <Progress value={cd.progress} className="h-1.5 mt-1" />
                                  </div>
                                  <span className="text-xs font-medium w-10 text-right">{cd.progress}%</span>
                                  {cd.completed && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2 text-sm">Educator Notes</h4>
                            <Textarea
                              placeholder="Add notes about this student..."
                              value={notes[s.student_id] || ''}
                              onChange={e => setNotes(prev => ({ ...prev, [s.student_id]: e.target.value }))}
                              rows={3}
                            />
                          </div>

                          <Button size="sm" onClick={() => getInterventionSuggestion(s)} disabled={aiLoading} className="w-full">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            {aiLoading ? 'Getting suggestions...' : 'Get AI Intervention Ideas'}
                          </Button>
                          {aiSuggestion && (
                            <div className="p-3 rounded-lg bg-primary/5 border text-sm whitespace-pre-wrap">
                              {aiSuggestion}
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
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
