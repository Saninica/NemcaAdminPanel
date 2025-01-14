import { ToastContainer } from 'react-toastify';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline';
import 'react-toastify/dist/ReactToastify.css';
import useAnnouncement from '../../store/useAnnouncement';
import AnnouncementForm from '../../components/forms/AnnouncementForm';

export default function CreateAnnouncement() {
    const { announcementsLoading, announcementsError } = useAnnouncement();

    return (
        <div className="container mx-auto p-4  min-h-screen">
            <h1 className="text-2xl font-bold text-white mb-4">
                <button className='px-8' onClick={() => { history.back() }}>                 
                    <ArrowLeftCircleIcon className="h-6 w-6 inline-block ml-2" />
                </button>
                Create Announcement
            </h1>
            <AnnouncementForm />
            {announcementsLoading ? <p className="text-gray-400">Creating Announcement...</p> : null}
            {announcementsError && <p className="text-red-500">Error creating Announcement content.</p>}
            <ToastContainer />
        </div>
    );
}