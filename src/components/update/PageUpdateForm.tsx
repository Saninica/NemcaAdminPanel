import BaseForm from '../BaseForm';
import { PageBase, PageUpdate } from '../../types/page';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { initializeForm } from '../../utils/createForm';
import usePageStore from '../../store/usePageStore';
import { toast } from 'react-toastify';


export default function UpdatePageForm({ pageId }: { pageId: number }) {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);
  const [fieldValues, setFieldValues] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {  getPage, updatePage } = usePageStore();

  useEffect(() => {
    let isMounted = true;
  
    const fetchData = async () => {
      if (isMounted) {
        await initializePageForm('Page');
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false;
    };
  }, []);

  const initializePageForm = async (modelName: string) => {
    setLoading(true);
    try {
      const page = await getPage(pageId);
      const data = await initializeForm(modelName);
      setLoading(false);
      setFields(data || []);
      
      if(page !== undefined) {
        const { id, ...rest } = page; // Remove id if necessary
        setFieldValues(rest);
      }
    }
    catch (err: any) {
      setError(err.message || 'Error fetching page form.');
      setLoading(false);
    };

  };

  
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handleUpdateSubmit = async (data: PageUpdate) => {
    if (!Number(data.website_id)) {
      delete data.website_id;
    } 
    
    const result = await updatePage(pageId, data);
    if (result) {
      toast.error('Error updating page');
    } else {
      toast.success('Page updated successfully');
    }
  };

  return (
    <BaseForm<PageBase>
      config={{ 
        fields: fields,
        defaultValues: fieldValues 
      }}
      initialValues={fieldValues}
      onSubmit={handleUpdateSubmit}
      submitButtonText="Update Page"
    />
  );
}
