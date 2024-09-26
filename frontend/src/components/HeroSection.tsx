import React from 'react'
import { Button } from "@/components/ui/button"
import { coinbaseMono } from '@/app/layout'

export default function HeroSection() {
  return (
    <div className={`text-center mb-16 ${coinbaseMono.variable}`}>
      <h2 className="text-5xl font-bold mb-4">EVERYTHING YOU NEED TO</h2>
      <h2 className="text-5xl font-bold mb-8">CHANGE THE WORLD</h2>
      {/* todo: italizec roman styles this */   }
      <Button size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-none">GET STARTED</Button>
    </div>
  )
}