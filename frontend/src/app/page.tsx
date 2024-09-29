'use client'
import React from 'react'
import NavBar from '@/components/NavBar'
import HeroSection from '@/components/HeroSection'
import PopularWants from '@/components/PopularWants'
import WantsGrid, { WantPool } from '@/components/WantsGrid'
import CreateWantButtonWrapper from '@/components/CreateWantButtonWrapper'

export default function ProductPage() {
  const wantPools: Array<WantPool> = [
    {
      title: "New Laptop for Students",
      wish: "Provide laptops to underprivileged students",
      categories: ["Education", "Technology"],
      popular: true,
      expiryTimestamp: 172800000,
      supportedTokens: ["ETH", "USDT", "USDC"],
      status: "PENDING",
      contractAddress: "0x0",
    },
    {
      title: "Clean Water Initiative",
      wish: "Provide clean water to rural communities",
      categories: ["Health", "Environment"],
      popular: true,
      expiryTimestamp: 172800000,
      supportedTokens: ["ETH", "USDT", "USDC"],
      status: "PENDING",
      contractAddress: "0x0",
    },
    {
      title: "Coding Bootcamp Scholarships",
      wish: "Fund coding education for underrepresented groups",
      categories: ["Education", "Technology"],
      popular: true,
      expiryTimestamp: 172800000,
      supportedTokens: ["ETH", "USDT", "USDC"],
      status: "PENDING",
      contractAddress: "0x0",
    },
    {
      title: "Coding Bootcamp Scholarships2",
      wish: "Fund coding education for underrepresented groups",
      categories: ["Education", "Technology"],
      popular: false,
      expiryTimestamp: 172800000,
      supportedTokens: ["ETH", "USDT", "USDC"],
      status: "PENDING",
      contractAddress: "0x0",
    },
    {
      title: "Coding Bootcamp Scholarships3",
      wish: "Fund coding education for underrepresented groups",
      categories: ["Education", "Technology"],
      popular: false,
      expiryTimestamp: 172800000,
      supportedTokens: ["ETH", "USDT", "USDC"],
      status: "PENDING",
      contractAddress: "0x0",
    },
    {
      title: "Coding Bootcamp Scholarships4",
      wish: "Fund coding education for underrepresented groups",
      categories: ["Education", "Technology"],
      popular: false,
      expiryTimestamp: 172800000,
      supportedTokens: ["ETH", "USDT", "USDC"],
      status: "PENDING",
      contractAddress: "0x0",
    }
  ]
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
        <PopularWants wantPools={wantPools} />
        <WantsGrid wantPools={wantPools} />
      </main>
      <CreateWantButtonWrapper />
    </div>
  )
}
