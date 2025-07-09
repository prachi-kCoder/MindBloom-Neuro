import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Book as BookIcon, GamepadIcon, BookOpen, BookText, Star, GraduationCap, Brain, FileText, Calculator, ArrowRight, Users, Clock, Trophy } from 'lucide-react';
import LearningIntroduction from '@/components/learning/LearningIntroduction';
import useDyslexiaFont from '@/hooks/useDyslexiaFont';

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
      { id: "memory-match", name: "Memory Match", icon: "🧩", type: "game" },
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
      { id: "memory-match", name: "Memory Match", icon: "🧩", type: "game" },
      { id: "words", name: "First Words", icon: "📝", type: "activity" },
      { id: "coloring", name: "Coloring Fun", icon: "🎨", type: "activity" },
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
      { id: "word-building", name: "Word Building", icon: "📝", type: "game" },
      { id: "counting", name: "Counting Adventure", icon: "🔢", type: "activity" },
      { id: "memory-match", name: "Memory Match", icon: "🧩", type: "game" },
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
    icon: <Brain className="h-6 w-6 text-accent-foreground" />,
    color: "bg-accent",
    textColor: "text-accent-foreground",
    activities: [
      { id: "memory-maze", name: "Memory Maze", icon: "🧠", type: "game" },
      { id: "fractions", name: "Fraction Games", icon: "½", type: "game" },
      { id: "science-project", name: "Science Experiments", icon: "🧪", type: "activity" },
      { id: "word-match-safari", name: "Word Match Safari", icon: "🦁", type: "game" },
      { id: "synonym-island", name: "Synonym Island", icon: "🏝️", type: "game" },
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
      { id: "lexicon-league", name: "Lexicon League", icon: "📚", type: "game" },
      { id: "debates", name: "Debate Challenge", icon: "🎯", type: "activity" },
      { id: "research", name: "Research Quest", icon: "🔍", type: "game" },
      { id: "advanced-math", name: "Advanced Math", icon: "➗", type: "game" },
      { id: "antonym-mountain", name: "Antonym Mountain", icon: "🏔️", type: "game" },
    ]
  }
];

// Additional specialized activities for each disability type
const SPECIALIZED_ACTIVITIES = {
  dyslexia: [
    { id: "letter-compare", name: "Similar Letters", icon: "🔠", type: "activity", ageGroups: ["0-3", "3-4", "4-5"] },
    { id: "word-building", name: "Word Builder", icon: "📝", type: "game", ageGroups: ["4-5", "5-6", "6-8"] },
    { id: "memory-match", name: "Visual Memory Match", icon: "🧩", type: "game", ageGroups: ["0-3", "3-4", "4-5", "5-6"] },
    { id: "phonics-game", name: "Phonics Fun", icon: "🔊", type: "game", ageGroups: ["3-4", "4-5", "5-6"] },
    { id: "story-pictures", name: "Picture Stories", icon: "📚", type: "activity", ageGroups: ["6-8", "8-10"] },
    { id: "visual-memory", name: "Visual Memory", icon: "👁️", type: "game", ageGroups: ["4-5", "5-6", "6-8"] },
    { id: "memory-maze", name: "Memory Focus", icon: "🧠", type: "game", ageGroups: ["6-8", "8-10"] },
    { id: "lexicon-league", name: "Vocabulary Builder", icon: "📚", type: "game", ageGroups: ["8-10", "10-12"] },
    { id: "sound-match", name: "Sound Match", icon: "🎵", type: "game", ageGroups: ["8-10"] },
    { id: "word-detective", name: "Word Detective", icon: "🔍", type: "game", ageGroups: ["10-12"] },
    { id: "word-match-safari", name: "Synonym & Antonym Safari", icon: "🦁", type: "game", ageGroups: ["8-10"] },
    { id: "synonym-island", name: "Synonym Island Adventure", icon: "🏝️", type: "game", ageGroups: ["8-10"] },
    { id: "antonym-mountain", name: "Antonym Mountain Trek", icon: "🏔️", type: "game", ageGroups: ["10-12"] },
  ],
  adhd: [
    { id: "focus-game", name: "Focus Challenge", icon: "🎯", type: "game", ageGroups: ["4-5", "5-6", "6-8"] },
    { id: "memory-match", name: "Concentration Match", icon: "🧩", type: "game", ageGroups: ["0-3", "3-4", "4-5", "5-6"] },
    { id: "timer-activities", name: "Timer Tasks", icon: "⏱️", type: "activity", ageGroups: ["6-8", "8-10"] },
    { id: "memory-sequence", name: "Memory Sequence", icon: "🔢", type: "game", ageGroups: ["3-4", "4-5", "5-6"] },
    { id: "calming-activities", name: "Calm Down Corner", icon: "😌", type: "activity", ageGroups: ["0-3", "3-4", "4-5"] },
    { id: "movement-breaks", name: "Movement Breaks", icon: "🤸", type: "activity", ageGroups: ["5-6", "6-8", "8-10"] },
    { id: "memory-maze", name: "Focus Challenge", icon: "🧠", type: "game", ageGroups: ["6-8", "8-10"] },
    { id: "lexicon-league", name: "Word Power", icon: "📚", type: "game", ageGroups: ["8-10", "10-12"] },
    { id: "mind-vault", name: "Mind Vault", icon: "🔐", type: "game", ageGroups: ["10-12"] },
    { id: "word-match-safari", name: "Word Matching Challenge", icon: "🎯", type: "game", ageGroups: ["8-10"] },
    { id: "synonym-island", name: "Synonym Treasure Hunt", icon: "💎", type: "game", ageGroups: ["8-10"] },
    { id: "antonym-mountain", name: "Antonym Explorer", icon: "🧗‍♂️", type: "game", ageGroups: ["10-12"] },
  ],
  asd: [
    { id: "social-stories", name: "Social Stories", icon: "👥", type: "activity", ageGroups: ["3-4", "4-5", "5-6"] },
    { id: "memory-match", name: "Pattern Memory Match", icon: "🧩", type: "game", ageGroups: ["0-3", "3-4", "4-5", "5-6"] },
    { id: "emotion-cards", name: "Emotion Cards", icon: "😊", type: "game", ageGroups: ["4-5", "5-6", "6-8"] },
    { id: "sensory-activities", name: "Sensory Play", icon: "✋", type: "activity", ageGroups: ["0-3", "3-4"] },
    { id: "routine-builder", name: "Routine Builder", icon: "📅", type: "activity", ageGroups: ["6-8", "8-10"] },
    { id: "calm-space", name: "Calm Space", icon: "🧘", type: "activity", ageGroups: ["3-4", "4-5", "5-6"] },
    { id: "memory-maze", name: "Sequence Master", icon: "🧠", type: "game", ageGroups: ["6-8", "8-10"] },
    { id: "lexicon-league", name: "Word Categories", icon: "📚", type: "game", ageGroups: ["8-10", "10-12"] },
    { id: "code-clues", name: "Pattern Recognition", icon: "🧩", type: "game", ageGroups: ["10-12"] },
    { id: "word-match-safari", name: "Structured Word Match", icon: "🦓", type: "game", ageGroups: ["8-10"] },
    { id: "synonym-island", name: "Synonym Pattern Quest", icon: "🧩", type: "game", ageGroups: ["8-10"] },
    { id: "antonym-mountain", name: "Antonym Sequence Challenge", icon: "📋", type: "game", ageGroups: ["10-12"] },
  ]
};

// Math games for each age group
const MATH_GAMES = {
  "6-8": [
    { id: "fraction-feast", name: "Fraction Feast", description: "Help animals share food equally by dividing into parts", icon: "🍕", type: "game" },
    { id: "colorful-fractions", name: "Colorful Fractions", description: "Fill in shapes with the right number of parts", icon: "🎨", type: "game" },
    { id: "balloon-pop", name: "Balloon Pop Fractions", description: "Pop balloons with the correct fraction", icon: "🎈", type: "game" },
  ],
  "8-10": [
    { id: "fraction-galaxy", name: "Fraction Galaxy Mission", description: "Collect equivalent fractions to power your spaceship", icon: "🚀", type: "game" },
    { id: "pizza-puzzle", name: "Pizza Puzzle Mania", description: "Complete pizzas by combining fraction toppings", icon: "🍕", type: "game" },
    { id: "fraction-fair", name: "Fraction Fair", description: "Visualize fractions with bar graphs and pie charts", icon: "📊", type: "game" },
  ],
  "10-12": [
    { id: "function-machine", name: "Function Machine Lab", description: "Discover function rules by analyzing inputs and outputs", icon: "🧮", type: "game" },
    { id: "fraction-trail", name: "Fraction Trail Quest", description: "Navigate terrain by solving complex fraction problems", icon: "🏞️", type: "game" },
    { id: "graph-crafter", name: "Graph Crafter", description: "Build and interpret function graphs", icon: "📈", type: "game" },
  ]
};

const Learning = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize state from location if available
  const [showIntro, setShowIntro] = useState(() => {
    return location.state?.showIntro !== false;
  });
  
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(() => {
    return location.state?.ageGroup || "";
  });
  
  const [selectedDisability, setSelectedDisability] = useState(() => {
    return location.state?.disabilityType || "";
  });
  
  const { useDyslexicFont, setUseDyslexicFont } = useDyslexiaFont(
    location.state?.disabilityType === 'dyslexia'
  );
  
  const handleStartLearning = (ageGroup: string, disabilityType: string) => {
    setSelectedAgeGroup(ageGroup);
    setSelectedDisability(disabilityType);
    setShowIntro(false);
  };
  
  // Reset location state after using it
  useEffect(() => {
    if (location.state) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
  // Filter age groups to only show relevant ones based on selection
  const filteredAgeGroups = selectedAgeGroup 
    ? AGE_GROUPS.filter(group => group.id === selectedAgeGroup)
    : AGE_GROUPS;

  // Get specialized activities for the selected disability and age group
  const getSpecializedActivities = (ageGroupId: string) => {
    if (!selectedDisability) return [];
    
    return SPECIALIZED_ACTIVITIES[selectedDisability as keyof typeof SPECIALIZED_ACTIVITIES]
      .filter(activity => activity.ageGroups.includes(ageGroupId));
  };
  
  // Get math games for the specific age group
  const getMathGamesForAgeGroup = (ageGroupId: string) => {
    return MATH_GAMES[ageGroupId as keyof typeof MATH_GAMES] || [];
  };
  
  // Combine regular, specialized activities and math games
  const getCombinedActivities = (ageGroup: typeof AGE_GROUPS[0]) => {
    const specializedActivities = getSpecializedActivities(ageGroup.id);
    const mathGames = getMathGamesForAgeGroup(ageGroup.id);
    return [...ageGroup.activities, ...specializedActivities, ...mathGames];
  };
  
  // Toggle dyslexia font
  const toggleDyslexicFont = () => {
    setUseDyslexicFont(!useDyslexicFont);
  };

  const goToMaterials = () => {
    navigate('/learning/materials', { 
      state: { 
        disabilityType: selectedDisability,
        ageGroup: selectedAgeGroup,
        showIntro: false 
      } 
    });
  };

  return (
    <MainLayout>
      <div className="container px-4 py-8 md:py-12">
        {showIntro ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className={`text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                Welcome to Your Learning Journey
              </h1>
              <p className={`text-xl text-muted-foreground max-w-2xl mx-auto ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                Personalized learning experiences designed specifically for your child's unique needs and learning style
              </p>
            </div>
            <LearningIntroduction onStart={handleStartLearning} />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Header Section with Better Messaging */}
            <div className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 rounded-2xl p-8 border">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                    <Users className="h-4 w-4" />
                    {selectedDisability.charAt(0).toUpperCase() + selectedDisability.slice(1)} Support • Ages {selectedAgeGroup}
                  </div>
                  <h1 className={`text-3xl md:text-4xl font-bold tracking-tight mb-4 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                    Interactive Learning Center
                  </h1>
                  <p className={`text-lg text-muted-foreground mb-6 max-w-2xl ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                    Engaging, research-based activities designed specifically for {selectedDisability} learning support. Each activity adapts to your child's pace and provides positive reinforcement.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                        <Trophy className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="font-medium">Progress Tracking</div>
                        <div className="text-muted-foreground">Visual progress indicators</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
                        <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium">Adaptive Learning</div>
                        <div className="text-muted-foreground">Adjusts to learning pace</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-full">
                        <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <div className="font-medium">Self-Paced</div>
                        <div className="text-muted-foreground">Learn at your own speed</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Button variant="outline" onClick={toggleDyslexicFont} className="whitespace-nowrap">
                    {useDyslexicFont ? 'Standard Font' : 'Dyslexia-Friendly Font'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowIntro(true)}>
                    Change Age/Support Type
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                    <FileText className="h-5 w-5 text-primary" />
                    Upload Your Materials
                  </CardTitle>
                  <CardDescription className={useDyslexicFont ? 'font-dyslexic' : ''}>
                    Transform your documents into interactive learning experiences with text-to-speech and highlighting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={goToMaterials} className="w-full">
                    Start Learning with Your Materials
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="relative overflow-hidden bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                    <Calculator className="h-5 w-5 text-accent-foreground" />
                    Math Adventures
                  </CardTitle>
                  <CardDescription className={useDyslexicFont ? 'font-dyslexic' : ''}>
                    Interactive math games that make learning numbers fun and engaging
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" onClick={() => {
                    const mathTab = document.querySelector('[data-value="math"]') as HTMLButtonElement;
                    if (mathTab) mathTab.click();
                  }} className="w-full">
                    Explore Math Games
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <Tabs defaultValue="all" className="w-full">
                <div className="flex justify-center mb-8">
                  <TabsList className="grid grid-cols-4 w-full max-w-2xl h-12">
                    <TabsTrigger value="all" className={`${useDyslexicFont ? 'font-dyslexic' : ''} data-[state=active]:bg-primary data-[state=active]:text-primary-foreground`}>
                      All Activities
                    </TabsTrigger>
                    <TabsTrigger value="games" className={`${useDyslexicFont ? 'font-dyslexic' : ''} data-[state=active]:bg-primary data-[state=active]:text-primary-foreground`}>
                      Games
                    </TabsTrigger>
                    <TabsTrigger value="activities" className={`${useDyslexicFont ? 'font-dyslexic' : ''} data-[state=active]:bg-primary data-[state=active]:text-primary-foreground`}>
                      Learning
                    </TabsTrigger>
                    <TabsTrigger value="math" className={`${useDyslexicFont ? 'font-dyslexic' : ''} data-[state=active]:bg-primary data-[state=active]:text-primary-foreground`} data-value="math">
                      <Calculator className="h-4 w-4 mr-1" />
                      Math
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="all" className="space-y-8">
                  {filteredAgeGroups.map((group) => (
                    <AgeGroupSection 
                      key={group.id} 
                      group={group} 
                      specialActivities={getSpecializedActivities(group.id)}
                      mathGames={getMathGamesForAgeGroup(group.id)}
                      disabilityType={selectedDisability}
                      useDyslexicFont={useDyslexicFont}
                      onMaterialsClick={goToMaterials}
                    />
                  ))}
                </TabsContent>
                
                <TabsContent value="games" className="space-y-8">
                  {filteredAgeGroups.map((group) => (
                    <AgeGroupSection 
                      key={group.id} 
                      group={group} 
                      filterType="game"
                      specialActivities={getSpecializedActivities(group.id)}
                      mathGames={getMathGamesForAgeGroup(group.id)}
                      disabilityType={selectedDisability}
                      useDyslexicFont={useDyslexicFont}
                      onMaterialsClick={goToMaterials}
                    />
                  ))}
                </TabsContent>
                
                <TabsContent value="activities" className="space-y-8">
                  {filteredAgeGroups.map((group) => (
                    <AgeGroupSection 
                      key={group.id} 
                      group={group} 
                      filterType="activity"
                      specialActivities={getSpecializedActivities(group.id)}
                      mathGames={getMathGamesForAgeGroup(group.id)}
                      disabilityType={selectedDisability}
                      useDyslexicFont={useDyslexicFont}
                      onMaterialsClick={goToMaterials}
                    />
                  ))}
                </TabsContent>

                <TabsContent value="math" className="space-y-8">
                  {filteredAgeGroups.map((group) => (
                    <AgeGroupSection 
                      key={group.id} 
                      group={group} 
                      showMathOnly={true}
                      mathGames={getMathGamesForAgeGroup(group.id)}
                      disabilityType={selectedDisability}
                      useDyslexicFont={useDyslexicFont}
                      onMaterialsClick={goToMaterials}
                    />
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

interface AgeGroupSectionProps {
  group: typeof AGE_GROUPS[0];
  filterType?: string;
  specialActivities?: any[];
  mathGames?: any[];
  disabilityType?: string;
  useDyslexicFont?: boolean;
  showMathOnly?: boolean;
  onMaterialsClick?: () => void;
}

const AgeGroupSection = ({ 
  group, 
  filterType, 
  specialActivities = [],
  mathGames = [],
  disabilityType = '',
  useDyslexicFont = false,
  showMathOnly = false,
  onMaterialsClick
}: AgeGroupSectionProps) => {
  // If showing math only, just use math games
  let allActivities = showMathOnly 
    ? [...mathGames]
    : [...group.activities, ...specialActivities, ...mathGames];
  
  // Apply type filter if specified
  const activities = filterType 
    ? allActivities.filter(activity => activity.type === filterType)
    : allActivities;
  
  if (activities.length === 0) return null;
  
  // Get icon based on disability type
  const getDisabilityIcon = () => {
    switch(disabilityType) {
      case 'dyslexia':
        return <BookOpen className="h-4 w-4 text-soft-pink" />;
      case 'adhd':
        return <Star className="h-4 w-4 text-soft-blue" />;
      case 'asd':
        return <GraduationCap className="h-4 w-4 text-soft-purple" />;
      default:
        return null;
    }
  };

  // Check if this is a math game
  const isMathGame = (activityId: string) => {
    return ['fraction-feast', 'fraction-galaxy', 'function-machine', 'colorful-fractions', 
            'balloon-pop', 'pizza-puzzle', 'fraction-fair', 'fraction-trail', 'graph-crafter'].includes(activityId);
  };
  
  return (
    <section className="py-6" id={`age-${group.id}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${group.color}`}>
          {group.icon}
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${useDyslexicFont ? 'font-dyslexic' : ''}`}>{group.name}</h2>
          <p className={`text-sm text-muted-foreground ${useDyslexicFont ? 'font-dyslexic' : ''}`}>{group.label}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <p className={`text-muted-foreground max-w-3xl ${useDyslexicFont ? 'font-dyslexic' : ''}`}>{group.description}</p>
        
        {!showMathOnly && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onMaterialsClick}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            <span className={useDyslexicFont ? 'font-dyslexic' : ''}>
              Learn with Your Materials
            </span>
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {activities.map((activity) => (
          <Card 
            key={activity.id} 
            className="overflow-hidden transition-all duration-200 hover:shadow-md bg-white/90 border border-gray-100"
          >
            <CardHeader className={`${isMathGame(activity.id) ? 'bg-soft-blue/30' : group.color} bg-opacity-30 pb-4`}>
              <div className="flex justify-between items-center">
                <CardTitle className={`text-xl flex items-center gap-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                  <span className="text-2xl">{activity.icon}</span>
                  {activity.name}
                </CardTitle>
                <div className="px-2 py-1 text-xs rounded-full bg-background/80 flex items-center gap-1">
                  {isMathGame(activity.id) ? 'Math Game' : activity.type === 'game' ? 'Game' : 'Activity'}
                  {specialActivities.includes(activity) && getDisabilityIcon()}
                </div>
              </div>
              {activity.description && (
                <CardDescription className={`mt-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                  {activity.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="pt-4 bg-gradient-to-b from-transparent to-gray-50/30">
              <div className="flex justify-end">
                <Button asChild className="bg-primary/90 hover:bg-primary shadow-sm">
                  <Link 
                    to={`/learning/${group.id}/${activity.id}`}
                    state={{ disabilityType: disabilityType }}
                  >
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
