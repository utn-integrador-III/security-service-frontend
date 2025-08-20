import { buildApiUrl, getDefaultHeaders, handleApiError } from '../config/api';

// Interfaces para los tipos de datos
export interface Screen {
  id?: string;
  role_name: string;
  app_id: string;
  screens: string[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateScreenRequest {
  role_name: string;
  app_id: string;
  screens: string[];
}

export interface UpdateScreenRequest {
  role_name?: string;
  app_id?: string;
  screens?: string[];
}

// Servicio para manejar operaciones de screens
export class ScreenService {
  // Obtener todas las asignaciones de screens
  static async getAllScreens(): Promise<Screen[]> {
    try {
      const response = await fetch(buildApiUrl('/screens'), {
        method: 'GET',
        headers: getDefaultHeaders(),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching screens:', error);
      throw new Error('Error al obtener las asignaciones de screens');
    }
  }

  // Obtener screens por ID
  static async getScreenById(id: string): Promise<Screen> {
    try {
      const response = await fetch(buildApiUrl(`/screens/${id}`), {
        method: 'GET',
        headers: getDefaultHeaders(),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching screen:', error);
      throw new Error('Error al obtener la asignación de screen');
    }
  }

  // Crear una nueva asignación de screens
  static async createScreen(screenData: CreateScreenRequest): Promise<Screen> {
    try {
      const response = await fetch(buildApiUrl('/screens'), {
        method: 'POST',
        headers: getDefaultHeaders(),
        body: JSON.stringify(screenData),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating screen assignment:', error);
      throw new Error('Error al crear la asignación de screens');
    }
  }

  // Actualizar una asignación de screens
  static async updateScreen(id: string, screenData: UpdateScreenRequest): Promise<Screen> {
    try {
      const response = await fetch(buildApiUrl(`/screens/${id}`), {
        method: 'PUT',
        headers: getDefaultHeaders(),
        body: JSON.stringify(screenData),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating screen assignment:', error);
      throw new Error('Error al actualizar la asignación de screens');
    }
  }

  // Eliminar una asignación de screens
  static async deleteScreen(id: string): Promise<void> {
    try {
      const response = await fetch(buildApiUrl(`/screens/${id}`), {
        method: 'DELETE',
        headers: getDefaultHeaders(),
      });

      if (!response.ok) {
        return handleApiError(response);
      }
    } catch (error) {
      console.error('Error deleting screen assignment:', error);
      throw new Error('Error al eliminar la asignación de screens');
    }
  }

  // Obtener screens por rol
  static async getScreensByRole(roleName: string): Promise<Screen[]> {
    try {
      const response = await fetch(buildApiUrl(`/screens/role/${roleName}`), {
        method: 'GET',
        headers: getDefaultHeaders(),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching screens by role:', error);
      throw new Error('Error al obtener las screens del rol');
    }
  }
}
