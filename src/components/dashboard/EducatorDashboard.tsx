import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, BookOpen, Users, TrendingUp, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
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
  is_published: boolean;
  created_at: string;
}

interface StudentProgress {
  id: string;
  student_id: string;
  content_id: string;
  progress_percentage: number;
  completed: boolean;
  educational_content: {
    title: string;
  } | null;
}

export function EducatorDashboard() {
  const { user } = useAuth();
  const [content, setContent] = useState<EducationalContent[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<EducationalContent | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    content_type: 'text',
    age_group: '',
    difficulty_level: 'beginner',
    is_published: false,
  });

  useEffect(() => {
    fetchContent();
    fetchStudentProgress();
  }, [user?.id]);

  async function fetchContent() {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('educational_content')
        .select('*')
        .eq('educator_id', user.id)
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

  async function fetchStudentProgress() {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('student_progress')
        .select(`
          *,
          educational_content:content_id (title)
        `)
        .order('last_accessed_at', { ascending: false });

      if (error) throw error;
      setStudentProgress(data || []);
    } catch (error) {
      console.error('Error fetching student progress:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!user?.id) return;

    try {
      if (editingContent) {
        const { error } = await supabase
          .from('educational_content')
          .update({
            title: formData.title,
            description: formData.description || null,
            content: formData.content,
            content_type: formData.content_type,
            age_group: formData.age_group || null,
            difficulty_level: formData.difficulty_level,
            is_published: formData.is_published,
          })
          .eq('id', editingContent.id);

        if (error) throw error;
        toast.success('Content updated successfully');
      } else {
        const { error } = await supabase
          .from('educational_content')
          .insert({
            educator_id: user.id,
            title: formData.title,
            description: formData.description || null,
            content: formData.content,
            content_type: formData.content_type,
            age_group: formData.age_group || null,
            difficulty_level: formData.difficulty_level,
            is_published: formData.is_published,
          });

        if (error) throw error;
        toast.success('Content created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchContent();
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const { error } = await supabase
        .from('educational_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Content deleted successfully');
      fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  }

  async function togglePublish(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('educational_content')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(currentStatus ? 'Content unpublished' : 'Content published');
      fetchContent();
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Failed to update content');
    }
  }

  function resetForm() {
    setFormData({
      title: '',
      description: '',
      content: '',
      content_type: 'text',
      age_group: '',
      difficulty_level: 'beginner',
      is_published: false,
    });
    setEditingContent(null);
  }

  function openEditDialog(item: EducationalContent) {
    setEditingContent(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      content: item.content,
      content_type: item.content_type,
      age_group: item.age_group || '',
      difficulty_level: item.difficulty_level || 'beginner',
      is_published: item.is_published,
    });
    setIsDialogOpen(true);
  }

  const publishedCount = content.filter(c => c.is_published).length;
  const totalStudents = new Set(studentProgress.map(p => p.student_id)).size;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{content.length}</div>
            <p className="text-xs text-muted-foreground">
              {publishedCount} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Learning from your content
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentProgress.length > 0 
                ? Math.round(studentProgress.reduce((acc, p) => acc + p.progress_percentage, 0) / studentProgress.length)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all content
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <Tabs defaultValue="content" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="content">My Content</TabsTrigger>
            <TabsTrigger value="progress">Student Progress</TabsTrigger>
          </TabsList>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Content
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingContent ? 'Edit Content' : 'Create New Content'}</DialogTitle>
                <DialogDescription>
                  Create educational content for students to learn from
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter content title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the content"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Main educational content..."
                    rows={8}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="content_type">Content Type</Label>
                    <Select
                      value={formData.content_type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, content_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="interactive">Interactive</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age_group">Age Group</Label>
                    <Select
                      value={formData.age_group}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, age_group: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select age group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="6-8">6-8 years</SelectItem>
                        <SelectItem value="9-12">9-12 years</SelectItem>
                        <SelectItem value="13+">13+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={formData.difficulty_level}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty_level: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="publish"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                  />
                  <Label htmlFor="publish">Publish immediately</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingContent ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="content" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Loading content...</div>
          ) : content.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No content yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start creating educational content for your students
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Content
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {content.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        {item.description && (
                          <CardDescription className="mt-1">{item.description}</CardDescription>
                        )}
                      </div>
                      <Badge variant={item.is_published ? 'default' : 'secondary'}>
                        {item.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.age_group && (
                        <Badge variant="outline">{item.age_group}</Badge>
                      )}
                      {item.difficulty_level && (
                        <Badge variant="outline">{item.difficulty_level}</Badge>
                      )}
                      <Badge variant="outline">{item.content_type}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePublish(item.id, item.is_published)}
                      >
                        {item.is_published ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Publish
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(item)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Student Progress</CardTitle>
              <CardDescription>
                Track how students are engaging with your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {studentProgress.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No student progress data yet. Students will appear here once they start learning from your published content.
                </p>
              ) : (
                <div className="space-y-4">
                  {studentProgress.map((progress) => (
                    <div key={progress.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{progress.educational_content?.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Student ID: {progress.student_id.slice(0, 8)}...
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{progress.progress_percentage}%</p>
                        <Badge variant={progress.completed ? 'default' : 'secondary'}>
                          {progress.completed ? 'Completed' : 'In Progress'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
