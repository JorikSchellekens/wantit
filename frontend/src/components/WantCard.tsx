'use client'
import React, { useState } from 'react';
import { Address } from 'viem';
import { Card, CardContent } from "@/components/ui/card";
import WantDetailsModal from './WantDetailsModal';
import { useWantsContext, WantPool } from '@/app/contexts/wantsContext';
interface WantCardProps {
  contractAddress: Address;
  pool: WantPool[Address];
}

const WantCard: React.FC<WantCardProps> = ({ contractAddress, pool }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => { 
    e.preventDefault();
    console.log('Card clicked');
    setIsModalOpen(true);
  };

  const { isLoading } = useWantsContext();
  // const want = pool[contractAddress];
  // console.log({want, contractAddress, isLoading, pool})

  return (isLoading ? <div>Loading...</div> :
    <div onClick={handleCardClick}>
      <Card className="bg-background bg-opacity-70 border-none rounded-none cursor-pointer hover:bg-opacity-80 transition-all duration-200">
        <CardContent className="p-6">
          <h4 className="text-xl font-semibold mb-2 text-primary">{pool.title}</h4>
          <p className="mb-4">{pool.wish}</p>
          <p className="mb-2" suppressHydrationWarning>Expiry: {new Date(pool.expiryTimestamp * 1000).toLocaleDateString()}</p>
          <p className="mb-2">Status: {pool.status}</p>
          <p className="mb-4">Supported Tokens: {pool.supportedTokens.join(', ')}</p>
          <div className="flex flex-wrap gap-2">
            {pool.categories.map((cat: string) => (
              <span key={cat} className="text-xs bg-accent text-background px-2 py-1 rounded-none">
                {cat}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
      <WantDetailsModal 
        contractAddress={contractAddress}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        want={pool} 
      />
    </div>
  );
};

export default WantCard;