import BaseForm from '../BaseForm';
import { PageBase } from '../../types/page';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { initializeForm } from '../../utils/createForm';
import usePageStore from '../../store/usePageStore';
import { toast } from 'react-toastify';


export default function PageForm() {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await initializeForm('Page');
      setFields(data || []);
    };

    fetchData();
  }, []);

  const { createPage } = usePageStore();

  const handlePageSubmit = async (data: PageBase) => {
    if (!Number(data.website_id)) {
      delete data.website_id;
    }
    
    await createPage(data);
    toast.success('Page created successfully!');
  };

  return (
    <BaseForm<PageBase>
      config={{ 
        fields: fields
      }}
      onSubmit={handlePageSubmit}
      submitButtonText="Create Page"
    />
  );
}
