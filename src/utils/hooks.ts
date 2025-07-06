import { useState, useEffect, useCallback, useMemo } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { ApiError, PaginatedResponse } from '../types/api';

// Hook for managing async operations with loading and error states
export const useAsyncOperation = <T = unknown, P = unknown>(
  operation: (params: P) => Promise<T>
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (params: P) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await operation(params);
      setData(result);
      return result;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [operation]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    isLoading,
    error,
    execute,
    reset,
  };
};

// Hook for managing pagination
export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);
  const hasNextPage = useMemo(() => page < totalPages, [page, totalPages]);
  const hasPreviousPage = useMemo(() => page > 1, [page]);
  const skip = useMemo(() => (page - 1) * limit, [page, limit]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setPage(prev => prev - 1);
    }
  }, [hasPreviousPage]);

  const updateFromResponse = useCallback((response: PaginatedResponse<unknown>) => {
    setTotal(response.total);
    if (response.page) {
      setPage(response.page);
    }
  }, []);

  return {
    page,
    limit,
    total,
    totalPages,
    skip,
    hasNextPage,
    hasPreviousPage,
    setPage: goToPage,
    setLimit,
    nextPage,
    previousPage,
    updateFromResponse,
  };
};

// Hook for debouncing values (useful for search)
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for managing form state with better error handling
export const useFormWithValidation = <T extends FieldValues>(
  form: UseFormReturn<T>,
  onSubmit: (data: T) => Promise<void>
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = form.handleSubmit(async (data: T) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await onSubmit(data);
    } catch (error) {
      const apiError = error as ApiError;
      setSubmitError(apiError.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  });

  const clearError = useCallback(() => {
    setSubmitError(null);
  }, []);

  return {
    handleSubmit,
    isSubmitting,
    submitError,
    clearError,
    form,
  };
};

// Hook for managing local storage with type safety
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

// Hook for managing media queries
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// Hook for managing online/offline status
export const useOnlineStatus = (): boolean => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return isOnline;
};

// Hook for managing previous value
export const usePrevious = <T>(value: T): T | undefined => {
  const [current, setCurrent] = useState<T>(value);
  const [previous, setPrevious] = useState<T | undefined>(undefined);

  if (value !== current) {
    setPrevious(current);
    setCurrent(value);
  }

  return previous;
};

// Hook for managing component mount status
export const useIsMounted = (): React.MutableRefObject<boolean> => {
  const isMounted = useCallback(() => {
    return { current: true };
  }, [])();

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  return isMounted;
}; 