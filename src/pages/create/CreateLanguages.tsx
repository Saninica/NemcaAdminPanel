import { ToastContainer } from 'react-toastify';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline';
import 'react-toastify/dist/ReactToastify.css';
import LanguagesForm from '../../components/forms/LanguagesForm';
import useLangStore from '../../store/useLangStore';

export default function CreateLanguages() {
    const { langLoading, langError } = useLangStore();

    return (
        <div className="container mx-auto p-4  min-h-screen">
            <h1 className="text-2xl font-bold text-white mb-4">
                <button className='px-8' onClick={() => { history.back() }}>                 
                    <ArrowLeftCircleIcon className="h-6 w-6 inline-block ml-2" />
                </button>
                Create Language
            </h1>
            <LanguagesForm />
            {langLoading ? <p className="text-gray-400">Creating language...</p> : null}
            {langError && <p className="text-red-500">Error creating language content.</p>}
            <ToastContainer />
        </div>
    );
}