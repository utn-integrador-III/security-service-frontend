import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppService } from '../../services/appService';
import '../../styles/auth.css';

const SignUp: React.FC = () => {
  const [appName, setAppName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ appName?: string; email?: string; password?: string; redirectUrl?: string }>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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
      setSuccess(null);
      setError(null);
      
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
        setSuccess('¡Aplicación registrada exitosamente! Redirigiendo al login de administrador...');
        setTimeout(() => {
          navigate('/admin-signin');
        }, 2000);
      } catch (error) {
        console.error('Error registering application:', error);
        
        // Detectar si el error es porque el admin ya existe
        let errorMessage = error instanceof Error ? error.message : 'Error al registrar la aplicación';
        
        // Verificar diferentes tipos de mensajes de error que indican que el admin ya existe
        if (errorMessage.toLowerCase().includes('already exists') || 
            errorMessage.toLowerCase().includes('ya existe') ||
            errorMessage.toLowerCase().includes('duplicate') ||
            errorMessage.toLowerCase().includes('email is already registered') ||
            errorMessage.toLowerCase().includes('admin already registered')) {
          
          errorMessage = `⚠️ Este correo de administrador ya está registrado. Si ya tienes una cuenta, ve al login de administrador para acceder a tu dashboard y crear nuevas aplicaciones desde ahí.`;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Validación fallida. Por favor, corrige los errores.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-20 flex items-center justify-center p-4">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-turquesa/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-turquesa/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Contenedor principal */}
      <div className="relative w-full max-w-lg mx-auto">
        {/* Card con efecto glassmorphism */}
        <div className="bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-8 relative overflow-hidden">
          {/* Efecto de borde brillante */}
          <div className="absolute inset-0 bg-gradient-to-r from-turquesa/20 via-transparent to-blue-500/20 rounded-3xl blur-xl"></div>
          
          {/* Contenido */}
          <div className="relative z-10">
            {/* Mensajes de éxito */}
            {success && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center space-x-3 mb-6 animate-pulse">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-300 text-sm font-medium">{success}</span>
              </div>
            )}

            {/* Mensajes de error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <span className="text-red-300 text-sm font-medium block">{error}</span>
                    
                    {/* Botón de redirección si el admin ya existe */}
                    {(error.toLowerCase().includes('ya está registrado') || 
                      error.toLowerCase().includes('already exists')) && (
                      <button
                        onClick={() => navigate('/admin-signin')}
                        className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span>Ir al Login de Administrador</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Header con ícono y título */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-turquesa to-turquesa-dark rounded-2xl flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-3">
                Registrar Nueva Aplicación
              </h1>
              <p className="text-gray-300 text-base leading-relaxed">
                Crea una cuenta para gestionar tu aplicación, roles y permisos
              </p>
              
              {/* Nota informativa */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-blue-300 text-sm font-medium mb-1">
                      📝 Registro Inicial
                    </p>
                    <p className="text-blue-200 text-sm leading-relaxed">
                      Este formulario es solo para el <strong>primer registro</strong>. Si ya tienes una cuenta de administrador, 
                      inicia sesión para crear aplicaciones adicionales desde tu dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Formulario */}
            <form onSubmit={handleRegister} noValidate className="space-y-6">
              {/* Nombre de Aplicación */}
              <div className="space-y-2">
                <label htmlFor="appName" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Nombre de la Aplicación
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="appName"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className={`w-full px-4 py-4 bg-gray-900/50 border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-turquesa focus:border-turquesa transition-all duration-300 backdrop-blur-sm ${
                      errors.appName ? 'border-red-500/50 focus:ring-red-500' : 'border-gray-600/50'
                    }`}
                    placeholder="Mi Aplicación"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-turquesa/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                {errors.appName && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.appName}</span>
                  </div>
                )}
              </div>
              
              {/* Email del Administrador */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Correo del Administrador
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-4 bg-gray-900/50 border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-turquesa focus:border-turquesa transition-all duration-300 backdrop-blur-sm ${
                      errors.email ? 'border-red-500/50 focus:ring-red-500' : 'border-gray-600/50'
                    }`}
                    placeholder="admin@tuempresa.com"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-turquesa/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                {errors.email && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>
              
              {/* Contraseña */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-4 bg-gray-900/50 border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-turquesa focus:border-turquesa transition-all duration-300 backdrop-blur-sm ${
                      errors.password ? 'border-red-500/50 focus:ring-red-500' : 'border-gray-600/50'
                    }`}
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-turquesa/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                {errors.password && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>
              
              {/* URL de Redirección */}
              <div className="space-y-2">
                <label htmlFor="redirectUrl" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  URL de Redirección
                </label>
                <div className="relative">
                  <input
                    type="url"
                    id="redirectUrl"
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                    className={`w-full px-4 py-4 bg-gray-900/50 border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-turquesa focus:border-turquesa transition-all duration-300 backdrop-blur-sm ${
                      errors.redirectUrl ? 'border-red-500/50 focus:ring-red-500' : 'border-gray-600/50'
                    }`}
                    placeholder="http://localhost:3000/callback"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-turquesa/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                {errors.redirectUrl && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.redirectUrl}</span>
                  </div>
                )}
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-turquesa to-turquesa-dark text-white font-bold rounded-xl hover:from-turquesa-dark hover:to-turquesa transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creando Aplicación...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Crear Aplicación</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
