'use client'
import React from 'react'
import NavBar from '@/components/NavBar'
import HeroSection from '@/components/HeroSection'
import CreateWantButtonWrapper from '@/components/CreateWantButtonWrapper'
import dynamic from 'next/dynamic'

const WantsGrid = dynamic(() => import('@/components/WantsGrid'), { ssr: false })
const PopularWants = dynamic(() => import('@/components/PopularWants'), { ssr: false })

export default function ProductPage() {
  return (
    <div className={`min-h-screen bg-[#020817] text-white coinbase-mono font-mono`}>
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-primary opacity-40"
            style={{
              width: `${Math.random() * 30 + 10}%`,
              height: `${Math.random() * 30 + 10}%`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`,
              borderRadius: `${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}%`,
            }}
          />
        ))}
      </div>
      
      <NavBar />
      <main className="relative container mx-auto px-4 py-16">
        <HeroSection />
        <PopularWants />
        <WantsGrid />
      </main>
      <CreateWantButtonWrapper />
    </div>
  )
}
