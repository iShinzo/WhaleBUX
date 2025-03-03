export const WALLET_ERRORS = {
  USER_REJECTED: 4001,
  CHAIN_NOT_ADDED: 4902,
  UNAUTHORIZED: -32002,
  NETWORK_ERROR: -32603,
  CHAIN_DISCONNECTED: 4901
} as const;

export function getWalletErrorMessage(error: any): string {
  if (!error) return 'An unknown error occurred';
  
  // Handle user rejection specifically
  if (error.code === WALLET_ERRORS.USER_REJECTED) {
    return 'Request was cancelled. Please try again when ready.';
  }
  
  switch (error.code) {
    case WALLET_ERRORS.CHAIN_NOT_ADDED:
      return 'Network not found. Please add the network to MetaMask.';
    case WALLET_ERRORS.UNAUTHORIZED:
      return 'MetaMask is locked. Please unlock your wallet.';
    case WALLET_ERRORS.NETWORK_ERROR:
      return 'Network error. Please check your connection.';
    case WALLET_ERRORS.CHAIN_DISCONNECTED:
      return 'Network disconnected. Please try again.';
    default:
      return error.message || 'Failed to switch network.';
  }
}