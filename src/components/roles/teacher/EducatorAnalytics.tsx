import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend,
} from 'recharts';
import { TrendingUp, Users, BookOpen, Award, Download, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const COLORS = ['hsl(var(--primary))', 'hsl(142 76% 36%)', 'hsl(38 92% 50%)', 'hsl(0 84% 60%)', 'hsl(262 83% 58%)'];

export function EducatorAnalytics() {
  const { user } = useAuth();
  const [contentData, setContentData] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [engagementOverTime, setEngagementOverTime] = useState<any[]>([]);
  const [difficultyBreakdown, setDifficultyBreakdown] = useState<any[]>([]);
  const [summaryStats, setSummaryStats] = useState({
    totalEngagements: 0, completionRate: 0, activeStudents: 0, avgScore: 0, totalContent: 0, topContent: '',
  });

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

      // Difficulty breakdown
      const diffCount: Record<string, number> = {};
      content.forEach(c => {
        const d = c.difficulty_level || 'unset';
        diffCount[d] = (diffCount[d] || 0) + 1;
      });
      setDifficultyBreakdown(Object.entries(diffCount).map(([name, value]) => ({ name, value })));

      // Progress by content
      const contentMap = new Map(content.map(c => [c.id, c.title]));
      const byContent: Record<string, { total: number; count: number; completed: number }> = {};
      progress.forEach(p => {
        const title = contentMap.get(p.content_id) || 'Unknown';
        if (!byContent[title]) byContent[title] = { total: 0, count: 0, completed: 0 };
        byContent[title].total += p.progress_percentage || 0;
        byContent[title].count += 1;
        if (p.completed) byContent[title].completed += 1;
      });
      setProgressData(Object.entries(byContent).map(([name, v]) => ({
        name: name.length > 18 ? name.slice(0, 18) + '…' : name,
        progress: Math.round(v.total / v.count),
        students: v.count,
        completion: v.count > 0 ? Math.round((v.completed / v.count) * 100) : 0,
      })));

      // Engagement over time (group by date)
      const byDate: Record<string, { engagements: number; avgProgress: number; count: number }> = {};
      progress.forEach(p => {
        const date = (p.last_accessed_at || p.created_at).slice(0, 10);
        if (!byDate[date]) byDate[date] = { engagements: 0, avgProgress: 0, count: 0 };
        byDate[date].engagements += 1;
        byDate[date].avgProgress += p.progress_percentage || 0;
        byDate[date].count += 1;
      });
      const sorted = Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b)).slice(-14);
      setEngagementOverTime(sorted.map(([date, v]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        engagements: v.engagements,
        avgProgress: Math.round(v.avgProgress / v.count),
      })));

      // Summary
      const activeStudents = new Set(progress.map(p => p.student_id)).size;
      const completionRate = progress.length > 0 ? Math.round((progress.filter(p => p.completed).length / progress.length) * 100) : 0;
      const avgScore = progress.length > 0 ? Math.round(progress.reduce((a, p) => a + (p.progress_percentage || 0), 0) / progress.length) : 0;
      
      // Top performing content
      let topContent = 'N/A';
      if (Object.keys(byContent).length > 0) {
        topContent = Object.entries(byContent).sort(([, a], [, b]) => (b.total / b.count) - (a.total / a.count))[0][0];
      }
      
      setSummaryStats({ totalEngagements: progress.length, completionRate, activeStudents, avgScore, totalContent: content.length, topContent });
    })();
  }, [user?.id]);

  const handleExport = () => {
    const csvRows = ['Content,Avg Progress,Students,Completion Rate'];
    progressData.forEach(d => csvRows.push(`"${d.name}",${d.progress}%,${d.students},${d.completion}%`));
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'educator-analytics.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Progress & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into learner engagement and performance</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {[
          { label: 'Engagements', value: summaryStats.totalEngagements, icon: TrendingUp },
          { label: 'Active Students', value: summaryStats.activeStudents, icon: Users },
          { label: 'Completion', value: `${summaryStats.completionRate}%`, icon: Award },
          { label: 'Avg Progress', value: `${summaryStats.avgScore}%`, icon: BookOpen },
          { label: 'Total Content', value: summaryStats.totalContent, icon: Calendar },
          { label: 'Top Content', value: summaryStats.topContent.slice(0, 12) + (summaryStats.topContent.length > 12 ? '…' : ''), icon: Award },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <s.icon className="h-4 w-4 text-muted-foreground mb-1" />
              <div className="text-xl font-bold">{s.value}</div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="content">Content Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Progress by Content</CardTitle>
                <CardDescription>Average learner progress & completion per lesson</CardDescription>
              </CardHeader>
              <CardContent>
                {progressData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="progress" name="Avg Progress" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="completion" name="Completion %" fill="hsl(142 76% 36%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">No progress data yet</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Content Distribution</CardTitle>
                <CardDescription>Breakdown by content type</CardDescription>
              </CardHeader>
              <CardContent>
                {contentData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={contentData} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
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
        </TabsContent>

        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Engagement Over Time</CardTitle>
              <CardDescription>Daily engagement count and average progress (last 14 days)</CardDescription>
            </CardHeader>
            <CardContent>
              {engagementOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={engagementOverTime}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="engagements" name="Engagements" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} />
                    <Line yAxisId="right" type="monotone" dataKey="avgProgress" name="Avg Progress %" stroke="hsl(142 76% 36%)" strokeWidth={2} dot={{ r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-muted-foreground">Not enough data for trends yet</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Difficulty Distribution</CardTitle>
                <CardDescription>Content breakdown by difficulty level</CardDescription>
              </CardHeader>
              <CardContent>
                {difficultyBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={difficultyBreakdown} cx="50%" cy="50%" outerRadius={100} innerRadius={40} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                        {difficultyBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">No data</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Student Enrollment per Content</CardTitle>
              </CardHeader>
              <CardContent>
                {progressData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={progressData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="students" name="Students" fill="hsl(262 83% 58%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">No data</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
