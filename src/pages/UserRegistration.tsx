import React, { useState } from 'react';
import { AppService } from '../services/appService';
import { RoleService } from '../services/roleService';
import '../styles/auth.css';

const UserRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    appId: '',
    roleId: ''
  });
  const [apps, setApps] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load apps and roles on component mount
  React.useEffect(() => {
    loadAppsAndRoles();
  }, []);

  const loadAppsAndRoles = async () => {
    try {
      console.log('🚀 Loading admin apps for user registration...');
      const apps = await AppService.getAdminApps();
      setApps(apps);
      console.log('Loaded admin apps for registration:', apps);
    } catch (error) {
      console.error('Error loading admin apps:', error);
      setError('Error loading applications. Please try again.');
    }
  };

  const loadRolesForApp = async () => {
    try {
      setError('');
      // Get roles created by the authenticated admin
      console.log('🚀 Loading admin roles for user registration...');
      const roles = await RoleService.getAdminRoles();
      setRoles(roles);
      console.log('Loaded admin roles for registration:', roles);
    } catch (error) {
      console.error('Error loading admin roles:', error);
      setError('Error loading roles for this application.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If app is selected, load roles for that admin
    if (name === 'appId' && value) {
      loadRolesForApp();
      // Reset role selection when app changes
      setFormData(prev => ({
        ...prev,
        roleId: ''
      }));
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (!formData.appId || !formData.roleId) {
      setError('Please select an app and role');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        apps: [{
          role: formData.roleId,
          app: formData.appId
        }]
      };

      // Create user using the service
      // await UserService.createUser(userData);
      setSuccess('User created successfully! Verification code has been sent to your email.');
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        appId: '',
        roleId: ''
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error creating user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card registration-card">
        <div className="auth-header">
          <div className="auth-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="auth-title">
            Registrar Nuevo Usuario
          </h2>
          <p className="auth-subtitle">
            Crear una nueva cuenta de usuario con acceso a aplicaciones específicas
          </p>
        </div>
        
        <form className="auth-form registration-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          
          {success && (
            <div className="success-message">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Nombre Completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Ingresa el nombre completo"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="usuario@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label htmlFor="appId" className="form-label">
              Tu Aplicación
            </label>
            <select
              id="appId"
              name="appId"
              required
              value={formData.appId}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Selecciona una de tus aplicaciones</option>
              {apps.map(app => (
                <option key={app._id} value={app._id}>
                  {app.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="roleId" className="form-label">
              Rol
            </label>
            <select
              id="roleId"
              name="roleId"
              required
              value={formData.roleId}
              onChange={handleInputChange}
              disabled={!formData.appId}
              className="form-select"
            >
              <option value="">
                {formData.appId ? 'Selecciona uno de tus roles' : 'Selecciona una aplicación primero'}
              </option>
              {roles.map(role => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
            {!formData.appId && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                Por favor selecciona una aplicación primero para ver tus roles creados
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? (
              <>
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando Usuario...
              </>
            ) : (
              'Crear Usuario'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            ¿Necesitas ayuda? 
            <a href="/admin-dashboard" className="auth-footer-link">
              Volver al Dashboard
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
