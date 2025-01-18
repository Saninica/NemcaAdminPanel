import BaseFormLayout from '../BaseForm';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { initializeForm } from '../../utils/createForm';
import useWebsite from '../../store/useWebsite';
import { WebsiteFormData } from '../../types/website';
import { toast } from 'react-toastify';


export default function WebsiteForm() {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { createWebsite } = useWebsite();

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
    
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    await createWebsite(formData);
    toast.success('Website created successfully');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <BaseFormLayout<WebsiteFormData>
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Website"
    />
  );
}
