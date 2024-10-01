'use client';

import React, { useState } from 'react';
import { Address } from 'viem';
import WantCard from './WantCard';
import { WantPool } from '@/app/contexts/wantsContext';
interface CategoryFilterProps {
  allCategories: string[];
  wantPools: WantPool;
}
const CategoryFilter: React.FC<CategoryFilterProps> = ({ allCategories, wantPools }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };

  const selectedWantPools= selectedCategories.length === 0
    ? Object.entries<WantPool>(wantPools)
    : Object.entries<WantPool>(wantPools).filter(([, pool]) => 
    // @ts-ignore typescript doesn't understand Object.entries<WantPool>
        pool.categories.some((cat: string) => selectedCategories.includes(cat))
      );

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        {allCategories.map(category => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`px-4 py-2 text-sm ${
              selectedCategories.includes(category)
                ? 'bg-primary text-background'
                : 'bg-accent text-background'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedWantPools.map(([address, pool], index) => (
          <WantCard key={index} contractAddress={address as Address} pool={pool as WantPool[Address]} />
        ))}
      </div>
    </>
  );
};

export default CategoryFilter;