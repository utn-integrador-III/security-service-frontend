// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002', // Puerto por defecto según el README de la API
  TIMEOUT: 10000, // 10 segundos
};

// Headers comunes para todas las peticiones
export const getDefaultHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});

// Función para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Función para manejar errores de respuesta
export const handleApiError = async (response: Response): Promise<never> => {
  let errorMessage = 'Request error'; // Default error message

  try {
    const errorData = await response.json();
    console.log('Error response data:', errorData);
    console.log('Error status:', response.status);
    console.log('Error status text:', response.statusText);
    
    // Handle different error response formats
    if (typeof errorData === 'string') {
      errorMessage = errorData;
    } else if (errorData && typeof errorData === 'object') {
      // Try to extract meaningful error message
      if (errorData.message) {
        // Handle nested message objects (like validation errors)
        if (typeof errorData.message === 'object') {
          const validationErrors = Object.entries(errorData.message)
            .map(([field, error]) => `${field}: ${error}`)
            .join(', ');
          errorMessage = `Validation errors: ${validationErrors}`;
        } else {
          errorMessage = errorData.message;
        }
      } else if (errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.msg) {
        errorMessage = errorData.msg;
      } else if (errorData.errors && Array.isArray(errorData.errors)) {
        // Handle validation errors
        errorMessage = errorData.errors.map((err: any) => err.message || err.msg).join(', ');
      } else {
        errorMessage = `Error ${response.status}: ${JSON.stringify(errorData)}`;
      }
    } else {
      errorMessage = `Error ${response.status}: ${response.statusText}`;
    }
  } catch (parseError) {
    console.log('Could not parse error response as JSON');
    errorMessage = `Error ${response.status}: ${response.statusText}`;
  }

  // Add specific error context based on status code
  if (response.status === 401) {
    errorMessage = `Error de autenticación (401): ${errorMessage}. 
    
Posibles causas:
• El email o contraseña son incorrectos
• El usuario no existe en la base de datos
• El usuario no tiene permisos para esta aplicación
• El usuario no está activo o está bloqueado

Verifica:
• Que el email esté escrito correctamente
• Que la contraseña sea la correcta
• Que el usuario sea un 'user_admin' válido`;
  } else if (response.status === 400) {
    errorMessage = `Error de validación (400): ${errorMessage}. 
    
Posibles causas:
• Faltan campos requeridos en la petición
• El formato de los datos es incorrecto
• El dominio del email no está permitido (ej: "Invalid email domain")
• El email no cumple con las validaciones del backend

Verifica:
• Que el email tenga un dominio válido
• Que el formato del email sea correcto
• Que todos los campos requeridos estén presentes`;
  } else if (response.status === 403) {
    errorMessage = `Error de permisos (403): ${errorMessage}. 
    
Posibles causas:
• El usuario no tiene permisos para acceder a esta aplicación
• El rol del usuario no está configurado correctamente
• La aplicación no está autorizada para este usuario`;
  } else if (response.status === 404) {
    errorMessage = `Error de endpoint (404): ${errorMessage}. 
    
Posibles causas:
• El endpoint no existe
• La URL del backend es incorrecta
• El backend no está corriendo`;
  } else if (response.status >= 500) {
    errorMessage = `Error del servidor (${response.status}): ${errorMessage}. 
    
Posibles causas:
• Error interno del backend
• Problemas de base de datos
• El backend no está funcionando correctamente`;
  }

  console.log('Final error message:', errorMessage);
  throw new Error(errorMessage);
};
