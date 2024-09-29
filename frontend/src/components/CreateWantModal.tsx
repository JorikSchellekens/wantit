'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ethers } from 'ethers'

interface CreateWantModalProps {
  onClose: () => void
}

interface Recipient {
  address: string
  percentage: number
}

const CreateWantModal: React.FC<CreateWantModalProps> = ({ onClose }) => {
  const [title, setTitle] = useState('')
  const [wish, setWish] = useState('')
  const [successCriteria, setSuccessCriteria] = useState('')
  const [recipients, setRecipients] = useState<Recipient[]>([{ address: '', percentage: 0 }])
  const [oracle, setOracle] = useState('')
  const [feeAddress, setFeeAddress] = useState('')
  const [collectFee, setCollectFee] = useState(false)
  const [categories, setCategories] = useState<string[]>([''])
  const [uri, setUri] = useState('')
  const [initialSupportedTokens, setInitialSupportedTokens] = useState<string[]>([''])
  const [expiryTimestamp, setExpiryTimestamp] = useState('')

  const handleAddRecipient = () => {
    setRecipients([...recipients, { address: '', percentage: 0 }])
  }

  const handleRemoveRecipient = (index: number) => {
    const newRecipients = recipients.filter((_, i) => i !== index)
    setRecipients(newRecipients)
  }

  const handleRecipientChange = (index: number, field: 'address' | 'percentage', value: string) => {
    const newRecipients = [...recipients]
    if (field === 'address') {
      newRecipients[index].address = value
    } else {
      newRecipients[index].percentage = parseInt(value) || 0
    }
    setRecipients(newRecipients)
  }

  const handleAddCategory = () => {
    setCategories([...categories, ''])
  }

  const handleRemoveCategory = (index: number) => {
    const newCategories = categories.filter((_, i) => i !== index)
    setCategories(newCategories)
  }

  const handleCategoryChange = (index: number, value: string) => {
    const newCategories = [...categories]
    newCategories[index] = value
    setCategories(newCategories)
  }

  const handleAddToken = () => {
    setInitialSupportedTokens([...initialSupportedTokens, ''])
  }

  const handleRemoveToken = (index: number) => {
    const newTokens = initialSupportedTokens.filter((_, i) => i !== index)
    setInitialSupportedTokens(newTokens)
  }

  const handleTokenChange = (index: number, value: string) => {
    const newTokens = [...initialSupportedTokens]
    newTokens[index] = value
    setInitialSupportedTokens(newTokens)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement the logic to create a new Want using the WantFactory contract
    console.log({
      title,
      wish,
      successCriteria,
      recipients,
      oracle,
      feeAddress,
      collectFee,
      categories,
      uri,
      initialSupportedTokens,
      expiryTimestamp
    })
    onClose()
  }

  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-[#020817] border border-primary p-6 max-w-2xl w-full text-white font-coinbase-mono shadow-xl max-h-[90vh] flex flex-col"
      >
        <h2 className="text-2xl font-bold mb-4 text-primary">Create New Want</h2>
        <div className="overflow-y-auto flex-grow pr-2">
          <form id="createWantForm" onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-ash-gray">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full bg-gray-800 bg-opacity-80 text-white border-gray-700 focus:border-primary focus:ring-primary"
                required
              />
            </div>

            {/* Wish */}
            <div>
              <label htmlFor="wish" className="block text-sm font-medium text-ash-gray">Wish</label>
              <textarea
                id="wish"
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                className="mt-1 block w-full bg-gray-800 bg-opacity-80 text-white border-gray-700 focus:border-primary focus:ring-primary"
                required
              />
            </div>

            {/* Success Criteria */}
            <div>
              <label htmlFor="successCriteria" className="block text-sm font-medium text-ash-gray">Success Criteria</label>
              <textarea
                id="successCriteria"
                value={successCriteria}
                onChange={(e) => setSuccessCriteria(e.target.value)}
                className="mt-1 block w-full bg-gray-800 bg-opacity-80 text-white border-gray-700 focus:border-primary focus:ring-primary"
                required
              />
            </div>

            {/* Recipients */}
            <div>
              <label className="block text-sm font-medium text-ash-gray">Recipients</label>
              {recipients.map((recipient, index) => (
                <div key={index} className="flex space-x-2 mt-2">
                  <input
                    type="text"
                    value={recipient.address}
                    onChange={(e) => handleRecipientChange(index, 'address', e.target.value)}
                    placeholder="Address"
                    className="flex-grow bg-gray-800 bg-opacity-80 text-white border-gray-700 focus:border-primary focus:ring-primary"
                  />
                  <input
                    type="number"
                    value={recipient.percentage}
                    onChange={(e) => handleRecipientChange(index, 'percentage', e.target.value)}
                    placeholder="Percentage"
                    className="w-24 bg-gray-800 bg-opacity-80 text-white border-gray-700 focus:border-primary focus:ring-primary"
                  />
                  <button type="button" onClick={() => handleRemoveRecipient(index)} className="text-red-500">Remove</button>
                </div>
              ))}
              <button type="button" onClick={handleAddRecipient} className="mt-2 text-primary">Add Recipient</button>
            </div>

            {/* Oracle */}
            <div>
              <label htmlFor="oracle" className="block text-sm font-medium text-ash-gray">Oracle Address</label>
              <input
                type="text"
                id="oracle"
                value={oracle}
                onChange={(e) => setOracle(e.target.value)}
                className="mt-1 block w-full bg-gray-800 bg-opacity-80 text-white border-gray-700 focus:border-primary focus:ring-primary"
                required
              />
            </div>

            {/* Fee Address */}
            <div>
              <label htmlFor="feeAddress" className="block text-sm font-medium text-ash-gray">Fee Address</label>
              <input
                type="text"
                id="feeAddress"
                value={feeAddress}
                onChange={(e) => setFeeAddress(e.target.value)}
                className="mt-1 block w-full bg-gray-800 bg-opacity-80 text-white border-gray-700 focus:border-primary focus:ring-primary"
                required
              />
            </div>

            {/* Collect Fee */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={collectFee}
                  onChange={(e) => setCollectFee(e.target.checked)}
                  className="bg-gray-800 bg-opacity-80 text-primary border-gray-700 focus:ring-primary"
                />
                <span className="ml-2 text-sm text-ash-gray">Collect Fee</span>
              </label>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-ash-gray">Categories</label>
              {categories.map((category, index) => (
                <div key={index} className="flex space-x-2 mt-2">
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => handleCategoryChange(index, e.target.value)}
                    className="flex-grow bg-gray-800 bg-opacity-80 text-white border-gray-700 focus:border-primary focus:ring-primary"
                  />
                  <button type="button" onClick={() => handleRemoveCategory(index)} className="text-red-500">Remove</button>
                </div>
              ))}
              <button type="button" onClick={handleAddCategory} className="mt-2 text-primary">Add Category</button>
            </div>

            {/* URI */}
            <div>
              <label htmlFor="uri" className="block text-sm font-medium text-ash-gray">URI</label>
              <input
                type="text"
                id="uri"
                value={uri}
                onChange={(e) => setUri(e.target.value)}
                className="mt-1 block w-full bg-gray-800 bg-opacity-80 text-white border-gray-700 focus:border-primary focus:ring-primary"
                required
              />
            </div>

            {/* Initial Supported Tokens */}
            <div>
              <label className="block text-sm font-medium text-ash-gray">Initial Supported Tokens</label>
              {initialSupportedTokens.map((token, index) => (
                <div key={index} className="flex space-x-2 mt-2">
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => handleTokenChange(index, e.target.value)}
                    className="flex-grow bg-gray-800 bg-opacity-80 text-white border-gray-700 focus:border-primary focus:ring-primary"
                  />
                  <button type="button" onClick={() => handleRemoveToken(index)} className="text-red-500">Remove</button>
                </div>
              ))}
              <button type="button" onClick={handleAddToken} className="mt-2 text-primary">Add Token</button>
            </div>

            {/* Expiry Timestamp */}
            <div>
              <label htmlFor="expiryTimestamp" className="block text-sm font-medium text-ash-gray">Expiry Timestamp</label>
              <input
                type="datetime-local"
                id="expiryTimestamp"
                value={expiryTimestamp}
                onChange={(e) => setExpiryTimestamp(e.target.value)}
                className="mt-1 block w-full bg-gray-800 bg-opacity-80 text-white border-gray-700 focus:border-primary focus:ring-primary"
                required
              />
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 px-4 py-2 text-sm font-medium text-ash-gray bg-black border border-ash-gray hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="createWantForm"
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateWantModal