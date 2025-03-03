import { useEffect, useState } from 'react'
import { useWalletStore } from '../../stores/walletStore'
import { TokenService } from '../../services/TokenService'
import { WALLET_CONFIG } from '../../config/walletConfig'

export default function NFTGallery() {
  const { provider, address } = useWalletStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadNFTs = async () => {
      if (!provider || !address || !WALLET_CONFIG.CONTRACTS.bnb.NFT) return
      
      setIsLoading(true)
      setError(null)
      try {
        const tokenService = new TokenService(provider)
        await tokenService.getNFTs(address, WALLET_CONFIG.CONTRACTS.bnb.NFT)
      } catch (error) {
        console.error('Failed to load NFTs:', error)
        setError('Failed to load NFTs. Please make sure you have the correct contract address configured.')
      } finally {
        setIsLoading(false)
      }
    }

    loadNFTs()
  }, [provider, address])

  if (!provider || !address) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">NFT Gallery</h2>
        <p className="text-gray-400 text-center">
          Connect your wallet to view NFTs
        </p>
      </div>
    )
  }

  if (!WALLET_CONFIG.CONTRACTS.bnb.NFT) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">NFT Gallery</h2>
        <p className="text-gray-400 text-center">
          NFT contract address not configured
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">NFT Gallery</h2>
        <p className="text-gray-400 text-center">Loading NFTs...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">NFT Gallery</h2>
        <p className="text-red-400 text-center">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4">NFT Gallery</h2>
      <p className="text-gray-400 text-center">No NFTs found</p>
    </div>
  )
}