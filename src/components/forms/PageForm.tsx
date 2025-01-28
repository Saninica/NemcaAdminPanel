import BaseFormLayout from '../BaseForm';
import { PageBase } from '../../types/page';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { initializeForm } from '../../utils/createForm';
import usePageStore from '../../store/usePageStore';
import { toast } from 'react-toastify';


export default function PageForm() {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { createPage } = usePageStore();

  useEffect(() => {
    initializePageForm('Page');
  }, []);

  const initializePageForm = async (modelName: string) => {
    setLoading(true);
    try {
      const data = await initializeForm(modelName);
      setLoading(false);
      setFields(data || []);
    }
    catch (err: any) {
      setError(err.message || 'Error fetching page form.');
      setLoading(false);
    };
  };


  const handleSubmit = async (data: PageBase) => {
    if (!Number(data.website_id)) {
      delete data.website_id;
    } 
    await createPage(data);
    toast.success('Page created successfully');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  
  return (
    <BaseFormLayout<PageBase>
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Page"
    />
  );
}
