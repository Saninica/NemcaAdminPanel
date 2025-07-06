import BaseForm from '../BaseForm';
import { PageContentFormData } from '../../types/page';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { initializeForm } from '../../utils/createForm';
import useContentStore from '../../store/useContentsStore';
import { toast } from 'react-toastify';


export default function PageContentForm() {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await initializeForm('PageContent');
      setFields(data || []);
    };

    fetchData();
  }, []);

  const { createPageContent } = useContentStore();

  const handleContentSubmit = async (data: PageContentFormData) => {
    const formData = new FormData();
    
    formData.append('title', data.title);
    formData.append('body', data.body);
    formData.append('page_id', data.page_id.toString());
    formData.append('language_id', data.language_id.toString());
    
    if (data.cover_image && data.cover_image.length > 0) {
      formData.append('cover_image', data.cover_image[0]);
    }
    
    if (Number(data.website_id)) {
      formData.append('website_id', data.website_id.toString());
    }
    
    await createPageContent(formData);
    toast.success('Page content created successfully!');
  };

  return (
    <BaseForm<PageContentFormData>
      config={{ 
        fields: fields
      }}
      onSubmit={handleContentSubmit}
      submitButtonText="Create Page Content"
    />
  );
}
