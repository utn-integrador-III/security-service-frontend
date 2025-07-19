// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        turquesa: '#20B2AA', // ¡Asegúrate de que este sea el código de color correcto!
        'dark-background': '#1A202C', // ¡Asegúrate de que este sea el código de color correcto!
        'text-light': '#E2E8F0', // ¡Asegúrate de que este sea el código de color correcto!
        'accent-yellow': '#FFD700',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}