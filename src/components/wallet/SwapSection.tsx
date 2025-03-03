import { useState } from 'react'
import { useWalletStore } from '../../stores/walletStore'
import { useUserStore } from '../../stores/userStore'

const MIN_SWAP_AMOUNT = 5000 // Minimum 5000 WBUX Dollars

export default function SwapSection() {
  const { address } = useWalletStore()
  const { wbuxDollars, wbuxBalance } = useUserStore()
  const [amount, setAmount] = useState('')
  const [isSwapping, setIsSwapping] = useState(false)
  const conversionRate = 10000 // 10,000 WhaleBux $Dollars = 1 $WBUX

  const calculatedWBUX = Number(amount) / conversionRate

  const handleSwap = async () => {
    if (!address) {
      alert('Please connect your wallet first')
      return
    }

    const amountToSwap = Number(amount)
    if (isNaN(amountToSwap) || amountToSwap <= 0) {
      alert('Please enter a valid amount')
      return
    }

    if (amountToSwap < MIN_SWAP_AMOUNT) {
      alert(`Minimum swap amount is ${MIN_SWAP_AMOUNT} WBUX Dollars`)
      return
    }

    if (amountToSwap > wbuxDollars) {
      alert('Insufficient WhaleBux $Dollars balance')
      return
    }

    setIsSwapping(true)
    try {
      // TODO: Implement actual swap logic with smart contract
      setAmount('')
      alert('Swap successful!')
    } catch (error) {
      alert('Swap failed. Please try again.')
    } finally {
      setIsSwapping(false)
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Swap</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            From: WhaleBux $Dollars
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
            placeholder={`Minimum ${MIN_SWAP_AMOUNT} WBUX Dollars`}
          />
          <p className="text-sm text-gray-400 mt-1">
            Available: ${wbuxDollars.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-center">
          <span className="text-2xl text-gray-400">↓</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            To: $WBUX
          </label>
          <div className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white">
            {calculatedWBUX.toFixed(4)}
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Balance: {wbuxBalance.toLocaleString()} $WBUX
          </p>
        </div>

        <div className="text-sm text-gray-400">
          Rate: 10,000 WhaleBux $Dollars = 1 $WBUX
        </div>

        <button
          onClick={handleSwap}
          disabled={!address || isSwapping || Number(amount) < MIN_SWAP_AMOUNT}
          className={`w-full py-3 rounded-lg font-semibold ${
            !address
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : isSwapping
              ? 'bg-green-800 text-green-200 cursor-not-allowed'
              : Number(amount) < MIN_SWAP_AMOUNT
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-500 text-white'
          }`}
        >
          {!address 
            ? 'Connect Wallet to Swap'
            : isSwapping
            ? 'Swapping...'
            : Number(amount) < MIN_SWAP_AMOUNT
            ? `Minimum ${MIN_SWAP_AMOUNT} WBUX Dollars`
            : 'Confirm Swap'
          }
        </button>
      </div>
    </div>
  )
}