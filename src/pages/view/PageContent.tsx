import { useEffect } from 'react';
import BaseTable from '../../components/BaseTable';
import Navbar from '../../components/Navbar';
import useContentStore from '../../store/useContentsStore';
import { ROUTES } from '../../constants/routes';
import { toast, ToastContainer } from 'react-toastify';
import BasePagination from '../../components/BasePagination';
import Loading from '../../components/LoadingComponent';

const PageContent: React.FC = () => {

  const {
    getPageContents,
    pageContents,
    deleteContent,
    pageContentLoading,
    setPage,
    page,
    total,
    limit,
    skip
  } = useContentStore();

  useEffect(() => {
    getPageContents(page);
  }, [page, limit, skip]);



  async function handleDelete(id: number) {
    const result = await deleteContent(id);
    if (result) {
      toast.success('Page content deleted!');
      getPageContents(1);
    }

  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    //getPageContents(newPage);
  };

  return (

    <div className="min-h-screen">
      <header className=" shadow">
        <Navbar />
      </header>


      <main className="max-w-7xl mx-auto p-4">

        {pageContentLoading ?
          <Loading color='text-green-400'/>
          :
          <BaseTable pageName='Sayfa İçerikleri' data={pageContents} createHref={ROUTES.CREATE_CONTENT}
            getEditHref={(pageContents) => ROUTES.UPDATE_CONTENT.replace(':id', String(pageContents.id))}
            deleteSubmit={handleDelete} 
          />
        }

        
        <BasePagination
          currentPage={page}
          totalItems={total} 
          itemsPerPage={limit}
          onPageChange={handlePageChange}
        />

      </main>

      <ToastContainer />


    </div>
  );
};

export default PageContent;