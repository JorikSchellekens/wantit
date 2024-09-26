import React from 'react'
import { Button } from "@/components/ui/button"
import { coinbaseMono } from '@/app/layout'

export default function HeroSection() {
  return (
    <div className={`text-center mb-16 ${coinbaseMono.variable}`}>
      <h2 className="text-5xl font-bold mb-4 text-text">EVERYTHING YOU NEED TO</h2>
      <h2 className="text-5xl font-bold mb-8 text-text">CHANGE THE WORLD</h2>
      <Button size="lg" className="bg-primary hover:bg-accent text-text rounded-none">GET STARTED</Button>
    </div>
  )
}