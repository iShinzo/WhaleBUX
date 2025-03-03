import { ethers } from 'ethers';
import { WALLET_CONFIG } from '../config/walletConfig';
import { getActiveRpcUrl } from '../config/rpcConfig';
import { switchToNetwork } from '../utils/wallet/networkUtils';
import { getWalletErrorMessage } from '../utils/wallet/errors';

export class WalletService {
  async connect() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create Web3 provider
      const provider = new ethers.providers.Web3Provider(window.ethereum, {
        name: 'MintMe Chain',
        chainId: 74
      });
      
      // Get signer and address
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // Switch to MintMe network
      await switchToNetwork('mintme');
      
      return { address, provider };
    } catch (error) {
      const errorMessage = getWalletErrorMessage(error);
      throw new Error(errorMessage);
    }
  }

  async getTokenBalance(provider: ethers.providers.Web3Provider, address: string, network: string): Promise<string> {
    if (!provider) {
      throw new Error('Provider not initialized');
    }

    const abi = ['function balanceOf(address) view returns (uint256)'];
    
    try {
      const tokenContract = new ethers.Contract(
        WALLET_CONFIG.CONTRACTS[network].WBUX_TOKEN,
        abi,
        provider
      );

      const balance = await tokenContract.balanceOf(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Error fetching token balance:', error);
      
      // Try backup RPC
      try {
        const backupProvider = new ethers.providers.JsonRpcProvider(
          RPC_ENDPOINTS[network].backup
        );
        const tokenContract = new ethers.Contract(
          WALLET_CONFIG.CONTRACTS[network].WBUX_TOKEN,
          abi,
          backupProvider
        );
        const balance = await tokenContract.balanceOf(address);
        return ethers.utils.formatEther(balance);
      } catch (backupError) {
        console.error('Backup RPC also failed:', backupError);
        return '0';
      }
    }
  }
}