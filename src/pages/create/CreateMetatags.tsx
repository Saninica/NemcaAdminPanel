import { ToastContainer } from 'react-toastify';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline';
import 'react-toastify/dist/ReactToastify.css';
import useMetatagsStore from '../../store/useMetatags';
import MetatagsForm from '../../components/forms/MetatagForm';

export default function CreateMetatags() {
    const { metaTagsLoading, metaTagsError } = useMetatagsStore();

    return (
        <div className="container mx-auto p-4  min-h-screen">
            <h1 className="text-2xl font-bold text-white mb-4">
                <button className='px-8' onClick={() => { history.back() }}>                 
                    <ArrowLeftCircleIcon className="h-6 w-6 inline-block ml-2" />
                </button>
                Create Metatags
            </h1>
            <MetatagsForm />
            {metaTagsLoading ? <p className="text-gray-400">Creating metatag...</p> : null}
            {metaTagsError && <p className="text-red-500">Error creating metatag content.</p>}
            <ToastContainer />
        </div>
    );
}