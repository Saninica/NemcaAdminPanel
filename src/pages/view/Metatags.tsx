import { useEffect } from 'react';
import BaseTable from '../../components/BaseTable';
import Navbar from '../../components/Navbar';
import { ROUTES } from '../../constants/routes';
import useMetatagsStore from '../../store/useMetatags';

const Metatags: React.FC = () => {

  const { getMetaTags, metaTags } = useMetatagsStore();

  useEffect(() => {
    getMetaTags(15, 0);
  }, [getMetaTags]);


  return (

    <div className="min-h-screen">
      <header className=" shadow">
        <Navbar />
      </header>


      <main className="max-w-7xl mx-auto p-4">

        <BaseTable pageName = 'Metatags' data={metaTags} createHref={ROUTES.CREATE_METATAG} />

      </main>


    </div>
  );
};

export default Metatags;