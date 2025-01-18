import BaseFormLayout from '../BaseForm';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { initializeForm } from '../../utils/createForm';
import useMetatagsStore from '../../store/useMetatags';
import { MetaTagsBase } from '../../types/metatags';
import { toast } from 'react-toastify';


export default function MetatagsForm() {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { createMetaTags } = useMetatagsStore();
  const { reset } = useForm<MetaTagsBase>();

  useEffect(() => {
    initializeMetatagForm('MetaTag');
  }, []);

  const initializeMetatagForm = async (modelName: string) => {
    setLoading(true);
    try {
      const data = await initializeForm(modelName);
      setLoading(false);
      setFields(data || []);
    }
    catch (err: any) {
      setError(err.message || 'Error fetching Metatag form.');
      setLoading(false);
    };
  };

  const handleSubmit = async (data: MetaTagsBase) => {
    await createMetaTags(data);
    reset(); // Reset the form after successful submission
    toast.success('Metatag created successfully');
  };

  console.log(error);
  console.log(loading);

  return (
    <BaseFormLayout<MetaTagsBase>
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Metatag"
    />
  );
}
