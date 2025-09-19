/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  authService,
  LoginCredentials,
  SignupCredentials,
  User,
} from "@/services/auth";
import { handleTokenExpiration } from "@/lib/auth-utils";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
  handleTokenExpiration: () => void;
}

export const useAuth = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (credentials: LoginCredentials) => {
          set({ isLoading: true, error: null });
          try {
            const response = await authService.login(credentials);

            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            set({
              isLoading: false,
              error:
                error.response?.data?.message ||
                "Login failed. Please try again.",
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
              error:
                error.response?.data?.message ||
                "Signup failed. Please try again.",
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
              error:
                error.response?.data?.message ||
                "Failed to resend verification email.",
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
              error:
                error.response?.data?.message ||
                "Failed to send password reset email.",
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
              error:
                error.response?.data?.message || "Failed to reset password.",
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
              error: error.response?.data?.message || "Failed to verify email.",
            });
            throw error;
          }
        },

        logout: () => {
          authService.logout();

          // Clear remembered credentials from localStorage
          if (typeof window !== "undefined") {
            try {
              localStorage.removeItem("admin_remembered_credentials");
            } catch (error) {
              console.error("Error clearing remembered credentials:", error);
            }
          }

          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        },

        getCurrentUser: async () => {
          set({ isLoading: true });
          try {
            const user = await authService.getCurrentUser();

            if (user) {
              set({
                user,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
          } catch (error: any) {
            // Check if it's a token expiration error
            const isTokenExpired =
              error.response?.status === 401 &&
              (error.response?.data?.message
                ?.toLowerCase()
                .includes("token expired") ||
                error.response?.data?.name === "ExpiredTokenError");

            if (isTokenExpired) {
              // Use the utility function to handle token expiration
              handleTokenExpiration("/admin-auth/login");
            }

            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        },

        initializeAuth: async () => {
          // Check if we have a token
          const hasToken = authService.isAuthenticated();
          
          if (hasToken) {
            // Silently fetch user profile without loading state
            try {
              const user = await authService.getCurrentUser();
              if (user) {
                set({
                  user,
                  isAuthenticated: true,
                });
              } else {
                set({
                  user: null,
                  isAuthenticated: false,
                });
              }
            } catch {
              // If token is invalid, clear it
              authService.logout();
              set({
                user: null,
                isAuthenticated: false,
              });
            }
          } else {
            // No token, ensure state is cleared
            set({
              user: null,
              isAuthenticated: false,
            });
          }
        },

        clearError: () => {
          set({ error: null });
        },

        setUser: (user: User | null) => {
          set({
            user,
            isAuthenticated: !!user,
          });
        },

        handleTokenExpiration: () => {
          // Clear auth state
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });

          // Use the utility function to handle token expiration
          handleTokenExpiration("/admin-auth/login");
        },
      }),
      {
        name: "auth-store",
        // Persist user and auth state
        partialize: (state) => {
          return {
            user: state.user,
            isAuthenticated: state.isAuthenticated,
          };
        },
      }
    ),
    { name: "auth-store" }
  )
);
