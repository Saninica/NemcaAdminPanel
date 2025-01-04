import { useEffect } from 'react';
import BaseTable from '../components/BaseTable';
import Navbar from '../components/Navbar';
import usePageStore from '../store/usePageStore';

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

        <BaseTable pageName = 'Sayfa' data={pages} />

      </main>


    </div>
  );
};

export default Pages;