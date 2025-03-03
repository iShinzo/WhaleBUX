export const RPC_ENDPOINTS = {
  mintme: {
    primary: 'https://node1.mintme.com',
    backup: ['https://node.1000x.ch']
  },
  bnb: {
    primary: 'https://bsc-dataseed1.binance.org',
    backup: ['https://bsc-dataseed2.binance.org', 'https://bsc-dataseed3.binance.org']
  }
} as const;

export function getActiveRpcUrl(network: string): string {
  const endpoints = RPC_ENDPOINTS[network as keyof typeof RPC_ENDPOINTS];
  if (!endpoints) return '';
  
  // For now return primary, can add fallback logic later
  return endpoints.primary;
}