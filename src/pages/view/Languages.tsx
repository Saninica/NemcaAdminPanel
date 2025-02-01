import { useEffect } from 'react';
import BaseTable from '../../components/BaseTable';
import Navbar from '../../components/Navbar';
import useLangStore from '../../store/useLangStore';
import { ROUTES } from '../../constants/routes';
import BasePagination from '../../components/BasePagination';


const Languages: React.FC = () => {

  const { getLangs, langs, setPage,
    page,
    total,
    limit,
    skip } = useLangStore();

  useEffect(() => {
    getLangs(page);
  }, [page, limit, skip]);


  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  }

  return (

    <div className="min-h-screen">
      <header className=" shadow">
        <Navbar />
      </header>


      <main className="max-w-7xl mx-auto p-4">

        <BaseTable pageName = 'Dil' data={langs} createHref={ROUTES.CREATE_LANGUAGE} 
         getEditHref={(item) => ROUTES.UPDATE_LANGUAGE.replace(':code', String(item.code)).replace(':webid', String(item.website_id))} />


         
        <BasePagination
          currentPage={page}
          totalItems={total} 
          itemsPerPage={limit}
          onPageChange={handlePageChange}
        />
      </main>

    </div>
  );
};

export default Languages;