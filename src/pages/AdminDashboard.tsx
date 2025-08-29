import React, { useState, useEffect } from 'react';
import { AuthService } from '../services/authService';
import { AppService } from '../services/appService';
import { Link } from 'react-router-dom';
import '../styles/adminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [adminApps, setAdminApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        console.log('🚀 Loading dashboard data...');
        console.log('🔍 Is authenticated:', AuthService.isAuthenticated());
        console.log('🔍 Token exists:', !!localStorage.getItem('auth_token'));
        
        const data = AuthService.getUserData();
        setUserData(data);
        
        // Cargar apps del admin
        console.log('📡 Loading admin apps...');
        const apps = await AppService.getAdminApps();
        setAdminApps(apps);
        console.log('✅ Dashboard data loaded successfully');
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  if (!AuthService.isAdmin()) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-message">
            <strong>Acceso Denegado:</strong> Solo los administradores pueden acceder a este panel.
          </div>
          <Link 
            to="/admin-signin" 
            className="error-link"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-content">
            <div className="admin-avatar">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="admin-welcome">
              <h1>Panel de Administración</h1>
              <p>Bienvenido, {userData?.name || 'Administrador'}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-icon users">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="stat-info">
                <h3>Usuarios Totales</h3>
                <Link to="/user-registration">Crear Nuevo Usuario</Link>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-icon roles">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="stat-info">
                <h3>Roles del Sistema</h3>
                <Link to="/roles">Gestionar Roles</Link>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-icon screens">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="stat-info">
                <h3>Pantallas</h3>
                <Link to="/screens">Gestionar Pantallas</Link>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-icon apps">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="stat-info">
                <h3>Aplicaciones</h3>
                <a href="#">{adminApps.length} Apps</a>
                <Link to="/apps">Gestionar Apps</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="content-grid">
          <div className="action-card">
            <h3>Acciones de Administración</h3>
            <div className="action-links">
              <Link to="/user-registration" className="action-link">
                <div className="action-link-icon users">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="action-link-content">
                  <h4>Crear Nuevo Usuario</h4>
                  <p>Registrar nuevos usuarios en el sistema</p>
                </div>
              </Link>

              <Link to="/roles" className="action-link">
                <div className="action-link-icon roles">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="action-link-content">
                  <h4>Gestionar Roles</h4>
                  <p>Crear y modificar roles del sistema</p>
                </div>
              </Link>

              <Link to="/permissions" className="action-link">
                <div className="action-link-icon permissions">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="action-link-content">
                  <h4>Gestionar Permisos</h4>
                  <p>Configurar permisos y accesos</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="action-card">
            <h3>Información del Sistema</h3>
            <div className="system-info">
              <div className="info-item">
                <dt>Tipo de Usuario</dt>
                <dd>
                  <span className="status-badge admin">Administrador</span>
                </dd>
              </div>
              <div className="info-item">
                <dt>Email</dt>
                <dd>{userData?.email || 'N/A'}</dd>
              </div>
              <div className="info-item">
                <dt>Estado</dt>
                <dd>
                  <span className="status-badge active">Activo</span>
                </dd>
              </div>
              <div className="info-item">
                <dt>Rol</dt>
                <dd>{userData?.role?.name || 'Administrador'}</dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
