import React, { useState, useEffect } from 'react';
import '../Roles.css';
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
  const [editingScreenData, setEditingScreenData] = useState<{ id: string; screen_path: string }>({ id: '', screen_path: '' });
  const [editingScreen, setEditingScreen] = useState(false);
  const [deletingScreen, setDeletingScreen] = useState(false);
  const [selectedScreenToEdit, setSelectedScreenToEdit] = useState<string>('');
  const [selectedScreenToDelete, setSelectedScreenToDelete] = useState<string>('');
  const [newScreenPath, setNewScreenPath] = useState<string>('');

  useEffect(() => {
    loadRoles();
    loadApps();
    loadScreens();
  }, []);

  // Efecto para seleccionar automáticamente el primer rol cuando se cargan los roles y hay screens
  useEffect(() => {
    if (roles.length > 0 && screens.length > 0 && !roleId) {
      const firstRole = roles[0];
      setRoleId(firstRole._id || '');
      loadAppForRole(firstRole._id || '');
      console.log('🔧 Rol seleccionado automáticamente desde useEffect:', firstRole.name);
    }
  }, [roles, screens, roleId]);

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

  const loadScreens = async () => {
    setLoadingScreens(true);
    try {
      console.log('🔄 Iniciando carga de screens...');
      const screensData = await ScreenService.getAllScreens();
      console.log('📋 Screens cargadas en el componente:', screensData);
      console.log('📋 Estructura de la primera screen:', screensData[0]);
      console.log('📋 Tipo de screens:', typeof screensData);
      console.log('📋 Es array:', Array.isArray(screensData));
      setScreens(screensData);
      
      if (screensData.length === 0) {
        console.log('ℹ️ No hay screens asignadas aún');
      } else {
        console.log(`✅ ${screensData.length} screens cargadas exitosamente`);
        
        // Si hay screens pero no hay rol seleccionado, seleccionar el primer rol disponible
        if (!roleId && roles.length > 0) {
          const firstRole = roles[0];
          setRoleId(firstRole._id || '');
          loadAppForRole(firstRole._id || '');
          console.log('🔧 Rol seleccionado automáticamente:', firstRole.name);
        }
      }
    } catch (error) {
      console.error('❌ Error loading screens:', error);
      setScreens([]); // Asegurar que el estado esté limpio
    } finally {
      setLoadingScreens(false);
    }
  };

  // Función para cargar automáticamente la app del rol seleccionado
  const loadAppForRole = (selectedRoleId: string) => {
    if (!selectedRoleId) {
      setAppId('');
      return;
    }

    const selectedRole = roles.find(role => role._id === selectedRoleId);
    if (!selectedRole) {
      setAppId('');
      return;
    }

    // Automáticamente asignar la app del rol
    setAppId(selectedRole.app_id || '');
    
    console.log('🔍 Cargando app automáticamente para el rol:', selectedRole.name);
    console.log('  - Rol app_id:', selectedRole.app_id);
    console.log('  - App asignada automáticamente:', selectedRole.app_id);
    
    // Mostrar información de la app asignada
    const assignedApp = apps.find(app => app._id === selectedRole.app_id);
    if (assignedApp) {
      console.log('  - Nombre de la app:', assignedApp.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validaciones
    if (!roleId) {
      setError('Por favor selecciona un rol');
      setLoading(false);
      return;
    }

    if (!appId) {
      setError('Por favor selecciona una aplicación');
      setLoading(false);
      return;
    }

    // Validación adicional: verificar que la app pertenece al rol
    const selectedRole = roles.find(role => role._id === roleId);
    if (selectedRole && selectedRole.app_id !== appId) {
      setError('La aplicación seleccionada no pertenece al rol seleccionado');
      setLoading(false);
      return;
    }

    if (!screenPath.trim()) {
      setError('Por favor ingresa la ruta del screen');
      setLoading(false);
      return;
    }

    const payload = {
      role_id: roleId,
      app_id: appId,
      screen_path: screenPath,
    };

    console.log('📋 Payload que se va a enviar:');
    console.log('  - role_id:', roleId, '(debe ser un ObjectId)');
    console.log('  - app_id:', appId, '(debe ser un ObjectId)');
    console.log('  - screen_path:', screenPath);
    console.log('  - Rol seleccionado:', selectedRole?.name);
    console.log('  - App seleccionada:', apps.find(app => app._id === appId)?.name);
    console.log('  - ¿App pertenece al rol?', selectedRole?.app_id === appId);

    try {
      const createdScreen = await ScreenService.createScreen(payload);
      console.log('Screens asignadas exitosamente:', createdScreen);
      
      // Mostrar mensaje de éxito
      setError(null); // Limpiar errores previos
      const selectedRole = roles.find(role => role._id === roleId);
      const selectedApp = apps.find(app => app._id === appId);
      
      setSuccess(`✅ Screen "${screenPath}" asignado exitosamente al rol "${selectedRole?.name}" en la aplicación "${selectedApp?.name}"`);

      setRoleId('');
      setAppId('');
      setScreenPath('');

      // Limpiar mensaje de éxito después de 5 segundos
      setTimeout(() => setSuccess(null), 5000);

      // Recargar la lista de screens
      await loadScreens();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al asignar screens';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Funciones para editar screen
  const openEditModal = (screen: string, index: number) => {
    setSelectedScreenToEdit('');
    setNewScreenPath('');
    setShowEditModal(true);
    setError(null);
    setSuccess(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingScreenData({ id: '', screen_path: '' });
    setSelectedScreenToEdit('');
    setNewScreenPath('');
    setError(null);
  };

  const openDeleteModal = () => {
    setSelectedScreenToDelete('');
    setShowDeleteModal(true);
    setError(null);
    setSuccess(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedScreenToDelete('');
    setError(null);
  };

  const handleDeleteScreenFromModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScreenToDelete) {
      setError('Por favor selecciona una screen para eliminar');
      return;
    }

    // Verificar si tenemos un rol seleccionado
    if (!roleId) {
      setError('Por favor selecciona un rol antes de eliminar screens');
      return;
    }

    // Obtener la aplicación del rol si no está disponible
    let currentAppId = appId;
    if (!currentAppId) {
      const selectedRole = roles.find(role => role._id === roleId);
      if (selectedRole && selectedRole.app_id) {
        currentAppId = selectedRole.app_id;
        console.log('🔧 AppId obtenido del rol para eliminar:', currentAppId);
      } else {
        setError('No se pudo obtener la aplicación. Por favor selecciona un rol válido.');
        return;
      }
    }

    setDeletingScreen(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('🗑️ Iniciando eliminación de screen...');
      console.log('🔍 Estado actual:', { roleId, currentAppId, selectedScreenToDelete });
      // Convertir las screens actuales a strings para enviar al backend
      const currentScreens = screens.map(screen => typeof screen === 'string' ? screen : screen.screen_path);
      
      console.log('📋 Datos para eliminar:', {
        selectedScreenToDelete,
        roleId,
        currentAppId,
        currentScreens
      });

      // Llamar al backend para eliminar la screen
      const { ScreenService } = await import('../services/screenService');
      await ScreenService.deleteScreenByPath(selectedScreenToDelete, roleId, currentAppId, currentScreens);

      // Actualizar el estado local
      setScreens(prevScreens => 
        prevScreens.filter(screen => {
          const screenPath = typeof screen === 'string' ? screen : screen.screen_path;
          return screenPath !== selectedScreenToDelete;
        })
      );

      setShowDeleteModal(false);
      setSelectedScreenToDelete('');
      setSuccess(`¡Screen "${selectedScreenToDelete}" eliminada exitosamente!`);

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('❌ Error en handleDeleteScreenFromModal:', error);
      
      // Verificar si es un error de autenticación
      if (error instanceof Error && error.message.includes('401')) {
        setError('🔐 Tu sesión ha expirado. Serás redirigido al login.');
        // Redirigir al login después de un breve delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
        return;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar la screen';
      setError(errorMessage);
      
      // Limpiar mensaje de error después de 5 segundos
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setDeletingScreen(false);
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingScreenData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditScreen = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditingScreen(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('🔧 Iniciando actualización de screen...');
      console.log('🔍 Estado actual:', { roleId, appId, selectedScreenToEdit, newScreenPath });
      
      if (!selectedScreenToEdit || !newScreenPath.trim()) {
        throw new Error('Por favor selecciona una screen y ingresa la nueva ruta');
      }

      // Verificar si tenemos un rol seleccionado
      if (!roleId) {
        throw new Error('Por favor selecciona un rol antes de editar screens');
      }

      // Obtener la aplicación del rol si no está disponible
      let currentAppId = appId;
      if (!currentAppId) {
        const selectedRole = roles.find(role => role._id === roleId);
        if (selectedRole && selectedRole.app_id) {
          currentAppId = selectedRole.app_id;
          console.log('🔧 AppId obtenido del rol:', currentAppId);
        } else {
          throw new Error('No se pudo obtener la aplicación. Por favor selecciona un rol válido.');
        }
      }

      // Convertir las screens actuales a strings para enviar al backend
      const currentScreens = screens.map(screen => typeof screen === 'string' ? screen : screen.screen_path);
      
      console.log('📋 Datos para actualizar:', {
        selectedScreenToEdit,
        newScreenPath,
        roleId,
        currentAppId,
        currentScreens
      });

      // Llamar al backend para actualizar la screen
      const { ScreenService } = await import('../services/screenService');
      await ScreenService.updateScreenByPath(selectedScreenToEdit, newScreenPath, roleId, currentAppId, currentScreens);

      // Actualizar la screen seleccionada en el estado local
      setScreens(prevScreens => 
        prevScreens.map(screen => {
          const screenPath = typeof screen === 'string' ? screen : screen.screen_path;
          return screenPath === selectedScreenToEdit ? newScreenPath : screen;
        })
      );

      setShowEditModal(false);
      setEditingScreenData({ id: '', screen_path: '' });
      setSelectedScreenToEdit('');
      setNewScreenPath('');
      setSuccess('¡Screen actualizada exitosamente!');

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('❌ Error en handleEditScreen:', error);
      
      // Verificar si es un error de autenticación
      if (error instanceof Error && error.message.includes('401')) {
        setError('🔐 Tu sesión ha expirado. Serás redirigido al login.');
        // Redirigir al login después de un breve delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
        return;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar la screen';
      setError(errorMessage);
      
      // Limpiar mensaje de error después de 5 segundos
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setEditingScreen(false);
    }
  };

  const handleDeleteScreen = async (screenPath: string) => {
    // Verificar si tenemos un rol seleccionado
    if (!roleId) {
      setError('Por favor selecciona un rol antes de eliminar screens');
      return;
    }

    // Obtener la aplicación del rol si no está disponible
    let currentAppId = appId;
    if (!currentAppId) {
      const selectedRole = roles.find(role => role._id === roleId);
      if (selectedRole && selectedRole.app_id) {
        currentAppId = selectedRole.app_id;
        console.log('🔧 AppId obtenido del rol para eliminación directa:', currentAppId);
      } else {
        setError('No se pudo obtener la aplicación. Por favor selecciona un rol válido.');
        return;
      }
    }

    setDeletingScreen(true);
    setError(null);
    try {
      console.log('🗑️ Iniciando eliminación directa de screen...');
      console.log('🔍 Estado actual:', { roleId, currentAppId, screenPath });
      // Convertir las screens actuales a strings para enviar al backend
      const currentScreens = screens.map(screen => typeof screen === 'string' ? screen : screen.screen_path);
      
      console.log('📋 Datos para eliminar:', {
        screenPath,
        roleId,
        currentAppId,
        currentScreens
      });

      // Llamar al backend para eliminar la screen
      const { ScreenService } = await import('../services/screenService');
      await ScreenService.deleteScreenByPath(screenPath, roleId, currentAppId, currentScreens);

      // Actualizar el estado local
      setScreens(prevScreens => prevScreens.filter(screen => {
        const currentScreenPath = typeof screen === 'string' ? screen : screen.screen_path;
        return currentScreenPath !== screenPath;
      }));
      setSuccess(`Screen "${screenPath}" eliminada exitosamente`);
      
      // Limpiar mensaje de error después de 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('❌ Error en handleDeleteScreen:', error);
      
      // Verificar si es un error de autenticación
      if (error instanceof Error && error.message.includes('401')) {
        setError('🔐 Tu sesión ha expirado. Serás redirigido al login.');
        // Redirigir al login después de un breve delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
        return;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar la screen';
      setError(errorMessage);
      
      // Limpiar mensaje de error después de 5 segundos
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setDeletingScreen(false);
    }
  };

  // Debug: Log del estado para verificar por qué los botones están deshabilitados
  console.log('🔍 Estado completo:', { 
    roleId, 
    appId, 
    loading, 
    screensLength: screens.length,
    rolesLength: roles.length,
    appsLength: apps.length
  });

  return (
    <div className="roles-container">
      <div className="roles-card">
        <h1 className="roles-title">Asignar Screens a Mis Roles</h1>

        {/* Mostrar errores */}
        {error && (
          <div className="error-message" style={{ 
            backgroundColor: '#fee', 
            color: '#c33', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px' 
          }}>
            {error}
          </div>
        )}

        {/* Mostrar mensajes de éxito */}
        {success && (
          <div className="success-message" style={{ 
            backgroundColor: '#d4edda', 
            color: '#155724', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px',
            border: '1px solid #c3e6cb'
          }}>
            {success}
          </div>
        )}

        {/* Indicador de carga */}
        {loading && (
          <div className="loading-message" style={{ 
            textAlign: 'center', 
            padding: '20px', 
            color: '#666' 
          }}>
            Cargando...
          </div>
        )}

        <form onSubmit={handleSubmit} className="roles-form">
          <div className="form-group">
            <label htmlFor="roleId" className="form-label">
              Mis Roles
            </label>
            <select
              id="roleId"
              value={roleId}
              onChange={(e) => {
                const selectedRoleId = e.target.value;
                setRoleId(selectedRoleId);
                loadAppForRole(selectedRoleId);
              }}
              className="form-input"
              required
            >
              <option value="" disabled>
                Selecciona uno de tus roles
              </option>
              {roles.map((rol) => (
                <option key={rol._id || rol.name} value={rol._id}>
                  {rol.name}
                </option>
              ))}
            </select>
            {roles.length === 0 && !loading && (
              <p style={{ 
                fontSize: '14px', 
                color: '#666', 
                marginTop: '5px',
                fontStyle: 'italic'
              }}>
                No tienes roles creados. Crea roles primero en la sección "Roles".
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="appId" className="form-label">
              Aplicación
            </label>
            <input
              id="appId"
              type="text"
              value={roleId ? (apps.find(app => app._id === appId)?.name || 'Cargando...') : ''}
              className="form-input"
              readOnly
              style={{ 
                backgroundColor: '#f8f9fa', 
                cursor: 'not-allowed',
                color: roleId ? '#495057' : '#6c757d'
              }}
              placeholder={roleId ? 'Selecciona un rol primero' : 'Selecciona un rol primero'}
            />

          </div>

          <div className="form-group">
            <label htmlFor="screenPath" className="form-label">
              Ruta del Screen
            </label>
            <input
              id="screenPath"
              type="text"
              value={screenPath}
              onChange={(e) => setScreenPath(e.target.value)}
              className="form-input"
              placeholder="Ingrese la ruta del screen (ej: /productos)"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            <span>Asignar Screen</span>
            <svg
              className="button-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </form>

        {/* Lista de screens asignadas */}
        <div className="screens-list" style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Screens Asignadas</h2>
          
          {loadingScreens ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <div style={{ marginBottom: '10px' }}>🔄</div>
              Cargando screens asignadas...
            </div>
          ) : screens.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
              No hay screens asignadas aún
            </p>
          ) : (
            <div className="roles-grid">
              <div className="role-card">
                <h3 className="role-name">
                  {roleId ? roles.find(role => role._id === roleId)?.name : (roles.length > 0 ? roles[0].name : 'N/A')}
                </h3>
                <p className="role-description">
                  Aplicación: {appId ? apps.find(app => app._id === appId)?.name : (apps.length > 0 ? apps[0].name : 'N/A')}
                </p>
                
                <div className="role-permissions">
                  <div className="role-permissions-title">Screens asignadas:</div>
                  <div className="role-permissions-grid">
                    {screens.map((screen, index) => {
                      const screenPath = typeof screen === 'string' ? screen : screen.screen_path;
                      return (
                        <span key={`screen-${index}`} className="permission-badge">
                          {screenPath}
                        </span>
                      );
                    })}
                  </div>
                </div>

                

                <div className="role-actions">
                  <button
                    onClick={() => openEditModal('', 0)}
                    className="edit-button"
                    disabled={loading || screens.length === 0}
                    title={screens.length === 0 ? 'No hay screens para editar' : 'Editar screens'}
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
                    <span>Editar Screens</span>
                  </button>

                  <button
                    onClick={openDeleteModal}
                    className="delete-button"
                    disabled={loading || deletingScreen || screens.length === 0}
                    title={screens.length === 0 ? 'No hay screens para eliminar' : 'Eliminar screen'}
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
                      {deletingScreen ? 'Eliminando...' : 'Eliminar Screen'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para editar screen */}
      {showEditModal && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Editar Screen</h2>
              <button onClick={closeEditModal} className="modal-close">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditScreen} className="modal-form">
              <div className="form-group">
                <label htmlFor="select-screen" className="form-label">
                  Seleccionar Screen a Editar
                </label>
                <select
                  id="select-screen"
                  value={selectedScreenToEdit}
                  onChange={(e) => setSelectedScreenToEdit(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">Selecciona una screen</option>
                  {screens.map((screen, index) => {
                    const screenPath = typeof screen === 'string' ? screen : screen.screen_path;
                    return (
                      <option key={`screen-option-${index}`} value={screenPath}>
                        {screenPath}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="new-screen-path" className="form-label">
                  Nueva Ruta del Screen
                </label>
                <input
                  id="new-screen-path"
                  type="text"
                  value={newScreenPath}
                  onChange={(e) => setNewScreenPath(e.target.value)}
                  className="form-input"
                  placeholder="Ingrese la nueva ruta del screen"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeEditModal} className="cancel-button">
                  Cancelar
                </button>
                <button type="submit" className="submit-button" disabled={editingScreen}>
                  {editingScreen ? 'Actualizando...' : 'Actualizar Screen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para eliminar screen */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Eliminar Screen</h2>
              <button onClick={closeDeleteModal} className="modal-close">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleDeleteScreenFromModal} className="modal-form">
              <div className="form-group">
                <label htmlFor="select-screen-delete" className="form-label">
                  Seleccionar Screen a Eliminar
                </label>
                <select
                  id="select-screen-delete"
                  value={selectedScreenToDelete}
                  onChange={(e) => setSelectedScreenToDelete(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">Selecciona una screen</option>
                  {screens.map((screen, index) => {
                    const screenPath = typeof screen === 'string' ? screen : screen.screen_path;
                    return (
                      <option key={`screen-delete-option-${index}`} value={screenPath}>
                        {screenPath}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeDeleteModal} className="cancel-button">
                  Cancelar
                </button>
                <button type="submit" className="delete-button" disabled={deletingScreen}>
                  {deletingScreen ? 'Eliminando...' : 'Eliminar Screen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Screens;
