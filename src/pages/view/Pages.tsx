import { useEffect } from 'react';
import BaseTable from '../../components/BaseTable';
import Navbar from '../../components/Navbar';
import usePageStore from '../../store/usePageStore';
import { ROUTES } from '../../constants/routes';
import { toast, ToastContainer } from 'react-toastify';

const Pages: React.FC = () => {

  const { getPages, pages, deletePage } = usePageStore();

  useEffect(() => {
    getPages(15, 0);
  }, [getPages]);

  async function handleDelete(id: number) {
    const result = await deletePage(id);
    if (result) {
      toast.success('Sayfa başarıyla silindi');
    }
    getPages(15, 0);

  }


  return (

    <div className="min-h-screen">
      <header className=" shadow">
        <Navbar />
      </header>


      <main className="max-w-7xl mx-auto p-4">

        <BaseTable pageName = 'Sayfa' data={pages} createHref={ROUTES.CREATE_PAGE}
          getEditHref={(item) => ROUTES.UPDATE_PAGE.replace(':id', String(item.id))} 
          deleteSubmit={handleDelete}
          />

      </main>

      <ToastContainer />

    </div>
  );
};

export default Pages;