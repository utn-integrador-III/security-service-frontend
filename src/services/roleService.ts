import { buildApiUrl, handleApiError } from '../config/api';
import { AuthService } from './authService';

// Interfaces para los tipos de datos
export interface Role {
  _id?: string;
  name: string;
  description: string;
  permissions: string[];
  creation_date?: string;
  mod_date?: string;
  is_active?: boolean;
  default_role?: boolean;
  screens?: string[];
  app?: string;
  app_client_id?: string;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissions?: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: string[];
}

// Servicio para manejar operaciones de roles
export class RoleService {
  // Obtener todos los roles
  static async getAllRoles(): Promise<Role[]> {
    try {
      // Check if user is authenticated
      console.log('Checking authentication status...');
      console.log('Is authenticated:', AuthService.isAuthenticated());
      console.log('Token exists:', !!AuthService.getAuthHeaders().Authorization);
      
      if (!AuthService.isAuthenticated()) {
        console.warn('User not authenticated, returning empty roles array');
        return [];
      }

      console.log('Making request to /rol with auth headers');
      const response = await fetch(buildApiUrl('/rol'), {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
      });

      console.log('Roles response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          console.warn('User not authenticated, returning empty roles array');
          return [];
        }
        
        // Handle 500 errors specifically
        if (response.status === 500) {
          console.error('Backend error (500) when fetching roles');
          console.error('This indicates a problem with the backend endpoint /rol');
          console.error('Please check the backend logs for more details');
          
          // Return empty array for now, but log the issue
          return [];
        }
        
        return handleApiError(response);
      }

      const result = await response.json();
      console.log('Roles response data:', result);
      return result.data || [];
    } catch (error) {
      console.error('Error fetching roles:', error);
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Network error - backend might not be running');
        console.error('Please ensure the backend is running on port 5002');
      }
      
      // Return empty array if API is not available (for development)
      console.warn('API not available, returning empty roles array');
      return [];
    }
  }

  // Obtener un rol por ID
  static async getRoleById(id: string): Promise<Role> {
    try {
      const response = await fetch(buildApiUrl(`/rol/${id}`), {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching role by ID:', error);
      throw new Error('Error al obtener el rol');
    }
  }

  // Crear un nuevo rol
  static async createRole(roleData: CreateRoleRequest): Promise<Role> {
    try {
      const response = await fetch(buildApiUrl('/rol'), {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(roleData),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw new Error('Error creating role');
    }
  }

  // Actualizar un rol
  static async updateRole(id: string, roleData: UpdateRoleRequest): Promise<Role> {
    try {
      const response = await fetch(buildApiUrl(`/rol/${id}`), {
        method: 'PUT',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(roleData),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating role:', error);
      throw new Error('Error updating role');
    }
  }

  // Eliminar un rol
  static async deleteRole(id: string): Promise<void> {
    try {
      // Verificar autenticación antes de hacer la petición
      if (!AuthService.isAuthenticated()) {
        console.error('User not authenticated for delete role operation');
        throw new Error('Usuario no autenticado. Por favor, inicia sesión nuevamente.');
      }

      console.log('Attempting to delete role with ID:', id);
      console.log('Auth headers:', AuthService.getAuthHeaders());

      const response = await fetch(buildApiUrl(`/rol/${id}`), {
        method: 'DELETE',
        headers: AuthService.getAuthHeaders(),
      });

      console.log('Delete role response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          console.error('Unauthorized - user not authenticated or token expired');
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }
        
        if (response.status === 403) {
          console.error('Forbidden - user does not have permission to delete roles');
          throw new Error('No tienes permisos para eliminar roles.');
        }
        
        if (response.status === 404) {
          console.error('Role not found');
          throw new Error('El rol no fue encontrado.');
        }
        
        if (response.status === 500) {
          console.error('Backend error when deleting role');
          throw new Error('Error del servidor al eliminar el rol. Inténtalo de nuevo.');
        }

        return handleApiError(response);
      }

      console.log('Role deleted successfully');
    } catch (error) {
      console.error('Error deleting role:', error);
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Network error - backend might not be running or CORS issue');
        throw new Error('Error de conexión. Verifica que el backend esté ejecutándose.');
      }
      
      // Re-throw the error if it's already a string
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Error al eliminar el rol');
    }
  }
}
