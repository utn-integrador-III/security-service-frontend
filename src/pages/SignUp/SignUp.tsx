import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppService } from '../../services/appService';
import '../../styles/auth.css';

const SignUp: React.FC = () => {
  const [appName, setAppName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('http://localhost:3000/callback');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ appName?: string; email?: string; password?: string; redirectUrl?: string }>({});
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: { appName?: string; email?: string; password?: string; redirectUrl?: string } = {};

    if (!appName.trim()) {
      newErrors.appName = 'El nombre de la aplicación es requerido.';
    }
    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es requerido.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El formato del correo no es válido.';
    }
    if (!password) {
      newErrors.password = 'La contraseña es requerida.';
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (!redirectUrl.trim()) {
      newErrors.redirectUrl = 'La URL de redirección es requerida.';
    } else if (!/^https?:\/\/.+/.test(redirectUrl)) {
      newErrors.redirectUrl = 'La URL debe comenzar con http:// o https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setErrors({});
      
      try {
        console.log('Registrando aplicación con los siguientes datos:');
        console.log({
          appName,
          email,
          password,
          redirectUrl,
        });
        
        // Create admin and app using the service
        const result = await AppService.registerNewApplication(
          {
            admin_email: email,
            password: password,
            status: 'active',
          },
          {
            name: appName,
            redirect_url: redirectUrl,
            status: 'active',
          }
        );
        
        console.log('Application registered successfully:', result);
        alert(`¡Aplicación registrada con éxito!\n\nAdmin ID: ${result.admin._id}\nApp ID: ${result.app._id}\n\nAhora puedes hacer login con las credenciales que usaste.`);
        navigate('/signin'); // Redirect to SignIn page
      } catch (error) {
        console.error('Error registering application:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error al registrar la aplicación';
        alert(`Error: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Validación fallida. Por favor, corrige los errores.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="auth-title">
            Registrar Nueva Aplicación
          </h1>
          <p className="auth-subtitle">
            Crea una cuenta para gestionar tu aplicación, roles y permisos
          </p>
        </div>
        
        <form onSubmit={handleRegister} noValidate className="auth-form">
          <div className="form-group">
            <label htmlFor="appName" className="form-label">
              Nombre de la Aplicación
            </label>
            <input
              type="text"
              id="appName"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className={`form-input ${errors.appName ? 'error' : ''}`}
              placeholder="Mi Aplicación"
            />
            {errors.appName && (
              <div className="error-message">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.appName}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo del Administrador
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="admin@tuempresa.com"
            />
            {errors.email && (
              <div className="error-message">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="••••••••"
            />
            {errors.password && (
              <div className="error-message">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.password}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="redirectUrl" className="form-label">
              URL de Redirección
            </label>
            <input
              type="url"
              id="redirectUrl"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              className={`form-input ${errors.redirectUrl ? 'error' : ''}`}
              placeholder="https://tu-app.com/callback"
            />
            {errors.redirectUrl && (
              <div className="error-message">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.redirectUrl}
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="auth-button"
          >
            {loading ? (
              <>
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando Aplicación...
              </>
            ) : (
              'Crear Aplicación'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
