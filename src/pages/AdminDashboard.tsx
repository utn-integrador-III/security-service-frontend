import React, { useState, useEffect } from 'react';
import { AuthService } from '../services/authService';
import { AppService } from '../services/appService';
import type { App } from '../services/appService';
import { Link } from 'react-router-dom';

interface UserData {
  name?: string;
  email?: string;
  role?: {
    name?: string;
  };
}

const AdminDashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [adminApps, setAdminApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        console.log('🚀 Loading dashboard data...');
        console.log('🔍 Is authenticated:', AuthService.isAuthenticated());
        console.log('🔍 Token exists:', !!localStorage.getItem('auth_token'));
        
        const data = AuthService.getUserData();
        setUserData(data);
        
        // Cargar apps del admin
        console.log('📡 Loading admin apps...');
        const apps = await AppService.getAdminApps();
        setAdminApps(apps);
        console.log('✅ Dashboard data loaded successfully');
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-20 flex items-center justify-center">
        <div className="bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-turquesa to-turquesa-dark rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="animate-spin w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Cargando Panel</h3>
          <p className="text-gray-300">Preparando tu panel de administración...</p>
        </div>
      </div>
    );
  }

  if (!AuthService.isAdmin()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-20 flex items-center justify-center">
        <div className="bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-red-500/30 shadow-2xl p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Acceso Denegado</h3>
          <p className="text-gray-300 mb-6">Solo los administradores pueden acceder a este panel.</p>
          <Link 
            to="/admin_signin" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-turquesa to-turquesa-dark text-white font-bold rounded-xl hover:from-turquesa-dark hover:to-turquesa transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Iniciar Sesión como Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-20">
      {/* Contenedor principal */}
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Header del Admin Dashboard */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Panel de Administración</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Bienvenido, <span className="text-turquesa font-semibold">{userData?.name || 'Administrador'}</span>
          </p>
        </div>

        {/* Stats Grid - Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Usuarios */}
          <div className="bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-6 hover:border-blue-500/30 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Gestión de Usuarios</h3>
            <p className="text-gray-400 text-sm mb-4">Administra usuarios del sistema</p>
            <Link 
              to="/user-registration"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              Gestionar Usuarios
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Roles */}
          <div className="bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-6 hover:border-green-500/30 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Roles del Sistema</h3>
            <p className="text-gray-400 text-sm mb-4">Configura roles y permisos</p>
            <Link 
              to="/roles"
              className="inline-flex items-center text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
            >
              Gestionar Roles
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Pantallas */}
          <div className="bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-6 hover:border-purple-500/30 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Pantallas</h3>
            <p className="text-gray-400 text-sm mb-4">Administra pantallas del sistema</p>
            <Link 
              to="/screens"
              className="inline-flex items-center text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
            >
              Gestionar Pantallas
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Aplicaciones */}
          <div className="bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-6 hover:border-turquesa/30 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-turquesa to-turquesa-dark rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white group-hover:text-turquesa transition-colors">{adminApps.length}</p>
                <p className="text-xs text-gray-400">Apps</p>
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-turquesa transition-colors">Aplicaciones</h3>
            <p className="text-gray-400 text-sm mb-4">Gestiona aplicaciones registradas</p>
            <Link 
              to="/apps"
              className="inline-flex items-center text-turquesa hover:text-turquesa-light text-sm font-medium transition-colors"
            >
              Gestionar Apps
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Content Grid - Acciones y información del sistema */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Panel de Acciones Principales */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-8 h-full flex flex-col">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Acciones Rápidas</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                {/* Crear Usuario */}
                <Link 
                  to="/user-registration" 
                  className="bg-gray-900/30 rounded-2xl border border-gray-700/50 p-6 hover:border-blue-500/50 transition-all duration-300 group hover:bg-gray-900/50"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">Crear Nuevo Usuario</h3>
                      <p className="text-gray-400 text-sm">Registrar un nuevo usuario en el sistema con roles específicos</p>
                    </div>
                  </div>
                </Link>

                {/* Gestionar Roles */}
                <Link 
                  to="/roles" 
                  className="bg-gray-900/30 rounded-2xl border border-gray-700/50 p-6 hover:border-green-500/50 transition-all duration-300 group hover:bg-gray-900/50"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">Gestionar Roles</h3>
                      <p className="text-gray-400 text-sm">Crear y modificar roles del sistema con permisos específicos</p>
                    </div>
                  </div>
                </Link>

                {/* Gestionar Permisos */}
                <Link 
                  to="/permissions" 
                  className="bg-gray-900/30 rounded-2xl border border-gray-700/50 p-6 hover:border-purple-500/50 transition-all duration-300 group hover:bg-gray-900/50"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">Gestionar Permisos</h3>
                      <p className="text-gray-400 text-sm">Configurar permisos y niveles de acceso del sistema</p>
                    </div>
                  </div>
                </Link>

                {/* Gestionar Apps */}
                <Link 
                  to="/apps" 
                  className="bg-gray-900/30 rounded-2xl border border-gray-700/50 p-6 hover:border-turquesa/50 transition-all duration-300 group hover:bg-gray-900/50"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-turquesa to-turquesa-dark rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-turquesa transition-colors">Gestionar Aplicaciones</h3>
                      <p className="text-gray-400 text-sm">Administrar aplicaciones registradas y sus configuraciones</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Panel de Información del Sistema */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-8 h-full flex flex-col">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Información del Sistema</h2>
              </div>

              <div className="grid grid-cols-2 gap-4 flex-1 content-start">
                {/* Tipo de Usuario */}
                <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-700/50 flex flex-col justify-between min-h-[100px]">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Tipo de Usuario
                  </label>
                  <div className="flex items-center space-x-2 mt-auto">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium border border-purple-500/30">
                      Admin
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-700/50 flex flex-col justify-between min-h-[100px]">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <p className="text-white font-medium text-sm truncate mt-auto" title={userData?.email || 'N/A'}>{userData?.email || 'N/A'}</p>
                </div>

                {/* Estado */}
                <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-700/50 flex flex-col justify-between min-h-[100px]">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Estado
                  </label>
                  <div className="flex items-center space-x-2 mt-auto">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium border border-green-500/30">
                      Activo
                    </span>
                  </div>
                </div>

                {/* Aplicaciones */}
                <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-700/50 flex flex-col justify-between min-h-[100px]">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Aplicaciones
                  </label>
                  <p className="text-xl font-bold text-turquesa mt-auto">{adminApps.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
