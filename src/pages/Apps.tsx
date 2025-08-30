import React, { useState, useEffect } from 'react';
import { AppService } from '../services/appService';
import type { App } from '../services/appService';

const Apps: React.FC = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estados para el modal de crear app
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingApp, setCreatingApp] = useState(false);
  const [newAppData, setNewAppData] = useState({
    name: '',
    redirect_url: '',
    status: 'active' as 'active' | 'inactive'
  });

  // Estados para el modal de editar app
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingApp, setEditingApp] = useState(false);
  const [editingAppData, setEditingAppData] = useState({
    _id: '',
    name: '',
    redirect_url: '',
    status: 'active' as 'active' | 'inactive'
  });

  // Estados para el modal de ver detalles
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);



  // Cargar apps al montar el componente
  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    setLoading(true);
    setError(null);
    try {
      const appsData = await AppService.getAdminApps();
      setApps(appsData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar aplicaciones';
      setError(errorMessage);
      console.error('Error loading apps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingApp(true);
    setError(null);
    setSuccess(null);

    try {
      // Obtener el admin_id del token
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      const adminId = payload.admin_id || payload.user_id || payload.sub || payload.id;

      if (!adminId) {
        throw new Error('No se pudo obtener el ID del administrador');
      }

      const appData = {
        ...newAppData,
        admin_id: adminId
      };

      await AppService.createApp(appData);

      // Cerrar modal y limpiar formulario
      setShowCreateModal(false);
      setNewAppData({ name: '', redirect_url: '', status: 'active' });
      setSuccess('¡Aplicación creada exitosamente!');

      // Recargar la lista de apps
      await loadApps();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear la aplicación';
      setError(errorMessage);
      console.error('Error creating app:', error);
    } finally {
      setCreatingApp(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAppData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
    setError(null);
    setSuccess(null);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewAppData({ name: '', redirect_url: '', status: 'active' });
    setError(null);
  };

  // Funciones para editar app
  const openEditModal = (app: App) => {
    setEditingAppData({
      _id: app._id || '',
      name: app.name,
      redirect_url: app.redirect_url,
      status: app.status
    });
    setShowEditModal(true);
    setError(null);
    setSuccess(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingAppData({ _id: '', name: '', redirect_url: '', status: 'active' });
    setError(null);
  };

  const handleEditApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditingApp(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('🔄 Starting app edit...');
      await AppService.updateApp(editingAppData._id, {
        name: editingAppData.name,
        redirect_url: editingAppData.redirect_url,
        status: editingAppData.status
      });
      console.log('✅ App edit completed');

      // Cerrar modal y limpiar formulario
      setShowEditModal(false);
      setEditingAppData({ _id: '', name: '', redirect_url: '', status: 'active' });
      setSuccess('¡Aplicación actualizada exitosamente!');

      // Recargar la lista de apps
      await loadApps();
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar la aplicación';
      setError(errorMessage);
      console.error('Error updating app:', error);
      
      // Limpiar mensaje de error después de 5 segundos
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setEditingApp(false);
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditingAppData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Funciones para ver detalles
  const openDetailsModal = (app: App) => {
    setSelectedApp(app);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedApp(null);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-20">
      {/* Contenedor principal */}
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-turquesa to-turquesa-dark rounded-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Mis Aplicaciones</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Gestiona y administra todas tus aplicaciones registradas en el sistema
          </p>
        </div>

        {/* Botón de crear aplicación y mensajes */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Aplicaciones Registradas</h2>
            </div>
            <button 
              onClick={openCreateModal}
              className="px-6 py-3 bg-gradient-to-r from-turquesa to-turquesa-dark text-white font-bold rounded-xl hover:from-turquesa-dark hover:to-turquesa transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Registrar Aplicación</span>
            </button>
          </div>

          {/* Mensajes de estado */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center space-x-3 mb-6">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-red-300 text-sm font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center space-x-3 mb-6">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-300 text-sm font-medium">{success}</span>
            </div>
          )}

          {loading && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-center space-x-3 mb-6">
              <svg className="animate-spin w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-blue-300 text-sm font-medium">Cargando aplicaciones...</span>
            </div>
          )}
        </div>

        {/* Lista de aplicaciones */}
        <div className="mb-8">
          {apps.length === 0 && !loading ? (
            <div className="bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-300 mb-3">No tienes aplicaciones registradas</h3>
              <p className="text-gray-400 mb-6">Aún no has registrado ninguna aplicación en el sistema.</p>
              <p className="text-sm text-gray-500">Haz clic en "Registrar Aplicación" para comenzar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps.map((app) => (
                <div key={app._id} className="bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-6 hover:border-turquesa/30 transition-all duration-300 group">
                  {/* Header de la app */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-turquesa transition-colors">
                        {app.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          app.status === 'active'
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}>
                          {app.status === 'active' ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Detalles de la app */}
                  <div className="space-y-3 mb-6">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        URL de Redirección
                      </label>
                      <p className="text-sm text-gray-300 break-all bg-gray-900/30 rounded-lg p-2 border border-gray-700/50">
                        {app.redirect_url}
                      </p>
                    </div>
                    
                    {app.creation_date && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                          Fecha de Creación
                        </label>
                        <p className="text-sm text-gray-300">
                          {new Date(app.creation_date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex space-x-2">
                    <button 
                      className="flex-1 p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                      onClick={() => openEditModal(app)}
                      title="Editar aplicación"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span className="text-xs font-medium">Editar</span>
                    </button>
                    
                    <button 
                      className="flex-1 p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                      onClick={() => openDetailsModal(app)}
                      title="Ver detalles"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="text-xs font-medium">Detalles</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear nueva aplicación */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-8 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Registrar Nueva Aplicación</h2>
              </div>
              <button
                onClick={closeCreateModal}
                className="text-gray-400 hover:text-white transition-colors rounded-lg p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateApp} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Nombre de la Aplicación
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={newAppData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-turquesa focus:border-turquesa transition-all duration-300"
                  placeholder="Mi Aplicación Web"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="redirect_url" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  URL de Redirección
                </label>
                <input
                  id="redirect_url"
                  name="redirect_url"
                  type="url"
                  required
                  value={newAppData.redirect_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-turquesa focus:border-turquesa transition-all duration-300"
                  placeholder="https://miapp.com/auth/callback"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Estado
                </label>
                <select
                  id="status"
                  name="status"
                  value={newAppData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-turquesa focus:border-turquesa transition-all duration-300"
                >
                  <option value="active" className="bg-gray-800">Activa</option>
                  <option value="inactive" className="bg-gray-800">Inactiva</option>
                </select>
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={creatingApp}
                  className="flex-1 py-3 px-4 bg-gray-600/20 text-gray-300 font-semibold rounded-xl hover:bg-gray-600/30 transition-all duration-300 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creatingApp}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-turquesa to-turquesa-dark text-white font-bold rounded-xl hover:from-turquesa-dark hover:to-turquesa transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {creatingApp ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creando...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Registrar Aplicación</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar aplicación */}
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
                <h2 className="text-xl font-bold text-white">Editar Aplicación</h2>
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

            <form onSubmit={handleEditApp} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Nombre de la Aplicación
                </label>
                <input
                  id="edit-name"
                  name="name"
                  type="text"
                  required
                  value={editingAppData.name}
                  onChange={handleEditInputChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-turquesa focus:border-turquesa transition-all duration-300"
                  placeholder="Mi Aplicación Web"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-redirect_url" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  URL de Redirección
                </label>
                <input
                  id="edit-redirect_url"
                  name="redirect_url"
                  type="url"
                  required
                  value={editingAppData.redirect_url}
                  onChange={handleEditInputChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-turquesa focus:border-turquesa transition-all duration-300"
                  placeholder="https://miapp.com/auth/callback"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-status" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Estado
                </label>
                <select
                  id="edit-status"
                  name="status"
                  value={editingAppData.status}
                  onChange={handleEditInputChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-turquesa focus:border-turquesa transition-all duration-300"
                >
                  <option value="active" className="bg-gray-800">Activa</option>
                  <option value="inactive" className="bg-gray-800">Inactiva</option>
                </select>
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={editingApp}
                  className="flex-1 py-3 px-4 bg-gray-600/20 text-gray-300 font-semibold rounded-xl hover:bg-gray-600/30 transition-all duration-300 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={editingApp}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-turquesa to-turquesa-dark text-white font-bold rounded-xl hover:from-turquesa-dark hover:to-turquesa transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {editingApp ? (
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
                      <span>Actualizar Aplicación</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para ver detalles de la aplicación */}
      {showDetailsModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-8 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Detalles de la Aplicación</h2>
              </div>
              <button
                onClick={closeDetailsModal}
                className="text-gray-400 hover:text-white transition-colors rounded-lg p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Nombre de la Aplicación
                </label>
                <div className="bg-gray-900/30 rounded-xl p-3 border border-gray-700/50">
                  <p className="text-white font-medium">{selectedApp.name}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  URL de Redirección
                </label>
                <div className="bg-gray-900/30 rounded-xl p-3 border border-gray-700/50">
                  <p className="text-white break-all font-mono text-sm">{selectedApp.redirect_url}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Estado
                </label>
                <div className="flex items-center">
                  <span className={`px-4 py-2 rounded-xl text-sm font-medium border ${
                    selectedApp.status === 'active'
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {selectedApp.status === 'active' ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </div>

              {selectedApp.creation_date && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Fecha de Creación
                  </label>
                  <div className="bg-gray-900/30 rounded-xl p-3 border border-gray-700/50">
                    <p className="text-white">
                      {new Date(selectedApp.creation_date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )}

              {selectedApp._id && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    ID de la Aplicación
                  </label>
                  <div className="bg-gray-900/30 rounded-xl p-3 border border-gray-700/50">
                    <p className="text-turquesa font-mono text-sm break-all">{selectedApp._id}</p>
                  </div>
                </div>
              )}

              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={closeDetailsModal}
                  className="flex-1 py-3 px-4 bg-gray-600/20 text-gray-300 font-semibold rounded-xl hover:bg-gray-600/30 transition-all duration-300"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeDetailsModal();
                    openEditModal(selectedApp);
                  }}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Editar Aplicación</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Apps;
