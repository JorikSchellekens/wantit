'use client'
import React from 'react'
import { Address } from 'viem';
import WantCard from './WantCard'
import { useWantsContext, WantPool } from '@/app/contexts/wantsContext'

const PopularWants: React.FC = () => {
  const { isLoading, wantPools2 } = useWantsContext();
  return (
    <section className={`coinbase-mono font-mono`}>
      <h3 className="text-3xl font-bold mb-8 text-text">Popular Want Pools</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? <div>Loading...</div> : Object.entries<WantPool>(wantPools2).map(([address, pool]) => {
          return <WantCard key={address} contractAddress={address as Address} pool={pool as WantPool[Address]} />
})}
      </div>
    </section>
  );
};

export default PopularWants;
