import BaseFormLayout from '../BaseForm';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { initializeForm } from '../../utils/createForm';
import useBlogStore from '../../store/useBlogStore';
import { BlogBase } from '../../types/blog';


export default function BlogForm() {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { createBlog } = useBlogStore();
  const { reset } = useForm<BlogBase>();

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
    await createBlog(data);
    reset();
  };

  return (
    <BaseFormLayout<BlogBase>
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Blog"
    />
  );
}
