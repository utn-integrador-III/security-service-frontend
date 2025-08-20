import React, { useState, useEffect } from 'react';
import { AppService } from '../services/appService';
import type { App } from '../services/appService';
import { AuthService } from '../services/authService';
import '../styles/Apps.css';

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

  // Cargar apps al montar el componente
  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🚀 Loading apps in Apps component...');
      console.log('🔍 Is authenticated:', AuthService.isAuthenticated());
      console.log('🔍 Token exists:', !!localStorage.getItem('auth_token'));
      
      const appsData = await AppService.getAdminApps();
      setApps(appsData);
      
      if (appsData.length === 0) {
        console.log('No apps found for this admin');
      } else {
        console.log(`Successfully loaded ${appsData.length} apps`);
      }
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

      console.log('🚀 Creating new app with data:', appData);
      const createdApp = await AppService.createApp(appData);
      console.log('✅ App created successfully:', createdApp);

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

  return (
    <div className="apps-container">
      <div className="apps-card">
        <div className="apps-header">
          <h1 className="apps-title">Mis Aplicaciones</h1>
          <button 
            onClick={openCreateModal}
            className="create-app-button"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Crear Nueva Aplicación
          </button>
        </div>

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
            Cargando aplicaciones...
          </div>
        )}

        {/* Lista de aplicaciones */}
        <div className="apps-list">
          {apps.length === 0 && !loading ? (
            <div className="empty-state">
              <div className="empty-state-title">No tienes aplicaciones creadas</div>
              <div className="empty-state-description">
                Aún no has registrado ninguna aplicación en el sistema.
              </div>
              <div className="empty-state-note">
                Haz clic en "Crear Nueva Aplicación" para comenzar.
              </div>
            </div>
          ) : (
            <div className="apps-grid">
              {apps.map((app) => (
                <div key={app._id} className="app-card">
                  <div className="app-header">
                    <h3 className="app-name">{app.name}</h3>
                    <span className={`status-badge ${app.status}`}>
                      {app.status === 'active' ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  
                  <div className="app-details">
                    <div className="app-info">
                      <label>URL de Redirección:</label>
                      <p className="app-redirect-url">{app.redirect_url}</p>
                    </div>
                    
                    {app.creation_date && (
                      <div className="app-info">
                        <label>Fecha de Creación:</label>
                        <p>{new Date(app.creation_date).toLocaleDateString('es-ES')}</p>
                      </div>
                    )}
                  </div>

                  <div className="app-actions">
                    <button className="action-button edit">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    
                    <button className="action-button view">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ver Detalles
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
        <div className="modal-overlay" onClick={closeCreateModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Crear Nueva Aplicación</h2>
              <button onClick={closeCreateModal} className="modal-close">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateApp} className="modal-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Nombre de la Aplicación
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={newAppData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Mi Aplicación"
                />
              </div>

              <div className="form-group">
                <label htmlFor="redirect_url" className="form-label">
                  URL de Redirección
                </label>
                <input
                  id="redirect_url"
                  name="redirect_url"
                  type="url"
                  required
                  value={newAppData.redirect_url}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://miapp.com/callback"
                />
              </div>

              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Estado
                </label>
                <select
                  id="status"
                  name="status"
                  value={newAppData.status}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="active">Activa</option>
                  <option value="inactive">Inactiva</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="modal-button secondary"
                  disabled={creatingApp}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creatingApp}
                  className="modal-button primary"
                >
                  {creatingApp ? (
                    <>
                      <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creando...
                    </>
                  ) : (
                    'Crear Aplicación'
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

export default Apps;
