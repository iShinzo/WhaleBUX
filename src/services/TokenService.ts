import { ethers } from 'ethers'
import { WALLET_CONFIG } from '../config/walletConfig'

const ERC20_ABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)'
]

const ERC721_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function ownerOf(uint256 tokenId) view returns (address)'
]

export class TokenService {
  private provider: ethers.providers.Web3Provider | null = null
  
  constructor(provider: ethers.providers.Web3Provider | null) {
    this.provider = provider
  }

  async getTokenBalance(address: string, network: string): Promise<string> {
    if (!this.provider || !address) {
      return '0'
    }

    // Check if the network and token contract are valid
    if (!WALLET_CONFIG.CONTRACTS[network as keyof typeof WALLET_CONFIG.CONTRACTS]?.WBUX_TOKEN) {
      console.warn(`No token contract found for network: ${network}`)
      return '0'
    }

    try {
      // Ensure address is checksummed
      const checksummedAddress = ethers.utils.getAddress(address)
      const tokenAddress = WALLET_CONFIG.CONTRACTS[network as keyof typeof WALLET_CONFIG.CONTRACTS].WBUX_TOKEN
      
      // Verify the token address is valid
      if (!ethers.utils.isAddress(tokenAddress)) {
        console.warn(`Invalid token address for network ${network}: ${tokenAddress}`)
        return '0'
      }

      const contract = new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        this.provider
      )

      // Get the current chain ID to verify we're on the right network
      const networkInfo = await this.provider.getNetwork()
      const expectedChainId = parseInt(WALLET_CONFIG.NETWORKS[network as keyof typeof WALLET_CONFIG.NETWORKS].chainId, 16)
      
      if (networkInfo.chainId !== expectedChainId) {
        console.warn(`Network mismatch: Expected ${expectedChainId}, got ${networkInfo.chainId}`)
        return '0'
      }

      // Try to get balance with error handling
      try {
        const balance = await contract.balanceOf(checksummedAddress)
        const decimals = await contract.decimals()
        return ethers.utils.formatUnits(balance, decimals)
      } catch (balanceError) {
        console.error('Error fetching token balance:', balanceError)
        return '0'
      }
    } catch (error) {
      console.error('Error in getTokenBalance:', error)
      return '0'
    }
  }

  async getNFTs(address: string, nftContract: string) {
    if (!this.provider || !address || !nftContract) {
      return []
    }

    try {
      // Ensure addresses are checksummed
      const checksummedAddress = ethers.utils.getAddress(address)
      const checksummedContract = ethers.utils.getAddress(nftContract)

      const contract = new ethers.Contract(
        checksummedContract,
        ERC721_ABI,
        this.provider
      )

      const balance = await contract.balanceOf(checksummedAddress)
      const nfts = []

      for (let i = 0; i < balance.toNumber(); i++) {
        try {
          const tokenId = await contract.tokenOfOwnerByIndex(checksummedAddress, i)
          const uri = await contract.tokenURI(tokenId)
          
          try {
            // Fetch metadata
            const response = await fetch(uri)
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            const metadata = await response.json()

            nfts.push({
              id: `${checksummedContract}-${tokenId}`,
              contractAddress: checksummedContract,
              tokenId: tokenId.toString(),
              metadata
            })
          } catch (metadataError) {
            console.error('Error fetching NFT metadata:', metadataError)
          }
        } catch (tokenError) {
          console.error('Error fetching token details:', tokenError)
          continue
        }
      }

      return nfts
    } catch (error) {
      console.error('Error fetching NFTs:', error)
      return []
    }
  }

  async transferToken(
    tokenAddress: string,
    to: string,
    amount: string,
    decimals: number
  ) {
    if (!this.provider) throw new Error('Provider not initialized')

    try {
      // Ensure addresses are checksummed
      const checksummedToken = ethers.utils.getAddress(tokenAddress)
      const checksummedTo = ethers.utils.getAddress(to)

      const signer = this.provider.getSigner()
      const contract = new ethers.Contract(checksummedToken, ERC20_ABI, signer)
      
      const parsedAmount = ethers.utils.parseUnits(amount, decimals)
      const tx = await contract.transfer(checksummedTo, parsedAmount)
      return tx.wait()
    } catch (error) {
      console.error('Error transferring tokens:', error)
      throw error
    }
  }

  async approveToken(
    tokenAddress: string,
    spender: string,
    amount: string,
    decimals: number
  ) {
    if (!this.provider) throw new Error('Provider not initialized')

    try {
      // Ensure addresses are checksummed
      const checksummedToken = ethers.utils.getAddress(tokenAddress)
      const checksummedSpender = ethers.utils.getAddress(spender)

      const signer = this.provider.getSigner()
      const contract = new ethers.Contract(checksummedToken, ERC20_ABI, signer)
      
      const parsedAmount = ethers.utils.parseUnits(amount, decimals)
      const tx = await contract.approve(checksummedSpender, parsedAmount)
      return tx.wait()
    } catch (error) {
      console.error('Error approving tokens:', error)
      throw error
    }
  }
}