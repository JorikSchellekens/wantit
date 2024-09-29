'use client'

import React, { useState } from 'react'
import NewWantPoolFAB from './CreateWantButton'
import CreateWantModal from './CreateWantModal'

const CreateWantButtonWrapper: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  return (
    <>
      <NewWantPoolFAB onClick={handleOpenModal} />
      {isModalOpen && <CreateWantModal onClose={handleCloseModal} />}
    </>
  )
}

export default CreateWantButtonWrapper