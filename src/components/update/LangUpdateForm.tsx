import BaseFormLayout from '../BaseForm';
import { PageBase } from '../../types/page';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { initializeForm } from '../../utils/createForm';
import useLangStore from '../../store/useLangStore';


export default function UpdateLangForm({ langCode, webid }: { langCode: string , webid: number}) {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);
  const [fieldValues, setFieldValues] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {  getLangs } = useLangStore();

  useEffect(() => {
    initializePageForm('Page');
  }, []);

  const initializePageForm = async (modelName: string) => {
    console.log(langCode);
    console.log(webid);
    
    setLoading(true);
    let fieldValues;
    try {
      const data = await initializeForm(modelName);
      //const fieldValues = await getLangs(15, 0);
      fieldValues = {}; //await getPage(langCode);
      setLoading(false);
      setFields(data || []);
      setFieldValues(fieldValues || {});

    }
    catch (err: any) {
      setError(err.message || 'Error fetching page form.');
      setLoading(false);
    };



    if (fieldValues && 'id' in fieldValues) {
      delete fieldValues.id; // Remove id from field values
    }

    
    console.log(fieldValues);
    console.log("^^^^^^^^^^^^^^^^^^")
    //reset(fieldValues || {}); // Update form default values dynamically

  };

  console.log(error);
  console.log(loading);

  
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handleSubmit = async (data: PageBase) => {
    console.log(data);
    //reset(); // Reset the form after successful submission
  };

  return (
    <BaseFormLayout<PageBase>
      fields={fields}
      fieldValues={fieldValues}
      onSubmit={handleSubmit}
      submitButtonText="Update Page"
    />
  );
}
