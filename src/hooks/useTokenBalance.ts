import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useWalletStore } from '../stores/walletStore'
import { TokenService } from '../services/TokenService'
import { WALLET_CONFIG } from '../config/walletConfig'

export function useTokenBalance(network: string) {
  const { address, provider } = useWalletStore()
  const [balance, setBalance] = useState('0')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address || !provider) {
        setBalance('0')
        return
      }

      setIsLoading(true)
      setError(null)
      
      try {
        // Verify we're on the correct network
        const currentNetwork = await provider.getNetwork()
        const expectedChainId = parseInt(WALLET_CONFIG.NETWORKS[network as keyof typeof WALLET_CONFIG.NETWORKS]?.chainId || '0x0', 16)
        
        if (currentNetwork.chainId !== expectedChainId) {
          setError(`Please switch to ${network === 'mintme' ? 'MintMe' : 'BNB Chain'} in your wallet`)
          setIsLoading(false)
          return
        }

        const tokenService = new TokenService(provider)
        const newBalance = await tokenService.getTokenBalance(address, network)
        setBalance(newBalance)
      } catch (error) {
        console.error('Failed to fetch balance:', error)
        setError('Failed to load balance. Please check your connection.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBalance()
    
    // Set up event listener for token transfers if on the correct network
    if (provider && address && WALLET_CONFIG.CONTRACTS[network as keyof typeof WALLET_CONFIG.CONTRACTS]) {
      try {
        const tokenAddress = WALLET_CONFIG.CONTRACTS[network as keyof typeof WALLET_CONFIG.CONTRACTS].WBUX_TOKEN
        if (!tokenAddress) return
        
        const filter = {
          address: tokenAddress,
          topics: [
            ethers.utils.id("Transfer(address,address,uint256)"),
            null,
            ethers.utils.hexZeroPad(address, 32)
          ]
        }

        provider.on(filter, fetchBalance)
        return () => {
          provider.off(filter, fetchBalance)
        }
      } catch (err) {
        console.error('Error setting up event listener:', err)
      }
    }
  }, [address, provider, network])

  return { balance, isLoading, error }
}