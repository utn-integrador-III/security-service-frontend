import React, { useState } from 'react';
import '../Roles.css';

const Roles: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<string[]>([]);

  const permisosDisponibles = [
    'write',
    'read',
    'delete',
    'update',
    'LostOBJECTMNG',
    'issue_managment',
  ];

  const handleCheckboxChange = (permiso: string) => {
    setPermisosSeleccionados((prev) =>
      prev.includes(permiso)
        ? prev.filter((p) => p !== permiso)
        : [...prev, permiso]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevoRol = {
      name: nombre,
      description: descripcion,
      permissions: permisosSeleccionados,
    };

    try {
      const response = await fetch('https://api.ejemplo.com/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoRol),
      });

      if (!response.ok) {
        throw new Error('Error al crear el rol');
      }

      const data = await response.json();
      console.log('Rol creado exitosamente:', data);
      alert('Rol creado exitosamente');

      // limpia
      setNombre('');
      setDescripcion('');
      setPermisosSeleccionados([]);
    } catch (error) {
      console.error(error);
      alert('Error al crear el rol');
    }
  };

  return (
    <div className="roles-container">
      <div className="roles-card">
        <h1 className="roles-title">Gestión de Roles</h1>

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
      </div>
    </div>
  );
};

export default Roles;