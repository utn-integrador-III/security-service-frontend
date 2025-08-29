import React, { useState, useEffect } from 'react';
import { ScreenService } from '../services/screenService';
import { RoleService } from '../services/roleService';
import { AppService } from '../services/appService';
import type { Role } from '../services/roleService';
import type { Screen } from '../services/screenService';
import type { App } from '../services/appService';

const Screens: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [apps, setApps] = useState<App[]>([]);
  const [roleId, setRoleId] = useState('');
  const [appId, setAppId] = useState('');
  const [screenPath, setScreenPath] = useState('');
  const [screens, setScreens] = useState<(Screen | string)[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingScreens, setLoadingScreens] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estados para editar y eliminar screens
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingScreen, setEditingScreen] = useState(false);
  const [deletingScreen, setDeletingScreen] = useState(false);
  const [selectedScreenToEdit, setSelectedScreenToEdit] = useState<string>('');
  const [selectedScreenToDelete, setSelectedScreenToDelete] = useState<string>('');
  const [newScreenPath, setNewScreenPath] = useState<string>('');

  useEffect(() => {
    loadRoles();
    loadApps();
    // No cargar screens automáticamente, se cargarán cuando se seleccione un rol
  }, []);

  // Efecto para seleccionar automáticamente el primer rol cuando se cargan los roles
  useEffect(() => {
    if (roles.length > 0 && !roleId) {
      const firstRole = roles[0];
      setRoleId(firstRole._id || '');
      loadAppForRole(firstRole._id || '');
      // Cargar screens del primer rol automáticamente
      loadScreens(firstRole._id || '');
      console.log('🔧 Rol seleccionado automáticamente desde useEffect:', firstRole.name);
    }
  }, [roles]); // Removido roleId de las dependencias para evitar cambios automáticos

  const loadRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const rolesData = await RoleService.getAdminRoles();
      setRoles(rolesData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cargar roles');
      console.error('Error loading roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadApps = async () => {
    try {
      const appsData = await AppService.getAdminApps();
      setApps(appsData);
      console.log('📱 Apps cargadas:', appsData);
      console.log('📱 Total de apps disponibles:', appsData.length);
    } catch (error) {
      console.error('Error loading apps:', error);
      setError('Error al cargar las aplicaciones');
    }
  };

  const loadScreens = async (selectedRoleId?: string) => {
    setLoadingScreens(true);
    try {
      console.log('🔄 Iniciando carga de screens...');
      
      // Si no se proporciona un roleId, no cargar screens
      if (!selectedRoleId) {
        console.log('ℹ️ No hay rol seleccionado, no se cargan screens');
        setScreens([]);
        return;
      }
      
      // Obtener screens específicas del rol seleccionado
      const screensData = await ScreenService.getScreensByRole(selectedRoleId);
      console.log('📋 Screens cargadas para el rol seleccionado:', screensData);
      console.log('📋 Estructura de la primera screen:', screensData[0]);
      console.log('📋 Tipo de screens:', typeof screensData);
      console.log('📋 Es array:', Array.isArray(screensData));
      setScreens(screensData);

      if (screensData.length === 0) {
        console.log('ℹ️ No hay screens asignadas a este rol');
      } else {
        console.log(`✅ ${screensData.length} screens cargadas exitosamente para el rol`);
      }
    } catch (error) {
      console.error('❌ Error loading screens:', error);
      setError('Error al cargar las pantallas asignadas');
    } finally {
      setLoadingScreens(false);
    }
  };

  // Función para cargar automáticamente la app del rol seleccionado y sus screens
  const loadAppForRole = (selectedRoleId: string) => {
    if (!selectedRoleId) {
      setAppId('');
      return;
    }

    const selectedRole = roles.find(role => role._id === selectedRoleId);
    console.log('🔍 Rol seleccionado:', selectedRole?.name);

    if (selectedRole?.app_id) {
      console.log('📱 App ID del rol:', selectedRole.app_id);
      setAppId(selectedRole.app_id);
      
      const assignedApp = apps.find(app => app._id === selectedRole.app_id);
      console.log('📱 App asignada encontrada:', assignedApp);
    } else {
      console.log('❌ El rol no tiene una app asignada');
      setError('El rol seleccionado no tiene una aplicación asignada');
      setAppId('');
    }

    const assignedApp = apps.find(app => app._id === selectedRole?.app_id);
    if (assignedApp) {
      console.log('  - Nombre de la app:', assignedApp.name);
    }
    
    // Cargar screens específicas del rol seleccionado
    loadScreens(selectedRoleId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('🚀 Enviando asignación de screen:', {
        roleId,
        appId,
        screenPath
      });

      const currentScreens = Array.isArray(screens) ? screens : [];
      console.log('📋 Screens actuales antes de agregar:', currentScreens);

      const screenPathToAdd = screenPath.trim();
      console.log('📱 Screen path a agregar:', screenPathToAdd);

      // Verificar si la screen ya está asignada
      const screenExists = currentScreens.some(screen => {
        const existingScreenPath = typeof screen === 'string' ? screen : screen.screen_path;
        return existingScreenPath === screenPathToAdd;
      });

      if (screenExists) {
        setError(`La pantalla "${screenPathToAdd}" ya está asignada a este rol`);
        return;
      }

      const { ScreenService } = await import('../services/screenService');
      await ScreenService.assignScreenToRole(screenPathToAdd, roleId, appId, currentScreens);

      const selectedRole = roles.find(role => role._id === roleId);
      const selectedApp = apps.find(app => app._id === appId);

      setSuccess(`✅ Screen "${screenPath}" asignado exitosamente al rol "${selectedRole?.name}" en la aplicación "${selectedApp?.name}"`);

      // Limpiar solo el campo de screen path, mantener el rol y app seleccionados
      setScreenPath('');

      // Limpiar mensaje de éxito después de 5 segundos
      setTimeout(() => setSuccess(null), 5000);

      // Recargar la lista de screens del rol actual
      await loadScreens(roleId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al asignar screens';
      setError(errorMessage);
      console.error('❌ Error en asignación:', error);
      
      // Limpiar mensaje de error después de 5 segundos
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScreen = async (screenPath: string) => {
    if (!roleId || !appId) {
      console.error('❌ Faltan roleId o appId para eliminar screen');
      setError('Error: Faltan datos del rol o aplicación');
      return;
    }

    try {
      console.log('🗑️ Eliminando screen:', {
        screenPath,
        roleId,
        appId,
        currentScreens: screens
      });

      const currentScreens = Array.isArray(screens) ? 
        screens.map(screen => typeof screen === 'string' ? screen : screen.screen_path) : [];
      const currentAppId = appId;

      const { ScreenService } = await import('../services/screenService');
      await ScreenService.deleteScreenByPath(screenPath, roleId, currentAppId, currentScreens);

      // Recargar screens del rol actual en lugar de actualizar manualmente
      await loadScreens(roleId);
      setSuccess(`Screen "${screenPath}" eliminada exitosamente`);

      // Limpiar mensaje de error después de 3 segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar la pantalla';
      setError(errorMessage);
      console.error('❌ Error al eliminar screen:', error);
    }
  };

  const openEditModal = (screenPath: string) => {
    setSelectedScreenToEdit(screenPath);
    setNewScreenPath(screenPath);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedScreenToEdit('');
    setNewScreenPath('');
  };



  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedScreenToDelete('');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditingScreen(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('✏️ Editando screen:', {
        selectedScreenToEdit,
        newScreenPath,
        roleId,
        appId,
        currentScreens: screens
      });

      if (!selectedScreenToEdit || !newScreenPath.trim()) {
        setError('Datos incompletos para la edición');
        return;
      }

      const currentAppId = appId;
      const currentScreens = Array.isArray(screens) ? 
        screens.map(screen => typeof screen === 'string' ? screen : screen.screen_path) : [];

      const { ScreenService } = await import('../services/screenService');
      await ScreenService.updateScreenByPath(selectedScreenToEdit, newScreenPath, roleId, currentAppId, currentScreens);        

      // Recargar screens del rol actual en lugar de actualizar manualmente
      await loadScreens(roleId);

      setShowEditModal(false);
      setSelectedScreenToEdit('');
      setNewScreenPath('');
      setSuccess(`Screen actualizada de "${selectedScreenToEdit}" a "${newScreenPath}" exitosamente`);

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar la pantalla';
      setError(errorMessage);
      console.error('❌ Error al editar screen:', error);
    } finally {
      setEditingScreen(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeletingScreen(true);
    setError(null);
    setSuccess(null);

    try {
      await handleDeleteScreen(selectedScreenToDelete);
      setShowDeleteModal(false);
      setSelectedScreenToDelete('');
    } catch (error) {
      console.error('❌ Error en confirmación de eliminación:', error);
    } finally {
      setDeletingScreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-20">
      {/* Contenedor principal */}
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Gestión de Pantallas</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Administra las pantallas accesibles para cada rol del sistema
          </p>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center space-x-3 mb-6 max-w-4xl mx-auto">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-red-300 text-sm font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center space-x-3 mb-6 max-w-4xl mx-auto">
            <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-300 text-sm font-medium">{success}</span>
          </div>
        )}

        {loading && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-center space-x-3 mb-6 max-w-4xl mx-auto">
            <svg className="animate-spin w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-blue-300 text-sm font-medium">Cargando datos...</span>
          </div>
        )}

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Panel de asignación - Izquierda */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Asignar Nueva Pantalla</h2>
              </div>
              
              {/* Formulario de asignación */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selección de Rol */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Seleccionar Rol
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={roleId}
                    onChange={(e) => {
                      setRoleId(e.target.value);
                      loadAppForRole(e.target.value);
                    }}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    required
                  >
                    <option value="" className="bg-gray-800">Selecciona un rol</option>
                    {roles.map((role) => (
                      <option key={role._id} value={role._id} className="bg-gray-800">
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selección de Aplicación */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Aplicación Asignada
                  </label>
                  <input
                    type="text"
                    value={apps.find(app => app._id === appId)?.name || 'No hay aplicación asignada'}
                    disabled
                    className="w-full px-4 py-3 bg-gray-900/30 border border-gray-600/30 rounded-xl text-gray-400 cursor-not-allowed"
                  />
                </div>

                {/* Path de la Pantalla */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Ruta de la Pantalla
                  </label>
                  <input
                    type="text"
                    id="screenPath"
                    name="screenPath"
                    value={screenPath}
                    onChange={(e) => setScreenPath(e.target.value)}
                    placeholder="/dashboard, /users, /settings..."
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    required
                  />
                </div>

                {/* Botón de envío */}
                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setScreenPath('');
                    }}
                    className="flex-1 py-3 px-4 bg-gray-600/20 text-gray-300 font-semibold rounded-xl hover:bg-gray-600/30 transition-all duration-300"
                  >
                    Limpiar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !roleId || !appId || !screenPath}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Asignando...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Asignar Pantalla</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Panel de pantallas asignadas - Derecha */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-8 h-full flex flex-col">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Pantallas Asignadas</h2>
              </div>

              {loadingScreens && (
                <div className="flex items-center justify-center py-12">
                  <svg className="animate-spin w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}

              {!loadingScreens && screens.length === 0 && roleId && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Sin pantallas asignadas</h3>
                  <p className="text-gray-400 text-sm">Este rol no tiene pantallas asignadas aún.</p>
                </div>
              )}

              {!loadingScreens && !roleId && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Selecciona un rol</h3>
                  <p className="text-gray-400 text-sm">Elige un rol para ver sus pantallas asignadas.</p>
                </div>
              )}

              {screens.length > 0 && (
                <div className="space-y-3 flex-1">
                  {screens.map((screen, index) => {
                    const screenPath = typeof screen === 'string' ? screen : screen.screen_path;
                    
                    return (
                      <div key={`${screenPath}-${index}`} className="bg-gray-900/30 rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium truncate" title={screenPath}>
                                {screenPath}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-3">
                            <button
                              onClick={() => openEditModal(screenPath)}
                              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-300"
                              title="Editar pantalla"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteScreen(screenPath)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                              title="Eliminar pantalla"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal para editar pantalla */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-8 w-full max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">Editar Pantalla</h2>
                </div>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-white transition-colors rounded-lg p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Nueva Ruta de Pantalla
                  </label>
                  <input
                    type="text"
                    value={newScreenPath}
                    onChange={(e) => setNewScreenPath(e.target.value)}
                    placeholder="/nueva-ruta"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    required
                  />
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    disabled={editingScreen}
                    className="flex-1 py-3 px-4 bg-gray-600/20 text-gray-300 font-semibold rounded-xl hover:bg-gray-600/30 transition-all duration-300 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={editingScreen}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {editingScreen ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Actualizando...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Actualizar</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de confirmación de eliminación */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-red-500/30 shadow-2xl p-8 w-full max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">Confirmar Eliminación</h2>
                </div>
                <button
                  onClick={closeDeleteModal}
                  className="text-gray-400 hover:text-white transition-colors rounded-lg p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <p className="text-white font-medium mb-2">¿Estás seguro de que deseas eliminar esta pantalla?</p>
                  <p className="text-gray-300 text-sm">
                    Se eliminará la pantalla: <span className="font-mono bg-gray-900/50 px-2 py-1 rounded">{selectedScreenToDelete}</span>
                  </p>
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    disabled={deletingScreen}
                    className="flex-1 py-3 px-4 bg-gray-600/20 text-gray-300 font-semibold rounded-xl hover:bg-gray-600/30 transition-all duration-300 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={deletingScreen}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {deletingScreen ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Eliminando...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Eliminar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Screens;
