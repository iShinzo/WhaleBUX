import { useWalletStore } from '../../stores/walletStore'

interface NetworkSelectorProps {
  selectedNetwork: string
  onNetworkChange: (network: string) => void
  isChangingNetwork?: boolean
}

export default function NetworkSelector({ 
  selectedNetwork, 
  onNetworkChange,
  isChangingNetwork = false
}: NetworkSelectorProps) {
  const { address } = useWalletStore()
  
  const networks = [
    { id: 'mintme', name: 'MintMe', icon: '🔷' },
    { id: 'bnb', name: 'Binance Smart Chain', icon: '🟡' }
  ]

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Select Network</h2>
      
      <div className="grid grid-cols-1 gap-2">
        {networks.map(network => (
          <button
            key={network.id}
            onClick={() => onNetworkChange(network.id)}
            disabled={!address || isChangingNetwork || selectedNetwork === network.id}
            className={`flex items-center p-4 rounded-lg ${
              !address || isChangingNetwork
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : selectedNetwork === network.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <span className="mr-2">{network.icon}</span>
            <span>{network.name}</span>
            {isChangingNetwork && selectedNetwork !== network.id && (
              <span className="ml-2 text-sm text-gray-400">Switching...</span>
            )}
          </button>
        ))}
      </div>
      
      {!address && (
        <p className="text-sm text-gray-400 mt-2">
          Connect your wallet to switch networks
        </p>
      )}
    </div>
  )
}