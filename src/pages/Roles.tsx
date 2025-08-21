import React, { useState, useEffect } from 'react';
import '../Roles.css';
import { RoleService } from '../services/roleService';
import { AppService } from '../services/appService';
import type { Role } from '../services/roleService';
import type { App } from '../services/appService';
import { AuthService } from '../services/authService';

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

  const loadApps = async () => {
    try {
      const appsData = await AppService.getAdminApps();
      setApps(appsData);
      console.log('Apps cargadas para roles:', appsData);
    } catch (error) {
      console.error('Error loading apps:', error);
      setError('Error al cargar las aplicaciones');
    }
  };

  const loadRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🚀 Loading admin-specific roles...');
      const rolesData = await RoleService.getAdminRoles();
      setRoles(rolesData);
      
      // If no roles are returned and we're authenticated, it might be a backend issue
      if (rolesData.length === 0) {
        console.log('No roles returned for this admin - this might indicate:');
        console.log('1. No roles have been created by this admin yet');
        console.log('2. The admin does not have permission to view roles');
        console.log('3. There might be a backend issue');
        console.log('The endpoint /rol is working correctly (status 200)');
      } else {
        console.log(`Successfully loaded ${rolesData.length} roles for this admin`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar roles';
      setError(errorMessage);
      console.error('Error loading roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (permiso: string) => {
    setPermisosSeleccionados((prev) =>
      prev.includes(permiso)
        ? prev.filter((p) => p !== permiso)
        : [...prev, permiso]
    );
  };

  const handleEditCheckboxChange = (permiso: string) => {
    setEditingRoleData((prev) => ({
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

    console.log('📋 DATOS DEL ROL DESDE EL FORMULARIO:');
    console.log('  - Nombre:', nombre);
    console.log('  - Descripción:', descripcion);
    console.log('  🎯 App ID seleccionado:', appId);
    console.log('  - Tipo de appId:', typeof appId);
    console.log('  - AppId es string vacío?', appId === '');
    console.log('  - AppId es null?', appId === null);
    console.log('  - AppId es undefined?', appId === undefined);
    console.log('  - Permisos:', permisosSeleccionados);
    console.log('  - Payload completo:', nuevoRol);
    
    // Verificar qué app corresponde al appId seleccionado
    const selectedApp = apps.find(app => app._id === appId);
    console.log('🔍 APP SELECCIONADA EN EL COMBOBOX:');
    console.log('  - App encontrada:', selectedApp);
    console.log('  - Nombre de la app:', selectedApp?.name);
    console.log('  - ID de la app:', selectedApp?._id);
    
    // Verificar todas las apps disponibles
    console.log('📋 TODAS LAS APPS DISPONIBLES:');
    apps.forEach((app, index) => {
      console.log(`  ${index + 1}. ${app.name} (ID: ${app._id})`);
    });
    
    // Verificar si el appId seleccionado está en la lista
    const appExists = apps.some(app => app._id === appId);
    console.log('🔍 ¿El appId seleccionado existe en la lista?', appExists);

    try {
             // Información de diagnóstico antes de crear el rol
       console.log('=== DIAGNÓSTICO COMPLETO ANTES DE CREAR ROL ===');
       console.log('Datos del rol a crear:', nuevoRol);
       
       const token = localStorage.getItem('token');
       if (token) {
         try {
           const payload = JSON.parse(atob(token.split('.')[1]));
           console.log('🔍 PAYLOAD COMPLETO DEL TOKEN:', payload);
           console.log('Admin ID del token:', payload.admin_id || payload.user_id);
           console.log('App ID del token:', payload.app_id || payload.app_client_id);
           console.log('Email del admin:', payload.email);
           
           // Buscar todos los campos relacionados con la app
           console.log('🔍 TODOS LOS CAMPOS DE APP EN EL TOKEN:');
           Object.keys(payload).forEach(key => {
             if (key.toLowerCase().includes('app')) {
               console.log(`  ${key}:`, payload[key]);
             }
           });
         } catch (error) {
           console.error('Error decodificando token:', error);
         }
       }
       console.log('=== FIN DIAGNÓSTICO ===');

      const createdRole = await RoleService.createRole(nuevoRol);
      console.log('Rol creado exitosamente:', createdRole);
      
      // Mostrar mensaje de éxito temporal
      const successMessage = `Rol "${nombre}" creado exitosamente`;
      setSuccess(successMessage);
      setTimeout(() => setSuccess(null), 3000);

      // Limpiar formulario
      setNombre('');
      setDescripcion('');
      setAppId('');
      setPermisosSeleccionados([]);

      // Actualizar el estado local directamente
      setRoles(prevRoles => [...prevRoles, createdRole]);
      console.log('Estado local actualizado con el nuevo rol');
      
      // También recargar desde el backend para asegurar sincronización
      setTimeout(() => {
        loadRoles();
      }, 1000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear el rol';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Funciones para editar rol
  const openEditModal = (role: Role) => {
    setEditingRoleData({
      _id: role._id || '',
      name: role.name,
      description: role.description,
      permissions: role.permissions || []
    });
    setShowEditModal(true);
    setError(null);
    setSuccess(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingRoleData({ _id: '', name: '', description: '', permissions: [] });
    setError(null);
  };

  const handleEditRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditingRole(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedRole = await RoleService.updateRole(editingRoleData._id, {
        name: editingRoleData.name,
        description: editingRoleData.description,
        permissions: editingRoleData.permissions
      });

      // Cerrar modal y limpiar formulario
      setShowEditModal(false);
      setEditingRoleData({ _id: '', name: '', description: '', permissions: [] });
      setSuccess('¡Rol actualizado exitosamente!');

      // Recargar la lista de roles
      await loadRoles();
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el rol';
      setError(errorMessage);
      
      // Limpiar mensaje de error después de 5 segundos
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setEditingRole(false);
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingRoleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteRole = async (roleId: string, roleName: string) => {

    // Verificar autenticación antes de intentar eliminar
    if (!AuthService.isAuthenticated()) {
      console.error('Usuario no autenticado al intentar eliminar rol');
      setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
      // Redirigir al login después de mostrar el error
      setTimeout(() => {
        window.location.href = '/admin-signin';
      }, 3000);
      return;
    }

    setDeletingRoleId(roleId);
    setError(null);
    try {
      await RoleService.deleteRole(roleId, roleName);
      console.log('Rol eliminado exitosamente');
      
      // Actualizar la lista local sin recargar desde el servidor
      setRoles(prevRoles => prevRoles.filter(role => role._id !== roleId));
      
      // Mostrar mensaje de éxito temporal
      setError(null);
      const successMessage = `Rol "${roleName}" eliminado exitosamente`;
      setSuccess(successMessage);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el rol';
      setError(errorMessage);
      
      // Si es un error de autenticación, redirigir al login después de mostrar el error
      if (errorMessage.includes('autenticado') || errorMessage.includes('sesión')) {
        setTimeout(() => {
          window.location.href = '/admin-signin';
        }, 3000);
      }
    } finally {
      setDeletingRoleId(null);
    }
  };

  return (
    <div className="roles-container">
      <div className="roles-card">
        <h1 className="roles-title">Gestión de Roles</h1>

        {/* Mostrar errores */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Mostrar mensajes de éxito */}
        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {/* Indicador de carga */}
        {loading && (
          <div className="loading-message">
            Cargando...
          </div>
        )}

        <form onSubmit={handleSubmit} className="roles-form">
          <div className="form-group">
            <label htmlFor="txtnombre" className="form-label">
              Nombre
            </label>
            <input
              id="txtnombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="form-input"
              placeholder="Ingrese el nombre del rol"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="txtdescripcion" className="form-label">
              Descripción
            </label>
            <input
              id="txtdescripcion"
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="form-input"
              placeholder="Ingrese la descripción del rol"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="appId" className="form-label">
              Aplicación
            </label>
            <select
              id="appId"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              className="form-input"
              required
            >
              <option value="">Seleccione una aplicación</option>
              {apps.map((app) => (
                <option key={app._id} value={app._id}>
                  {app.name}
                </option>
              ))}
            </select>
            {apps.length === 0 && (
              <p style={{ 
                fontSize: '12px', 
                color: '#666', 
                marginTop: '5px',
                fontStyle: 'italic'
              }}>
                No hay aplicaciones disponibles. Crea una aplicación primero.
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Permisos</label>
            <div className="permissions-grid">
              {permisosDisponibles.map((permiso) => (
                <label key={permiso} className="permission-item">
                  <input
                    type="checkbox"
                    value={permiso}
                    checked={permisosSeleccionados.includes(permiso)}
                    onChange={() => handleCheckboxChange(permiso)}
                    className="permission-checkbox"
                  />
                  <span className="permission-label">{permiso}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            <span>Crear Rol</span>
            <svg
              className="button-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </form>

        {/* Lista de roles existentes */}
        <div className="roles-list">
          <h2 className="roles-list-title">Mis Roles Creados</h2>
          

          
          {roles.length === 0 && !loading ? (
            <div className="empty-state">
              <div className="empty-state-title">No hay roles creados</div>
              <div className="empty-state-description">
                Aún no has creado roles en el sistema.
              </div>
              <div className="empty-state-note">
                Puedes crear tu primer rol usando el formulario de arriba.
              </div>
            </div>
          ) : (
            <div className="roles-grid">
              {roles.map((role) => (
                <div key={role._id} className="role-card">
                  <h3 className="role-name">{role.name}</h3>
                  <p className="role-description">{role.description}</p>
                  <p className="role-app" style={{ 
                    fontSize: '0.875rem', 
                    color: '#666', 
                    marginBottom: '10px',
                    fontStyle: 'italic'
                  }}>
                    Aplicación: {apps.find(app => app._id === role.app_id)?.name || role.app_id}
                  </p>
                  
                  <div className="role-permissions">
                    <div className="role-permissions-title">Permisos:</div>
                    <div className="role-permissions-grid">
                      {role.permissions && role.permissions.map((permission) => (
                        <span key={permission} className="permission-badge">
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="role-actions">
                    {/* Solo mostrar botón Editar si el rol pertenece al admin actual */}
                    {(() => {
                      const token = localStorage.getItem('auth_token');
                      if (token) {
                        try {
                          const payload = JSON.parse(atob(token.split('.')[1]));
                          const currentAdminId = payload.admin_id || payload.user_id || payload.sub || payload.id;
                          return role.admin_id === currentAdminId || role.created_by === currentAdminId;
                        } catch (error) {
                          return false;
                        }
                      }
                      return false;
                    })() ? (
                      <button
                        onClick={() => openEditModal(role)}
                        className="edit-button"
                        disabled={loading}
                      >
                        <svg
                          className="edit-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        <span>Editar</span>
                      </button>
                    ) : (
                      <div style={{ 
                        padding: '8px 12px', 
                        backgroundColor: '#6b7280', 
                        color: 'white', 
                        borderRadius: '4px',
                        fontSize: '12px',
                        opacity: 0.7
                      }}>
                        No editable
                      </div>
                    )}

                    <button
                      onClick={() => role._id && handleDeleteRole(role._id, role.name)}
                      className="delete-button"
                      disabled={loading || deletingRoleId === role._id}
                    >
                      <svg
                        className="delete-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span>
                        {deletingRoleId === role._id ? 'Eliminando...' : 'Eliminar Rol'}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal para editar rol */}
      {showEditModal && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Editar Rol</h2>
              <button onClick={closeEditModal} className="modal-close">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditRole} className="modal-form">
              <div className="form-group">
                <label htmlFor="edit-name" className="form-label">
                  Nombre del Rol
                </label>
                <input
                  id="edit-name"
                  name="name"
                  type="text"
                  required
                  value={editingRoleData.name}
                  onChange={handleEditInputChange}
                  className="form-input"
                  placeholder="Nombre del rol"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-description" className="form-label">
                  Descripción
                </label>
                <input
                  id="edit-description"
                  name="description"
                  type="text"
                  required
                  value={editingRoleData.description}
                  onChange={handleEditInputChange}
                  className="form-input"
                  placeholder="Descripción del rol"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Permisos</label>
                <div className="permissions-grid">
                  {permisosDisponibles.map((permiso) => (
                    <label key={permiso} className="permission-item">
                      <input
                        type="checkbox"
                        value={permiso}
                        checked={editingRoleData.permissions.includes(permiso)}
                        onChange={() => handleEditCheckboxChange(permiso)}
                        className="permission-checkbox"
                      />
                      <span className="permission-label">{permiso}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="modal-button secondary"
                  disabled={editingRole}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="modal-button primary"
                  disabled={editingRole}
                >
                  {editingRole ? (
                    <>
                      <svg className="animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Actualizando...
                    </>
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