
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Smile } from 'lucide-react';

interface LearningIntroProps {
  onStart: (ageGroup: string, disabilityType: string) => void;
}

const LearningIntroduction: React.FC<LearningIntroProps> = ({ onStart }) => {
  const [selectedAge, setSelectedAge] = useState<string>('');
  const [selectedDisability, setSelectedDisability] = useState<string>('');
  
  const ageGroups = [
    { id: "0-3", name: "0–3 Years (Infant/Toddler)" },
    { id: "3-4", name: "3–4 Years (Pre-Nursery)" },
    { id: "4-5", name: "4–5 Years (Nursery)" },
    { id: "5-6", name: "5–6 Years (Kindergarten)" },
    { id: "6-8", name: "6–8 Years (Early Primary)" },
    { id: "8-10", name: "8–10 Years (Middle Primary)" },
    { id: "10-12", name: "10–12 Years (Upper Primary)" }
  ];
  
  const disabilityTypes = [
    { id: "dyslexia", name: "Dyslexia", icon: <BookOpen className="h-5 w-5 text-soft-pink" />, description: "Support for reading difficulties and letter recognition" },
    { id: "adhd", name: "ADHD", icon: <Smile className="h-5 w-5 text-soft-blue" />, description: "Activities designed for focus and attention support" },
    { id: "asd", name: "ASD (Autism Spectrum Disorder)", icon: <GraduationCap className="h-5 w-5 text-soft-purple" />, description: "Structured learning with visual supports" }
  ];
  
  const handleContinue = () => {
    if (selectedAge && selectedDisability) {
      onStart(selectedAge, selectedDisability);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <div className="w-48 h-48 mx-auto mb-4 relative">
          <img 
            src="https://images.unsplash.com/photo-1583795128727-6ec3642408f8?auto=format&fit=crop&w=300&h=300&q=80" 
            alt="Teacher Guide" 
            className="w-full h-full object-cover rounded-full border-4 border-primary"
          />
          <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 border-2 border-primary">
            👋
          </div>
        </div>
        <h2 className="text-2xl font-bold">Hello there!</h2>
        <p className="text-muted-foreground">
          I'm Teacher Bloom! Let me guide you through our learning activities.
          First, let's find out what's best for you!
        </p>
      </motion.div>

      <Card className="w-full max-w-2xl mb-6">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">How old are you?</h3>
              <RadioGroup 
                value={selectedAge} 
                onValueChange={setSelectedAge}
                className="grid grid-cols-1 md:grid-cols-2 gap-2"
              >
                {ageGroups.map(age => (
                  <div key={age.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={age.id} id={`age-${age.id}`} />
                    <Label htmlFor={`age-${age.id}`} className="cursor-pointer">{age.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Select learning support:</h3>
              <RadioGroup 
                value={selectedDisability} 
                onValueChange={setSelectedDisability}
                className="space-y-2"
              >
                {disabilityTypes.map(type => (
                  <div 
                    key={type.id} 
                    className={`flex items-center space-x-2 p-3 rounded-lg border-2 ${
                      selectedDisability === type.id ? 'border-primary bg-muted/40' : 'border-transparent'
                    }`}
                  >
                    <RadioGroupItem value={type.id} id={`type-${type.id}`} />
                    <Label 
                      htmlFor={`type-${type.id}`} 
                      className="cursor-pointer flex items-center gap-2 w-full"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className={`p-2 rounded-full ${
                          type.id === 'dyslexia' ? 'bg-soft-pink/20' : 
                          type.id === 'adhd' ? 'bg-soft-blue/20' : 
                          'bg-soft-purple/20'
                        }`}>
                          {type.icon}
                        </div>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        size="lg" 
        onClick={handleContinue}
        disabled={!selectedAge || !selectedDisability}
        className="relative overflow-hidden"
      >
        Let's Start Learning!
        {(selectedAge && selectedDisability) && (
          <motion.div
            className="absolute inset-0 bg-white opacity-20"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        )}
      </Button>
    </div>
  );
};

export default LearningIntroduction;
