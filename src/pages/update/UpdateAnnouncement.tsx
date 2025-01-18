import { ToastContainer } from 'react-toastify';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import AnnouncementUpdateForm from '../../components/update/AnnouncementUpdateForm';


export default function UpdateAnnouncement() {
    const { id } = useParams<{ id: string }>();


    return (
        <div className="container mx-auto p-4  min-h-screen">
            <h1 className="text-2xl font-bold text-white mb-4">
                <button className='px-8' onClick={() => { history.back() }}>                 
                    <ArrowLeftCircleIcon className="h-6 w-6 inline-block ml-2" />
                </button>
                Update Announcement
            </h1>

            
            <AnnouncementUpdateForm announcementId={Number(id)} />
           
            <ToastContainer />
        </div>
    );
}