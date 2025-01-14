import { useEffect } from 'react';
import BaseTable from '../../components/BaseTable';
import Navbar from '../../components/Navbar';
import { ROUTES } from '../../constants/routes';
import useBlogStore from '../../store/useBlogStore';

const Blogs: React.FC = () => {

  const { getBlogs, blogs } = useBlogStore();

  useEffect(() => {
    getBlogs(15, 0);
  }, [getBlogs]);


  return (

    <div className="min-h-screen">
      <header className=" shadow">
        <Navbar />
      </header>


      <main className="max-w-7xl mx-auto p-4">

        <BaseTable pageName = 'Blog İçeriği' data={blogs} createHref={ROUTES.CREATE_BLOGS} />

      </main>


    </div>
  );
};

export default Blogs;