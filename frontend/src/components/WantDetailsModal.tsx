'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WantPool } from './WantsGrid';
import { WANT_ABI } from '@/constants/contractInfo';
import { useWriteContract } from 'wagmi';
import { parseEther } from 'viem';

interface WantDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  want: WantPool;
}

const WantDetailsModal: React.FC<WantDetailsModalProps> = ({ isOpen, onClose, want }) => {
  const [contributionAmount, setContributionAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState(want.supportedTokens[0]);

  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const handleContribute = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation
    console.log("contribute called");
    try {
    writeContract({
      address: '0x14E7f0920Be48adc30A94E6C6BAB5faA392470FB',
      abi: WANT_ABI,
          functionName: 'contribute',
          args: ['0x5dEaC602762362FE5f135FA5904351916053cF70', parseEther(contributionAmount || '0')],
    });
    } catch (error) {
      console.error('Contribution failed:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary">{want.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 font-coinbase-mono">
          <p className="mb-4 text-lg">{want.wish}</p>
          <p className="mb-2 text-sm" suppressHydrationWarning>
            <span className="text-secondary">Expiry:</span> {new Date(want.expiryTimestamp * 1000).toLocaleDateString()}
          </p>
          <p className="mb-2 text-sm">
            <span className="text-secondary">Status:</span> {want.status}
          </p>
          <p className="mb-4 text-sm">
            <span className="text-secondary">Supported Tokens:</span> {want.supportedTokens.join(', ')}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {want.categories.map((cat) => (
              <span key={cat} className="text-xs bg-accent text-background px-2 py-1 rounded-none">
                {cat}
              </span>
            ))}
          </div>
          
          {/* Contribution Form */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Contribute</h3>
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="w-full p-2 mb-2 bg-background border border-accent text-text"
              onClick={e => e.stopPropagation()} // Stop propagation on select
            >
              {want.supportedTokens.map((token) => (
                <option key={token} value={token}>{token}</option>
              ))}
            </select>
            <input
              type="number"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              placeholder="Amount"
              className="w-full p-2 mb-2 bg-background border border-accent text-text"
              onClick={e => e.stopPropagation()} // Stop propagation on input
            />
            <button
              onClick={handleContribute}
              disabled={isPending}
              className="w-full p-2 bg-primary text-background hover:bg-opacity-80"
            >
              {isPending ? 'Contributing...' : 'Contribute'}
            </button>
            {isSuccess && <p className="mt-2 text-green-500">Contribution successful!</p>}
            {error && <p className="mt-2 text-red-500">Error: {error.message}</p>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WantDetailsModal;