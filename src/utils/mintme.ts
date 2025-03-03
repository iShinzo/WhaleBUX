import { MINTME_CHAIN } from '../config/networks'

export async function setupMintMeChain() {
  try {
    // First try switching to MintMe chain
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: MINTME_CHAIN.chainId }]
    })
  } catch (error: any) {
    // If chain is not added, add it
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [MINTME_CHAIN]
      })
    } else {
      throw error
    }
  }
}