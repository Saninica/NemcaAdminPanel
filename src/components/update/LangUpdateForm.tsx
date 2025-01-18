import BaseFormLayout from '../BaseForm';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { initializeForm } from '../../utils/createForm';
import useLangStore from '../../store/useLangStore';
import { LanguageBase } from '../../types/lang';
import { toast } from 'react-toastify';


export default function UpdateLangForm({ langCode, webid }: { langCode: string , webid: number}) {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);
  const [fieldValues, setFieldValues] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {  getLang , updateLang, langLoading} = useLangStore();

  useEffect(() => {
    let isMounted = true;
  
    const fetchData = async () => {
      if (isMounted) {
        await initializeLangForm('Language');
      }
    };
  
    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const initializeLangForm = async (modelName: string) => {
    setLoading(true);
    try {
      const data = await initializeForm(modelName);
      const lang = await getLang(langCode, webid);
      setLoading(false);
      setFields(data || []);
      setFieldValues(lang);
    }
    catch (err: any) {
      setError(err.message || 'Error fetching page form.');
      setLoading(false);
    };

  };

  
  if (loading) return <p>Loading Form..</p>;
  if (langLoading) return <p>Updating lang...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handleUpdateSubmit = async (data: LanguageBase) => {
    const result = await updateLang(data, langCode, webid);
    if (result) {
      toast.error("Error updating language.");
    } else {
      toast.success("Language updated successfully!");
    }
  };

  return (
    <BaseFormLayout<LanguageBase>
      fields={fields}
      fieldValues={fieldValues}
      onSubmit={handleUpdateSubmit}
      submitButtonText="Update Language"
    />
  );
}
