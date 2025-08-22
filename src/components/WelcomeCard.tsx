import React from 'react';
import utnLogo from '../images/logoUTN2.jpg';
import ActionButton from './ActionButton';

interface HeroSectionProps {
  title: string;
  subtitle: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center">
      <div className="mb-8 transform transition-transform duration-300 hover:scale-110">
        <div className="bg-white p-4 rounded-lg inline-block mb-8">
          <img
            src={utnLogo}
            alt="Logo Universidad Técnica Nacional"
            className="w-32 h-auto object-contain mx-auto"
          />
        </div>
      </div>
      
      <h1 className="text-5xl font-bold text-turquesa mb-6 animate-fade-in">
        {title}
      </h1>
      
      <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto animate-slide-up">
        {subtitle}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
        <ActionButton to="/signin" variant="primary">
          Iniciar Sesión →
        </ActionButton>
        <ActionButton to="/signup" variant="secondary">
          Registrar Aplicación →
        </ActionButton>
      </div>
    </div>
  );
};

export default HeroSection;
