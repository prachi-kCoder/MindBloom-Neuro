import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, BookOpen, Clock, CheckCircle2, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  modules: number;
  category: string;
  completed: number;
  badge?: string;
}

const courses: Course[] = [
  { id: '1', title: 'Understanding ADHD in the Classroom', description: 'Strategies for supporting learners with ADHD through structured routines, movement breaks, and positive reinforcement.', duration: '2 hours', modules: 6, category: 'ADHD', completed: 0, badge: '🧠 ADHD Ally' },
  { id: '2', title: 'Dyslexia-Friendly Teaching Methods', description: 'Master multisensory reading techniques, phonological awareness activities, and assistive technology integration.', duration: '3 hours', modules: 8, category: 'Dyslexia', completed: 0, badge: '📖 Literacy Champion' },
  { id: '3', title: 'Creating Autism-Inclusive Environments', description: 'Design sensory-friendly spaces, implement visual supports, and build social skills programs.', duration: '2.5 hours', modules: 7, category: 'ASD', completed: 0, badge: '🌈 Inclusion Advocate' },
  { id: '4', title: 'Universal Design for Learning (UDL)', description: 'Apply UDL framework to create flexible learning experiences that reach all students.', duration: '1.5 hours', modules: 5, category: 'General', completed: 0, badge: '⭐ UDL Expert' },
  { id: '5', title: 'Assistive Technology Integration', description: 'Learn to implement text-to-speech, speech-to-text, and other assistive tools in daily lessons.', duration: '2 hours', modules: 6, category: 'Technology', completed: 0, badge: '💻 Tech Pioneer' },
  { id: '6', title: 'Behavior Support Strategies', description: 'Positive behavior interventions, de-escalation techniques, and creating behavior support plans.', duration: '2 hours', modules: 6, category: 'Behavior', completed: 0, badge: '🤝 Behavior Specialist' },
];

export function ProfessionalDevelopment() {
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>({});
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  const startCourse = (course: Course) => {
    setCourseProgress(prev => ({ ...prev, [course.id]: (prev[course.id] || 0) + 1 }));
    const newProgress = (courseProgress[course.id] || 0) + 1;
    if (newProgress >= course.modules && course.badge && !earnedBadges.includes(course.badge)) {
      setEarnedBadges(prev => [...prev, course.badge!]);
      toast.success(`🎉 Badge earned: ${course.badge}`);
    } else {
      toast.success(`Module ${newProgress}/${course.modules} completed!`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Professional Development</h1>
        <p className="text-muted-foreground">Micro-courses and workshops on inclusive pedagogy for neurodiverse education</p>
      </div>

      {earnedBadges.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5 text-primary" />
              Your Certification Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {earnedBadges.map(b => (
                <Badge key={b} className="text-sm py-1 px-3">{b}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map(course => {
          const progress = courseProgress[course.id] || 0;
          const pct = Math.round((progress / course.modules) * 100);
          const isComplete = progress >= course.modules;

          return (
            <Card key={course.id} className={isComplete ? 'border-primary/30' : ''}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline">{course.category}</Badge>
                  {isComplete && <CheckCircle2 className="h-5 w-5 text-primary" />}
                </div>
                <CardTitle className="text-base mt-2">{course.title}</CardTitle>
                <CardDescription className="text-xs">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {course.duration}
                  <span>·</span>
                  <BookOpen className="h-3 w-3" /> {course.modules} modules
                </div>
                <Progress value={pct} className="h-2" />
                <p className="text-xs text-muted-foreground">{progress}/{course.modules} modules completed</p>
                <Button size="sm" className="w-full" disabled={isComplete} onClick={() => startCourse(course)}>
                  {isComplete ? 'Completed ✓' : progress > 0 ? 'Continue Learning' : 'Start Course'}
                </Button>
                {course.badge && (
                  <p className="text-xs text-center text-muted-foreground">Badge: {course.badge}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
