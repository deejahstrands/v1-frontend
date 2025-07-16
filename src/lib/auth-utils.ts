// Utility functions for token management

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; accessToken=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export const setToken = (token: string, days: number = 7): void => {
  if (typeof window === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `accessToken=${token}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  
  document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
}; 