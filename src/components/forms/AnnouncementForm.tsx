import BaseFormLayout from '../BaseForm';
import { FormField } from '../../types/form';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { initializeForm } from '../../utils/createForm';
import useAnnouncement from '../../store/useAnnouncement';
import { AnnouncementBase } from '../../types/announcement';


export default function AnnouncementForm() {
  const [fields, setFields] = useState<FormField<any, any>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { createAnnouncement } = useAnnouncement();
  const { reset } = useForm<AnnouncementBase>();

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



  const handleSubmit = async (data: AnnouncementBase) => {
    await createAnnouncement(data);
    reset(); // Reset the form after successful submission
  };

  return (
    <BaseFormLayout<AnnouncementBase>
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Announcement"
    />
  );
}
