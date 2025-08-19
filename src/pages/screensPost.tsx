import React, { useState, useEffect } from 'react';
import '../Roles.css';
import { ScreenService } from '../services/screenService';
import { RoleService } from '../services/roleService';
import type { Role } from '../services/roleService';
import type { Screen } from '../services/screenService';

const Screens: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolNombre, setRolNombre] = useState('');
  const [appId, setAppId] = useState('');
  const [screenInput, setScreenInput] = useState('');
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRoles();
    loadScreens();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const rolesData = await RoleService.getAllRoles();
      setRoles(rolesData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cargar roles');
      console.error('Error loading roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadScreens = async () => {
    try {
      const screensData = await ScreenService.getAllScreens();
      setScreens(screensData);
    } catch (error) {
      console.error('Error loading screens:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      role_name: rolNombre,
      app_id: appId,
      screens: [screenInput], // solo un screen ingresado
    };

    try {
      const createdScreen = await ScreenService.createScreen(payload);
      console.log('Screens asignadas exitosamente:', createdScreen);
      alert('Screens asignadas correctamente');

      setRolNombre('');
      setAppId('');
      setScreenInput('');

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

  return (
    <div className="roles-container">
      <div className="roles-card">
        <h1 className="roles-title">Asignar Screens a Rol</h1>

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
            <label htmlFor="rolNombre" className="form-label">
              Nombre del Rol
            </label>
            <select
              id="rolNombre"
              value={rolNombre}
              onChange={(e) => setRolNombre(e.target.value)}
              className="form-input"
              required
            >
              <option value="" disabled>
                Seleccione un rol
              </option>
              {roles.map((rol) => (
                <option key={rol.id || rol.name} value={rol.name}>
                  {rol.name}
                </option>
              ))}
            </select>
          </div>

         

          <div className="form-group">
            <label htmlFor="screenInput" className="form-label">
              Ruta del Screen
            </label>
            <input
              id="screenInput"
              type="text"
              value={screenInput}
              onChange={(e) => setScreenInput(e.target.value)}
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
          
          {screens.length === 0 && !loading ? (
            <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
              No hay screens asignadas aún
            </p>
          ) : (
            <div className="screens-grid" style={{ 
              display: 'grid', 
              gap: '15px', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' 
            }}>
              {screens.map((screen) => (
                <div key={screen.id} className="screen-card" style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  backgroundColor: '#f9f9f9'
                }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Rol: {screen.role_name}</h3>
                  <p style={{ margin: '0 0 10px 0', color: '#666' }}>App ID: {screen.app_id}</p>
                  
                  <div className="screen-routes" style={{ marginBottom: '15px' }}>
                    <strong style={{ color: '#555' }}>Rutas:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                      {screen.screens.map((route, index) => (
                        <span key={index} style={{
                          backgroundColor: '#28a745',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>
                          {route}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Screens;
