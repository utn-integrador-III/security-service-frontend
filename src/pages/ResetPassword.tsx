import React, { useState } from 'react';
import { UserService } from '../services/userService';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }

    setLoading(true);

    try {
      const result = await UserService.requestPasswordReset(email);
      
      if (result.message_code === 'PASSWORD_RESET_INITIATED') {
        setSuccess('Se ha enviado una contraseña temporal a tu correo electrónico. Por favor revisa tu bandeja de entrada.');
        setEmail('');
      } else {
        setError(result.message || 'Error al solicitar el restablecimiento de contraseña');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al solicitar el restablecimiento de contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-black/20">
        <div className="absolute inset-0 bg-gradient-to-br from-turquesa/5 to-purple-500/5" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)'
        }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-turquesa to-turquesa-dark rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Restablecer Contraseña
            </h2>
            <p className="text-gray-300">
              Ingresa tu correo electrónico para recibir una contraseña temporal
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 flex items-center space-x-3">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-red-200 text-sm">{error}</span>
              </div>
            )}
            
            {/* Success Message */}
            {success && (
              <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-200 text-sm">{success}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-200">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-turquesa focus:border-transparent transition-all duration-300"
                  placeholder="usuario@email.com"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-turquesa to-turquesa-dark text-white font-bold py-3 px-6 rounded-xl hover:from-turquesa-dark hover:to-turquesa transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Enviar Contraseña Temporal</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-gray-400 text-sm">
              ¿Recuerdas tu contraseña?{' '}
              <a 
                href="/change-password" 
                className="text-turquesa hover:text-turquesa-dark font-semibold hover:underline transition-colors duration-300"
              >
                Cambiar contraseña
              </a>
            </p>
            <p className="text-gray-400 text-sm">
              ¿No tienes cuenta?{' '}
              <a 
                href="/user-registration" 
                className="text-turquesa hover:text-turquesa-dark font-semibold hover:underline transition-colors duration-300"
              >
                Registrarse
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
