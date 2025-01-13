import { useEffect } from 'react';
import BaseTable from '../../components/BaseTable';
import Navbar from '../../components/Navbar';
import { ROUTES } from '../../constants/routes';
import useAnnouncement from '../../store/useAnnouncement';

const Announcement: React.FC = () => {

  const { getAnnouncements, announcements } = useAnnouncement();

  useEffect(() => {
    getAnnouncements(15, 0);
  }, [getAnnouncements]);


  return (

    <div className="min-h-screen">
      <header className=" shadow">
        <Navbar />
      </header>


      <main className="max-w-7xl mx-auto p-4">

        <BaseTable pageName = 'Announcement' data={announcements} createHref={ROUTES.CREATE_ANNOUNCEMENT} />

      </main>


    </div>
  );
};

export default Announcement;