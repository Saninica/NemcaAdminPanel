import BaseFormLayout from '../BaseForm';
import { PageBase } from '../../types/page';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { initializeForm } from '../../utils/createForm';
import usePageStore from '../../store/usePageStore';


export default function PageForm() {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { createPage } = usePageStore();
  const { reset } = useForm<PageBase>();

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

  console.log(error);
  console.log(loading);


  const handleSubmit = async (data: PageBase) => {
    await createPage(data);
    reset(); // Reset the form after successful submission
  };

  return (
    <BaseFormLayout<PageBase>
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Page"
    />
  );
}
