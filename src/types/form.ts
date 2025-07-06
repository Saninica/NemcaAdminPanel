import { FieldValues, Path, RegisterOptions, FieldError } from 'react-hook-form';

// Input types
export type InputType = 
  | 'text' 
  | 'number' 
  | 'email' 
  | 'password' 
  | 'tel' 
  | 'url' 
  | 'date' 
  | 'datetime-local' 
  | 'time' 
  | 'file' 
  | 'img' 
  | 'textarea' 
  | 'select' 
  | 'checkbox' 
  | 'radio'
  | 'hidden';

// Form field definition
export interface FormField<T extends FieldValues, K extends keyof T> {
  name: Path<T>;
  label: string;
  type: InputType;
  placeholder?: string;
  required?: boolean;
  validation?: RegisterOptions<T, Path<T>>;
  options?: SelectOption[];
  multiple?: boolean;
  accept?: string; // For file inputs
  rows?: number; // For textarea
  cols?: number; // For textarea
  min?: number | string;
  max?: number | string;
  step?: number | string;
  disabled?: boolean;
  readOnly?: boolean;
  defaultValue?: T[K];
  className?: string;
  description?: string;
}

// Select option type
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

// Form state
export interface FormState<T extends FieldValues> {
  values: T;
  errors: Partial<Record<keyof T, FieldError>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  touchedFields: Partial<Record<keyof T, boolean>>;
}

// Form configuration
export interface FormConfig<T extends FieldValues> {
  fields: FormField<T, keyof T>[];
  defaultValues?: Partial<T>;
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
  reValidateMode?: 'onChange' | 'onBlur' | 'onSubmit';
  submitOnEnter?: boolean;
  resetAfterSubmit?: boolean;
}

// Form validation rules
export interface ValidationRule {
  required?: boolean | string;
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  validate?: (value: unknown) => boolean | string | Promise<boolean | string>;
}

// Common validation patterns
export const ValidationPatterns = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  url: /^https?:\/\/.+/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  numeric: /^\d+$/,
  decimal: /^\d+(\.\d+)?$/,
} as const;

// Common validation messages
export const ValidationMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  url: 'Please enter a valid URL',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be no more than ${max} characters`,
  min: (min: number) => `Must be at least ${min}`,
  max: (max: number) => `Must be no more than ${max}`,
  pattern: 'Please enter a valid value',
} as const;