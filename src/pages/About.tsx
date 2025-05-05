
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Brain, Heart, BookOpen, Users } from 'lucide-react';

const About = () => {
  return (
    <MainLayout>
      <div className="container py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">About MindBloom</h1>
            <p className="text-muted-foreground text-lg">
              Supporting families on their neurodevelopmental journey with compassion and innovation
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="lead">
              MindBloom is a compassion-driven digital platform designed to assist parents of children with 
              neurodevelopmental disorders such as Dyslexia, ADHD, and Autism Spectrum Disorder (ASD).
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
            <p>
              At MindBloom, we believe every child deserves the opportunity to flourish. Our mission is to provide 
              comprehensive support, reliable information, and community connections to families navigating the 
              complexities of neurodevelopmental disorders.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">What We Offer</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Assessment Tools</h3>
                </div>
                <p className="text-muted-foreground">
                  Evidence-based assessments to help identify potential neurodevelopmental concerns early and guide 
                  appropriate intervention strategies.
                </p>
              </div>
              
              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Curated Resources</h3>
                </div>
                <p className="text-muted-foreground">
                  Expertly vetted information, articles, videos, and practical strategies tailored to different 
                  neurodevelopmental conditions.
                </p>
              </div>
              
              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Professional Network</h3>
                </div>
                <p className="text-muted-foreground">
                  Access to specialists, therapists, and educators with expertise in various neurodevelopmental disorders.
                </p>
              </div>
              
              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Supportive Community</h3>
                </div>
                <p className="text-muted-foreground">
                  Connection with other families facing similar challenges, providing a space for sharing experiences, 
                  advice, and emotional support.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Team</h2>
            <p>
              MindBloom was founded by a team of child development specialists, parents of 
              neurodivergent children, and technology experts passionate about making a difference. 
              We combine clinical expertise with personal experience and innovative technology to 
              deliver a platform that truly meets the needs of our community.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Approach</h2>
            <p>
              We believe in a holistic, family-centered approach to supporting neurodivergent children. 
              Our platform emphasizes:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Early identification and intervention</li>
              <li>Evidence-based resources and recommendations</li>
              <li>Personalized support journeys</li>
              <li>Empowering parents as advocates for their children</li>
              <li>Celebrating neurodiversity and each child's unique strengths</li>
            </ul>
            
            <div className="bg-primary/5 p-6 rounded-lg mt-8 text-center">
              <h3 className="font-semibold text-xl mb-2">Join Our Community</h3>
              <p className="mb-4">
                Together, we can create a more inclusive world where every child can thrive in their own unique way.
              </p>
              <p className="font-medium text-primary">
                Have questions? <a href="/contact" className="underline">Contact us</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;
