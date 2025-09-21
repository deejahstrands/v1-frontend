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

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  avatar: string;
}

export interface UpdateProfileResponse {
  message: string;
  data: User;
}

// Cookie utility functions
const setCookie = (name: string, value: string, days: number = 7) => {
  console.log('🍪 Setting cookie:', { name, value: value.substring(0, 20) + '...', days });
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  // Remove secure flag for development and use lax samesite for better compatibility
  const secureFlag = process.env.NODE_ENV === 'production' ? '; secure' : '';
  const sameSite = process.env.NODE_ENV === 'production' ? '; samesite=strict' : '; samesite=lax';
  const cookieString = `${name}=${value}; expires=${expires.toUTCString()}; path=/${secureFlag}${sameSite}`;
  
  console.log('🍪 Cookie string:', cookieString);
  document.cookie = cookieString;
  
  // Verify cookie was set
  const cookieValue = getCookie(name);
  console.log('🍪 Cookie verification:', { name, valueSet: !!cookieValue, valueLength: cookieValue?.length });
};

const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
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
      
      if (!token) {
        return null;
      }
      
      const response = await api.get<{ message: string; data: User }>('/users/me');
      
      return response.data.data; // Extract user data from nested structure
    } catch (error) {
      console.error('👤 Auth service: Error getting current user:', error);
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
    const token = getCookie('accessToken');
      return token;
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

  // Update user profile
  async updateProfile(profileData: UpdateProfileData): Promise<UpdateProfileResponse> {
    const response = await api.patch<UpdateProfileResponse>('/users/me', profileData);
    return response.data;
  },
}; 