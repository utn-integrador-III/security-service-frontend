# Proyecto Segurity - Frontend

Bienvenido al repositorio del frontend para el proyecto **Segurity**. Esta es una aplicación web construida con **React**, **TypeScript** y **Vite**, y utiliza **Tailwind CSS** para el estilizado. El objetivo de este documento es servir como una guía central para que todo el equipo pueda entender la estructura del proyecto, cómo ponerlo en marcha y las convenciones que seguiremos.

---

## 🚀 Primeros Pasos

Sigue estos pasos para tener el proyecto corriendo en tu máquina local.

### Prerrequisitos

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (que incluye `npm`). Se recomienda la versión LTS.

### Instalación

1.  **Clona el repositorio** en tu máquina local.
2.  Abre una terminal en la carpeta raíz del proyecto (`frontend-segurity`).
3.  Instala todas las dependencias necesarias con el siguiente comando:

    ```
    npm install

    ```

### Ejecución del Proyecto

Una vez instaladas las dependencias, puedes iniciar el servidor local con:

```
npm run dev

```

Esto levantará la aplicación en modo de desarrollo. La terminal te mostrará la URL local donde puedes ver el proyecto (normalmente `http://localhost:5173`). El servidor se recargará automáticamente cada vez que hagas un cambio en el código.

---

## 📜 Comandos Disponibles

Estos son los scripts principales definidos en el `package.json`:

-   `npm run dev`: Inicia el servidor de desarrollo.
-   `npm run build`: Compila y empaqueta la aplicación para producción en la carpeta `dist/`.
-   `npm run lint`: Analiza el código en busca de errores y problemas de estilo con ESLint.
-   `npm run preview`: Levanta un servidor local para previsualizar el build de producción.

---

## 📂 Estructura del Proyecto

La estructura de archivos dentro de `src/` está organizada de la siguiente manera para mantener el código ordenado y escalable.

```
frontend_segurity/
├── src/
│   ├── assets/         # Iconos, fuentes, etc. (recursos estáticos)
│   ├── components/     # Componentes de UI reutilizables (Header, Footer, Layout)
│   ├── images/         # Imágenes específicas del proyecto (logos, etc.)
│   ├── pages/          # Componentes que representan una página completa (Home, SignIn)
│   ├── App.tsx         # Componente raíz con el enrutador principal
│   ├── index.css       # Estilos globales, configuración de Tailwind y clases CSS personalizadas
│   └── main.tsx        # Punto de entrada de la aplicación. Renderiza el componente App.
├── package.json      # Dependencias y scripts del proyecto
└── README.md         # Este archivo :)
```


## Estructura completa del proyecto:

```
frontend_segurity/
├── index.html                 → Documento raíz con el <div id="root">
├── package.json               → Scripts y dependencias
├── postcss.config.cjs         → Configuración de Tailwind v4
├── tailwind.config.js         → Colores, fuentes y customizaciones
├── src/
│   ├── main.jsx               → Punto de entrada ReactDOM
│   ├── index.css              → Estilos globales con Tailwind
│   ├── App.jsx                → Enrutador de todas las rutas
│   ├── images/                → Aquí va el logo UTN u otras imgs locales
│   ├── pages/                 → Pantallas de la app
│   │   ├── Home.jsx
│   │   ├── SignIn.jsx
│   │   ├── SignUp.jsx
│   │   ├── Roles.jsx
│   │   ├── Permissions.jsx
│   │   ├── RoleRequests.jsx
│   │   └── CodeVerification.jsx
│   ├── components/            → Componentes reutilizables
│   │   ├── ProtectedRoute.jsx
│   │   ├── Footer.jsx
│   ├── context/               → Estado global (auth, etc.) [vacío]
│   ├── services/              → Lógica para conectar con API Python/Backend
│   └── hooks/                 → Funciones reutilizables [vacío]
```

-   **`src/components`**: Coloca aquí componentes que se puedan reutilizar en varias partes de la aplicación (botones, modales, inputs, etc.). El `Header`, `Footer` y `Layout` son buenos ejemplos.
-   **`src/pages`**: Cada archivo aquí es una página completa de la aplicación que se asocia a una ruta. Por ejemplo, `Home.tsx` es lo que se ve en la ruta `/`.
-   **`src/index.css`**: **¡Archivo importante!** Aquí se configuran las directivas de Tailwind y se pueden añadir clases CSS personalizadas.

---

## ✨ Puntos Clave para el Equipo (¡Leer si eres nuevo!)

Si es tu primera vez con esta combinación de tecnologías, aquí tienes algunos puntos clave:

1.  **React y Componentes**: Todo en React es un componente. Piensa en cada parte de la UI como una pieza de Lego. Creamos componentes pequeños y los combinamos para construir páginas enteras. En este proyecto, usamos **componentes funcionales** con **hooks** (como `useState`, `useEffect`).

2.  **TypeScript**: Es JavaScript con superpoderes. Su principal ventaja es que nos permite definir **tipos** para nuestras variables y props. Esto nos ayuda a evitar errores comunes y hace que el código sea más fácil de entender. Si ves algo como `const miFuncion = (nombre: string): void => { ... }`, simplemente está diciendo que la función `miFuncion` espera un `nombre` que sea un `string` y no devuelve (`void`) nada.

3.  **Tailwind CSS**: En lugar de escribir CSS en archivos separados, Tailwind nos permite aplicar estilos directamente en el HTML (o en este caso, en el JSX) usando clases de utilidad como `bg-blue-500`, `p-4`, `flex`, etc. Es muy rápido y mantiene los estilos junto al componente al que pertenecen. Hemos configurado los colores base en `index.css`.(pueden usar css normal, lo habia instalado por probar)

4.  **Flujo de Trabajo Sugerido**:

    -   **¿Necesitas crear una nueva página?** Añade un nuevo archivo en `src/pages` y luego ve a `src/App.tsx` para añadir la nueva ruta en el `Router`.
    
    -   **¿Necesitas un nuevo componente reutilizable (ej. un botón personalizado)?** Créalo dentro de `src/components` y luego impórtalo donde lo necesites.

    -   **¿Quieres cambiar los colores o añadir una clase global?** El mejor lugar es `src/index.css`.

¡Mucha suerte, equipo! A construir algo increíble.


## Pasitos que hice para crear el proyecto(ignorarlos)

----------------------------------------------------------
Crear el proyecto con plantilla TypeScript:

npm create vite@latest my-app -- --template react-ts

Entrar a la carpeta y agregar dependencias:

cd my-app
npm install
npm install react-router-dom axios
npm install -D @tailwindcss/cli postcss autoprefixer
npm install @tailwindcss/postcss(con este si sirve)


crear  - tailwind.config.js  -
añadir: 

// frontend/postcss.config.cjs
module.exports = {
  plugins: {
    // CAMBIA 'tailwindcss' por '@tailwindcss/postcss'
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};



Configurar Tailwind en src/index.css (arriba de root)

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {

¡Listo! Ya tienes un proyecto React + TypeScript + Vite + Tailwind desde cero

------------------------------------------




