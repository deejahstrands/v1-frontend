/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authService, LoginCredentials, SignupCredentials, User } from '@/services/auth';
import { handleTokenExpiration } from '@/lib/auth-utils';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  authInitialized: boolean; // Track if initial auth check is complete
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
  setAuthInitialized: (initialized: boolean) => void;
  handleTokenExpiration: () => void;
}

export const useAuth = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        authInitialized: false, // Start as false, will be set to true after initial check

        login: async (credentials: LoginCredentials) => {
          console.log('🔐 Auth store: Starting login process');
          set({ isLoading: true, error: null });
          try {
            const response = await authService.login(credentials);
            console.log('🔐 Auth store: Login response received:', response);
            
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            
            console.log('🔐 Auth store: State updated after login');
            
            // Log the current state after update
            const currentState = get();
            console.log('🔐 Auth store: Current state after login:', {
              user: currentState.user?.email,
              isAuthenticated: currentState.isAuthenticated,
              authInitialized: currentState.authInitialized
            });
          } catch (error: any) {
            console.error('🔐 Auth store: Login error:', error);
            set({
              isLoading: false,
              error: error.response?.data?.message || 'Login failed. Please try again.',
            });
            throw error;
          }
        },

        signup: async (credentials: SignupCredentials) => {
          set({ isLoading: true, error: null });
          try {
            const response = await authService.signup(credentials);
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.response?.data?.message || 'Signup failed. Please try again.',
            });
            throw error;
          }
        },

        resendVerification: async (email: string) => {
          set({ isLoading: true, error: null });
          try {
            await authService.resendVerification(email);
            set({
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.response?.data?.message || 'Failed to resend verification email.',
            });
            throw error;
          }
        },

        forgotPassword: async (email: string) => {
          set({ isLoading: true, error: null });
          try {
            await authService.forgotPassword(email);
            set({
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.response?.data?.message || 'Failed to send password reset email.',
            });
            throw error;
          }
        },

        resetPassword: async (token: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            await authService.resetPassword(token, password);
            set({
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.response?.data?.message || 'Failed to reset password.',
            });
            throw error;
          }
        },

        verifyEmail: async (token: string) => {
          set({ isLoading: true, error: null });
          try {
            await authService.verifyEmail(token);
            set({
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.response?.data?.message || 'Failed to verify email.',
            });
            throw error;
          }
        },

        logout: () => {
          console.log('🔐 Auth store: logout called');
          authService.logout();
          
          // Clear remembered credentials from localStorage
          if (typeof window !== 'undefined') {
            try {
              localStorage.removeItem('admin_remembered_credentials');
              console.log('🔐 Auth store: Cleared remembered credentials');
            } catch (error) {
              console.error('🔐 Auth store: Error clearing remembered credentials:', error);
            }
          }
          
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
          console.log('🔐 Auth store: logout completed');
        },

        getCurrentUser: async () => {
          console.log('🔐 Auth store: getCurrentUser called');
          set({ isLoading: true });
          try {
            const user = await authService.getCurrentUser();
            console.log('🔐 Auth store: getCurrentUser result', { 
              hasUser: !!user, 
              userEmail: user?.email,
              isAdmin: user?.isAdmin 
            });
            
            if (user) {
              set({
                user,
                isAuthenticated: true,
                isLoading: false,
                authInitialized: true, // Mark auth as initialized
              });
              console.log('🔐 Auth store: User set successfully');
            } else {
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                authInitialized: true, // Mark auth as initialized
              });
              console.log('🔐 Auth store: No user found, auth cleared');
            }
          } catch (error: any) {
            console.error('🔐 Auth store: getCurrentUser error:', error);
            
            // Check if it's a token expiration error
            const isTokenExpired = error.response?.status === 401 && 
              (error.response?.data?.message?.toLowerCase().includes('token expired') ||
               error.response?.data?.name === 'ExpiredTokenError')
            
            if (isTokenExpired) {
              // Use the utility function to handle token expiration
              handleTokenExpiration('/admin-auth/login')
            }
            
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              authInitialized: true, // Mark auth as initialized even on error
            });
            console.log('🔐 Auth store: Auth cleared due to error');
          }
        },

        clearError: () => {
          set({ error: null });
        },

        setUser: (user: User | null) => {
          console.log('🔐 Auth store: setUser called', { 
            userEmail: user?.email, 
            isAdmin: user?.isAdmin 
          });
          set({
            user,
            isAuthenticated: !!user,
          });
        },

        setAuthInitialized: (initialized: boolean) => {
          console.log('🔐 Auth store: setAuthInitialized called', { initialized });
          set({ authInitialized: initialized });
        },

        handleTokenExpiration: () => {
          console.log('🔐 Auth store: handleTokenExpiration called');
          
          // Clear auth state
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
          
          // Use the utility function to handle token expiration
          handleTokenExpiration('/admin-auth/login')
        },
      }),
      {
        name: 'auth-store',
        // Persist user, auth state, and initialization flag
        partialize: (state) => {
          console.log('🔐 Auth store: Persisting state', {
            user: state.user?.email,
            isAuthenticated: state.isAuthenticated,
            authInitialized: state.authInitialized
          });
          return {
            user: state.user,
            isAuthenticated: state.isAuthenticated,
            authInitialized: state.authInitialized,
          };
        },
        onRehydrateStorage: () => (state) => {
          console.log('🔐 Auth store: Rehydrating from storage', {
            user: state?.user?.email,
            isAuthenticated: state?.isAuthenticated,
            authInitialized: state?.authInitialized
          });
        },
      },
    ),
    { name: 'auth-store' },
  ),
); 