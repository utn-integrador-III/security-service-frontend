import { buildApiUrl, getDefaultHeaders, handleApiError } from '../config/api';

// Interfaces para autenticación
export interface LoginRequest {
  email: string;
  password: string;
  app: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    email: string;
    name: string;
    status: string;
    role: {
      name: string;
      permissions: string[];
      is_active: boolean;
      screens: string[];
    };
    token: string;
  };
  message: string;
  message_code: string;
}

export interface AdminLoginResponse {
  data: {
    email: string;
    name: string;
    status: string;
    role: {
      name: string;
      permissions: string[];
      is_active: boolean;
      screens: string[];
    };
    token: string;
    isAdmin: boolean;
  };
  message: string;
  message_code: string;
}

export interface VerifyAuthRequest {
  permission: string;
}

export interface VerifyAuthResponse {
  data: {
    identity: string;
    rolName: string;
    email: string;
    name: string;
    status: string;
  };
  message: string;
  message_code: string;
}

export interface RefreshTokenResponse {
  data: {
    token: string;
  };
  message: string;
  message_code: string;
}

// Servicio para manejar autenticación
export class AuthService {
  private static tokenKey = 'auth_token';
  private static userKey = 'user_data';

  // Login de usuario
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('Attempting login with:', credentials.email);
      
      // Asegurar que el campo app esté presente
      const loginData = {
        ...credentials,
        app: credentials.app || 'security-service-frontend'
      };
      
      const response = await fetch(buildApiUrl('/auth/login'), {
        method: 'POST',
        headers: getDefaultHeaders(),
        body: JSON.stringify(loginData),
      });

      console.log('Login response status:', response.status);
      console.log('Login response headers:', response.headers);

      if (!response.ok) {
        return handleApiError(response);
      }

      const result = await response.json();
      console.log('Login response data:', result);
      
      // Guardar token y datos del usuario
      if (result.data?.token) {
        this.setToken(result.data.token);
        
        // Detectar si es administrador basándose en la respuesta del backend
        const isAdmin = this.detectAdminFromResponse(result.data);
        
        this.setUserData({ ...result.data, isAdmin });
        console.log(`${isAdmin ? 'Admin' : 'User'} token saved successfully`);
        console.log('User authenticated:', this.isAuthenticated());
        console.log('User type:', isAdmin ? 'admin' : 'user');
      } else {
        console.warn('No token found in response');
      }

      return result;
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Error al iniciar sesión');
    }
  }

  // Login de administrador
  static async adminLogin(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
    try {
      console.log('=== ADMIN LOGIN DEBUG ===');
      console.log('Email:', credentials.email);
      console.log('Password length:', credentials.password?.length || 0);
      
      // Usar el endpoint específico para administradores
      const loginData = {
        email: credentials.email,
        password: credentials.password
        // No necesitamos el campo app para el endpoint de admin
      };
      
      console.log('Final request payload:', JSON.stringify(loginData, null, 2));
      console.log('Request URL:', buildApiUrl('/auth/admin/login'));
      console.log('Request headers:', getDefaultHeaders());
      console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002');
      
      // Usar el endpoint específico para administradores
      const response = await fetch(buildApiUrl('/auth/admin/login'), {
        method: 'POST',
        headers: getDefaultHeaders(),
        body: JSON.stringify(loginData),
      });

      console.log('Admin login response status:', response.status);
      console.log('Admin login response headers:', response.headers);

      if (!response.ok) {
        return handleApiError(response);
      }

      const result = await response.json();
      console.log('Admin login response data:', result);
      
      // Guardar token y datos del usuario
      if (result.data?.token) {
        this.setToken(result.data.token);
        
        // Detectar si es administrador basándose en la respuesta del backend
        // El backend puede indicar esto de varias formas:
        // 1. Campo isAdmin en la respuesta
        // 2. Rol específico (ej: "Administrator", "admin", etc.)
        // 3. Permisos específicos
        const isAdmin = this.detectAdminFromResponse(result.data);
        
        this.setUserData({ ...result.data, isAdmin });
        console.log(`${isAdmin ? 'Admin' : 'User'} token saved successfully`);
        console.log('User authenticated:', this.isAuthenticated());
        console.log('User type:', isAdmin ? 'admin' : 'user');
      } else {
        console.warn('No token found in response');
      }

      return result;
    } catch (error) {
      console.error('Error during admin login:', error);
      
      // Si el backend no está disponible, mostrar un mensaje más específico
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('No se puede conectar al servidor. Verifica que el backend esté corriendo en http://localhost:5002');
      }
      
      throw new Error('Error al iniciar sesión como administrador');
    }
  }

  // Verificar autenticación
  static async verifyAuth(permission: string): Promise<VerifyAuthResponse> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(buildApiUrl('/auth/verify_auth'), {
        method: 'POST',
        headers: {
          ...getDefaultHeaders(),
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ permission }),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      console.error('Error verifying auth:', error);
      throw new Error('Error al verificar autenticación');
    }
  }

  // Refrescar token
  static async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      console.log('🔄 Attempting to refresh token...');

      const response = await fetch(buildApiUrl('/auth/refresh'), {
        method: 'POST',
        headers: {
          ...getDefaultHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📩 Refresh token response status:', response.status);

      if (!response.ok) {
        console.error('❌ Token refresh failed:', response.status, response.statusText);
        return handleApiError(response);
      }

      const result = await response.json();
      
      // Actualizar token
      if (result.data?.token) {
        console.log('✅ Token refreshed successfully');
        this.setToken(result.data.token);
      }

      return result;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Error al refrescar el token');
    }
  }

  // Intentar refrescar token automáticamente si está expirado
  static async tryRefreshTokenIfExpired(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) {
        return false;
      }

      // Verificar si el token está expirado
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;
        const now = Date.now();
        const isExpired = now > exp;
        
        if (isExpired) {
          console.log('🔄 Token expired, attempting to refresh...');
          await this.refreshToken();
          return true;
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
      }

      return false;
    } catch (error) {
      console.error('Error in tryRefreshTokenIfExpired:', error);
      return false;
    }
  }

  // Logout
  static async logout(email?: string): Promise<void> {
    try {
      const userData = this.getUserData();
      const userEmail = email || userData?.email;
      
      if (!userEmail) {
        console.warn('No email provided for logout');
        this.clearAuthData();
        return;
      }

      const response = await fetch(buildApiUrl('/auth/logout'), {
        method: 'PUT',
        headers: getDefaultHeaders(),
        body: JSON.stringify({ email: userEmail }),
      });

      if (!response.ok) {
        console.warn('Logout API call failed, but clearing local data');
      }

      // Limpiar datos locales
      this.clearAuthData();
    } catch (error) {
      console.error('Error during logout:', error);
      // Aún limpiar datos locales en caso de error
      this.clearAuthData();
    }
  }

  // Obtener headers con autenticación
  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    
    // Verificar si el token está expirado
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000; // Convertir a milisegundos
        const now = Date.now();
        const isExpired = now > exp;
        
        if (isExpired) {
          console.warn('⚠️ Token has expired! Clearing auth data...');
          this.clearAuthData();
          return getDefaultHeaders();
        }
      } catch (error) {
        console.error('Error parsing token payload:', error);
      }
    }
    
    return {
      ...getDefaultHeaders(),
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  // Verificar si el usuario está autenticado
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Obtener datos del usuario
  static getUserData(): any {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  // Obtener permisos del usuario
  static getUserPermissions(): string[] {
    const userData = this.getUserData();
    return userData?.role?.permissions || [];
  }

  // Verificar si el usuario tiene un permiso específico
  static hasPermission(permission: string): boolean {
    const permissions = this.getUserPermissions();
    return permissions.includes(permission);
  }

  // Verificar si el usuario es administrador
  static isAdmin(): boolean {
    const userData = this.getUserData();
    return userData?.isAdmin === true;
  }

  // Obtener el tipo de usuario (admin o regular)
  static getUserType(): 'admin' | 'user' | null {
    const userData = this.getUserData();
    if (userData?.isAdmin === true) {
      return 'admin';
    } else if (userData) {
      return 'user';
    }
    return null;
  }

  // Detectar si el usuario es administrador basándose en la respuesta del backend
  private static detectAdminFromResponse(userData: any): boolean {
    // 1. Verificar si hay un campo isAdmin explícito
    if (userData.isAdmin !== undefined) {
      return Boolean(userData.isAdmin);
    }

    // 2. Verificar por rol específico
    const roleName = userData.role?.name?.toLowerCase();
    const adminRoles = ['administrator', 'admin', 'superadmin', 'user_admin'];
    if (roleName && adminRoles.includes(roleName)) {
      return true;
    }

    // 3. Verificar por permisos específicos
    const permissions = userData.role?.permissions || [];
    const adminPermissions = ['admin:all', 'admin:*', 'user_admin', 'super_admin'];
    if (permissions.some((perm: string) => adminPermissions.includes(perm))) {
      return true;
    }

    // 4. Verificar si tiene acceso a todas las pantallas
    const screens = userData.role?.screens || [];
    if (screens.includes('*') || screens.includes('all')) {
      return true;
    }

    // Por defecto, no es administrador
    return false;
  }

  // Métodos privados para manejo de localStorage
  private static setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private static getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private static setUserData(userData: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(userData));
  }

  private static clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
}
