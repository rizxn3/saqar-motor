"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, redirectPath?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (error) {
            console.error('Failed to parse stored user:', error);
            localStorage.removeItem('user'); // Clear invalid data
          }
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User, redirectPath?: string) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      // Use the provided redirectPath or default to dashboard
      router.push(redirectPath || '/dashboard');
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('user');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 