import BaseFormLayout from '../BaseForm';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { initializeForm } from '../../utils/createForm';
import useWebsite from '../../store/useWebsite';
import { WebsiteBase, WebsiteFormData } from '../../types/website';


export default function WebsiteForm() {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { createWebsite } = useWebsite();
  const { reset } = useForm<WebsiteBase>();

  useEffect(() => {
    initializeWebsiteForm('Website');
  }, []);

  const initializeWebsiteForm = async (modelName: string) => {
    setLoading(true);
    try {
      const data = await initializeForm(modelName);
      setLoading(false);
      setFields(data || []);
    }
    catch (err: any) {
      setError(err.message || 'Error fetching website form.');
      setLoading(false);
    };
  };



  const handleSubmit = async (data: WebsiteFormData) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('domain_url', data.domain_url);

    formData.append('favicon_image', data.favicon_image[0]);
    
    // To see the actual contents of formData:
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    await createWebsite(formData);
    reset();
  };

  return (
    
    <BaseFormLayout<WebsiteFormData>
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Website"
    />
  );
}
