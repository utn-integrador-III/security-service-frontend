# Sistema de Login de Administradores

## Descripción

Se ha implementado un sistema de autenticación dual que permite separar el acceso de usuarios regulares y administradores del sistema. **Importante**: Ambos tipos de usuarios usan el mismo endpoint `/auth/login`, pero el backend detecta automáticamente si es un `user_admin`.

## Características Implementadas

### 1. Login de Usuarios Regulares (`/signin`)
- **Ruta**: `/signin`
- **Endpoint**: `/auth/login`
- **Propósito**: Acceso para usuarios regulares del sistema
- **Redirección**: `/dashboard`

### 2. Login de Administradores (`/admin-signin`)
- **Ruta**: `/admin-signin`
- **Endpoint**: `/auth/admin/login` (endpoint específico para administradores)
- **Propósito**: Acceso para administradores del sistema
- **Redirección**: `/admin-dashboard` (si es admin) o `/dashboard` (si es usuario regular)
- **Detección**: El backend valida que el usuario sea un `user_admin` en el endpoint específico

### 3. Dashboard de Administradores (`/admin-dashboard`)
- **Ruta**: `/admin-dashboard`
- **Acceso**: Solo para usuarios autenticados como administradores
- **Funcionalidades**:
  - Panel de control administrativo
  - Gestión de usuarios
  - Gestión de roles
  - Gestión de pantallas
  - Gestión de aplicaciones
  - Información del sistema

## Detección Automática de Administradores

El sistema detecta automáticamente si un usuario es administrador basándose en la respuesta del backend:

### Criterios de Detección:
1. **Campo explícito**: `isAdmin: true` en la respuesta
2. **Rol específico**: `role.name` contiene "administrator", "admin", "superadmin", "user_admin"
3. **Permisos específicos**: Permisos como "admin:all", "admin:*", "user_admin", "super_admin"
4. **Acceso total**: `screens: ["*"]` o `screens: ["all"]`

### Ejemplo de Respuesta del Backend:
```json
{
  "data": {
    "email": "admin@example.com",
    "name": "Admin User",
    "status": "active",
    "role": {
      "name": "user_admin",
      "permissions": ["admin:all", "user:create", "user:read"],
      "is_active": true,
      "screens": ["*"]
    },
    "token": "jwt_token_here"
  },
  "message": "Login successful",
  "message_code": "LOGIN_SUCCESS"
}
```

## Componentes Creados

### 1. `AdminSignIn.tsx`
- Componente de inicio de sesión específico para administradores
- Diseño diferenciado con colores azules
- Verificación automática del tipo de usuario después del login
- Redirección inteligente según el tipo detectado

### 2. `AdminDashboard.tsx`
- Dashboard específico para administradores
- Interfaz con estadísticas y acciones administrativas
- Verificación de permisos de administrador
- Navegación a todas las funciones administrativas

### 3. `AdminProtectedRoute.tsx`
- Componente de ruta protegida para administradores
- Verifica autenticación y permisos de administrador
- Redirección automática según el tipo de usuario

## Servicios Actualizados

### `AuthService.ts`
- **Método actualizado**: `adminLogin()` - Usa el endpoint específico `/auth/admin/login`
- **Nuevo método**: `detectAdminFromResponse()` - Detecta automáticamente si es admin
- **Método actualizado**: `login()` - También detecta automáticamente el tipo de usuario
- **Nuevo método**: `isAdmin()` - Verifica si el usuario es administrador
- **Nuevo método**: `getUserType()` - Obtiene el tipo de usuario (admin/user)

## Navegación Actualizada

### `Navigation.tsx`
- **Enlaces diferenciados**: "User Login" y "Admin Login"
- **Indicador visual**: Badge que muestra el tipo de usuario (👑 Admin / 👤 User)
- **Dashboard dinámico**: Muestra Admin Dashboard o User Dashboard según el tipo
- **Estilos diferenciados**: Colores y elementos visuales específicos

## Estilos Agregados

### `auth.css`
- **Estilos admin**: `.admin-auth-card`, `.admin-icon`, `.admin-button`, etc.
- **Colores diferenciados**: Azul para administradores, púrpura para usuarios
- **Footer**: Enlace para cambiar entre tipos de login

### `navigation.css`
- **Indicador de usuario**: `.user-type-badge` con estilos diferenciados
- **Badges**: Admin (azul) y User (verde)

## Rutas Configuradas

```typescript
// Rutas públicas
/signin          // Login de usuarios regulares
/admin-signin    // Login de administradores
/signup          // Registro de aplicaciones

// Rutas protegidas
/dashboard       // Dashboard de usuarios regulares
/admin-dashboard // Dashboard de administradores (protegido)
```

## Uso

### Para Usuarios Regulares
1. Navegar a `/signin`
2. Ingresar credenciales de usuario
3. Acceder al dashboard regular

### Para Administradores
1. Navegar a `/admin-signin`
2. Ingresar credenciales de administrador
3. El sistema detecta automáticamente si es admin
4. Acceder al panel correspondiente

## Seguridad

- **Separación de roles**: Usuarios y administradores tienen accesos diferentes
- **Verificación de permisos**: Cada ruta verifica el tipo de usuario
- **Redirección automática**: Usuarios no autorizados son redirigidos
- **Detección automática**: El backend determina el tipo de usuario
- **Tokens diferenciados**: Los administradores reciben tokens con permisos especiales

## API Endpoints

### Backend debe implementar:
- `POST /auth/login` - Login para usuarios regulares (ya existente)
- `POST /auth/admin/login` - Login específico para administradores
- `PUT /auth/logout` - Logout (ya existente)

### Estructura de respuesta esperada:
```json
{
  "data": {
    "email": "user@example.com",
    "name": "User Name",
    "status": "active",
    "role": {
      "name": "user_admin", // o "user" para usuarios regulares
      "permissions": ["admin:all"], // permisos específicos
      "is_active": true,
      "screens": ["*"] // o pantallas específicas
    },
    "token": "jwt_token_here"
  },
  "message": "Login successful",
  "message_code": "LOGIN_SUCCESS"
}
```

## Notas de Implementación

1. **Compatibilidad**: El sistema es compatible con el login existente
2. **Detección automática**: No requiere endpoints separados
3. **Escalabilidad**: Fácil agregar más tipos de usuarios en el futuro
4. **UX**: Interfaz clara y diferenciada para cada tipo de usuario
5. **Mantenimiento**: Código modular y bien documentado

## Flujo de Autenticación

1. **Usuario ingresa credenciales** en `/admin-signin` o `/signin`
2. **Frontend envía petición** al endpoint correspondiente (`/auth/admin/login` o `/auth/login`)
3. **Backend valida credenciales** y verifica permisos
4. **Backend responde** con datos del usuario y permisos
5. **Frontend detecta automáticamente** si es administrador
6. **Frontend redirige** al dashboard correspondiente
7. **Navegación se adapta** según el tipo de usuario

## Redirección Automática

### Para Usuarios Autenticados
- **Acceso a rutas públicas**: Si un usuario ya está autenticado y accede a `/`, `/signin`, `/admin-signin`, o `/signup`, será redirigido automáticamente al dashboard correspondiente
- **Admin**: Redirigido a `/admin-dashboard`
- **Usuario regular**: Redirigido a `/dashboard`

### Para Usuarios No Autenticados
- **Acceso a rutas protegidas**: Redirigidos a `/signin`
- **Navegación**: Solo pueden acceder a rutas públicas

## Componentes de Redirección

### `AuthRedirect.tsx`
- **Propósito**: Verifica el estado de autenticación y redirige automáticamente
- **Funcionalidad**: Muestra un spinner mientras verifica la sesión
- **Aplicación**: Envuelve todas las rutas públicas

### `LoadingSpinner.tsx`
- **Propósito**: Componente de carga visual
- **Uso**: Se muestra durante la verificación de autenticación
