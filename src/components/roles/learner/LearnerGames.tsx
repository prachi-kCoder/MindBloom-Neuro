import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, ArrowRight } from 'lucide-react';

const GAME_CATEGORIES = [
  {
    title: 'Language & Literacy Games',
    games: [
      { id: 'memory-match', name: 'Memory Match', icon: '🧩', ageGroup: '0-3', description: 'Match pairs to improve memory' },
      { id: 'word-building', name: 'Word Building', icon: '📝', ageGroup: '4-5', description: 'Build words letter by letter' },
      { id: 'word-match-safari', name: 'Word Match Safari', icon: '🦁', ageGroup: '8-10', description: 'Match synonyms and antonyms' },
      { id: 'synonym-island', name: 'Synonym Island', icon: '🏝️', ageGroup: '8-10', description: 'Find synonyms on the island' },
      { id: 'antonym-mountain', name: 'Antonym Mountain', icon: '🏔️', ageGroup: '10-12', description: 'Climb by finding antonyms' },
      { id: 'lexicon-league', name: 'Lexicon League', icon: '📚', ageGroup: '10-12', description: 'Vocabulary challenge' },
    ],
  },
  {
    title: 'Math Games',
    games: [
      { id: 'fraction-feast', name: 'Fraction Feast', icon: '🍕', ageGroup: '6-8', description: 'Learn fractions with food' },
      { id: 'fraction-galaxy', name: 'Fraction Galaxy', icon: '🚀', ageGroup: '8-10', description: 'Equivalent fractions in space' },
      { id: 'function-machine', name: 'Function Machine', icon: '🧮', ageGroup: '10-12', description: 'Discover function rules' },
    ],
  },
  {
    title: 'Memory & Focus Games',
    games: [
      { id: 'memory-maze', name: 'Memory Maze', icon: '🧠', ageGroup: '8-10', description: 'Navigate the maze from memory' },
      { id: 'alphabet', name: 'Alphabet Recognition', icon: 'ABC', ageGroup: '0-3', description: 'Learn letters with images' },
      { id: 'coloring', name: 'Coloring Fun', icon: '🎨', ageGroup: '0-3', description: 'Color within and outside the lines' },
    ],
  },
];

export function LearnerGames() {
  const navigate = useNavigate();

  const goToGame = (ageGroup: string, gameId: string) => {
    navigate(`/learning/${ageGroup}/${gameId}`, {
      state: { disabilityType: 'dyslexia', ageGroup, showIntro: false },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Learning Games</h2>
        <p className="text-muted-foreground">Fun, interactive games to build skills while playing</p>
      </div>

      {GAME_CATEGORIES.map(category => (
        <Card key={category.title}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5" />
              {category.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {category.games.map(game => (
                <Button
                  key={`${game.ageGroup}-${game.id}`}
                  variant="outline"
                  className="h-auto py-4 px-4 justify-start gap-3"
                  onClick={() => goToGame(game.ageGroup, game.id)}
                >
                  <span className="text-2xl">{game.icon}</span>
                  <div className="text-left flex-1">
                    <div className="font-medium">{game.name}</div>
                    <div className="text-xs text-muted-foreground">{game.description}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">{game.ageGroup}y</Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
