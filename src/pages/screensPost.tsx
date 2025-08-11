import React, { useState, useEffect } from 'react';
import '../Roles.css';

const Screens: React.FC = () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [rolNombre, setRolNombre] = useState('');
  const [appId, setAppId] = useState('');
  const [screenInput, setScreenInput] = useState('');

  useEffect(() => {
    // Simulación de llamada a API para obtener roles
    // Reemplaza esta llamada con la real
    async function fetchRoles() {
      try {
        const response = await fetch('https://api.ejemplo.com/roles'); // Cambia la URL
        if (!response.ok) throw new Error('Error al cargar roles');
        const data = await response.json();
        // Asumimos que data es un array de roles con propiedad 'name'
        setRoles(data.map((rol: any) => rol.name));
      } catch (error) {
        console.error(error);
        alert('Error cargando roles');
      }
    }

    fetchRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      role_name: rolNombre,
      app_id: appId,
      screens: [screenInput], // solo un screen ingresado
    };

    try {
      const response = await fetch('https://api.ejemplo.com/screens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Error al asignar screens');

      const data = await response.json();
      console.log('Screens asignadas exitosamente:', data);
      alert('Screens asignadas correctamente');

      setRolNombre('');
      setAppId('');
      setScreenInput('');
    } catch (error) {
      console.error(error);
      alert('Error al asignar screens');
    }
  };

  return (
    <div className="roles-container">
      <div className="roles-card">
        <h1 className="roles-title">Asignar Screens a Rol</h1>

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
                <option key={rol} value={rol}>
                  {rol}
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
      </div>
    </div>
  );
};

export default Screens;
