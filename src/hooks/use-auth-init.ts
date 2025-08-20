import { useEffect } from 'react';
import { useAuth } from '@/store/use-auth';

// Singleton to ensure auth is only initialized once across the entire app
class AuthInitializer {
  private static instance: AuthInitializer;
  private initialized = false;
  private callCount = 0;

  private constructor() {}

  static getInstance(): AuthInitializer {
    if (!AuthInitializer.instance) {
      AuthInitializer.instance = new AuthInitializer();
    }
    return AuthInitializer.instance;
  }

  shouldInitialize(): boolean {
    this.callCount++;
    console.log('🔍 AuthInitializer.shouldInitialize called:', {
      initialized: this.initialized,
      callCount: this.callCount
    });
    
    if (this.initialized) {
      console.log('⏭️ Auth already initialized, skipping');
      return false;
    }

    this.initialized = true;
    console.log('🚀 Auth will be initialized');
    return true;
  }

  reset() {
    this.initialized = false;
    this.callCount = 0;
    console.log('🔄 AuthInitializer reset');
  }
}

export const useAuthInit = () => {
  const getCurrentUser = useAuth(state => state.getCurrentUser);
  const isAuthenticated = useAuth(state => state.isAuthenticated);
  const user = useAuth(state => state.user);
  const authInitialized = useAuth(state => state.authInitialized);
  const setAuthInitialized = useAuth(state => state.setAuthInitialized);
  
  const authInitializer = AuthInitializer.getInstance();

  useEffect(() => {
    console.log('🔍 useAuthInit: Effect triggered', {
      hasWindow: typeof window !== 'undefined',
      shouldInit: authInitializer.shouldInitialize(),
      currentAuthState: { isAuthenticated, hasUser: !!user, authInitialized }
    });

    // Only try to get current user if we haven't initialized globally
    if (typeof window !== 'undefined' && authInitializer.shouldInitialize()) {
      const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
      
      console.log('🔍 useAuthInit: Token check', { hasToken: !!token, tokenLength: token?.length });
      
      if (token) {
        // If we have a token, always verify it's valid by calling getCurrentUser
        if (!isAuthenticated || !user) {
          console.log('🚀 Initializing auth - calling getCurrentUser (no user in store)');
          setAuthInitialized(false);
          getCurrentUser();
        } else {
          console.log('✅ Auth already initialized and user exists, verifying token validity');
          setAuthInitialized(false);
          getCurrentUser(); // Still verify the token is valid
        }
      } else {
        console.log('⏭️ No token found, marking auth as initialized (no auth needed)');
        setAuthInitialized(true);
        authInitializer.reset();
      }
    }
  }, [isAuthenticated, getCurrentUser, user, authInitialized, setAuthInitialized, authInitializer]);

  // Reset on unmount for development
  useEffect(() => {
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🧹 useAuthInit cleanup');
      }
    };
  }, []);
}; 