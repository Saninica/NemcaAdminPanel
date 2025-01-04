import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Languages from './pages/Languages';
import Pages from './pages/Pages';
import PageContent from './pages/PageContent';
import CreatePageContent from './pages/CreatePageContent';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path='/languages'  element={
          <ProtectedRoute>
            <Languages />
          </ProtectedRoute>
        }/> 

        <Route path='/pages'  element={
          <ProtectedRoute>
            <Pages />
          </ProtectedRoute>
        }/>

        <Route path = '/contents' element = {
          <ProtectedRoute>
            <PageContent />
          </ProtectedRoute>
        }/>

        <Route path= '/create/content' element = {
          <ProtectedRoute>
            <CreatePageContent />
          </ProtectedRoute>
        }/>

      </Routes>
    </Router>
  );
};

export default App;