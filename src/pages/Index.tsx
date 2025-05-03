
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Login from './Login';
import Dashboard from './Dashboard';
import Header from '@/components/Header';

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
