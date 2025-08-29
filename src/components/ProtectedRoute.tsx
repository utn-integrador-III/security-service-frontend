import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/admin-signin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
