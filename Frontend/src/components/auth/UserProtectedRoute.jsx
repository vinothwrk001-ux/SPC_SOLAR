import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';

const UserProtectedRoute = ({ children }) => {
  const { user, loading } = useUserAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-red/30 border-t-red rounded-full animate-spin"></div>
          <p className="text-gray text-sm font-accent tracking-wide uppercase">Loading account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default UserProtectedRoute;
