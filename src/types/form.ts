export type InputType = 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'img';

export interface Option {
  label: string;
  value: string | number;
}

export interface FormField<T, K extends keyof T> {
  name: K;
  label: string;
  type: InputType;
  placeholder?: string;
  required: boolean;
  options?: Option[]; // For select, radio, etc.
}