/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  authService,
  LoginCredentials,
  SignupCredentials,
  User,
  UpdateProfileData,
  UserConsultation,
  GetUserConsultationsParams,
} from "@/services/auth";
import { handleTokenExpiration } from "@/lib/auth-utils";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // User consultations state
  consultations: UserConsultation[];
  consultationsLoading: boolean;
  consultationsError: string | null;
  consultationsPage: number;
  consultationsTotalPages: number;
  consultationsTotalItems: number;
  consultationsHasNext: boolean;
  consultationsHasPrev: boolean;

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
  updateProfile: (profileData: UpdateProfileData) => Promise<void>;
  getUserConsultations: (params?: GetUserConsultationsParams) => Promise<void>;
  clearError: () => void;
  clearConsultationsError: () => void;
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

        // User consultations initial state
        consultations: [],
        consultationsLoading: false,
        consultationsError: null,
        consultationsPage: 1,
        consultationsTotalPages: 1,
        consultationsTotalItems: 0,
        consultationsHasNext: false,
        consultationsHasPrev: false,

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

            // Sync cart and wishlist after successful login
            if (typeof window !== 'undefined') {
              setTimeout(async () => {
                try {
                  const { useCart } = await import('@/store/use-cart');
                  const { useWishlist } = await import('@/store/use-wishlist');
                  
                  useCart.getState().fetchCart();
                  useWishlist.getState().fetchWishlist();
                } catch (error) {
                  console.error('Error syncing user data after login:', error);
                }
              }, 100);
            }
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

        updateProfile: async (profileData: UpdateProfileData) => {
          set({ isLoading: true, error: null });
          try {
            const response = await authService.updateProfile(profileData);
            set({
              user: response.data,
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.response?.data?.message || "Failed to update profile.",
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

        getUserConsultations: async (params) => {
          set({ consultationsLoading: true, consultationsError: null });
          try {
            const response = await authService.getUserConsultations(params);
            
            set({
              consultations: response.data,
              consultationsPage: response.meta.page,
              consultationsTotalPages: response.meta.totalPages,
              consultationsTotalItems: response.meta.totalItems,
              consultationsHasNext: response.meta.hasNext,
              consultationsHasPrev: response.meta.hasPrev,
              consultationsLoading: false,
              consultationsError: null,
            });
          } catch (error: any) {
            set({
              consultationsLoading: false,
              consultationsError: error.response?.data?.message || "Failed to fetch consultations",
            });
          }
        },

        clearError: () => {
          set({ error: null });
        },

        clearConsultationsError: () => {
          set({ consultationsError: null });
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
