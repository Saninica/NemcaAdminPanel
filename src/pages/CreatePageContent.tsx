import PageContentForm from '../components/PageContentForm';
import useContentStore from '../store/useContentsStore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreatePageContent() {
    const { pageContentLoading, pageContentError } = useContentStore();

    return (
        <div className="container mx-auto p-4 bg-gray-900 min-h-screen">
            <h1 className="text-2xl font-bold text-white mb-4">Create Page Content</h1>
                <PageContentForm />
            {pageContentLoading && <p className="text-gray-400">Creating content...</p>}
            {pageContentError && <p className="text-red-500">Error creating content.</p>}
            <ToastContainer />
        </div>
    );
}