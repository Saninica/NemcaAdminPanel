import BaseFormLayout from '../BaseForm';
import { PageContentFormData, PageContentSchema } from '../../types/page';
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
  const { reset } = useForm<PageContentFormData>();

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



  const handleSubmit = async (data: PageContentFormData) => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('body', data.body);

    formData.append('cover_image', data.cover_image[0]);
    formData.append('page_id', data.page_id.toString());
    formData.append('language_code', data.language_code);
    formData.append('website_id', data.website_id.toString());
    
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    await createPageContent(formData);
    reset();
  };

  return (
    <BaseFormLayout<PageContentFormData>
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Content"
    />
  );
}
