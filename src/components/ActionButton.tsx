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
  const baseClasses = "px-8 py-3 rounded-lg font-semibold text-center transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 w-full sm:w-auto inline-block text-sm border-2 min-w-[180px]";
  
  const variantClasses = {
    primary: "bg-turquesa hover:bg-turquesa-dark text-white shadow-lg hover:shadow-xl focus:ring-turquesa active:scale-95 border-turquesa hover:border-turquesa-dark",
    secondary: "bg-transparent hover:bg-turquesa/10 text-turquesa border-turquesa hover:border-turquesa-dark shadow-lg hover:shadow-xl focus:ring-turquesa active:scale-95"
  };

  return (
    <Link to={to} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </Link>
  );
};

export default ActionButton;
