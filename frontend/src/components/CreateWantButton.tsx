'use client'

import React from 'react'

interface NewWantPoolFABProps {
  onClick: () => void
}

const CreateWantButton: React.FC<NewWantPoolFABProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-primary hover:bg-primary/80 text-white p-4 shadow-lg transition-all duration-300 ease-in-out z-50"
      aria-label="Create new Want Pool"
    >
      <span className="text-2xl font-bold font-coinbase-mono">+</span>
    </button>
  )
}

export default CreateWantButton
