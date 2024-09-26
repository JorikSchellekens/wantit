import React from 'react';
import { coinbaseMono } from '@/app/layout';

interface ButtonProps {
  variant?: 'default' | 'ghost';
  size?: 'lg';
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'default', size, className, children }) => {
  const baseClasses = 'px-4 py-2';
  const variantClasses = variant === 'ghost' ? 'bg-transparent' : 'bg-primary hover:bg-accent text-text';
  const sizeClasses = size === 'lg' ? 'text-lg' : '';

  return (
    <button className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className} ${coinbaseMono.variable}`}>
      {children}
    </button>
  );
};

export { Button };