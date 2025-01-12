import BaseFormLayout from './BaseForm';
import { PageContentSchema } from '../types/page';
import useContentStore from '../store/useContentsStore';
import { FormField, InputType } from '../types/form';
import { useEffect, useState } from 'react';
import { fetchModelMetadata, ModelMetadataResponse } from '../api/metadata';
import { useForm } from 'react-hook-form';


export default function PageContentForm() {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeForm = async () => {
      try {
        setLoading(true);
        const metadata: ModelMetadataResponse = await fetchModelMetadata();
        const modelMetadata = metadata.models['PageContent'];

        if (!modelMetadata) {
          throw new Error(`Model PageContent not found in metadata.`);
        }
        
        const dynamicFields: FormField<any, any>[] = [];
        
        for (const [fieldName, fieldInfo] of Object.entries(modelMetadata)) {
          const { type, nullable, foreign_key } = fieldInfo;
          
          let inputType: InputType = 'text';
          
          switch (type) {
            case 'int':
              inputType = 'number';
              break;
            case 'str':
              inputType = 'text';
              if (fieldName.includes('image') || fieldName.includes('img')) {
                inputType = 'img';
              }
              break;
            case 'textarea':
              inputType = 'textarea';
              break;
            default:
              inputType = 'text';
          }
                   
          
          // Customize label (optional)
          const label = fieldName
            .replace('_', ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
          
          dynamicFields.push({
            name: fieldName,
            label,
            type: inputType,
            placeholder: `Enter ${label}`,
            required: !nullable,
          });
        }
        
        setFields(dynamicFields);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error fetching form metadata.');
        setLoading(false);
      }
    };
    
    initializeForm();
  }, []);



  const { createPageContent } = useContentStore();
  const { reset } = useForm<PageContentSchema>();


  const handleSubmit = async (data: PageContentSchema) => {
    await createPageContent(data);
    reset(); // Reset the form after successful submission
  };

  return (
    <BaseFormLayout<PageContentSchema>
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Content"
    />
  );
}
