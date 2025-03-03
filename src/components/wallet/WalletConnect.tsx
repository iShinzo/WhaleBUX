import { useState, useEffect } from 'react'
import { useWalletStore } from '../../stores/walletStore'
import { switchToNetwork } from '../../utils/wallet/networkUtils'
import { getWalletErrorMessage } from '../../utils/wallet/errors'

export default function WalletConnect() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { address, connect, disconnect } = useWalletStore()

  const handleConnect = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      await connect()
      // Default to MintMe network on connect
      await switchToNetwork('mintme')
    } catch (err) {
      setError(getWalletErrorMessage(err))
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Connect Wallet</h2>
        {address ? (
          <button
            onClick={disconnect}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:bg-gray-600"
          >
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-900/20 text-red-500 text-sm p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {address && (
        <div className="mb-4">
          <p className="text-sm text-gray-400">Connected Address:</p>
          <p className="text-white font-mono break-all">{address}</p>
        </div>
      )}
    </div>
  )
}