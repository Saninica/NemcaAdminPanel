import { useEffect } from 'react';
import BaseTable from '../../components/BaseTable';
import Navbar from '../../components/Navbar';
import { ROUTES } from '../../constants/routes';
import useWebsite from '../../store/useWebsite';
import { toast, ToastContainer } from 'react-toastify';

const Website: React.FC = () => {

  const { getWebsites, websites, deleteWebsite } = useWebsite();

  useEffect(() => {
    getWebsites(15, 0);
  }, [getWebsites]);

  async function handleDelete(id: number) {
    const result = await deleteWebsite(id);
    if (result) {
      toast.success('Website deleted successfully');
    }

    getWebsites(15, 0);
  }

  
  return (

    <div className="min-h-screen">
      <header className=" shadow">
        <Navbar />
      </header>


      <main className="max-w-7xl mx-auto p-4">

        <BaseTable pageName = 'Website' data={websites} createHref={ROUTES.CREATE_WEBSITE} 
         getEditHref={(item) => ROUTES.UPDATE_WEBSITE.replace(':id', String(item.id))} 
         deleteSubmit={handleDelete}/>

      </main>

      <ToastContainer />


    </div>
  );
};

export default Website;