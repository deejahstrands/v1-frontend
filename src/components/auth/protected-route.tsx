'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/use-auth';
import { useTokenExpiration } from '@/hooks/use-token-expiration';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = '/auth/login' }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { handleExpiration } = useTokenExpiration();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Add global error handler for token expiration
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      // Check if it's an API error with 401 status
      if (event.error?.response?.status === 401) {
        const errorData = event.error?.response?.data;
        const isTokenExpired = errorData?.message?.toLowerCase().includes('token expired') ||
                              errorData?.name === 'ExpiredTokenError';
        
        if (isTokenExpired) {
          handleExpiration(redirectTo);
        }
      }
    };

    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, [handleExpiration, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#C9A898]"></div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
} 