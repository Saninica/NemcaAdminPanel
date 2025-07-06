import BaseForm from '../BaseForm';
import { AnnouncementFormData } from '../../types/announcement';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { initializeForm } from '../../utils/createForm';
import useAnnouncement from '../../store/useAnnouncement';
import { toast } from 'react-toastify';


export default function AnnouncementForm() {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await initializeForm('Announcement');
      setFields(data || []);
    };

    fetchData();
  }, []);

  const { createAnnouncement } = useAnnouncement();

  const handleAnnouncementSubmit = async (data: AnnouncementFormData) => {
    const formData = new FormData();
    
    formData.append('title', data.title);
    formData.append('body', data.body);
    formData.append('start_date', data.start_date);
    formData.append('end_date', data.end_date);
    formData.append('language_id', data.language_id.toString());
    
    if (data.cover_image && data.cover_image.length > 0) {
      formData.append('cover_image', data.cover_image[0]);
    }
    
    if (Number(data.website_id)) {
      formData.append('website_id', data.website_id.toString());
    }
    
    await createAnnouncement(formData);
    toast.success('Announcement created successfully!');
  };

  return (
    <BaseForm<AnnouncementFormData>
      config={{ 
        fields: fields
      }}
      onSubmit={handleAnnouncementSubmit}
      submitButtonText="Create Announcement"
    />
  );
}
