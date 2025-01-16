import { ToastContainer } from 'react-toastify';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import UpdateLangForm from '../../components/update/LangUpdateForm';

export default function UpdateLang() {
    const { code , webid} = useParams<{ code: string, webid:string }>(); // Get the id from the URL


    return (
        <div className="container mx-auto p-4  min-h-screen">
            <h1 className="text-2xl font-bold text-white mb-4">
                <button className='px-8' onClick={() => { history.back() }}>                 
                    <ArrowLeftCircleIcon className="h-6 w-6 inline-block ml-2" />
                </button>
                Update Language
            </h1>

            
            <UpdateLangForm langCode={String(code)} webid={Number(webid)} />
           
            <ToastContainer />
        </div>
    );
}