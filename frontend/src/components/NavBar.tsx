import React from 'react'
import { Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { coinbaseMono } from '@/app/layout'

export default function NavBar() {
  return (
    <nav className={`relative flex items-center justify-between p-4 bg-black bg-opacity-80 ${coinbaseMono.variable} font-mono`}>
      <h1 className="text-2xl font-bold text-text">WantIt</h1>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" className="text-text hover:text-secondary">Home</Button>
        <Button variant="ghost" className="text-text hover:text-secondary">Get Started</Button>
        <Button variant="ghost" className="text-text hover:text-secondary">Docs</Button>
        <Button variant="ghost" className="text-text hover:text-secondary">Learn</Button>
        <div className="relative">
          <Input 
            type="search" 
            placeholder="Search..." 
            className="w-64 bg-background bg-opacity-80 text-text border-secondary pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary" />
        </div>
        <Button variant="default" className="bg-primary hover:bg-accent text-text">Connect</Button>
      </div>
    </nav>
  )
}