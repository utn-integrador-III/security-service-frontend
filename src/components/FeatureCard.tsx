import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-gray-700/50 hover:border-turquesa/50 shadow-xl hover:shadow-2xl">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-turquesa/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        {/* Icon and Title Row */}
        <div className="flex items-start space-x-6 mb-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-turquesa/20 to-turquesa/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl text-accent-yellow filter drop-shadow-lg">{icon}</span>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-turquesa font-bold text-2xl mb-3 group-hover:text-white transition-colors duration-300">
              {title}
            </h3>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-300 text-base leading-relaxed group-hover:text-gray-200 transition-colors duration-300 pl-22">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
