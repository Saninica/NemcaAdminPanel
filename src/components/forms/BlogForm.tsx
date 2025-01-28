import BaseFormLayout from '../BaseForm';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { initializeForm } from '../../utils/createForm';
import useBlogStore from '../../store/useBlogStore';
import { BlogBase } from '../../types/blog';
import { toast } from 'react-toastify';


export default function BlogForm() {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { createBlog } = useBlogStore();

  useEffect(() => {
    initializeLanguageForm('Blog');
  }, []);

  const initializeLanguageForm = async (modelName: string) => {
    setLoading(true);
    try {
      const data = await initializeForm(modelName);
      setLoading(false);
      setFields(data || []);
    }
    catch (err: any) {
      setError(err.message || 'Error fetching blog form.');
      setLoading(false);
    };
  };

  const handleSubmit = async (data: BlogBase) => {
    console.log(data);
    
    if (!Number(data.website_id)) {
      delete data.website_id;
    } 
    
    await createBlog(data);
    toast.success('Blog created successfully');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <BaseFormLayout<BlogBase>
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Blog"
    />
  );
}
