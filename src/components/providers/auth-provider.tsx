'use client';

import { useEffect } from 'react';
import { useAuth } from '@/store/use-auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { initializeAuth } = useAuth();

  useEffect(() => {
    // Initialize authentication on app start
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}
