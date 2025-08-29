import React, { useState, useEffect } from 'react';
import { RoleService } from '../services/roleService';
import { AppService } from '../services/appService';
import type { Role } from '../services/roleService';
import type { App } from '../services/appService';

const Roles: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [appId, setAppId] = useState('');
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<string[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);

  // Estados para editar rol
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRole, setEditingRole] = useState(false);
  const [editingRoleData, setEditingRoleData] = useState({
    _id: '',
    name: '',
    description: '',
    permissions: [] as string[]
  });

  const permisosDisponibles = [
    'write',
    'read',
    'delete',
    'update',
    'LostOBJECTMNG',
    'issue_managment',
  ];

  // Cargar roles y apps al montar el componente
  useEffect(() => {
    loadRoles();
    loadApps();
  }, []);

  const loadRoles = async () => {
    try {
      const rolesData = await RoleService.getAdminRoles();
      console.log('📋 Roles del admin cargados:', rolesData);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
    } catch (error) {
      console.error('Error loading roles:', error);
      setError('Error al cargar los roles');
    }
  };

  const loadApps = async () => {
    try {
      const appsData = await AppService.getAdminApps();
      console.log('🎯 Apps del admin cargadas:', appsData);
      setApps(Array.isArray(appsData) ? appsData : []);
    } catch (error) {
      console.error('Error loading apps:', error);
    }
  };

  const handlePermisoChange = (permiso: string) => {
    setPermisosSeleccionados(prev => 
      prev.includes(permiso)
        ? prev.filter(p => p !== permiso)
        : [...prev, permiso]
    );
  };

  const handleEditPermisoChange = (permiso: string) => {
    setEditingRoleData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permiso)
        ? prev.permissions.filter((p) => p !== permiso)
        : [...prev.permissions, permiso]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validaciones
    if (!appId) {
      setError('Por favor selecciona una aplicación');
      setLoading(false);
      return;
    }

    if (!nombre.trim()) {
      setError('Por favor ingresa el nombre del rol');
      setLoading(false);
      return;
    }

    const nuevoRol = {
      name: nombre,
      description: descripcion,
      app_id: appId,
      permissions: permisosSeleccionados,
    };

    try {
      await RoleService.createRole(nuevoRol);
      setSuccess('¡Rol creado exitosamente!');
      
      // Limpiar formulario
      setNombre('');
      setDescripcion('');
      setAppId('');
      setPermisosSeleccionados([]);
      
      // Recargar roles
      await loadRoles();
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error creating role:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al crear el rol';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (role: Role) => {
    setEditingRoleData({
      _id: role._id || '',
      name: role.name,
      description: role.description,
      permissions: role.permissions || []
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingRoleData({
      _id: '',
      name: '',
      description: '',
      permissions: []
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditingRole(true);
    setError(null);
    setSuccess(null);

    try {
      await RoleService.updateRole(editingRoleData._id, {
        name: editingRoleData.name,
        description: editingRoleData.description,
        permissions: editingRoleData.permissions
      });

      setSuccess('¡Rol actualizado exitosamente!');
      closeEditModal();
      await loadRoles();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating role:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el rol';
      setError(errorMessage);
    } finally {
      setEditingRole(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    setDeletingRoleId(roleId);
    setError(null);
    setSuccess(null);

    try {
      await RoleService.deleteRole(roleId);
      setSuccess('¡Rol eliminado exitosamente!');
      await loadRoles();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error deleting role:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el rol';
      setError(errorMessage);
    } finally {
      setDeletingRoleId(null);
    }
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Mis Roles</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Crea y administra los roles de tus aplicaciones con permisos específicos
          </p>
        </div>

        {/* Layout de dos columnas en desktop, una columna en móvil */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Formulario de creación - Columna izquierda */}
          <div className="xl:col-span-1">
            <div className="bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-8 sticky top-24">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Crear Nuevo Rol</h2>
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

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Aplicación */}
                <div className="space-y-2">
                  <label htmlFor="appSelect" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Aplicación
                  </label>
                  <select
                    id="appSelect"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-turquesa focus:border-turquesa transition-all duration-300"
                    required
                  >
                    <option value="">Seleccionar aplicación</option>
                    {apps.map((app) => (
                      <option key={app._id} value={app._id} className="bg-gray-800">
                        {app.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nombre del rol */}
                <div className="space-y-2">
                  <label htmlFor="nombre" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Nombre del Rol
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-turquesa focus:border-turquesa transition-all duration-300"
                    placeholder="ej: Administrador, Editor, Viewer"
                    required
                  />
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-turquesa focus:border-turquesa transition-all duration-300 resize-none"
                    placeholder="Describe las responsabilidades de este rol"
                    rows={3}
                    required
                  />
                </div>

                {/* Permisos */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Permisos
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {permisosDisponibles.map((permiso) => (
                      <label
                        key={permiso}
                        className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          permisosSeleccionados.includes(permiso)
                            ? 'border-turquesa bg-turquesa/10 text-turquesa'
                            : 'border-gray-600/50 hover:border-gray-500 text-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={permisosSeleccionados.includes(permiso)}
                          onChange={() => handlePermisoChange(permiso)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                          permisosSeleccionados.includes(permiso)
                            ? 'border-turquesa bg-turquesa'
                            : 'border-gray-500'
                        }`}>
                          {permisosSeleccionados.includes(permiso) && (
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm font-medium capitalize">{permiso.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Botón de submit */}
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
                      <span>Creando Rol...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Crear Rol</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Lista de roles - Columna derecha */}
          <div className="xl:col-span-2">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Mis Roles Creados</h2>
                </div>
                <div className="text-sm text-gray-400">
                  {roles.length} {roles.length === 1 ? 'rol' : 'roles'}
                </div>
              </div>
            </div>

            {roles.length === 0 && !loading ? (
              <div className="bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-300 mb-3">No has creado roles aún</h3>
                <p className="text-gray-400 mb-6">Aún no has creado roles para tus aplicaciones.</p>
                <p className="text-sm text-gray-500">Puedes crear tu primer rol usando el formulario.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {roles.map((role) => {
                  // Como ya solo cargamos roles del admin actual, todos son editables
                  const canEdit = true;

                  return (
                    <div key={role._id} className="bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-6 hover:border-turquesa/30 transition-all duration-300 group">
                      {/* Header del role */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-turquesa transition-colors">
                            {role.name}
                          </h3>
                          <p className="text-gray-300 text-sm mb-3">{role.description}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span>{apps.find(app => app._id === role.app_id)?.name || 'App no encontrada'}</span>
                          </div>
                        </div>
                        
                        {canEdit && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditModal(role)}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-300 hover:scale-110"
                              title="Editar rol"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => role._id && handleDeleteRole(role._id)}
                              disabled={deletingRoleId === role._id}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-300 hover:scale-110 disabled:opacity-50"
                              title="Eliminar rol"
                            >
                              {deletingRoleId === role._id ? (
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Permisos */}
                      <div className="border-t border-gray-700/50 pt-4">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                          Permisos ({role.permissions?.length || 0})
                        </div>
                        {role.permissions && role.permissions.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.map((permission, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-turquesa/20 text-turquesa text-xs font-medium rounded-full border border-turquesa/30"
                              >
                                {permission.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic">Sin permisos asignados</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Editar Rol</h2>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Nombre del Rol
                </label>
                <input
                  type="text"
                  value={editingRoleData.name}
                  onChange={(e) => setEditingRoleData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-turquesa focus:border-turquesa transition-all duration-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Descripción
                </label>
                <textarea
                  value={editingRoleData.description}
                  onChange={(e) => setEditingRoleData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-turquesa focus:border-turquesa transition-all duration-300 resize-none"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Permisos
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {permisosDisponibles.map((permiso) => (
                    <label
                      key={permiso}
                      className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        editingRoleData.permissions.includes(permiso)
                          ? 'border-turquesa bg-turquesa/10 text-turquesa'
                          : 'border-gray-600/50 hover:border-gray-500 text-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={editingRoleData.permissions.includes(permiso)}
                        onChange={() => handleEditPermisoChange(permiso)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                        editingRoleData.permissions.includes(permiso)
                          ? 'border-turquesa bg-turquesa'
                          : 'border-gray-500'
                      }`}>
                        {editingRoleData.permissions.includes(permiso) && (
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium capitalize">{permiso.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 py-3 px-4 bg-gray-600/20 text-gray-300 font-semibold rounded-xl hover:bg-gray-600/30 transition-all duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={editingRole}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-turquesa to-turquesa-dark text-white font-bold rounded-xl hover:from-turquesa-dark hover:to-turquesa transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                >
                  {editingRole ? (
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Actualizar Rol'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
