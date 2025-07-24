import React, { useState } from 'react';

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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Roles Management</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="txtnombre" className="block font-semibold mb-1">
            Nombre
          </label>
          <input
            id="txtnombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="txtdescripcion" className="block font-semibold mb-1">
            Descripción
          </label>
          <input
            id="txtdescripcion"
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Permisos</label>
          <div className="grid grid-cols-2 gap-2">
            {permisosDisponibles.map((permiso) => (
              <label key={permiso} className="flex items-center">
                <input
                  type="checkbox"
                  value={permiso}
                  checked={permisosSeleccionados.includes(permiso)}
                  onChange={() => handleCheckboxChange(permiso)}
                  className="mr-2"
                />
                {permiso}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear rol
        </button>
      </form>
    </div>
  );
};

export default Roles;
