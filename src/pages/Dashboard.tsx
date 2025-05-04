
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="container py-12 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6">Insights Dashboard</h1>
        <p className="text-muted-foreground">
          This page will display personalized insights and visualizations based on your child's assessment results.
        </p>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
