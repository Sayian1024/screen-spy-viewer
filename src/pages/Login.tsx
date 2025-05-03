
import React from 'react';
import LoginForm from '@/components/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-50 to-blue-50 px-4">
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-brand-500 rounded-lg flex items-center justify-center mb-4">
          <span className="text-2xl font-bold text-white">S</span>
        </div>
        <h1 className="text-3xl font-bold text-brand-900 mb-2">ScreenSpy</h1>
        <p className="text-gray-600">Capture, view, and manage your screenshots</p>
      </div>
      
      <LoginForm />
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Use demo credentials to test this application.</p>
        <p className="mt-4">© 2025 ScreenSpy. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
