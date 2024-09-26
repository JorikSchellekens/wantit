import React from 'react';
import { coinbaseMono } from '@/app/layout';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div className={`p-4 shadow ${className} ${coinbaseMono.variable}`}>
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
    <div className={`p-4 ${className} ${coinbaseMono.variable}`}>
      {children}
    </div>
  );
};

export { Card, CardContent };