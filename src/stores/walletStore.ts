import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ethers } from 'ethers'

interface WalletState {
  // MetaMask connection
  address: string | null
  provider: ethers.providers.Web3Provider | null
  
  // Local wallet
  localWallet: ethers.Wallet | null
  localAddress: string | null
  encryptedWallet: string | null
  
  // Balances
  wbuxBalance: string
  busdBalance: string
  nfts: NFTItem[]
  
  // Actions
  connect: () => Promise<void>
  disconnect: () => void
  setAddress: (address: string | null) => void
  setProvider: (provider: ethers.providers.Web3Provider | null) => void
  createLocalWallet: (password: string) => Promise<void>
  loadLocalWallet: (password: string) => Promise<boolean>
  importWallet: (privateKey: string, password: string) => Promise<void>
  hasLocalWallet: () => boolean
}

interface NFTItem {
  id: string
  contractAddress: string
  tokenId: string
  metadata: {
    name: string
    image: string
    attributes: any[]
  }
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      address: null,
      provider: null,
      localWallet: null,
      localAddress: null,
      encryptedWallet: null,
      wbuxBalance: '0',
      busdBalance: '0',
      nfts: [],

      connect: async () => {
        if (typeof window.ethereum === 'undefined') {
          throw new Error('MetaMask is not installed')
        }

        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          await provider.send("eth_requestAccounts", [])
          const signer = provider.getSigner()
          const address = await signer.getAddress()
          
          set({ provider, address })

          // Set up listeners for account changes
          window.ethereum.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length === 0) {
              // User disconnected their wallet
              set({ address: null })
            } else {
              set({ address: accounts[0] })
            }
          })

          // Set up listeners for chain changes
          window.ethereum.on('chainChanged', () => {
            // Refresh provider on chain change
            const updatedProvider = new ethers.providers.Web3Provider(window.ethereum)
            set({ provider: updatedProvider })
          })
        } catch (error) {
          console.error('Connection error:', error)
          throw error
        }
      },

      disconnect: () => {
        // Remove event listeners if possible
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', () => {})
          window.ethereum.removeListener('chainChanged', () => {})
        }
        set({ address: null, provider: null })
      },

      setAddress: (address) => {
        set({ address })
      },

      setProvider: (provider) => {
        set({ provider })
      },

      createLocalWallet: async (password: string) => {
        // Create new random wallet
        const wallet = ethers.Wallet.createRandom()
        const encrypted = await wallet.encrypt(password)
        
        set({ 
          localWallet: wallet,
          localAddress: wallet.address,
          encryptedWallet: encrypted
        })
      },

      loadLocalWallet: async (password: string) => {
        const { encryptedWallet } = get()
        if (!encryptedWallet) return false

        try {
          const wallet = await ethers.Wallet.fromEncryptedJson(encryptedWallet, password)
          set({ 
            localWallet: wallet,
            localAddress: wallet.address
          })
          return true
        } catch {
          return false
        }
      },

      importWallet: async (privateKey: string, password: string) => {
        try {
          const wallet = new ethers.Wallet(privateKey)
          const encrypted = await wallet.encrypt(password)

          set({
            localWallet: wallet,
            localAddress: wallet.address,
            encryptedWallet: encrypted
          })
        } catch (error) {
          console.error('Failed to import wallet:', error)
          throw new Error('Invalid private key')
        }
      },

      hasLocalWallet: () => {
        return get().encryptedWallet !== null
      }
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({
        address: state.address,
        encryptedWallet: state.encryptedWallet,
        localAddress: state.localAddress
      })
    }
  )
)