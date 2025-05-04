
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-soft-purple/40 to-transparent overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4 animate-fade-in">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Supporting Every Child's Unique Journey
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Compassionate guidance, personalized insights, and supportive resources for parents of children with neurodevelopmental uniqueness.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="rounded-full" size="lg" asChild>
                <Link to="/assessment">Start Assessment</Link>
              </Button>
              <Button variant="outline" className="rounded-full" size="lg" asChild>
                <Link to="/resources">Explore Resources</Link>
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              <span>Trusted by 2000+ families</span>
            </div>
          </div>
          <div className="relative h-[350px] lg:h-[600px] animate-fade-in">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[500px] md:h-[500px] bg-gradient-to-br from-soft-purple via-soft-blue to-soft-pink rounded-full opacity-70 blur-2xl"></div>
            <div className="relative h-full flex items-center justify-center">
              <div className="absolute w-48 h-48 bg-white rounded-lg shadow-lg transform rotate-6 translate-x-10 translate-y-8">
                <div className="w-full h-full bg-soft-peach rounded-lg p-4 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-foreground/80">Compassion</span>
                </div>
              </div>
              <div className="absolute w-48 h-48 bg-white rounded-lg shadow-lg transform -rotate-12 -translate-x-12">
                <div className="w-full h-full bg-soft-blue rounded-lg p-4 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-foreground/80">Support</span>
                </div>
              </div>
              <div className="absolute w-48 h-48 bg-white rounded-lg shadow-lg transform rotate-2 translate-y-20">
                <div className="w-full h-full bg-soft-pink rounded-lg p-4 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-foreground/80">Understanding</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
