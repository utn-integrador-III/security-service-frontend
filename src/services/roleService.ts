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
  permissions: string[];
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
      const response = await fetch(buildApiUrl('/rol'), {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw new Error('Error al obtener los roles');
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
      console.error('Error fetching role:', error);
      throw new Error('Error al obtener el rol');
    }
  }

  // Crear un nuevo rol
  static async createRole(roleData: CreateRoleRequest): Promise<Role> {
    try {
      const response = await fetch(buildApiUrl('/roles'), {
        method: 'POST',
        headers: getDefaultHeaders(),
        body: JSON.stringify(roleData),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating role:', error);
      throw new Error('Error al crear el rol');
    }
  }

  // Actualizar un rol
  static async updateRole(id: string, roleData: UpdateRoleRequest): Promise<Role> {
    try {
      const response = await fetch(buildApiUrl(`/roles/${id}`), {
        method: 'PUT',
        headers: getDefaultHeaders(),
        body: JSON.stringify(roleData),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating role:', error);
      throw new Error('Error al actualizar el rol');
    }
  }

  // Eliminar un rol
  static async deleteRole(id: string): Promise<void> {
    try {
      const response = await fetch(buildApiUrl(`/roles/${id}`), {
        method: 'DELETE',
        headers: getDefaultHeaders(),
      });

      if (!response.ok) {
        return handleApiError(response);
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      throw new Error('Error al eliminar el rol');
    }
  }
}
