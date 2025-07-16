import { useEffect } from 'react';
import { useAuth } from '@/store/use-auth';

export const useAuthInit = () => {
  const { getCurrentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    // Only try to get current user if we have a token
    if (typeof window !== 'undefined') {
      const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
      if (token && !isAuthenticated) {
        getCurrentUser();
      }
    }
  }, [getCurrentUser, isAuthenticated]);
}; 