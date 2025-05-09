
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, GamepadIcon, BookOpen, BookText, Star } from 'lucide-react';

const AGE_GROUPS = [
  {
    id: "0-3",
    name: "0–3 Years",
    label: "Infant/Toddler",
    description: "Sensory stimulation, basic motor skills, and early alphabet recognition",
    icon: <Star className="h-6 w-6 text-soft-peach" />,
    color: "bg-soft-peach",
    textColor: "text-soft-peach",
    activities: [
      { id: "alphabet", name: "Alphabet Recognition", icon: "ABC", type: "game" },
      { id: "coloring", name: "Coloring Fun", icon: "🎨", type: "activity" },
      { id: "sounds", name: "Animal Sounds", icon: "🐶", type: "game" },
    ]
  },
  {
    id: "3-4",
    name: "3–4 Years",
    label: "Pre-Nursery",
    description: "Introduction to language, colors, shapes, and word play games",
    icon: <BookText className="h-6 w-6 text-soft-pink" />,
    color: "bg-soft-pink",
    textColor: "text-soft-pink",
    activities: [
      { id: "shapes", name: "Shape Matching", icon: "⚪", type: "game" },
      { id: "words", name: "First Words", icon: "📝", type: "activity" },
      { id: "sorting", name: "Color Sorting", icon: "🌈", type: "game" },
    ]
  },
  {
    id: "4-5",
    name: "4–5 Years",
    label: "Nursery",
    description: "Early literacy, numeracy, social skills, and emotional awareness",
    icon: <BookOpen className="h-6 w-6 text-soft-blue" />,
    color: "bg-soft-blue",
    textColor: "text-soft-blue",
    activities: [
      { id: "phonics", name: "Phonics Fun", icon: "🔤", type: "game" },
      { id: "counting", name: "Counting Adventure", icon: "🔢", type: "activity" },
      { id: "stories", name: "Story Time", icon: "📚", type: "activity" },
    ]
  },
  {
    id: "5-6",
    name: "5–6 Years",
    label: "Kindergarten",
    description: "Foundational reading, math, drawing, and basic science",
    icon: <Book className="h-6 w-6 text-soft-purple" />,
    color: "bg-soft-purple",
    textColor: "text-soft-purple",
    activities: [
      { id: "reading", name: "Reading Practice", icon: "📖", type: "activity" },
      { id: "math", name: "Math Puzzles", icon: "🧩", type: "game" },
      { id: "science", name: "Nature Explorer", icon: "🌱", type: "activity" },
    ]
  },
  {
    id: "6-8",
    name: "6–8 Years",
    label: "Early Primary",
    description: "Reading simple books, basic writing, and understanding the environment",
    icon: <GamepadIcon className="h-6 w-6 text-primary" />,
    color: "bg-primary/20",
    textColor: "text-primary",
    activities: [
      { id: "multiplication", name: "Multiplication Bingo", icon: "✖️", type: "game" },
      { id: "logic", name: "Logic Puzzles", icon: "🧠", type: "game" },
      { id: "writing", name: "Creative Writing", icon: "✏️", type: "activity" },
    ]
  },
  {
    id: "8-10",
    name: "8–10 Years",
    label: "Middle Primary",
    description: "Reading comprehension, advanced math, science experiments, and creativity",
    icon: <GamepadIcon className="h-6 w-6 text-accent-foreground" />,
    color: "bg-accent",
    textColor: "text-accent-foreground",
    activities: [
      { id: "fractions", name: "Fraction Games", icon: "½", type: "game" },
      { id: "science-project", name: "Science Experiments", icon: "🧪", type: "activity" },
      { id: "storytelling", name: "Interactive Stories", icon: "📝", type: "game" },
    ]
  },
  {
    id: "10-12",
    name: "10–12 Years",
    label: "Upper Primary",
    description: "Critical thinking, essay writing, research skills, and leadership",
    icon: <GamepadIcon className="h-6 w-6 text-destructive" />,
    color: "bg-destructive/20",
    textColor: "text-destructive",
    activities: [
      { id: "debates", name: "Debate Challenge", icon: "🎯", type: "activity" },
      { id: "research", name: "Research Quest", icon: "🔍", type: "game" },
      { id: "advanced-math", name: "Advanced Math", icon: "➗", type: "game" },
    ]
  }
];

const Learning = () => {
  return (
    <MainLayout>
      <div className="container px-4 py-8 md:py-12">
        <div className="flex flex-col gap-6">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Interactive Learning Center</h1>
            <p className="text-lg text-muted-foreground">
              Engaging, age-appropriate activities to foster growth and development for children with neurodevelopmental needs
            </p>
          </div>

          <div className="mb-10">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full max-w-lg">
                  <TabsTrigger value="all">All Ages</TabsTrigger>
                  <TabsTrigger value="games">Games</TabsTrigger>
                  <TabsTrigger value="activities">Activities</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="space-y-8">
                {AGE_GROUPS.map((group) => (
                  <AgeGroupSection key={group.id} group={group} />
                ))}
              </TabsContent>
              
              <TabsContent value="games" className="space-y-8">
                {AGE_GROUPS.map((group) => (
                  <AgeGroupSection 
                    key={group.id} 
                    group={group} 
                    filterType="game"
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="activities" className="space-y-8">
                {AGE_GROUPS.map((group) => (
                  <AgeGroupSection 
                    key={group.id} 
                    group={group} 
                    filterType="activity"
                  />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

interface AgeGroupSectionProps {
  group: typeof AGE_GROUPS[0];
  filterType?: string;
}

const AgeGroupSection = ({ group, filterType }: AgeGroupSectionProps) => {
  const activities = filterType 
    ? group.activities.filter(activity => activity.type === filterType)
    : group.activities;
  
  if (activities.length === 0) return null;
  
  return (
    <section className="py-6" id={`age-${group.id}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${group.color}`}>
          {group.icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{group.name}</h2>
          <p className="text-sm text-muted-foreground">{group.label}</p>
        </div>
      </div>
      
      <p className="mb-6 text-muted-foreground max-w-3xl">{group.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {activities.map((activity) => (
          <Card key={activity.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
            <CardHeader className={`${group.color} bg-opacity-30 pb-4`}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center gap-2">
                  <span className="text-2xl">{activity.icon}</span>
                  {activity.name}
                </CardTitle>
                <div className="px-2 py-1 text-xs rounded-full bg-background">
                  {activity.type === 'game' ? 'Game' : 'Activity'}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-end">
                <Button asChild>
                  <Link to={`/learning/${group.id}/${activity.id}`}>
                    Start
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Learning;
