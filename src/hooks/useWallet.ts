import { useState, useCallback } from 'react';
import { WalletService } from '../services/walletService';
import { useWalletStore } from '../stores/walletStore';
import { ethers } from 'ethers';
import { BNB_TESTNET } from '../config/networks';

const walletService = new WalletService();

export function useWallet() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { setAddress, setProvider, disconnect } = useWalletStore();

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      // First check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      // Request accounts
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Get current chain ID
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      });

      // If not on BSC testnet, try to switch
      if (chainId !== BNB_TESTNET.chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BNB_TESTNET.chainId }]
          });
        } catch (switchError: any) {
          // If chain hasn't been added, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: BNB_TESTNET.chainId,
                chainName: BNB_TESTNET.chainName,
                nativeCurrency: BNB_TESTNET.nativeCurrency,
                rpcUrls: BNB_TESTNET.rpcUrls,
                blockExplorerUrls: BNB_TESTNET.blockExplorerUrls
              }]
            });
          } else {
            throw switchError;
          }
        }
      }

      // Create provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      setAddress(accounts[0]);
      setProvider(provider);

      // Setup account change listener
      window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
        if (newAccounts.length === 0) {
          disconnect(); // User disconnected wallet
        } else {
          setAddress(newAccounts[0]);
        }
      });

      // Setup chain change listener
      window.ethereum.on('chainChanged', () => {
        window.location.reload(); // Refresh when chain changes
      });

      return accounts[0];
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [setAddress, setProvider, disconnect]);

  return {
    connect,
    isConnecting
  };
}