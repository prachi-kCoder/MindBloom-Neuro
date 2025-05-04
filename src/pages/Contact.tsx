
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Contact = () => {
  return (
    <MainLayout>
      <div className="container py-12 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <p className="text-muted-foreground">
          This page will provide contact information and a form to reach out to the Feed Lovable team.
        </p>
      </div>
    </MainLayout>
  );
};

export default Contact;
