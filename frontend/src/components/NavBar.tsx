import React from 'react'
import { Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NavBar() {
  return (
    <nav className={`relative flex items-center justify-between p-4 bg-black bg-opacity-80 font-coinbase-mono font-mono`}>
      <h1 className="text-2xl font-bold">WantIt</h1>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" className="rounded-none">Learn</Button>
        <div className="relative">
          <Input 
            type="search" 
            placeholder="Search..." 
            className="w-64 bg-gray-800 bg-opacity-80 text-white border-gray-700 pr-10 rounded-none"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700 rounded-none">Connect</Button>
      </div>
    </nav>
  )
}