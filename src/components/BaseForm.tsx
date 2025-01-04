import { FormField } from '../types/form';

interface BaseFormLayoutProps<T> {
  fields: FormField<T>[];
  onSubmit: (data: T) => void;
  submitButtonText?: string;
}

export default function BaseFormLayout<T extends Record<string, any>>({
  fields,
  onSubmit,
  submitButtonText = 'Save',
}: BaseFormLayoutProps<T>) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {} as T;

    fields.forEach((field) => {
      const value = formData.get(field.name as string);

      // Process the value based on the field type
      switch (field.type) {
        case 'number':
          data[field.name] = value ? (Number(value) as unknown as T[keyof T]) : (0 as unknown as T[keyof T]); // Default to 0 or handle as needed
          break;
        case 'file':
          data[field.name] = value instanceof File ? (value as unknown as T[keyof T]) : (null as unknown as T[keyof T]); // Ensure it's a File or null
          break;
        default:
          data[field.name] = value ? (String(value) as unknown as T[keyof T]) : ('' as unknown as T[keyof T]); // Default to empty string
      }
    });

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        {fields.map((field) => (
          <div key={String(field.name)} className="border-b border-white/10 pb-12">
            <label htmlFor={String(field.name)} className="block text-sm font-medium text-white">
              {field.label}
            </label>
            <div className="mt-2">
              {renderField(field)}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold text-white">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  );
}

function renderField<T>(field: FormField<T>) {
  const commonClasses =
    'block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white placeholder:text-gray-500 focus:outline-indigo-500';

  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
      return (
        <input
          id={String(field.name)}
          name={String(field.name)}
          type={field.type}
          placeholder={field.placeholder}
          className={commonClasses}
          required={field.required}
        />
      );
    case 'number':
      return (
        <input
          id={String(field.name)}
          name={String(field.name)}
          type="number"
          placeholder={field.placeholder}
          className={commonClasses}
          required={field.required}
        />
      );
    case 'textarea':
      return (
        <textarea
          id={String(field.name)}
          name={String(field.name)}
          rows={3}
          placeholder={field.placeholder}
          className={commonClasses}
          required={field.required}
        />
      );
    case 'select':
      return (
        <select
          id={String(field.name)}
          name={String(field.name)}
          className={commonClasses}
          required={field.required}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    case 'file':
      return (
        <input
          id={String(field.name)}
          name={String(field.name)}
          type="file"
          className="block w-full text-base text-white focus:outline-indigo-500"
          required={field.required}
        />
      );
    default:
      return null;
  }
}