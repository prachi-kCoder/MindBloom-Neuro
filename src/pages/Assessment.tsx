
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Assessment = () => {
  return (
    <MainLayout>
      <div className="container py-12 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6">Behavioral Assessment</h1>
        <p className="text-muted-foreground">
          This page will contain assessment tools to help identify patterns in children with neurodevelopmental disorders.
        </p>
      </div>
    </MainLayout>
  );
};

export default Assessment;
