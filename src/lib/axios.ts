import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.deejahstrands.co/api/v1'

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth token here
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 errors (unauthorized) - refresh token or redirect to login
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Implement refresh token logic here
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          // Call refresh token endpoint
          // Update tokens
          // Retry original request
        }
      } catch {
        // Redirect to login
        window.location.href = '/auth/login'
      }
    }

    return Promise.reject(error)
  }
) 