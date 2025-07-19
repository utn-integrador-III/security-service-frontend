// frontend/src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-turquesa"> 
      <div className="container mx-auto flex justify-between ">
        <div className="flex items-center ">
          <Link to="/" className="flex items-center">
            <div className="bg-accent-yellow text-dark-background font-bold text-xl w-10 h-10 flex items-center justify-center rounded-full mr-3 shadow-md">
            </div>
            <span className="font-extrabold tracking-wider text-text-light ml-2">Segurity</span>
          </Link>
        </div>
        <nav>
          <ul className="items-center space-x-6 text-lg">
            <li>
              <Link to="/signup" className="text-text-light">
                Registrarse
              </Link>
            </li>
            <li>
              <Link to="/signin" className="text-text-light">
                Iniciar Sesión
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;