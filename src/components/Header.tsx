
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-brand-500 flex items-center justify-center">
            <span className="font-bold text-white">S</span>
          </div>
          <h1 className="text-xl font-bold text-brand-700">ScreenSpy</h1>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{user.username}</span>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={logout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
