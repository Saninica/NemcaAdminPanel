import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import { ApiError, ApiErrorResponse, RequestConfig } from '../types/api';

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: RequestConfig;
  }
}

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://185.23.72.79/admin-api/api/';
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;

// Create axios instance with enhanced configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Helper function to get auth token
const getAuthToken = (): string | null => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return parsed.state?.token || null;
    }
    return null;
  } catch {
    return null;
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available and not explicitly skipped
    const customConfig = config.metadata as RequestConfig | undefined;
    if (!customConfig?.skipAuth) {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful response in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      _retryCount?: number;
    };

    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error);
    }

    // Handle different error types
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem('auth-storage');
          if (window.location.pathname !== '/') {
            window.location.href = '/';
          }
          toast.error('Session expired. Please login again.');
          break;
        
        case 403:
          toast.error('Access denied. You do not have permission to perform this action.');
          break;
        
        case 404:
          toast.error('Resource not found.');
          break;
        
        case 422:
          // Validation errors
          if (Array.isArray(data.detail)) {
            data.detail.forEach((err) => {
              toast.error(`${err.field}: ${err.message}`);
            });
          } else {
            toast.error(typeof data.detail === 'string' ? data.detail : 'Validation error');
          }
          break;
        
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
        
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        
        default:
          toast.error(typeof data?.detail === 'string' ? data.detail : 'An unexpected error occurred');
      }

      // Retry logic for certain status codes
      const customConfig = originalRequest.metadata as RequestConfig | undefined;
      const maxRetries = customConfig?.retries || MAX_RETRIES;
      const shouldRetry = [408, 429, 500, 502, 503, 504].includes(status);
      
      if (shouldRetry && originalRequest && !originalRequest._retry) {
        originalRequest._retryCount = originalRequest._retryCount || 0;
        
        if (originalRequest._retryCount < maxRetries) {
          originalRequest._retryCount++;
          
          // Exponential backoff
          const delay = Math.pow(2, originalRequest._retryCount) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          
          return axiosInstance(originalRequest);
        }
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
    } else {
      // Request setup error
      toast.error('Request configuration error.');
    }

    // Create standardized error object
    const errorMessage = error.response?.data?.detail;
    const message = typeof errorMessage === 'string' ? errorMessage : error.message || 'An error occurred';
    
    const apiError: ApiError = {
      message,
      status: error.response?.status || 0,
      code: error.code,
      details: error.response?.data,
    };

    return Promise.reject(apiError);
  }
);

// Helper function to make requests with custom config
export const makeRequest = <T = any>(
  config: InternalAxiosRequestConfig & { metadata?: RequestConfig }
): Promise<AxiosResponse<T>> => {
  return axiosInstance(config);
};

export default axiosInstance;