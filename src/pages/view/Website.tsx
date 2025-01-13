import { useEffect } from 'react';
import BaseTable from '../../components/BaseTable';
import Navbar from '../../components/Navbar';
import { ROUTES } from '../../constants/routes';
import useWebsite from '../../store/useWebsite';

const Website: React.FC = () => {

  const { getWebsites, websites } = useWebsite();

  useEffect(() => {
    getWebsites(15, 0);
  }, [getWebsites]);


  return (

    <div className="min-h-screen">
      <header className=" shadow">
        <Navbar />
      </header>


      <main className="max-w-7xl mx-auto p-4">

        <BaseTable pageName = 'Website' data={websites} createHref={ROUTES.CREATE_WEBSITE} />

      </main>


    </div>
  );
};

export default Website;