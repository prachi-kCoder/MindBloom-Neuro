import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, BookOpen, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export function EducatorAnalytics() {
  const { user } = useAuth();
  const [contentData, setContentData] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [summaryStats, setSummaryStats] = useState({ totalEngagements: 0, completionRate: 0, activeStudents: 0, avgScore: 0 });

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      const [cRes, pRes] = await Promise.all([
        supabase.from('educational_content').select('*').eq('educator_id', user.id),
        supabase.from('student_progress').select('*'),
      ]);

      const content = cRes.data || [];
      const progress = pRes.data || [];

      // Content type distribution
      const typeCount: Record<string, number> = {};
      content.forEach(c => { typeCount[c.content_type] = (typeCount[c.content_type] || 0) + 1; });
      setContentData(Object.entries(typeCount).map(([name, value]) => ({ name, value })));

      // Progress by content
      const contentMap = new Map(content.map(c => [c.id, c.title]));
      const byContent: Record<string, { total: number; count: number }> = {};
      progress.forEach(p => {
        const title = contentMap.get(p.content_id) || 'Unknown';
        if (!byContent[title]) byContent[title] = { total: 0, count: 0 };
        byContent[title].total += p.progress_percentage || 0;
        byContent[title].count += 1;
      });
      setProgressData(Object.entries(byContent).map(([name, v]) => ({
        name: name.length > 15 ? name.slice(0, 15) + '...' : name,
        progress: Math.round(v.total / v.count),
      })));

      // Summary
      const activeStudents = new Set(progress.map(p => p.student_id)).size;
      const completionRate = progress.length > 0 ? Math.round((progress.filter(p => p.completed).length / progress.length) * 100) : 0;
      const avgScore = progress.length > 0 ? Math.round(progress.reduce((a, p) => a + (p.progress_percentage || 0), 0) / progress.length) : 0;
      setSummaryStats({ totalEngagements: progress.length, completionRate, activeStudents, avgScore });
    })();
  }, [user?.id]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Progress & Analytics</h1>
        <p className="text-muted-foreground">Visual dashboards showing learner engagement, strengths, and areas needing support</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Engagements', value: summaryStats.totalEngagements, icon: TrendingUp },
          { label: 'Active Students', value: summaryStats.activeStudents, icon: Users },
          { label: 'Completion Rate', value: `${summaryStats.completionRate}%`, icon: Award },
          { label: 'Avg Progress', value: `${summaryStats.avgScore}%`, icon: BookOpen },
        ].map(s => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progress by Content</CardTitle>
            <CardDescription>Average learner progress per lesson</CardDescription>
          </CardHeader>
          <CardContent>
            {progressData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="progress" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-muted-foreground">No progress data yet</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
            <CardDescription>Breakdown by content type</CardDescription>
          </CardHeader>
          <CardContent>
            {contentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={contentData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                    {contentData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-muted-foreground">No content data yet</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
