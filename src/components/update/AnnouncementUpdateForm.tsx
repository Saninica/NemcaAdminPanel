import BaseFormLayout from '../BaseForm';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { initializeForm } from '../../utils/createForm';
import { toast } from 'react-toastify';
import { PageContentUpdateFormData } from '../../types/page';
import useAnnouncement from '../../store/useAnnouncement';


export default function AnnouncementUpdateForm({ announcementId }: {  announcementId: number}) {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);
  const [fieldValues, setFieldValues] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {  getAnnouncement , updateAnnouncement, announcementsLoading} = useAnnouncement();

  useEffect(() => {
    let isMounted = true;
  
    const fetchData = async () => {
      if (isMounted) {
        await initializeAnnouncementForm('Announcement');
      }
    };
  
    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const initializeAnnouncementForm = async (modelName: string) => {
    setLoading(true);
    try {
      const data = await initializeForm(modelName);
      const page_content = await getAnnouncement(announcementId);
      setLoading(false);
      setFields(data || []);
      if(page_content !== undefined) {
        console.log(page_content);
        if (page_content.cover_image) page_content.cover_image = "http://127.0.0.1:8000/admin-api/" + page_content.cover_image;
        page_content.start_date = page_content.start_date.toString().split('T')[0];
        page_content.end_date = page_content.end_date.toString().split('T')[0];
        setFieldValues(page_content);
      }
    }
    catch (err: any) {
      setError(err.message || 'Error fetching page content form.');
      setLoading(false);
    };

  };

  
  if (loading) return <p>Loading Form..</p>;
  if (announcementsLoading) return <p>Updating announcement...</p>;
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
    
    const result = await updateAnnouncement(announcementId, formData);
    if (result) {
      toast.error("Error updating announcement.");
    } else {
      toast.success("Announcement updated successfully!");
    }
  };

  return (
    <BaseFormLayout<PageContentUpdateFormData>
      fields={fields}
      fieldValues={fieldValues}
      onSubmit={handleUpdateSubmit}
      submitButtonText="Update Announcement"
    />
  );
}
