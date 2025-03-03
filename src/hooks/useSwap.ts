import { useState } from 'react'
import { TransactionService } from '../services/transactionService'
import { useUserStore } from '../stores/userStore'
import { useWalletStore } from '../stores/walletStore'

export function useSwap() {
  const [isSwapping, setIsSwapping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { wbuxDollars, addWbuxDollars } = useUserStore()
  const { address } = useWalletStore()

  const swap = async (amount: number) => {
    if (!address) {
      setError('Please connect your wallet first')
      return
    }

    if (amount > wbuxDollars) {
      setError('Insufficient WBUX Dollars balance')
      return
    }

    try {
      setIsSwapping(true)
      setError(null)

      const result = await TransactionService.createSwapTransaction(
        address,
        amount,
        address
      )

      if (result.success) {
        addWbuxDollars(-amount)
      }

      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Swap failed')
      throw err
    } finally {
      setIsSwapping(false)
    }
  }

  return {
    swap,
    isSwapping,
    error
  }
}