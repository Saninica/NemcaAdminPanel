import BaseForm from '../BaseForm';
import { MetaTagsBase } from '../../types/metatags';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { initializeForm } from '../../utils/createForm';
import useMetatagsStore from '../../store/useMetatags';
import { toast } from 'react-toastify';


export default function MetatagForm() {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await initializeForm('MetaTag');
      setFields(data || []);
    };

    fetchData();
  }, []);

  const { createMetaTags } = useMetatagsStore();

  const handleMetatagSubmit = async (data: MetaTagsBase) => {
    if (!Number(data.website_id)) {
      delete data.website_id;
    }
    
    await createMetaTags(data);
    toast.success('Metatag created successfully!');
  };

  return (
    <BaseForm<MetaTagsBase>
      config={{ 
        fields: fields
      }}
      onSubmit={handleMetatagSubmit}
      submitButtonText="Create Metatag"
    />
  );
}
