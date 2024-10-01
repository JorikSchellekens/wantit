'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WANT_ABI } from '@/constants/contractInfo';
import { useWriteContract } from 'wagmi';
import { parseEther, Address } from 'viem';
import { WantPool } from '@/app/contexts/wantsContext'
interface WantDetailsModalProps {
  contractAddress: Address
  isOpen: boolean;
  onClose: () => void;
  want: WantPool[Address];
}

const WantDetailsModal: React.FC<WantDetailsModalProps> = ({ contractAddress, isOpen, onClose, want }) => {
  const [contributionAmount, setContributionAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState(want.supportedTokens[0]);

  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const handleContribute = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation
    console.log("contribute called");
    try {
      writeContract({
        address: contractAddress,
        abi: WANT_ABI,
        functionName: 'contribute',
        args: [selectedToken, parseEther(contributionAmount || '0')],
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
              onChange={(e) => setSelectedToken(e.target.value as Address)}
              className="w-full p-2 mb-2 bg-background border border-accent text-text"
              onClick={e => e.stopPropagation()} // Stop propagation on select
            >
              {want.supportedTokens.map((token: Address) => (
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