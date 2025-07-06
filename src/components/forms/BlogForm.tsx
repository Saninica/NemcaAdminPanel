import BaseForm from '../BaseForm';
import { BlogBase } from '../../types/blog';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { initializeForm } from '../../utils/createForm';
import useBlogStore from '../../store/useBlogStore';
import { toast } from 'react-toastify';


export default function BlogForm() {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await initializeForm('Blog');
      setFields(data || []);
    };

    fetchData();
  }, []);

  const { createBlog } = useBlogStore();

  const handleBlogSubmit = async (data: BlogBase) => {
    await createBlog(data);
    toast.success('Blog created successfully!');
  };

  return (
    <BaseForm<BlogBase>
      config={{ 
        fields: fields
      }}
      onSubmit={handleBlogSubmit}
      submitButtonText="Create Blog"
    />
  );
}
