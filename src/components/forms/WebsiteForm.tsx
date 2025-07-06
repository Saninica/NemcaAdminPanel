import BaseForm from '../BaseForm';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { initializeForm } from '../../utils/createForm';
import useWebsite from '../../store/useWebsite';
import { toast } from 'react-toastify';

interface WebsiteFormData {
  name: string;
  domain_url: string;
  favicon_image?: FileList;
}

export default function WebsiteForm() {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await initializeForm('Website');
      setFields(data || []);
    };

    fetchData();
  }, []);

  const { createWebsite } = useWebsite();

  const handleWebsiteSubmit = async (data: WebsiteFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('domain_url', data.domain_url);
    
    if (data.favicon_image && data.favicon_image.length > 0) {
      formData.append('favicon_image', data.favicon_image[0]);
    }
    
    await createWebsite(formData);
    toast.success('Website created successfully!');
  };

  return (
    <BaseForm<WebsiteFormData>
      config={{ 
        fields: fields
      }}
      onSubmit={handleWebsiteSubmit}
      submitButtonText="Create Website"
    />
  );
}
