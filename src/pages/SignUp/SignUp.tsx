import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'; // Importar los estilos

const SignUp: React.FC = () => {
  const [appName, setAppName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ appName?: string; email?: string; password?: string }>({});
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: { appName?: string; email?: string; password?: string } = {};

    if (!appName.trim()) {
      newErrors.appName = 'El nombre de la aplicación es requerido.';
    }
    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es requerido.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El formato del correo no es válido.';
    }
    if (!password) {
      newErrors.password = 'La contraseña es requerida.';
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Registrando aplicación con los siguientes datos:');
      console.log({
        appName,
        email,
        password,
      });
      
      // Simulación de éxito y redirección
      alert('¡Aplicación registrada con éxito!');
      navigate('/roles'); // Redirigir a la página de Roles
    } else {
      console.log('Validación fallida. Por favor, corrige los errores.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">Registrar Nueva Aplicación</h1>
        <p className="signup-subtitle">Crea una cuenta para gestionar tu aplicación, roles y permisos.</p>
        <form onSubmit={handleRegister} noValidate>
          <div className="input-group">
            <label htmlFor="appName">Nombre de la Aplicación</label>
            <input
              type="text"
              id="appName"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className={errors.appName ? 'input-error' : ''}
            />
            {errors.appName && <p className="error-message">{errors.appName}</p>}
          </div>
          <div className="input-group">
            <label htmlFor="email">Correo del Administrador</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>
          <button type="submit" className="signup-button">
            Crear Aplicación
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
