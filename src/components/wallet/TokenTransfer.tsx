import { useState } from 'react'
import { useWalletStore } from '../../stores/walletStore'
import { TokenService } from '../../services/TokenService'
import { WALLET_CONFIG } from '../../config/walletConfig'

export default function TokenTransfer() {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState('WBUX')
  const [isTransferring, setIsTransferring] = useState(false)
  
  const { provider, address } = useWalletStore()

  const handleTransfer = async () => {
    if (!provider || !address || !recipient || !amount) return

    setIsTransferring(true)
    try {
      const tokenService = new TokenService(provider)
      const tokenAddress = WALLET_CONFIG.CONTRACTS.bnb[selectedToken === 'WBUX' ? 'WBUX_TOKEN' : 'BUSDT']
      const decimals = WALLET_CONFIG.TOKENS[selectedToken].decimals

      await tokenService.transferToken(
        tokenAddress,
        recipient,
        amount,
        decimals
      )

      setRecipient('')
      setAmount('')
      alert('Transfer successful!')
    } catch (error) {
      console.error('Transfer failed:', error)
      alert('Transfer failed. Please try again.')
    } finally {
      setIsTransferring(false)
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Transfer Tokens</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Token
          </label>
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
          >
            <option value="WBUX">WBUX</option>
            <option value="BUSDT">BUSDT</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
            placeholder="Enter recipient address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
            placeholder={`Enter amount in ${selectedToken}`}
            min="0"
            step="0.000001"
          />
        </div>

        <button
          onClick={handleTransfer}
          disabled={!provider || !address || !recipient || !amount || isTransferring}
          className={`w-full py-3 rounded-lg font-semibold ${
            !provider || !address
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : isTransferring
              ? 'bg-blue-800 text-blue-200 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {!provider || !address 
            ? 'Connect Wallet First'
            : isTransferring
            ? 'Transferring...'
            : 'Transfer'
          }
        </button>
      </div>
    </div>
  )
}