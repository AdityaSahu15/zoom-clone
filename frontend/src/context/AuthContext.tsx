'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggingOut: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  // Prevent double-fetch in React StrictMode / concurrent rendering
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    // Clear logging out flag on mount
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggingOut');
    }

    api.get('/api/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []); // runs exactly once on mount

  // Stable callbacks — wrapped in useCallback so they never cause re-renders in consumers
  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post('/api/auth/login', { email, password });
    setUser(res.data.user);
    router.push('/dashboard');
  }, [router]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await api.post('/api/auth/register', { name, email, password });
    setUser(res.data.user);
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    setLoading(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggingOut', 'true');
    }
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout request failed:', err);
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.replace('/');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isLoggingOut, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
