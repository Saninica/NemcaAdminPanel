import BaseFormLayout from '../BaseForm';
import { PageContentFormData } from '../../types/page';
import useContentStore from '../../store/useContentsStore';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { initializeForm } from '../../utils/createForm';
import { toast } from 'react-toastify';


export default function PageContentForm() {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { createPageContent } = useContentStore();

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

    if (data.cover_image){
      formData.append('cover_image', data.cover_image[0]);
    }


    formData.append('page_id', data.page_id.toString());
    formData.append('language_id', data.language_id.toString());
    
    
    formData.append('price', data?.price?.toString() || '0.0');
    
    
    if (Number(data.website_id)) {
      formData.append('website_id', data.website_id.toString());
    } 
    
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);

      if (key == 'cover_image'  && !(value instanceof File)) {
        formData.delete(key);
      }
    }
    
    await createPageContent(formData);
    toast.success('Page content created successfully');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <BaseFormLayout<PageContentFormData>
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Content"
    />
  );
}
