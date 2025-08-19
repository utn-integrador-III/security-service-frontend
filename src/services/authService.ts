import { buildApiUrl, getDefaultHeaders, handleApiError } from '../config/api';

// Interfaces para autenticación
export interface LoginRequest {
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
      
      const response = await fetch(buildApiUrl('/auth/login'), {
        method: 'POST',
        headers: getDefaultHeaders(),
        body: JSON.stringify(credentials),
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
        this.setUserData(result.data);
        console.log('Token saved successfully');
        console.log('User authenticated:', this.isAuthenticated());
      } else {
        console.warn('No token found in response');
      }

      return result;
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Error al iniciar sesión');
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

      const response = await fetch(buildApiUrl('/auth/refresh'), {
        method: 'POST',
        headers: {
          ...getDefaultHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const result = await response.json();
      
      // Actualizar token
      if (result.data?.token) {
        this.setToken(result.data.token);
      }

      return result;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Error al refrescar el token');
    }
  }

  // Logout
  static async logout(email: string): Promise<void> {
    try {
      const response = await fetch(buildApiUrl('/auth/logout'), {
        method: 'PUT',
        headers: getDefaultHeaders(),
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      // Limpiar datos locales
      this.clearAuthData();
    } catch (error) {
      console.error('Error during logout:', error);
      throw new Error('Error al cerrar sesión');
    }
  }

  // Obtener headers con autenticación
  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
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
