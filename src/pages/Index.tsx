
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import ResourcePreview from '@/components/home/ResourcePreview';
import HowItWorks from '@/components/home/HowItWorks';
import CallToAction from '@/components/home/CallToAction';

const Index = () => {
  return (
    <MainLayout>
      <Hero />
      <Features />
      <HowItWorks />
      <ResourcePreview />
      <CallToAction />
    </MainLayout>
  );
};

export default Index;
