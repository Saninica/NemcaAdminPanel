import { ValidationPatterns, ValidationMessages } from '../types/form';

// Common validation functions
export const validationRules = {
  required: (message?: string) => ({
    required: message || ValidationMessages.required,
  }),

  email: (message?: string) => ({
    pattern: {
      value: ValidationPatterns.email,
      message: message || ValidationMessages.email,
    },
  }),

  phone: (message?: string) => ({
    pattern: {
      value: ValidationPatterns.phone,
      message: message || ValidationMessages.phone,
    },
  }),

  url: (message?: string) => ({
    pattern: {
      value: ValidationPatterns.url,
      message: message || ValidationMessages.url,
    },
  }),

  minLength: (min: number, message?: string) => ({
    minLength: {
      value: min,
      message: message || ValidationMessages.minLength(min),
    },
  }),

  maxLength: (max: number, message?: string) => ({
    maxLength: {
      value: max,
      message: message || ValidationMessages.maxLength(max),
    },
  }),

  min: (min: number, message?: string) => ({
    min: {
      value: min,
      message: message || ValidationMessages.min(min),
    },
  }),

  max: (max: number, message?: string) => ({
    max: {
      value: max,
      message: message || ValidationMessages.max(max),
    },
  }),

  numeric: (message?: string) => ({
    pattern: {
      value: ValidationPatterns.numeric,
      message: message || 'Must be a valid number',
    },
  }),

  alphanumeric: (message?: string) => ({
    pattern: {
      value: ValidationPatterns.alphanumeric,
      message: message || 'Must contain only letters and numbers',
    },
  }),

  slug: (message?: string) => ({
    pattern: {
      value: ValidationPatterns.slug,
      message: message || 'Must be a valid slug (lowercase letters, numbers, and hyphens)',
    },
  }),

  custom: (validator: (value: string) => boolean | string, message?: string) => ({
    validate: (value: string) => validator(value) || message || 'Invalid value',
  }),

  // Combine multiple validations
  combine: (...validations: Record<string, unknown>[]) => {
    return Object.assign({}, ...validations);
  },
};

// Helper functions for specific validations
export const validatePassword = (password: string): boolean => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const validateImageFile = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return validateFileType(file, allowedTypes) && validateFileSize(file, 5); // 5MB max
};

// Sanitization functions
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '');
};

// Form data processing
export const processFormData = <T extends Record<string, unknown>>(data: T): T => {
  const processed = { ...data } as Record<string, unknown>;
  
  Object.keys(processed).forEach((key) => {
    const value = processed[key];
    
    // Sanitize string values
    if (typeof value === 'string') {
      processed[key] = sanitizeInput(value);
    }
    
    // Convert empty strings to null for optional fields
    if (value === '') {
      processed[key] = null;
    }
  });
  
  return processed as T;
}; 