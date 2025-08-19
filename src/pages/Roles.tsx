import React, { useState, useEffect } from 'react';
import '../Roles.css';
import { RoleService } from '../services/roleService';
import type { Role } from '../services/roleService';

const Roles: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<string[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const permisosDisponibles = [
    'write',
    'read',
    'delete',
    'update',
    'LostOBJECTMNG',
    'issue_managment',
  ];

  // Cargar roles al montar el componente
  useEffect(() => {
    loadRoles();
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

  const handleCheckboxChange = (permiso: string) => {
    setPermisosSeleccionados((prev) =>
      prev.includes(permiso)
        ? prev.filter((p) => p !== permiso)
        : [...prev, permiso]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const nuevoRol = {
      name: nombre,
      description: descripcion,
      permissions: permisosSeleccionados,
    };

    try {
      const createdRole = await RoleService.createRole(nuevoRol);
      console.log('Rol creado exitosamente:', createdRole);
      alert('Rol creado exitosamente');

      // Limpiar formulario
      setNombre('');
      setDescripcion('');
      setPermisosSeleccionados([]);

      // Recargar la lista de roles
      await loadRoles();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear el rol';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este rol?')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await RoleService.deleteRole(roleId);
      alert('Rol eliminado exitosamente');
      await loadRoles();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el rol';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="roles-container">
      <div className="roles-card">
        <h1 className="roles-title">Gestión de Roles</h1>

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

          <button type="submit" className="submit-button">
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
        <div className="roles-list" style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Roles Existentes</h2>
          
          {roles.length === 0 && !loading ? (
            <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
              No hay roles creados aún
            </p>
          ) : (
            <div className="roles-grid" style={{ 
              display: 'grid', 
              gap: '15px', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' 
            }}>
              {roles.map((role) => (
                                 <div key={role._id} className="role-card" style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  backgroundColor: '#f9f9f9'
                }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{role.name}</h3>
                  <p style={{ margin: '0 0 10px 0', color: '#666' }}>{role.description}</p>
                  
                  <div className="role-permissions" style={{ marginBottom: '15px' }}>
                    <strong style={{ color: '#555' }}>Permisos:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                      {role.permissions.map((permission) => (
                        <span key={permission} style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>

                                     <button
                     onClick={() => role._id && handleDeleteRole(role._id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                    disabled={loading}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Roles;