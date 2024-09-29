"use client";

import React, { useCallback, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useConnectModal, useAccountModal } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect, useConnect } from "wagmi";

export default function NavBar() {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { isConnecting, isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();

  useEffect(() => {
    console.log("isConnected", isConnected);
    console.log("isConnecting", isConnecting);
    console.log("address", address);
  }, [isConnected, isConnecting, address]);

  const handleConnect = useCallback(() => {
    console.log("handleConnect called");
    if (openConnectModal) {
      openConnectModal();
    } else {
      console.log("openConnectModal is not available");
    }
  }, [openConnectModal]);

  const handleDisconnect = useCallback(() => {
    console.log("handleDisconnect called");
    disconnect();
  }, [disconnect]);

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
        <Button 
          variant="default" 
          className="bg-blue-600 hover:bg-blue-700 rounded-none"
          onClick={isConnected ? openAccountModal : handleConnect}
          disabled={isConnecting}
        >
          {isConnected 
            ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
            : isConnecting 
              ? 'Connecting...' 
              : 'Connect Wallet'
          }
        </Button>
        {isConnected && (
          <Button
            variant="ghost"
            className="rounded-none"
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        )}
      </div>
    </nav>
  )
}