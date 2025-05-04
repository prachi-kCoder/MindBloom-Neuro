
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-soft-blue/30 to-soft-purple/30">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              Get Started Today
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Begin Your Family's Support Journey</h2>
            <p className="text-muted-foreground md:text-xl/relaxed">
              Take the first step towards better understanding and supporting your child's unique developmental needs with our specialized assessments.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="rounded-full" asChild>
                <Link to="/assessment">Start Assessment</Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full" asChild>
                <Link to="/contact">Talk to an Expert</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              <div className="absolute -left-4 -top-4 w-24 h-24 bg-soft-pink rounded-lg transform rotate-6"></div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-soft-blue rounded-lg transform -rotate-6"></div>
              <div className="relative bg-white rounded-xl shadow-lg p-6 text-center border border-border">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Parent Testimonial</h3>
                <blockquote className="text-muted-foreground italic">
                  "Feed Lovable gave us the insights we needed to better understand our son's learning style. The resources and community support have been invaluable to our family."
                </blockquote>
                <div className="mt-4">
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Parent of a 9-year-old with ADHD</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
