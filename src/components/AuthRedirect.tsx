import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';
import LoadingSpinner from './LoadingSpinner';

interface AuthRedirectProps {
  children: React.ReactNode;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = () => {
      // Verificar si el usuario está autenticado
      if (AuthService.isAuthenticated()) {
        const userType = AuthService.getUserType();
        
        // Redirigir según el tipo de usuario
        if (userType === 'admin') {
          navigate('/admin-dashboard', { replace: true });
        } else if (userType === 'user') {
          navigate('/dashboard', { replace: true });
        }
      }
      
      // Marcar que ya se verificó la autenticación
      setIsChecking(false);
    };

    // Pequeño delay para mostrar el spinner
    const timer = setTimeout(checkAuthAndRedirect, 100);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  // Mostrar spinner mientras se verifica la autenticación
  if (isChecking) {
    return <LoadingSpinner message="Verificando sesión..." />;
  }

  return <>{children}</>;
};

export default AuthRedirect;
