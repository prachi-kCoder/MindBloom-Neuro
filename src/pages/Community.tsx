
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Community = () => {
  return (
    <MainLayout>
      <div className="container py-12 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6">Parent Community</h1>
        <p className="text-muted-foreground">
          This page will provide a supportive community forum for parents to share experiences and advice.
        </p>
      </div>
    </MainLayout>
  );
};

export default Community;
