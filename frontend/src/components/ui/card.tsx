import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div className={`p-4 shadow ${className} coinbase-mono font-mono`}>
      {children}
    </div>
  );
};

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({ className, children }) => {
  return (
    <div className={`p-4 ${className} coinbase-mono font-mono`}>
      {children}
    </div>
  );
};

export { Card, CardContent };