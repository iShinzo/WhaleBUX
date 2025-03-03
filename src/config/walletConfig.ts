export const WALLET_CONFIG = {
  // Network configurations
  NETWORKS: {
    mintme: {
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
    },
    bnb: {
      chainId: '0x38', // 56 (BSC Mainnet)
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
  },

  // Token Contract Addresses
  CONTRACTS: {
    mintme: {
      WBUX_TOKEN: '0x9f04568f8da1f7ab663f237cd672e408fba4763e',
      TREASURY_WALLET: '0x4dc2A75e0A33869D0c4A6d9Fa06fC9B4067b2786',
      REWARDS_WALLET: '0x846f94954fF456c9b6B939F4004dbc7cA1B0Db16'
    },
    bnb: {
      WBUX_TOKEN: '0xbbb60c7dacb73d3a4d636a7574d83d4e8de56076',
      TREASURY_WALLET: '0x4dc2A75e0A33869D0c4A6d9Fa06fC9B4067b2786',
      REWARDS_WALLET: '0x846f94954fF456c9b6B939F4004dbc7cA1B0Db16',
      BUSDT: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
    }
  },

  // Token Details
  TOKENS: {
    WBUX: {
      symbol: 'WBUX',
      decimals: 18,
      name: 'WhaleBux',
      logo: '/images/wbux-logo.png'
    },
    BUSDT: {
      symbol: 'BUSDT',
      decimals: 18,
      name: 'BUSDT',
      logo: '/images/busdt-logo.png'
    },
    MINTME: {
      symbol: 'MINTME',
      decimals: 18,
      name: 'MintMe',
      logo: '/images/mintme-logo.png'
    }
  },

  // Default Transaction Settings
  TRANSACTION_SETTINGS: {
    gasLimit: 200000,
    confirmations: 1
  }
} as const;