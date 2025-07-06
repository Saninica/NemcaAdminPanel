import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ErrorBoundary from './components/ErrorBoundary';
import AppRoutes from './routes/Routes';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <ErrorBoundary showDetails={import.meta.env.DEV}>
      <Router basename="/admin/">
        <div className="min-h-screen bg-gray-900">
          <AppRoutes />
          
          {/* Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            className="mt-16"
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;