// frontend/src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import utnLogo from '../images/logoUTN2.jpg'; // Asegúrate de que esta ruta sea correcta

const Home: React.FC = () => {
  return (
    <div className="bg-white/95 rounded-3xl shadow-2xl p-10 max-w-xl w-full flex flex-col items-center text-center">
      <img
        src={utnLogo}
        alt="Logo Universidad Técnica Nacional"
        className="w-36 h-auto mb-6 animate-fade-in-down"
      />
      <h1 className="text-5xl font-extrabold text-gray-800 mb-4 drop-shadow-sm">
        Bienvenido a <span className="text-turquesa">Segurity</span>
      </h1>
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        Plataforma integral para gestionar acceso y permisos en tus aplicaciones.
      </p>
      <div className="flex flex-col sm:flex-row gap-5 w-full justify-center">
        <Link to="/signin">
          <button className="btn btn-primary">
            Iniciar Sesión
          </button>
        </Link>
        <Link to="/signup">
          <button className="btn btn-secondary">
            Registrarse
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;