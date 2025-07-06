import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { FormField, FormConfig } from '../types/form';
import { processFormData } from '../utils/validation';
import FormFieldComponent from './forms/FormField';
import LoadingComponent from './LoadingComponent';
import useLangStore from '../store/useLangStore';
import useWebsite from '../store/useWebsite';
import usePageStore from '../store/usePageStore';

interface BaseFormProps<T extends FieldValues> {
  config: FormConfig<T>;
  initialValues?: Partial<T>;
  onSubmit: SubmitHandler<T>;
  submitButtonText: string;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

function BaseForm<T extends FieldValues>({
  config,
  initialValues,
  onSubmit,
  submitButtonText,
  isLoading = false,
  error = null,
  className = '',
}: BaseFormProps<T>) {
  const { getLangs, data: langs } = useLangStore();
  const { getWebsites, websites } = useWebsite();
  const { getPages, pages } = usePageStore();
  
  const [tinyMceContent, setTinyMceContent] = useState<string>('');

  // Form setup with enhanced configuration
  const form = useForm<T>({
    defaultValues: (initialValues || config.defaultValues || {}) as any,
    mode: config.validationMode || 'onBlur',
    reValidateMode: config.reValidateMode || 'onChange',
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = form;

  // Reset form when initial values change
  useEffect(() => {
    if (initialValues) {
      reset(initialValues as any);
    }
  }, [initialValues, reset]);

  // Load required data based on field types
  useEffect(() => {
    const loadData = async () => {
      const hasLangField = config.fields.some(field => field.label?.includes('Language'));
      const hasWebsiteField = config.fields.some(field => field.label?.includes('Website'));
      const hasPageField = config.fields.some(field => field.label?.includes('Page'));

      if (hasLangField && langs.length === 0) {
        await getLangs(1);
      }
      if (hasWebsiteField && websites.length === 0) {
        await getWebsites(10, 0);
      }
      if (hasPageField && pages.length === 0) {
        await getPages(10, 0);
      }
    };

    loadData();
  }, [config.fields, getLangs, getWebsites, getPages, langs.length, websites.length, pages.length]);

  // Get options for select fields
  const getFieldOptions = useCallback((field: FormField<T, keyof T>) => {
    if (field.options) return field.options;
    
    if (field.label?.includes('Website')) {
      return websites.map(website => ({
        value: website.id,
        label: website.name,
      }));
    }
    if (field.label?.includes('Page')) {
      return pages.map(page => ({
        value: page.id,
        label: page.name || `Page ${page.id}`,
      }));
    }
    if (field.label?.includes('Language')) {
      return langs.map((lang: any) => ({
        value: lang.id,
        label: lang.name || lang.code,
      }));
    }
    
    return [];
  }, [websites, pages, langs]);

  // Handle TinyMCE content changes
  const handleTinyMceContentChange = useCallback((content: string) => {
    setTinyMceContent(content);
    (setValue as any)('body', content);
  }, [setValue]);

  // Determine if TinyMCE should be shown
  const shouldShowTinyMce = useMemo(() => {
    return submitButtonText.toLowerCase().includes('blog');
  }, [submitButtonText]);

  // Enhanced submit handler
  const onSubmitHandler = useCallback(async (data: T) => {
    try {
      let processedData = processFormData(data);

      // Add TinyMCE content for blog forms
      if (shouldShowTinyMce && tinyMceContent.length > 0) {
        processedData = { ...processedData, body: tinyMceContent };
      }

      await onSubmit(processedData);

      // Reset form if configured to do so
      if (config.resetAfterSubmit) {
        reset();
        setTinyMceContent('');
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }, [onSubmit, shouldShowTinyMce, tinyMceContent, config.resetAfterSubmit, reset]);

  // Handle Enter key submission
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (config.submitOnEnter && e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(onSubmitHandler)();
    }
  }, [config.submitOnEnter, handleSubmit, onSubmitHandler]);

  // Watch for form changes to provide real-time feedback
  const watchedValues = watch();

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <form 
        onSubmit={handleSubmit(onSubmitHandler)} 
        onKeyDown={handleKeyDown}
        encType="multipart/form-data"
        className="space-y-8"
      >
        {/* Form Header */}
        <div className="bg-gray-800 px-6 py-4 rounded-lg border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">
            {config.fields.find(f => f.type === 'hidden') ? 'Edit' : 'Create'} Form
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Please fill out all required fields marked with an asterisk (*).
          </p>
        </div>

        {/* Global Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form Fields */}
        <div className="bg-gray-800 px-6 py-6 rounded-lg">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {config.fields.map((field) => (
              <FormFieldComponent
                key={String(field.name)}
                field={field}
                register={register}
                error={errors[field.name] as any}
                value={watchedValues[field.name]}
                options={getFieldOptions(field)}
                onTinyMceChange={handleTinyMceContentChange}
                showTinyMce={shouldShowTinyMce}
              />
            ))}
          </div>
        </div>

        {/* Submit Section */}
        <div className="bg-gray-800 px-6 py-4 rounded-lg">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 border border-gray-500 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </div>
              ) : (
                submitButtonText
              )}
            </button>
          </div>
          
          {/* Form hints */}
          {config.submitOnEnter && (
            <p className="mt-2 text-xs text-gray-500 text-right">
              Press Cmd/Ctrl + Enter to submit
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default BaseForm;