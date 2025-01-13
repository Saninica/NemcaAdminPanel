import PageContentForm from '../../components/forms/PageContentForm';
import useContentStore from '../../store/useContentsStore';
import { ToastContainer } from 'react-toastify';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline';
import 'react-toastify/dist/ReactToastify.css';

export default function CreatePageContent() {
    const { pageContentLoading, pageContentError } = useContentStore();

    return (
        <div className="container mx-auto p-4  min-h-screen">
            <h1 className="text-2xl font-bold text-white mb-4">
                <button  onClick={() => { history.back() }}>                 <ArrowLeftCircleIcon className="h-6 w-6 inline-block ml-2" />
                </button>
                Create Page Content
            </h1>
            <PageContentForm />
            {pageContentLoading ? <p className="text-gray-400">Creating content...</p> : null}
            {pageContentError && <p className="text-red-500">Error creating content.</p>}
            <ToastContainer />
        </div>
    );
}