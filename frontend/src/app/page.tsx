import React from 'react'
import { coinbaseMono, coinbaseSans } from '@/app/layout'
import NavBar from '@/components/NavBar'
import HeroSection from '@/components/HeroSection'
import PopularWants from '@/components/PopularWants'
import WantsGrid from '@/components/WantsGrid'

export default function ProductPage() {
  const wantPools: Array<{title:string, wish:string, categories:string[], popular:boolean}> = [
    {
      title: "New Laptop for Students",
      wish: "Provide laptops to underprivileged students",
      categories: ["Education", "Technology"],
      popular: true,
    },
    {
      title: "Clean Water Initiative",
      wish: "Provide clean water to rural communities",
      categories: ["Health", "Environment"],
      popular: true,
    },
    {
      title: "Coding Bootcamp Scholarships",
      wish: "Fund coding education for underrepresented groups",
      categories: ["Education", "Technology"],
      popular: true,
    },
    {
      title: "Coding Bootcamp Scholarships2",
      wish: "Fund coding education for underrepresented groups",
      categories: ["Education", "Technology"],
      popular: false,
    },
    {
      title: "Coding Bootcamp Scholarships3",
      wish: "Fund coding education for underrepresented groups",
      categories: ["Education", "Technology"],
      popular: false,
    },
    {
      title: "Coding Bootcamp Scholarships4",
      wish: "Fund coding education for underrepresented groups",
      categories: ["Education", "Technology"],
      popular: false,
    }
  ]
  return (
    <div className={`min-h-screen bg-background text-text ${coinbaseMono.variable} ${coinbaseSans.variable}`}>
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
    </div>
  )
}
