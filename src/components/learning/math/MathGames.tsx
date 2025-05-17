
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { speak, stopSpeaking } from '@/utils/textToSpeech';
import useDyslexiaFont from '@/hooks/useDyslexiaFont';
import FractionFeast from './FractionFeast';
import FractionGalaxy from './FractionGalaxy';
import FunctionMachine from './FunctionMachine';

interface MathGamesProps {
  ageGroup?: string;
}

const MathGames: React.FC<MathGamesProps> = ({ ageGroup = '6-8' }) => {
  const navigate = useNavigate();
  const { useDyslexicFont } = useDyslexiaFont();
  const [activeTab, setActiveTab] = useState<string>("introduction");
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [completedGames, setCompletedGames] = useState<string[]>([]);
  
  useEffect(() => {
    // Introduction speech when component mounts
    if (activeTab === "introduction") {
      const intro = `Welcome to Math Games for ages ${ageGroup}! Choose a fun math game to play and learn.`;
      speak(intro);
    }
    
    return () => {
      stopSpeaking();
    };
  }, [ageGroup, activeTab]);
  
  const handleGameComplete = (game: string, score: number) => {
    toast.success(`Great job! You earned ${score} stars!`);
    setCompletedGames(prev => prev.includes(game) ? prev : [...prev, game]);
    
    // Return to game selection after a short delay
    setTimeout(() => {
      setSelectedGame(null);
      setActiveTab("games");
      speak("Well done! Choose another game to play.");
    }, 2000);
  };
  
  const getAgeAppropriateGames = () => {
    switch (ageGroup) {
      case '6-8':
        return [
          { id: 'fraction-feast', name: 'Fraction Feast', description: 'Divide food into equal parts to learn about fractions', icon: '🍕' },
          // In a real app, we would have more games for this age group
        ];
      case '8-10':
        return [
          { id: 'fraction-galaxy', name: 'Fraction Galaxy Mission', description: 'Find equivalent fractions to fuel your spaceship', icon: '🚀' },
          // In a real app, we would have more games for this age group
        ];
      case '10-12':
      default:
        return [
          { id: 'function-machine', name: 'Function Machine Lab', description: 'Discover function rules and solve input-output puzzles', icon: '🧮' },
          // In a real app, we would have more games for this age group
        ];
    }
  };
  
  const renderSelectedGame = () => {
    switch (selectedGame) {
      case 'fraction-feast':
        return <FractionFeast onComplete={(score) => handleGameComplete('fraction-feast', score)} />;
      case 'fraction-galaxy':
        return <FractionGalaxy onComplete={(score) => handleGameComplete('fraction-galaxy', score)} />;
      case 'function-machine':
        return <FunctionMachine onComplete={(score) => handleGameComplete('function-machine', score)} />;
      default:
        return null;
    }
  };
  
  const games = getAgeAppropriateGames();
  
  if (selectedGame) {
    return (
      <div className="container px-4 py-6">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => {
            setSelectedGame(null);
            setActiveTab("games");
          }}
        >
          ← Back to Games
        </Button>
        
        {renderSelectedGame()}
      </div>
    );
  }
  
  return (
    <div className="container px-4 py-6">
      <h1 className={`text-3xl font-bold mb-4 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
        Math Games for Ages {ageGroup}
      </h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-8">
          <TabsTrigger value="introduction" className={useDyslexicFont ? 'font-dyslexic' : ''}>
            Introduction
          </TabsTrigger>
          <TabsTrigger value="games" className={useDyslexicFont ? 'font-dyslexic' : ''}>
            Games
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="introduction" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className={`space-y-4 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                <h2 className="text-2xl font-bold">Welcome to Math Games!</h2>
                
                <p>
                  Math is all around us and can be lots of fun to learn! These games will help you 
                  understand important math concepts through play.
                </p>
                
                {ageGroup === '6-8' && (
                  <div>
                    <h3 className="text-xl font-medium mt-4 mb-2">In these games you'll learn about:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Fractions and how to divide things into equal parts</li>
                      <li>Simple shapes and patterns</li>
                      <li>Counting and comparing numbers</li>
                    </ul>
                  </div>
                )}
                
                {ageGroup === '8-10' && (
                  <div>
                    <h3 className="text-xl font-medium mt-4 mb-2">In these games you'll learn about:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Comparing fractions and finding equivalent fractions</li>
                      <li>Adding and subtracting fractions</li>
                      <li>Visual fraction models and representations</li>
                    </ul>
                  </div>
                )}
                
                {ageGroup === '10-12' && (
                  <div>
                    <h3 className="text-xl font-medium mt-4 mb-2">In these games you'll learn about:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Functions and how they transform numbers</li>
                      <li>Advanced fraction operations</li>
                      <li>Mathematical patterns and relationships</li>
                    </ul>
                  </div>
                )}
                
                <div className="mt-6">
                  <Button 
                    onClick={() => setActiveTab("games")}
                    size="lg"
                  >
                    Let's Play!
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="games" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map(game => (
              <Card 
                key={game.id} 
                className={`hover:shadow-lg transition-shadow cursor-pointer ${
                  completedGames.includes(game.id) ? 'border-green-400' : ''
                }`}
                onClick={() => {
                  speak(`Starting ${game.name}`);
                  setSelectedGame(game.id);
                }}
              >
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{game.icon}</div>
                  <h3 className={`text-xl font-bold mb-2 ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                    {game.name}
                    {completedGames.includes(game.id) && " ✓"}
                  </h3>
                  <p className={`text-muted-foreground ${useDyslexicFont ? 'font-dyslexic' : ''}`}>
                    {game.description}
                  </p>
                  <Button className="w-full mt-4">
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MathGames;
