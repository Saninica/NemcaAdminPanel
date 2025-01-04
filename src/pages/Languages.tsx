import { useEffect } from 'react';
import BaseTable from '../components/BaseTable';
import Navbar from '../components/Navbar';
import useLangStore from '../store/useLangStore';

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

        <BaseTable pageName = 'Dil' data={langs} />

      </main>


    </div>
  );
};

export default Languages;