
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Book, CheckCircle, GraduationCap, BookOpen, Star } from 'lucide-react';

interface LexiconLeagueGameProps {
  onProgress: (progress: number) => void;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  ageGroup: string;
  disabilityType?: string;
}

interface WordCard {
  id: string;
  word: string;
  definition: string;
  synonyms: string[];
  antonyms: string[];
  usageExample: string;
  difficulty: number;
}

interface Monster {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  imageUrl: string;
  weaknesses: ('synonym' | 'antonym' | 'definition')[];
  defeated: boolean;
}

const LexiconLeagueGame: React.FC<LexiconLeagueGameProps> = ({
  onProgress,
  currentStep,
  setCurrentStep,
  ageGroup,
  disabilityType = "dyslexia"
}) => {
  const { toast } = useToast();
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [wordCards, setWordCards] = useState<WordCard[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedCards, setSelectedCards] = useState<WordCard[]>([]);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [currentMonsterIndex, setCurrentMonsterIndex] = useState(0);
  const [gamePhase, setGamePhase] = useState<'learning' | 'battle'>('learning');
  const [wordLearned, setWordLearned] = useState(false);
  const [answerType, setAnswerType] = useState<'synonym' | 'antonym' | 'definition' | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(-1);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [wordsCompleted, setWordsCompleted] = useState(0);

  // Initialize the game with words and monsters
  useEffect(() => {
    initializeGame();
  }, [level]);

  // Update progress
  useEffect(() => {
    const progressPercentage = Math.min((wordsCompleted / 5) * 100, 100);
    onProgress(progressPercentage);
  }, [wordsCompleted, onProgress]);

  const initializeGame = () => {
    // Initialize with grade-appropriate vocabulary
    const wordList: WordCard[] = [
      {
        id: 'word1',
        word: 'Ambitious',
        definition: 'Having a strong desire to succeed or achieve something',
        synonyms: ['Determined', 'Aspiring', 'Motivated'],
        antonyms: ['Unambitious', 'Lazy', 'Apathetic'],
        usageExample: 'She is very ambitious and wants to become a doctor someday.',
        difficulty: 1
      },
      {
        id: 'word2',
        word: 'Enormous',
        definition: 'Very large in size, quantity, or extent',
        synonyms: ['Huge', 'Gigantic', 'Massive'],
        antonyms: ['Tiny', 'Small', 'Minuscule'],
        usageExample: 'The elephant is an enormous animal.',
        difficulty: 1
      },
      {
        id: 'word3',
        word: 'Hesitate',
        definition: 'To pause before doing something, especially through uncertainty',
        synonyms: ['Pause', 'Delay', 'Waver'],
        antonyms: ['Rush', 'Proceed', 'Continue'],
        usageExample: 'Don\'t hesitate to ask questions if you don\'t understand.',
        difficulty: 2
      },
      {
        id: 'word4',
        word: 'Peculiar',
        definition: 'Strange or unusual, particularly in an interesting or appealing way',
        synonyms: ['Unusual', 'Strange', 'Odd'],
        antonyms: ['Normal', 'Common', 'Ordinary'],
        usageExample: 'The house had a peculiar smell that I couldn\'t identify.',
        difficulty: 2
      },
      {
        id: 'word5',
        word: 'Persevere',
        definition: 'To continue doing something despite difficulties or delay in achieving success',
        synonyms: ['Persist', 'Endure', 'Continue'],
        antonyms: ['Quit', 'Surrender', 'Abandon'],
        usageExample: 'If you persevere with your studies, you will succeed.',
        difficulty: 3
      }
    ];

    // Create monster challenges
    const monsterList: Monster[] = [
      {
        id: 'monster1',
        name: 'Vocablosaurus',
        health: 100,
        maxHealth: 100,
        imageUrl: 'https://placekitten.com/200/200', // Placeholder
        weaknesses: ['synonym', 'definition'],
        defeated: false
      },
      {
        id: 'monster2',
        name: 'Word Wizard',
        health: 120,
        maxHealth: 120,
        imageUrl: 'https://placekitten.com/201/201', // Placeholder
        weaknesses: ['antonym', 'definition'],
        defeated: false
      },
      {
        id: 'monster3',
        name: 'Grammar Goblin',
        health: 150,
        maxHealth: 150,
        imageUrl: 'https://placekitten.com/202/202', // Placeholder
        weaknesses: ['synonym', 'antonym', 'definition'],
        defeated: false
      }
    ];

    setWordCards(wordList);
    setMonsters(monsterList);
    setCurrentWordIndex(0);
    setCurrentMonsterIndex(0);
    setGamePhase('learning');
    setWordLearned(false);
    setWordsCompleted(0);
  };

  const handleWordLearned = () => {
    setWordLearned(true);
    
    toast({
      title: "Word Added to Vocabulary!",
      description: `You've learned the word "${wordCards[currentWordIndex].word}"`,
      variant: "default",
    });

    // Add the word to selected cards
    setSelectedCards(prev => [...prev, wordCards[currentWordIndex]]);
  };

  const startBattle = () => {
    setGamePhase('battle');
    generateQuestion();
  };

  const generateQuestion = () => {
    const currentWord = wordCards[currentWordIndex];
    const currentMonster = monsters[currentMonsterIndex];
    
    // Choose a question type based on monster weaknesses
    const questionTypes = currentMonster.weaknesses;
    const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)] as 'synonym' | 'antonym' | 'definition';
    setAnswerType(randomType);
    
    let correctAnswer = '';
    let options: string[] = [];
    
    if (randomType === 'synonym') {
      // Generate synonym question
      correctAnswer = currentWord.synonyms[Math.floor(Math.random() * currentWord.synonyms.length)];
      options = [correctAnswer];
      
      // Add incorrect options (other words' synonyms)
      const otherWords = wordCards.filter(word => word.id !== currentWord.id);
      while (options.length < 4) {
        const randomWord = otherWords[Math.floor(Math.random() * otherWords.length)];
        const randomSynonym = randomWord.synonyms[Math.floor(Math.random() * randomWord.synonyms.length)];
        
        if (!options.includes(randomSynonym)) {
          options.push(randomSynonym);
        }
      }
    } else if (randomType === 'antonym') {
      // Generate antonym question
      correctAnswer = currentWord.antonyms[Math.floor(Math.random() * currentWord.antonyms.length)];
      options = [correctAnswer];
      
      // Add incorrect options (other words' antonyms)
      const otherWords = wordCards.filter(word => word.id !== currentWord.id);
      while (options.length < 4) {
        const randomWord = otherWords[Math.floor(Math.random() * otherWords.length)];
        const randomAntonym = randomWord.antonyms[Math.floor(Math.random() * randomWord.antonyms.length)];
        
        if (!options.includes(randomAntonym)) {
          options.push(randomAntonym);
        }
      }
    } else {
      // Generate definition question
      correctAnswer = currentWord.definition;
      options = [correctAnswer];
      
      // Add incorrect options (other words' definitions)
      const otherWords = wordCards.filter(word => word.id !== currentWord.id);
      for (const word of otherWords.slice(0, 3)) {
        options.push(word.definition);
      }
    }
    
    // Shuffle options
    options = options.sort(() => Math.random() - 0.5);
    
    setAnswers(options);
    setCorrectAnswerIndex(options.indexOf(correctAnswer));
    setHasAnswered(false);
    setShowHint(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (hasAnswered) return;
    
    setHasAnswered(true);
    const isCorrect = answerIndex === correctAnswerIndex;
    
    if (isCorrect) {
      // Deal damage to monster
      const damageAmount = 40;  // Base damage
      
      setMonsters(prev => {
        const updatedMonsters = [...prev];
        const monster = updatedMonsters[currentMonsterIndex];
        monster.health = Math.max(0, monster.health - damageAmount);
        
        // Check if monster is defeated
        if (monster.health <= 0) {
          monster.defeated = true;
          
          toast({
            title: "Monster Defeated!",
            description: `You've defeated the ${monster.name}!`,
            variant: "default",
          });
          
          setScore(prev => prev + 50);  // Bonus for defeating monster
        }
        
        return updatedMonsters;
      });
      
      setScore(prev => prev + 10);
      
      toast({
        title: "Correct!",
        description: "Great job! You dealt damage to the monster.",
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect",
        description: "That's not the right answer. Try again!",
        variant: "default",
      });
    }
    
    // Move to next word or end battle after a delay
    setTimeout(() => {
      const currentMonster = monsters[currentMonsterIndex];
      
      if (currentMonster.health <= 0) {
        // Monster defeated
        if (currentMonsterIndex < monsters.length - 1) {
          // Move to next monster
          setCurrentMonsterIndex(prev => prev + 1);
        }
        
        // Move to next word
        handleNextWord();
      } else {
        // Continue battle with same monster
        generateQuestion();
      }
    }, 2000);
  };

  const handleNextWord = () => {
    setWordsCompleted(prev => prev + 1);
    
    if (currentWordIndex < wordCards.length - 1) {
      // More words to learn
      setCurrentWordIndex(prev => prev + 1);
      setGamePhase('learning');
      setWordLearned(false);
    } else {
      // Game completed
      toast({
        title: "Level Completed!",
        description: `Congratulations! You've mastered all words in this level.`,
        variant: "default",
      });
      
      // Update progress to 100%
      onProgress(100);
    }
  };
  
  const showWordHint = () => {
    setShowHint(true);
  };

  const currentWord = wordCards[currentWordIndex];
  const currentMonster = monsters[currentMonsterIndex];

  // Return loading state if data not ready
  if (!currentWord || !currentMonster) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold mb-2">Lexicon League</h3>
          <p className="text-muted-foreground">
            Master vocabulary words to defeat monsters
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-medium">
            Score: {score}
          </div>
          <div className="bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-medium">
            Words: {wordsCompleted}/5
          </div>
        </div>
      </div>
      
      {gamePhase === 'learning' ? (
        <div className="mb-8">
          <Card className="overflow-hidden">
            <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Word Card</h4>
              </div>
              <div className="text-sm text-muted-foreground">
                {currentWordIndex + 1} of {wordCards.length}
              </div>
            </div>
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <h2 className="text-3xl font-bold mb-2">{currentWord.word}</h2>
                <p className="text-muted-foreground italic">
                  {currentWord.definition}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h5 className="font-medium mb-2 text-primary">Synonyms</h5>
                  <ul className="list-disc list-inside">
                    {currentWord.synonyms.map((syn, index) => (
                      <li key={`syn-${index}`}>{syn}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h5 className="font-medium mb-2 text-primary">Antonyms</h5>
                  <ul className="list-disc list-inside">
                    {currentWord.antonyms.map((ant, index) => (
                      <li key={`ant-${index}`}>{ant}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-lg mb-6">
                <h5 className="font-medium mb-2">Example:</h5>
                <p className="italic">"{currentWord.usageExample}"</p>
              </div>
              
              <div className="flex justify-center">
                <Button onClick={handleWordLearned} disabled={wordLearned}>
                  {wordLearned ? 'Word Added to Vocabulary' : 'Add to My Vocabulary'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {wordLearned && (
            <div className="mt-6 flex justify-center">
              <Button onClick={startBattle} className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                Challenge Monster with this Word
              </Button>
            </div>
          )}
        </div>
      ) : (
        // Battle phase
        <div className="mb-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-36 h-36 bg-muted rounded-xl overflow-hidden mb-4">
              <div className="absolute inset-0 flex items-center justify-center text-4xl">
                👾
              </div>
            </div>
            <h3 className="text-xl font-bold mb-1">{currentMonster.name}</h3>
            <div className="w-full max-w-sm">
              <div className="flex justify-between text-sm mb-1">
                <span>HP</span>
                <span>{currentMonster.health}/{currentMonster.maxHealth}</span>
              </div>
              <Progress 
                value={(currentMonster.health / currentMonster.maxHealth) * 100} 
                className="h-2 bg-red-200"
                indicatorClassName="bg-red-500" 
              />
            </div>
          </div>
          
          <Card className="mb-6">
            <div className="p-4 border-b bg-muted/20">
              <h4 className="font-semibold">
                Find the {answerType === 'synonym' ? 'synonym' : answerType === 'antonym' ? 'antonym' : 'definition'} for "{currentWord.word}"
              </h4>
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                {answers.map((answer, index) => (
                  <Button
                    key={`answer-${index}`}
                    variant={
                      hasAnswered
                        ? index === correctAnswerIndex
                          ? "default"
                          : "outline"
                        : "outline"
                    }
                    className={`w-full justify-start h-auto py-3 px-4 text-left ${
                      hasAnswered && index === correctAnswerIndex
                        ? 'bg-green-100 border-green-500 text-green-800'
                        : hasAnswered
                        ? 'opacity-50'
                        : ''
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={hasAnswered}
                  >
                    <div className="flex items-center w-full">
                      <div className="mr-2">{String.fromCharCode(65 + index)}.</div> 
                      <div className="flex-grow">{answer}</div>
                      {hasAnswered && index === correctAnswerIndex && (
                        <CheckCircle className="ml-2 h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={showWordHint} disabled={showHint}>
              {showHint ? 'Hint Shown' : 'Show Hint'}
            </Button>
          </div>
          
          {showHint && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">Hint:</span> {
                  answerType === 'synonym' 
                    ? `A synonym is a word that means the same as "${currentWord.word}".` 
                    : answerType === 'antonym' 
                    ? `An antonym is a word that means the opposite of "${currentWord.word}".`
                    : `Look for the correct meaning of the word "${currentWord.word}".`
                }
              </p>
            </div>
          )}
        </div>
      )}
      
      <Card className="bg-muted/10">
        <div className="p-4">
          <h4 className="font-medium mb-2">Vocabulary Collection:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCards.map((card, index) => (
              <div 
                key={`vocab-${index}`} 
                className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
              >
                {card.word}
              </div>
            ))}
            {selectedCards.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No words in your vocabulary yet. Learn words to add them here.
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LexiconLeagueGame;
