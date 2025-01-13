import { ToastContainer } from 'react-toastify';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline';
import 'react-toastify/dist/ReactToastify.css';
import LanguagesForm from '../../components/forms/LanguagesForm';
import usePageStore from '../../store/usePageStore';
import PageForm from '../../components/forms/PageForm';

export default function CreatePages() {
    const { pageLoading, pageError } = usePageStore();

    return (
        <div className="container mx-auto p-4  min-h-screen">
            <h1 className="text-2xl font-bold text-white mb-4">
                <button className='px-8' onClick={() => { history.back() }}>                 
                    <ArrowLeftCircleIcon className="h-6 w-6 inline-block ml-2" />
                </button>
                Create Page
            </h1>
            <PageForm />
            {pageLoading ? <p className="text-gray-400">Creating page...</p> : null}
            {pageError && <p className="text-red-500">Error creating page content.</p>}
            <ToastContainer />
        </div>
    );
}