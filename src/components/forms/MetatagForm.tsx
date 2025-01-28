import BaseFormLayout from '../BaseForm';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { initializeForm } from '../../utils/createForm';
import useMetatagsStore from '../../store/useMetatags';
import { MetaTagsBase } from '../../types/metatags';
import { toast } from 'react-toastify';


export default function MetatagsForm() {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { createMetaTags } = useMetatagsStore();

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
    if (!Number(data.website_id)) {
      delete data.website_id;
    } 
    
    await createMetaTags(data);
    toast.success('Metatag created successfully');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <BaseFormLayout<MetaTagsBase>
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Metatag"
    />
  );
}
