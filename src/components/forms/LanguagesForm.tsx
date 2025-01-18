import BaseFormLayout from '../BaseForm';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { LangSchema } from '../../types/lang';
import useLangStore from '../../store/useLangStore';
import { initializeForm } from '../../utils/createForm';
import { toast } from 'react-toastify';


export default function LanguagesForm() {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { createLang } = useLangStore();

  useEffect(() => {
    initializeLanguageForm('Language');
  }, []);

  const initializeLanguageForm = async (modelName: string) => {
    setLoading(true);
    try {
      const data = await initializeForm(modelName);
      setLoading(false);
      setFields(data || []);
    }
    catch (err: any) {
      setError(err.message || 'Error fetching language form.');
      setLoading(false);
    };
  };

  const handleSubmit = async (data: LangSchema) => {
    await createLang(data);
    toast.success('Language created successfully');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <BaseFormLayout<LangSchema>
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Language"
    />
  );
}
