
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, LoginData, RegisterData, User } from '@/api/auth';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authApi.validateToken()
        .then(user => setUser(user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (data: LoginData) => {
    try {
      setError(null);
      const result = await authApi.login(data);
      if (result.error) {
        setError(result.error.message);
        return;
      }
      if (result.data) {
        localStorage.setItem('token', result.data.token);
        setUser(result.data.user);
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      const result = await authApi.register(data);
      if (result.error) {
        setError(result.error.message);
        return;
      }
      if (result.data) {
        localStorage.setItem('token', result.data.token);
        setUser(result.data.user);
      }
    } catch (err) {
      setError('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
