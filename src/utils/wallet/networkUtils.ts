import { WALLET_CONFIG } from '../../config/walletConfig';
import { ethers } from 'ethers';
import { getWalletErrorMessage } from './errors';

export async function switchToNetwork(networkName: string): Promise<void> {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const network = WALLET_CONFIG.NETWORKS[networkName as keyof typeof WALLET_CONFIG.NETWORKS];
  if (!network) {
    throw new Error(`Invalid network: ${networkName}`);
  }

  try {
    // First try to switch to the network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: network.chainId }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: network.chainId,
            chainName: network.chainName,
            nativeCurrency: network.nativeCurrency,
            rpcUrls: network.rpcUrls,
            blockExplorerUrls: network.blockExplorerUrls
          }],
        });
      } catch (addError: any) {
        // User rejected the request to add the network
        if (addError.code === 4001) {
          throw new Error('Network addition cancelled. Please approve the network to continue.');
        } else {
          console.error('Failed to add network:', addError);
          throw new Error(getWalletErrorMessage(addError));
        }
      }
    } else if (switchError.code === 4001) {
      // User rejected the request to switch networks
      throw new Error('Network switch cancelled. Please approve the network switch to continue.');
    } else {
      console.error('Failed to switch network:', switchError);
      throw new Error(getWalletErrorMessage(switchError));
    }
  }
}