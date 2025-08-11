import React, { useState, useEffect } from "react";
import "../Roles.css";

const DeleteScreens: React.FC = () => {
  const [roles, setRoles] = useState<{ name: string; screens: string[] }[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [screens, setScreens] = useState<string[]>([]);
  const [selectedScreen, setSelectedScreen] = useState("");

  // Obtener lista de roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("https://api.ejemplo.com/roles"); // GET todos los roles
        const data = await res.json();
        setRoles(data);
      } catch (err) {
        console.error("Error fetching roles", err);
      }
    };
    fetchRoles();
  }, []);

  // Cuando seleccionas un rol, cargar sus screens
  useEffect(() => {
    if (selectedRole) {
      const role = roles.find((r) => r.name === selectedRole);
      setScreens(role?.screens || []);
      setSelectedScreen("");
    } else {
      setScreens([]);
      setSelectedScreen("");
    }
  }, [selectedRole, roles]);

  const handleDelete = async () => {
    if (!selectedRole || !selectedScreen) {
      alert("Seleccione un rol y una screen para eliminar");
      return;
    }

    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar la screen "${selectedScreen}" del rol "${selectedRole}"?`
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch("https://api.ejemplo.com/roles/screens", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role_name: selectedRole,
          screens: [selectedScreen],
        }),
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la screen");
      }

      alert("Screen eliminada exitosamente");

      // Actualizar lista local
      setScreens((prev) => prev.filter((s) => s !== selectedScreen));
      setSelectedScreen("");

    } catch (error) {
      console.error(error);
      alert("Error al eliminar la screen");
    }
  };

  return (
    <div className="roles-container">
      <div className="roles-card">
        <h1 className="roles-title">Eliminar Screen de un Rol</h1>

        {/* Seleccionar rol */}
        <div className="form-group">
          <label htmlFor="roleSelect" className="form-label">Nombre del Rol</label>
          <select
            id="roleSelect"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="form-input"
          >
            <option value="">Seleccione un rol</option>
            {roles.map((rol) => (
              <option key={rol.name} value={rol.name}>
                {rol.name}
              </option>
            ))}
          </select>
        </div>
        <br />
        <br />

        {/* Seleccionar screen */}
        <div className="form-group">
          <label htmlFor="screenSelect" className="form-label">Screen</label>
          <select
            id="screenSelect"
            value={selectedScreen}
            onChange={(e) => setSelectedScreen(e.target.value)}
            className="form-input"
            disabled={!screens.length}
          >
            <option value="">Seleccione una screen</option>
            {screens.map((screen, idx) => (
              <option key={idx} value={screen}>
                {screen}
              </option>
            ))}
          </select>
        </div>

        {/* Botón eliminar */}
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
          Eliminar Screen
        </button>
      </div>
    </div>
  );
};

export default DeleteScreens;
