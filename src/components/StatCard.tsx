import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, icon }) => {
  return (
    <div className="group relative bg-gray-800/60 backdrop-blur-sm rounded-3xl p-8 text-center hover:bg-gray-800/80 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 border border-gray-700/50 hover:border-turquesa/60 shadow-xl hover:shadow-2xl">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-turquesa/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        {/* Icon */}
        {icon && (
          <div className="text-turquesa text-4xl mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}
        
        {/* Value */}
        <div className="text-turquesa text-5xl lg:text-6xl font-bold mb-4 group-hover:text-white transition-colors duration-300 filter drop-shadow-lg">
          {value}
        </div>
        
        {/* Label */}
        <div className="text-gray-300 text-lg font-semibold group-hover:text-gray-200 transition-colors duration-300 tracking-wide">
          {label}
        </div>
        
        {/* Decorative line */}
        <div className="mt-4 flex justify-center">
          <div className="w-16 h-1 bg-gradient-to-r from-turquesa to-turquesa-dark rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
