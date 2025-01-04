import { useEffect } from 'react';
import BaseTable from '../components/BaseTable';
import Navbar from '../components/Navbar';
import useContentStore from '../store/useContentsStore';

const PageContent: React.FC = () => {

  const { getPageContents, pageContents } = useContentStore();

  useEffect(() => {
    getPageContents(15, 0);
  }, [getPageContents]);


  return (

    <div className="min-h-screen">
      <header className=" shadow">
        <Navbar />
      </header>


      <main className="max-w-7xl mx-auto p-4">

        <BaseTable pageName = 'Sayfa İçerikleri' data={pageContents} createHref='/create/content' />

      </main>


    </div>
  );
};

export default PageContent;