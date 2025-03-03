export const MINTME_CHAIN = {
  chainId: '0x4A', // 74 in hex
  chainName: 'MintMe',
  nativeCurrency: {
    name: 'MintMe',
    symbol: 'MINTME',
    decimals: 18
  },
  rpcUrls: [
    'https://node1.mintme.com'
  ],
  blockExplorerUrls: ['https://www.mintme.com/explorer']
}

export const BNB_TESTNET = {
  chainId: '0x61', // 97 in hex
  chainName: 'BNB Chain Testnet',
  nativeCurrency: {
    name: 'tBNB',
    symbol: 'tBNB',
    decimals: 18
  },
  rpcUrls: [
    'https://data-seed-prebsc-1-s1.binance.org:8545',
    'https://data-seed-prebsc-2-s1.binance.org:8545',
    'https://data-seed-prebsc-1-s2.binance.org:8545'
  ],
  blockExplorerUrls: ['https://testnet.bscscan.com']
}

export const BNB_MAINNET = {
  chainId: '0x38', // 56 in hex
  chainName: 'BNB Chain',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18
  },
  rpcUrls: [
    'https://bsc-dataseed1.binance.org',
    'https://bsc-dataseed2.binance.org',
    'https://bsc-dataseed3.binance.org',
    'https://bsc-dataseed4.binance.org'
  ],
  blockExplorerUrls: ['https://bscscan.com']
}