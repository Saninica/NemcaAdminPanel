// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  skip: number;
  page?: number;
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  detail: string | ValidationError[];
  status: number;
  timestamp?: string;
}

// Request Configuration
export interface RequestConfig {
  retries?: number;
  timeout?: number;
  skipAuth?: boolean;
}

// Loading State
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Common Store Interface
export interface BaseStore<T> extends LoadingState {
  data: T[];
  total: number;
  limit: number;
  skip: number;
  page: number;
  setPage: (page: number) => void;
  clearError: () => void;
} 