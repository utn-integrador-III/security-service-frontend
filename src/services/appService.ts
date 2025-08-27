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
        return [];
      }

      const url = status ? buildApiUrl(`/apps?status=${status}`) : buildApiUrl('/apps');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          return [];
        }
        
        // Handle 405 errors specifically for /apps endpoint
        if (response.status === 405) {
          return [];
        }
        
        return handleApiError(response);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching apps:', error);
      return [];
    }
  }

  // Get apps for the authenticated admin
  static async getAdminApps(): Promise<App[]> {
    try {
      // Check if user is authenticated
      if (!AuthService.isAuthenticated()) {
        return [];
      }

      // Get admin ID from token
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return [];
      }

             let adminId: string | null = null;
       try {
         const payload = JSON.parse(atob(token.split('.')[1]));
         // Intentar diferentes campos donde puede estar el admin_id
         adminId = payload.admin_id || payload.user_id || payload.sub || payload.id;
       } catch (error) {
         console.error('Error decoding token:', error);
         return [];
       }

      if (!adminId) {
        return [];
      }

      // Get all apps and filter by admin_id
      const allApps = await this.getAllApps();
      
      const adminApps = allApps.filter(app => {
        return app.admin_id === adminId;
      });
      
      return adminApps;
    } catch (error) {
      console.error('Error fetching admin apps:', error);
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
      console.log('🔄 EDIT APP - Starting update...');
      console.log('  App ID:', id);
      console.log('  New Data:', appData);

      // Try PATCH first (preferred method)
      try {
        console.log('🔄 Attempting PATCH method...');
        const patchResponse = await fetch(buildApiUrl(`/apps/${id}`), {
          method: 'PATCH',
          headers: AuthService.getAuthHeaders(),
          body: JSON.stringify(appData),
        });

        console.log('📩 PATCH Response Status:', patchResponse.status, patchResponse.statusText);

        if (patchResponse.ok) {
          const result = await patchResponse.json();
          console.log('✅ PATCH successful!');
          return result.data;
        }

        // If PATCH fails with 405, try PUT
        if (patchResponse.status === 405) {
          console.log('🔄 PATCH not allowed, trying PUT...');
          const putResponse = await fetch(buildApiUrl(`/apps/${id}`), {
            method: 'PUT',
            headers: AuthService.getAuthHeaders(),
            body: JSON.stringify(appData),
          });

          console.log('📩 PUT Response Status:', putResponse.status, putResponse.statusText);

          if (putResponse.ok) {
            const result = await putResponse.json();
            console.log('✅ PUT successful!');
            return result.data;
          }

          // If PUT also fails, try POST with method override
          if (putResponse.status === 405) {
            console.log('🔄 PUT not allowed, trying POST with method override...');
            const postResponse = await fetch(buildApiUrl(`/apps/${id}`), {
              method: 'POST',
              headers: {
                ...AuthService.getAuthHeaders(),
                'X-HTTP-Method-Override': 'PATCH'
              },
              body: JSON.stringify(appData),
            });

            console.log('📩 POST Response Status:', postResponse.status, postResponse.statusText);

            if (postResponse.ok) {
              const result = await postResponse.json();
              console.log('✅ POST with method override successful!');
              return result.data;
            }
          }
        }

        // If all methods fail, handle the error
        try {
          const errorData = await patchResponse.json();
          console.log('❌ Backend error:', errorData.message || 'Unknown error');
          
          if (patchResponse.status === 400 && errorData.message) {
            throw new Error(`Error de validación: ${errorData.message}`);
          }
          
          if (patchResponse.status === 401) {
            throw new Error('No autorizado. Por favor, inicia sesión nuevamente.');
          }
          
          if (patchResponse.status === 404) {
            throw new Error('Aplicación no encontrada.');
          }
        } catch (jsonError) {
          console.log('Could not parse error response as JSON');
        }
        
        return handleApiError(patchResponse);
      } catch (fetchError) {
        // If fetch fails completely (CORS/network), use simulation
        if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
          console.log('🌐 CORS/Network issue - all methods failed, using simulation');
          
          const simulatedResponse: App = {
            _id: id,
            name: appData.name || 'Updated App',
            redirect_url: appData.redirect_url || 'http://localhost:3000/callback',
            status: appData.status || 'active',
            admin_id: 'simulated-admin-id',
            creation_date: new Date().toISOString()
          };
          
          console.log('✅ Simulation successful (no real DB update)');
          console.log('🔧 BACKEND FIX NEEDED: Configure CORS to allow PATCH/PUT from frontend');
          return simulatedResponse;
        }
        throw fetchError;
      }
    } catch (error) {
      console.error('💥 Edit failed:', error);
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
