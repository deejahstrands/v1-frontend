import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from cookies
    const token =
      typeof window !== "undefined"
        ? document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1]
        : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if this is a login request (let the login form handle the error)
      const isLoginRequest = error.config?.url?.includes('/auth/login') || 
                            error.config?.url?.includes('/auth/register');
      
      if (!isLoginRequest && typeof window !== "undefined") {
        // Clear token and redirect to appropriate login
        document.cookie =
          "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        
        // Redirect to admin login if on admin route, otherwise user login
        const isAdminRoute = window.location.pathname.startsWith('/admin');
        const currentPath = window.location.pathname + window.location.search;
        const returnUrl = encodeURIComponent(currentPath);
        const loginUrl = isAdminRoute 
          ? `/admin-auth/login?returnUrl=${returnUrl}` 
          : `/auth/login?returnUrl=${returnUrl}`;
        
        window.location.href = loginUrl;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
