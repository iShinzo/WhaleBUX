import { useEffect, useState } from 'react'
import { useWalletStore } from '../../stores/walletStore'
import { WALLET_CONFIG } from '../../config/walletConfig'

interface Transaction {
  id: string
  type: 'SWAP' | 'TRANSFER'
  amount: number
  token: 'WBUX_DOLLARS' | 'WBUX'
  timestamp: number
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  hash: string
}

interface TransactionHistoryProps {
  network: string
}

export default function TransactionHistory({ network }: TransactionHistoryProps) {
  const { address } = useWalletStore()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address) return
      
      setIsLoading(true)
      try {
        // In a real app, you would fetch transactions from an API or blockchain explorer
        // For now, we'll just simulate an empty list
        setTransactions([])
      } catch (error) {
        console.error('Error fetching transactions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [address, network])

  const getExplorerUrl = (hash: string) => {
    if (network === 'mintme') {
      return `https://www.mintme.com/explorer/tx/${hash}`
    } else {
      return `https://bscscan.com/tx/${hash}`
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Transaction History</h2>
        <p className="text-center text-gray-400 py-4">
          Loading transactions...
        </p>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Transaction History</h2>
        <p className="text-center text-gray-400 py-4">
          No transactions found on {network === 'mintme' ? 'MintMe Chain' : 'BNB Chain'}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Transaction History</h2>
      
      <div className="space-y-4">
        {transactions.map(tx => (
          <div
            key={tx.id}
            className="bg-gray-700 rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className={`text-sm px-2 py-1 rounded ${
                  tx.type === 'SWAP' ? 'bg-blue-900 text-blue-200' : 'bg-green-900 text-green-200'
                }`}>
                  {tx.type}
                </span>
                <p className="mt-2 text-white">
                  {tx.amount} {tx.token.replace('_', ' ')}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(tx.timestamp).toLocaleString()}
                </p>
              </div>
              <span className={`text-sm px-2 py-1 rounded ${
                tx.status === 'COMPLETED'
                  ? 'bg-green-900 text-green-200'
                  : tx.status === 'PENDING'
                  ? 'bg-yellow-900 text-yellow-200'
                  : 'bg-red-900 text-red-200'
              }`}>
                {tx.status}
              </span>
            </div>
            <div className="mt-2">
              <a
                href={getExplorerUrl(tx.hash)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                View on Explorer ↗
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}