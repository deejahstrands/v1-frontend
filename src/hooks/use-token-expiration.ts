import { useCallback } from 'react';
import { useAuth } from '@/store/use-auth';
import { handleTokenExpiration } from '@/lib/auth-utils';

/**
 * Hook to handle token expiration
 * @returns Object with handleExpiration function
 */
export function useTokenExpiration() {
  const { handleTokenExpiration: storeHandleExpiration } = useAuth();

  const handleExpiration = useCallback((redirectTo?: string) => {
    // Clear auth state first
    storeHandleExpiration();
    
    // Then use utility function for UI and redirect
    handleTokenExpiration(redirectTo);
  }, [storeHandleExpiration]);

  return { handleExpiration };
}
