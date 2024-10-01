import React from 'react'
import CategoryFilter from './CategoryFilter'
import { useWantsContext } from '@/app/contexts/wantsContext';

const WantsGrid: React.FC = () => {
  const { wantPools2 } = useWantsContext();
  const allCategories = Array.from(new Set(Object.values(wantPools2).flatMap(pool => pool.categories)));
  return (
    <section className={`coinbase-mono font-mono`}>
      <h3 className="text-3xl font-bold mb-8 text-text">All Want Pools</h3>
      
      <CategoryFilter 
        allCategories={allCategories}
        wantPools={wantPools2}
      />
    </section>
  );
};

export default WantsGrid;