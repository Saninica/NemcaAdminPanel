import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { FormField } from '../types/form';
import TinyMCE from './TinyEditor';
import { useEffect } from 'react';

interface BaseFormProps<T extends FieldValues> {
  fields: FormField<T, keyof T>[];
  fieldValues?: T;
  onSubmit: SubmitHandler<T>;
  submitButtonText: string;
}

function BaseFormLayout<T extends FieldValues>({
  fields,
  onSubmit,
  submitButtonText,
  fieldValues
}: BaseFormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<T>();

  useEffect(() => {
    if (fieldValues) {
      reset(fieldValues); // Update form with new field values
    }
  }, [fieldValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      <div className='space-y-12'>
        <div className="border-b border-gray-900/10 pb-12 ">

          <h3 className="text-lg leading-6 font-medium text-white ">Form</h3>
          <p className="mt-1 text-sm text-gray-400">
            Please fill out the form below to create a new entry.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-3 gap-y-12 sm:grid-cols-6 ">
            {fields.map((field) => (
              <div
                key={String(field.name)}
                className={`col-span-full`}>
                <label
                  htmlFor={String(field.name)}
                  className="block text-sm font-medium text-white"
                >
                  {field.label}
                </label>
                <div className="mt-1 col-span-full">
                  {field.type === 'select' && field.options ? (
                    <select
                      id={String(field.name)}
                      {...register(field.name as any, { required: field.required })}
                      className={`block w-full shadow-sm sm:text-sm rounded-md ${errors[field.name]
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                        } bg-gray-700 text-white`}
                    >
                      <option>Select {field.label}</option>
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
                      className={`block w-full shadow-sm sm:text-sm rounded-md ${errors[field.name]
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                        } bg-gray-700 text-white`}
                    />
                  ) : field.type === 'img' ? (
                    <div className='col-span-full'>
                      <input
                        id={String(field.name)}
                        type="file"
                        {...register(field.name as any, { required: field.required })}
                        className={`block w-full shadow-sm sm:text-sm rounded-md ${errors[field.name]
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                          } bg-gray-700 text-white`}
                      />
                    </div>
                  ) : field.name.toString().includes('created') || field.name.toString().includes("date") ? (
                    <div className='col-span-full'>
                      <input
                        id={String(field.name)}
                        type={field.type}
                        
                        placeholder={field.placeholder}
                        {...register(field.name as any, { required: field.required })}
                        className={`block w-full shadow-sm sm:text-sm rounded-md ${errors[field.name]
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                          } bg-gray-700 text-white`}
                      />
                    </div>

                  ) : field.name == 'body' && submitButtonText.includes('Blog') ? (
                    <div className='col-span-full mb-14'>
                      <TinyMCE nameProp={field.name} idProp={String(field.name)}/>
                    </div>
                  ) : (
                    <div className='col-span-full'>
                      <input
                        id={String(field.name)}
                        type={field.type}
                        placeholder={ field.name == 'page_id' ? 'ID Değerleri Sayfalar Kısmında görülebilir.' : field.placeholder}
                        {...register(field.name as any, { required: field.required })}
                        className={`block w-full h-12 shadow-sm sm:text-sm rounded-md ${errors[field.name]
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                          } bg-gray-700 text-white`}
                      />
                    </div>
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