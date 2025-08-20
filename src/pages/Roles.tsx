import React, { useState, useEffect } from 'react';
import '../Roles.css';
import { RoleService } from '../services/roleService';
import type { Role } from '../services/roleService';
import { AuthService } from '../services/authService';

const Roles: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<string[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);

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
      
      // If no roles are returned and we're authenticated, it might be a backend issue
      if (rolesData.length === 0) {
        console.log('No roles returned - this might indicate:');
        console.log('1. No roles have been created yet');
        console.log('2. The user does not have permission to view roles');
        console.log('3. There might be a backend issue');
        console.log('The endpoint /rol is working correctly (status 200)');
      } else {
        console.log(`Successfully loaded ${rolesData.length} roles`);
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
    if (!confirm('¿Estás seguro de que quieres eliminar este rol? Esta acción no se puede deshacer.')) {
      return;
    }

    // Verificar autenticación antes de intentar eliminar
    if (!AuthService.isAuthenticated()) {
      console.error('Usuario no autenticado al intentar eliminar rol');
      alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
      // Redirigir al login
      window.location.href = '/admin-signin';
      return;
    }

    // Información de diagnóstico
    console.log('=== DIAGNÓSTICO ANTES DE ELIMINAR ===');
    console.log('Usuario autenticado:', AuthService.isAuthenticated());
    console.log('Tipo de usuario:', AuthService.getUserType());
    console.log('Headers de autenticación:', AuthService.getAuthHeaders());
    console.log('ID del rol a eliminar:', roleId);
    console.log('=== FIN DIAGNÓSTICO ===');

    setDeletingRoleId(roleId);
    setError(null);
    try {
      await RoleService.deleteRole(roleId);
      console.log('Rol eliminado exitosamente');
      
      // Actualizar la lista local sin recargar desde el servidor
      setRoles(prevRoles => prevRoles.filter(role => role._id !== roleId));
      
      // Mostrar mensaje de éxito
      alert('Rol eliminado exitosamente');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el rol';
      setError(errorMessage);
      
      // Si es un error de autenticación, redirigir al login
      if (errorMessage.includes('autenticado') || errorMessage.includes('sesión')) {
        alert(errorMessage);
        window.location.href = '/admin-signin';
        return;
      }
      
      alert(errorMessage);
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
          <h2 className="roles-list-title">Roles Existentes</h2>
          
          {roles.length === 0 && !loading ? (
            <div className="empty-state">
              <div className="empty-state-title">No hay roles creados</div>
              <div className="empty-state-description">
                Aún no se han creado roles en el sistema.
              </div>
              <div className="empty-state-note">
                Puedes crear el primer rol usando el formulario de arriba.
              </div>
            </div>
          ) : (
            <div className="roles-grid">
              {roles.map((role) => (
                <div key={role._id} className="role-card">
                  <h3 className="role-name">{role.name}</h3>
                  <p className="role-description">{role.description}</p>
                  
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

                  <button
                    onClick={() => role._id && handleDeleteRole(role._id)}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Roles;