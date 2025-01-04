import BaseFormLayout from './BaseForm';
import { PageContentSchema } from '../types/page';
import useContentStore from '../store/useContentsStore';
import { FormField } from '../types/form';

const pageContentFields: FormField<PageContentSchema, keyof PageContentSchema>[] = [
  {
    name: 'page_id',
    label: 'Page ID',
    type: 'number' as const,
    placeholder: 'Enter page ID',
    required: true,
  },
  {
    name: 'language_code',
    label: 'Language',
    type: 'select' as const,
    options: [
      { label: 'English', value: 'en' },
      { label: 'Spanish', value: 'es' },
      // Add more languages as needed
    ],
    required: true,
  },
  {
    name: 'title',
    label: 'Title',
    type: 'text' as const,
    placeholder: 'Enter title',
    required: true,
  },
  {
    name: 'body',
    label: 'Body',
    type: 'textarea' as const,
    placeholder: 'Enter content body',
    required: true,
  },
  // Add more fields as needed
];

export default function PageContentForm() {
  const { createPageContent } = useContentStore();

  const handleSubmit = async (data: PageContentSchema) => {
    await createPageContent(data);
    // Handle post-submission logic
  };

  return (
    <BaseFormLayout<PageContentSchema>
      fields={pageContentFields}
      onSubmit={handleSubmit}
      submitButtonText="Create Content"
    />
  );
}
