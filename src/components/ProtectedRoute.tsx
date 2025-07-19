import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

// Simulación de autenticación (ajusta según tu contexto real)
const useAuth = () => {
  return { isAuthenticated: false };
};

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
