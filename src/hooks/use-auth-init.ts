import { useEffect, useRef } from 'react';
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
  const isLoading = useAuth(state => state.isLoading);
  
  const authInitializer = AuthInitializer.getInstance();
  
  // Add a ref to track if we're already processing
  const isProcessing = useRef(false);
  const lastCallTime = useRef(0);
  const DEBOUNCE_DELAY = 1000; // 1 second delay
  const maxAttempts = useRef(0);
  const MAX_ATTEMPTS = 3;
  
  // Create stable references to prevent dependency issues
  const authInitializedRef = useRef(authInitialized);
  const isLoadingRef = useRef(isLoading);
  const setAuthInitializedRef = useRef(setAuthInitialized);
  
  // Update refs when values change
  authInitializedRef.current = authInitialized;
  isLoadingRef.current = isLoading;
  setAuthInitializedRef.current = setAuthInitialized;

  useEffect(() => {
    // Early return if auth is already initialized
    if (authInitializedRef.current) {
      console.log('⏭️ Auth already initialized, skipping effect');
      return;
    }

    console.log('🔍 useAuthInit: Effect triggered', {
      hasWindow: typeof window !== 'undefined',
      shouldInit: authInitializer.shouldInitialize(),
      currentAuthState: { isAuthenticated, hasUser: !!user, authInitialized: authInitializedRef.current }
    });

    // Only try to get current user if we haven't initialized globally and not already loading
    const now = Date.now();
    if (typeof window !== 'undefined' && 
        authInitializer.shouldInitialize() && 
        !isLoadingRef.current && 
        !isProcessing.current && 
        (now - lastCallTime.current) > DEBOUNCE_DELAY &&
        maxAttempts.current < MAX_ATTEMPTS) {
      
      maxAttempts.current += 1;
      lastCallTime.current = now;
      isProcessing.current = true;
      
      const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
      
      console.log('🔍 useAuthInit: Token check', { hasToken: !!token, tokenLength: token?.length });
      
      if (token) {
        // If we have a token, always verify it's valid by calling getCurrentUser
        if (!isAuthenticated || !user) {
          console.log('🚀 Initializing auth - calling getCurrentUser (no user in store)');
          getCurrentUser().finally(() => {
            isProcessing.current = false;
          });
        } else {
          console.log('✅ Auth already initialized and user exists, verifying token validity');
          getCurrentUser().finally(() => {
            isProcessing.current = false;
          });
        }
      } else {
        console.log('⏭️ No token found, marking auth as initialized (no auth needed)');
        setAuthInitializedRef.current(true);
        authInitializer.reset();
        isProcessing.current = false;
      }
    } else if (maxAttempts.current >= MAX_ATTEMPTS) {
      console.log('⚠️ Max auth attempts reached, marking auth as initialized to prevent infinite loop');
      setAuthInitializedRef.current(true);
      authInitializer.reset();
    }
  }, [isAuthenticated, getCurrentUser, user, authInitializer]);

  // Reset on unmount for development
  useEffect(() => {
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🧹 useAuthInit cleanup');
      }
    };
  }, []);
}; 