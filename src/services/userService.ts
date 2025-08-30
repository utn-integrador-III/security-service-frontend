import { buildApiUrl, handleApiError } from '../config/api';
import { AuthService } from './authService';

// Interfaces for Users
export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  status: 'Active' | 'Pending' | 'Inactive';
  apps: UserApp[];
  creation_date?: string;
  is_session_active?: boolean;
}

export interface UserApp {
  app: string; // ObjectId de la app
  role: string; // ObjectId del rol
  status: 'Active' | 'Pending' | 'Inactive';
  is_session_active?: boolean;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  // Modo simple
  role_name?: string;
  app_name?: string;
  // Modo arreglo (compatibilidad)
  apps?: {
    app: string;
    role: string;
  }[];
}

// Service for handling User operations
export class UserService {
  // Get users by application ID
  static async getUsersByApp(appId: string): Promise<User[]> {
    try {
      const response = await fetch(buildApiUrl(`/user?app_id=${appId}`), {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching users by app:', error);
      throw new Error('Error fetching users');
    }
  }

  // Get user by ID
  static async getUserById(id: string): Promise<User> {
    try {
      const response = await fetch(buildApiUrl(`/user/${id}`), {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Error fetching user');
    }
  }

  // Create new user using the enrollment endpoint
  static async createUser(userData: CreateUserRequest): Promise<any> {
    try {
      console.log('🚀 Sending user data to backend:', userData);
      console.log('🚀 API URL:', buildApiUrl('/user/enrollment'));
      
      const response = await fetch(buildApiUrl('/user/enrollment'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...AuthService.getAuthHeaders(),
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      console.log('📡 Backend response:', result);
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        // Manejar errores específicos del controlador
        if (result.message_code === 'USER_ALREADY_REGISTERED') {
          throw new Error('El usuario ya está registrado con este rol y aplicación');
        } else if (result.message_code === 'INVALID_NAME') {
          throw new Error('El nombre no cumple con los estándares establecidos');
        } else if (result.message_code === 'INVALID_EMAIL_DOMAIN') {
          throw new Error('El correo electrónico proporcionado no es válido');
        } else if (result.message_code === 'INVALID_PASSWORD') {
          throw new Error('La contraseña no cumple con los estándares establecidos');
        } else if (result.message_code === 'UNEXPECTED_ERROR') {
          // Error interno del servidor - mostrar más detalles
          console.error('Backend error details:', result);
          throw new Error(`Error interno del servidor: ${result.message || 'Problema con el modelo de roles. Por favor contacta al administrador.'}`);
        } else if (result.message) {
          throw new Error(result.message);
        } else {
          throw new Error('Error al crear el usuario');
        }
      }

      return result;
    } catch (error) {
      console.error('Error creating user:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al crear el usuario');
    }
  }

  // Update user status in app
  static async updateUserAppStatus(
    userId: string, 
    appId: string, 
    status: 'Active' | 'Pending' | 'Inactive'
  ): Promise<User> {
    try {
      const response = await fetch(buildApiUrl(`/user/${userId}`), {
        method: 'PATCH',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify({
          app_id: appId,
          status: status
        }),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating user app status:', error);
      throw new Error('Error updating user status');
    }
  }

  // Get all users for admin (filtered by admin's apps)
  static async getAdminUsers(): Promise<User[]> {
    try {
      // Get admin's apps first
      const { AppService } = await import('./appService');
      const adminApps = await AppService.getAdminApps();
      
      // Get users for each app and combine them
      const allUsers: User[] = [];
      const userIds = new Set<string>(); // To avoid duplicates
      
      for (const app of adminApps) {
        if (app._id) {
          const appUsers = await this.getUsersByApp(app._id);
          appUsers.forEach(user => {
            const userId = user.id || user._id || '';
            if (userId && !userIds.has(userId)) {
              userIds.add(userId);
              allUsers.push(user);
            }
          });
        }
      }
      
      return allUsers;
    } catch (error) {
      console.error('Error fetching admin users:', error);
      throw new Error('Error fetching users');
    }
  }

  // Verify user email with code
  static async verifyUserEmail(email: string, verificationCode: string): Promise<any> {
    try {
      const response = await fetch(buildApiUrl('/user/verification'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: email,
          verification_code: verificationCode
        }),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error verifying user email:', error);
      throw new Error('Error verifying user email');
    }
  }

  // Change user password
  static async changePassword(
    userEmail: string, 
    oldPassword: string, 
    newPassword: string, 
    confirmPassword: string
  ): Promise<any> {
    try {
      const response = await fetch(buildApiUrl('/user/password'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: userEmail,
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword
        }),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error changing password:', error);
      throw new Error('Error changing password');
    }
  }

  // Request password reset
  static async requestPasswordReset(email: string): Promise<any> {
    try {
      const response = await fetch(buildApiUrl('/user/password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        }),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw new Error('Error requesting password reset');
    }
  }
}