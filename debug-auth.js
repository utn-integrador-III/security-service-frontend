// Script de diagnóstico para verificar autenticación
const token = localStorage.getItem('token');
const userType = localStorage.getItem('userType');

console.log('=== DIAGNÓSTICO DE AUTENTICACIÓN ===');
console.log('Token existe:', !!token);
console.log('Tipo de usuario:', userType);

if (token) {
  console.log('Token (primeros 50 caracteres):', token.substring(0, 50) + '...');
  
  // Verificar si el token es válido (decodificar JWT)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token payload:', payload);
    console.log('Token expira en:', new Date(payload.exp * 1000));
    console.log('Token es válido:', payload.exp * 1000 > Date.now());
  } catch (error) {
    console.error('Error decodificando token:', error);
  }
} else {
  console.log('No hay token almacenado');
}

console.log('=== FIN DIAGNÓSTICO ===');
