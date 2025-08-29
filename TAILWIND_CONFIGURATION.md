# 🎨 TAILWIND CSS CONFIGURATION - CRITICAL FOR HOMEPAGE STYLING

## ⚠️ VERSIONES EXACTAS REQUERIDAS

### 📦 Dependencies (package.json)
```json
{
  "devDependencies": {
    "tailwindcss": "3.4.16",
    "postcss": "^8.4.x",
    "autoprefixer": "^10.4.x"
  }
}
```

**❌ NO INSTALAR:** 
- `@tailwindcss/postcss` (causa conflictos de configuración)
- Versiones diferentes de `tailwindcss` (puede romper la compatibilidad)

## 🔧 CONFIGURACIÓN CRÍTICA

### 1. postcss.config.cjs (OBLIGATORIO)
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},        // ✅ CORRECTO
    autoprefixer: {},
  },
};
```

**❌ INCORRECTO:**
```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // ❌ CAUSA ERRORES
    autoprefixer: {},
  },
};
```

### 2. tailwind.config.js (CONFIGURACIÓN UTN)
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        turquesa: '#21665f',        // 🎨 Color principal UTN
        'turquesa-dark': '#1a524c', // 🎨 Color hover
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
```

### 3. src/index.css (ESTILOS GLOBALES)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .text-turquesa {
    color: #21665f;
  }
  
  .bg-turquesa {
    background-color: #21665f;
  }
  
  .border-turquesa {
    border-color: #21665f;
  }
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

## 🏠 COMPONENTES DE LA HOMEPAGE

### Archivos Críticos:
- `src/pages/Home.tsx` - Página principal
- `src/components/WelcomeCard.tsx` - Sección hero con logo UTN
- `src/components/FeatureCard.tsx` - Cards de características
- `src/components/StatCard.tsx` - Cards de estadísticas  
- `src/components/ActionButton.tsx` - Botones de acción

### Clases Tailwind Importantes:
- `text-turquesa` - Color de texto UTN
- `bg-turquesa` - Fondo color UTN
- `hover:bg-turquesa-dark` - Efecto hover
- `animate-fade-in` - Animación de aparición
- `animate-slide-up` - Animación deslizante

## 🚨 TROUBLESHOOTING

### Problema: Estilos no se cargan
**Causa:** Configuración incorrecta de PostCSS
**Solución:** Verificar que `postcss.config.cjs` use `tailwindcss: {}`

### Problema: Colores turquesa no aparecen
**Causa:** `tailwind.config.js` no tiene los colores customizados
**Solución:** Verificar la sección `theme.extend.colors`

### Problema: Animaciones no funcionan
**Causa:** Keyframes no definidos en `tailwind.config.js`
**Solución:** Agregar `animation` y `keyframes` en `theme.extend`

## ✅ VERIFICACIÓN

Para verificar que todo está correcto:

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar servidor:**
   ```bash
   npm run dev
   ```

3. **Verificar en navegador:**
   - Logo UTN debe aparecer centrado con animación
   - Botones deben ser color turquesa (#21665f)
   - Hover effects deben funcionar
   - Página debe ser completamente responsive

## 📞 CONTACTO

Si la homepage no se ve exactamente como se muestra en el diseño, verificar:
1. Versión exacta de Tailwind CSS (3.4.16)
2. Configuración de PostCSS (tailwindcss: {})
3. Colores customizados en tailwind.config.js
4. Importación correcta en index.css

---
*Configuración crítica para el proyecto Security Service Frontend - UTN*
