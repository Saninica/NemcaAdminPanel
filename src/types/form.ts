export type FieldType = 'text' | 'textarea' | 'select' | 'file' | 'number' | 'email' | 'password';

export interface FormField<T, K extends keyof T = keyof T> {
  name: K;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { label: string; value: string }[]; // For select fields
  required?: boolean;
}