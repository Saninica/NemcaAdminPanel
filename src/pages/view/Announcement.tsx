import { useEffect } from 'react';
import BaseTable from '../../components/BaseTable';
import Navbar from '../../components/Navbar';
import { ROUTES } from '../../constants/routes';
import useAnnouncement from '../../store/useAnnouncement';
import { toast, ToastContainer } from 'react-toastify';

const Announcement: React.FC = () => {

  const { getAnnouncements, announcements, deleteAnnouncement } = useAnnouncement();

  useEffect(() => {
    getAnnouncements(15, 0);
  }, [getAnnouncements]);

  async function handleDelete(id: number) {
      const result = await deleteAnnouncement(id);
      if (result) {
        getAnnouncements(15, 0);
        toast.success('Announcement deleted succsesfully!');
      }

  }

  return (

    <div className="min-h-screen">
      <header className=" shadow">
        <Navbar />
      </header>


      <main className="max-w-7xl mx-auto p-4">

        <BaseTable pageName = 'Announcement' data={(announcements || []) as unknown as Record<string, unknown>[]} createHref={ROUTES.CREATE_ANNOUNCEMENT}
        getEditHref={(item) => ROUTES.UPDATE_ANNOUNCEMENT.replace(':id', String(item.id)).replace(':id', String(item.website_id))}
        deleteSubmit={handleDelete} />

      </main>

      <ToastContainer />

    </div>
  );
};

export default Announcement;