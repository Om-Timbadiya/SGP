import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'student' | 'admin') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      // Simulate login - in a real app, this would be an API call
      const mockUser: User = {
        id: '1',
        name: 'Demo User',
        email: email,
        role: 'student'
      };
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success('Welcome back!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      toast.error(message);
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string, role: 'student' | 'admin') => {
    try {
      setError(null);
      // Simulate registration
      const mockUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role
      };
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success('Registration successful!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      toast.error(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}