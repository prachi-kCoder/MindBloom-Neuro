
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Brain, User, Users } from 'lucide-react';

const disorderTypes = [
  { id: 'adhd', name: 'ADHD' },
  { id: 'asd', name: 'Autism Spectrum' },
  { id: 'dyslexia', name: 'Dyslexia' }
];

const resources = {
  adhd: [
    {
      title: "Understanding ADHD in Children",
      description: "An introduction to ADHD symptoms, challenges, and strengths in children of different ages.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&crop=face",
      link: "/resources/adhd/understanding"
    },
    {
      title: "ADHD Management Strategies",
      description: "Practical tips for helping children with ADHD succeed at home and in school.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
      link: "/resources/adhd/strategies"
    },
    {
      title: "ADHD and Executive Function",
      description: "How ADHD affects planning, organization, and emotional regulation.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
      link: "/resources/adhd/executive-function"
    }
  ],
  asd: [
    {
      title: "Autism Spectrum Disorder Basics",
      description: "Understanding the spectrum of autism and how it manifests in children.",
      image: "https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=300&fit=crop",
      link: "/resources/asd/basics"
    },
    {
      title: "Social Skills Development",
      description: "Activities and strategies to help children with ASD develop social understanding.",
      image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop",
      link: "/resources/asd/social-skills"
    },
    {
      title: "Managing Sensory Sensitivities",
      description: "Creating sensory-friendly environments for children with autism.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      link: "/resources/asd/sensory"
    }
  ],
  dyslexia: [
    {
      title: "Signs of Dyslexia by Age",
      description: "How to recognize potential signs of dyslexia from preschool through teen years.",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      link: "/resources/dyslexia/signs"
    },
    {
      title: "Reading Strategies for Dyslexia",
      description: "Evidence-based approaches to support reading development in dyslexic children.",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop",
      link: "/resources/dyslexia/reading"
    },
    {
      title: "Building Confidence in Dyslexic Learners",
      description: "How to nurture self-esteem and resilience in children with dyslexia.",
      image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop",
      link: "/resources/dyslexia/confidence"
    }
  ]
};

const ResourcePreview = () => {
  return (
    <section className="py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-full bg-soft-pink/50 px-3 py-1 text-sm text-primary">
              Knowledge Center
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Expert-Curated Resources</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Educational materials to help you understand and support your child's neurodevelopmental journey.
            </p>
          </div>
        </div>
        
        <div className="mt-12 mx-auto max-w-4xl">
          {/* Audience preview */}
          <div className="flex justify-center items-center gap-6 mb-8">
            <Card className="overflow-hidden border-border shadow-sm hover:shadow-md transition-shadow flex-1 max-w-xs">
              <div className="bg-primary/5 p-6 flex justify-center">
                <Users className="h-16 w-16 text-primary" />
              </div>
              <CardContent className="p-5 text-center">
                <h3 className="text-lg font-semibold mb-2">For Parents & Teachers</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Evidence-based guidance, practical strategies and management approaches
                </p>
                <Button variant="outline" className="rounded-full" asChild>
                  <Link to="/resources">
                    View Parent Resources
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-border shadow-sm hover:shadow-md transition-shadow flex-1 max-w-xs">
              <div className="bg-primary/5 p-6 flex justify-center">
                <User className="h-16 w-16 text-primary" />
              </div>
              <CardContent className="p-5 text-center">
                <h3 className="text-lg font-semibold mb-2">For Children</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Kid-friendly explanations, learning tools, and activities to build confidence
                </p>
                <Button variant="outline" className="rounded-full" asChild>
                  <Link to="/resources">
                    View Child Resources
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="adhd" className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="bg-muted/50">
                {disorderTypes.map(type => (
                  <TabsTrigger key={type.id} value={type.id} className="px-6">
                    {type.id === 'adhd' && <Brain className="h-4 w-4 mr-2" />}
                    {type.id === 'asd' && <Brain className="h-4 w-4 mr-2" />}
                    {type.id === 'dyslexia' && <Book className="h-4 w-4 mr-2" />}
                    {type.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {Object.entries(resources).map(([type, typeResources]) => (
              <TabsContent key={type} value={type} className="mt-0">
                <div className="grid md:grid-cols-3 gap-6">
                  {typeResources.map((resource, index) => (
                    <Card key={index} className="overflow-hidden border-border shadow-sm card-hover">
                      <div className="aspect-video relative bg-muted">
                        <img 
                          src={resource.image}
                          alt={resource.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-1">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                        <Link to={resource.link} className="text-primary hover:underline text-sm font-medium">
                          Read more →
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="flex justify-center mt-8">
                  <Button variant="outline" className="rounded-full" asChild>
                    <Link to="/resources">
                      Explore all resources
                    </Link>
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default ResourcePreview;
