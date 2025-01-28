import BaseFormLayout from '../BaseForm';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { initializeForm } from '../../utils/createForm';
import { toast } from 'react-toastify';
import useMetatagsStore from '../../store/useMetatags';
import { MetaTagsBase } from '../../types/metatags';


export default function UpdateMetatagForm({ metatagId }: { metatagId: number }) {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);
  const [fieldValues, setFieldValues] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {  updateMetatag,  getMetatag } = useMetatagsStore();

  useEffect(() => {
    let isMounted = true;
  
    const fetchData = async () => {
      if (isMounted) {
        await initializeMetatagForm('MetaTag');
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false;
    };
  }, []);

  const initializeMetatagForm = async (modelName: string) => {
    setLoading(true);
    try {
      const page = await getMetatag(metatagId);
      const data = await initializeForm(modelName);
      setLoading(false);
      setFields(data || []);
      
      if(page !== undefined) {
        setFieldValues(page);
      }
    }
    catch (err: any) {
      setError(err.message || 'Error fetching metatag form.');
      setLoading(false);
    };

  };

  
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handleUpdateSubmit = async (data: MetaTagsBase) => {
    if (!Number(data.website_id)) {
      delete data.website_id;
    } 
    const result = await updateMetatag(metatagId, data);
    if (result) {
      toast.success('Metatag updated successfully');
    } else {
      toast.error('Error updating metatag');
    }
  };

  return (
    <BaseFormLayout<MetaTagsBase>
      fields={fields}
      fieldValues={fieldValues}
      onSubmit={handleUpdateSubmit}
      submitButtonText="Update Metatag"
    />
  );
}
