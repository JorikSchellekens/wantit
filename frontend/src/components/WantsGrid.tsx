import React from 'react'
import CategoryFilter from './CategoryFilter'

export interface WantPool {
  title: string;
  wish: string;
  categories: string[];
  popular: boolean;
}

interface WantsGridProps {
  wantPools: WantPool[];
}

const WantsGrid: React.FC<WantsGridProps> = ({ wantPools }) => {
  const allCategories = Array.from(new Set(wantPools.flatMap(pool => pool.categories)));

  return (
    <section className={`coinbase-mono font-mono`}>
      <h3 className="text-3xl font-bold mb-8 text-text">All Want Pools</h3>
      
      <CategoryFilter 
        allCategories={allCategories}
        wantPools={wantPools}
      />
    </section>
  );
};

export default WantsGrid;