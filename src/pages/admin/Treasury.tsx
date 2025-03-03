import { useState } from 'react'
import { useUserStore } from '../../stores/userStore'
import { useTreasuryStore, TreasuryTransaction } from '../../stores/treasuryStore'

export default function Treasury() {
  const { username } = useUserStore()
  const { totalDollars, transactions, withdrawDollars, isAdmin } = useTreasuryStore()
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [recipientId, setRecipientId] = useState('')

  if (!isAdmin(username)) {
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="text-center text-gray-400 py-8">
          Access denied. Admin only area.
        </div>
      </div>
    )
  }

  const handleWithdraw = () => {
    const amount = Number(withdrawAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    if (!recipientId) {
      alert('Please enter a recipient ID')
      return
    }

    if (withdrawDollars(amount, username)) {
      setWithdrawAmount('')
      setRecipientId('')
      alert('Withdrawal successful')
    } else {
      alert('Withdrawal failed. Insufficient funds or unauthorized.')
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Treasury Management</h1>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="text-center">
          <div className="text-gray-400">Total Treasury Balance</div>
          <div className="text-3xl font-bold text-green-500">
            ${totalDollars.toFixed(2)}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Withdrawal Amount
            </label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Recipient ID
            </label>
            <input
              type="text"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
              placeholder="Enter recipient ID"
            />
          </div>

          <button
            onClick={handleWithdraw}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-500"
          >
            Withdraw
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Transaction History</h2>
        <div className="space-y-4">
          {transactions.map((tx: TreasuryTransaction) => (
            <div key={tx.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`text-sm px-2 py-1 rounded ${
                    tx.type === 'WITHDRAWAL' ? 'bg-red-900 text-red-200' :
                    tx.type === 'SWAP' ? 'bg-blue-900 text-blue-200' :
                    'bg-green-900 text-green-200'
                  }`}>
                    {tx.type}
                  </span>
                  <p className="mt-2 text-white">
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} WBUX $
                  </p>
                  <p className="text-sm text-gray-400">{tx.description}</p>
                  <p className="text-sm text-gray-400">By: {tx.userId}</p>
                </div>
                <div className="text-sm text-gray-400">
                  {formatDate(tx.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}