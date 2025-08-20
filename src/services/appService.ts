import { buildApiUrl, getDefaultHeaders, handleApiError } from '../config/api';
import { AuthService } from './authService';

// Interfaces for Apps
export interface App {
  _id?: string;
  name: string;
  redirect_url: string;
  creation_date?: string;
  status: 'active' | 'inactive';
  admin_id: string;
}

export interface CreateAppRequest {
  name: string;
  redirect_url: string;
  status: 'active' | 'inactive';
  admin_id: string;
}

export interface UpdateAppRequest {
  name?: string;
  redirect_url?: string;
  status?: 'active' | 'inactive';
}

// Interfaces for Admins
export interface Admin {
  _id?: string;
  admin_email: string;
  status: 'active' | 'inactive';
  creation_date?: string;
}

export interface CreateAdminRequest {
  admin_email: string;
  password: string;
  status: 'active' | 'inactive';
}

// Service for handling Apps and Admins operations
export class AppService {
  // ===== ADMIN OPERATIONS =====
  
  // Get all admins
  static async getAllAdmins(status?: string): Promise<Admin[]> {
    try {
      const url = status ? buildApiUrl(`/admin?status=${status}`) : buildApiUrl('/admin');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw new Error('Error fetching admins');
    }
  }

  // Get admin by ID
  static async getAdminById(id: string): Promise<Admin> {
    try {
      const response = await fetch(buildApiUrl(`/admin/${id}`), {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching admin:', error);
      throw new Error('Error fetching admin');
    }
  }

  // Create new admin
  static async createAdmin(adminData: CreateAdminRequest): Promise<Admin> {
    try {
      const response = await fetch(buildApiUrl('/admin'), {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(adminData),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw new Error('Error creating admin');
    }
  }

  // ===== APP OPERATIONS =====

  // Get all apps
  static async getAllApps(status?: string): Promise<App[]> {
    try {
      // Check if user is authenticated
      if (!AuthService.isAuthenticated()) {
        console.warn('User not authenticated, returning empty apps array');
        return [];
      }

      const url = status ? buildApiUrl(`/apps?status=${status}`) : buildApiUrl('/apps');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.warn('User not authenticated, returning empty apps array');
          return [];
        }
        
        // Handle 405 errors specifically for /apps endpoint
        if (response.status === 405) {
          console.warn('Method not allowed for /apps endpoint');
          console.warn('This might indicate the endpoint exists but GET is not supported');
          console.warn('Returning empty apps array');
          return [];
        }
        
        return handleApiError(response);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching apps:', error);
      // Return empty array if API is not available (for development)
      console.warn('API not available, returning empty apps array');
      return [];
    }
  }

  // Get app by ID
  static async getAppById(id: string): Promise<App> {
    try {
      const response = await fetch(buildApiUrl(`/apps/${id}`), {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching app:', error);
      throw new Error('Error fetching app');
    }
  }

  // Create new app
  static async createApp(appData: CreateAppRequest): Promise<App> {
    try {
      const response = await fetch(buildApiUrl('/apps'), {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(appData),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating app:', error);
      throw new Error('Error creating app');
    }
  }

  // Update app
  static async updateApp(id: string, appData: UpdateAppRequest): Promise<App> {
    try {
      const response = await fetch(buildApiUrl(`/apps/${id}`), {
        method: 'PATCH',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(appData),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating app:', error);
      throw new Error('Error updating app');
    }
  }

  // ===== COMPOSITE OPERATIONS =====

  // Register new application (creates admin first, then app)
  static async registerNewApplication(
    adminData: CreateAdminRequest,
    appData: Omit<CreateAppRequest, 'admin_id'>
  ): Promise<{ admin: Admin; app: App }> {
    try {
      // Step 1: Create admin
      console.log('Creating admin...');
      const admin = await this.createAdmin(adminData);
      console.log('Admin created:', admin);

      // Step 2: Create app with admin_id
      console.log('Creating app...');
      const app = await this.createApp({
        ...appData,
        admin_id: admin._id!,
      });
      console.log('App created:', app);

      return { admin, app };
    } catch (error) {
      console.error('Error in registerNewApplication:', error);
      throw new Error('Error registering new application');
    }
  }
}
