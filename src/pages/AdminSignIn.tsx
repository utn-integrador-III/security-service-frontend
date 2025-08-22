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
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión como administrador';
      setError(errorMessage);
      console.error('Admin login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-20 flex items-center justify-center p-4">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-turquesa/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Contenedor principal */}
      <div className="relative w-full max-w-md mx-auto">
        {/* Card con efecto glassmorphism */}
        <div className="bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-8 relative overflow-hidden">
          {/* Efecto de borde brillante */}
          <div className="absolute inset-0 bg-gradient-to-r from-turquesa/20 via-transparent to-blue-500/20 rounded-3xl blur-xl"></div>
          
          {/* Contenido */}
          <div className="relative z-10">
            {/* Header con ícono y título */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-turquesa to-turquesa-dark rounded-2xl flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-3">
                ADMIN LOGIN
              </h2>
              <p className="text-gray-300 text-base leading-relaxed">
                Accede al panel de administración del sistema
              </p>
            </div>
            
            {/* Formulario */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Error message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center space-x-3 animate-pulse">
                  <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-300 text-sm font-medium">{error}</span>
                </div>
              )}
              
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Correo Electrónico de Administrador
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-4 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-turquesa focus:border-turquesa transition-all duration-300 backdrop-blur-sm"
                    placeholder="admin@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-turquesa/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
              
              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Contraseña de Administrador
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-4 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-turquesa focus:border-turquesa transition-all duration-300 backdrop-blur-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-turquesa/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
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
                    <span>Iniciando sesión como Admin...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Iniciar Sesión como Administrador</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-700/50 text-center">
              <p className="text-gray-400 text-sm">
                ¿Eres un usuario regular?{' '}
                <a 
                  href="/signin" 
                  className="text-turquesa hover:text-turquesa-dark font-semibold transition-colors duration-300"
                >
                  Inicia sesión aquí
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
