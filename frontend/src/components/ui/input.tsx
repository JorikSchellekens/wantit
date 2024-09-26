import React from 'react';
import { coinbaseMono } from '@/app/layout'

interface InputProps {
  type: string;
  placeholder: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ type, placeholder, className }) => {
  return (
    <input type={type} placeholder={placeholder} className={`px-3 py-2 ${className} ${coinbaseMono.variable} font-mono`} />
  );
};

export { Input };