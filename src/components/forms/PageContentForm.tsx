import BaseFormLayout from '../BaseForm';
import { PageContentSchema } from '../../types/page';
import useContentStore from '../../store/useContentsStore';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { initializeForm } from '../../utils/createForm';


export default function PageContentForm() {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { createPageContent } = useContentStore();
  const { reset } = useForm<PageContentSchema>();

  useEffect(() => {
    initializePageContentForm('PageContent');
  }, []);

  const initializePageContentForm = async (modelName: string) => {
    setLoading(true);
    try {
      const data = await initializeForm(modelName);
      setLoading(false);
      setFields(data || []);
    }
    catch (err: any) {
      setError(err.message || 'Error fetching page content form.');
      setLoading(false);
    };
  };



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
