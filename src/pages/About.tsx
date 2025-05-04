
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const About = () => {
  return (
    <MainLayout>
      <div className="container py-12 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6">About Feed Lovable</h1>
        <p className="text-muted-foreground">
          Feed Lovable is a compassion-driven digital platform designed to assist parents of children with neurodevelopmental disorders such as Dyslexia, ADHD, and ASD.
        </p>
      </div>
    </MainLayout>
  );
};

export default About;
