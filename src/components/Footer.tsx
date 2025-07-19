// frontend/src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => (
  // ESTE FOOTER ES EL QUE DEBE TENER EL FONDO TURQUESA
  <footer className="bg-turquesa text-text-light shadow-inner mt-auto py-4">
    <div className="container mx-auto text-center text-sm px-4">
      <p>
        © {new Date().getFullYear()} Segurity. Todos los derechos reservados con mucho amor 🤍      </p>
    </div>
  </footer>
);

export default Footer;