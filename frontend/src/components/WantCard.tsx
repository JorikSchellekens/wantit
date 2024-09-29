'use client'
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { WantPool } from './WantsGrid';
import WantDetailsModal from './WantDetailsModal';

interface WantCardProps {
  pool: WantPool;
}

const WantCard: React.FC<WantCardProps> = ({ pool }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => { 
    e.preventDefault();
    console.log('Card clicked');
    setIsModalOpen(true);
  };

  return (
    <div onClick={handleCardClick}>
      <Card className="bg-background bg-opacity-70 border-none rounded-none cursor-pointer hover:bg-opacity-80 transition-all duration-200">
        <CardContent className="p-6">
          <h4 className="text-xl font-semibold mb-2 text-primary">{pool.title}</h4>
          <p className="mb-4">{pool.wish}</p>
          <p className="mb-2" suppressHydrationWarning>Expiry: {new Date(pool.expiryTimestamp * 1000).toLocaleDateString()}</p>
          <p className="mb-2">Status: {pool.status}</p>
          <p className="mb-4">Supported Tokens: {pool.supportedTokens.join(', ')}</p>
          <div className="flex flex-wrap gap-2">
            {pool.categories.map((cat) => (
              <span key={cat} className="text-xs bg-accent text-background px-2 py-1 rounded-none">
                {cat}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
      <WantDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        want={pool} 
      />
    </div>
  );
};

export default WantCard;