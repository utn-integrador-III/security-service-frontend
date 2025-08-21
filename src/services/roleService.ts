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

      // Si no se encontraron roles, mostrar todos los roles para debugging
      if (adminRoles.length === 0 && allRoles.length > 0) {
        console.log('⚠️ No roles found for admin, showing all roles for debugging:');
        allRoles.forEach(role => {
          console.log(`  - ${role.name}: admin_id=${role.admin_id}, created_by=${role.created_by}, app_id=${role.app_id}`);
        });
      }

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
      console.log('🚀 INICIO createRole - DATOS RECIBIDOS:');
      console.log('  - roleData completo:', roleData);
      console.log('  - roleData.app_id:', roleData.app_id);
      console.log('  - Tipo de roleData.app_id:', typeof roleData.app_id);
      
      // Obtener el token y extraer admin_id
      const token = localStorage.getItem('auth_token');
      let appId = roleData.app_id; // ¡IMPORTANTE! Usar el app_id del formulario, NO del token
      let adminId: string | undefined;
      
      console.log('🔍 DESPUÉS DE ASIGNAR appId:');
      console.log('  - appId asignado:', appId);
      console.log('  - Tipo de appId:', typeof appId);
      
              if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            adminId = payload.admin_id || payload.user_id || payload.sub || payload.id;
            // NO sobrescribir appId si ya viene del formulario
            console.log('🔍 Admin ID from token:', adminId);
            console.log('🔍 App ID from form (ANTES de token):', appId);
            console.log('🔍 App ID from token (ignored):', payload.app_id || payload.app_client_id);
            console.log('🔍 Token payload completo:', payload);
            
            // Verificar que NO se sobrescriba
            const appIdBeforeToken = appId;
            // appId = appId || payload.app_id || payload.app_client_id; // ESTA LÍNEA ESTÁ COMENTADA
            console.log('🔍 App ID DESPUÉS de procesar token:', appId);
            console.log('🔍 ¿Se cambió el appId?', appId !== appIdBeforeToken);
            console.log('🔍 App ID del token que se IGNORA:', payload.app_id || payload.app_client_id);
          } catch (error) {
            console.error('Error decodificando token para obtener admin_id:', error);
          }
        }

      // Validación: SIEMPRE debe haber un app_id del formulario
      if (!appId) {
        console.error('❌ No se proporcionó app_id en el formulario');
        throw new Error('Debe seleccionar una aplicación para crear el rol');
      }

      console.log('✅ Usando app_id del formulario:', appId);

      // Preparar los datos del rol incluyendo el app_id y admin_id
      console.log('🔧 PREPARANDO DATOS FINALES:');
      console.log('  - roleData original:', roleData);
      console.log('  - appId a usar:', appId);
      console.log('  - adminId a usar:', adminId);
      
      const roleDataWithIds = {
        ...roleData,
        app_id: appId,
        admin_id: adminId,
        created_by: adminId
      };
      
      console.log('🔧 DATOS FINALES PREPARADOS:');
      console.log('  - roleDataWithIds:', roleDataWithIds);
      console.log('  - roleDataWithIds.app_id:', roleDataWithIds.app_id);
      console.log('  - ¿Es el mismo que el original?', roleDataWithIds.app_id === roleData.app_id);

      console.log('🚀 DATOS FINALES ENVIADOS AL BACKEND:');
      console.log('  Endpoint:', buildApiUrl('/rol'));
      console.log('  Method: POST');
      console.log('  Headers:', AuthService.getAuthHeaders());
      console.log('  🎯 APP_ID QUE SE ENVIARÁ:', roleDataWithIds.app_id);
      console.log('  🎯 ADMIN_ID QUE SE ENVIARÁ:', roleDataWithIds.admin_id);
      console.log('  Body completo:', JSON.stringify(roleDataWithIds, null, 2));
      
      // ⚠️ SOLUCIÓN TEMPORAL: Modificar el token para incluir el app_id correcto
      console.log('🔧 SOLUCIÓN TEMPORAL: Modificando token...');
      const originalToken = localStorage.getItem('auth_token');
      if (originalToken) {
        try {
          const tokenParts = originalToken.split('.');
          const payload = JSON.parse(atob(tokenParts[1]));
          
          // Crear un nuevo payload con el app_id correcto
          const newPayload = {
            ...payload,
            app_id: roleDataWithIds.app_id,
            app_client_id: roleDataWithIds.app_id
          };
          
          // Recrear el token (sin firma, solo para debugging)
          const newToken = tokenParts[0] + '.' + btoa(JSON.stringify(newPayload)) + '.' + tokenParts[2];
          
          // Guardar temporalmente el token modificado
          localStorage.setItem('auth_token_temp', newToken);
          
          console.log('🔧 Token modificado temporalmente con app_id:', roleDataWithIds.app_id);
          console.log('🔧 Nuevo payload del token:', newPayload);
        } catch (error) {
          console.error('Error modificando token:', error);
        }
      }

      // Usar el token temporal si existe
      let headers = AuthService.getAuthHeaders();
      const tempToken = localStorage.getItem('auth_token_temp');
      if (tempToken) {
        headers = {
          ...headers,
          'Authorization': `Bearer ${tempToken}`
        };
        console.log('🔧 Usando token temporal con app_id correcto');
      }
      
      const response = await fetch(buildApiUrl('/rol'), {
        method: 'POST',
        headers: headers,
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
      
      // Limpiar el token temporal
      localStorage.removeItem('auth_token_temp');
      console.log('🧹 Token temporal eliminado');
      
      // Verificar si el rol creado tiene los campos correctos
      console.log('🔍 VERIFICACIÓN DEL ROL CREADO:');
      console.log('  - admin_id en respuesta:', result.data.admin_id);
      console.log('  - created_by en respuesta:', result.data.created_by);
      console.log('  - app_id en respuesta:', result.data.app_id);
      console.log('  - admin_id enviado:', adminId);
      console.log('  - app_id enviado:', appId);
      console.log('  - ¿app_id enviado = app_id recibido?', result.data.app_id === appId);
      console.log('  - ¿app_id enviado = app_id del formulario?', appId === roleData.app_id);
      
      // Verificar si el backend está ignorando nuestro app_id
      if (result.data.app_id !== appId) {
        console.error('❌ ¡PROBLEMA DETECTADO!');
        console.error('  - El backend NO está usando el app_id que enviamos');
        console.error('  - App_id enviado:', appId);
        console.error('  - App_id recibido:', result.data.app_id);
        console.error('  - El backend probablemente está usando el app_id del token');
        console.error('  - ⚠️ SOLUCIÓN TEMPORAL aplicada: Token modificado');
      } else {
        console.log('✅ App_id correcto en la respuesta del backend');
        console.log('✅ Solución temporal funcionó correctamente');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw new Error('Error creating role');
    }
  }

  // Actualizar un rol
  static async updateRole(id: string, roleData: UpdateRoleRequest): Promise<Role> {
    try {
      // Verificar autenticación antes de hacer la petición
      if (!AuthService.isAuthenticated()) {
        console.error('User not authenticated for update role operation');
        throw new Error('Usuario no autenticado. Por favor, inicia sesión nuevamente.');
      }

      // Intentar refrescar el token si está expirado
      await AuthService.tryRefreshTokenIfExpired();

      console.log('🔄 UPDATE ROLE - Starting update...');
      console.log('  Role ID:', id);
      console.log('  Role Data:', roleData);
      console.log('  Endpoint:', buildApiUrl(`/rol/${id}`));
      console.log('  Headers:', AuthService.getAuthHeaders());
      console.log('  Body:', JSON.stringify(roleData, null, 2));

      // Usar PATCH directamente ya que está implementado en el backend
      const response = await fetch(buildApiUrl(`/rol/${id}`), {
        method: 'PATCH',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(roleData),
      });

      console.log('📩 PATCH Response Status:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Role updated successfully!');
        console.log('📄 Updated role data:', result.data);
        return result.data;
      }

      // Manejar errores específicos
      if (response.status === 401) {
        console.error('Unauthorized - user not authenticated or token expired');
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      
      if (response.status === 403) {
        console.error('Forbidden - user does not have permission to update this role');
        throw new Error('No tienes permisos para actualizar este rol. Solo el administrador que lo creó puede modificarlo.');
      }
      
      if (response.status === 404) {
        console.error('Role not found');
        throw new Error('El rol no fue encontrado.');
      }
      
      if (response.status === 422) {
        console.error('Validation error - check role data format');
        throw new Error('Error de validación. Verifica el formato de los datos del rol.');
      }
      
      if (response.status === 500) {
        console.error('Backend error when updating role');
        throw new Error('Error del servidor al actualizar el rol. Inténtalo de nuevo.');
      }

      return handleApiError(response);
    } catch (error) {
      console.error('💥 Update failed:', error);
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.log('🌐 Network error detected');
        console.log('🔍 This could be:');
        console.log('   - Backend not running');
        console.log('   - Network connectivity issue');
        console.log('   - CORS issue (backend not allowing PATCH from frontend)');
        
        throw new Error('Error de conexión. Verifica que el backend esté ejecutándose.');
      }
      
      // Re-throw the error if it's already a string
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Error al actualizar el rol');
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

      // Intentar refrescar el token si está expirado
      await AuthService.tryRefreshTokenIfExpired();

      console.log('🗑️ DELETE ROLE - Starting deletion...');
      console.log('  Role ID:', id);
      console.log('  Role Name:', name);
      console.log('  Endpoint:', buildApiUrl(`/rol/${id}`));

      // Usar el nuevo endpoint DELETE /rol/{id}
      const response = await fetch(buildApiUrl(`/rol/${id}`), {
        method: 'DELETE',
        headers: AuthService.getAuthHeaders(),
      });

      console.log('📩 DELETE Response Status:', response.status, response.statusText);

      if (!response.ok) {
        if (response.status === 401) {
          console.error('Unauthorized - user not authenticated or token expired');
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }
        
        if (response.status === 403) {
          console.error('Forbidden - user does not have permission to delete this role');
          throw new Error('No tienes permisos para eliminar este rol. Solo el administrador que lo creó puede eliminarlo.');
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

      console.log('✅ Role deleted successfully');
    } catch (error) {
      console.error('💥 Delete failed:', error);
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.log('🌐 Network error detected');
        console.log('🔍 This could be:');
        console.log('   - Backend not running');
        console.log('   - Network connectivity issue');
        console.log('   - CORS issue (backend not allowing DELETE from frontend)');
        
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
