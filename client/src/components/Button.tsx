import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const baseClasses = "font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-purple-500/25",
    secondary: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30",
    danger: "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white shadow-lg hover:shadow-red-500/25"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const isDisabled = disabled || loading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
        ${className}
      `}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;