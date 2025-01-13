import BaseFormLayout from '../BaseForm';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { initializeForm } from '../../utils/createForm';
import useWebsite from '../../store/useWebsite';
import { WebsiteBase } from '../../types/website';


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



  const handleSubmit = async (data: WebsiteBase) => {
    await createWebsite(data);
    reset(); // Reset the form after successful submission
  };

  return (
    <BaseFormLayout<WebsiteBase>
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Website"
    />
  );
}
