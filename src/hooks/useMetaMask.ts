import { useState, useCallback } from 'react'
import { MINTME_CHAIN } from '../config/networks'

export function useMetaMask() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask')
      return false
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Request accounts
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found')
      }

      // Add MintMe chain
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [MINTME_CHAIN]
        })
      } catch (addError: any) {
        // Chain might already be added, try switching
        if (addError.code !== -32603) {
          throw addError
        }
      }

      // Switch to MintMe chain
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MINTME_CHAIN.chainId }]
      })

      return true
    } catch (err: any) {
      console.error('Connection error:', err)
      setError(err.message || 'Failed to connect')
      return false
    } finally {
      setIsConnecting(false)
    }
  }, [])

  return {
    connect,
    isConnecting,
    error
  }
}