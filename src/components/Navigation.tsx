import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthService } from '../services/authService';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = AuthService.isAuthenticated();
  const isAdmin = AuthService.isAdmin();
  const userType = AuthService.getUserType();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/signin');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!isAuthenticated) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-turquesa to-turquesa-dark rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white text-xl font-bold">🔐</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-turquesa to-turquesa-dark bg-clip-text text-transparent">
                  Security Service
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/signin"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  location.pathname === '/signin'
                    ? 'bg-turquesa/20 text-turquesa border border-turquesa/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Iniciar Sesión</span>
              </Link>
              
              <Link
                to="/admin-signin"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  location.pathname === '/admin-signin'
                    ? 'bg-turquesa/20 text-turquesa border border-turquesa/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Admin</span>
              </Link>
              
              <Link
                to="/signup"
                className="ml-4 px-6 py-2 bg-gradient-to-r from-turquesa to-turquesa-dark text-white font-bold rounded-xl hover:from-turquesa-dark hover:to-turquesa transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Registrar App</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-700/50 py-4 space-y-2">
              <Link
                to="/signin"
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  location.pathname === '/signin'
                    ? 'bg-turquesa/20 text-turquesa'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/admin-signin"
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  location.pathname === '/admin-signin'
                    ? 'bg-turquesa/20 text-turquesa'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Login
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-3 bg-gradient-to-r from-turquesa to-turquesa-dark text-white font-bold rounded-xl hover:from-turquesa-dark hover:to-turquesa transition-all duration-300 text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Registrar App
              </Link>
            </div>
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-turquesa to-turquesa-dark rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-white text-xl font-bold">🔐</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-turquesa to-turquesa-dark bg-clip-text text-transparent">
                Security Service
              </span>
            </Link>
            
            {/* User Type Badge */}
            <div className="hidden sm:block">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                isAdmin 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
              }`}>
                {isAdmin ? '👑 Admin' : '👤 User'}
              </span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {isAdmin ? (
              <>
                <Link
                  to="/admin-dashboard"
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    location.pathname === '/admin-dashboard'
                      ? 'bg-turquesa/20 text-turquesa border border-turquesa/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/apps"
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    location.pathname === '/apps'
                      ? 'bg-turquesa/20 text-turquesa border border-turquesa/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>Apps</span>
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  location.pathname === '/dashboard'
                    ? 'bg-turquesa/20 text-turquesa border border-turquesa/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                <span>Dashboard</span>
              </Link>
            )}
            
            <Link
              to="/roles"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                location.pathname === '/roles'
                  ? 'bg-turquesa/20 text-turquesa border border-turquesa/30'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span>Roles</span>
            </Link>
            
            <Link
              to="/screens"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                location.pathname === '/screens'
                  ? 'bg-turquesa/20 text-turquesa border border-turquesa/30'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Screens</span>
            </Link>
            
            <Link
              to="/user-registration"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                location.pathname === '/user-registration'
                  ? 'bg-turquesa/20 text-turquesa border border-turquesa/30'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Users</span>
            </Link>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="ml-4 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Salir</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-700/50 py-4 space-y-2">
            {/* User badge mobile */}
            <div className="px-4 py-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                isAdmin 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
              }`}>
                {isAdmin ? '👑 Admin' : '👤 User'}
              </span>
            </div>
            
            {isAdmin ? (
              <>
                <Link
                  to="/admin-dashboard"
                  className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    location.pathname === '/admin-dashboard'
                      ? 'bg-turquesa/20 text-turquesa'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard Admin
                </Link>
                <Link
                  to="/apps"
                  className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    location.pathname === '/apps'
                      ? 'bg-turquesa/20 text-turquesa'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Aplicaciones
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  location.pathname === '/dashboard'
                    ? 'bg-turquesa/20 text-turquesa'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            
            <Link
              to="/roles"
              className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                location.pathname === '/roles'
                  ? 'bg-turquesa/20 text-turquesa'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Roles
            </Link>
            
            <Link
              to="/screens"
              className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                location.pathname === '/screens'
                  ? 'bg-turquesa/20 text-turquesa'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Screens
            </Link>
            
            <Link
              to="/user-registration"
              className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                location.pathname === '/user-registration'
                  ? 'bg-turquesa/20 text-turquesa'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Usuarios
            </Link>
            
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
