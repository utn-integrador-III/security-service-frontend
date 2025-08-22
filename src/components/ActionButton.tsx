import React from 'react';
import { Link } from 'react-router-dom';

interface ActionButtonProps {
  to: string;
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  to, 
  variant, 
  children, 
  className = '' 
}) => {
  const baseClasses = "group relative px-10 py-4 rounded-2xl font-bold text-center transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 w-full sm:w-auto inline-block text-base border-2 min-w-[200px] overflow-hidden";
  
  const variantClasses = {
    primary: "bg-turquesa hover:bg-turquesa-dark text-white shadow-xl hover:shadow-2xl focus:ring-turquesa active:scale-95 border-turquesa hover:border-turquesa-dark",
    secondary: "bg-gradient-to-r from-accent-yellow/90 to-accent-yellow text-gray-900 font-extrabold hover:from-accent-yellow hover:to-yellow-400 border-accent-yellow hover:border-yellow-400 shadow-xl hover:shadow-2xl focus:ring-accent-yellow active:scale-95"
  };

  return (
    <Link to={to} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {/* Background glow effect for primary */}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-turquesa-dark via-turquesa to-turquesa-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
      
      {/* Background glow effect for secondary - más brillante */}
      {variant === 'secondary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-accent-yellow to-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
      
      {/* Button content */}
      <span className="relative z-10 group-hover:text-shadow-lg">
        {children}
      </span>
    </Link>
  );
};

export default ActionButton;
