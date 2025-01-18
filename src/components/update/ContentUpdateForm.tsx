import BaseFormLayout from '../BaseForm';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { initializeForm } from '../../utils/createForm';
import { toast } from 'react-toastify';
import useContentStore from '../../store/useContentsStore';
import { PageContentUpdateFormData } from '../../types/page';


export default function ContentUpdateForm({ contentId }: {  contentId: number}) {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);
  const [fieldValues, setFieldValues] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {  getPageContent , updatePageContent, pageContentLoading} = useContentStore();

  useEffect(() => {
    let isMounted = true;
  
    const fetchData = async () => {
      if (isMounted) {
        await initializePageContentForm('PageContent');
      }
    };
  
    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const initializePageContentForm = async (modelName: string) => {
    setLoading(true);
    try {
      const data = await initializeForm(modelName);
      const page_content = await getPageContent(contentId);
      setLoading(false);
      setFields(data || []);
      if(page_content !== undefined) {
        const { id, ...rest } = page_content;
        if (rest.cover_image) rest.cover_image = "http://127.0.0.1:8000/admin-api/" + rest.cover_image;
        setFieldValues(rest);
        console.log(rest);
      }
    }
    catch (err: any) {
      setError(err.message || 'Error fetching page content form.');
      setLoading(false);
    };


  

  };

  
  if (loading) return <p>Loading Form..</p>;
  if (pageContentLoading) return <p>Updating page Content...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handleUpdateSubmit = async (data: PageContentUpdateFormData) => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('body', data.body);

    if (data.cover_image){
      formData.append('cover_image', data.cover_image[0]);
    }


    formData.append('page_id', data.page_id.toString());
    formData.append('language_code', data.language_code);
    formData.append('website_id', data.website_id.toString());
    
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);

      if (key == 'cover_image'  && !(value instanceof File)) {
        formData.delete(key);
      }
    }
    
    const result = await updatePageContent(contentId, formData);
    if (result) {
      toast.error("Error updating page contnet.");
    } else {
      toast.success("Page content updated successfully!");
    }
  };

  return (
    <BaseFormLayout<PageContentUpdateFormData>
      fields={fields}
      fieldValues={fieldValues}
      onSubmit={handleUpdateSubmit}
      submitButtonText="Update Page Content"
    />
  );
}
