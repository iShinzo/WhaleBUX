import { useTokenBalance } from '../../hooks/useTokenBalance'

interface WalletBalanceProps {
  network: string
}

export default function WalletBalance({ network }: WalletBalanceProps) {
  const { balance, isLoading, error } = useTokenBalance(network)

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-1">Wallet $WBUX Balance</h3>
      <div className="text-xl font-bold text-white">
        {isLoading ? (
          <span className="text-gray-500">Loading...</span>
        ) : error ? (
          <span className="text-red-500 text-sm">{error}</span>
        ) : (
          `${Number(balance).toFixed(4)} WBUX`
        )}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Network: {network === 'mintme' ? 'MintMe' : 'BNB Chain'}
      </div>
    </div>
  )
}