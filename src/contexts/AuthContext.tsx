
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  username: string;
  loggedInAt: number;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Demo users - in a real app, you'd use a proper backend
const DEMO_USERS = [
  { username: 'demo', password: 'password' },
  { username: 'user', password: 'password' }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Check for existing login on mount
    const storedUser = localStorage.getItem('screenspy_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('screenspy_user');
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Simple demo authentication
    const foundUser = DEMO_USERS.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    
    if (foundUser) {
      const userObj = {
        username: foundUser.username,
        loggedInAt: Date.now()
      };
      
      setUser(userObj);
      localStorage.setItem('screenspy_user', JSON.stringify(userObj));
      toast.success('Login successful!');
      return true;
    } else {
      toast.error('Invalid credentials');
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('screenspy_user');
    localStorage.removeItem('screenspy_captures');
    toast.info('You have been logged out');
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
