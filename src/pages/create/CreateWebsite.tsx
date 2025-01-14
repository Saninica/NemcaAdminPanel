import { ToastContainer } from 'react-toastify';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline';
import 'react-toastify/dist/ReactToastify.css';
import useWebsite from '../../store/useWebsite';
import WebsiteForm from '../../components/forms/WebsiteForm';

export default function CreateWebsite() {
    const { websiteLoading, websiteError } = useWebsite();

    return (
        <div className="container mx-auto p-4  min-h-screen">
            <h1 className="text-2xl font-bold text-white mb-4">
                <button className='px-8' onClick={() => { history.back() }}>                 
                    <ArrowLeftCircleIcon className="h-6 w-6 inline-block ml-2" />
                </button>
                Create Website
            </h1>
            <WebsiteForm />
            {websiteLoading && <p className="text-gray-400">Creating website...</p>}
            {websiteError && <p className="text-red-500">Error creating website content.</p>}
            <ToastContainer />
        </div>
    );
}