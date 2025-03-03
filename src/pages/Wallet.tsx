import { useState, useEffect } from 'react'
import { useUserStore } from '../stores/userStore'
import { useWalletStore } from '../stores/walletStore'
import UserStats from '../components/mining/UserStats'
import WalletConnect from '../components/wallet/WalletConnect'
import LocalWallet from '../components/wallet/LocalWallet'
import TokenTransfer from '../components/wallet/TokenTransfer'
import NFTGallery from '../components/wallet/NFTGallery'
import NetworkSelector from '../components/wallet/NetworkSelector'
import WalletBalance from '../components/wallet/WalletBalance'
import SwapSection from '../components/wallet/SwapSection'
import TransactionHistory from '../components/wallet/TransactionHistory'
import { switchToNetwork } from '../utils/wallet/networkUtils'

export default function Wallet() {
  const { wbuxBalance, wbuxDollars, username } = useUserStore()
  const { address } = useWalletStore()
  const [selectedNetwork, setSelectedNetwork] = useState('bnb')
  const [switchError, setSwitchError] = useState<string | null>(null)
  const [isChangingNetwork, setIsChangingNetwork] = useState(false)

  const handleNetworkChange = async (network: string) => {
    if (!address) {
      setSwitchError('Please connect your wallet first')
      return
    }

    if (isChangingNetwork) {
      return; // Prevent multiple simultaneous network changes
    }

    try {
      setIsChangingNetwork(true)
      setSwitchError(null)
      await switchToNetwork(network)
      setSelectedNetwork(network)
    } catch (error) {
      console.error('Network switch error:', error)
      setSwitchError(error instanceof Error ? error.message : 'Failed to switch network')
    } finally {
      setIsChangingNetwork(false)
    }
  }

  // Clear error after 5 seconds
  useEffect(() => {
    if (switchError) {
      const timer = setTimeout(() => setSwitchError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [switchError])

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <UserStats 
        wbuxBalance={wbuxBalance}
        wbuxDollars={wbuxDollars}
        username={username}
      />

      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-white mb-6">Wallet</h1>
        
        <WalletConnect />
        
        {switchError && (
          <div className="bg-red-900/20 text-red-500 text-sm p-3 rounded-lg">
            {switchError}
          </div>
        )}
        
        <NetworkSelector 
          selectedNetwork={selectedNetwork}
          onNetworkChange={handleNetworkChange}
          isChangingNetwork={isChangingNetwork}
        />
        <LocalWallet />
        <WalletBalance network={selectedNetwork} />
        <TokenTransfer />
        <SwapSection />
        <NFTGallery />
        <TransactionHistory network={selectedNetwork} />
      </div>
    </div>
  )
}