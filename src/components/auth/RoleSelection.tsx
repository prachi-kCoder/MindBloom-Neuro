import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Users } from 'lucide-react';
import type { AppRole } from '@/hooks/useUserRole';

interface RoleSelectionProps {
  onSelectRole: (role: AppRole) => void;
  isLoading?: boolean;
}

const roles = [
  {
    id: 'student' as AppRole,
    title: 'Student',
    description: 'Access learning materials and track your progress at your own pace',
    icon: GraduationCap,
    color: 'bg-blue-500',
  },
  {
    id: 'educator' as AppRole,
    title: 'Educator',
    description: 'Create and upload educational content for students to learn from',
    icon: BookOpen,
    color: 'bg-green-500',
  },
  {
    id: 'parent' as AppRole,
    title: 'Parent',
    description: 'Monitor your child\'s learning progress and access resources',
    icon: Users,
    color: 'bg-purple-500',
  },
];

export function RoleSelection({ onSelectRole, isLoading }: RoleSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Choose Your Role</h2>
        <p className="text-muted-foreground mt-2">
          Select how you'll be using MindBloom
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {roles.map((role) => (
          <Card 
            key={role.id}
            className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
            onClick={() => !isLoading && onSelectRole(role.id)}
          >
            <CardHeader className="text-center pb-2">
              <div className={`mx-auto w-16 h-16 rounded-full ${role.color} flex items-center justify-center mb-4`}>
                <role.icon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-lg">{role.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                {role.description}
              </CardDescription>
              <Button 
                className="w-full mt-4" 
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRole(role.id);
                }}
              >
                {isLoading ? 'Setting up...' : `Continue as ${role.title}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
