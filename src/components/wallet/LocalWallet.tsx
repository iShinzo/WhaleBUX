import { useState } from 'react'
import { useWalletStore } from '../../stores/walletStore'
import { TokenService } from '../../services/TokenService'
import { WALLET_CONFIG } from '../../config/walletConfig'

export default function LocalWallet() {
  const [password, setPassword] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const { 
    localWallet,
    localAddress,
    createLocalWallet,
    loadLocalWallet,
    importWallet,
    hasLocalWallet
  } = useWalletStore()

  const handleCreateWallet = async () => {
    if (!password) return
    await createLocalWallet(password)
    setPassword('')
    setShowCreate(false)
  }

  const handleImportWallet = async () => {
    if (!password || !privateKey) return
    await importWallet(privateKey, password)
    setPassword('')
    setPrivateKey('')
    setShowCreate(false)
  }

  const handleLoadWallet = async () => {
    if (!password) return
    const success = await loadLocalWallet(password)
    if (success) {
      setPassword('')
    } else {
      alert('Invalid password')
    }
  }

  if (!hasLocalWallet()) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Local Wallet</h2>
        
        {!showCreate ? (
          <div className="space-y-4">
            <button
              onClick={() => setShowCreate(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-500"
            >
              Create or Import Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                placeholder="Enter wallet password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Private Key (Optional)
              </label>
              <input
                type="text"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                placeholder="Enter private key to import"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCreateWallet}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-500"
              >
                Create New
              </button>
              <button
                onClick={handleImportWallet}
                disabled={!privateKey}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-500 disabled:bg-gray-600"
              >
                Import
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (!localWallet) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Unlock Wallet</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
              placeholder="Enter wallet password"
            />
          </div>

          <button
            onClick={handleLoadWallet}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-500"
          >
            Unlock
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Local Wallet</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Wallet Address
          </label>
          <div className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white font-mono text-sm break-all">
            {localAddress}
          </div>
        </div>
      </div>
    </div>
  )
}