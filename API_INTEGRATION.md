# Integración con Security Service API

Este documento explica cómo configurar y usar la integración con la API de seguridad.

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con la siguiente configuración:

```env
VITE_API_BASE_URL=http://localhost:5002
VITE_DEV_MODE=true
```

### 2. Ejecutar la API Backend

Antes de usar el frontend, asegúrate de que la API esté ejecutándose. Según el [repositorio de la API](https://github.com/utn-integrador-III/security-service-api.git), puedes ejecutarla de dos maneras:

#### Opción A: Ejecutar localmente con VS Code
1. Crear entorno virtual: `python3 -m venv venv`
2. Crear archivo `.env` tomando las variables de `.env.example`
3. Ejecutar: `pip3 install -r requirements.txt`
4. Configurar `launch.json` en VS Code
5. Ejecutar el proyecto en "Run and debug"

#### Opción B: Ejecutar con Docker
1. Crear archivo `.env` tomando las variables de `.env.example`
2. Crear imagen: `docker build -t unt-img-security-api .`
3. Ejecutar contenedor: `docker run -d -p 5002:5002 --name utn-security-api --env-file .env utn-img-security-api`

## Servicios Disponibles

### RoleService
Maneja todas las operaciones relacionadas con roles:

- `getAllRoles()`: Obtener todos los roles
- `getRoleById(id)`: Obtener un rol específico
- `createRole(roleData)`: Crear un nuevo rol
- `updateRole(id, roleData)`: Actualizar un rol existente
- `deleteRole(id)`: Eliminar un rol

### ScreenService
Maneja todas las operaciones relacionadas con screens:

- `getAllScreens()`: Obtener todas las asignaciones de screens
- `getScreenById(id)`: Obtener una asignación específica
- `createScreen(screenData)`: Crear una nueva asignación
- `updateScreen(id, screenData)`: Actualizar una asignación
- `deleteScreen(id)`: Eliminar una asignación
- `getScreensByRole(roleName)`: Obtener screens por rol

## Uso en Componentes

### Ejemplo de uso en Roles.tsx:

```typescript
import { RoleService } from '../services/roleService';

// Cargar roles
const loadRoles = async () => {
  try {
    const roles = await RoleService.getAllRoles();
    setRoles(roles);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Crear rol
const createRole = async (roleData) => {
  try {
    const newRole = await RoleService.createRole(roleData);
    console.log('Rol creado:', newRole);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Estructura de Datos

### Role
```typescript
interface Role {
  id?: string;
  name: string;
  description: string;
  permissions: string[];
  created_at?: string;
  updated_at?: string;
}
```

### Screen
```typescript
interface Screen {
  id?: string;
  role_name: string;
  app_id: string;
  screens: string[];
  created_at?: string;
  updated_at?: string;
}
```

## Manejo de Errores

Todos los servicios incluyen manejo de errores automático. Los errores se capturan y se muestran al usuario con mensajes descriptivos.

## Endpoints de la API

La configuración actual apunta a los siguientes endpoints:

- `GET /roles` - Obtener todos los roles
- `POST /roles` - Crear un nuevo rol
- `PUT /roles/:id` - Actualizar un rol
- `DELETE /roles/:id` - Eliminar un rol
- `GET /screens` - Obtener todas las asignaciones de screens
- `POST /screens` - Crear una nueva asignación de screens
- `PUT /screens/:id` - Actualizar una asignación de screens
- `DELETE /screens/:id` - Eliminar una asignación de screens

## Troubleshooting

### Error de CORS
Si encuentras errores de CORS, asegúrate de que la API esté configurada para permitir requests desde `http://localhost:5173` (puerto por defecto de Vite).

### Error de Conexión
Si no puedes conectar con la API:
1. Verifica que la API esté ejecutándose en el puerto correcto
2. Confirma que la URL en `VITE_API_BASE_URL` sea correcta
3. Revisa los logs de la API para errores
