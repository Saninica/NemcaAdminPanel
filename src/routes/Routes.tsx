import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

import ProtectedRoute from '../components/ProtectedRoute';
import CreatePageContent from '../pages/create/CreatePageContent';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Languages from '../pages/view/Languages';
import PageContent from '../pages/view/PageContent';
import Pages from '../pages/view/Pages';
import CreateLanguages from '../pages/create/CreateLanguages';
import CreateAnnouncement from '../pages/create/CreateAnnouncement';
import Announcement from '../pages/view/Announcement';
import Website from '../pages/view/Website';
import CreateWebsite from '../pages/create/CreateWebsite';
import Metatags from '../pages/view/Metatags';
import CreateMetatags from '../pages/create/CreateMetatags';
import NotFound from '../components/NotFound';
import CreatePages from '../pages/create/CreatePage';
import Blogs from '../pages/view/Blog';
import CreateBlogs from '../pages/create/CreateBlog';
import UpdatePage from '../pages/update/UpdatePage';
import UpdateLang from '../pages/update/UpdateLang';


const AppRoutes: React.FC = () => {

  return (
     <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />

        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path={ROUTES.LANGUAGES}  element={
          <ProtectedRoute>
            <Languages />
          </ProtectedRoute>
        }/> 

        <Route path={ROUTES.CREATE_LANGUAGE} element={
          <ProtectedRoute>
            <CreateLanguages />
          </ProtectedRoute>
        }/>

        <Route path={ROUTES.UPDATE_LANGUAGE} element={
          <ProtectedRoute>
            <UpdateLang />
          </ProtectedRoute>
        }/>

        <Route path={ROUTES.PAGES}  element={
          <ProtectedRoute>
            <Pages />
          </ProtectedRoute>
        }/>

        <Route path={ROUTES.CREATE_PAGE} element={
          <ProtectedRoute>
            <CreatePages />
          </ProtectedRoute>
        }/>

        <Route path={ROUTES.UPDATE_PAGE} element={
          <ProtectedRoute>
            <UpdatePage />
          </ProtectedRoute>
        }/>

        <Route path = {ROUTES.CONTENTS} element = {
          <ProtectedRoute>
            <PageContent />
          </ProtectedRoute>
        }/>

        <Route path= {ROUTES.CREATE_CONTENT} element = {
          <ProtectedRoute>
            <CreatePageContent />
          </ProtectedRoute>
        }/>

        <Route path={ROUTES.ANNOUNCEMENTS} element={
          <ProtectedRoute>
            <Announcement />
          </ProtectedRoute>
        }/>

        <Route path={ROUTES.CREATE_ANNOUNCEMENT} element={
          <ProtectedRoute>
            <CreateAnnouncement />
          </ProtectedRoute>
        }/>

        <Route path={ROUTES.WEBSITES} element={
          <ProtectedRoute>
            <Website />
          </ProtectedRoute>
        }/>

        <Route path={ROUTES.CREATE_WEBSITE} element={
          <ProtectedRoute>
            <CreateWebsite />
          </ProtectedRoute>
        }/>

        <Route path={ROUTES.METATAGS} element={
          <ProtectedRoute>
            <Metatags />
          </ProtectedRoute>
        }/>

        <Route path={ROUTES.CREATE_METATAG} element={
          <ProtectedRoute>
            <CreateMetatags />
          </ProtectedRoute>
        }/>

        <Route path={ROUTES.BLOGS} element={
          <ProtectedRoute>
            <Blogs />
          </ProtectedRoute>
        }/>

        <Route path={ROUTES.CREATE_BLOGS} element={
          <ProtectedRoute>
            <CreateBlogs />
          </ProtectedRoute>
        }/>

        
        <Route path="*" element={<NotFound />} />

      </Routes>
  )
};

export default AppRoutes;