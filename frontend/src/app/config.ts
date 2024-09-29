import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base, baseSepolia } from 'wagmi/chains'
import { coinbaseWallet, walletConnect } from 'wagmi/connectors'

export const config = getDefaultConfig({
  appName: 'Wantit',
  projectId: '52308ff0b356878b2c5a0aba645027ba',
  chains: [base, baseSepolia],
  ssr: true,
})
