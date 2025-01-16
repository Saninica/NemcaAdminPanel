import { useEffect } from 'react';
import BaseTable from '../../components/BaseTable';
import Navbar from '../../components/Navbar';
import usePageStore from '../../store/usePageStore';
import { ROUTES } from '../../constants/routes';

const Pages: React.FC = () => {

  const { getPages, pages } = usePageStore();

  useEffect(() => {
    getPages(15, 0);
  }, [getPages]);


  return (

    <div className="min-h-screen">
      <header className=" shadow">
        <Navbar />
      </header>


      <main className="max-w-7xl mx-auto p-4">

        <BaseTable pageName = 'Sayfa' data={pages} createHref={ROUTES.CREATE_PAGE}
          getEditHref={(item) => ROUTES.UPDATE_PAGE.replace(':id', String(item.id))} />

      </main>


    </div>
  );
};

export default Pages;