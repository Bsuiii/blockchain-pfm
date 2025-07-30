import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', gradient = false }) => {
  const baseClasses = "rounded-2xl p-6 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1";
  const backgroundClasses = gradient 
    ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-400/30 hover:border-purple-400/50"
    : "bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20";

  return (
    <div className={`${baseClasses} ${backgroundClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;