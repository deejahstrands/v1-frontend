import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  avatar: string | null;
  phone: string | null;
  isAdmin: boolean;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface ResendVerificationResponse {
  message: string;
  error?: boolean;
  name?: string;
  timestamp?: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface VerifyEmailResponse {
  message: string;
}

// Cookie utility functions
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
};

const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Auth service functions
export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const { accessToken } = response.data;
    
    // Store token in cookie
    setCookie('accessToken', accessToken, 7); // 7 days
    
    return response.data;
  },

  // Signup user
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    const { accessToken } = response.data;
    
    // Store token in cookie
    setCookie('accessToken', accessToken, 7); // 7 days
    
    return response.data;
  },

  // Resend verification email
  async resendVerification(email: string): Promise<ResendVerificationResponse> {
    const response = await api.post<ResendVerificationResponse>('/auth/resend-verification', { email });
    return response.data;
  },

  // Forgot password
  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const response = await api.post<ForgotPasswordResponse>('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  async resetPassword(token: string, password: string): Promise<ResetPasswordResponse> {
    const response = await api.post<ResetPasswordResponse>('/auth/reset-password', { token, password });
    return response.data;
  },

  // Verify email
  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    const response = await api.patch<VerifyEmailResponse>(`/auth/verify-email?token=${token}`, undefined);
    return response.data;
  },

  // Logout user
  logout(): void {
    removeCookie('accessToken');
    // Clear any other auth-related data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
    }
  },

  // Get current user from token
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = getCookie('accessToken');
      if (!token) return null;
      
      const response = await api.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = getCookie('accessToken');
    return !!token;
  },

  // Get token
  getToken(): string | null {
    return getCookie('accessToken');
  },

  // Refresh token (if needed)
  async refreshToken(): Promise<string | null> {
    try {
      const response = await api.post<{ accessToken: string }>('/auth/refresh');
      const { accessToken } = response.data;
      setCookie('accessToken', accessToken, 7);
      return accessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  },
}; 