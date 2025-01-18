import BaseFormLayout from '../BaseForm';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { initializeForm } from '../../utils/createForm';
import { toast } from 'react-toastify';
import useWebsite from '../../store/useWebsite';


export default function WebsiteUpdateForm({ websiteId }: { websiteId: number }) {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);
  const [fieldValues, setFieldValues] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {  getWebsite, updateWebsite } = useWebsite();

  useEffect(() => {
    let isMounted = true;
  
    const fetchData = async () => {
      if (isMounted) {
        await initializeWebsiteForm('Website');
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false;
    };
  }, []);

  const initializeWebsiteForm = async (modelName: string) => {
    setLoading(true);
    try {
      const website = await getWebsite(websiteId);
      const data = await initializeForm(modelName);
      setLoading(false);
      setFields(data || []);
      if (website && website.favicon_image) {
        website.favicon_image = "http://127.0.0.1:8000/admin-api/" + website.favicon_image;
      }
      setFieldValues(website);
    }
    catch (err: any) {
      setError(err.message || 'Error fetching website form.');
      setLoading(false);
    };

  };

  
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handleUpdateSubmit = async (data: FormData) => {
    const result = await updateWebsite(websiteId, data);
    if (result) {
      toast.error('Error updating website');
    } else {
      toast.success('website updated successfully');
    }
  };

  return (
    <BaseFormLayout<FormData>
      fields={fields}
      fieldValues={fieldValues}
      onSubmit={handleUpdateSubmit}
      submitButtonText="Update Website"
    />
  );
}
