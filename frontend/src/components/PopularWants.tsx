import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { coinbaseMono } from '@/app/layout'

interface WantPool {
  title: string;
  wish: string;
  categories: string[];
  popular: boolean;
}

interface WantPoolsSectionProps {
  wantPools: WantPool[];
}

const PopularWants: React.FC<WantPoolsSectionProps> = ({ wantPools }) => {
  const popularWants = wantPools.filter(pool => pool.popular);

  return (
    <section className={coinbaseMono.variable}>
      <h3 className="text-3xl font-bold mb-8">Popular Want Pools</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularWants.map((pool, index) => (
          <Card key={index} className="bg-black bg-opacity-70 border-none rounded-none">
            <CardContent className="p-6">
              <h4 className="text-xl font-semibold mb-2 text-[#2151F5]">{pool.title}</h4>
              <p className="text-gray-300 mb-4">{pool.wish}</p>
              <div className="flex flex-wrap gap-2">
                {pool.categories.map((cat) => (
                  <span key={cat} className="text-xs bg-[#2151F5] px-2 py-1 rounded-none">
                    {cat}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PopularWants;
