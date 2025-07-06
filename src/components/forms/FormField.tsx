import { FieldError, Path, UseFormRegister, FieldValues } from 'react-hook-form';
import { FormField as FormFieldType, SelectOption } from '../../types/form';
import TinyMCE from '../TinyEditor';

interface FormFieldComponentProps<T extends FieldValues> {
  field: FormFieldType<T, keyof T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  value?: unknown;
  options?: SelectOption[];
  onTinyMceChange?: (content: string) => void;
  showTinyMce?: boolean;
}

export default function FormFieldComponent<T extends FieldValues>({
  field,
  register,
  error,
  value,
  options = [],
  onTinyMceChange,
  showTinyMce = false,
}: FormFieldComponentProps<T>) {
  const fieldId = String(field.name);
  const isRequired = field.required || field.validation?.required;

  const getInputClassName = (hasError: boolean) => {
    const baseClasses = "block w-full shadow-sm sm:text-sm rounded-md bg-gray-700 text-white";
    const errorClasses = hasError 
      ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500";
    const disabledClasses = field.disabled ? "opacity-50 cursor-not-allowed" : "";
    
    return `${baseClasses} ${errorClasses} ${disabledClasses}`;
  };

  const renderInput = () => {
    // Handle TinyMCE editor
    if (showTinyMce && field.name === 'body') {
      return (
        <div className="col-span-full mb-14">
          <TinyMCE 
            nameProp={String(field.name)} 
            idProp={fieldId} 
            onContentChange={onTinyMceChange || (() => {})}
          />
        </div>
      );
    }

    // Handle select dropdown (for ID fields and explicit select type)
    if (field.type === 'select' || field.label?.toString().includes('Id')) {
      return (
        <select
          id={fieldId}
          {...register(field.name as Path<T>, field.validation)}
          disabled={field.disabled}
          className={getInputClassName(!!error)}
        >
          <option value="">Select {field.label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    // Handle textarea
    if (field.type === 'textarea') {
      return (
        <textarea
          id={fieldId}
          placeholder={field.placeholder}
          rows={field.rows || 4}
          cols={field.cols}
          disabled={field.disabled}
          readOnly={field.readOnly}
          {...register(field.name as Path<T>, field.validation)}
          className={getInputClassName(!!error)}
        />
      );
    }

    // Handle file input
    if (field.type === 'file' || field.type === 'img') {
      return (
        <div className="col-span-full">
          <input
            id={fieldId}
            type="file"
            accept={field.accept}
            multiple={field.multiple}
            disabled={field.disabled}
            {...register(field.name as Path<T>, field.validation)}
            className={getInputClassName(!!error)}
          />
          {/* Show current image if editing */}
          {value && field.type === 'img' && typeof value === 'string' ? (
            <div className="mt-3">
              <label className="text-white text-sm block mb-2">Current Image:</label>
              <img
                src={String(value)}
                alt="Current"
                className="h-40 w-96 object-cover rounded-md border border-gray-600"
              />
            </div>
          ) : null}
        </div>
      );
    }

    // Handle checkbox
    if (field.type === 'checkbox') {
      return (
        <div className="flex items-center">
          <input
            id={fieldId}
            type="checkbox"
            disabled={field.disabled}
            {...register(field.name as Path<T>, field.validation)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded bg-gray-700"
          />
          <label htmlFor={fieldId} className="ml-3 text-sm text-white">
            {field.label}
          </label>
        </div>
      );
    }

    // Handle standard input types
    return (
      <input
        id={fieldId}
        type={field.type}
        placeholder={field.placeholder}
        min={field.min}
        max={field.max}
        step={field.step}
        disabled={field.disabled}
        readOnly={field.readOnly}
        {...register(field.name as Path<T>, field.validation)}
        className={`${getInputClassName(!!error)} ${field.type === 'date' || field.type === 'datetime-local' ? '' : 'h-12'}`}
      />
    );
  };

  return (
    <div className={`${field.type === 'checkbox' ? '' : 'col-span-full'}`}>
      {field.type !== 'checkbox' && (
        <label htmlFor={fieldId} className="block text-sm font-medium text-white mb-1">
          {field.label}
          {isRequired && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      {field.description && field.type !== 'checkbox' && (
        <p className="text-xs text-gray-400 mb-2">{field.description}</p>
      )}
      
      <div className="mt-1">
        {renderInput()}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-400" id={`${fieldId}-error`}>
          {error.message || 'This field is required'}
        </p>
      )}
    </div>
  );
} 