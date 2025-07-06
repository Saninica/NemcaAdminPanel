import BaseForm from '../BaseForm';
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
        website.favicon_image = "http://185.23.72.79/admin-api/" + website.favicon_image;
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

  const handleUpdateSubmit = async (data: any) => {
    // Convert the plain object to FormData since updateWebsite expects FormData
    const formData = new FormData();
    
    // Add all fields to FormData
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value instanceof FileList && value.length > 0) {
          formData.append(key, value[0]);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const result = await updateWebsite(websiteId, formData);
    // Fix inverted logic: result is true on success, false on failure
    if (result) {
      toast.success('Website updated successfully');
    } else {
      toast.error('Error updating website');
    }
  };

  return (
    <BaseForm<any>
      config={{ 
        fields: fields,
        defaultValues: fieldValues 
      }}
      initialValues={fieldValues}
      onSubmit={handleUpdateSubmit}
      submitButtonText="Update Website"
    />
  );
}
