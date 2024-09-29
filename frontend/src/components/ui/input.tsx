import React from 'react';

interface InputProps {
  type: string;
  placeholder: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ type, placeholder, className }) => {
  return (
    <input type={type} placeholder={placeholder} className={`px-3 py-2 ${className} coinbase-mono font-mono`} />
  );
};

export { Input };