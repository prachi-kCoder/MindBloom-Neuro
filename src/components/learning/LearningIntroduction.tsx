
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { BookOpen, Smile, GraduationCap, ArrowRight } from 'lucide-react';
import FullScreenToggle from './FullScreenToggle';

interface LearningIntroProps {
  onStart: (ageGroup: string, disabilityType: string) => void;
}

const LearningIntroduction: React.FC<LearningIntroProps> = ({ onStart }) => {
  const [selectedAge, setSelectedAge] = useState<string>('');
  const [selectedDisability, setSelectedDisability] = useState<string>('');
  const [animationStep, setAnimationStep] = useState(0);
  
  const ageGroups = [
    { id: "0-3", name: "0–3 Years", label: "Infant/Toddler" },
    { id: "3-4", name: "3–4 Years", label: "Pre-Nursery" },
    { id: "4-5", name: "4–5 Years", label: "Nursery" },
    { id: "5-6", name: "5–6 Years", label: "Kindergarten" },
    { id: "6-8", name: "6–8 Years", label: "Early Primary" },
    { id: "8-10", name: "8–10 Years", label: "Middle Primary" },
    { id: "10-12", name: "10–12 Years", label: "Upper Primary" }
  ];
  
  const disabilityTypes = [
    { 
      id: "dyslexia", 
      name: "Dyslexia", 
      icon: <BookOpen className="h-5 w-5 text-white" />, 
      description: "Support for reading difficulties and letter recognition",
      color: "from-soft-pink to-soft-pink/70"
    },
    { 
      id: "adhd", 
      name: "ADHD", 
      icon: <Smile className="h-5 w-5 text-white" />, 
      description: "Activities designed for focus and attention support",
      color: "from-soft-blue to-soft-blue/70" 
    },
    { 
      id: "asd", 
      name: "ASD (Autism Spectrum Disorder)", 
      icon: <GraduationCap className="h-5 w-5 text-white" />, 
      description: "Structured learning with visual supports",
      color: "from-soft-purple to-soft-purple/70" 
    }
  ];
  
  // Trigger step animation when selections change
  React.useEffect(() => {
    if (selectedAge && !selectedDisability) {
      setAnimationStep(1);
    } else if (selectedAge && selectedDisability) {
      setAnimationStep(2);
    }
  }, [selectedAge, selectedDisability]);

  const handleContinue = () => {
    if (selectedAge && selectedDisability) {
      onStart(selectedAge, selectedDisability);
    }
  };

  // Teacher speech based on current step
  const getTeacherSpeech = () => {
    if (!selectedAge) {
      return "Welcome! I'm Teacher Bloom! First, let's find out your age so I can recommend the right activities for you!";
    } else if (!selectedDisability) {
      return "Great choice! Now, let's find which learning support works best for you!";
    } else {
      return "Perfect! We're all set to start our learning journey together. Click the button below when you're ready!";
    }
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto">
      <div className="w-full mb-10 relative">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ 
            y: 0, 
            opacity: 1,
            x: animationStep === 1 ? -40 : animationStep === 2 ? -80 : 0
          }}
          transition={{ duration: 0.6, type: "spring" }}
          className="flex items-center gap-6 justify-center md:justify-start"
        >
          <div className="relative">
            <motion.div 
              className="w-32 h-32 sm:w-40 sm:h-40 relative"
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: animationStep === 1 ? [0, -5, 0] : animationStep === 2 ? [0, 5, 0] : [0, 0, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <img 
                src="https://images.unsplash.com/photo-1583795128727-6ec3642408f8?auto=format&fit=crop&w=300&h=300&q=80" 
                alt="Teacher Bloom" 
                className="w-full h-full object-cover rounded-full border-4 border-primary shadow-lg"
              />
              <motion.div 
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 border-2 border-primary shadow-md"
                animate={{ 
                  rotate: [0, 20, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {animationStep === 0 ? "👋" : animationStep === 1 ? "🎯" : "✨"}
              </motion.div>
            </motion.div>
          </div>

          <motion.div 
            className="bg-white p-4 rounded-xl rounded-tl-none shadow-lg border-2 border-primary/30 max-w-xs sm:max-w-sm relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute left-0 top-0 w-4 h-4 bg-primary transform -translate-x-2 -translate-y-2 rotate-45"></div>
            <h2 className="text-xl font-bold text-primary mb-1">Teacher Bloom</h2>
            <p className="text-foreground">
              {getTeacherSpeech()}
            </p>
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="w-full border-2 border-primary/20 shadow-lg bg-gradient-to-br from-white to-secondary/20">
          <CardContent className="pt-6">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className={selectedAge ? "opacity-50" : ""}
              >
                <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                  How old are you?
                </h3>
                
                <RadioGroup 
                  value={selectedAge} 
                  onValueChange={setSelectedAge}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                >
                  {ageGroups.map(age => (
                    <div 
                      key={age.id} 
                      className={`relative rounded-lg border-2 transition-all ${
                        selectedAge === age.id 
                          ? 'border-primary shadow-md bg-primary/10' 
                          : 'border-border hover:border-primary/50 hover:shadow-sm'
                      }`}
                    >
                      <RadioGroupItem 
                        value={age.id} 
                        id={`age-${age.id}`}
                        className="sr-only"
                      />
                      <Label 
                        htmlFor={`age-${age.id}`} 
                        className="cursor-pointer block p-3 text-center"
                      >
                        <div className="font-bold text-lg">{age.name}</div>
                        <div className="text-xs text-muted-foreground">{age.label}</div>
                      </Label>
                      {selectedAge === age.id && (
                        <motion.div 
                          className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: selectedAge ? 1 : 0.5, 
                  height: "auto",
                }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                  Select learning support:
                </h3>
                
                <RadioGroup 
                  value={selectedDisability} 
                  onValueChange={setSelectedDisability}
                  className="space-y-3"
                >
                  {disabilityTypes.map(type => (
                    <div 
                      key={type.id}
                      className={`rounded-xl border-2 transition-all ${
                        selectedDisability === type.id 
                          ? 'border-primary shadow-lg' 
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <RadioGroupItem 
                        value={type.id} 
                        id={`type-${type.id}`}
                        className="sr-only" 
                        disabled={!selectedAge}
                      />
                      <Label 
                        htmlFor={`type-${type.id}`} 
                        className={`cursor-pointer block overflow-hidden rounded-lg ${!selectedAge ? 'opacity-50' : ''}`}
                      >
                        <div className={`bg-gradient-to-r ${type.color} px-5 py-4`}>
                          <div className="flex items-center gap-4">
                            <div className="bg-white/30 backdrop-blur-sm p-3 rounded-full">
                              {type.icon}
                            </div>
                            <div>
                              <div className="font-bold text-xl text-white">{type.name}</div>
                            </div>
                            {selectedDisability === type.id && (
                              <motion.div 
                                className="ml-auto bg-white text-primary rounded-full p-1"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </motion.div>
                            )}
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-muted-foreground">{type.description}</p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="mt-8 w-full flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: selectedAge && selectedDisability ? 1 : 0,
          scale: selectedAge && selectedDisability ? 1 : 0.8,
        }}
        transition={{ duration: 0.5 }}
      >
        <Button 
          size="lg" 
          onClick={handleContinue}
          disabled={!selectedAge || !selectedDisability}
          className="relative overflow-hidden px-8 py-6 text-lg font-bold group"
        >
          <span className="relative z-10 flex items-center gap-2">
            Let's Start Learning!
            <ArrowRight className="h-5 w-5 transition-all group-hover:translate-x-1" />
          </span>
          
          {(selectedAge && selectedDisability) && (
            <motion.div
              className="absolute inset-0 bg-white opacity-20"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default LearningIntroduction;
