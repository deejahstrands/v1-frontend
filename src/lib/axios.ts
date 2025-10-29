import axios from 'axios'
import { handleTokenExpiration } from './auth-utils'

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

    // Handle 401 errors (unauthorized) - token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Check if it's a token expired error
      const errorMessage = error.response?.data?.message || ''
      const isTokenExpired = errorMessage.toLowerCase().includes('token expired') || 
                            errorMessage.toLowerCase().includes('expired') ||
                            error.response?.data?.name === 'ExpiredTokenError'

      if (isTokenExpired) {
        // Use the utility function to handle token expiration
        handleTokenExpiration('/admin-auth/login')
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
) 