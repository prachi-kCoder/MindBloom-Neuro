
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Login = () => {
  return (
    <MainLayout>
      <div className="container py-12 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6">Sign In</h1>
        <p className="text-muted-foreground">
          This page will contain login functionality for registered users.
        </p>
      </div>
    </MainLayout>
  );
};

export default Login;
