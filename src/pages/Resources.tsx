
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Resources = () => {
  return (
    <MainLayout>
      <div className="container py-12 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6">Educational Resources</h1>
        <p className="text-muted-foreground">
          This page will contain comprehensive educational resources for parents of children with ADHD, ASD, and Dyslexia.
        </p>
      </div>
    </MainLayout>
  );
};

export default Resources;
