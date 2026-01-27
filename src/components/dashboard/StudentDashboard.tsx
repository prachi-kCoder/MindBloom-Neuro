import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Trophy, Clock, Target, Play, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EducationalContent {
  id: string;
  title: string;
  description: string | null;
  content: string;
  content_type: string;
  age_group: string | null;
  difficulty_level: string | null;
  created_at: string;
}

interface StudentProgress {
  id: string;
  content_id: string;
  progress_percentage: number;
  completed: boolean;
  last_accessed_at: string;
  notes: string | null;
}

export function StudentDashboard() {
  const { user } = useAuth();
  const [content, setContent] = useState<EducationalContent[]>([]);
  const [progress, setProgress] = useState<Map<string, StudentProgress>>(new Map());
  const [selectedContent, setSelectedContent] = useState<EducationalContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterAgeGroup, setFilterAgeGroup] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  useEffect(() => {
    fetchContent();
    fetchProgress();
  }, [user?.id]);

  async function fetchContent() {
    try {
      const { data, error } = await supabase
        .from('educational_content')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchProgress() {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', user.id);

      if (error) throw error;
      
      const progressMap = new Map<string, StudentProgress>();
      (data || []).forEach(p => progressMap.set(p.content_id, p));
      setProgress(progressMap);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  }

  async function startOrContinueContent(contentItem: EducationalContent) {
    if (!user?.id) return;

    const existingProgress = progress.get(contentItem.id);
    
    if (!existingProgress) {
      try {
        const { data, error } = await supabase
          .from('student_progress')
          .insert({
            student_id: user.id,
            content_id: contentItem.id,
            progress_percentage: 0,
          })
          .select()
          .single();

        if (error) throw error;
        
        setProgress(prev => new Map(prev).set(contentItem.id, data));
      } catch (error) {
        console.error('Error creating progress:', error);
        toast.error('Failed to start content');
        return;
      }
    }

    setSelectedContent(contentItem);
  }

  async function updateProgress(contentId: string, newProgress: number, completed: boolean = false) {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('student_progress')
        .upsert({
          student_id: user.id,
          content_id: contentId,
          progress_percentage: newProgress,
          completed,
          last_accessed_at: new Date().toISOString(),
        }, {
          onConflict: 'student_id,content_id',
        })
        .select()
        .single();

      if (error) throw error;
      
      setProgress(prev => new Map(prev).set(contentId, data));
      
      if (completed) {
        toast.success('🎉 Congratulations! You completed this lesson!');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }

  const filteredContent = content.filter(item => {
    if (filterAgeGroup !== 'all' && item.age_group !== filterAgeGroup) return false;
    if (filterDifficulty !== 'all' && item.difficulty_level !== filterDifficulty) return false;
    return true;
  });

  const completedCount = Array.from(progress.values()).filter(p => p.completed).length;
  const inProgressCount = Array.from(progress.values()).filter(p => !p.completed && p.progress_percentage > 0).length;

  if (selectedContent) {
    const currentProgress = progress.get(selectedContent.id);
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => setSelectedContent(null)}>
          ← Back to Content
        </Button>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{selectedContent.title}</CardTitle>
                <CardDescription>{selectedContent.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                {selectedContent.age_group && (
                  <Badge variant="outline">{selectedContent.age_group}</Badge>
                )}
                {selectedContent.difficulty_level && (
                  <Badge variant="outline">{selectedContent.difficulty_level}</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Your Progress</span>
                <span className="text-sm text-muted-foreground">
                  {currentProgress?.progress_percentage || 0}%
                </span>
              </div>
              <Progress value={currentProgress?.progress_percentage || 0} />
            </div>

            <div className="prose prose-sm max-w-none bg-muted/50 p-6 rounded-lg whitespace-pre-wrap">
              {selectedContent.content}
            </div>

            <div className="flex gap-4 justify-center">
              {!currentProgress?.completed && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => updateProgress(
                      selectedContent.id,
                      Math.min((currentProgress?.progress_percentage || 0) + 25, 100)
                    )}
                  >
                    Mark 25% Progress
                  </Button>
                  <Button
                    onClick={() => updateProgress(selectedContent.id, 100, true)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Complete
                  </Button>
                </>
              )}
              {currentProgress?.completed && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">You've completed this lesson!</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Lessons</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{content.length}</div>
            <p className="text-xs text-muted-foreground">Ready to learn</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">Keep going!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">Great job!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {content.length > 0 ? Math.round((completedCount / content.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Overall progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Content List */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Select value={filterAgeGroup} onValueChange={setFilterAgeGroup}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Age Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="6-8">6-8 years</SelectItem>
                <SelectItem value="9-12">9-12 years</SelectItem>
                <SelectItem value="13+">13+ years</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          {renderContentList(filteredContent)}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {renderContentList(filteredContent.filter(c => {
            const p = progress.get(c.id);
            return p && !p.completed && p.progress_percentage > 0;
          }))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {renderContentList(filteredContent.filter(c => progress.get(c.id)?.completed))}
        </TabsContent>
      </Tabs>
    </div>
  );

  function renderContentList(items: EducationalContent[]) {
    if (isLoading) {
      return <div className="text-center py-8">Loading content...</div>;
    }

    if (items.length === 0) {
      return (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No content available</h3>
            <p className="text-muted-foreground">
              Check back later for new learning materials
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const itemProgress = progress.get(item.id);
          return (
            <Card key={item.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  {itemProgress?.completed && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
                {item.description && (
                  <CardDescription className="line-clamp-2">
                    {item.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.age_group && (
                    <Badge variant="outline">{item.age_group}</Badge>
                  )}
                  {item.difficulty_level && (
                    <Badge variant="outline">{item.difficulty_level}</Badge>
                  )}
                  <Badge variant="outline">{item.content_type}</Badge>
                </div>

                {itemProgress && itemProgress.progress_percentage > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs text-muted-foreground">
                        {itemProgress.progress_percentage}%
                      </span>
                    </div>
                    <Progress value={itemProgress.progress_percentage} className="h-2" />
                  </div>
                )}

                <Button 
                  className="mt-auto" 
                  onClick={() => startOrContinueContent(item)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {itemProgress?.progress_percentage ? 'Continue' : 'Start Learning'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }
}
