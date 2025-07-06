import React, { useMemo, useCallback, useRef, useState, useEffect } from 'react';

// Memoization utilities
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Debounce function for performance optimization
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return ((...args: Parameters<T>): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};

// Throttle function for performance optimization
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean;
  
  return ((...args: Parameters<T>): void => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(target);

    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, [options]);

  return { targetRef, isIntersecting };
};

// Virtual scrolling utilities
export const calculateVisibleRange = (
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number
) => {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    totalItems - 1
  );
  
  return { startIndex, endIndex };
};

// Image lazy loading with placeholder
export const useImageLazyLoad = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
  });

  useEffect(() => {
    if (isIntersecting && src) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      img.src = src;
    }
  }, [isIntersecting, src]);

  return { targetRef, imageSrc, isLoaded };
};

// Bundle splitting helpers
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  return React.lazy(importFunc);
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

// Async function with timeout
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    ),
  ]);
};

// Batch updates for better performance
export class BatchProcessor<T> {
  private batch: T[] = [];
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private processBatch: (items: T[]) => void,
    private batchSize: number = 10,
    private delay: number = 100
  ) {}

  add(item: T) {
    this.batch.push(item);

    if (this.batch.length >= this.batchSize) {
      this.flush();
    } else if (!this.timeoutId) {
      this.timeoutId = setTimeout(() => this.flush(), this.delay);
    }
  }

  flush() {
    if (this.batch.length > 0) {
      this.processBatch([...this.batch]);
      this.batch = [];
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

// Cache manager for API responses
export class CacheManager<T> {
  private cache = new Map<string, { data: T; timestamp: number }>();
  private maxAge: number;

  constructor(maxAgeMs: number = 5 * 60 * 1000) { // 5 minutes default
    this.maxAge = maxAgeMs;
  }

  set(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// React performance hooks
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T
): T => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(
    ((...args: Parameters<T>) => callbackRef.current(...args)) as T,
    []
  );
};

export const useDeepMemo = <T>(factory: () => T, deps: any[]): T => {
  const depsRef = useRef<any[]>();
  const resultRef = useRef<T>();

  if (!depsRef.current || !deepEqual(depsRef.current, deps)) {
    depsRef.current = deps;
    resultRef.current = factory();
  }

  return resultRef.current!;
};

// Deep equality check
const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  
  if (a == null || b == null) return false;
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }
  
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    if (keysA.length !== keysB.length) return false;
    
    return keysA.every(key => deepEqual(a[key], b[key]));
  }
  
  return false;
};

// Resource preloader
export const preloadResource = (url: string, type: 'image' | 'script' | 'style') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  
  switch (type) {
    case 'image':
      link.as = 'image';
      break;
    case 'script':
      link.as = 'script';
      break;
    case 'style':
      link.as = 'style';
      break;
  }
  
  document.head.appendChild(link);
}; 