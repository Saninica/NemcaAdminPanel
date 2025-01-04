import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        await checkAuthStatus();
      } finally {
        setIsLoading(false);
      }
    };

    validateAuth();
  }, [checkAuthStatus]); 

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
