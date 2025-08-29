import React from 'react';
import utnLogo from '../images/logoUTN2.jpg';
import ActionButton from './ActionButton';

interface HeroSectionProps {
  title: string;
  subtitle: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center space-y-8">
      {/* Logo Container */}
      <div className="flex justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-1">
          <img
            src={utnLogo}
            alt="Logo Universidad Técnica Nacional"
            className="w-36 h-auto object-contain mx-auto"
          />
        </div>
      </div>
      
      {/* Title */}
      <div className="space-y-4">
        <h1 className="text-6xl lg:text-7xl font-bold text-turquesa animate-fade-in leading-tight">
          {title}
        </h1>
        
        {/* Decorative line */}
        <div className="flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-turquesa to-turquesa-dark rounded-full"></div>
        </div>
      </div>
      
      {/* Subtitle */}
      <div className="max-w-3xl mx-auto">
        <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed animate-slide-up">
          {subtitle}
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 animate-slide-up">
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
