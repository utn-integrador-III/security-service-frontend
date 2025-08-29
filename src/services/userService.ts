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
  apps: {
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

  // Create new user
  static async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response = await fetch(buildApiUrl('/user/enrollment'), {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Error creating user');
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
}