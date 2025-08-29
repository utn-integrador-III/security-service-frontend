import React, { useState, useEffect } from 'react';
import { AppService } from '../services/appService';
import { UserService, type User } from '../services/userService';
import { RoleService } from '../services/roleService';

const UserManagement: React.FC = () => {
  const [selectedAppId, setSelectedAppId] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [apps, setApps] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadApps = async () => {
    try {
      console.log('🚀 Loading admin apps...');
      const adminApps = await AppService.getAdminApps();
      setApps(adminApps);
      console.log('Loaded admin apps:', adminApps);
      
      // Auto-select first app if available
      if (adminApps.length > 0 && !selectedAppId) {
        setSelectedAppId(adminApps[0]._id || '');
      }
    } catch (error) {
      console.error('Error loading admin apps:', error);
      setError('Error loading applications. Please try again.');
    }
  };

  const loadUsers = async () => {
    if (!selectedAppId) return;
    
    setLoading(true);
    setError('');
    
    try {
      console.log('🚀 Loading users for app:', selectedAppId);
      const appUsers = await UserService.getUsersByApp(selectedAppId);
      setUsers(appUsers);
      console.log('Loaded users:', appUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Error loading users for this application.');
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      console.log('🚀 Loading roles...');
      const adminRoles = await RoleService.getAdminRoles();
      setRoles(adminRoles);
      console.log('Loaded roles:', adminRoles);
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  // Load apps on component mount
  useEffect(() => {
    loadApps();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load users when app is selected
  useEffect(() => {
    if (selectedAppId) {
      loadUsers();
      loadRoles();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAppId]);

  const handleAppChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const appId = e.target.value;
    setSelectedAppId(appId);
    setUsers([]);
    setError('');
    setSuccess('');
  };

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r._id === roleId);
    return role ? role.name : 'Rol no encontrado';
  };

  const getAppName = (appId: string) => {
    const app = apps.find(a => a._id === appId);
    return app ? app.name : 'App no encontrada';
  };

  const handleStatusChange = async (userId: string, newStatus: 'Active' | 'Pending' | 'Inactive') => {
    if (!selectedAppId) return;

    try {
      setLoading(true);
      await UserService.updateUserAppStatus(userId, selectedAppId, newStatus);
      setSuccess('Estado del usuario actualizado correctamente');
      
      // Reload users to get updated data
      await loadUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      setError('Error al actualizar el estado del usuario');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Active': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Inactive': 'bg-red-500/20 text-red-400 border-red-500/30'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-turquesa to-turquesa-dark rounded-2xl mb-6 shadow-xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Administra los usuarios registrados en tus aplicaciones
          </p>
        </div>

        {/* App Selection */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-8">
          <div className="space-y-4">
            <label htmlFor="appSelect" className="block text-lg font-semibold text-gray-200">
              Seleccionar Aplicación
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-5v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
              </div>
              <select
                id="appSelect"
                value={selectedAppId}
                onChange={handleAppChange}
                className="block w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-turquesa focus:border-transparent transition-all duration-300"
              >
                <option value="" className="bg-gray-800">Selecciona una aplicación</option>
                {apps.map(app => (
                  <option key={app._id} value={app._id} className="bg-gray-800">
                    {app.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 mb-6 flex items-center space-x-3">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-red-200 text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 mb-6 flex items-center space-x-3">
            <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-200 text-sm">{success}</span>
          </div>
        )}

        {/* Users Table */}
        {selectedAppId && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Usuarios de la Aplicación</h2>
                  <p className="text-gray-300 mt-1">
                    {getAppName(selectedAppId)} • {users.length} usuario{users.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {loading && (
                  <div className="flex items-center space-x-2 text-gray-400">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Cargando...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Sesión
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {users.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <div>
                            <p className="text-gray-400 font-medium">No hay usuarios registrados</p>
                            <p className="text-gray-500 text-sm mt-1">
                              Los usuarios aparecerán aquí cuando se registren en esta aplicación
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map(user => {
                      // Find the app assignment for the selected app
                      const userApp = user.apps.find(app => app.app === selectedAppId);
                      
                      return (
                        <tr key={user.id || user._id} className="hover:bg-white/5 transition-colors duration-200">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-turquesa to-turquesa-dark rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-white font-medium">{user.name}</p>
                                <p className="text-gray-400 text-sm">
                                  {user.creation_date && new Date(user.creation_date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-300">{user.email}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-300">
                              {userApp ? getRoleName(userApp.role) : 'Sin rol'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(userApp?.status || user.status)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center space-x-1 ${
                              userApp?.is_session_active || user.is_session_active 
                                ? 'text-green-400' 
                                : 'text-gray-500'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                userApp?.is_session_active || user.is_session_active 
                                  ? 'bg-green-400' 
                                  : 'bg-gray-500'
                              }`}></div>
                              <span className="text-xs">
                                {userApp?.is_session_active || user.is_session_active ? 'Activa' : 'Inactiva'}
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={userApp?.status || user.status}
                              onChange={(e) => handleStatusChange(
                                user.id || user._id || '', 
                                e.target.value as 'Active' | 'Pending' | 'Inactive'
                              )}
                              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-turquesa focus:border-transparent"
                              disabled={loading}
                            >
                              <option value="Active" className="bg-gray-800">Activo</option>
                              <option value="Pending" className="bg-gray-800">Pendiente</option>
                              <option value="Inactive" className="bg-gray-800">Inactivo</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            ¿Necesitas registrar más usuarios?{' '}
            <a 
              href="/user-registration" 
              className="text-turquesa hover:text-turquesa-dark font-semibold hover:underline transition-colors duration-300"
            >
              Ir a Registro de Usuarios
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
