import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 transform hover:-translate-y-1 border border-gray-700/50">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 text-2xl">
          <span className="text-accent-yellow">{icon}</span>
        </div>
        <div>
          <h3 className="text-turquesa font-semibold text-lg mb-2">{title}</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
