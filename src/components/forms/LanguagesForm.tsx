import BaseForm from '../BaseForm';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { initializeForm } from '../../utils/createForm';
import useLangStore from '../../store/useLangStore';
import { LangSchema } from '../../types/lang';
import { toast } from 'react-toastify';


export default function LanguagesForm() {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await initializeForm('Language');
      setFields(data || []);
    };

    fetchData();
  }, []);

  const { createLang } = useLangStore();

  const handleLangSubmit = async (data: LangSchema) => {
    if (!Number(data.website_id)) {
      delete data.website_id;
    }
    
    await createLang(data);
    toast.success('Language created successfully!');
  };

  return (
    <BaseForm<LangSchema>
      config={{ 
        fields: fields
      }}
      onSubmit={handleLangSubmit}
      submitButtonText="Create Language"
    />
  );
}
