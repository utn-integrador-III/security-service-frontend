import React, { useState } from 'react';
import { AuthService } from '../services/authService';
import '../styles/auth.css';

const AdminSignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Usar el endpoint específico para administradores
      const response = await AuthService.adminLogin({ 
        email, 
        password
      });
             console.log('Login successful:', response);
       
       // Verificar el tipo de usuario y redirigir automáticamente
       const userType = AuthService.getUserType();
       if (userType === 'admin') {
         window.location.href = '/admin-dashboard';
       } else {
         window.location.href = '/dashboard';
       }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Admin login failed';
      setError(errorMessage);
      console.error('Admin login error:', error);
      
             // Mostrar información adicional para debugging
       console.log('=== DEBUG INFO ===');
       console.log('Email usado:', email);
       console.log('Longitud de contraseña:', password.length);
       console.log('Endpoint usado:', '/auth/admin/login');
       console.log('URL del backend:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002');
       console.log('==================');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card admin-auth-card">
        <div className="auth-header">
          <div className="auth-icon admin-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="auth-title admin-title">
            Admin Login
          </h2>
          <p className="auth-subtitle admin-subtitle">
            Accede al panel de administración del sistema
          </p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message admin-error">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo Electrónico de Administrador
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="form-input admin-input"
              placeholder="admin@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña de Administrador
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="form-input admin-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-button admin-button"
          >
            {loading ? (
              <>
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión como Admin...
              </>
            ) : (
              'Iniciar Sesión como Administrador'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            ¿Eres un usuario regular? 
            <a href="/signin" className="auth-footer-link">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
