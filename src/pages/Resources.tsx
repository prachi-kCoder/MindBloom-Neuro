
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Book, Brain, User, Users, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Disorder resource components
import ADHDResources from '@/components/resources/ADHDResources';
import ASDResources from '@/components/resources/ASDResources';
import DyslexiaResources from '@/components/resources/DyslexiaResources';

const Resources = () => {
  const [audience, setAudience] = useState<'parent' | 'child'>('parent');

  return (
    <MainLayout>
      <div className="container py-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Educational Resources</h1>
            <p className="text-muted-foreground mt-2">
              Structured resources to empower families with actionable knowledge about neurodevelopmental disorders
            </p>
          </div>

          {/* Audience selector */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-4 p-1 rounded-lg bg-muted/50">
              <Button
                variant={audience === 'parent' ? 'default' : 'ghost'}
                className="flex items-center gap-2"
                onClick={() => setAudience('parent')}
              >
                <Users className="h-4 w-4" />
                For Parents & Teachers
              </Button>
              <Button
                variant={audience === 'child' ? 'default' : 'ghost'} 
                className="flex items-center gap-2"
                onClick={() => setAudience('child')}
              >
                <User className="h-4 w-4" />
                For Children
              </Button>
            </div>
          </div>
          
          {/* Disorder tabs */}
          <Tabs defaultValue="adhd" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="adhd" className="flex items-center gap-2">
                <Brain className="h-4 w-4" /> ADHD
              </TabsTrigger>
              <TabsTrigger value="asd" className="flex items-center gap-2">
                <Brain className="h-4 w-4" /> Autism Spectrum
              </TabsTrigger>
              <TabsTrigger value="dyslexia" className="flex items-center gap-2">
                <Book className="h-4 w-4" /> Dyslexia
              </TabsTrigger>
            </TabsList>
            
            {/* ADHD Resources */}
            <TabsContent value="adhd">
              <ADHDResources audience={audience} />
            </TabsContent>
            
            {/* ASD Resources */}
            <TabsContent value="asd">
              <ASDResources audience={audience} />
            </TabsContent>
            
            {/* Dyslexia Resources */}
            <TabsContent value="dyslexia">
              <DyslexiaResources audience={audience} />
            </TabsContent>
          </Tabs>
          
          <div className="mt-12 text-center">
            <Button variant="outline" asChild className="rounded-full">
              <Link to="/resources/success-stories">
                View Success Stories of People with Neurodevelopmental Disorders
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Resources;
