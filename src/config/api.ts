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
  let errorMessage = 'Error en la petición';
  
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.error || errorMessage;
  } catch {
    errorMessage = `Error ${response.status}: ${response.statusText}`;
  }
  
  throw new Error(errorMessage);
};
