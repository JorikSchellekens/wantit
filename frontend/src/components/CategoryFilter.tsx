'use client';

import React, { useState } from 'react';
import { WantPool } from './WantsGrid';

interface CategoryFilterProps {
  allCategories: string[];
  wantPools: WantPool[];
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

  const filteredWantPools = selectedCategories.length === 0
    ? wantPools
    : wantPools.filter(pool => 
        pool.categories.some(cat => selectedCategories.includes(cat))
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
        {filteredWantPools.map((pool, index) => (
          <div key={index} className="bg-background bg-opacity-70 border-none rounded-none p-6">
            <h4 className="text-xl font-semibold mb-2 text-primary">{pool.title}</h4>
            <p className="mb-4">{pool.wish}</p>
            <div className="flex flex-wrap gap-2">
              {pool.categories.map((cat) => (
                <span key={cat} className="text-xs bg-accent text-background px-2 py-1 rounded-none">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CategoryFilter;