import { useEffect } from 'react';
import BaseTable from '../../components/BaseTable';
import Navbar from '../../components/Navbar';
import { ROUTES } from '../../constants/routes';
import useBlogStore from '../../store/useBlogStore';
import { toast } from 'react-toastify';

const Blogs: React.FC = () => {

  const { getBlogs, blogs, deleteBlog } = useBlogStore();

  useEffect(() => {
    getBlogs(15, 0);
  }, [getBlogs]);

  async function handleDelete(id: number) {
    const result = await deleteBlog(id);
    if (result) {
      getBlogs(15, 0);
      toast.success('Blog deleted succsesfully!');
    }

  }

  return (

    <div className="min-h-screen">
      <header className=" shadow">
        <Navbar />
      </header>


      <main className="max-w-7xl mx-auto p-4">

        <BaseTable pageName='Blog İçeriği' data={blogs} createHref={ROUTES.CREATE_BLOGS}
          deleteSubmit={handleDelete} />

      </main>


    </div>
  );
};

export default Blogs;