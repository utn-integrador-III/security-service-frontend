import React from 'react';

const TailwindTest: React.FC = () => {
  return (
    <div className="p-4 space-y-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-bold text-turquesa">Prueba de Efectos Tailwind</h3>
      
      {/* Test de colores personalizados */}
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-turquesa rounded"></div>
        <div className="w-8 h-8 bg-turquesa-dark rounded"></div>
        <div className="w-8 h-8 bg-accent-yellow rounded"></div>
      </div>
      
      {/* Test de animaciones */}
      <div className="space-y-2">
        <div className="p-2 bg-white rounded animate-fade-in">Animación fade-in</div>
        <div className="p-2 bg-white rounded animate-slide-up">Animación slide-up</div>
      </div>
      
      {/* Test de hover effects */}
      <div className="p-2 bg-white rounded hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
        Hover para efectos
      </div>
      
      {/* Test de gradientes */}
      <div className="p-2 bg-gradient-to-r from-turquesa to-turquesa-dark text-white rounded">
        Gradiente personalizado
      </div>
    </div>
  );
};

export default TailwindTest;
