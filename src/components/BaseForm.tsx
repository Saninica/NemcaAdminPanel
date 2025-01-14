import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { FormField } from '../types/form';
import TinyMCE from './TinyEditor';

interface BaseFormProps<T extends FieldValues> {
  fields: FormField<T, keyof T>[];
  onSubmit: SubmitHandler<T>;
  submitButtonText: string;
}

function BaseFormLayout<T extends FieldValues>({
  fields,
  onSubmit,
  submitButtonText,
  
}: BaseFormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<T>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 divide-y" encType="multipart/form-data">
      <div className="space-y-8 divide-y ">
        {/* Form Section */}
        <div className="pt-8">
          <h3 className="text-lg leading-6 font-medium text-white ">Form</h3>
          <p className="mt-1 text-sm text-gray-400">
            Please fill out the form below to create a new entry.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 ">
            {fields.map((field) => (
              <div
                key={String(field.name)}
                className={`sm:col-span-${
                  field.type === 'textarea' || field.type === 'select' ? 6 : 3
                }`}
              >
                <label
                  htmlFor={String(field.name)}
                  className="block text-sm font-medium text-white"
                >
                  {field.label}
                </label>
                <div className="mt-1">
                  {field.type === 'select' && field.options ? (
                    <select
                      id={String(field.name)}
                      {...register(field.name as any, { required: field.required })}
                      className={`block w-full shadow-sm sm:text-sm rounded-md ${
                        errors[field.name]
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                      } bg-gray-700 text-white`}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      id={String(field.name)}
                      placeholder={field.placeholder}
                      {...register(field.name as any, { required: field.required })}
                      className={`block w-full shadow-sm sm:text-sm rounded-md ${
                        errors[field.name]
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                      } bg-gray-700 text-white`}
                    />
                  ) : field.type === 'img' ? (
                    <input
                      id={String(field.name)}
                      type="file"
                      {...register(field.name as any, { required: field.required })}
                      className={`block w-full shadow-sm sm:text-sm rounded-md ${
                        errors[field.name]
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                      } bg-gray-700 text-white`}
                    />
                  ): field.name == 'body' && submitButtonText.includes('Blog') ? (
                      <TinyMCE />
                  ) : (
                    <input 
                      id={String(field.name)}
                      type={field.type}
                      placeholder={field.placeholder}
                      {...register(field.name as any, { required: field.required })}
                      className={`block w-full h-12 shadow-sm sm:text-sm rounded-md ${
                        errors[field.name]
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                      } bg-gray-700 text-white`}
                    />
                  )}
                </div>
                {errors[field.name] && (
                  <p className="mt-2 text-sm text-red-600" id={`${field.name as string}-error`}>
                    This field is required
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {submitButtonText}
          </button>
        </div>
      </div>
    </form>
  );
}

export default BaseFormLayout;