import { useEffect } from 'react';
import BaseTable from '../../components/BaseTable';
import Navbar from '../../components/Navbar';
import useLangStore from '../../store/useLangStore';
import { ROUTES } from '../../constants/routes';


const Languages: React.FC = () => {

  const { getLangs, langs } = useLangStore();

  useEffect(() => {
    getLangs(15, 0);
  }, [getLangs]);




  return (

    <div className="min-h-screen">
      <header className=" shadow">
        <Navbar />
      </header>


      <main className="max-w-7xl mx-auto p-4">

        <BaseTable pageName = 'Dil' data={langs} createHref={ROUTES.CREATE_LANGUAGE} 
         getEditHref={(item) => ROUTES.UPDATE_LANGUAGE.replace(':code', String(item.code)).replace(':webid', String(item.website_id))} />

      </main>

    </div>
  );
};

export default Languages;