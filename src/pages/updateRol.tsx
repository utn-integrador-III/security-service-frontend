import React, { useState, useEffect } from "react";
import "../Roles.css";

const UpdateRol: React.FC = () => {
  const [roles, setRoles] = useState<{ name: string; description: string; permissions: string[] }[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [descripcion, setDescripcion] = useState("");
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<string[]>([]);

  const permisosDisponibles = [
    "write",
    "read",
    "delete",
    "update",
    "LostOBJECTMNG",
    "issue_managment",
  ];

  // Cargar lista de roles desde API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("https://api.ejemplo.com/roles");
        const data = await res.json();
        setRoles(data);
      } catch (err) {
        console.error("Error fetching roles", err);
      }
    };
    fetchRoles();
  }, []);

  // Cuando se selecciona un rol, cargar su info
  useEffect(() => {
    if (selectedRole) {
      const rol = roles.find((r) => r.name === selectedRole);
      if (rol) {
        setDescripcion(rol.description);
        setPermisosSeleccionados(rol.permissions || []);
      }
    }
  }, [selectedRole, roles]);

  const handleCheckboxChange = (permiso: string) => {
    setPermisosSeleccionados((prev) =>
      prev.includes(permiso)
        ? prev.filter((p) => p !== permiso)
        : [...prev, permiso]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updateData = {
      description: descripcion,
      permissions: permisosSeleccionados,
    };

    try {
      const response = await fetch(`https://api.ejemplo.com/roles/${selectedRole}`, {
        method: "PUT", // o PATCH dependiendo del backend
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el rol");
      }

      alert("Rol actualizado exitosamente");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el rol");
    }
  };
  const handleDelete = async () => {
    if (!selectedRole) {
      alert("Seleccione un rol para eliminar");
      return;
    }

    const confirmDelete = window.confirm(`¿Seguro que deseas eliminar el rol "${selectedRole}"?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://api.ejemplo.com/roles`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: selectedRole }),
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el rol");
      }

      alert("Rol eliminado exitosamente");

      // Limpiar formulario y actualizar lista de roles
      setSelectedRole("");
      setDescripcion("");
      setPermisosSeleccionados([]);
      setRoles((prev) => prev.filter((r) => r.name !== selectedRole));

    } catch (error) {
      console.error(error);
      alert("Error al eliminar el rol");
    }
  };

  return (
    <div className="roles-container">
      <div className="roles-card">
        <h1 className="roles-title">Actualizar Rol</h1>

        <form onSubmit={handleSubmit} className="roles-form">
          {/* ComboBox de roles */}
          <div className="form-group">
            <label htmlFor="roleSelect" className="form-label">Nombre del Rol</label>
            <select
              id="roleSelect"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="form-input"
              required
            >
              <option value="">Seleccione un rol</option>
              {roles.map((rol) => (
                <option key={rol.name} value={rol.name}>
                  {rol.name}
                </option>
              ))}
            </select>
          </div>

          {/* Campo descripción */}
          <div className="form-group">
            <label htmlFor="descripcion" className="form-label">Descripción</label>
            <input
              id="descripcion"
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="form-input"
              placeholder="Ingrese la descripción del rol"
              required
            />
          </div>

          {/* Permisos */}
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

          {/* Botón */}
          <button type="submit" className="submit-button">
            <span>Actualizar Rol</span>
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
           {/* Botón Eliminar */}
          <button
            type="button"
            className="delete-button"
            onClick={handleDelete}
            style={{
              marginTop: "1rem",
              backgroundColor: "#d9534f",
              color: "white",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Eliminar Rol
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateRol;
