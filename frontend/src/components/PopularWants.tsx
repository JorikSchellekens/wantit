'use client'
import React from 'react'
import { WantPool } from './WantsGrid'
import WantCard from './WantCard'

interface WantPoolsSectionProps {
  wantPools: WantPool[];
}

const PopularWants: React.FC<WantPoolsSectionProps> = ({ wantPools }) => {
  const popularWants = wantPools.filter(pool => pool.popular);

  return (
    <section className={`coinbase-mono font-mono`}>
      <h3 className="text-3xl font-bold mb-8 text-text">Popular Want Pools</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularWants.map((pool, index) => (
          <WantCard key={index} pool={pool} />
        ))}
      </div>
    </section>
  );
};

export default PopularWants;
