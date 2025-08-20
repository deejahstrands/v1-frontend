import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.deejahstrands.co/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from cookies or localStorage
    const token = typeof window !== 'undefined' ? 
      document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] : 
      null;
    
    console.log('🌐 API Request interceptor:', { 
      url: config.url, 
      hasToken: !!token, 
      tokenLength: token?.length,
      method: config.method 
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🌐 API Request: Authorization header set');
    } else {
      console.log('🌐 API Request: No token found, request will be unauthenticated');
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
    console.log('🌐 API Response interceptor:', { 
      url: response.config.url, 
      status: response.status,
      method: response.config.method 
    });
    return response;
  },
  (error) => {
    console.log('🌐 API Response interceptor error:', { 
      url: error.config?.url, 
      status: error.response?.status,
      method: error.config?.method,
      message: error.message 
    });
    
    if (error.response?.status === 401) {
      console.log('🌐 API: 401 Unauthorized, clearing token');
      // Clear token but don't redirect automatically
      // Let individual components handle their own redirect logic
      if (typeof window !== 'undefined') {
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
        // Don't redirect here - let components decide where to go
        // window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api; 