import { useEffect } from 'react';
import BaseTable from '../../components/BaseTable';
import Navbar from '../../components/Navbar';
import useContentStore from '../../store/useContentsStore';
import { ROUTES } from '../../constants/routes';
import { toast, ToastContainer } from 'react-toastify';

const PageContent: React.FC = () => {

  const { getPageContents, pageContents, deleteContent } = useContentStore();

  useEffect(() => {
    getPageContents(15, 0);
  }, [getPageContents]);

  async function handleDelete(id: number) {
    const result = await deleteContent(id);
    if (result) {
      toast.success('Page content deleted!');
      getPageContents(15, 0);
    } 

  }

  return (

    <div className="min-h-screen">
      <header className=" shadow">
        <Navbar />
      </header>


      <main className="max-w-7xl mx-auto p-4">

        <BaseTable pageName = 'Sayfa İçerikleri' data={pageContents} createHref={ROUTES.CREATE_CONTENT} 
         getEditHref={(item) => ROUTES.UPDATE_CONTENT.replace(':id', String(item.id))}
          deleteSubmit={handleDelete}
        />

      </main>

      <ToastContainer />


    </div>
  );
};

export default PageContent;