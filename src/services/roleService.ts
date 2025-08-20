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
  app_id?: string;
  created_by?: string;
  admin_id?: string;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissions?: string[];
  app_id?: string;
  admin_id?: string;
  created_by?: string;
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

  // Obtener roles específicos del admin autenticado
  static async getAdminRoles(): Promise<Role[]> {
    try {
      console.log('🚀 Starting getAdminRoles...');
      
      // Verificar autenticación
      if (!AuthService.isAuthenticated()) {
        console.warn('User not authenticated, returning empty roles array');
        return [];
      }

      // Obtener el token y extraer admin_id
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.warn('No token found, returning empty roles array');
        return [];
      }

      console.log('🔍 Token from localStorage: EXISTS');
      console.log('🔍 Token length:', token.length);
      console.log('🔍 Token preview:', token.substring(0, 50) + '...');

      let adminId: string | undefined;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        adminId = payload.admin_id || payload.user_id || payload.sub || payload.id;
        console.log('🔍 Admin ID from token:', adminId);
        console.log('🔍 Full token payload:', payload);
      } catch (error) {
        console.error('Error decoding token:', error);
        return [];
      }

      if (!adminId) {
        console.warn('No admin ID found in token, returning empty roles array');
        return [];
      }

      // Obtener todos los roles
      const allRoles = await this.getAllRoles();
      console.log('📋 All roles loaded:', allRoles.length);

      // Filtrar roles por admin_id - buscar en diferentes campos posibles
      const adminRoles = allRoles.filter(role => {
        console.log('🔍 Checking role:', role.name);
        console.log('  - Role admin_id:', role.admin_id);
        console.log('  - Role created_by:', role.created_by);
        console.log('  - Role app_id:', role.app_id);
        console.log('  - Current admin_id:', adminId);
        
        // Verificar si el rol pertenece al admin actual
        const roleBelongsToAdmin = 
          role.admin_id === adminId ||
          role.created_by === adminId ||
          (role.app_id && role.app_id === adminId);
        
        console.log('  - Belongs to admin:', roleBelongsToAdmin);
        return roleBelongsToAdmin;
      });

      console.log('✅ Admin roles filtered:', adminRoles.length);
      console.log('📋 Roles del admin:', adminRoles.map(r => r.name));
      return adminRoles;
    } catch (error) {
      console.error('Error in getAdminRoles:', error);
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
      // Obtener el token y extraer admin_id y app_id
      const token = localStorage.getItem('auth_token');
      let appId = roleData.app_id;
      let adminId: string | undefined;
      
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          adminId = payload.admin_id || payload.user_id || payload.sub || payload.id;
          appId = appId || payload.app_id || payload.app_client_id;
          console.log('🔍 Admin ID from token:', adminId);
          console.log('🔍 App ID from token:', appId);
        } catch (error) {
          console.error('Error decodificando token para obtener admin_id y app_id:', error);
        }
      }

      // Preparar los datos del rol incluyendo el app_id y admin_id
      const roleDataWithIds = {
        ...roleData,
        app_id: appId,
        admin_id: adminId,
        created_by: adminId
      };

      console.log('🚀 DATOS FINALES ENVIADOS AL BACKEND:');
      console.log('  Endpoint:', buildApiUrl('/rol'));
      console.log('  Method: POST');
      console.log('  Headers:', AuthService.getAuthHeaders());
      console.log('  Body:', JSON.stringify(roleDataWithIds, null, 2));

      const response = await fetch(buildApiUrl('/rol'), {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(roleDataWithIds),
      });

      console.log('📩 RESPUESTA DEL BACKEND:');
      console.log('  Status:', response.status);
      console.log('  Status Text:', response.statusText);

      if (!response.ok) {
        return handleApiError(response);
      }

      const result = await response.json();
      console.log('✅ RESULTADO FINAL:', result);
      console.log('📄 ROL CREADO EN BD:', result.data);
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
  static async deleteRole(id: string, name?: string): Promise<void> {
    try {
      // Verificar autenticación antes de hacer la petición
      if (!AuthService.isAuthenticated()) {
        console.error('User not authenticated for delete role operation');
        throw new Error('Usuario no autenticado. Por favor, inicia sesión nuevamente.');
      }

      console.log('Attempting to delete role with ID:', id, 'Name:', name);
      console.log('Auth headers:', AuthService.getAuthHeaders());

      // Información de diagnóstico del admin actual
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('Admin ID del token:', payload.admin_id || payload.user_id);
          console.log('Admin email del token:', payload.email);
        } catch (error) {
          console.error('Error decodificando token:', error);
        }
      }

      const response = await fetch(buildApiUrl('/rol'), {
        method: 'DELETE',
        headers: {
          ...AuthService.getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role_name: name })
      });

      console.log('Delete role response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          console.error('Unauthorized - user not authenticated or token expired');
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }
        
        if (response.status === 403) {
          console.error('Forbidden - user does not have permission to delete roles');
          console.error('This might indicate that only the admin who created the role can delete it');
          throw new Error('No tienes permisos para eliminar este rol. Solo el administrador que lo creó puede eliminarlo.');
        }
        
        if (response.status === 404) {
          console.error('Role not found');
          throw new Error('El rol no fue encontrado.');
        }
        
        if (response.status === 422) {
          console.error('Validation error - check role name format');
          throw new Error('Error de validación. Verifica el formato del nombre del rol.');
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
        console.error('This might indicate that the DELETE endpoint is not implemented in the backend');
        console.error('For now, we will simulate the deletion in the frontend');
        
        // Simular eliminación exitosa para desarrollo
        // TODO: Remove this when backend DELETE endpoint is implemented
        console.log('Simulating successful deletion for development purposes');
        return; // Simular éxito
      }
      
      // Re-throw the error if it's already a string
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Error al eliminar el rol');
    }
  }
}
