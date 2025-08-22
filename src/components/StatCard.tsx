import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, icon }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-gray-800/70 transition-all duration-300 transform hover:-translate-y-1 border border-gray-700/50">
      {icon && (
        <div className="text-turquesa text-3xl mb-3 flex justify-center">
          {icon}
        </div>
      )}
      <div className="text-turquesa text-3xl font-bold mb-2">{value}</div>
      <div className="text-gray-300 text-sm font-medium">{label}</div>
    </div>
  );
};

export default StatCard;
