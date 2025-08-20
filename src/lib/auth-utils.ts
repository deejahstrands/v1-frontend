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

/**
 * Handle token expiration by clearing auth data and redirecting to login
 * @param redirectTo - Optional redirect path (defaults to admin login)
 */
export function handleTokenExpiration(redirectTo: string = '/admin-auth/login'): void {
  // Clear all auth data
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('admin_remembered_credentials')
  }
  
  // Show session expired message
  if (typeof window !== 'undefined') {
    // Create and show a toast notification
    const toast = document.createElement('div')
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      max-width: 300px;
    `
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <strong>Session Expired</strong>
      </div>
      <div style="margin-top: 8px; opacity: 0.9;">
        Your session has expired. Please log in again.
      </div>
    `
    document.body.appendChild(toast)
    
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 5000)
    
    // Redirect to login after showing toast
    setTimeout(() => {
      window.location.href = redirectTo
    }, 1000)
  }
} 