import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Star, BookText, GamepadIcon, Brain, GraduationCap, ArrowRight, Calculator } from 'lucide-react';
import LearningIntroduction from '@/components/learning/LearningIntroduction';
import useDyslexiaFont from '@/hooks/useDyslexiaFont';

const AGE_GROUPS = [
  { id: "0-3", name: "0–3 Years", label: "Infant/Toddler", description: "Sensory stimulation, basic motor skills, and early alphabet recognition", icon: <Star className="h-6 w-6" />, activities: [
    { id: "alphabet", name: "Alphabet Recognition", icon: "ABC", type: "game" },
    { id: "coloring", name: "Coloring Fun", icon: "🎨", type: "activity" },
    { id: "memory-match", name: "Memory Match", icon: "🧩", type: "game" },
    { id: "sounds", name: "Animal Sounds", icon: "🐶", type: "game" },
  ]},
  { id: "3-4", name: "3–4 Years", label: "Pre-Nursery", description: "Language, colors, shapes, and word play", icon: <BookText className="h-6 w-6" />, activities: [
    { id: "shapes", name: "Shape Matching", icon: "⚪", type: "game" },
    { id: "memory-match", name: "Memory Match", icon: "🧩", type: "game" },
    { id: "words", name: "First Words", icon: "📝", type: "activity" },
    { id: "coloring", name: "Coloring Fun", icon: "🎨", type: "activity" },
  ]},
  { id: "4-5", name: "4–5 Years", label: "Nursery", description: "Early literacy, numeracy, and social skills", icon: <BookOpen className="h-6 w-6" />, activities: [
    { id: "phonics", name: "Phonics Fun", icon: "🔤", type: "game" },
    { id: "word-building", name: "Word Building", icon: "📝", type: "game" },
    { id: "memory-match", name: "Memory Match", icon: "🧩", type: "game" },
  ]},
  { id: "5-6", name: "5–6 Years", label: "Kindergarten", description: "Foundational reading, math, and science", icon: <GraduationCap className="h-6 w-6" />, activities: [
    { id: "reading", name: "Reading Practice", icon: "📖", type: "activity" },
    { id: "math", name: "Math Puzzles", icon: "🧩", type: "game" },
  ]},
  { id: "6-8", name: "6–8 Years", label: "Early Primary", description: "Reading, writing, and environment", icon: <GamepadIcon className="h-6 w-6" />, activities: [
    { id: "multiplication", name: "Multiplication Bingo", icon: "✖️", type: "game" },
    { id: "logic", name: "Logic Puzzles", icon: "🧠", type: "game" },
    { id: "fraction-feast", name: "Fraction Feast", icon: "🍕", type: "game" },
  ]},
  { id: "8-10", name: "8–10 Years", label: "Middle Primary", description: "Comprehension, advanced math, and creativity", icon: <Brain className="h-6 w-6" />, activities: [
    { id: "memory-maze", name: "Memory Maze", icon: "🧠", type: "game" },
    { id: "fraction-galaxy", name: "Fraction Galaxy", icon: "🚀", type: "game" },
    { id: "word-match-safari", name: "Word Match Safari", icon: "🦁", type: "game" },
    { id: "synonym-island", name: "Synonym Island", icon: "🏝️", type: "game" },
  ]},
  { id: "10-12", name: "10–12 Years", label: "Upper Primary", description: "Critical thinking, research, and leadership", icon: <Calculator className="h-6 w-6" />, activities: [
    { id: "lexicon-league", name: "Lexicon League", icon: "📚", type: "game" },
    { id: "function-machine", name: "Function Machine", icon: "🧮", type: "game" },
    { id: "antonym-mountain", name: "Antonym Mountain", icon: "🏔️", type: "game" },
  ]},
];

export function LearnerLessons() {
  const navigate = useNavigate();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('');
  const [selectedDisability, setSelectedDisability] = useState<string>('');
  const [showIntro, setShowIntro] = useState(true);
  const { useDyslexicFont } = useDyslexiaFont(selectedDisability === 'dyslexia');

  const handleStartLearning = (ageGroup: string, disabilityType: string) => {
    setSelectedAgeGroup(ageGroup);
    setSelectedDisability(disabilityType);
    setShowIntro(false);
  };

  const goToActivity = (ageGroupId: string, activityId: string) => {
    navigate(`/learning/${ageGroupId}/${activityId}`, {
      state: { disabilityType: selectedDisability, ageGroup: ageGroupId, showIntro: false }
    });
  };

  if (showIntro) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className={`text-2xl font-bold mb-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>My Learning Paths</h2>
          <p className="text-muted-foreground">Choose your age group and support type to get started</p>
        </div>
        <LearningIntroduction onStart={handleStartLearning} />
      </div>
    );
  }

  const filteredGroups = selectedAgeGroup
    ? AGE_GROUPS.filter(g => g.id === selectedAgeGroup)
    : AGE_GROUPS;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold mb-1 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>My Learning Paths</h2>
          <p className="text-muted-foreground">
            {selectedDisability.charAt(0).toUpperCase() + selectedDisability.slice(1)} Support • Ages {selectedAgeGroup}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowIntro(true)}>
          Change Selection
        </Button>
      </div>

      {filteredGroups.map(group => (
        <Card key={group.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {group.icon}
              {group.name} — {group.label}
            </CardTitle>
            <CardDescription>{group.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.activities.map(activity => (
                <Button
                  key={activity.id}
                  variant="outline"
                  className="h-auto py-3 px-4 justify-start gap-3"
                  onClick={() => goToActivity(group.id, activity.id)}
                >
                  <span className="text-xl">{activity.icon}</span>
                  <div className="text-left">
                    <div className="font-medium">{activity.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{activity.type}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
