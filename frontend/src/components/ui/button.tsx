import React from 'react';

interface ButtonProps {
  variant?: 'default' | 'ghost';
  size?: 'lg';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ variant = 'default', size, className, children }) => {
  const baseClasses = 'px-4 py-2 font-mono';
  const variantClasses = variant === 'ghost' ? 'bg-transparent' : 'bg-blue-600 hover:bg-blue-700';
  const sizeClasses = size === 'lg' ? 'text-lg' : '';

  return (
    <button className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className} coinbase-mono font-mono`}>
      {children}
    </button>
  );
};

export { Button };