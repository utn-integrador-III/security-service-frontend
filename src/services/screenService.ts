import { buildApiUrl, getDefaultHeaders, handleApiError } from '../config/api';
import { AuthService } from './authService';

// Interfaces para los tipos de datos
export interface Screen {
  id?: string;
  role_id: string;
  app_id: string;
  screen_path: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateScreenRequest {
  role_id: string;
  app_id: string;
  screen_path: string;
}

export interface UpdateScreenRequest {
  role_id?: string;
  app_id?: string;
  screen_path?: string;
}

// Servicio para manejar operaciones de screens
export class ScreenService {
  // Obtener todas las asignaciones de screens del admin autenticado
  static async getAllScreens(): Promise<Screen[]> {
    try {
      console.log('🔍 Cargando screens del admin autenticado...');
      
      // Obtener el token y extraer admin_id
      const token = localStorage.getItem('auth_token');
      let adminId: string | undefined;
      
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          adminId = payload.admin_id || payload.user_id || payload.sub || payload.id;
          console.log('🔍 Admin ID from token:', adminId);
        } catch (error) {
          console.error('Error decodificando token:', error);
          return [];
        }
      }

      if (!adminId) {
        console.warn('No admin ID found in token');
        return [];
      }

      // Obtener roles del admin y luego screens para cada rol
      console.log('🔄 Obteniendo roles del admin para cargar screens...');
      
      // Importar RoleService dinámicamente para evitar dependencias circulares
      const { RoleService } = await import('./roleService');
      const adminRoles = await RoleService.getAdminRoles();
      
      console.log('📋 Roles del admin encontrados:', adminRoles.length);
      
      // Obtener screens para cada rol del admin
      const allScreens: Screen[] = [];
      for (const role of adminRoles) {
        try {
          console.log(`🔍 Obteniendo screens para rol: ${role.name} (ID: ${role._id})`);
          const roleScreens = await this.getScreensByRole(role._id || '');
          
          // Verificar que roleScreens sea un array válido
          if (roleScreens && Array.isArray(roleScreens)) {
            allScreens.push(...roleScreens);
            console.log(`✅ Screens obtenidas para rol ${role.name}:`, roleScreens.length);
          } else {
            console.warn(`⚠️ roleScreens no es un array válido para rol ${role.name}:`, roleScreens);
          }
        } catch (error) {
          console.warn(`⚠️ Error obteniendo screens para rol ${role.name}:`, error);
        }
      }
      
      console.log('✅ Total de screens obtenidas:', allScreens.length);
      return allScreens;
      
    } catch (error) {
      console.error('❌ Error fetching screens:', error);
      return [];
    }
  }



  // Obtener screens por ID
  static async getScreenById(id: string): Promise<Screen> {
    try {
      const response = await fetch(buildApiUrl(`/rol/screens/${id}`), {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
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
      console.log('🚀 Creando screen assignment con datos:', screenData);
      console.log('🔗 URL:', buildApiUrl('/rol/screens'));
      console.log('🔑 Headers:', AuthService.getAuthHeaders());
      
      // Verificar que los datos sean válidos
      console.log('🔍 Validando datos enviados:');
      console.log('  - role_id:', screenData.role_id, 'tipo:', typeof screenData.role_id);
      console.log('  - app_id:', screenData.app_id, 'tipo:', typeof screenData.app_id);
      console.log('  - screen_path:', screenData.screen_path, 'tipo:', typeof screenData.screen_path);
      
      // Verificar conectividad (temporal para debugging)
      console.log('🔍 Verificando conectividad con el backend...');
      
      // Verificar si el endpoint existe
      try {
        const testResponse = await fetch(buildApiUrl('/rol/screens'), {
          method: 'OPTIONS',
          headers: { 'Content-Type': 'application/json' }
        });
        console.log('🔍 OPTIONS test status:', testResponse.status);
      } catch (testError) {
        console.warn('⚠️ OPTIONS test failed:', testError);
      }
      
      const requestBody = JSON.stringify(screenData);
      console.log('📤 Request body:', requestBody);
      
      const response = await fetch(buildApiUrl('/rol/screens'), {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        body: requestBody,
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      console.log('📡 Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('📡 Error response body:', errorText);
        
        // Intentar parsear el error como JSON
        try {
          const errorData = JSON.parse(errorText);
          console.error('📡 Parsed error data:', errorData);
          
          if (errorData.message_code === 'INTERNAL_SERVER_ERROR') {
            throw new Error(`Error interno del servidor: ${errorData.message}. Verifica que el backend esté funcionando correctamente.`);
          }
          
          throw new Error(errorData.message || 'Error desconocido del servidor');
        } catch (parseError) {
          console.error('📡 Error parsing response:', parseError);
          throw new Error(`Error del servidor (${response.status}): ${errorText}`);
        }
      }

      const result = await response.json();
      console.log('✅ Screen assignment creado exitosamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Error creating screen assignment:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        name: error instanceof Error ? error.name : 'Unknown error type'
      });
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Error de conexión: No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:5002');
      }
      
      throw new Error(`Error al crear la asignación de screens: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  // Actualizar una asignación de screens
  static async updateScreen(id: string, screenData: UpdateScreenRequest): Promise<Screen> {
    try {
      const response = await fetch(buildApiUrl(`/rol/screens/${id}`), {
        method: 'PUT',
        headers: AuthService.getAuthHeaders(),
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
      const response = await fetch(buildApiUrl(`/rol/screens/${id}`), {
        method: 'DELETE',
        headers: AuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        return handleApiError(response);
      }
    } catch (error) {
      console.error('Error deleting screen assignment:', error);
      throw new Error('Error al eliminar la asignación de screens');
    }
  }

  // Eliminar screen por ruta (nuevo endpoint)
  static async deleteScreenByPath(screenPath: string, roleId: string, appId: string, allScreens: string[]): Promise<void> {
    try {
      console.log(`🗑️ Eliminando screen: ${screenPath} del rol: ${roleId} y app: ${appId}`);
      
      // Filtrar la screen que se va a eliminar
      const remainingScreens = allScreens.filter(screen => screen !== screenPath);
      
      console.log('📋 Screens originales:', allScreens);
      console.log('📋 Screens restantes:', remainingScreens);
      
      const deleteData = {
        screen_path: screenPath, // Screen específica a eliminar
        screens: remainingScreens, // Screens restantes después de eliminar
        role_id: roleId,
        app_id: appId
      };
      
      console.log('📤 Delete data:', deleteData);
      
      const response = await fetch(buildApiUrl('/rol/screens'), {
        method: 'DELETE',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(deleteData),
      });

      console.log(`📡 Delete response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Delete error response: ${response.status} ${response.statusText}`);
        console.error(`❌ Delete error body: ${errorText}`);
        return handleApiError(response);
      }

      console.log('✅ Screen eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting screen by path:', error);
      throw new Error('Error al eliminar la screen');
    }
  }

  // Actualizar screen por ruta (nuevo endpoint)
  static async updateScreenByPath(oldPath: string, newPath: string, roleId: string, appId: string, allScreens: string[]): Promise<Screen> {
    try {
      console.log(`✏️ Actualizando screen: ${oldPath} → ${newPath} del rol: ${roleId} y app: ${appId}`);
      
      // Crear la lista actualizada de screens
      const updatedScreens = allScreens.map(screen => 
        screen === oldPath ? newPath : screen
      );
      
      console.log('📋 Screens originales:', allScreens);
      console.log('📋 Screens actualizadas:', updatedScreens);
      
      const updateData = {
        old_screen_path: oldPath, // Screen original a actualizar
        new_screen_path: newPath, // Nueva ruta de la screen
        screens: updatedScreens, // Enviar todas las screens con la actualizada
        role_id: roleId,
        app_id: appId
      };
      
      console.log('📤 Update data:', updateData);
      
      const response = await fetch(buildApiUrl('/rol/screens'), {
        method: 'PATCH',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      console.log(`📡 Update response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Update error response: ${response.status} ${response.statusText}`);
        console.error(`❌ Update error body: ${errorText}`);
        return handleApiError(response);
      }

      const result = await response.json();
      console.log('✅ Screen actualizada exitosamente:', result);
      return result;
    } catch (error) {
      console.error('Error updating screen by path:', error);
      throw new Error('Error al actualizar la screen');
    }
  }



  // Obtener screens por rol usando query parameters
  static async getScreensByRoleAndApp(roleId: string, appId: string): Promise<Screen[]> {
    try {
      console.log(`🔍 Obteniendo screens para rol ID: ${roleId} y app ID: ${appId}`);
      const url = buildApiUrl(`/rol/screens?role_id=${roleId}&app_id=${appId}`);
      console.log(`🔗 URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
      });

      console.log(`📡 Response status: ${response.status}`);
      console.log(`📡 Response ok: ${response.ok}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Error response: ${response.status} ${response.statusText}`);
        console.error(`❌ Error body: ${errorText}`);
        return handleApiError(response);
      }

      const result = await response.json();
      console.log(`📄 Response data:`, result);
      
      // Verificar si la respuesta tiene la estructura esperada
      let screens: Screen[] = [];
      if (result && result.data) {
        screens = result.data;
      } else if (Array.isArray(result)) {
        screens = result;
      } else {
        console.warn('⚠️ Estructura de respuesta inesperada:', result);
        return [];
      }
      
      console.log(`✅ Screens obtenidas para rol ${roleId} y app ${appId}:`, screens.length);
      return screens;
    } catch (error) {
      console.error('Error fetching screens by role and app:', error);
      throw new Error('Error al obtener las screens del rol y aplicación');
    }
  }

  // Obtener screens por rol usando path parameter
  static async getScreensByRole(roleId: string): Promise<Screen[]> {
    try {
      console.log(`🔍 Obteniendo screens para rol ID: ${roleId}`);
      console.log(`🔗 URL: ${buildApiUrl(`/rol/screens/role/${roleId}`)}`);
      
      const response = await fetch(buildApiUrl(`/rol/screens/role/${roleId}`), {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
      });

      console.log(`📡 Response status: ${response.status}`);
      console.log(`📡 Response ok: ${response.ok}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Error response: ${response.status} ${response.statusText}`);
        console.error(`❌ Error body: ${errorText}`);
        return handleApiError(response);
      }

      const result = await response.json();
      console.log(`📄 Response data:`, result);
      
      // Verificar si la respuesta tiene la estructura esperada
      let screens: Screen[] = [];
      if (result && result.data) {
        // Si result.data es un objeto con screens, extraer el array
        if (result.data.screens && Array.isArray(result.data.screens)) {
          screens = result.data.screens;
        } else if (Array.isArray(result.data)) {
          screens = result.data;
        } else {
          console.warn('⚠️ result.data no es un array ni tiene propiedad screens:', result.data);
          return [];
        }
      } else if (Array.isArray(result)) {
        screens = result;
      } else {
        console.warn('⚠️ Estructura de respuesta inesperada:', result);
        return [];
      }
      
      console.log(`✅ Screens obtenidas para rol ${roleId}:`, screens.length);
      return screens;
    } catch (error) {
      console.error('Error fetching screens by role:', error);
      throw new Error('Error al obtener las screens del rol');
    }
  }
}

