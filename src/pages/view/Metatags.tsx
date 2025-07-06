import { useEffect } from 'react';
import BaseTable from '../../components/BaseTable';
import Navbar from '../../components/Navbar';
import { ROUTES } from '../../constants/routes';
import useMetatagsStore from '../../store/useMetatags';
import { toast, ToastContainer } from 'react-toastify';

const Metatags: React.FC = () => {

  const { getMetaTags, metaTags, deleteMetatag } = useMetatagsStore();

  useEffect(() => {
    getMetaTags(15, 0);
  }, [getMetaTags]);

  async function handleDelete(id: number) {
      const result = await deleteMetatag(id);
      if (result) {
        toast.success('Metatag deleted succsesfully!');
      }
      getMetaTags(15, 0);
  
    }

  return (

    <div className="min-h-screen">
      <header className=" shadow">
        <Navbar />
      </header>


      <main className="max-w-7xl mx-auto p-4">

        <BaseTable pageName = 'Metatags' data={(metaTags || []) as unknown as Record<string, unknown>[]} createHref={ROUTES.CREATE_METATAG} 
         getEditHref={(item) => ROUTES.UPDATE_METATAG.replace(':id', String(item.id))} 
         deleteSubmit={handleDelete}
         />

      </main>

      <ToastContainer />


    </div>
  );
};

export default Metatags;