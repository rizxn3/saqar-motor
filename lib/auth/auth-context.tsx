"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  role: string;
  company_name?: string;
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
            localStorage.removeItem('user');
            document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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
      // Ensure we have the correct user data structure
      const userToStore = {
        id: userData.id, // This should be the UUID from the users table
        auth_id: userData.auth_id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        company_name: userData.company_name
      };

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userToStore));
      // Store in cookie for server-side access
      document.cookie = `user=${JSON.stringify(userToStore)}; path=/`;
      setUser(userToStore);

      // Use the provided redirectPath or default to dashboard
      if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('user');
      document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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