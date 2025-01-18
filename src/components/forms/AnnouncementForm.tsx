import BaseFormLayout from '../BaseForm';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { initializeForm } from '../../utils/createForm';
import useAnnouncement from '../../store/useAnnouncement';
import {  AnnouncementFormData } from '../../types/announcement';
import { toast } from 'react-toastify';


export default function AnnouncementForm() {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { createAnnouncement } = useAnnouncement();

  useEffect(() => {
    initializeAnnouncementForm('Announcement');
  }, []);

  const initializeAnnouncementForm = async (modelName: string) => {
    setLoading(true);
    try {
      const data = await initializeForm(modelName);
      setLoading(false);
      setFields(data || []);
    }
    catch (err: any) {
      setError(err.message || 'Error fetching Announcement form.');
      setLoading(false);
    };
  };



  const handleSubmit = async (data: AnnouncementFormData) => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('body', data.body);

    formData.append('page_id', data.page_id.toString());
    formData.append('website_id', data.website_id.toString());
    formData.append('language_code', data.language_code);

    formData.append('start_date', data.start_date.toString());
    formData.append('end_date', data.end_date.toString());

    if (data.cover_image){
      formData.append('cover_image', data.cover_image[0]);
    }

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);

      if (key == 'cover_image'  && !(value instanceof File)) {
        formData.delete(key);
      }
    }

    await createAnnouncement(formData);
    toast.success('Announcement created successfully');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;


  return (
    <BaseFormLayout<AnnouncementFormData>
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Announcement"
    />
  );
}
